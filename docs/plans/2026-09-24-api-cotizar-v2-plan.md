# /api/cotizar v2 — validación estricta, errores en español, robots — Plan

> **Para el ejecutor:** tarea por tarea, TDD (rojo → verde → commit). Casillas `- [ ]`.

**Objetivo:** endurecer `GET /api/cotizar` para el agente de proformas de José Luis: parámetros desconocidos → 422,
`donacion_legitimario` obligatorio en donación, mensajes de error en español, `X-Robots-Tag: noindex` en la respuesta
y `Allow: /api/cotizar` en robots.txt.

**Decidido por José Luis (2026-09-24):**
- **Sin parámetros de descuento.** Adulto mayor depende del número de comparecientes → lo calcula su sistema.
  Vivienda social y discapacidad: no hace esos trámites. No agregar nada de eso.
- `.strict()`: cualquier parámetro desconocido (incluidos `utm_*`, `fbclid`) → 422. El cliente es un agente, no enlaces.
- `donacion_legitimario` obligatorio si `tipo=donacion`, sin valor por defecto.
- No cambiar fórmulas, tablas ni constantes.

**Reparto:** ejecutor `sonnet` (subagente) → revisor `opus` (subagente). Sin medir más allá de 1 corrida c/u.

**Tiempo estimado:** 45–60 min de ejecutor.

**Archivos:** `src/app/api/cotizar/route.ts`, `src/app/api/cotizar/route.test.ts`, `src/app/robots.ts`,
`src/app/robots.test.ts` (nuevo), `src/lib/formulas/cotizar.ts` (solo un texto), `docs/api-cotizar.md`.

---

### Tarea 0: Worktree

- [ ] **Paso 1**

```bash
git -C /d/aoe-v2 fetch -q origin
git -C /d/aoe-v2 worktree add /d/aoe-v2/.claude/worktrees/api-cotizar-v2 -b claude/api-cotizar-v2 origin/main
cd /d/aoe-v2/.claude/worktrees/api-cotizar-v2 && npm install
mkdir -p docs/plans && cp /d/aoe-v2/docs/plans/2026-09-24-api-cotizar-v2-plan.md docs/plans/
git add docs/plans/2026-09-24-api-cotizar-v2-plan.md && git commit -m "docs: plan /api/cotizar v2"
npx vitest run && npx tsc --noEmit
```

Esperado: 444 tests verdes; `tsc` con un único error preexistente en `src/lib/payphone-webhook-auth.test.ts:78`.

---

### Tarea 1: Tests de la ruta (rojo)

**Archivo:** `src/app/api/cotizar/route.test.ts`

- [ ] **Paso 1:** en el `it.each` de 422, cambiar `expect((await res.json()).error).toBe('Invalid request')` por
`expect((await res.json()).error).toBe('Solicitud inválida')`. El caso `'donacion_legitimario=false → alcabala 850'`
se queda igual.

- [ ] **Paso 2:** agregar al `it.each` de 422:

```ts
    ['parámetro desconocido', 'tipo=compraventa&cuantia=85000&utm_source=x'],
    ['descuento no soportado', 'tipo=compraventa&cuantia=85000&adulto_mayor=true'],
    ['donación sin legitimario', 'tipo=donacion&cuantia=85000'],
```

- [ ] **Paso 3:** agregar al final del archivo:

```ts
describe('GET /api/cotizar — mensajes y cabeceras', () => {
  it('sin cuantía → mensaje "cuantía requerida"', async () => {
    const body = await (await get('tipo=compraventa')).json()
    expect(body.details.cuantia).toContain('cuantía requerida')
  })

  it('parámetro desconocido → lo nombra en español', async () => {
    const body = await (await get('tipo=compraventa&cuantia=85000&utm_source=x')).json()
    expect(JSON.stringify(body.details)).toContain('utm_source')
  })

  it('donación sin legitimario → error en ese campo', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000')).json()
    expect(body.details.donacion_legitimario).toContain('donacion_legitimario requerido cuando tipo=donacion')
  })

  it('donación a legitimario explícito → alcabala 0', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000&donacion_legitimario=true')).json()
    expect(body.rubros[1].valor).toBe(0)
  })

  it('mensajes genéricos en español (tipo inválido)', async () => {
    const body = await (await get('tipo=arriendo&cuantia=85000')).json()
    expect(JSON.stringify(body.details.tipo)).not.toMatch(/Invalid|expected/i)
  })

  it.each([
    ['200', 'tipo=promesa&cuantia=85000'],
    ['422', 'tipo=promesa'],
  ])('X-Robots-Tag: noindex en respuesta %s', async (_, qs) => {
    const res = await get(qs)
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex')
  })
})
```

- [ ] **Paso 4:** `npx vitest run src/app/api/cotizar/` → FAIL en los casos nuevos. Commit no (va con la Tarea 2).

---

### Tarea 2: Ruta (verde)

**Archivo:** `src/app/api/cotizar/route.ts`

- [ ] **Paso 1:** esquema. Mantener los campos actuales; cambios:

```ts
const querySchema = z
  .object({
    tipo: z.enum(['compraventa', 'promesa', 'hipoteca', 'donacion']),
    cuantia: z.coerce
      .number({ error: (iss) => (iss.input === undefined ? 'cuantía requerida' : 'cuantía debe ser un número') })
      .positive({ error: 'cuantía debe ser mayor que 0' })
      .max(MONTO_MAXIMO, { error: 'cuantía no puede superar 100.000.000' }),
    avaluo: z.coerce
      .number({ error: 'avalúo debe ser un número' })
      .positive({ error: 'avalúo debe ser mayor que 0' })
      .max(MONTO_MAXIMO, { error: 'avalúo no puede superar 100.000.000' })
      .optional(),
    // fecha_adquisicion: igual que hoy
    donacion_legitimario: z.enum(['true', 'false']).optional(),
  })
  .strict()
  .refine((q) => q.tipo !== 'donacion' || q.donacion_legitimario !== undefined, {
    error: 'donacion_legitimario requerido cuando tipo=donacion',
    path: ['donacion_legitimario'],
  })
```

