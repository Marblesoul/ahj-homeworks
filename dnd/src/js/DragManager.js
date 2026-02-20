export default class DragManager {
  constructor(board) {
    this.board = board;
    this.dragging = null; // { cardEl, cardId, fromColId, offsetX, offsetY }
    this.ghost = null;
    this.placeholder = null;

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }

  attach(container) {
    this.container = container;
    container.addEventListener("mousedown", this._onMouseDown);
  }

  _onMouseDown(e) {
    const cardEl = e.target.closest(".card");
    if (!cardEl) return;
    // Don't drag when clicking delete button
    if (e.target.closest(".card-delete")) return;

    e.preventDefault();

    const rect = cardEl.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const cardId = cardEl.dataset.cardId;
    const fromColId = cardEl.closest(".card-list").dataset.columnId;

    this.dragging = { cardEl, cardId, fromColId, offsetX, offsetY };

    // Create placeholder with same height
    this.placeholder = document.createElement("div");
    this.placeholder.className = "placeholder";
    this.placeholder.style.height = rect.height + "px";

    // Create ghost
    this.ghost = cardEl.cloneNode(true);
    this.ghost.className = "card card-ghost";
    this.ghost.style.width = rect.width + "px";
    this.ghost.style.position = "fixed";
    this.ghost.style.pointerEvents = "none";
    this.ghost.style.zIndex = "1000";
    this._moveGhost(e.clientX, e.clientY);
    document.body.append(this.ghost);

    // Hide original card
    cardEl.style.visibility = "hidden";

    document.body.style.cursor = "grabbing";

    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("mouseup", this._onMouseUp);
  }

  _onMouseMove(e) {
    if (!this.dragging) return;
    this._moveGhost(e.clientX, e.clientY);
    this._updatePlaceholder(e.clientX, e.clientY);
  }

  _moveGhost(x, y) {
    const { offsetX, offsetY } = this.dragging;
    this.ghost.style.left = x - offsetX + "px";
    this.ghost.style.top = y - offsetY + "px";
  }

  _updatePlaceholder(x, y) {
    // Temporarily hide ghost to get element underneath
    this.ghost.style.display = "none";
    const el = document.elementFromPoint(x, y);
    this.ghost.style.display = "";

    if (!el) return;

    const targetCard = el.closest(".card");
    const targetList = el.closest(".card-list");

    if (targetCard && targetCard !== this.dragging.cardEl) {
      const rect = targetCard.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;

      if (y < midY) {
        targetCard.before(this.placeholder);
      } else {
        targetCard.after(this.placeholder);
      }
    } else if (targetList) {
      // Empty column or below all cards
      const cards = [...targetList.querySelectorAll(".card")].filter(
        (c) => c !== this.dragging.cardEl && !c.classList.contains("card-ghost")
      );

      if (cards.length === 0) {
        targetList.append(this.placeholder);
      } else {
        const lastCard = cards[cards.length - 1];
        const lastRect = lastCard.getBoundingClientRect();
        if (y > lastRect.bottom) {
          targetList.append(this.placeholder);
        }
      }
    }
  }

  _onMouseUp() {
    if (!this.dragging) return;

    const { cardEl, cardId, fromColId } = this.dragging;

    // Determine target column and beforeCard from placeholder position
    if (this.placeholder && this.placeholder.parentElement) {
      const targetList = this.placeholder.closest(".card-list");
      if (targetList) {
        const toColId = targetList.dataset.columnId;

        // Find the next real card after placeholder
        let beforeCardId = null;
        let sibling = this.placeholder.nextElementSibling;
        while (sibling) {
          if (sibling.classList.contains("card") && !sibling.classList.contains("card-ghost")) {
            beforeCardId = sibling.dataset.cardId;
            break;
          }
          sibling = sibling.nextElementSibling;
        }

        this.board.moveCard(cardId, fromColId, toColId, beforeCardId);
      } else {
        // Placeholder not in a column — restore visibility
        cardEl.style.visibility = "";
      }
    } else {
      cardEl.style.visibility = "";
    }

    this._cleanup();
  }

  _cleanup() {
    if (this.ghost) {
      this.ghost.remove();
      this.ghost = null;
    }
    if (this.placeholder) {
      this.placeholder.remove();
      this.placeholder = null;
    }
    if (this.dragging) {
      this.dragging.cardEl.style.visibility = "";
      this.dragging = null;
    }
    document.body.style.cursor = "";
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("mouseup", this._onMouseUp);
  }
}
