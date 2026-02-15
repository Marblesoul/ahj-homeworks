import detectSystem from "../cardSystem";

describe("Card system detection", () => {
  test.each([
    ["4111111111111111", "visa"],
    ["4012888888881881", "visa"],
    ["4222222222222", "visa"],
  ])("Visa: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["5425233430109903", "mastercard"],
    ["5105105105105100", "mastercard"],
    ["2221000000000009", "mastercard"],
  ])("MasterCard: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["374245455400126", "amex"],
    ["378282246310005", "amex"],
  ])("AmEx: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["6011111111111117", "discover"],
    ["6511111111111118", "discover"],
  ])("Discover: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["3530111333300000", "jcb"],
    ["3566002020360505", "jcb"],
  ])("JCB: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["30569309025904", "diners"],
    ["38520000023237", "diners"],
  ])("Diners: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test.each([
    ["2200000000000004", "mir"],
    ["2201382000000013", "mir"],
  ])("Mir: %s → %s", (number, expected) => {
    expect(detectSystem(number)).toBe(expected);
  });

  test("returns null for unknown card", () => {
    expect(detectSystem("9999999999999999")).toBeNull();
  });

  test("handles spaces and dashes", () => {
    expect(detectSystem("4111 1111 1111 1111")).toBe("visa");
    expect(detectSystem("5425-2334-3010-9903")).toBe("mastercard");
  });
});
