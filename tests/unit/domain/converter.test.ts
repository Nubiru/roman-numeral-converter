import { toArabic, toRoman } from '@domain/converter';
import { ConversionError } from '@shared/errors';

describe('Domain: Converter', () => {
  describe('toRoman', () => {
    describe('conversiones básicas', () => {
      it.each([
        [1, 'I'],
        [5, 'V'],
        [10, 'X'],
        [50, 'L'],
        [100, 'C'],
        [500, 'D'],
        [1000, 'M'],
      ])('debe convertir %i → %s', (input, expected) => {
        expect(toRoman(input)).toBe(expected);
      });
    });

    describe('notación sustractiva', () => {
      it.each([
        [4, 'IV'],
        [9, 'IX'],
        [40, 'XL'],
        [90, 'XC'],
        [400, 'CD'],
        [900, 'CM'],
      ])('debe convertir %i → %s', (input, expected) => {
        expect(toRoman(input)).toBe(expected);
      });
    });

    describe('números complejos', () => {
      it.each([
        [1994, 'MCMXCIV'],
        [3999, 'MMMCMXCIX'],
        [58, 'LVIII'],
        [1984, 'MCMLXXXIV'],
        [2024, 'MMXXIV'],
        [1776, 'MDCCLXXVI'],
      ])('debe convertir %i → %s', (input, expected) => {
        expect(toRoman(input)).toBe(expected);
      });
    });

    describe('errores fuera de rango', () => {
      it.each([
        [0, 'cero'],
        [4000, 'mayor a 3999'],
        [-1, 'negativo'],
        [-100, 'muy negativo'],
      ])('debe lanzar ConversionError para %i (%s)', (input) => {
        expect(() => toRoman(input)).toThrow(ConversionError);
        expect(() => toRoman(input)).toThrow(/between 1 and 3999/);
      });
    });
  });

  describe('toArabic', () => {
    describe('conversiones básicas', () => {
      it.each([
        ['I', 1],
        ['V', 5],
        ['X', 10],
        ['L', 50],
        ['C', 100],
        ['D', 500],
        ['M', 1000],
      ])('debe convertir %s → %i', (input, expected) => {
        expect(toArabic(input)).toBe(expected);
      });
    });

    describe('notación sustractiva', () => {
      it.each([
        ['IV', 4],
        ['IX', 9],
        ['XL', 40],
        ['XC', 90],
        ['CD', 400],
        ['CM', 900],
      ])('debe convertir %s → %i', (input, expected) => {
        expect(toArabic(input)).toBe(expected);
      });
    });

    describe('números complejos', () => {
      it.each([
        ['MCMXCIV', 1994],
        ['MMMCMXCIX', 3999],
        ['LVIII', 58],
        ['MCMLXXXIV', 1984],
        ['MMXXIV', 2024],
        ['MDCCLXXVI', 1776],
      ])('debe convertir %s → %i', (input, expected) => {
        expect(toArabic(input)).toBe(expected);
      });
    });

    describe('errores por romano inválido', () => {
      it.each([
        ['IIII', 'repetición inválida de I'],
        ['VV', 'repetición inválida de V'],
        ['ABC', 'caracteres inválidos'],
        ['', 'cadena vacía'],
        ['MMMM', 'más de tres M'],
        ['LL', 'repetición inválida de L'],
      ])('debe lanzar ConversionError para %s (%s)', (input) => {
        expect(() => toArabic(input)).toThrow(ConversionError);
      });
    });
  });
});
