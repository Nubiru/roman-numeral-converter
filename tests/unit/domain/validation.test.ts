import { isValidArabic, isValidRoman, validateRange } from '@domain/validation';
import { ValidationError } from '@shared/errors';

describe('Domain: Validation', () => {
  describe('isValidRoman', () => {
    describe('casos válidos', () => {
      it.each([
        ['I', 'uno'],
        ['IV', 'cuatro (sustractivo)'],
        ['MCMXCIV', 'año 1994'],
        ['MMMCMXCIX', 'máximo 3999'],
        ['LVIII', 'cincuenta y ocho'],
        ['XXX', 'treinta'],
        ['CCC', 'trescientos'],
        ['MMM', 'tres mil'],
      ])('debe retornar true para %s (%s)', (input) => {
        expect(isValidRoman(input)).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it.each([
        ['IIII', 'cuatro I consecutivos'],
        ['VV', 'dos V'],
        ['ABC', 'caracteres inválidos'],
        ['', 'cadena vacía'],
        ['iv', 'minúsculas'],
        ['MMMM', 'cuatro M'],
        ['LL', 'dos L'],
        ['DD', 'dos D'],
        ['XXXX', 'cuatro X'],
        ['CCCC', 'cuatro C'],
      ])('debe retornar false para %s (%s)', (input) => {
        expect(isValidRoman(input)).toBe(false);
      });
    });
  });

  describe('isValidArabic', () => {
    describe('casos válidos', () => {
      it.each([
        ['1', 'mínimo'],
        ['42', 'número común'],
        ['3999', 'máximo'],
        ['100', 'centena'],
        ['2024', 'año actual'],
      ])('debe retornar true para %s (%s)', (input) => {
        expect(isValidArabic(input)).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it.each([
        ['abc', 'letras'],
        ['1.5', 'decimal'],
        ['-1', 'negativo con signo'],
        ['', 'vacío'],
        ['1 2', 'con espacios'],
        ['12abc', 'mixto'],
        ['0x10', 'hexadecimal'],
      ])('debe retornar false para %s (%s)', (input) => {
        expect(isValidArabic(input)).toBe(false);
      });
    });
  });

  describe('validateRange', () => {
    describe('rango válido (1-3999)', () => {
      it.each([
        [1, 'mínimo'],
        [3999, 'máximo'],
        [1994, 'año'],
        [100, 'centena'],
        [2000, 'milenio'],
      ])('no debe lanzar error para %i (%s)', (input) => {
        expect(() => validateRange(input)).not.toThrow();
      });
    });

    describe('fuera de rango', () => {
      it.each([
        [0, 'cero'],
        [4000, 'mayor a máximo'],
        [-5, 'negativo pequeño'],
        [-1000, 'negativo grande'],
        [10000, 'muy grande'],
      ])('debe lanzar ValidationError para %i (%s)', (input) => {
        expect(() => validateRange(input)).toThrow(ValidationError);
        expect(() => validateRange(input)).toThrow(/between 1 and 3999/);
      });
    });
  });
});
