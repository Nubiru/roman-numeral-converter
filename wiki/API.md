# API

Referencia completa para la API Convertidor de Números Romanos.

---

## URL Base

**Producción Vercel**: `https://roman-numeral-converter-seven.vercel.app`
**Producción Netlify**: `https://numeral-converter-gabriel.netlify.app`
**Desarrollo Local**: `http://localhost:3000`

---

## Endpoints

### GET /a2r

Convierte un número arábigo a numeral romano.

#### Petición

**Query Parameters**:
- `arabic` (string, requerido): Número entre 1 y 3999

#### Respuesta

**Éxito (200)**:
```json
{"roman":"XLII"}
```

**Error (400)** - RFC 7807:
```json
{
  "type": "/problems/bad-request",
  "title": "Solicitud Inválida",
  "status": 400,
  "detail": "Parámetro 'arabic' es requerido",
  "instance": "/a2r"
}
```

#### Ejemplos

```bash
# Conversión básica
curl "https://roman-numeral-converter-seven.vercel.app/a2r?arabic=42"
# Respuesta: {"roman":"XLII"}

# Año
curl "https://roman-numeral-converter-seven.vercel.app/a2r?arabic=1994"
# Respuesta: {"roman":"MCMXCIV"}

# Valor máximo
curl "https://roman-numeral-converter-seven.vercel.app/a2r?arabic=3999"
# Respuesta: {"roman":"MMMCMXCIX"}
```

---

### GET /r2a

Convierte un numeral romano a número arábigo.

#### Petición

**Query Parameters**:
- `roman` (string, requerido): Numeral romano válido (I-MMMCMXCIX)

#### Respuesta

**Éxito (200)**:
```json
{"arabic":42}
```

**Error (400)** - RFC 7807:
```json
{
  "type": "/problems/bad-request",
  "title": "Solicitud Inválida",
  "status": 400,
  "detail": "Parámetro 'roman' es requerido",
  "instance": "/r2a"
}
```

#### Ejemplos

```bash
# Conversión básica
curl "https://roman-numeral-converter-seven.vercel.app/r2a?roman=XLII"
# Respuesta: {"arabic":42}

# Año
curl "https://roman-numeral-converter-seven.vercel.app/r2a?roman=MCMXCIV"
# Respuesta: {"arabic":1994}

# Minúsculas (aceptadas)
curl "https://roman-numeral-converter-seven.vercel.app/r2a?roman=xlii"
# Respuesta: {"arabic":42}
```

---

### POST /api/convert

Conversión con detección automática de dirección.

#### Petición

**Cabeceras**:
```
Content-Type: application/json
```

**Cuerpo**:
```json
{
  "value": "string (requerido)"
}
```

**Parámetros**:
- `value` (string, requerido): Número (1-3999) o numeral romano (I-MMMCMXCIX)

#### Respuesta

**Éxito (200)**:
```json
{
  "result": "XLII",
  "type": "toRoman"
}
```

**Error de Validación (422)** - RFC 7807:
```json
{
  "type": "/problems/validation-error",
  "title": "Error de Validación",
  "status": 422,
  "detail": "El valor 'ABC123' no es ni un número válido ni un numeral romano",
  "instance": "/api/convert"
}
```

**Solicitud Malformada (400)** - RFC 7807:
```json
{
  "type": "/problems/malformed-request",
  "title": "Solicitud Malformada",
  "status": 400,
  "detail": "El campo 'value' debe ser una cadena de texto",
  "instance": "/api/convert"
}
```

#### Ejemplos

```bash
# Arábigo a Romano (auto-detectado)
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1994"}'
# Respuesta: {"result":"MCMXCIV","type":"toRoman"}

# Romano a Arábigo (auto-detectado)
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"MCMXCIV"}'
# Respuesta: {"result":1994,"type":"toArabic"}
```

---

## Casos Límite

### Valores Válidos

| Entrada | Respuesta GET /a2r | Respuesta GET /r2a |
|---------|--------------------|--------------------|
| `1` | `{"roman":"I"}` | - |
| `I` | - | `{"arabic":1}` |
| `3999` | `{"roman":"MMMCMXCIX"}` | - |
| `MMMCMXCIX` | - | `{"arabic":3999}` |

### Errores Comunes

| Entrada | Endpoint | Error |
|---------|----------|-------|
| `0` | /a2r | Fuera de rango (1-3999) |
| `4000` | /a2r | Fuera de rango (1-3999) |
| `IIII` | /r2a | Numeral romano inválido |
| `ABC` | /r2a | Caracteres no válidos |
| (vacío) | ambos | Parámetro requerido |

---

## Manejo de Errores (RFC 7807)

Todos los errores siguen el estándar RFC 7807 Problem Details:

```json
{
  "type": "/problems/bad-request",
  "title": "Solicitud Inválida",
  "status": 400,
  "detail": "Descripción específica del error",
  "instance": "/endpoint"
}
```

### Tipos de Error

| Tipo | Status | Descripción |
|------|--------|-------------|
| `/problems/bad-request` | 400 | Parámetro faltante o inválido |
| `/problems/malformed-request` | 400 | Body JSON malformado |
| `/problems/validation-error` | 422 | Valor no reconocido |
| `/problems/range-error` | 422 | Número fuera de rango |
| `/problems/invalid-numeral` | 422 | Patrón romano inválido |
| `/problems/server-error` | 500 | Error interno |

---

## Soporte CORS

La API soporta peticiones cross-origin en todos los endpoints:

- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `GET, POST, OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type`

---

## Límites de Tasa

**Vercel Free Tier**:
- 100GB ancho de banda/mes
- 100 horas ejecución serverless/mes

**Netlify Free Tier**:
- 100GB ancho de banda/mes
- 125K invocaciones de funciones/mes

**Recomendado**: Implementar throttling del lado del cliente para uso en producción.

---

**Última Actualización**: 2025-11-19
