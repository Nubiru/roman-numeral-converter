/**
 * Sistema de mensajes de error educativos para toasts
 * Mapea tipos RFC 7807 a mensajes claros en español con tips educativos
 */

export interface ErrorToastConfig {
  title: string;
  educationalTip: string;
}

export interface ProblemDetailsResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

/**
 * Mapeo de tipos RFC 7807 a configuraciones de toast educativo
 */
const ERROR_MESSAGES: Record<string, ErrorToastConfig> = {
  '/problems/range-error': {
    title: 'Valor fuera de rango',
    educationalTip:
      'Los números romanos clásicos solo representan valores del 1 al 3999. El cero no existía en el sistema romano.',
  },
  '/problems/invalid-numeral': {
    title: 'Numeral romano inválido',
    educationalTip:
      'Reglas: I, X, C, M se repiten máximo 3 veces. V, L, D no se repiten. Usa IV en vez de IIII, IX en vez de VIIII.',
  },
  '/problems/validation-error': {
    title: 'Entrada no reconocida',
    educationalTip:
      'Formatos válidos: números arábigos (1-3999) o numerales romanos usando solo I, V, X, L, C, D, M.',
  },
  '/problems/malformed-request': {
    title: 'Solicitud incorrecta',
    educationalTip: 'Asegúrate de ingresar solo texto o números válidos en el campo de entrada.',
  },
  '/problems/internal-error': {
    title: 'Error del servidor',
    educationalTip:
      'Ha ocurrido un error inesperado. Por favor, intenta nuevamente en unos momentos.',
  },
};

/**
 * Configuración por defecto para errores no mapeados
 */
const DEFAULT_ERROR_CONFIG: ErrorToastConfig = {
  title: 'Error en la conversión',
  educationalTip:
    'Verifica que tu entrada sea un número válido (1-3999) o un numeral romano correcto.',
};

/**
 * Obtiene la configuración de toast para un tipo de error RFC 7807
 * @param problemType - URI del tipo de problema (ej: '/problems/range-error')
 * @returns Configuración del toast con título y tip educativo
 */
export function getErrorConfig(problemType: string): ErrorToastConfig {
  return ERROR_MESSAGES[problemType] || DEFAULT_ERROR_CONFIG;
}

/**
 * Formatea un error RFC 7807 para mostrar en toast
 * @param errorData - Respuesta de error RFC 7807 de la API
 * @returns Objeto con título, descripción y tip educativo
 */
export function formatErrorForToast(errorData: ProblemDetailsResponse): {
  title: string;
  description: string;
  educationalTip: string;
} {
  const config = getErrorConfig(errorData.type);

  return {
    title: config.title,
    description: errorData.detail,
    educationalTip: config.educationalTip,
  };
}

/**
 * Verifica si una respuesta de error es del tipo RFC 7807
 * @param errorData - Datos de error de la API
 * @returns true si tiene estructura RFC 7807
 */
export function isRFC7807Error(errorData: unknown): errorData is ProblemDetailsResponse {
  if (!errorData || typeof errorData !== 'object') return false;

  const data = errorData as Record<string, unknown>;
  return (
    typeof data.type === 'string' &&
    typeof data.title === 'string' &&
    typeof data.status === 'number' &&
    typeof data.detail === 'string'
  );
}
