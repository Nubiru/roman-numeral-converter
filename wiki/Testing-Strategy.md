# Estrategia de Testing

Enfoque de Test-Driven Development y objetivos de cobertura.

---

## Filosofía: Test-Driven Development (TDD)

Ciclo **RED-GREEN-REFACTOR** para todo el código:

1. **RED**: Escribir test fallido primero
2. **GREEN**: Escribir código mínimo para pasar el test
3. **REFACTOR**: Limpiar código manteniendo tests verdes

---

## Pirámide de Tests

```
         ┌──────────────┐
         │ Integración  │  18 tests (10%)
         │    (API)     │
         ├──────────────┤
         │  Componentes │  34 tests (17%)
         │    (React)   │
         ├──────────────┤
         │    Unitarios │  150+ tests (73%)
         │     (Jest)   │
         └──────────────┘
```

**Enfoque**: Tests unitarios pesados (rápidos), menos tests de integración (lentos pero necesarios).

---

## Objetivos de Cobertura

| Capa | Objetivo | Actual | Estado |
|------|----------|--------|--------|
| **Dominio** | 100% | 100% | ✅ |
| **Aplicación** | 95% | 94% | ✅ |
| **Infraestructura** | 100% | 100% | ✅ |
| **Componentes** | 100% | 100% | ✅ |
| **Lib** | 100% | 100% | ✅ |
| **Global** | 90% | 98.76% | ✅ |

**Enforcement**: Jest falla el build si la cobertura cae debajo del 90%.

---

## Estructura de Tests

```
tests/
├── unit/
│   ├── domain/
│   │   ├── converter.test.ts      (40+ tests)
│   │   └── validation.test.ts     (30+ tests)
│   ├── application/
│   │   └── convertUseCase.test.ts (25+ tests)
│   └── infrastructure/
│       └── http/
│           ├── errorHandler.test.ts    (12 tests)
│           └── problemDetails.test.ts  (8 tests)
├── integration/
│   └── api/
│       └── convert.test.ts        (18 tests)
├── components/
│   └── ConverterForm.test.tsx     (34 tests)
└── lib/
    └── error-messages.test.ts     (22 tests)
```

---

## Tests Unitarios (Capa de Dominio)

**Ejemplo**: `converter.test.ts`

```typescript
describe('toRoman', () => {
  it.each([
    [1, 'I', 'valor mínimo'],
    [5, 'V', 'cinco'],
    [10, 'X', 'diez'],
    [50, 'L', 'cincuenta'],
    [100, 'C', 'cien'],
    [500, 'D', 'quinientos'],
    [1000, 'M', 'mil'],
  ])('debe convertir %i → %s (%s)', (input, expected) => {
    expect(toRoman(input)).toBe(expected);
  });

  it.each([
    [4, 'IV', 'notación sustractiva'],
    [9, 'IX', 'nueve'],
    [40, 'XL', 'cuarenta'],
    [90, 'XC', 'noventa'],
    [400, 'CD', 'cuatrocientos'],
    [900, 'CM', 'novecientos'],
  ])('debe manejar notación sustractiva %i → %s', (input, expected) => {
    expect(toRoman(input)).toBe(expected);
  });

  it.each([
    [0, 'cero'],
    [-1, 'negativo'],
    [4000, 'mayor a 3999'],
  ])('debe lanzar error para %i (%s)', (input) => {
    expect(() => toRoman(input)).toThrow(ConversionError);
  });
});
```

**Cobertura**: 100% de lógica de dominio (funciones puras, fácil de testear).

---

## Tests de Integración (Capa API)

**Ejemplo**: `convert.test.ts`

```typescript
describe('POST /api/convert', () => {
  it.each([
    ['42', 'XLII', 'toRoman', 'arábigo a romano'],
    ['XLII', 42, 'toArabic', 'romano a arábigo'],
    ['3999', 'MMMCMXCIX', 'toRoman', 'valor máximo'],
  ])('debe convertir %s → %s (%s)', async (value, expectedResult, expectedType) => {
    const request = createRequest({ value });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.result).toBe(expectedResult);
    expect(data.type).toBe(expectedType);
  });

  describe('Errores RFC 7807', () => {
    it('debe retornar 422 para valor fuera de rango', async () => {
      const request = createRequest({ value: '4000' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(422);
      expect(response.headers.get('Content-Type')).toBe('application/problem+json');
      expect(data.type).toBe('/problems/range-error');
    });
  });
});
```

**Cobertura**: Comportamiento end-to-end de la API con peticiones HTTP reales.

---

## Tests Parametrizados

Usamos `it.each` para organizar casos de prueba:

```typescript
it.each([
  // [input, expected, descripción]
  ['4000', '/problems/range-error', 'fuera de rango'],
  ['IIII', '/problems/invalid-numeral', 'numeral inválido'],
  ['ABC', '/problems/validation-error', 'entrada no reconocida'],
])('debe retornar error %s para %s', async (value, expectedType) => {
  // test
});
```

**Beneficios**:
- Código DRY
- Fácil agregar casos
- Output legible en consola
- 4+ casos normales y 4+ edge cases por función

---

## Mocks y Aislamiento

### Cuándo NO mockear
- Tests de dominio (funciones puras)
- Tests de aplicación (orquestación)

### Cuándo mockear
- `fetch` en tests de componentes
- `toast` de sonner
- `console.error` para errores esperados

```typescript
// Mock de fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock de toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
```

---

## Comandos de Test

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Reporte de cobertura
npm run test:coverage

# QA completo (lint + types + tests)
npm run qa:precommit
```

---

## Quality Gates

### Pre-commit
- ✅ Linter pasa (Biome)
- ✅ Type-check pasa
- ✅ Formatter pasa

### CI Pipeline
- ✅ Tests pasan
- ✅ Cobertura > 90%
- ✅ Build exitoso

---

## Casos Edge Testeados

- Valores mínimo/máximo (1, 3999)
- Entradas inválidas (IIII, ABC, vacío)
- Fuera de rango (0, 4000, negativos)
- Notación sustractiva (IV, IX, XL, XC, CD, CM)
- Métodos HTTP (POST, OPTIONS)
- CORS preflight
- JSON malformado
- Campos faltantes
- Tipos incorrectos

---

## Métricas

- **214 tests** totales
- **98.76%** cobertura global
- **8 suites** de tests
- **< 4 segundos** tiempo de ejecución

---

**Última Actualización**: 2025-11-18
