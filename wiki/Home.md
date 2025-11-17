# API Convertidor de Números Romanos

**API en Vivo**: [https://roman-numeral-converter-seven.vercel.app/api/convert](https://roman-numeral-converter-seven.vercel.app/api/convert)
**Repositorio**: [GitHub](https://github.com/Nubiru/roman-numeral-converter)

---

## Descripción General

API REST serverless para conversión bidireccional de números romanos (1-3999 ↔ I-MMMCMXCIX).

Construida con **TypeScript**, **Vercel Serverless Functions** y **Domain-Driven Design** para demostrar:
- ✅ Desarrollo Dirigido por Pruebas (TDD) con 90%+ de cobertura
- ✅ Arquitectura DDD (Dominio, Aplicación, Infraestructura)
- ✅ Pipeline CI/CD automatizado
- ✅ Prácticas de despliegue profesionales

---

## Inicio Rápido

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

### Pruébalo Ahora

```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"1994"}'
```

---

## Documentación

- **[Referencia API](API-Reference)** - Endpoints, formatos de petición/respuesta
- **[Arquitectura](Architecture)** - Diseño del sistema y capas DDD
- **[Estrategia de Testing](Testing-Strategy)** - Enfoque TDD y cobertura
- **[Pipeline CI/CD](CICD-Pipeline)** - Flujo de despliegue automatizado
- **[Guía de Desarrollo](Development-Guide)** - Configuración local y contribución

---

## Características del Proyecto

| Característica | Implementación |
|----------------|----------------|
| **Arquitectura** | Domain-Driven Design (3 capas) |
| **Testing** | Jest, 90%+ cobertura, TDD |
| **Despliegue** | Vercel serverless functions |
| **CI/CD** | GitHub Actions + auto-deploy |
| **Seguridad de Tipos** | TypeScript modo estricto |
| **Validación** | Zod schema validation |
| **Control de Calidad** | Pre-commit hooks, ESLint, Prettier |

---

## Stack Tecnológico

- **Runtime**: Node.js 18+
- **Lenguaje**: TypeScript 5+
- **Plataforma**: Vercel Serverless
- **Testing**: Jest + Supertest
- **Validación**: Zod
- **Calidad**: ESLint + Prettier + Husky

---

## Estado

![Build Status](https://github.com/Nubiru/roman-numeral-converter/workflows/CI/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)
![Deployment](https://img.shields.io/badge/deployment-active-success)

**Última Actualización**: 2025-10-24
