# API de cotización — `GET /api/cotizar`

Devuelve solo **costos de terceros** de una escritura: notaría, alcabala, consejo provincial y registro.
No incluye honorarios, margen ni plusvalía. Valores referenciales.

## Parámetros (query string)

| Parámetro | Obligatorio | Valores | Nota |
|---|---|---|---|
| `tipo` | sí | `compraventa`, `promesa`, `hipoteca`, `donacion` | |
| `cuantia` | sí | número > 0, máx. 100.000.000 | USD |
| `avaluo` | no | número > 0, máx. 100.000.000 | Base = mayor entre cuantía y avalúo (no aplica a hipoteca) |
| `fecha_adquisicion` | no | `YYYY-MM-DD`, no futura | Sin ella, alcabala sin rebaja |
| `donacion_legitimario` | sí, si `tipo=donacion` | `true` / `false` | Sin valor por defecto |

Cualquier otro parámetro devuelve 422 (incluidos `utm_*`). No hay parámetros de descuento: los
descuentos por adulto mayor dependen de los comparecientes y los calcula el sistema que consume la API.

## Rubros por tipo

| tipo | notaría | alcabala | consejo prov. | registro |
|---|---|---|---|---|
| compraventa | Tabla 1 | 1 % con rebaja | 10 % + $1,80 | por cuantía |
| promesa | Tabla 2 | — | — | — |
| hipoteca | Tabla 3 | — | — | por cuantía (monto del préstamo) |
| donacion | Tabla 1 | legitimario: 0; no legitimario: 1 % | $1,80 o 10 % + $1,80 | por cuantía |

Cada rubro trae `valor`, `base_legal`, `formula` y `supuestos`. `subtotal` suma todos los rubros.

## Ejemplos

```bash
curl "http://localhost:3000/api/cotizar?tipo=compraventa&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=promesa&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=hipoteca&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=donacion&cuantia=85000&donacion_legitimario=false"
curl "http://localhost:3000/api/cotizar?tipo=donacion&cuantia=85000&donacion_legitimario=true"
curl "http://localhost:3000/api/cotizar?tipo=compraventa&cuantia=80000&avaluo=85000&fecha_adquisicion=2025-11-24"
```

Respuesta (compraventa $85.000):

```json
{
  "tipo": "compraventa",
  "moneda": "USD",
  "base_imponible": 85000,
  "rubros": [
    {
      "id": "notaria",
      "nombre": "Notaría",
      "valor": 443.44,
      "base_legal": "Reglamento del Sistema Notarial Integral de la Función Judicial (R.O. Nº 246, 2023-02-08), Art. 26 - Tabla 1 (Rango: $60,000.01 - $90,000)",
      "formula": "Tarifa del rango $385,60 + IVA 15 % $57,84 = $443,44",
      "supuestos": ["SBU vigente: $482,00.", "Sin rebajas por vivienda de interés social ni adulto mayor."]
    },
    {
      "id": "alcabala",
      "nombre": "Alcabala",
      "valor": 850,
      "base_legal": "COOTAD, impuesto de alcabala (1 % sobre el mayor entre precio y avalúo, rebaja por tiempo)",
      "formula": "1 % × $85.000,00 = $850,00",
      "supuestos": ["Sin fecha de adquisición: se calcula sin rebaja por tiempo."]
    },
    {
      "id": "consejo_provincial",
      "nombre": "Consejo Provincial",
      "valor": 86.8,
      "base_legal": "Ordenanza del Consejo Provincial de Pichincha",
      "formula": "10 % × alcabala $850,00 = $85,00 + valor fijo $1,80 = $86,80",
      "supuestos": ["Aplica a inmuebles en la provincia de Pichincha."]
    },
    {
      "id": "registro",
      "nombre": "Registro de la Propiedad",
      "valor": 475,
      "base_legal": "Tabla de aranceles del Registro de la Propiedad de Quito",
      "formula": "$100 + 0,5 % × ($85.000,00 − $10.000) = $475,00",
      "supuestos": ["Sin descuentos por adulto mayor ni discapacidad."]
    }
  ],
  "subtotal": 1855.24,
  "supuestos": ["Fecha de cálculo: 2026-09-24."],
  "aviso": "Solo costos de terceros (notaría, alcabala, consejo provincial y registro). No incluye honorarios profesionales, plusvalía ni otros cobros. Valores referenciales."
}
```

## Errores

- `422` — `{ "error": "Solicitud inválida", "details": { ... } }` con el mensaje por campo en español.
  Los errores que no son de un campo (parámetro desconocido o repetido) van en `details.general`.
  Se reportan todos los errores a la vez, incluido `donacion_legitimario` faltante.
- `429` — `{ "error": "Demasiadas solicitudes" }`. Más de 200 solicitudes por minuto desde la misma IP. Cabecera `Retry-After`.
- `500` — `{ "error": "Error interno" }`.

Todas las respuestas (200, 422, 429, 500) llevan la cabecera `X-Robots-Tag: noindex`. El `robots.txt`
permite el rastreo de `/api/cotizar` aunque `/api/` siga bloqueado.

## Límites y privacidad

- El rate limit vive **en memoria, por instancia**: en Vercel cada instancia cuenta por separado y se
  reinicia con cada despliegue o arranque en frío. Es una protección básica, no una cuota garantizada.
- No se piden ni guardan datos personales, no se registran los parámetros y no se crean leads (LOPDP).
  La IP se usa solo como clave del contador en memoria.
- Al ser GET, los parámetros (montos y fecha) quedan en los logs de acceso de la plataforma (Vercel), como cualquier URL. No son datos personales.

## Pendiente

- Artículos del COOTAD para alcabala y rebaja.
