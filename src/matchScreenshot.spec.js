const { cleanUpSnapshots, initSnapshots, matchesScreenshot } = require("./matchScreenshot");

describe("api", () => {
  beforeAll(async () => {
    await initSnapshots();
  });
  afterAll(async () => {
    await cleanUpSnapshots();
  });

  it("can match a screenshot", async () => {
    await matchesScreenshot(`file://${__dirname}/__fixtures__/test-page.html`, { debug: true, threshold: 0.3 });
  });
});
