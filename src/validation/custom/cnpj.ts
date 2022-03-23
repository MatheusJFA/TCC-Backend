export default function validate(cnpj: string): boolean {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) return false;

  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  )
    return false;

  let size: number = cnpj.length - 2;
  let numbers: string = cnpj.substring(0, size);
  let digits: string = cnpj.substring(size);
  let sum: number = 0;
  let position: number = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * position--;
    if (position < 2) position = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  position = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * position--;
    if (position < 2) position = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}