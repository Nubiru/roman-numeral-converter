import { NextRequest } from 'next/server';
import { POST } from '@/app/api/convert/route';

// Helper para crear NextRequest
function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('API: POST /api/convert', () => {
  describe('Casos de éxito', () => {
    it.each([
      ['42', 'XLII', 'toRoman', 'arábigo a romano'],
      ['XLII', 42, 'toArabic', 'romano a arábigo'],
      ['MCMXCIV', 1994, 'toArabic', 'romano complejo'],
      ['1', 'I', 'toRoman', 'valor mínimo'],
      ['3999', 'MMMCMXCIX', 'toRoman', 'valor máximo'],
      ['  XIV  ', 14, 'toArabic', 'con espacios (trim)'],
    ])('debe convertir %s → %s (%s)', async (value, expectedResult, expectedType, _descripcion) => {
      const request = createRequest({ value });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.result).toBe(expectedResult);
      expect(data.type).toBe(expectedType);
    });
  });

  describe('Casos de error - Validación', () => {
    it.each([
      ['ABC123', 'neither a valid number nor', 'entrada inválida'],
      ['IIII', 'Invalid Roman numeral', 'romano inválido'],
      ['-5', 'neither a valid number nor', 'negativo (no numérico)'],
    ])('debe retornar 400 para %s: "%s"', async (value, expectedErrorSubstring) => {
      const request = createRequest({ value });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain(expectedErrorSubstring);
    });
  });

  describe('Casos de error - Rango', () => {
    it.each([
      ['0', 'between 1 and 3999', 'cero'],
      ['4000', 'between 1 and 3999', 'mayor a 3999'],
      ['10000', 'between 1 and 3999', 'muy grande'],
    ])('debe retornar 400 para número %s', async (value, expectedErrorSubstring) => {
      const request = createRequest({ value });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain(expectedErrorSubstring);
    });
  });

  describe('Casos de error - Tipos inválidos', () => {
    it.each([
      [{}, 'value faltante'],
      [{ value: 123 }, 'tipo número'],
      [{ value: null }, 'null'],
      [{ value: undefined }, 'undefined'],
      [{ value: ['array'] }, 'array'],
      [{ value: { nested: 'object' } }, 'objeto anidado'],
    ])('debe retornar 400 para tipo inválido: %s', async (body, _descripcion) => {
      const request = createRequest(body);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});
