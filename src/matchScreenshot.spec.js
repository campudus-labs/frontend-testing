const { matchesScreenshot } = require("./matchScreenshot");

describe("api", () => {
  it("can match a screenshot", async () => {
    await matchesScreenshot(`file://${__dirname}/__fixtures__/test-page.html`, {debug:true, threshold: 0.1});
  });
});
