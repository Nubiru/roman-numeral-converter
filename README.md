# Convertidor de Números Romanos

[![Build Status](https://github.com/Nubiru/roman-numeral-converter/workflows/CI/badge.svg)](https://github.com/Nubiru/roman-numeral-converter/actions)
[![Cobertura](https://img.shields.io/badge/cobertura-98.3%25-brightgreen)](https://github.com/Nubiru/roman-numeral-converter)
[![Despliegue](https://img.shields.io/badge/despliegue-activo-success)](https://roman-numeral-converter-seven.vercel.app)

Aplicación web fullstack para conversión bidireccional entre números arábigos y romanos (1-3999).

**Aplicación en Vivo**: [https://roman-numeral-converter-seven.vercel.app](https://roman-numeral-converter-seven.vercel.app)

## Características

- Conversión bidireccional automática (detecta tipo de entrada)
- Interfaz web SPA en español
- API REST con validación exhaustiva
- Arquitectura DDD (Domain-Driven Design)
- Desarrollo Dirigido por Pruebas (TDD) con 98%+ cobertura
- 100% serverless (Next.js + Vercel)
- TypeScript modo estricto
- Biome para linting y formateo

## Inicio Rápido

### Interfaz Web

Visita [https://roman-numeral-converter-seven.vercel.app](https://roman-numeral-converter-seven.vercel.app) y usa el formulario para convertir valores.

### API REST

**Endpoint**: `POST /api/convert`

```bash
# Arábigo a Romano
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1994"}'

# Respuesta: {"result":"MCMXCIV","type":"toRoman"}

# Romano a Arábigo
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"MCMXCIV"}'

# Respuesta: {"result":1994,"type":"toArabic"}
```

## Documentación

- **[Wiki del Proyecto](wiki/)** - Documentación completa en español
- **[Estructura](wiki/Estructura.md)** - Arquitectura y organización
- **[API](wiki/API.md)** - Referencia de endpoints
- **[Testing](wiki/Testing.md)** - Estrategia de pruebas
- **[ADR](docs/ADR/)** - Decisiones arquitectónicas

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Lenguaje** | TypeScript 5.9 |
| **UI** | React 18 + Tailwind CSS 4 + Shadcn UI |
| **Testing** | Jest + React Testing Library |
| **Validación** | Zod |
| **Linting** | Biome |
| **Git Hooks** | Husky + lint-staged + commitlint |
| **Despliegue** | Vercel |

## Estructura del Proyecto

```
roman-numeral-converter/
├── app/                    # Frontend Next.js
│   ├── api/convert/        # API endpoint
│   │   └── route.ts
│   ├── page.tsx            # Página principal
│   └── layout.tsx          # Layout raíz
│
├── src/                    # Backend DDD
│   ├── domain/             # Lógica pura
│   │   ├── converter.ts
│   │   └── validation.ts
│   ├── application/        # Casos de uso
│   │   └── convertUseCase.ts
│   ├── infrastructure/     # Adaptadores
│   │   └── schemas/
│   └── shared/             # Tipos y errores
│
├── components/             # Componentes React
│   ├── ConverterForm.tsx
│   └── ui/                 # Shadcn UI
│
├── tests/                  # Suite de pruebas
│   ├── unit/               # Tests de dominio
│   ├── integration/        # Tests de API
│   └── components/         # Tests de UI
│
├── lib/                    # Utilidades
├── wiki/                   # Documentación
└── docs/ADR/               # Decisiones arquitectónicas
```

Ver [wiki/Estructura.md](wiki/Estructura.md) para detalles completos.

## Arquitectura

### Domain-Driven Design

El proyecto implementa DDD con separación clara de capas:

- **Domain**: Algoritmos puros de conversión
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Schemas de validación
- **Presentation**: Next.js App Router

### Flujo de Datos

```
Usuario → ConverterForm → API Route → Use Case → Domain → Respuesta
```

Ver [docs/ADR/001-estructura-hibrida-ddd-nextjs.md](docs/ADR/001-estructura-hibrida-ddd-nextjs.md) para la justificación.

## Testing

### Cobertura Actual

```
File                        | % Stmts | % Branch | % Funcs | % Lines
----------------------------|---------|----------|---------|--------
All files                   |   98.29 |   95.12  |   100   |  98.21
 components/                |   100   |   87.5   |   100   |   100
 src/application/           |   94.28 |   94.11  |   100   |  93.93
 src/domain/                |   100   |   100    |   100   |   100
 src/infrastructure/        |   100   |   100    |   100   |   100
 src/shared/                |   100   |   100    |   100   |   100
```

### Comandos

```bash
npm test                    # Ejecutar tests
npm run test:coverage       # Tests con cobertura
npm run test:watch          # Modo desarrollo
```

## Desarrollo Local

### Prerrequisitos

- Node.js 18+
- npm 10+

### Instalación

```bash
git clone https://github.com/Nubiru/roman-numeral-converter.git
cd roman-numeral-converter
npm install
```

### Scripts

```bash
npm run dev               # Servidor desarrollo
npm run build             # Build producción
npm test                  # Tests
npm run test:coverage     # Cobertura
npm run check             # Linting (Biome)
npm run check:fix         # Auto-fix
npm run type-check        # TypeScript
npm run qa:precommit      # Quality gates
```

## Validación de Entrada

### Números Arábigos
- Rango: 1-3999
- Solo enteros positivos

### Números Romanos
- Caracteres válidos: I, V, X, L, C, D, M
- Sintaxis correcta (reglas de resta)

### Manejo de Errores

```json
{
  "error": "Number must be between 1 and 3999"
}
```

Códigos HTTP:
- `200`: Conversión exitosa
- `400`: Entrada inválida
- `500`: Error del servidor

## Despliegue

Despliegue automático en cada push a `main`:

1. GitHub Actions ejecuta CI
2. Tests con cobertura >90%
3. Build y type-check
4. Deploy a Vercel

## Proyecto Universitario

Este proyecto demuestra:

- Arquitectura profesional (DDD)
- TDD con 98%+ cobertura
- Despliegue serverless
- CI/CD automatizado
- Documentación completa en español
- UI accesible con Shadcn

## Licencia

MIT License - Ver [LICENSE](LICENSE)

## Autor

**Gabriel Osemberg** ([@Nubiru](https://github.com/Nubiru))

- Proyecto: Despliegue de Aplicaciones I - 2025
- GitHub: [roman-numeral-converter](https://github.com/Nubiru/roman-numeral-converter)

---

**Estado**: Producción
**Última Actualización**: 2025-11-18
**Versión**: 1.0.0
