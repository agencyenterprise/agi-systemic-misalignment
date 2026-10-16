// Frontend only. The separately deployed FastAPI backend is unchanged.
const http = require("node:http");
const path = require("node:path");
const handler = require("serve-handler");

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  handler(request, response, {
    public: path.resolve(__dirname, "../build"),
    cleanUrls: false,
    directoryListing: false,
    // Only the homepage is an app route. All four tabs and shared examples live here.
    rewrites: [{ source: "/", destination: "/index.html" }],
    headers: [
      {
        source: "**",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ],
  }).catch(() => {
    if (!response.headersSent) response.writeHead(500);
    response.end();
  });
});
if (require.main === module) {
  server.listen(Number(process.env.PORT || 3000), process.env.HOST || "0.0.0.0");
}
module.exports = server;
