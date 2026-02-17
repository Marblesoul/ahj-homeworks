import Popover from "./Popover";

export default class PopoverWidget {
  constructor(container) {
    this.container = container;
    this.activePopover = null;
    this.activeTrigger = null;
  }

  init() {
    this.container.innerHTML = `
      <h2>Popovers</h2>
      <div class="popover-triggers">
        <button data-id="trigger-1" data-title="Popover Title" data-content="And here's some amazing content. It's very engaging. Right?">
          Toggle Popover 1
        </button>
        <button data-id="trigger-2" data-title="Another Popover" data-content="This is another popover with different content.">
          Toggle Popover 2
        </button>
        <button data-id="trigger-3" data-title="Third One" data-content="Yet another example of a popover widget.">
          Toggle Popover 3
        </button>
      </div>
    `;

    this.container.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    const trigger = e.target.closest("[data-title]");
    if (!trigger) return;

    if (this.activeTrigger === trigger) {
      this.activePopover.remove();
      this.activePopover = null;
      this.activeTrigger = null;
      return;
    }

    if (this.activePopover) {
      this.activePopover.remove();
    }

    const popover = new Popover({
      title: trigger.dataset.title,
      content: trigger.dataset.content,
    });

    popover.show(trigger);
    this.activePopover = popover;
    this.activeTrigger = trigger;
  }
}
