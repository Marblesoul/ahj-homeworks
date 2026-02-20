export default class Card {
  render(card) {
    const el = document.createElement("div");
    el.className = "card";
    el.dataset.cardId = card.id;

    const text = document.createElement("span");
    text.className = "card-text";
    text.textContent = card.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "card-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.title = "Удалить карточку";

    el.append(text, deleteBtn);
    return el;
  }
}
