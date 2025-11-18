import {
  createProblemDetails,
  PROBLEM_TITLES,
  PROBLEM_TYPES,
} from '@infrastructure/http/problemDetails';

describe('problemDetails', () => {
  describe('createProblemDetails', () => {
    it.each([
      [
        PROBLEM_TYPES.VALIDATION_ERROR,
        PROBLEM_TITLES.VALIDATION_ERROR,
        422,
        'La entrada no puede estar vacía',
        '/api/convert',
      ],
      [
        PROBLEM_TYPES.RANGE_ERROR,
        PROBLEM_TITLES.RANGE_ERROR,
        422,
        'El número debe estar entre 1 y 3999',
        '/api/convert',
      ],
      [
        PROBLEM_TYPES.INVALID_NUMERAL,
        PROBLEM_TITLES.INVALID_NUMERAL,
        422,
        'Numeral romano inválido: IIII',
        '/api/convert',
      ],
      [
        PROBLEM_TYPES.MALFORMED_REQUEST,
        PROBLEM_TITLES.MALFORMED_REQUEST,
        400,
        'El campo value es requerido',
        '/api/convert',
      ],
      [
        PROBLEM_TYPES.SERVER_ERROR,
        PROBLEM_TITLES.SERVER_ERROR,
        500,
        'Se ha producido un error inesperado',
        '/api/convert',
      ],
    ])('debe crear ProblemDetails para tipo %s', (type, title, status, detail, instance) => {
      const result = createProblemDetails(type, title, status, detail, instance);

      expect(result).toEqual({
        type,
        title,
        status,
        detail,
        instance,
      });
    });

    it.each([
      [undefined, 'undefined'],
      ['', 'string vacío'],
    ])('debe omitir instance cuando es %s', (instanceValue, _desc) => {
      const result = createProblemDetails(
        PROBLEM_TYPES.VALIDATION_ERROR,
        PROBLEM_TITLES.VALIDATION_ERROR,
        422,
        'Test detail',
        instanceValue
      );

      expect(result).not.toHaveProperty('instance');
    });

    it('debe retornar estructura RFC 7807 válida con tipos personalizados', () => {
      const result = createProblemDetails(
        '/problems/custom-error',
        'Custom Error',
        418,
        'I am a teapot',
        '/api/teapot'
      );

      expect(typeof result.type).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(typeof result.status).toBe('number');
      expect(typeof result.detail).toBe('string');
      expect(typeof result.instance).toBe('string');
    });
  });
});
