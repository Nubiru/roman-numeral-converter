# Convertidor de Números Romanos

**Vercel**: [https://roman-numeral-converter-seven.vercel.app](https://roman-numeral-converter-seven.vercel.app)
**Netlify**: [https://numeral-converter-gabriel.netlify.app](https://numeral-converter-gabriel.netlify.app)
**Repositorio**: [GitHub](https://github.com/Nubiru/roman-numeral-converter)

---

## Descripción

API REST serverless para conversión bidireccional de números romanos (1-3999 ↔ I-MMMCMXCIX).

Construido con **TypeScript**, **Next.js**, y **Domain-Driven Design** para demostrar:
- Test-Driven Development (98%+ cobertura)
- Arquitectura DDD (Dominio, Aplicación, Infraestructura)
- Estándar RFC 7807 Problem Details para errores
- Pipeline CI/CD automatizado
- Despliegue en Vercel/Netlify

---

## Inicio Rápido

### Uso de la API

**Endpoint**: `POST /api/convert`

**Petición**:
```json
{
  "value": "42"
}
```

**Respuesta exitosa**:
```json
{
  "result": "XLII",
  "type": "toRoman"
}
```

**Respuesta de error (RFC 7807)**:
```json
{
  "type": "/problems/range-error",
  "title": "Valor Fuera de Rango",
  "status": 422,
  "detail": "No se puede convertir 4000: El número debe estar entre 1 y 3999",
  "instance": "/api/convert"
}
```

### Pruébalo Ahora

```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1994"}'
```

---

## Documentación

- **[API](API)** - Endpoints, formatos de petición/respuesta
- **[Arquitectura](Arquitectura)** - Diseño del sistema y capas DDD
- **[Estructura](Estructura)** - Árbol de directorios y convenciones
- **[RFC 7807](RFC-7807)** - Estándar Problem Details para errores
- **[Testing](Testing)** - Enfoque TDD y cobertura

---

## Características del Proyecto

| Característica | Implementación |
|----------------|----------------|
| **Arquitectura** | Domain-Driven Design (3 capas) |
| **Testing** | Jest, 98%+ cobertura, TDD |
| **Errores** | RFC 7807 Problem Details |
| **Despliegue** | Vercel serverless |
| **CI/CD** | GitHub Actions + auto-deploy |
| **Type Safety** | TypeScript modo estricto |
| **Validación** | Zod schema validation |
| **Calidad** | Biome (linter + formatter) |

---

## Stack Tecnológico

- **Framework**: Next.js 14+
- **Lenguaje**: TypeScript 5+
- **Plataforma**: Vercel Serverless
- **Testing**: Jest
- **Validación**: Zod
- **UI**: React + Tailwind CSS + shadcn/ui
- **Calidad**: Biome

---

## Estado

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-active-success)

**Última Actualización**: 2025-11-18
