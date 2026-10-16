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

const index = path.join(app, "build/index.html");
const template = fs.readFileSync(index, "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("Expected an empty CRA root");
fs.writeFileSync(
  index,
  template.replace('<div id="root"></div>', `<div id="root"><main>${$.html()}</main></div>`)
);
