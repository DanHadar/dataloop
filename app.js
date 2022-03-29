// const baseUrl=process.argv[2]
// const depth = process.argv[3]
// const Crawler = require("crawler");
// const utils = require("./utils");

const baseUrl = "https://www.ynet.co.il/";
const depth = 0;
const CrawlerCls = require("./crawler");

const c = new CrawlerCls(baseUrl, depth);
c.crawleUrl();
console.log("finished");
