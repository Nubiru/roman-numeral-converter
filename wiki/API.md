# Referencia de la API

Referencia completa para la API Convertidor de Números Romanos.

---

## URL Base

**Producción**: `https://roman-numeral-converter-seven.vercel.app`
**Desarrollo Local**: `http://localhost:3000`

---

## Endpoints

### POST /api/convert

Convierte entre formatos numéricos y números romanos.

#### Petición

**Cabeceras**:
```
Content-Type: application/json
```

**Cuerpo**:
```json
{
  "input": "string (requerido)",
  "direction": "toRoman | toNumeric | auto (opcional, default: auto)"
}
```

**Parámetros**:
- `input` (string, requerido): Número (1-3999) o número romano (I-MMMCMXCIX)
- `direction` (string, opcional): Dirección de conversión
  - `auto`: Auto-detecta el tipo de entrada (default)
  - `toRoman`: Convierte número a número romano
  - `toNumeric`: Convierte número romano a número

#### Respuesta

**Éxito (200)**:
```json
{
  "input": "42",
  "output": "XLII",
  "direction": "toRoman"
}
```

**Error de Validación (400)**:
```json
{
  "error": "Validation Error",
  "message": "Number must be between 1 and 3999"
}
```

**Método No Permitido (405)**:
```json
{
  "error": "Method Not Allowed"
}
```

**Error del Servidor (500)**:
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Ejemplos

### Auto-Detección (Default)

**Entrada Numérica**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"1994"}'

# Respuesta: {"input":"1994","output":"MCMXCIV","direction":"toRoman"}
```

**Entrada Romana**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"MCMXCIV"}'

# Respuesta: {"input":"MCMXCIV","output":"1994","direction":"toNumeric"}
```

### Dirección Explícita

**Forzar a Romano**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"42","direction":"toRoman"}'

# Respuesta: {"input":"42","output":"XLII","direction":"toRoman"}
```

**Forzar a Numérico**:
```bash
curl -X POST https://roman-numeral-converter-seven.vercel.app/api/convert \
  -H "Content-Type: application/json" \
  -d '{"input":"XLII","direction":"toNumeric"}'

# Respuesta: {"input":"XLII","output":"42","direction":"toNumeric"}
```

---

## Casos Límite

### Valor Mínimo (1/I)
```json
{"input":"1"} → {"output":"I"}
{"input":"I"} → {"output":"1"}
```

### Valor Máximo (3999/MMMCMXCIX)
```json
{"input":"3999"} → {"output":"MMMCMXCIX"}
{"input":"MMMCMXCIX"} → {"output":"3999"}
```

### Entradas Inválidas
```json
{"input":"0"} → Error 400 (fuera de rango)
{"input":"4000"} → Error 400 (fuera de rango)
{"input":"IIII"} → Error 400 (romano inválido)
{"input":"ABC"} → Error 400 (entrada inválida)
{"input":""} → Error 400 (entrada vacía)
```

---

## Soporte CORS

La API soporta peticiones cross-origin:
- **Access-Control-Allow-Origin**: `*`
- **Access-Control-Allow-Methods**: `POST, OPTIONS`
- **Access-Control-Allow-Headers**: `Content-Type`

---

## Límites de Tasa

**Vercel Free Tier**:
- 100GB ancho de banda/mes
- 100 horas ejecución serverless/mes
- Sin límite por petición

**Recomendado**: Implementar throttling del lado del cliente para uso en producción.

---

**Última Actualización**: 2025-10-24
