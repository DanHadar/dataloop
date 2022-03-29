const Crawler = require("crawler");

class CrawlerCls {
  #crawler;
  constructor(url, depth) {
    this.#crawler = new Crawler();
    this.url = url;
    this.maxDepth = depth || 0;
    this.currentDepth = 0;
    this.finalResult = { results: [] };
  }

  crawleUrl = () => {
    console.log(`Starting Crawle ${this.url}`);
    this.#crawler.queue({
      uri: this.url,
      callback: (err, res, done) => {
        if (err) throw err;
        try {
          this.getLinkAndImages(res.$);
          done();
          return this.finalResult;
        } catch (err) {
          console.log(err.message, err.stack);
          done();
        }
      },
    });
  };

  getLinkAndImages($) {
    if (this.currentDepth < this.maxDepth) {
      //recursive crawle links
      let urls = $("a");
      Object.keys(urls).forEach((item) => {
        const currentTag = urls[item];
        let href = currentTag?.attribs?.href.trim();
        if (
          currentTag.type === "tag" &&
          href.startsWith(this.url)
        ) {
          this.currentDepth++;
          this.url = href;
          this.crawleUrl();
        }
      });
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
            sourceUrl: this.url,
            depth: this.currentDepth,
          },
        ];
      }
    });
    this.currentDepth--;
  }
}

module.exports = CrawlerCls;
