// Render the existing overview at build time. Research copy stays in OverviewTab.
const fs = require("node:fs");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { buildSync } = require("esbuild");
const { load } = require("cheerio");

const app = path.resolve(__dirname, "..");
const compiled = path.join(app, "node_modules/.cache/overview-prerender.cjs");
buildSync({
  entryPoints: [path.join(app, "src/components/OverviewTab.tsx")],
  outfile: compiled,
  bundle: true,
  platform: "node",
  packages: "external",
  format: "cjs",
});
const Overview = require(compiled).default;
const $ = load(
  renderToStaticMarkup(React.createElement(Overview, { onNavigateToTab() {} })),
  null,
  false
);

// Motion's initial states must not hide the document before JavaScript loads.
$("[style]").each((_, element) => {
  const el = $(element);
  el.attr("style", (el.attr("style") || "").replace(/(?:^|;)\s*(?:opacity|transform):[^;]*/g, ""));
});
$("[aria-hidden='true']").remove();
$("button").attr("disabled", "").attr("title", "Enable JavaScript to use the interactive explorer");

// A frozen animation is not a readable fallback: expose both comparison plots
// in normal flow, with captions from the existing source descriptions.
$("[data-static-comparison]").each((_, element) => {
  const comparison = $(element);
  const figures = comparison
    .find("img")
    .toArray()
    .map(image => {
      const plot = $(image).removeClass("absolute inset-0");
      return $("<figure>")
        .addClass("mb-8")
        .append(plot)
        .append(
          $("<figcaption>")
            .addClass("text-zinc-300 p-6")
            .text(plot.attr("alt") || "")
        );
    });
  comparison.empty().append(...figures);
});

// Keep one source copy of every quote. Replacing the carousel wrappers removes
// height limits, masks, responsive hiding, and touch-action:none together.
$("[data-static-quotes]").each((_, element) => {
  const list = $("<ul>").addClass("grid grid-cols-1 md:grid-cols-3 gap-6 mt-16");
  $(element)
    .find('[data-quote-copy="0"]')
    .each((_, quote) => {
      list.append($("<li>").append($(quote)));
    });
  if (!list.children().length) throw new Error("Expected source quotes for the static list");
  $(element).replaceWith(list);
});

const index = path.join(app, "build/index.html");
const template = fs.readFileSync(index, "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("Expected an empty CRA root");
fs.writeFileSync(
  index,
  template.replace('<div id="root"></div>', `<div id="root"><main>${$.html()}</main></div>`)
);
