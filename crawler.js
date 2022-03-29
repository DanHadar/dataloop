const Crawler = require("crawler");

class CrawlerCls {
  #crawler;
  constructor(url, depth) {
    this.#crawler = new Crawler();
    this.baseUrl = url;
    this.maxDepth = depth || 0;
    this.currentDepth = 0;
    this.finalResult = { results: [] };
    this.finalLink = false;
  }

  crawleUrl = (url = this.baseUrl, depth = this.currentDepth) => {
    console.log(`Starting Crawle ${this.baseUrl}`);
    this.#crawler.queue({
      uri: url,
      callback: (err, res, done) => {
        if (err) throw err;
        try {
          this.getLinkAndImages(res.$, url, depth);
          done();
          //   console.log(this.finalResult);
        } catch (err) {
          console.log(err.message, err.stack);
          done();
        }
      },
    });
  };

  getLinkAndImages($, url, depth) {
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
      //   for (let i = 0; i < links.length; i++) {
      for (let i = 0; i < 2; i++) {
        const link = links[i];
        // console.log(depth, link);
        // this.currentDepth++;
        // this.baseUrl = link;
        this.crawleUrl(link,nextDepth);
      }
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
    console.log(depth);
    if (!depth) console.log(this.finalResult);
    // else this.currentDepth--;
  }
}

module.exports = CrawlerCls;
