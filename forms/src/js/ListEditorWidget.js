import ProductStore from "./ProductStore";

export default class ListEditorWidget {
  constructor(container) {
    this.container = container;
    this.store = new ProductStore();
    this.editingId = null;
  }

  init() {
    this.render();
    this.container.addEventListener("click", (e) => this.onClick(e));
  }

  render() {
    const products = this.store.getAll();

    const rows = products
      .map(
        (p) => `
      <tr>
        <td>${p.name}</td>
        <td>${p.price}</td>
        <td>
          <div class="list-editor-actions">
            <button class="btn-edit" data-id="edit-btn" data-product-id="${p.id}">✎</button>
            <button class="btn-delete" data-id="delete-btn" data-product-id="${p.id}">✕</button>
          </div>
        </td>
      </tr>`,
      )
      .join("");

    this.container.innerHTML = `
      <div class="list-editor-header">
        <h2>Редактор списка</h2>
        <button class="btn-add" data-id="add-btn">+</button>
      </div>
      <table class="list-editor-table" data-id="product-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Стоимость</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody data-id="product-tbody">
          ${rows}
        </tbody>
      </table>
    `;
  }

  onClick(e) {
    const addBtn = e.target.closest('[data-id="add-btn"]');
    const editBtn = e.target.closest('[data-id="edit-btn"]');
    const deleteBtn = e.target.closest('[data-id="delete-btn"]');

    if (addBtn) {
      this.editingId = null;
      this.showModal("", "");
    } else if (editBtn) {
      const id = Number(editBtn.dataset.productId);
      const product = this.store.getAll().find((p) => p.id === id);
      if (product) {
        this.editingId = id;
        this.showModal(product.name, String(product.price));
      }
    } else if (deleteBtn) {
      const id = Number(deleteBtn.dataset.productId);
      const product = this.store.getAll().find((p) => p.id === id);
      if (product) {
        this.showConfirmModal(id, product.name);
      }
    }
  }

  showModal(name, price) {
    this.removeModal();

    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.setAttribute("data-id", "modal");
    overlay.innerHTML = `
      <div class="modal-card">
        <h3>${this.editingId ? "Редактировать товар" : "Добавить товар"}</h3>
        <div class="form-group">
          <label for="product-name">Название</label>
          <input type="text" id="product-name" data-id="name-input" value="${name}">
          <div class="form-error" data-id="name-error"></div>
        </div>
        <div class="form-group">
          <label for="product-price">Стоимость</label>
          <input type="text" id="product-price" data-id="price-input" value="${price}">
          <div class="form-error" data-id="price-error"></div>
        </div>
        <div class="modal-buttons">
          <button class="btn-cancel" data-id="cancel-btn">Отмена</button>
          <button class="btn-save" data-id="save-btn">Сохранить</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('[data-id="save-btn"]').addEventListener("click", () => this.onSave());
    overlay.querySelector('[data-id="cancel-btn"]').addEventListener("click", () => this.removeModal());
  }

  showConfirmModal(id, name) {
    this.removeModal();

    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.setAttribute("data-id", "confirm-modal");
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="confirm-text">Удалить товар "${name}"?</div>
        <div class="modal-buttons">
          <button class="btn-confirm-no" data-id="confirm-no">Нет</button>
          <button class="btn-confirm-yes" data-id="confirm-yes">Да</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('[data-id="confirm-yes"]').addEventListener("click", () => {
      this.store.delete(id);
      this.removeModal();
      this.render();
    });
    overlay.querySelector('[data-id="confirm-no"]').addEventListener("click", () => this.removeModal());
  }

  onSave() {
    const nameInput = document.querySelector('[data-id="name-input"]');
    const priceInput = document.querySelector('[data-id="price-input"]');
    const nameError = document.querySelector('[data-id="name-error"]');
    const priceError = document.querySelector('[data-id="price-error"]');

    nameError.textContent = "";
    priceError.textContent = "";
    nameInput.classList.remove("input-error");
    priceInput.classList.remove("input-error");

    let result;
    if (this.editingId) {
      result = this.store.update(this.editingId, nameInput.value, priceInput.value);
    } else {
      result = this.store.add(nameInput.value, priceInput.value);
    }

    if (!result.success) {
      result.errors.forEach((err) => {
        if (err.field === "name") {
          nameError.textContent = err.message;
          nameInput.classList.add("input-error");
        }
        if (err.field === "price") {
          priceError.textContent = err.message;
          priceInput.classList.add("input-error");
        }
      });
      return;
    }

    this.removeModal();
    this.render();
  }

  removeModal() {
    const modal = document.querySelector('[data-id="modal"]');
    const confirm = document.querySelector('[data-id="confirm-modal"]');
    if (modal) modal.remove();
    if (confirm) confirm.remove();
  }
}
