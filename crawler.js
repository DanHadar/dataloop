const Crawler = require("crawler");
const fs = require("fs");

class CrawlerCls {
  #crawler;
  constructor(url, depth) {
    this.#crawler = new Crawler();
    this.baseUrl = url;
    this.maxDepth = depth || 0;
    this.finalResult = { results: [] };
    this.lastLink = "";
    this.runningOnDepth = [];
  }

  crawleUrl = (url = this.baseUrl, depth = 0) => {
    // console.log(`Starting Crawle ${this.baseUrl}`);
    this.#crawler.queue({
      uri: url,
      callback: (err, res, done) => {
        if (err) throw err;
        try {
          this.getLinkAndImages(res.$, url, depth);
          done();
        } catch (err) {
          console.error(
            `crawler.js: Failed to add job to crawler queue, url: ${url} (depth: ${depth}) \nerr: ${err.stack}`
          );
          done();
          throw err; //if needed
        }
      },
    });
  };

  getLinkAndImages($, url, depth) {
    try {
      if (depth < this.maxDepth) {
        let links = [];
        //recursive crawle links
        let urls = $("a");
        Object.keys(urls).forEach((item) => {
          const currentTag = urls[item];
          let href = currentTag?.attribs?.href?.trim();
          if (
            currentTag.type === "tag" &&
            href?.startsWith(this.baseUrl) &&
            !links.includes(href)
          ) {
            links.push(href);
          }
        });
        const nextDepth = depth + 1;
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          this.crawleUrl(encodeURI(link), nextDepth);
        }
        if (nextDepth === this.maxDepth)
          this.lastLink = links[links.length - 1];
      }
      if (!this.runningOnDepth.includes(depth)) {
        this.runningOnDepth.push(depth);
        console.log(`getting images from depth ${depth}`);
      }
      //images
      let images = $("img");
      Object.keys(images).forEach((item) => {
        const currentTag = images[item];
        if (currentTag?.type === "tag") {
          this.finalResult.results = [
            ...this.finalResult.results,
            {
              imageUrl: currentTag.attribs?.src,
              sourceUrl: url,
              depth,
            },
          ];
        }
      });
      if (url === this.lastLink || this.maxDepth === 0) {
        fs.writeFileSync(
          "./finalObj.json",
          JSON.stringify(this.finalResult, null, 2)
        );
        console.log(`total images: ${this.finalResult.results.length}`);
        console.log("finished process");
      }
    } catch (err) {
      console.error(
        `crawler.js: Failed to get links or images from url: ${url} (depth: ${depth}) \nerr: ${err.stack}`
      );
      throw err; //if needed
    }
  }
}

module.exports = CrawlerCls;
