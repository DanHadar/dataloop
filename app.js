const CrawlerCls = require("./crawler");

const baseUrl = process.argv[2] || "";
const depth = +process.argv[3] || 0;
try {
  if (!baseUrl.length) throw Error("missing base url");
  const c = new CrawlerCls(baseUrl, depth);
  console.log(`Starting process: baseUrl = ${baseUrl}, max-depth = ${depth}`);
  c.crawleUrl();
} catch (err) {
  console.error(
    `app.js: Failed to crawle ${baseUrl} (depth: ${depth}) \nerr: ${err.stack}`
  );
}
