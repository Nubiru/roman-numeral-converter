import { PROBLEM_TITLES, PROBLEM_TYPES } from '@infrastructure/http/problemDetails';

export class ConversionError extends Error {
  problemType: string;
  problemTitle: string;
  statusCode: number;

  constructor(message: string, errorType: 'range' | 'invalid-numeral' = 'invalid-numeral') {
    super(message);
    this.name = 'ConversionError';
    this.statusCode = 422;

    if (errorType === 'range') {
      this.problemType = PROBLEM_TYPES.RANGE_ERROR;
      this.problemTitle = PROBLEM_TITLES.RANGE_ERROR;
    } else {
      this.problemType = PROBLEM_TYPES.INVALID_NUMERAL;
      this.problemTitle = PROBLEM_TITLES.INVALID_NUMERAL;
    }
  }
}

export class ValidationError extends Error {
  problemType: string;
  problemTitle: string;
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.problemType = PROBLEM_TYPES.VALIDATION_ERROR;
    this.problemTitle = PROBLEM_TITLES.VALIDATION_ERROR;
    this.statusCode = 422;
  }
}
