/**
 * Проверка номера карты по алгоритму Луна
 * @param {string} number — номер карты (может содержать пробелы/дефисы)
 * @returns {boolean}
 */
export default function isValid(number) {
  const digits = number.replace(/[\s-]/g, "");

  if (!/^\d+$/.test(digits) || digits.length < 12 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  const parity = digits.length % 2;

  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i], 10);

    if (i % 2 === parity) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return sum % 10 === 0;
}
