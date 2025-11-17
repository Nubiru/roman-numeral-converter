# Arquitectura

Descripción general del diseño del sistema y arquitectura técnica.

---

## Patrón de Arquitectura: Domain-Driven Design (DDD)

```
┌─────────────────────────────────────────┐
│      Capa de Infraestructura            │
│  (Vercel Serverless, Validación Zod)    │
│                                         │
│  api/convert.ts                         │
│  ├─ Manejo HTTP                         │
│  ├─ Validación de peticiones (Zod)      │
│  └─ Formateo de respuestas              │
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
**Ubicación**: `api/`, `src/infrastructure/`

**Propósito**: Interfaces externas (HTTP, base de datos, APIs de terceros)

**Componentes**:
- `api/convert.ts`: Handler de función serverless de Vercel
- `src/infrastructure/schemas/`: Esquemas de validación Zod

**Dependencias**: Capa de aplicación, Vercel SDK, Zod

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

```
1. Petición HTTP
   └─> api/convert.ts (Infraestructura)
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
   └─> api/convert.ts (Infraestructura)
       ├─> Formatear respuesta
       ├─> Establecer código de estado
       └─> Enviar JSON
```

---

## Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Infraestructura** | Vercel Serverless, Zod, HTTP |
| **Aplicación** | TypeScript (puro) |
| **Dominio** | TypeScript (puro, cero deps) |
| **Testing** | Jest, Supertest |
| **Calidad** | ESLint, Prettier, Husky |

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
GitHub Actions (CI)
    │
    ├─ Ejecutar tests
    ├─ Ejecutar linter
    ├─ Compilar TypeScript
    │
    ▼
Plataforma Vercel
    │
    ├─ Auto-deploy
    ├─ Funciones serverless
    │
    ▼
Producción (API en Vivo)
```

---

**Última Actualización**: 2025-10-24
