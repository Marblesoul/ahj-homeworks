import ListEditorWidget from "../ListEditorWidget";

let container;
let widget;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"><section id="list-editor-section"></section></div>';
  container = document.getElementById("list-editor-section");
  widget = new ListEditorWidget(container);
  widget.init();
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("renders table with header", () => {
  const table = container.querySelector('[data-id="product-table"]');
  expect(table).not.toBeNull();
  expect(table.querySelector("thead")).not.toBeNull();
});

test("renders add button", () => {
  const addBtn = container.querySelector('[data-id="add-btn"]');
  expect(addBtn).not.toBeNull();
});

test("add button opens empty modal", () => {
  const addBtn = container.querySelector('[data-id="add-btn"]');
  addBtn.click();

  const modal = document.querySelector('[data-id="modal"]');
  expect(modal).not.toBeNull();

  const nameInput = document.querySelector('[data-id="name-input"]');
  const priceInput = document.querySelector('[data-id="price-input"]');
  expect(nameInput.value).toBe("");
  expect(priceInput.value).toBe("");
});

test("saving with valid data adds row to table", () => {
  const addBtn = container.querySelector('[data-id="add-btn"]');
  addBtn.click();

  document.querySelector('[data-id="name-input"]').value = "Ноутбук";
  document.querySelector('[data-id="price-input"]').value = "50000";
  document.querySelector('[data-id="save-btn"]').click();

  const tbody = container.querySelector('[data-id="product-tbody"]');
  expect(tbody.querySelectorAll("tr").length).toBe(1);
  expect(tbody.textContent).toContain("Ноутбук");
  expect(tbody.textContent).toContain("50000");
});

test("validation errors appear under fields", () => {
  const addBtn = container.querySelector('[data-id="add-btn"]');
  addBtn.click();

  document.querySelector('[data-id="name-input"]').value = "";
  document.querySelector('[data-id="price-input"]').value = "abc";
  document.querySelector('[data-id="save-btn"]').click();

  expect(document.querySelector('[data-id="name-error"]').textContent).not.toBe("");
  expect(document.querySelector('[data-id="price-error"]').textContent).not.toBe("");
});

test("edit button opens modal with pre-filled data", () => {
  // Add a product first
  widget.store.add("Телефон", "30000");
  widget.render();

  const editBtn = container.querySelector('[data-id="edit-btn"]');
  editBtn.click();

  expect(document.querySelector('[data-id="name-input"]').value).toBe("Телефон");
  expect(document.querySelector('[data-id="price-input"]').value).toBe("30000");
});

test("after edit, add button opens clean form without errors", () => {
  // Add and edit a product
  widget.store.add("Товар", "100");
  widget.render();

  // Click edit
  container.querySelector('[data-id="edit-btn"]').click();

  // Try to save with empty fields to trigger errors
  document.querySelector('[data-id="name-input"]').value = "";
  document.querySelector('[data-id="save-btn"]').click();

  // Cancel
  document.querySelector('[data-id="cancel-btn"]').click();

  // Click add
  container.querySelector('[data-id="add-btn"]').click();

  // Form should be clean
  expect(document.querySelector('[data-id="name-input"]').value).toBe("");
  expect(document.querySelector('[data-id="price-input"]').value).toBe("");
  expect(document.querySelector('[data-id="name-error"]').textContent).toBe("");
  expect(document.querySelector('[data-id="price-error"]').textContent).toBe("");
});

test("cancel closes modal", () => {
  container.querySelector('[data-id="add-btn"]').click();
  expect(document.querySelector('[data-id="modal"]')).not.toBeNull();

  document.querySelector('[data-id="cancel-btn"]').click();
  expect(document.querySelector('[data-id="modal"]')).toBeNull();
});

test("delete button shows confirm modal", () => {
  widget.store.add("Удалить", "100");
  widget.render();

  container.querySelector('[data-id="delete-btn"]').click();
  expect(document.querySelector('[data-id="confirm-modal"]')).not.toBeNull();
});
