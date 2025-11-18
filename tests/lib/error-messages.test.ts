import {
  formatErrorForToast,
  getErrorConfig,
  isRFC7807Error,
  type ProblemDetailsResponse,
} from '@/lib/error-messages';

describe('error-messages', () => {
  describe('getErrorConfig', () => {
    it.each([
      ['/problems/range-error', 'Valor fuera de rango', 'números romanos clásicos'],
      ['/problems/invalid-numeral', 'Numeral romano inválido', 'Reglas:'],
      ['/problems/validation-error', 'Entrada no reconocida', 'Formatos válidos'],
      ['/problems/malformed-request', 'Solicitud incorrecta', 'texto o números válidos'],
      ['/problems/internal-error', 'Error del servidor', 'intenta nuevamente'],
    ])('debe retornar config para %s', (type, expectedTitle, tipSubstring) => {
      const config = getErrorConfig(type);

      expect(config.title).toBe(expectedTitle);
      expect(config.educationalTip).toContain(tipSubstring);
    });

    it.each([
      ['/problems/unknown-error', 'tipo desconocido'],
      ['', 'string vacío'],
    ])('debe retornar config por defecto para %s', (type) => {
      const config = getErrorConfig(type);

      expect(config.title).toBe('Error en la conversión');
      expect(config.educationalTip).toContain('número válido (1-3999)');
    });
  });

  describe('formatErrorForToast', () => {
    it.each([
      [
        '/problems/range-error',
        'No se puede convertir 4000: El número debe estar entre 1 y 3999',
        'Valor fuera de rango',
        '1 al 3999',
      ],
      [
        '/problems/invalid-numeral',
        'Numeral romano inválido: IIII',
        'Numeral romano inválido',
        'IV en vez de IIII',
      ],
      [
        '/problems/validation-error',
        'La entrada no es ni un número válido ni un numeral romano válido',
        'Entrada no reconocida',
        'I, V, X, L, C, D, M',
      ],
      [
        '/problems/malformed-request',
        'El campo value es requerido',
        'Solicitud incorrecta',
        'texto o números',
      ],
      [
        '/problems/internal-error',
        'Se ha producido un error inesperado',
        'Error del servidor',
        'intenta nuevamente',
      ],
      [
        '/problems/custom-error',
        'Custom detail message',
        'Error en la conversión',
        'número válido (1-3999)',
      ],
    ])('debe formatear %s correctamente', (type, detail, expectedTitle, tipSubstring) => {
      const errorData: ProblemDetailsResponse = {
        type,
        title: 'Any Title',
        status: type.includes('internal') ? 500 : type.includes('malformed') ? 400 : 422,
        detail,
      };

      const result = formatErrorForToast(errorData);

      expect(result.title).toBe(expectedTitle);
      expect(result.description).toBe(detail);
      expect(result.educationalTip).toContain(tipSubstring);
    });
  });

  describe('isRFC7807Error', () => {
    describe('casos válidos', () => {
      it.each([
        [
          {
            type: '/problems/error',
            title: 'Error',
            status: 422,
            detail: 'Test',
            instance: '/api/test',
          },
          'objeto completo',
        ],
        [{ type: '/problems/error', title: 'Error', status: 422, detail: 'Test' }, 'sin instance'],
      ])('debe retornar true para %s', (data, _desc) => {
        expect(isRFC7807Error(data)).toBe(true);
      });
    });

    describe('casos inválidos', () => {
      it.each([
        [null, 'null'],
        [undefined, 'undefined'],
        ['error', 'string'],
        [500, 'número'],
        [[], 'array'],
        [{}, 'objeto vacío'],
        [{ title: 'E', status: 422, detail: 'T' }, 'sin type'],
        [{ type: '/e', status: 422, detail: 'T' }, 'sin title'],
        [{ type: '/e', title: 'E', detail: 'T' }, 'sin status'],
        [{ type: '/e', title: 'E', status: 422 }, 'sin detail'],
        [{ type: 123, title: 'E', status: 422, detail: 'T' }, 'type no string'],
        [{ type: '/e', title: 'E', status: '422', detail: 'T' }, 'status no número'],
      ])('debe retornar false para %s', (data, _desc) => {
        expect(isRFC7807Error(data)).toBe(false);
      });
    });
  });
});
