import { toRoman, toArabic } from '@domain/converter';
import { ValidationError } from '@shared/errors';
import type { IConvertRequest, IConvertResponse } from '@shared/types';

export function convertUseCase(request: IConvertRequest): IConvertResponse {
  const { input, direction = 'auto' } = request;

  if (!input || input.trim() === '') {
    throw new ValidationError('Input cannot be empty');
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
  throw new ValidationError(`Invalid direction: ${direction}`);
}

function detectDirection(input: string): 'toRoman' | 'toNumeric' {
  // Check if input looks like a number (all digits)
  const looksLikeNumber = /^\d+$/.test(input);

  // Check if input looks like Roman (all valid Roman numeral characters)
  const looksLikeRoman = /^[IVXLCDM]+$/.test(input);

  if (looksLikeNumber && looksLikeRoman) {
    // Single character that could be both (like 'I' could be Roman I or numeric 1)
    // Shouldn't happen with our validation, but handle gracefully
    throw new ValidationError('Ambiguous input: cannot auto-detect direction');
  }

  if (looksLikeNumber) return 'toRoman';
  if (looksLikeRoman) return 'toNumeric';

  // Input is neither numeric-looking nor Roman-looking (like '12X', 'abc', etc.)
  throw new ValidationError('Input is neither a valid number nor a valid Roman numeral');
}

function convertToRoman(input: string): IConvertResponse {
  // Parse the number - if it's not parseable, it's not a valid number
  const num = parseInt(input, 10);
  if (isNaN(num) || num.toString() !== input) {
    throw new ValidationError('Input must be a valid number for toRoman conversion');
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
    throw new ValidationError('Input must be a valid Roman numeral for toNumeric conversion');
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
