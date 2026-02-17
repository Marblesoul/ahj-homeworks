export default class Popover {
  constructor({ title, content }) {
    this.title = title;
    this.content = content;
    this.element = null;
  }

  show(triggerEl) {
    this.remove();

    this.element = document.createElement("div");
    this.element.classList.add("popover");
    this.element.setAttribute("data-id", "popover");
    this.element.innerHTML = `
      <div class="popover-arrow" data-id="popover-arrow"></div>
      <div class="popover-title" data-id="popover-title">${this.title}</div>
      <div class="popover-content" data-id="popover-content">${this.content}</div>
    `;

    document.body.appendChild(this.element);
    this.position(triggerEl);
  }

  position(triggerEl) {
    const triggerRect = triggerEl.getBoundingClientRect();
    const popoverRect = this.element.getBoundingClientRect();

    const left =
      triggerRect.left +
      triggerRect.width / 2 -
      popoverRect.width / 2 +
      window.scrollX;
    const top =
      triggerRect.top - popoverRect.height - 10 + window.scrollY;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
