import Popover from "../Popover";

beforeEach(() => {
  document.body.innerHTML = '<div id="app"><button data-id="trigger" style="width:100px;height:40px;">Click</button></div>';
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("show creates popover element in DOM", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "Test Title", content: "Test Content" });
  popover.show(trigger);

  const el = document.querySelector('[data-id="popover"]');
  expect(el).not.toBeNull();
});

test("popover displays correct title and content", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "My Title", content: "My Content" });
  popover.show(trigger);

  expect(document.querySelector('[data-id="popover-title"]').textContent).toBe("My Title");
  expect(document.querySelector('[data-id="popover-content"]').textContent).toBe("My Content");
});

test("remove removes popover from DOM", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "Title", content: "Content" });
  popover.show(trigger);

  expect(document.querySelector('[data-id="popover"]')).not.toBeNull();

  popover.remove();
  expect(document.querySelector('[data-id="popover"]')).toBeNull();
  expect(popover.element).toBeNull();
});

test("show replaces previous popover (no duplicates)", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "Title", content: "Content" });

  popover.show(trigger);
  popover.show(trigger);

  const popovers = document.querySelectorAll('[data-id="popover"]');
  expect(popovers.length).toBe(1);
});

test("popover has position styles set", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "Title", content: "Content" });
  popover.show(trigger);

  const el = document.querySelector('[data-id="popover"]');
  expect(el.style.left).toContain("px");
  expect(el.style.top).toContain("px");
});

test("popover has arrow element", () => {
  const trigger = document.querySelector('[data-id="trigger"]');
  const popover = new Popover({ title: "Title", content: "Content" });
  popover.show(trigger);

  expect(document.querySelector('[data-id="popover-arrow"]')).not.toBeNull();
});
