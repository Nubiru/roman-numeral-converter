import { ConversionError } from '@shared/errors';
import { isValidRoman, validateRange } from './validation';
import type { RomanNumeral, ArabicNumber } from '@shared/types';

const ROMAN_MAP: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

const ROMAN_TO_ARABIC: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export function toRoman(num: ArabicNumber): RomanNumeral {
  try {
    validateRange(num);
  } catch (error) {
    throw new ConversionError(`Cannot convert ${num}: ${(error as Error).message}`);
  }

  let result = '';
  let remaining = num;

  for (const [value, numeral] of ROMAN_MAP) {
    while (remaining >= value) {
      result += numeral;
      remaining -= value;
    }
  }

  return result;
}

export function toArabic(roman: RomanNumeral): ArabicNumber {
  if (!isValidRoman(roman)) {
    throw new ConversionError(`Invalid Roman numeral: ${roman}`);
  }

  let result = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = ROMAN_TO_ARABIC[roman[i]];

    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }

    prevValue = currentValue;
  }

  return result;
}
