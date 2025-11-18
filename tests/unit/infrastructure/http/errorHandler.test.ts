import {
  createMalformedRequestResponse,
  createProblemResponse,
  transformErrorToResponse,
  withErrorHandler,
} from '@infrastructure/http/errorHandler';
import { ConversionError, ValidationError } from '@shared/errors';
import { NextResponse } from 'next/server';

describe('errorHandler', () => {
  const instance = '/api/test';

  describe('withErrorHandler', () => {
    it('debe retornar el resultado del handler cuando no hay errores', async () => {
      const mockResponse = NextResponse.json({ success: true }, { status: 200 });
      const handler = () => mockResponse;

      const result = await withErrorHandler(handler, instance);

      expect(result).toBe(mockResponse);
    });

    it.each([
      [
        'ValidationError',
        new ValidationError('Entrada inválida'),
        422,
        '/problems/validation-error',
        'Error de Validación',
        'Entrada inválida',
      ],
      [
        'ConversionError (invalid-numeral)',
        new ConversionError('Numeral romano inválido: IIII'),
        422,
        '/problems/invalid-numeral',
        'Numeral Romano Inválido',
        'Numeral romano inválido: IIII',
      ],
      [
        'ConversionError (range)',
        new ConversionError('Número fuera de rango', 'range'),
        422,
        '/problems/range-error',
        'Valor Fuera de Rango',
        'Número fuera de rango',
      ],
    ])('debe capturar %s y retornar RFC 7807', async (_name, error, expectedStatus, expectedType, expectedTitle, expectedDetail) => {
      const handler = () => {
        throw error;
      };

      const result = await withErrorHandler(handler, instance);
      const data = await result.json();

      expect(result.status).toBe(expectedStatus);
      expect(data.type).toBe(expectedType);
      expect(data.title).toBe(expectedTitle);
      expect(data.status).toBe(expectedStatus);
      expect(data.detail).toBe(expectedDetail);
      expect(data.instance).toBe(instance);
    });

    it('debe capturar errores inesperados y retornar 500 RFC 7807', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const handler = () => {
        throw new Error('Error inesperado');
      };

      const result = await withErrorHandler(handler, instance);
      const data = await result.json();

      expect(result.status).toBe(500);
      expect(data.type).toBe('/problems/internal-error');
      expect(data.title).toBe('Error Interno del Servidor');
      expect(data.status).toBe(500);
      expect(data.detail).toBe('Se ha producido un error inesperado');
      expect(data.instance).toBe(instance);

      consoleSpy.mockRestore();
    });

    it('debe manejar handlers asíncronos exitosos', async () => {
      const mockResponse = NextResponse.json({ async: true }, { status: 200 });
      const handler = async () => {
        await Promise.resolve();
        return mockResponse;
      };

      const result = await withErrorHandler(handler, instance);

      expect(result).toBe(mockResponse);
    });

    it('debe capturar errores en handlers asíncronos', async () => {
      const handler = async () => {
        await Promise.resolve();
        throw new ValidationError('Error asíncrono');
      };

      const result = await withErrorHandler(handler, instance);
      const data = await result.json();

      expect(result.status).toBe(422);
      expect(data.detail).toBe('Error asíncrono');
    });
  });

  describe('transformErrorToResponse', () => {
    it.each([
      ['ValidationError', new ValidationError('Test validation'), 422],
      ['ConversionError', new ConversionError('Test conversion'), 422],
    ])('debe transformar %s a status %i', (_name, error, expectedStatus) => {
      const result = transformErrorToResponse(error, instance);
      expect(result.status).toBe(expectedStatus);
    });

    it('debe transformar errores desconocidos a 500', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = { message: 'Unknown error' };
      const result = transformErrorToResponse(error, instance);

      expect(result.status).toBe(500);
      consoleSpy.mockRestore();
    });
  });

  describe('createProblemResponse', () => {
    it('debe crear respuesta con estructura RFC 7807', async () => {
      const problemDetails = {
        type: '/problems/test',
        title: 'Test Error',
        status: 400,
        detail: 'Test detail',
        instance: '/api/test',
      };

      const result = createProblemResponse(problemDetails, 400);
      const data = await result.json();

      expect(result.status).toBe(400);
      expect(result.headers.get('Content-Type')).toBe('application/problem+json');
      expect(data).toEqual(problemDetails);
    });
  });

  describe('createMalformedRequestResponse', () => {
    it('debe crear respuesta 400 con formato RFC 7807', async () => {
      const result = createMalformedRequestResponse('Campo requerido faltante', instance);
      const data = await result.json();

      expect(result.status).toBe(400);
      expect(result.headers.get('Content-Type')).toBe('application/problem+json');
      expect(data.type).toBe('/problems/malformed-request');
      expect(data.title).toBe('Solicitud Malformada');
      expect(data.status).toBe(400);
      expect(data.detail).toBe('Campo requerido faltante');
      expect(data.instance).toBe(instance);
    });
  });
});
