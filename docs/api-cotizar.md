# API de cotización — `GET /api/cotizar`

Devuelve solo **costos de terceros** de una escritura: notaría, alcabala, consejo provincial y registro.
No incluye honorarios, margen ni plusvalía. Valores referenciales.

## Parámetros (query string)

| Parámetro | Obligatorio | Valores | Nota |
|---|---|---|---|
| `tipo` | sí | `compraventa`, `promesa`, `hipoteca`, `donacion` | |
| `cuantia` | sí | número > 0 | USD |
| `avaluo` | no | número > 0 | Base = mayor entre cuantía y avalúo (no aplica a hipoteca) |
| `fecha_adquisicion` | no | `YYYY-MM-DD`, no futura | Sin ella, alcabala sin rebaja |
| `donacion_legitimario` | no | `true` (defecto) / `false` | Solo `donacion` |

## Rubros por tipo

| tipo | notaría | alcabala | consejo prov. | registro |
|---|---|---|---|---|
| compraventa | Tabla 1 | 1 % con rebaja | 10 % + $1,80 | por cuantía |
| promesa | Tabla 2 | — | — | — |
| hipoteca | Tabla 3 | — | — | `null` (tasa fija no configurada) |
| donacion | Tabla 1 | legitimario: 0; no legitimario: 1 % | $1,80 o 10 % + $1,80 | por cuantía |

Cada rubro trae `valor`, `base_legal`, `formula` y `supuestos`. `subtotal` suma los valores no nulos.

## Ejemplos

```bash
curl "http://localhost:3000/api/cotizar?tipo=compraventa&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=promesa&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=hipoteca&cuantia=85000"
curl "http://localhost:3000/api/cotizar?tipo=donacion&cuantia=85000&donacion_legitimario=false"
curl "http://localhost:3000/api/cotizar?tipo=compraventa&cuantia=80000&avaluo=85000&fecha_adquisicion=2025-11-24"
```

Respuesta (compraventa $85.000):

```json
(pegar la respuesta real)
```

## Errores

- `422` — parámetros inválidos; `details` indica el campo.
- `429` — más de 200 solicitudes por minuto desde la misma IP. Cabecera `Retry-After`.
- `500` — error interno.

## Límites y privacidad

- El rate limit vive **en memoria, por instancia**: en Vercel cada instancia cuenta por separado y se
  reinicia con cada despliegue o arranque en frío. Es una protección básica, no una cuota garantizada.
- No se piden ni guardan datos personales, no se registran los parámetros y no se crean leads (LOPDP).
  La IP se usa solo como clave del contador en memoria.

## Pendiente

- Tasa fija del Registro de la Propiedad para hipotecas (monto y base legal).
- Artículos del COOTAD para alcabala y rebaja.
