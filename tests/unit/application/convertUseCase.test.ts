import { convertUseCase } from '@application/convertUseCase';
import { ConversionError, ValidationError } from '@shared/errors';

describe('Application: ConvertUseCase', () => {
  describe('Auto-detección', () => {
    it.each([
      ['42', 'XLII', 'toRoman', 'numérico a romano'],
      ['XLII', '42', 'toNumeric', 'romano a numérico'],
      ['1', 'I', 'toRoman', 'valor mínimo numérico'],
      ['I', '1', 'toNumeric', 'valor mínimo romano'],
      ['3999', 'MMMCMXCIX', 'toRoman', 'valor máximo numérico'],
      ['MMMCMXCIX', '3999', 'toNumeric', 'valor máximo romano'],
      ['1994', 'MCMXCIV', 'toRoman', 'año complejo'],
    ])('debe auto-detectar %s → %s (%s)', (input, expectedOutput, expectedDirection) => {
      const result = convertUseCase({ input, direction: 'auto' });
      expect(result.input).toBe(input);
      expect(result.output).toBe(expectedOutput);
      expect(result.direction).toBe(expectedDirection);
    });
  });

  describe('Dirección explícita toRoman', () => {
    it.each([
      ['1', 'I'],
      ['42', 'XLII'],
      ['1994', 'MCMXCIV'],
      ['3999', 'MMMCMXCIX'],
    ])('debe convertir %s a romano %s', (input, expectedOutput) => {
      const result = convertUseCase({ input, direction: 'toRoman' });
      expect(result.output).toBe(expectedOutput);
      expect(result.direction).toBe('toRoman');
    });

    it.each([
      ['IV', 'entrada romana'],
      ['ABC', 'entrada inválida'],
    ])('debe lanzar ValidationError para %s', (input) => {
      expect(() => convertUseCase({ input, direction: 'toRoman' })).toThrow(ValidationError);
    });
  });

  describe('Dirección explícita toNumeric', () => {
    it.each([
      ['I', '1'],
      ['XLII', '42'],
      ['MCMXCIV', '1994'],
      ['MMMCMXCIX', '3999'],
    ])('debe convertir %s a numérico %s', (input, expectedOutput) => {
      const result = convertUseCase({ input, direction: 'toNumeric' });
      expect(result.output).toBe(expectedOutput);
      expect(result.direction).toBe('toNumeric');
    });

    it.each([
      ['42', 'entrada numérica'],
      ['123', 'entrada numérica'],
    ])('debe lanzar ValidationError para %s', (input) => {
      expect(() => convertUseCase({ input, direction: 'toNumeric' })).toThrow(ValidationError);
    });
  });

  describe('Casos de error', () => {
    it.each([
      ['0', ConversionError, 'fuera de rango (cero)'],
      ['4000', ConversionError, 'fuera de rango (mayor)'],
      ['10000', ConversionError, 'fuera de rango (muy grande)'],
      ['IIII', ConversionError, 'romano inválido'],
      ['VV', ConversionError, 'romano inválido (repetición)'],
    ])('debe lanzar %s para %s', (input, errorType) => {
      expect(() => convertUseCase({ input, direction: 'auto' })).toThrow(errorType);
    });

    it.each([
      ['', 'entrada vacía'],
      ['   ', 'solo espacios'],
      ['12X', 'entrada ambigua'],
      ['ABC', 'caracteres inválidos'],
      ['-1', 'negativo (no reconocido)'],
      ['-100', 'negativo grande'],
    ])('debe lanzar ValidationError para %s', (input) => {
      expect(() => convertUseCase({ input, direction: 'auto' })).toThrow(ValidationError);
    });
  });
});
