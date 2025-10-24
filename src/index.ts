// Application Layer Exports
export { convertUseCase } from './application/convertUseCase';

// Domain Layer Exports
export { toRoman, toArabic } from './domain/converter';
export { isValidRoman, isValidArabic, validateRange } from './domain/validation';

// Shared Exports
export type { IConvertRequest, IConvertResponse, RomanNumeral, ArabicNumber } from './shared/types';
export { ConversionError, ValidationError } from './shared/errors';
