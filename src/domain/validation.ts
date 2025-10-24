import { ValidationError } from '@shared/errors';

const ROMAN_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
const MIN_VALUE = 1;
const MAX_VALUE = 3999;

export function isValidRoman(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  return ROMAN_REGEX.test(input);
}

export function isValidArabic(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  const num = parseInt(input, 10);
  return !isNaN(num) && num.toString() === input && num >= MIN_VALUE && num <= MAX_VALUE;
}

export function validateRange(num: number): void {
  if (num < MIN_VALUE || num > MAX_VALUE) {
    throw new ValidationError(`Number must be between ${MIN_VALUE} and ${MAX_VALUE}`);
  }
}
