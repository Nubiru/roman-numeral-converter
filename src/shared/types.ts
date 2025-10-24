export interface IConvertRequest {
  input: string;
  direction?: 'toRoman' | 'toNumeric' | 'auto';
}

export interface IConvertResponse {
  input: string;
  output: string;
  direction: 'toRoman' | 'toNumeric';
}

export type RomanNumeral = string;
export type ArabicNumber = number;
