const systems = [
  { name: "visa", pattern: /^4\d{12}(\d{3})?$/ },
  { name: "mastercard", pattern: /^(5[1-5]\d{4}|222[1-9]\d{2}|22[3-9]\d{3}|2[3-6]\d{4}|27[01]\d{3}|2720\d{2})\d{10}$/ },
  { name: "amex", pattern: /^3[47]\d{13}$/ },
  { name: "discover", pattern: /^(6011|65\d{2}|64[4-9]\d)\d{12}$/ },
  { name: "jcb", pattern: /^35(2[89]|[3-8]\d)\d{12}$/ },
  { name: "diners", pattern: /^3(0[0-5]|[68]\d)\d{11}$/ },
  { name: "mir", pattern: /^220[0-4]\d{12}$/ },
];

/**
 * Определение платёжной системы по номеру карты
 * @param {string} number — номер карты
 * @returns {string|null} — название системы или null
 */
export default function detectSystem(number) {
  const digits = number.replace(/[\s-]/g, "");

  for (const { name, pattern } of systems) {
    if (pattern.test(digits)) {
      return name;
    }
  }

  return null;
}
