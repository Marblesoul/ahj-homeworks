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

test("clicking departure input opens calendar", async () => {
  await page.click('[data-id="departure-input"]');
  const calendar = await page.$('[data-id="calendar"]');
  expect(calendar).not.toBeNull();
});

test("selecting a date fills the departure input", async () => {
  // Find a selectable day and click it
  const selectableDay = await page.$('[data-selectable="true"]');
  if (selectableDay) {
    await selectableDay.click();
    const value = await page.$eval('[data-id="departure-input"]', (el) => el.value);
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});

test("unchecking round-trip hides return field", async () => {
  await page.click('[data-id="round-trip-checkbox"]');
  const returnField = await page.$('[data-id="return-field"]');
  const isHidden = await page.evaluate((el) => el.classList.contains("hidden"), returnField);
  expect(isHidden).toBe(true);

  // Re-check
  await page.click('[data-id="round-trip-checkbox"]');
});

test("calendar navigation changes month", async () => {
  await page.click('[data-id="departure-input"]');
  const titleBefore = await page.$eval('[data-id="calendar-title"]', (el) => el.textContent);

  await page.click('[data-id="next-month"]');
  const titleAfter = await page.$eval('[data-id="calendar-title"]', (el) => el.textContent);

  expect(titleBefore).not.toBe(titleAfter);
});