Los mensajes de las refinaciones de fecha también en español si no lo están («Fecha inexistente», «No puede ser futura» ya lo están).

- [ ] **Paso 2:** parseo con mensajes genéricos en español (zod 4 trae el locale; se pasa por llamada para no cambiar
la configuración global que usan el bot y los formularios):

```ts
    const parsed = querySchema.safeParse(params, { error: z.locales.es().localeError })
    if (!parsed.success) {
      const { formErrors, fieldErrors } = parsed.error.flatten()
      return NextResponse.json(
        { error: 'Solicitud inválida', details: { ...fieldErrors, ...(formErrors.length ? { general: formErrors } : {}) } },
        { status: 422, headers: SIN_INDEXAR },
      )
    }
```

Si `iss.input` no llega como `undefined` para un parámetro ausente (depende de `z.coerce`), ajustar la condición del
mensaje de `cuantia` hasta que pase el test «cuantía requerida»; no cambiar el test. Si el error de claves desconocidas
no cae en `formErrors`, buscarlo en `parsed.error.issues` y exponerlo en `details.general`.

- [ ] **Paso 3:** cabecera en TODAS las respuestas (200, 422, 429, 500):

```ts
// Permitido rastrear (robots.txt) pero no indexar la respuesta
const SIN_INDEXAR = { 'X-Robots-Tag': 'noindex' }
```

Agregar `...SIN_INDEXAR` a los `headers` de cada `NextResponse.json`. Mensajes: `'Too many requests'` →
`'Demasiadas solicitudes'`, `'Internal server error'` → `'Error interno'`.

- [ ] **Paso 4:** `donacionLegitimario: q.donacion_legitimario === 'true',` (ya no hay default en la ruta).

- [ ] **Paso 5:** en `src/lib/formulas/cotizar.ts`, el supuesto
`'Donación a legitimario: sin alcabala (donacion_legitimario=true, valor por defecto).'` →
`'Donación a legitimario: sin alcabala (donacion_legitimario=true).'`. No tocar nada más de ese archivo.

- [ ] **Paso 6:** `npx vitest run && npx tsc --noEmit` → verde (salvo el error preexistente). Commit:

```bash
git add src/app/api/cotizar/ src/lib/formulas/cotizar.ts
git commit -m "feat(api-cotizar): validación estricta, legitimario obligatorio, errores en español, noindex"
```

---

### Tarea 3: robots.txt

**Archivos:** `src/app/robots.ts`, crear `src/app/robots.test.ts`

- [ ] **Paso 1: test (rojo)**

```ts
import { describe, it, expect } from 'vitest'
import robots from './robots'

describe('robots.txt', () => {
  it('permite /api/cotizar aunque /api/ siga bloqueado', () => {
    const { rules } = robots()
    const regla = Array.isArray(rules) ? rules[0] : rules
    expect(regla.allow).toContain('/api/cotizar')
    expect(regla.disallow).toContain('/api/')
  })
})
```

- [ ] **Paso 2:** `npx vitest run src/app/robots.test.ts` → FAIL.
- [ ] **Paso 3:** en `robots.ts`, `allow: '/'` → `allow: ['/', '/api/cotizar']`. (Google aplica la regla más
específica: `Allow: /api/cotizar` gana sobre `Disallow: /api/`.)
- [ ] **Paso 4:** verde. Commit: `git commit -am "feat(robots): permitir /api/cotizar"` (agregar antes el test con `git add`).

---

### Tarea 4: Documentación

**Archivo:** `docs/api-cotizar.md`

- [ ] En la tabla de parámetros: `donacion_legitimario` → «sí, si `tipo=donacion`» / `true` o `false`, sin defecto.
- [ ] Bajo la tabla: «Cualquier otro parámetro devuelve 422 (incluidos `utm_*`). No hay parámetros de descuento: los
  descuentos por adulto mayor dependen de los comparecientes y los calcula el sistema que consume la API.»
- [ ] En Errores: `error: "Solicitud inválida"` con `details` por campo en español; 429 `"Demasiadas solicitudes"`;
  500 `"Error interno"`. Cabecera `X-Robots-Tag: noindex` en todas las respuestas; robots.txt permite el rastreo.
- [ ] Ejemplo curl de donación: agregar `&donacion_legitimario=true` al que no lo tenga.
- [ ] Commit: `git commit -am "docs: api-cotizar v2"`

---

### Tarea 5: Cierre

- [ ] `npx vitest run` verde, `npx tsc --noEmit` solo con el error preexistente.
- [ ] `npm run dev` en el worktree (copiar `/d/aoe-v2/.env.local` y borrarlo al final) y comprobar:
  - `curl -i "localhost:3000/api/cotizar?tipo=promesa&cuantia=85000"` → 200, `X-Robots-Tag: noindex`, subtotal 332.58
  - `curl "localhost:3000/api/cotizar?tipo=compraventa"` → 422 con «cuantía requerida»
  - `curl "localhost:3000/api/cotizar?tipo=donacion&cuantia=85000"` → 422
  - `curl "localhost:3000/robots.txt"` → contiene `Allow: /api/cotizar`
- [ ] Push y PR, **sin desplegar**:

```bash
git push -u origin claude/api-cotizar-v2
gh pr create --base main --title "/api/cotizar v2: validación estricta, errores en español, robots" --body-file docs/plans/2026-09-24-api-cotizar-v2-plan.md
```
