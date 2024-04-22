function generateTenDigitInt(): number {
  const randomInt =
    Math.floor(Math.random() * (9999999999 - 1000000000 + 1)) + 1000000000;

  return Number(randomInt.toString().padStart(10, '0'));
}
