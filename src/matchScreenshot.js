const fs = require("fs");
const { promisify } = require("util");
const path = require("path");
const pixelmatch = require("pixelmatch");
const PNG = require("pngjs").PNG;
const puppeteer = require("puppeteer");

const numbers = {};

async function matchesScreenshot(url, { debug = false, threshold = 0.1 } = {}) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  numbers[url] = numbers[url] || 0;
  const testPath = path.dirname(this.jasmine.testPath);

  let oldFileExisted = true;

  const oldPngFile = `${testPath}/__screenshots__/${path.basename(url)}-${++numbers[url]}.png`;
  const oldPng = await readOrUpdatePng(oldPngFile);
  const { width, height } = oldPng;
  const screenshot = await page.screenshot({ top: 0, left: 0, width, height });
  const pngScreenshot = await new Promise((resolve, reject) =>
    new PNG().parse(screenshot, (err, data) => (err ? reject(err) : resolve(data)))
  );
  const diff = new PNG({ width, height });

  const mismatchedPixels = pixelmatch(oldPng.data, pngScreenshot.data, diff.data, width, height, { threshold });
  if (debug && oldFileExisted) {
    await diff
      .pack()
      .pipe(fs.createWriteStream(`${testPath}/__screenshots__/${path.basename(url)}-${numbers[url]}-diff.png`));
  }

  await browser.close();
  return expect(mismatchedPixels).toBe(0);

  async function readOrUpdatePng(file) {
    if (updateSnapshot) {

    }
    return readPng(file).catch(async err => {
      if (err.code === "ENOENT") {
        oldFileExisted = false;
      } else {
        throw err;
      }
    });

    async function updateSnapshot(file) {
      await promisify(fs.mkdir)(`${testPath}/__screenshots__/`).catch(
        err => (err.code === "EEXIST" ? Promise.resolve() : Promise.reject(err))
      );
      return page.screenshot({ path: file });
    }
  }

  function readPng(file) {
    return new Promise((resolve, reject) => {
      const image = fs
        .createReadStream(file)
        .on("error", reject)
        .pipe(new PNG())
        .on("parsed", () => resolve(image))
        .on("error", reject);
    });
  }
}

module.exports = {
  matchesScreenshot
};
