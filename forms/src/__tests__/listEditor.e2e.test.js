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

test("full CRUD scenario", async () => {
  // 1. Add a product
  await page.click('[data-id="add-btn"]');
  await page.waitForSelector('[data-id="modal"]');

  await page.type('[data-id="name-input"]', "Ноутбук");
  await page.type('[data-id="price-input"]', "50000");
  await page.click('[data-id="save-btn"]');

  // Verify product in table
  const name = await page.$eval('[data-id="product-tbody"] tr td:first-child', (el) => el.textContent);
  expect(name).toBe("Ноутбук");

  // 2. Edit the product
  await page.click('[data-id="edit-btn"]');
  await page.waitForSelector('[data-id="modal"]');

  const nameInput = await page.$('[data-id="name-input"]');
  await nameInput.click({ clickCount: 3 });
  await nameInput.type("Телефон");

  const priceInput = await page.$('[data-id="price-input"]');
  await priceInput.click({ clickCount: 3 });
  await priceInput.type("30000");

  await page.click('[data-id="save-btn"]');

  const updatedName = await page.$eval('[data-id="product-tbody"] tr td:first-child', (el) => el.textContent);
  expect(updatedName).toBe("Телефон");

  // 3. Delete the product
  await page.click('[data-id="delete-btn"]');
  await page.waitForSelector('[data-id="confirm-modal"]');
  await page.click('[data-id="confirm-yes"]');

  const rows = await page.$$('[data-id="product-tbody"] tr');
  expect(rows.length).toBe(0);
});

test("validation shows errors for empty fields", async () => {
  await page.click('[data-id="add-btn"]');
  await page.waitForSelector('[data-id="modal"]');

  // Click save without filling fields
  await page.click('[data-id="save-btn"]');

  const nameError = await page.$eval('[data-id="name-error"]', (el) => el.textContent);
  const priceError = await page.$eval('[data-id="price-error"]', (el) => el.textContent);

  expect(nameError).not.toBe("");
  expect(priceError).not.toBe("");

  // Cancel
  await page.click('[data-id="cancel-btn"]');
});
