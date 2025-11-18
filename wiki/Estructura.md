# Estructura del Proyecto

## Visión General

Este proyecto implementa una **arquitectura híbrida** que combina:
- **Domain-Driven Design (DDD)** para la lógica de negocio
- **Next.js App Router** para la capa de presentación

Esta decisión arquitectónica permite reutilizar la lógica de dominio en diferentes contextos mientras aprovechamos las ventajas del framework Next.js.

---

## Árbol de Directorios

```
roman-numeral-converter/
├── app/                    # Capa de Presentación (Next.js)
│   ├── api/convert/        # Endpoint HTTP REST
│   ├── page.tsx            # Página principal SPA
│   ├── layout.tsx          # Layout raíz con providers
│   └── globals.css         # Estilos globales Tailwind
│
├── src/                    # Capa de Dominio (DDD)
│   ├── domain/             # Lógica pura de negocio
│   ├── application/        # Casos de uso
│   ├── infrastructure/     # Adaptadores externos
│   └── shared/             # Código compartido
│
├── components/             # Componentes React
│   ├── ConverterForm.tsx   # Formulario principal
│   └── ui/                 # Componentes Shadcn UI
│
├── lib/                    # Utilidades compartidas
├── tests/                  # Suite de pruebas
├── wiki/                   # Documentación
└── docs/ADR/               # Decisiones arquitectónicas
```

---

## Capas DDD (src/)

### Domain (`src/domain/`)

Contiene la lógica pura de negocio **sin dependencias externas**.

| Archivo | Responsabilidad |
|---------|----------------|
| `converter.ts` | Algoritmos de conversión: `toRoman()`, `toArabic()` |
| `validation.ts` | Reglas de validación: `isValidRoman()`, `isValidArabic()` |

**Características**:
- Funciones puras sin efectos secundarios
- 100% testeable de forma aislada
- Reutilizable en cualquier contexto

### Application (`src/application/`)

Orquesta los casos de uso coordinando entre capas.

| Archivo | Responsabilidad |
|---------|----------------|
| `convertUseCase.ts` | Orquesta validación → conversión → respuesta |

**Características**:
- Punto de entrada para operaciones de negocio
- Maneja flujos de trabajo complejos
- Transforma DTOs a entidades de dominio

### Infrastructure (`src/infrastructure/`)

Implementa adaptadores para sistemas externos.

| Carpeta | Contenido |
|---------|-----------|
| `schemas/` | Esquemas Zod para validación de entrada |

**Características**:
- Separa detalles técnicos del dominio
- Facilita cambios en tecnologías externas

### Shared (`src/shared/`)

Código compartido entre capas.

| Archivo | Contenido |
|---------|-----------|
| `errors.ts` | Clases de error personalizadas |
| `types.ts` | Interfaces y tipos TypeScript |

---

## Capa de Presentación (app/)

### API Routes (`app/api/`)

```typescript
// app/api/convert/route.ts
export async function POST(request: NextRequest) {
  // 1. Validar entrada con Zod
  // 2. Ejecutar caso de uso
  // 3. Transformar respuesta para frontend
}
```

**Características**:
- Utiliza alias DDD: `@application/*`, `@infrastructure/*`
- Separa validación HTTP de lógica de negocio
- Maneja CORS con handler OPTIONS

### Páginas (`app/page.tsx`)

Página única SPA con formulario de conversión.

**Características**:
- Server Components por defecto
- Client Components donde necesario (`'use client'`)
- Integración con Sonner para notificaciones

---

## Componentes React (components/)

### Componentes de Negocio

| Componente | Responsabilidad |
|------------|----------------|
| `ConverterForm.tsx` | Formulario con validación, carga, y toasts |

### Componentes UI (Shadcn)

| Componente | Origen |
|------------|--------|
| `button.tsx` | Shadcn UI |
| `card.tsx` | Shadcn UI |
| `input.tsx` | Shadcn UI |
| `sonner.tsx` | Wrapper de Sonner |

---

## Tests (tests/)

Estructura espejo de `src/` para facilitar navegación.

```
tests/
├── unit/
│   ├── domain/           # Tests de lógica pura
│   └── application/      # Tests de casos de uso
├── integration/
│   └── api/              # Tests de endpoints HTTP
└── components/           # Tests de componentes React
```

**Entornos**:
- `backend` (Node.js): Tests unitarios e integración
- `frontend` (jsdom): Tests de componentes

---

## Flujo de Datos

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Frontend  │────▶│  API Route   │────▶│  Use Case   │
│  (React)    │     │  (Next.js)   │     │ (Application)│
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │   Domain    │
                                         │  (Pure)     │
                                         └─────────────┘
```

1. **Usuario** ingresa valor en `ConverterForm`
2. **Componente** llama a `/api/convert`
3. **Route Handler** valida con Zod schema
4. **Use Case** orquesta la conversión
5. **Domain** ejecuta algoritmo puro
6. **Respuesta** viaja de vuelta al usuario

---

## Alias de Importación

Configurados en `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"],
    "@domain/*": ["src/domain/*"],
    "@application/*": ["src/application/*"],
    "@infrastructure/*": ["src/infrastructure/*"],
    "@shared/*": ["src/shared/*"]
  }
}
```

**Convenciones**:
- Usar `@domain/*` para imports de lógica de negocio
- Usar `@/*` para imports de app/components/lib
- Evitar rutas relativas profundas (`../../../`)

---

## Justificación Arquitectónica

### ¿Por qué DDD dentro de Next.js?

1. **Reutilización**: La lógica de dominio puede extraerse como librería
2. **Testeabilidad**: Tests unitarios puros sin mocks HTTP
3. **Mantenibilidad**: Separación clara de responsabilidades
4. **Escalabilidad**: Fácil migración a microservicios

### ¿Por qué no monorepo?

Para un proyecto de esta escala, un monorepo añadiría complejidad innecesaria. La estructura actual permite:
- Build y deploy único
- Configuración simplificada
- Desarrollo ágil

Ver [ADR-001: Estructura Híbrida DDD + Next.js](../docs/ADR/001-estructura-hibrida-ddd-nextjs.md) para más detalles.

---

## Convenciones de Código

### Nombrado de Archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `ConverterForm.tsx` |
| Utilidades | camelCase | `convertUseCase.ts` |
| Tests | mismo nombre + `.test` | `converter.test.ts` |

### Estructura de Componentes

```typescript
'use client'; // Solo si necesario

import { ... } from '@/lib/utils';
import { ... } from '@/components/ui/...';

interface Props { ... }

export function ComponentName({ ... }: Props) {
  // hooks
  // handlers
  // render
}
```

---

## Referencias

- [README.md](../README.md) - Documentación principal
- [API.md](./API.md) - Referencia de la API
- [Testing.md](./Testing.md) - Estrategia de pruebas
- [Arquitectura.md](./Arquitectura.md) - Diseño del sistema
