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

  describe('Casos de error - Validación (422) - RFC 7807', () => {
    it.each([
      [
        'ABC123',
        '/problems/validation-error',
        'Error de Validación',
        'no es ni un número válido ni un numeral romano',
      ],
      ['IIII', '/problems/invalid-numeral', 'Numeral Romano Inválido', 'Numeral romano inválido'],
      [
        '-5',
        '/problems/validation-error',
        'Error de Validación',
        'no es ni un número válido ni un numeral romano',
      ],
    ])('debe retornar 422 RFC 7807 para %s', async (value, expectedType, expectedTitle, expectedDetailSubstring) => {
      const request = createRequest({ value });
      const response = await POST(request);
      const data = await response.json();

      // Verificar status HTTP
      expect(response.status).toBe(422);

      // Verificar Content-Type RFC 7807
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      // Verificar estructura RFC 7807
      expect(data.type).toBe(expectedType);
      expect(data.title).toBe(expectedTitle);
      expect(data.status).toBe(422);
      expect(data.detail).toContain(expectedDetailSubstring);
      expect(data.instance).toBe('/api/convert');
    });
  });

  describe('Casos de error - Rango (422) - RFC 7807', () => {
    it.each([
      ['0', 'cero'],
      ['4000', 'mayor a 3999'],
      ['10000', 'muy grande'],
    ])('debe retornar 422 RFC 7807 para número %s (%s)', async (value, _descripcion) => {
      const request = createRequest({ value });
      const response = await POST(request);
      const data = await response.json();

      // Verificar status HTTP
      expect(response.status).toBe(422);

      // Verificar Content-Type RFC 7807
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      // Verificar estructura RFC 7807
      expect(data.type).toBe('/problems/range-error');
      expect(data.title).toBe('Valor Fuera de Rango');
      expect(data.status).toBe(422);
      expect(data.detail).toContain('entre 1 y 3999');
      expect(data.instance).toBe('/api/convert');
    });
  });

  describe('Casos de error - Solicitud Malformada (400) - RFC 7807', () => {
    it.each([
      [{}, 'value faltante'],
      [{ value: 123 }, 'tipo número'],
      [{ value: null }, 'null'],
      [{ value: undefined }, 'undefined'],
      [{ value: ['array'] }, 'array'],
      [{ value: { nested: 'object' } }, 'objeto anidado'],
    ])('debe retornar 400 RFC 7807 para tipo inválido: %s (%s)', async (body, _descripcion) => {
      const request = createRequest(body);
      const response = await POST(request);
      const data = await response.json();

      // Verificar status HTTP
      expect(response.status).toBe(400);

      // Verificar Content-Type RFC 7807
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');

      // Verificar estructura RFC 7807
      expect(data.type).toBe('/problems/malformed-request');
      expect(data.title).toBe('Solicitud Malformada');
      expect(data.status).toBe(400);
      expect(data.detail).toBeDefined();
      expect(data.instance).toBe('/api/convert');
    });
  });
});
