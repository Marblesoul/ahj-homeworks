import Widget from "../Widget";

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  const app = document.getElementById("app");
  const widget = new Widget(app);
  widget.init();
});

describe("Widget DOM interaction", () => {
  test("renders input, button and card icons", () => {
    expect(document.querySelector('[data-id="card-input"]')).not.toBeNull();
    expect(document.querySelector('[data-id="validate-btn"]')).not.toBeNull();
    expect(document.querySelectorAll(".card-icon").length).toBe(7);
  });

  describe("card system highlight on input", () => {
    test.each([
      ["4111111111111111", "visa"],
      ["5425233430109903", "mastercard"],
      ["374245455400126", "amex"],
      ["6011111111111117", "discover"],
      ["3530111333300000", "jcb"],
      ["30569309025904", "diners"],
      ["2200000000000004", "mir"],
    ])("input %s highlights %s icon", (number, system) => {
      const input = document.querySelector('[data-id="card-input"]');
      input.value = number;
      input.dispatchEvent(new Event("input"));

      const activeIcon = document.querySelector(".card-icon.active");
      expect(activeIcon).not.toBeNull();
      expect(activeIcon.dataset.system).toBe(system);
    });
  });

  describe("validation result on button click", () => {
    test.each([
      ["4111111111111111", "valid", "Card number is valid"],
      ["5425233430109903", "valid", "Card number is valid"],
      ["374245455400126", "valid", "Card number is valid"],
      ["2200000000000004", "valid", "Card number is valid"],
      ["4111111111111112", "invalid", "Card number is invalid"],
      ["1234567890123456", "invalid", "Card number is invalid"],
    ])("input %s → %s: \"%s\"", (number, status, message) => {
      const input = document.querySelector('[data-id="card-input"]');
      const btn = document.querySelector('[data-id="validate-btn"]');
      const result = document.querySelector('[data-id="result"]');

      input.value = number;
      btn.click();

      expect(result.textContent).toBe(message);
      expect(result.classList.contains(status)).toBe(true);
    });
  });

  test("shows error when input is empty", () => {
    const btn = document.querySelector('[data-id="validate-btn"]');
    const result = document.querySelector('[data-id="result"]');

    btn.click();

    expect(result.textContent).toBe("Please enter a card number");
    expect(result.classList.contains("invalid")).toBe(true);
  });

  test("clears result on new input", () => {
    const input = document.querySelector('[data-id="card-input"]');
    const btn = document.querySelector('[data-id="validate-btn"]');
    const result = document.querySelector('[data-id="result"]');

    input.value = "4111111111111112";
    btn.click();
    expect(result.textContent).not.toBe("");

    input.value = "4111111111111111";
    input.dispatchEvent(new Event("input"));
    expect(result.textContent).toBe("");
  });
});
