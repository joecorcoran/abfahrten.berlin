const alphabet = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ_~0123456789'.split('');
const base = alphabet.length;

function encode(number) {
  if (number === 0) return alphabet[0];
  let result = '';
  while (number > 0) {
    result += alphabet[number % base];
    number = parseInt(number / base, 10);
  }
  return result.split('').reverse().join('');
}

function decode(string) {
  let result = 0;
  for (let char of string) {
    result = result * base + alphabet.indexOf(char);
  }
  return result;
}

export {encode, decode};
