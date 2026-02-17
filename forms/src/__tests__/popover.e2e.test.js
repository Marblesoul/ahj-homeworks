import puppeteer from "puppeteer";

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  page = await browser.newPage();
  await page.goto("http://localhost:9000");
});

afterAll(async () => {
  await browser.close();
});

test("clicking trigger shows popover", async () => {
  await page.click('[data-id="trigger-1"]');
  const popover = await page.$('[data-id="popover"]');
  expect(popover).not.toBeNull();
});

test("popover has correct title and content", async () => {
  const title = await page.$eval('[data-id="popover-title"]', (el) => el.textContent);
  const content = await page.$eval('[data-id="popover-content"]', (el) => el.textContent);
  expect(title).toBe("Popover Title");
  expect(content).toContain("amazing content");
});

test("clicking same trigger again hides popover", async () => {
  await page.click('[data-id="trigger-1"]');
  const popover = await page.$('[data-id="popover"]');
  expect(popover).toBeNull();
});

test("clicking different trigger shows new popover", async () => {
  await page.click('[data-id="trigger-2"]');
  const title = await page.$eval('[data-id="popover-title"]', (el) => el.textContent);
  expect(title).toBe("Another Popover");

  // Cleanup
  await page.click('[data-id="trigger-2"]');
});
