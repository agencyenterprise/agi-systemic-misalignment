const assert = require("node:assert/strict");
const { before, after, test } = require("node:test");
const { load } = require("cheerio");
const server = require("./serve.cjs");
let origin;
before(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));

test("initial HTML contains the existing research, attribution, and methodology", async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  const $ = load(await response.text());
  assert.match($("main h1").text(), /Systemic Misalignment/);
  assert.match($("main").text(), /Cameron Berg/);
  assert.match($("main").text(), /Following Betley et al., 2025/);
  assert.match($("main").text(), /Statistical Analysis/);
  assert.equal($("link[rel=canonical]").attr("href"), "https://www.systemicmisalignment.com/");
  assert.ok($("script[src]").length > 0, "interactive application remains included");
});

test("missing pages and assets return real 404s with a recovery link", async () => {
  for (const pathname of [
    "/does-not-exist",
    "/llms-missing.txt",
    "/static/js/missing.js",
    "/analysis",
    "/api/not-real",
  ]) {
    const response = await fetch(origin + pathname);
    assert.equal(response.status, 404, pathname);
    assert.match(await response.text(), /Return to Systemic Misalignment/);
  }
});

test("discovery files are real files, not the SPA shell", async () => {
  for (const [pathname, type, text] of [
    ["/llms.txt", /text\/plain/, /research evidence/],
    ["/robots.txt", /text\/plain/, /Sitemap:/],
    ["/sitemap.xml", /xml/, /<loc>https:\/\/www.systemicmisalignment.com\/<\/loc>/],
  ]) {
    const response = await fetch(origin + pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), type);
    assert.match(await response.text(), text);
  }
});

test("shared-example query URLs still serve the interactive application", async () => {
  const response = await fetch(origin + "/?example=Z3JvdXA9dGVzdA==");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /static\/js\/main\./);
});

test("bundled assets, HEAD, and video range requests keep working", async () => {
  const $ = load(await (await fetch(origin)).text());
  for (const element of $("script[src],link[rel=stylesheet]").toArray()) {
    const response = await fetch(origin + ($(element).attr("src") || $(element).attr("href")));
    assert.equal(response.status, 200);
    assert.doesNotMatch(response.headers.get("content-type"), /text\/html/);
  }
  const head = await fetch(origin, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const video = await fetch(origin + "/shoggoth_mask_video.mp4", {
    headers: { Range: "bytes=0-99" },
  });
  assert.equal(video.status, 206);
  assert.equal((await video.arrayBuffer()).byteLength, 100);
});

test("frontend does not accept writes", async () => {
  const response = await fetch(origin, { method: "POST", body: "test" });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("static comparison exposes both labelled plots without an overlay", async () => {
  const $ = load(await (await fetch(origin)).text());
  const plots = $("#research-visualization figure");
  assert.equal(plots.length, 2);
  assert.deepEqual(
    plots
      .find("img")
      .map((_, image) => $(image).attr("src"))
      .get(),
    ["/systemic_misalignment/baseline.png", "/systemic_misalignment/finetuned.png"]
  );
  plots.each((_, figure) => {
    const image = $(figure).find("img");
    assert.equal(image.hasClass("absolute"), false);
    assert.equal($(figure).find("figcaption").text(), image.attr("alt"));
  });
});

test("static examples contain all 20 unique quotes with no carousel restrictions", async () => {
  const $ = load(await (await fetch(origin)).text());
  const quotes = $("#ai-quotes ul > li");
  assert.equal(quotes.length, 20);
  assert.equal(
    new Set(
      quotes
        .find(".italic")
        .map((_, quote) => $(quote).text())
        .get()
    ).size,
    20
  );
  quotes.each((_, quote) => {
    const ancestors = $(quote).parentsUntil("main").addBack();
    ancestors.each((_, element) => {
      const node = $(element);
      assert.doesNotMatch(
        node.attr("class") || "",
        /(?:^|\s)hidden(?:\s|$)|overflow-hidden|max-h-|mask-image/
      );
      assert.doesNotMatch(node.attr("style") || "", /touch-action\s*:\s*none/);
    });
  });
});
