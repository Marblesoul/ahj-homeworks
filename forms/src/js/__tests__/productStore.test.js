import ProductStore from "../ProductStore";

let store;

beforeEach(() => {
  store = new ProductStore();
});

describe("add", () => {
  test("adds product successfully", () => {
    const result = store.add("Ноутбук", "50000");
    expect(result.success).toBe(true);
    expect(result.product.name).toBe("Ноутбук");
    expect(result.product.price).toBe(50000);
    expect(result.product.id).toBe(1);
  });

  test("stores price as number", () => {
    store.add("Товар", "100.5");
    const products = store.getAll();
    expect(typeof products[0].price).toBe("number");
    expect(products[0].price).toBe(100.5);
  });

  test("fails with empty name", () => {
    const result = store.add("", "100");
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "name" })]),
    );
  });

  test("fails with whitespace-only name", () => {
    const result = store.add("   ", "100");
    expect(result.success).toBe(false);
  });

  test("fails with price 0", () => {
    const result = store.add("Товар", "0");
    expect(result.success).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "price" })]),
    );
  });

  test("fails with negative price", () => {
    const result = store.add("Товар", "-10");
    expect(result.success).toBe(false);
  });

  test("fails with non-numeric price", () => {
    const result = store.add("Товар", "abc");
    expect(result.success).toBe(false);
  });

  test("fails with empty price", () => {
    const result = store.add("Товар", "");
    expect(result.success).toBe(false);
  });

  test("returns both errors for empty name and invalid price", () => {
    const result = store.add("", "abc");
    expect(result.success).toBe(false);
    expect(result.errors.length).toBe(2);
  });
});

describe("update", () => {
  test("updates product successfully", () => {
    store.add("Старое", "100");
    const result = store.update(1, "Новое", "200");
    expect(result.success).toBe(true);
    expect(result.product.name).toBe("Новое");
    expect(result.product.price).toBe(200);
  });

  test("fails for non-existent id", () => {
    const result = store.update(999, "Товар", "100");
    expect(result.success).toBe(false);
  });

  test("fails with invalid data", () => {
    store.add("Товар", "100");
    const result = store.update(1, "", "-5");
    expect(result.success).toBe(false);
  });
});

describe("delete", () => {
  test("removes product", () => {
    store.add("Товар", "100");
    expect(store.getAll().length).toBe(1);
    store.delete(1);
    expect(store.getAll().length).toBe(0);
  });
});

describe("getAll", () => {
  test("returns copy of array", () => {
    store.add("A", "10");
    store.add("B", "20");
    const all = store.getAll();
    all.push({ id: 99, name: "Fake", price: 0 });
    expect(store.getAll().length).toBe(2);
  });
});
