import { convertUseCase } from '@application/convertUseCase';
import { ConversionError, ValidationError } from '@shared/errors';

describe('Application: ConvertUseCase', () => {
  describe('Auto-detection', () => {
    it('should auto-detect numeric input and convert to Roman', () => {
      const result = convertUseCase({ input: '42', direction: 'auto' });
      expect(result.input).toBe('42');
      expect(result.output).toBe('XLII');
      expect(result.direction).toBe('toRoman');
    });

    it('should auto-detect Roman input and convert to numeric', () => {
      const result = convertUseCase({ input: 'XLII', direction: 'auto' });
      expect(result.input).toBe('XLII');
      expect(result.output).toBe('42');
      expect(result.direction).toBe('toNumeric');
    });
  });

  describe('Explicit toRoman direction', () => {
    it('should convert numeric to Roman', () => {
      const result = convertUseCase({ input: '1994', direction: 'toRoman' });
      expect(result.input).toBe('1994');
      expect(result.output).toBe('MCMXCIV');
      expect(result.direction).toBe('toRoman');
    });

    it('should throw if input is not numeric', () => {
      expect(() => convertUseCase({ input: 'IV', direction: 'toRoman' })).toThrow(ValidationError);
    });
  });

  describe('Explicit toNumeric direction', () => {
    it('should convert Roman to numeric', () => {
      const result = convertUseCase({ input: 'MCMXCIV', direction: 'toNumeric' });
      expect(result.input).toBe('MCMXCIV');
      expect(result.output).toBe('1994');
      expect(result.direction).toBe('toNumeric');
    });

    it('should throw if input is not Roman', () => {
      expect(() => convertUseCase({ input: '42', direction: 'toNumeric' })).toThrow(
        ValidationError
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle minimum value (1/I)', () => {
      expect(convertUseCase({ input: '1', direction: 'auto' }).output).toBe('I');
      expect(convertUseCase({ input: 'I', direction: 'auto' }).output).toBe('1');
    });

    it('should handle maximum value (3999/MMMCMXCIX)', () => {
      expect(convertUseCase({ input: '3999', direction: 'auto' }).output).toBe('MMMCMXCIX');
      expect(convertUseCase({ input: 'MMMCMXCIX', direction: 'auto' }).output).toBe('3999');
    });

    it('should throw for out of range numeric', () => {
      expect(() => convertUseCase({ input: '0', direction: 'auto' })).toThrow(ConversionError);
      expect(() => convertUseCase({ input: '4000', direction: 'auto' })).toThrow(ConversionError);
    });

    it('should throw for invalid Roman', () => {
      expect(() => convertUseCase({ input: 'IIII', direction: 'auto' })).toThrow(ConversionError);
    });

    it('should throw for empty input', () => {
      expect(() => convertUseCase({ input: '', direction: 'auto' })).toThrow(ValidationError);
    });

    it('should throw for ambiguous input (mixed)', () => {
      expect(() => convertUseCase({ input: '12X', direction: 'auto' })).toThrow(ValidationError);
    });
  });
});
