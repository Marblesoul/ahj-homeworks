import Card from "./Card.js";

const STORAGE_KEY = "trello-state";

const DEFAULT_STATE = {
  columns: [
    { id: "todo", title: "TODO", cards: [] },
    { id: "in-progress", title: "In Progress", cards: [] },
    { id: "done", title: "Done", cards: [] },
  ],
};

export default class TrelloBoard {
  constructor(container) {
    this.container = container;
    this.state = this._loadState();
    this.card = new Card();
  }

  _loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_STATE));
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  addCard(columnId, text) {
    const col = this.state.columns.find((c) => c.id === columnId);
    if (!col) return;
    col.cards.push({ id: crypto.randomUUID(), text });
    this.saveState();
    this.render();
  }

  deleteCard(columnId, cardId) {
    const col = this.state.columns.find((c) => c.id === columnId);
    if (!col) return;
    col.cards = col.cards.filter((c) => c.id !== cardId);
    this.saveState();
    this.render();
  }

  moveCard(cardId, fromColId, toColId, beforeCardId) {
    const fromCol = this.state.columns.find((c) => c.id === fromColId);
    const toCol = this.state.columns.find((c) => c.id === toColId);
    if (!fromCol || !toCol) return;

    const cardIdx = fromCol.cards.findIndex((c) => c.id === cardId);
    if (cardIdx === -1) return;

    const [card] = fromCol.cards.splice(cardIdx, 1);

    if (beforeCardId) {
      const beforeIdx = toCol.cards.findIndex((c) => c.id === beforeCardId);
      if (beforeIdx !== -1) {
        toCol.cards.splice(beforeIdx, 0, card);
      } else {
        toCol.cards.push(card);
      }
    } else {
      toCol.cards.push(card);
    }

    this.saveState();
    this.render();
  }

  render() {
    this.container.innerHTML = "";

    const board = document.createElement("div");
    board.className = "trello-board";

    for (const col of this.state.columns) {
      board.append(this._renderColumn(col));
    }

    this.container.append(board);
    this._bindColumnEvents();
  }

  _renderColumn(col) {
    const colEl = document.createElement("div");
    colEl.className = "trello-column";
    colEl.dataset.columnId = col.id;

    const title = document.createElement("h2");
    title.className = "column-title";
    title.textContent = col.title;

    const cardList = document.createElement("div");
    cardList.className = "card-list";
    cardList.dataset.columnId = col.id;

    for (const cardData of col.cards) {
      cardList.append(this.card.render(cardData));
    }

    const addArea = this._renderAddArea(col.id);

    colEl.append(title, cardList, addArea);
    return colEl;
  }

  _renderAddArea(columnId) {
    const area = document.createElement("div");
    area.className = "add-card-area";
    area.dataset.columnId = columnId;

    const btn = document.createElement("button");
    btn.className = "add-card-btn";
    btn.textContent = "+ Add another card";
    btn.dataset.columnId = columnId;

    const form = document.createElement("div");
    form.className = "add-card-form hidden";

    const textarea = document.createElement("textarea");
    textarea.className = "add-card-textarea";
    textarea.placeholder = "Enter card text...";
    textarea.rows = 3;

    const actions = document.createElement("div");
    actions.className = "add-card-actions";

    const confirmBtn = document.createElement("button");
    confirmBtn.className = "add-card-confirm";
    confirmBtn.textContent = "Add card";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "add-card-cancel";
    cancelBtn.textContent = "Cancel";

    actions.append(confirmBtn, cancelBtn);
    form.append(textarea, actions);
    area.append(btn, form);
    return area;
  }

  _bindColumnEvents() {
    this.container.querySelectorAll(".add-card-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const area = btn.closest(".add-card-area");
        btn.classList.add("hidden");
        area.querySelector(".add-card-form").classList.remove("hidden");
        area.querySelector(".add-card-textarea").focus();
      });
    });

    this.container.querySelectorAll(".add-card-cancel").forEach((cancelBtn) => {
      cancelBtn.addEventListener("click", () => this._closeForm(cancelBtn));
    });

    this.container.querySelectorAll(".add-card-confirm").forEach((confirmBtn) => {
      confirmBtn.addEventListener("click", () => this._submitForm(confirmBtn));
    });

    this.container.querySelectorAll(".add-card-textarea").forEach((textarea) => {
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this._closeForm(textarea);
      });
    });

    this.container.querySelectorAll(".card-delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cardEl = btn.closest(".card");
        const cardId = cardEl.dataset.cardId;
        const colId = cardEl.closest(".card-list").dataset.columnId;
        this.deleteCard(colId, cardId);
      });
    });
  }

  _closeForm(el) {
    const area = el.closest(".add-card-area");
    area.querySelector(".add-card-form").classList.add("hidden");
    area.querySelector(".add-card-textarea").value = "";
    area.querySelector(".add-card-btn").classList.remove("hidden");
  }

  _submitForm(el) {
    const area = el.closest(".add-card-area");
    const textarea = area.querySelector(".add-card-textarea");
    const text = textarea.value.trim();
    if (!text) return;
    const columnId = area.dataset.columnId;
    this.addCard(columnId, text);
  }
}
