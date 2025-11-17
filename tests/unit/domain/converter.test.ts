import { toArabic, toRoman } from '@domain/converter';
import { ConversionError } from '@shared/errors';

describe('Domain: Converter', () => {
  describe('toRoman', () => {
    it('should convert basic numerals', () => {
      expect(toRoman(1)).toBe('I');
      expect(toRoman(5)).toBe('V');
      expect(toRoman(10)).toBe('X');
      expect(toRoman(50)).toBe('L');
      expect(toRoman(100)).toBe('C');
      expect(toRoman(500)).toBe('D');
      expect(toRoman(1000)).toBe('M');
    });

    it('should convert numbers with subtractive notation', () => {
      expect(toRoman(4)).toBe('IV');
      expect(toRoman(9)).toBe('IX');
      expect(toRoman(40)).toBe('XL');
      expect(toRoman(90)).toBe('XC');
      expect(toRoman(400)).toBe('CD');
      expect(toRoman(900)).toBe('CM');
    });

    it('should convert complex numbers', () => {
      expect(toRoman(1994)).toBe('MCMXCIV');
      expect(toRoman(3999)).toBe('MMMCMXCIX');
      expect(toRoman(58)).toBe('LVIII');
      expect(toRoman(1984)).toBe('MCMLXXXIV');
    });

    it('should handle edge cases', () => {
      expect(toRoman(1)).toBe('I');
      expect(toRoman(3999)).toBe('MMMCMXCIX');
    });

    it('should throw for out of range', () => {
      expect(() => toRoman(0)).toThrow(ConversionError);
      expect(() => toRoman(4000)).toThrow(ConversionError);
      expect(() => toRoman(-1)).toThrow(ConversionError);
    });
  });

  describe('toArabic', () => {
    it('should convert basic Roman numerals', () => {
      expect(toArabic('I')).toBe(1);
      expect(toArabic('V')).toBe(5);
      expect(toArabic('X')).toBe(10);
      expect(toArabic('L')).toBe(50);
      expect(toArabic('C')).toBe(100);
      expect(toArabic('D')).toBe(500);
      expect(toArabic('M')).toBe(1000);
    });

    it('should convert Roman numerals with subtractive notation', () => {
      expect(toArabic('IV')).toBe(4);
      expect(toArabic('IX')).toBe(9);
      expect(toArabic('XL')).toBe(40);
      expect(toArabic('XC')).toBe(90);
      expect(toArabic('CD')).toBe(400);
      expect(toArabic('CM')).toBe(900);
    });

    it('should convert complex Roman numerals', () => {
      expect(toArabic('MCMXCIV')).toBe(1994);
      expect(toArabic('MMMCMXCIX')).toBe(3999);
      expect(toArabic('LVIII')).toBe(58);
      expect(toArabic('MCMLXXXIV')).toBe(1984);
    });

    it('should handle edge cases', () => {
      expect(toArabic('I')).toBe(1);
      expect(toArabic('MMMCMXCIX')).toBe(3999);
    });

    it('should throw for invalid Roman numerals', () => {
      expect(() => toArabic('IIII')).toThrow(ConversionError);
      expect(() => toArabic('VV')).toThrow(ConversionError);
      expect(() => toArabic('ABC')).toThrow(ConversionError);
      expect(() => toArabic('')).toThrow(ConversionError);
    });
  });
});
