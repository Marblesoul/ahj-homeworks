export default class ProductStore {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  add(name, price) {
    const errors = this.validate(name, price);
    if (errors.length > 0) return { success: false, errors };

    const product = { id: this.nextId++, name: name.trim(), price: Number(price) };
    this.products.push(product);
    return { success: true, product };
  }

  update(id, name, price) {
    const errors = this.validate(name, price);
    if (errors.length > 0) return { success: false, errors };

    const product = this.products.find((p) => p.id === id);
    if (!product) {
      return { success: false, errors: [{ field: "general", message: "Товар не найден" }] };
    }

    product.name = name.trim();
    product.price = Number(price);
    return { success: true, product };
  }

  delete(id) {
    this.products = this.products.filter((p) => p.id !== id);
  }

  getAll() {
    return [...this.products];
  }

  validate(name, price) {
    const errors = [];

    if (!name || !name.trim()) {
      errors.push({ field: "name", message: "Название обязательно" });
    }

    const numPrice = Number(price);
    if (
      price === "" ||
      price === null ||
      price === undefined ||
      isNaN(numPrice) ||
      numPrice <= 0
    ) {
      errors.push({ field: "price", message: "Цена должна быть числом больше 0" });
    }

    return errors;
  }
}
