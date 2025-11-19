import { NextRequest } from 'next/server';
import { GET as getA2R } from '@/app/a2r/route';
import { GET as getR2A } from '@/app/r2a/route';

// Helper para crear NextRequest con query params
function createA2RRequest(arabic?: string): NextRequest {
  const url = arabic
    ? `http://localhost:3000/a2r?arabic=${encodeURIComponent(arabic)}`
    : 'http://localhost:3000/a2r';
  return new NextRequest(url, { method: 'GET' });
}

function createR2ARequest(roman?: string): NextRequest {
  const url = roman
    ? `http://localhost:3000/r2a?roman=${encodeURIComponent(roman)}`
    : 'http://localhost:3000/r2a';
  return new NextRequest(url, { method: 'GET' });
}

describe('API Legacy: GET /a2r', () => {
  describe('Casos de éxito', () => {
    it.each([
      ['1', 'I', 'valor mínimo'],
      ['42', 'XLII', 'valor intermedio'],
      ['1994', 'MCMXCIV', 'año romano complejo'],
      ['3999', 'MMMCMXCIX', 'valor máximo'],
      ['100', 'C', 'centena'],
      ['500', 'D', 'quingentésimo'],
      ['1000', 'M', 'millar'],
    ])('debe convertir %s → %s (%s)', async (arabic, expectedRoman, _descripcion) => {
      const request = createA2RRequest(arabic);
      const response = await getA2R(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ roman: expectedRoman });
    });
  });

  describe('Casos de error - Parámetro faltante (400)', () => {
    it('debe retornar 400 cuando falta parámetro arabic', async () => {
      const request = createA2RRequest();
      const response = await getA2R(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.detail).toContain("'arabic' es requerido");
      expect(data.instance).toBe('/a2r');
    });
  });

  describe('Casos de error - Valor inválido (400)', () => {
    it.each([
      ['abc', 'texto no numérico'],
      ['12.5', 'número decimal'],
      ['', 'cadena vacía'],
      ['1e3', 'notación científica'],
      [' 42', 'espacio inicial'],
      ['42 ', 'espacio final'],
    ])('debe retornar 400 para arabic=%s (%s)', async (arabic, _descripcion) => {
      const request = createA2RRequest(arabic);
      const response = await getA2R(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.instance).toBe('/a2r');
    });
  });

  describe('Casos de error - Rango inválido (400)', () => {
    it.each([
      ['0', 'cero'],
      ['-1', 'negativo'],
      ['4000', 'mayor a 3999'],
      ['10000', 'muy grande'],
    ])('debe retornar 400 para arabic=%s (%s)', async (arabic, _descripcion) => {
      const request = createA2RRequest(arabic);
      const response = await getA2R(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.detail).toContain('entre 1 y 3999');
      expect(data.instance).toBe('/a2r');
    });
  });
});

describe('API Legacy: GET /r2a', () => {
  describe('Casos de éxito', () => {
    it.each([
      ['I', 1, 'valor mínimo'],
      ['XLII', 42, 'valor intermedio'],
      ['MCMXCIV', 1994, 'año romano complejo'],
      ['MMMCMXCIX', 3999, 'valor máximo'],
      ['C', 100, 'centena'],
      ['D', 500, 'quingentésimo'],
      ['M', 1000, 'millar'],
      ['iv', 4, 'minúsculas'],
      ['xLiI', 42, 'mayúsculas mixtas'],
    ])('debe convertir %s → %d (%s)', async (roman, expectedArabic, _descripcion) => {
      const request = createR2ARequest(roman);
      const response = await getR2A(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ arabic: expectedArabic });
    });
  });

  describe('Casos de error - Parámetro faltante (400)', () => {
    it('debe retornar 400 cuando falta parámetro roman', async () => {
      const request = createR2ARequest();
      const response = await getR2A(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.detail).toContain("'roman' es requerido");
      expect(data.instance).toBe('/r2a');
    });
  });

  describe('Casos de error - Caracteres inválidos (400)', () => {
    it.each([
      ['123', 'números'],
      ['ABC', 'letras no romanas'],
      ['XIIA', 'letra A no válida'],
      ['X Y', 'espacio en medio'],
      ['', 'cadena vacía'],
    ])('debe retornar 400 para roman=%s (%s)', async (roman, _descripcion) => {
      const request = createR2ARequest(roman);
      const response = await getR2A(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.instance).toBe('/r2a');
    });
  });

  describe('Casos de error - Patrón romano inválido (400)', () => {
    it.each([
      ['IIII', 'cuatro I consecutivos'],
      ['VV', 'dos V consecutivos'],
      ['XXXX', 'cuatro X consecutivos'],
      ['LL', 'dos L consecutivos'],
      ['CCCC', 'cuatro C consecutivos'],
      ['DD', 'dos D consecutivos'],
      ['MMMM', 'cuatro M consecutivos'],
      ['IC', 'resta inválida I-C'],
      ['IL', 'resta inválida I-L'],
      ['XD', 'resta inválida X-D'],
      ['XM', 'resta inválida X-M'],
    ])('debe retornar 400 para roman=%s (%s)', async (roman, _descripcion) => {
      const request = createR2ARequest(roman);
      const response = await getR2A(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.type).toBe('/problems/bad-request');
      expect(data.title).toBe('Solicitud Inválida');
      expect(data.status).toBe(400);
      expect(data.instance).toBe('/r2a');
    });
  });
});
