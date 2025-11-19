# Arquitectura

Descripción general del diseño del sistema y arquitectura técnica.

---

## Patrón de Arquitectura: Domain-Driven Design (DDD)

```
┌─────────────────────────────────────────┐
│      Capa de Infraestructura            │
│  (Vercel/Netlify Serverless, Zod)       │
│                                         │
│  app/api/convert/route.ts (POST)        │
│  ├─ Detección automática                │
│  ├─ Validación con Zod                  │
│  └─ Respuestas RFC 7807                 │
│                                         │
│  app/a2r/route.ts (GET)                 │
│  ├─ Arábigo → Romano                    │
│  └─ Query param: ?arabic=42             │
│                                         │
│  app/r2a/route.ts (GET)                 │
│  ├─ Romano → Arábigo                    │
│  └─ Query param: ?roman=XLII            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Capa de Aplicación               │
│    (Casos de Uso, Orquestación)         │
│                                         │
│  src/application/convertUseCase.ts      │
│  ├─ Lógica de auto-detección            │
│  ├─ Enrutamiento de dirección           │
│  └─ Manejo de errores                   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          Capa de Dominio                │
│  (Lógica de Negocio Pura - Cero Deps)   │
│                                         │
│  src/domain/converter.ts                │
│  ├─ toRoman(number) → Roman             │
│  └─ toArabic(Roman) → number            │
│                                         │
│  src/domain/validation.ts               │
│  ├─ isValidRoman(string) → boolean      │
│  ├─ isValidArabic(string) → boolean     │
│  └─ validateRange(number) → void        │
└─────────────────────────────────────────┘
```

---

## Responsabilidades de las Capas

### Capa de Infraestructura
**Ubicación**: `app/`, `src/infrastructure/`

**Propósito**: Interfaces externas (HTTP, APIs de terceros)

**Componentes**:
- `app/api/convert/route.ts`: POST con detección automática
- `app/a2r/route.ts`: GET arábigo → romano
- `app/r2a/route.ts`: GET romano → arábigo
- `src/infrastructure/schemas/`: Esquemas de validación Zod
- `src/infrastructure/http/`: Manejo de errores RFC 7807

**Dependencias**: Capa de aplicación, Next.js App Router, Zod

**Reglas**:
- ✅ Puede depender de la capa de Aplicación
- ✅ Maneja preocupaciones HTTP (headers, códigos de estado)
- ✅ Valida peticiones entrantes
- ❌ Sin lógica de negocio

---

### Capa de Aplicación
**Ubicación**: `src/application/`

**Propósito**: Casos de uso y orquestación

**Componentes**:
- `convertUseCase.ts`: Orquestación principal de conversión
- Lógica de auto-detección
- Enrutamiento de dirección

**Dependencias**: Solo capa de Dominio

**Reglas**:
- ✅ Puede depender de la capa de Dominio
- ✅ Orquesta lógica de dominio
- ✅ Maneja errores a nivel de aplicación
- ❌ Sin preocupaciones HTTP
- ❌ Sin dependencias externas

---

### Capa de Dominio
**Ubicación**: `src/domain/`

**Propósito**: Lógica de negocio pura (algoritmos core)

**Componentes**:
- `converter.ts`: Algoritmos de conversión
- `validation.ts`: Validación de reglas de negocio

**Dependencias**: CERO dependencias externas

**Reglas**:
- ✅ 100% funciones puras
- ✅ Sin efectos secundarios
- ✅ Independiente de frameworks
- ❌ Sin imports de otras capas
- ❌ Sin librerías externas

---

## Flujo de Datos

### Endpoints GET (/a2r, /r2a)
```
1. Petición GET con query param
   └─> app/a2r/route.ts o app/r2a/route.ts
       ├─> Extraer parámetro de URL
       └─> Validar formato básico

2. Lógica de Dominio (directa)
   └─> converter.ts (Dominio)
       ├─> Validar reglas de negocio
       ├─> Ejecutar conversión
       └─> Retornar resultado

3. Respuesta HTTP
   └─> route.ts (Infraestructura)
       ├─> Formatear JSON simple
       └─> Errores en RFC 7807
```

### Endpoint POST (/api/convert)
```
1. Petición POST con body JSON
   └─> app/api/convert/route.ts
       ├─> Validar con esquema Zod
       └─> Parsear cuerpo de petición

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
       ├─> Formatear respuesta RFC 7807
       └─> Enviar JSON
```

---

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Infraestructura** | Next.js App Router, Vercel/Netlify, Zod |
| **Aplicación** | TypeScript (puro) |
| **Dominio** | TypeScript (puro, cero deps) |
| **Testing** | Jest (256 tests, 98.8% cobertura) |
| **Calidad** | Biome, Husky, lint-staged |

---

## Principios de Diseño

### Separación de Responsabilidades
Cada capa tiene una sola responsabilidad:
- Infraestructura = Comunicación externa
- Aplicación = Orquestación
- Dominio = Lógica de negocio

### Regla de Dependencias
Las dependencias fluyen hacia adentro:
- Infraestructura → Aplicación → Dominio
- Dominio tiene CERO dependencias hacia afuera

### Testabilidad
- Dominio: 100% cobertura de tests unitarios (funciones puras)
- Aplicación: 95% cobertura de tests unitarios (dominio mockeado)
- Infraestructura: 80% tests de integración (HTTP real)

### Seguridad de Tipos
- TypeScript modo estricto habilitado
- No se permiten tipos `any`
- Validación en tiempo de ejecución con Zod en los límites

---

## Arquitectura de Despliegue

```
Repositorio GitHub
    │
    ├─ Push a main
    │
    ▼
Pre-commit Hooks (Local)
    │
    ├─ Biome (lint + format)
    ├─ TypeScript (type-check)
    ├─ Jest (cobertura)
    │
    ▼
┌─────────────────┬─────────────────┐
│                 │                 │
▼                 ▼
Vercel            Netlify
│                 │
├─ Auto-deploy    ├─ Auto-deploy
├─ Edge Network   ├─ Edge Network
│                 │
▼                 ▼
Producción        Producción
(vercel.app)      (netlify.app)
└─────────────────┴─────────────────┘
```

### URLs de Producción

- **Vercel**: https://roman-numeral-converter-seven.vercel.app
- **Netlify**: https://numeral-converter-gabriel.netlify.app

---

**Última Actualización**: 2025-11-19
