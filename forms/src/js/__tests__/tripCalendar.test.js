import TripCalendarWidget from "../TripCalendarWidget";

jest.mock("moment", () => {
  const actualMoment = jest.requireActual("moment");
  const mockedMoment = (...args) => {
    if (args.length === 0) return actualMoment("2026-02-16");
    return actualMoment(...args);
  };
  Object.assign(mockedMoment, actualMoment);
  mockedMoment.prototype = actualMoment.prototype;
  return mockedMoment;
});

let container;
let widget;

beforeEach(() => {
  document.body.innerHTML = '<div id="app"><section id="trip-section"></section></div>';
  container = document.getElementById("trip-section");
  widget = new TripCalendarWidget(container);
  widget.init();
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("renders departure and return inputs", () => {
  expect(container.querySelector('[data-id="departure-input"]')).not.toBeNull();
  expect(container.querySelector('[data-id="return-input"]')).not.toBeNull();
});

test("renders round-trip checkbox checked by default", () => {
  const checkbox = container.querySelector('[data-id="round-trip-checkbox"]');
  expect(checkbox).not.toBeNull();
  expect(checkbox.checked).toBe(true);
});

test("unchecking round-trip hides return field", () => {
  const checkbox = container.querySelector('[data-id="round-trip-checkbox"]');
  checkbox.checked = false;
  checkbox.dispatchEvent(new Event("change"));

  const returnField = container.querySelector('[data-id="return-field"]');
  expect(returnField.classList.contains("hidden")).toBe(true);
});

test("checking round-trip shows return field", () => {
  const checkbox = container.querySelector('[data-id="round-trip-checkbox"]');

  // Uncheck first
  checkbox.checked = false;
  checkbox.dispatchEvent(new Event("change"));

  // Check again
  checkbox.checked = true;
  checkbox.dispatchEvent(new Event("change"));

  const returnField = container.querySelector('[data-id="return-field"]');
  expect(returnField.classList.contains("hidden")).toBe(false);
});

test("clicking departure input opens calendar", () => {
  container.querySelector('[data-id="departure-input"]').click();
  expect(container.querySelector('[data-id="calendar"]')).not.toBeNull();
});

test("calendar has month navigation buttons", () => {
  container.querySelector('[data-id="departure-input"]').click();
  expect(container.querySelector('[data-id="prev-month"]')).not.toBeNull();
  expect(container.querySelector('[data-id="next-month"]')).not.toBeNull();
});

test("calendar has title with month and year", () => {
  container.querySelector('[data-id="departure-input"]').click();
  const title = container.querySelector('[data-id="calendar-title"]');
  expect(title).not.toBeNull();
  expect(title.textContent).toContain("2026");
});

test("past days have disabled class", () => {
  container.querySelector('[data-id="departure-input"]').click();
  const disabledDays = container.querySelectorAll(".calendar-day.disabled");
  expect(disabledDays.length).toBeGreaterThan(0);
});

test("today has today class", () => {
  container.querySelector('[data-id="departure-input"]').click();
  const todayEl = container.querySelector(".calendar-day.today");
  expect(todayEl).not.toBeNull();
  expect(todayEl.textContent).toBe("16");
});
