/**
 * RFC 7807 - Problem Details for HTTP APIs
 * https://datatracker.ietf.org/doc/html/rfc7807
 */

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

// URIs de tipos de problemas
export const PROBLEM_TYPES = {
  VALIDATION_ERROR: '/problems/validation-error',
  RANGE_ERROR: '/problems/range-error',
  INVALID_NUMERAL: '/problems/invalid-numeral',
  MALFORMED_REQUEST: '/problems/malformed-request',
  SERVER_ERROR: '/problems/internal-error',
} as const;

// Títulos de problemas en español
export const PROBLEM_TITLES = {
  VALIDATION_ERROR: 'Error de Validación',
  RANGE_ERROR: 'Valor Fuera de Rango',
  INVALID_NUMERAL: 'Numeral Romano Inválido',
  MALFORMED_REQUEST: 'Solicitud Malformada',
  SERVER_ERROR: 'Error Interno del Servidor',
} as const;

export function createProblemDetails(
  type: string,
  title: string,
  status: number,
  detail: string,
  instance?: string
): ProblemDetails {
  return {
    type,
    title,
    status,
    detail,
    ...(instance && { instance }),
  };
}
