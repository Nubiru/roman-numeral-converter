# API Convertidor de Números Romanos

[![Build Status](https://github.com/Nubiru/roman-numeral-converter/workflows/CI/badge.svg)](https://github.com/Nubiru/roman-numeral-converter/actions)
[![Coverage](https://img.shields.io/badge/coverage-97.7%25-brightgreen)](https://github.com/Nubiru/roman-numeral-converter)
[![Deployment](https://img.shields.io/badge/deployment-active-success)](https://roman-numeral-converter-seven.vercel.app/api/convert)

API REST serverless para conversión bidireccional entre números arábigos y romanos (1-3999 ↔ I-MMMCMXCIX).

**API en Vivo**: [https://roman-numeral-converter-seven.vercel.app/api/convert](https://roman-numeral-converter-seven.vercel.app/api/convert)

## 🎯 Características

- ✅ Conversión bidireccional automática (detecta tipo de entrada)
- ✅ Validación exhaustiva de entrada (sintaxis, semántica, rango)
- ✅ Arquitectura DDD (Domain-Driven Design) en 3 capas
- ✅ Desarrollo Dirigido por Pruebas (TDD) con 97.7% de cobertura
- ✅ 100% serverless (Vercel Functions)
- ✅ Pipeline CI/CD automatizado
- ✅ TypeScript modo estricto
- ✅ Validación con Zod schemas

## 🚀 Inicio Rápido

### Uso de la API

**Endpoint**: `POST /api/convert`

**Petición**:
```json
{
  "input": "42",
  "direction": "auto"
}
```

**Respuesta**:
```json
{
  "input": "42",
  "output": "XLII",
  "direction": "toRoman"
}
```

### Ejemplos con cURL

**Convertir número arábigo a romano**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"1994"}'
```

**Convertir número romano a arábigo**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"MCMXCIV"}'
```

**Con dirección explícita**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"42","direction":"toRoman"}'
```

## 📚 Documentación

- **[Wiki del Proyecto](https://github.com/Nubiru/roman-numeral-converter/wiki)** - Documentación completa
- **[Referencia API](https://github.com/Nubiru/roman-numeral-converter/wiki/API)** - Endpoints y formatos
- **[Arquitectura](https://github.com/Nubiru/roman-numeral-converter/wiki/Arquitectura)** - Diseño del sistema
- **[Testing](https://github.com/Nubiru/roman-numeral-converter/wiki/Testing)** - Estrategia de pruebas

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Runtime** | Node.js 22.12.0 (LTS) |
| **Lenguaje** | TypeScript 5.9+ |
| **Plataforma** | Vercel Serverless Functions |
| **Testing** | Jest + ts-jest + Supertest |
| **Validación** | Zod |
| **Linting** | ESLint + Prettier |
| **Git Hooks** | Husky + lint-staged + commitlint |

## 🏗️ Arquitectura

### Domain-Driven Design (3 Capas)

```
src/
├── domain/              # Capa de Dominio (lógica pura)
│   ├── converter.ts     # Algoritmos de conversión
│   └── validation.ts    # Reglas de negocio
├── application/         # Capa de Aplicación (orquestación)
│   └── convertUseCase.ts
├── infrastructure/      # Capa de Infraestructura (E/S)
│   └── schemas/
│       └── convertSchema.ts
└── shared/              # Código compartido
    ├── types.ts
    └── errors.ts

api/
└── convert.ts           # Vercel Function Handler
```

### Principios de Diseño

- **Capa de Dominio**: 100% funciones puras, cero dependencias externas
- **Capa de Aplicación**: Orquesta casos de uso, delega a dominio
- **Capa de Infraestructura**: Maneja HTTP, validación de entrada, serialización
- **Separación de Responsabilidades**: Cada capa tiene responsabilidades claras

## 🧪 Testing

### Estrategia TDD

Desarrollo Dirigido por Pruebas con ciclo RED-GREEN-REFACTOR:

1. **RED**: Escribir test que falla
2. **GREEN**: Implementar código mínimo que pasa
3. **REFACTOR**: Mejorar diseño sin romper tests

### Cobertura Actual

```
------------------------|---------|----------|---------|---------|
File                    | % Stmts | % Branch | % Funcs | % Lines |
------------------------|---------|----------|---------|---------|
All files               |   97.7  |   93.93  |   100   |  97.56  |
 domain/                |   100   |   100    |   100   |  100    |
 application/           |   94.28 |   88.23  |   100   |  93.93  |
 infrastructure/schemas |   100   |   100    |   100   |  100    |
 shared/                |   100   |   100    |   100   |  100    |
------------------------|---------|----------|---------|---------|
```

### Comandos de Testing

```bash
# Ejecutar tests
npm test

# Ejecutar con cobertura
npm run test:coverage

# Modo watch para desarrollo
npm run test:watch
```

## 💻 Desarrollo Local

### Prerrequisitos

- Node.js 22+ (LTS)
- npm 10+
- Git

### Configuración

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Nubiru/roman-numeral-converter.git
cd roman-numeral-converter
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Ejecutar tests**:
```bash
npm test
```

4. **Iniciar servidor de desarrollo** (Vercel Dev):
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000/api/convert`

### Scripts Disponibles

```bash
npm test              # Ejecutar suite de tests
npm run test:coverage # Tests con reporte de cobertura
npm run test:watch    # Tests en modo watch
npm run lint          # Verificar código con ESLint
npm run format        # Formatear código con Prettier
npm run format:check  # Verificar formato sin modificar
npm run typecheck     # Verificar tipos TypeScript
npm run build         # Compilar TypeScript
npm run qa:precommit  # Quality gates pre-commit
npm run qa:prepush    # Quality gates pre-push
```

## 🔒 Validación de Entrada

### Reglas de Validación

**Números Arábigos**:
- Rango: 1-3999 (inclusive)
- Solo enteros positivos
- Sin decimales ni signos

**Números Romanos**:
- Solo caracteres válidos: `I`, `V`, `X`, `L`, `C`, `D`, `M`
- Sintaxis correcta (reglas de resta/suma)
- Sin repeticiones inválidas

### Manejo de Errores

```json
{
  "error": "Invalid input",
  "details": "Number must be between 1 and 3999"
}
```

Códigos HTTP:
- `200 OK`: Conversión exitosa
- `400 Bad Request`: Entrada inválida
- `405 Method Not Allowed`: Método HTTP incorrecto
- `500 Internal Server Error`: Error del servidor

## 🚢 Despliegue

### Vercel (Producción)

Despliegue automático en cada push a `main`:

1. GitHub Actions ejecuta CI (tests, lint, build)
2. Si pasa, Vercel despliega automáticamente
3. URL de producción actualizada

**URL Producción**: [https://roman-numeral-converter-seven.vercel.app](https://roman-numeral-converter-seven.vercel.app)

### Pipeline CI/CD

```yaml
Push a main → GitHub Actions
  ├── Install dependencies
  ├── Run tests (coverage > 90%)
  ├── Run linter
  ├── Type check
  ├── Build
  └── Deploy to Vercel (si todo pasa)
```

## 🎓 Proyecto Universitario

Este proyecto es parte de la asignatura **Despliegue de Aplicaciones I** y demuestra:

- ✅ Arquitectura de software profesional (DDD)
- ✅ Prácticas de testing modernas (TDD, 90%+ coverage)
- ✅ Despliegue serverless en plataforma cloud
- ✅ Pipeline CI/CD automatizado
- ✅ Control de calidad con git hooks
- ✅ Documentación técnica completa

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles

## 👤 Autor

**Gabriel** ([@Nubiru](https://github.com/Nubiru))

- Universidad: Proyecto Despliegue I 2025
- GitHub: [https://github.com/Nubiru/roman-numeral-converter](https://github.com/Nubiru/roman-numeral-converter)
- Vercel: [https://roman-numeral-converter-seven.vercel.app](https://roman-numeral-converter-seven.vercel.app)

## 🙏 Agradecimientos

- Vercel por su plataforma serverless
- TypeScript por type safety
- Jest por framework de testing
- GitHub por CI/CD con Actions

---

**Estado del Proyecto**: ✅ Producción (Fase 6 completada)
**Última Actualización**: 2025-11-17
**Versión API**: 1.0.0
