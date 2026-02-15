const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("Credit Card Validator E2E", () => {
  let browser = null;
  let page = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("valid card number shows success", async () => {
    await page.goto(baseUrl);

    const input = await page.$('[data-id="card-input"]');
    await input.type("4111111111111111", { delay: 30 });

    const btn = await page.$('[data-id="validate-btn"]');
    await btn.click();

    const result = await page.$eval('[data-id="result"]', (el) => ({
      text: el.textContent,
      classes: el.className,
    }));

    expect(result.text).toBe("Card number is valid");
    expect(result.classes).toContain("valid");
  });

  test("invalid card number shows error", async () => {
    await page.goto(baseUrl);

    const input = await page.$('[data-id="card-input"]');
    await input.type("4111111111111112", { delay: 30 });

    const btn = await page.$('[data-id="validate-btn"]');
    await btn.click();

    const result = await page.$eval('[data-id="result"]', (el) => ({
      text: el.textContent,
      classes: el.className,
    }));

    expect(result.text).toBe("Card number is invalid");
    expect(result.classes).toContain("invalid");
  });
});
