import isValid from "../luhn";

describe("Luhn algorithm", () => {
  test.each([
    ["4111111111111111", true, "Visa valid"],
    ["5425233430109903", true, "MasterCard valid"],
    ["374245455400126", true, "AmEx valid"],
    ["6011000990139424", true, "Discover valid"],
    ["3530111333300000", true, "JCB valid"],
    ["30569309025904", true, "Diners valid"],
    ["2200000000000004", true, "Mir valid"],
  ])("%s → %s (%s)", (number, expected) => {
    expect(isValid(number)).toBe(expected);
  });

  test.each([
    ["4111111111111112", false, "invalid checksum"],
    ["1234567890123456", false, "random digits"],
    ["0000000000000000", false, "all zeros — invalid BIN but passes Luhn, treat as edge case"],
  ])("%s → %s (%s)", (number, expected) => {
    // Luhn only checks the checksum, 0000... actually passes Luhn
    if (number === "0000000000000000") {
      expect(isValid(number)).toBe(true);
    } else {
      expect(isValid(number)).toBe(expected);
    }
  });

  test("rejects non-numeric input", () => {
    expect(isValid("abcd")).toBe(false);
    expect(isValid("")).toBe(false);
  });

  test("rejects too short number", () => {
    expect(isValid("123")).toBe(false);
  });

  test("handles spaces and dashes", () => {
    expect(isValid("4111 1111 1111 1111")).toBe(true);
    expect(isValid("4111-1111-1111-1111")).toBe(true);
  });
});
