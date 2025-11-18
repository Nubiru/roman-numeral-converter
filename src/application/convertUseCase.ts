import { toArabic, toRoman } from '@domain/converter';
import { ValidationError } from '@shared/errors';
import type { IConvertRequest, IConvertResponse } from '@shared/types';

export function convertUseCase(request: IConvertRequest): IConvertResponse {
  const { input, direction = 'auto' } = request;

  if (!input || input.trim() === '') {
    throw new ValidationError('La entrada no puede estar vacía');
  }

  const trimmedInput = input.trim();

  // Auto-detect direction
  let actualDirection = direction;
  if (direction === 'auto') {
    actualDirection = detectDirection(trimmedInput);
  }

  // Execute conversion based on direction
  if (actualDirection === 'toRoman') {
    return convertToRoman(trimmedInput);
  } else if (actualDirection === 'toNumeric') {
    return convertToNumeric(trimmedInput);
  }

  // This should never happen with TypeScript, but handle invalid direction gracefully
  throw new ValidationError(`Dirección inválida: ${direction}`);
}

function detectDirection(input: string): 'toRoman' | 'toNumeric' {
  // Check if input looks like a number (all digits)
  const looksLikeNumber = /^\d+$/.test(input);

  // Check if input looks like Roman (all valid Roman numeral characters)
  const looksLikeRoman = /^[IVXLCDM]+$/.test(input);

  if (looksLikeNumber && looksLikeRoman) {
    // Single character that could be both (like 'I' could be Roman I or numeric 1)
    // Shouldn't happen with our validation, but handle gracefully
    throw new ValidationError('Entrada ambigua: no se puede detectar la dirección');
  }

  if (looksLikeNumber) return 'toRoman';
  if (looksLikeRoman) return 'toNumeric';

  // Input is neither numeric-looking nor Roman-looking (like '12X', 'abc', etc.)
  throw new ValidationError('La entrada no es ni un número válido ni un numeral romano válido');
}

function convertToRoman(input: string): IConvertResponse {
  // Parse the number - if it's not parseable, it's not a valid number
  const num = Number.parseInt(input, 10);
  if (Number.isNaN(num) || num.toString() !== input) {
    throw new ValidationError('La entrada debe ser un número válido para conversión a romano');
  }

  // Let domain layer handle range validation (will throw ConversionError if out of range)
  const output = toRoman(num);

  return {
    input,
    output,
    direction: 'toRoman',
  };
}

function convertToNumeric(input: string): IConvertResponse {
  // For explicit toNumeric, validate that input at least LOOKS like Roman
  const looksLikeRoman = /^[IVXLCDM]+$/.test(input);
  if (!looksLikeRoman) {
    throw new ValidationError(
      'La entrada debe ser un numeral romano válido para conversión a numérico'
    );
  }

  // Let domain layer handle pattern validation (will throw ConversionError if invalid pattern)
  const num = toArabic(input);
  const output = num.toString();

  return {
    input,
    output,
    direction: 'toNumeric',
  };
}
