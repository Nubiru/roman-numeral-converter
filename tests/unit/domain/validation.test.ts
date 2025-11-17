import { isValidArabic, isValidRoman, validateRange } from '@domain/validation';
import { ValidationError } from '@shared/errors';

describe('Domain: Validation', () => {
  describe('isValidRoman', () => {
    it('should return true for valid Roman numerals', () => {
      expect(isValidRoman('I')).toBe(true);
      expect(isValidRoman('IV')).toBe(true);
      expect(isValidRoman('MCMXCIV')).toBe(true);
    });

    it('should return false for invalid Roman numerals', () => {
      expect(isValidRoman('IIII')).toBe(false);
      expect(isValidRoman('VV')).toBe(false);
      expect(isValidRoman('ABC')).toBe(false);
      expect(isValidRoman('')).toBe(false);
    });

    it('should return false for lowercase', () => {
      expect(isValidRoman('iv')).toBe(false);
    });
  });

  describe('isValidArabic', () => {
    it('should return true for valid Arabic strings', () => {
      expect(isValidArabic('1')).toBe(true);
      expect(isValidArabic('42')).toBe(true);
      expect(isValidArabic('3999')).toBe(true);
    });

    it('should return false for invalid Arabic strings', () => {
      expect(isValidArabic('abc')).toBe(false);
      expect(isValidArabic('1.5')).toBe(false);
      expect(isValidArabic('-1')).toBe(false);
      expect(isValidArabic('')).toBe(false);
    });
  });

  describe('validateRange', () => {
    it('should not throw for valid range (1-3999)', () => {
      expect(() => validateRange(1)).not.toThrow();
      expect(() => validateRange(3999)).not.toThrow();
      expect(() => validateRange(1994)).not.toThrow();
    });

    it('should throw ValidationError for out of range', () => {
      expect(() => validateRange(0)).toThrow(ValidationError);
      expect(() => validateRange(4000)).toThrow(ValidationError);
      expect(() => validateRange(-5)).toThrow(ValidationError);
    });
  });
});
