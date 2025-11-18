# Arquitectura

Diseño del sistema y arquitectura técnica.

---

## Patrón: Domain-Driven Design (DDD)

```
┌─────────────────────────────────────────┐
│         Capa de Infraestructura         │
│   (Next.js, Vercel, Validación Zod)     │
│                                         │
│  app/api/convert/route.ts               │
│  ├─ Manejo HTTP                         │
│  ├─ Validación de peticiones (Zod)      │
│  └─ Middleware RFC 7807                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         Capa de Aplicación              │
│     (Casos de Uso, Orquestación)        │
│                                         │
│  src/application/convertUseCase.ts      │
│  ├─ Lógica de auto-detección            │
│  ├─ Enrutamiento de dirección           │
│  └─ Manejo de errores                   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│           Capa de Dominio               │
│    (Lógica de Negocio Pura)             │
│                                         │
│  src/domain/converter.ts                │
│  ├─ toRoman(número) → Romano            │
│  └─ toArabic(Romano) → número           │
│                                         │
│  src/domain/validation.ts               │
│  ├─ isValidRoman(string) → boolean      │
│  ├─ isValidArabic(string) → boolean     │
│  └─ validateRange(número) → void        │
└─────────────────────────────────────────┘
```

---

## Responsabilidades por Capa

### Capa de Infraestructura
**Ubicación**: `app/`, `src/infrastructure/`

**Propósito**: Interfaces externas (HTTP, validación, manejo de errores)

**Componentes**:
- `app/api/convert/route.ts`: Handler serverless de Next.js
- `src/infrastructure/http/errorHandler.ts`: Middleware RFC 7807
- `src/infrastructure/http/problemDetails.ts`: Tipos y constantes RFC 7807
- `src/infrastructure/schemas/`: Esquemas de validación Zod

**Reglas**:
- ✅ Puede depender de la capa de Aplicación
- ✅ Maneja concerns HTTP (headers, códigos de estado)
- ✅ Valida peticiones entrantes
- ❌ No contiene lógica de negocio

---

### Capa de Aplicación
**Ubicación**: `src/application/`

**Propósito**: Casos de uso y orquestación

**Componentes**:
- `convertUseCase.ts`: Orquestación principal de conversión
- Lógica de auto-detección
- Enrutamiento de dirección

**Reglas**:
- ✅ Puede depender de la capa de Dominio
- ✅ Orquesta lógica de dominio
- ✅ Maneja errores a nivel de aplicación
- ❌ No tiene concerns HTTP
- ❌ No tiene dependencias externas

---

### Capa de Dominio
**Ubicación**: `src/domain/`

**Propósito**: Lógica de negocio pura (algoritmos centrales)

**Componentes**:
- `converter.ts`: Algoritmos de conversión
- `validation.ts`: Validación de reglas de negocio

**Reglas**:
- ✅ 100% funciones puras
- ✅ Sin efectos secundarios
- ✅ Agnóstico al framework
- ❌ No importa de otras capas
- ❌ No usa librerías externas

---

## Flujo de Datos

```
1. Petición HTTP
   └─> app/api/convert/route.ts (Infraestructura)
       ├─> Validar con esquema Zod
       └─> withErrorHandler() (Middleware RFC 7807)

2. Orquestación de Aplicación
   └─> convertUseCase.ts (Aplicación)
       ├─> Auto-detectar tipo de entrada
       ├─> Enrutar al convertidor correcto
       └─> Manejar errores

3. Lógica de Dominio
   └─> converter.ts + validation.ts (Dominio)
       ├─> Validar reglas de negocio
       ├─> Ejecutar algoritmo de conversión
       └─> Retornar resultado

4. Respuesta HTTP
   └─> route.ts (Infraestructura)
       ├─> Formatear respuesta
       ├─> Establecer código de estado
       └─> Enviar JSON
```

---

## Estructura de Carpetas

```
roman-numeral-converter/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # Handler API
│   ├── page.tsx                  # UI principal
│   └── layout.tsx                # Layout raíz
├── src/
│   ├── domain/
│   │   ├── converter.ts          # Algoritmos
│   │   └── validation.ts         # Validaciones
│   ├── application/
│   │   └── convertUseCase.ts     # Caso de uso
│   ├── infrastructure/
│   │   ├── http/
│   │   │   ├── errorHandler.ts   # Middleware
│   │   │   └── problemDetails.ts # RFC 7807
│   │   └── schemas/
│   │       └── convertSchema.ts  # Zod
│   └── shared/
│       ├── errors.ts             # Clases de error
│       └── types.ts              # Tipos compartidos
├── components/
│   └── ConverterForm.tsx         # Componente UI
├── lib/
│   └── error-messages.ts         # Mensajes educativos
└── tests/
    ├── unit/
    ├── integration/
    ├── components/
    └── lib/
```

---

## Principios de Diseño

### Separación de Responsabilidades
Cada capa tiene una única responsabilidad:
- Infraestructura = Comunicación externa
- Aplicación = Orquestación
- Dominio = Lógica de negocio

### Regla de Dependencia
Las dependencias fluyen hacia adentro:
- Infraestructura → Aplicación → Dominio
- El Dominio no tiene dependencias hacia afuera

### Testeabilidad
- Dominio: 100% cobertura de tests unitarios (funciones puras)
- Aplicación: 95% cobertura de tests unitarios
- Infraestructura: 100% tests de integración

### Type Safety
- TypeScript en modo estricto
- No se permite tipo `any`
- Validación Zod en runtime en los límites

---

## Arquitectura de Despliegue

```
Repositorio GitHub
    │
    ├─ Push a main
    │
    ▼
GitHub Actions (CI)
    │
    ├─ Ejecutar tests
    ├─ Ejecutar linter
    ├─ Build TypeScript
    │
    ▼
Plataforma Vercel
    │
    ├─ Auto-deploy
    ├─ Funciones serverless
    │
    ▼
Producción (API en vivo)
```

---

**Última Actualización**: 2025-11-18
