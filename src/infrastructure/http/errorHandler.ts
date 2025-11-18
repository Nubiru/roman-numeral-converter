/**
 * Middleware centralizado para manejo de excepciones RFC 7807
 * Transforma errores de dominio/aplicación en respuestas Problem Details
 */

import { ConversionError, ValidationError } from '@shared/errors';
import { NextResponse } from 'next/server';
import { PROBLEM_TITLES, PROBLEM_TYPES, type ProblemDetails } from './problemDetails';

const PROBLEM_JSON_HEADERS = {
  'Content-Type': 'application/problem+json',
};

/**
 * Wrapper que captura excepciones y las transforma en respuestas RFC 7807
 * @param handler - Función que contiene la lógica del endpoint
 * @param instance - URI del endpoint (ej: '/api/convert')
 */
export function withErrorHandler<T>(
  handler: () => T | Promise<T>,
  instance: string
): Promise<NextResponse> {
  return handleErrors(handler, instance);
}

async function handleErrors<T>(
  handler: () => T | Promise<T>,
  instance: string
): Promise<NextResponse> {
  try {
    const result = await handler();
    return result as NextResponse;
  } catch (error) {
    return transformErrorToResponse(error, instance);
  }
}

/**
 * Transforma cualquier error en una respuesta RFC 7807 Problem Details
 */
export function transformErrorToResponse(error: unknown, instance: string): NextResponse {
  if (error instanceof ValidationError) {
    return createProblemResponse(
      {
        type: error.problemType,
        title: error.problemTitle,
        status: error.statusCode,
        detail: error.message,
        instance,
      },
      error.statusCode
    );
  }

  if (error instanceof ConversionError) {
    return createProblemResponse(
      {
        type: error.problemType,
        title: error.problemTitle,
        status: error.statusCode,
        detail: error.message,
        instance,
      },
      error.statusCode
    );
  }

  // Errores inesperados
  console.error('Error inesperado:', error);
  return createProblemResponse(
    {
      type: PROBLEM_TYPES.SERVER_ERROR,
      title: PROBLEM_TITLES.SERVER_ERROR,
      status: 500,
      detail: 'Se ha producido un error inesperado',
      instance,
    },
    500
  );
}

/**
 * Crea una respuesta NextResponse con formato Problem Details
 */
export function createProblemResponse(
  problemDetails: ProblemDetails,
  status: number
): NextResponse {
  return NextResponse.json(problemDetails, {
    status,
    headers: PROBLEM_JSON_HEADERS,
  });
}

/**
 * Crea una respuesta de error para solicitudes malformadas (400)
 */
export function createMalformedRequestResponse(detail: string, instance: string): NextResponse {
  return createProblemResponse(
    {
      type: PROBLEM_TYPES.MALFORMED_REQUEST,
      title: PROBLEM_TITLES.MALFORMED_REQUEST,
      status: 400,
      detail,
      instance,
    },
    400
  );
}
