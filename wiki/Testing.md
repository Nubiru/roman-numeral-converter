# Estrategia de Testing

Enfoque de Desarrollo Dirigido por Pruebas y objetivos de cobertura.

---

## Filosofía: Test-Driven Development (TDD)

Ciclo **ROJO-VERDE-REFACTOR** para todo el código:

1. **ROJO**: Escribir test que falle primero
2. **VERDE**: Escribir código mínimo para que el test pase
3. **REFACTOR**: Limpiar código mientras los tests permanecen verdes

---

## Pirámide de Tests

```
         ┌──────────────┐
         │ Integración  │  15 tests (20%)
         │  (Supertest) │
         ├──────────────┤
         │  Unitarios   │  50+ tests (80%)
         │    (Jest)    │
         └──────────────┘
```

**Enfoque**: Testing unitario intensivo (rápido), menos tests de integración (lentos pero necesarios).

---

## Objetivos de Cobertura

| Capa | Objetivo | Real | Estado |
|------|----------|------|--------|
| **Dominio** | 100% | 100% | ✅ |
| **Aplicación** | 95% | 96% | ✅ |
| **Infraestructura** | 80% | 85% | ✅ |
| **General** | 90% | 93% | ✅ |

**Enforcement**: Jest falla el build si la cobertura cae por debajo de los objetivos.

---

## Estructura de Tests

```
tests/
├── unit/
│   ├── domain/
│   │   ├── converter.test.ts      (24 tests)
│   │   └── validation.test.ts     (16 tests)
│   └── application/
│       └── convertUseCase.test.ts (20 tests)
└── integration/
    └── api/
        └── convert.test.ts         (15 tests)
```

---

## Tests Unitarios (Capa de Dominio)

**Ejemplo**: `converter.test.ts`

```typescript
describe('toRoman', () => {
  test('should convert basic numerals', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(5)).toBe('V');
  });

  test('should handle subtractive notation', () => {
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(9)).toBe('IX');
  });

  test('should throw for out of range', () => {
    expect(() => toRoman(0)).toThrow(ConversionError);
  });
});
```

**Cobertura**: 100% de la lógica de dominio (funciones puras, fáciles de testear).

---

## Tests de Integración (Capa API)

**Ejemplo**: `convert.test.ts`

```typescript
describe('POST /api/convert', () => {
  test('should convert numeric to Roman', async () => {
    const response = await request(handler)
      .post('/api/convert')
      .send({ input: '42' });

    expect(response.status).toBe(200);
    expect(response.body.output).toBe('XLII');
  });
});
```

**Cobertura**: Comportamiento end-to-end de la API con llamadas HTTP reales.

---

## Comandos de Test

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Reporte de cobertura
npm run test:coverage

# Modo CI (estricto)
npm run test:ci
```

---

## Controles de Calidad

**Hook Pre-commit**:
- ✅ Linter pasa
- ✅ Type-check pasa
- ✅ Formatter pasa

**Hook Pre-push**:
- ✅ Todos los tests pasan
- ✅ Umbrales de cobertura cumplidos
- ✅ Build exitoso

**Pipeline CI**:
- ✅ Tests pasan en Ubuntu
- ✅ Reporte de cobertura subido
- ✅ Artefactos de build creados

---

## Casos Límite Testeados

- Valores mínimo/máximo (1, 3999)
- Entradas inválidas (IIII, ABC, vacío)
- Fuera de rango (0, 4000, negativos)
- Notación sustractiva (IV, IX, XL, XC, CD, CM)
- Métodos HTTP (POST, GET, OPTIONS)
- Preflight CORS
- JSON malformado
- Campos faltantes

---

**Última Actualización**: 2025-10-24
