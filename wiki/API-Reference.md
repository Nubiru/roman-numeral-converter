# Referencia de API

Referencia completa de la API del Convertidor de Números Romanos.

---

## URL Base

**Producción**: `https://roman-numeral-converter-seven.vercel.app`
**Desarrollo Local**: `http://localhost:3000`

---

## Endpoints

### POST /api/convert

Convierte entre formatos numérico y numeral romano.

#### Petición

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "value": "string (requerido)"
}
```

**Parámetros**:
- `value` (string, requerido): Número (1-3999) o numeral romano (I-MMMCMXCIX)

La dirección de conversión se detecta automáticamente:
- Si es número → convierte a romano
- Si es numeral romano → convierte a arábigo

#### Respuestas

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
  "detail": "La entrada no es ni un número válido ni un numeral romano válido",
  "instance": "/api/convert"
}
```

**Error de Rango (422)** - RFC 7807:
```json
{
  "type": "/problems/range-error",
  "title": "Valor Fuera de Rango",
  "status": 422,
  "detail": "No se puede convertir 4000: El número debe estar entre 1 y 3999",
  "instance": "/api/convert"
}
```

**Numeral Inválido (422)** - RFC 7807:
```json
{
  "type": "/problems/invalid-numeral",
  "title": "Numeral Romano Inválido",
  "status": 422,
  "detail": "Numeral romano inválido: IIII",
  "instance": "/api/convert"
}
```

**Solicitud Malformada (400)** - RFC 7807:
```json
{
  "type": "/problems/malformed-request",
  "title": "Solicitud Malformada",
  "status": 400,
  "detail": "El campo value es requerido",
  "instance": "/api/convert"
}
```

---

## Ejemplos

### Conversión de Arábigo a Romano

```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"1994"}'

# Respuesta: {"result":"MCMXCIV","type":"toRoman"}
```

### Conversión de Romano a Arábigo

```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"MCMXCIV"}'

# Respuesta: {"result":1994,"type":"toArabic"}
```

---

## Casos Límite

### Valor Mínimo (1/I)
```json
{"value":"1"} → {"result":"I","type":"toRoman"}
{"value":"I"} → {"result":1,"type":"toArabic"}
```

### Valor Máximo (3999/MMMCMXCIX)
```json
{"value":"3999"} → {"result":"MMMCMXCIX","type":"toRoman"}
{"value":"MMMCMXCIX"} → {"result":3999,"type":"toArabic"}
```

### Entradas Inválidas
```json
{"value":"0"} → 422 (fuera de rango)
{"value":"4000"} → 422 (fuera de rango)
{"value":"IIII"} → 422 (numeral romano inválido)
{"value":"ABC"} → 422 (entrada no reconocida)
{"value":""} → 400 (campo vacío)
```

---

## Soporte CORS

La API soporta peticiones cross-origin:
- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `POST, OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type`

---

## Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Conversión exitosa |
| 400 | Bad Request | Solicitud malformada (JSON inválido, campo faltante) |
| 422 | Unprocessable Entity | Error semántico (rango, validación, numeral inválido) |
| 500 | Internal Server Error | Error inesperado del servidor |

---

**Última Actualización**: 2025-11-18
