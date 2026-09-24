# API de cotización de costos de terceros — Plan de implementación

> **Para el ejecutor:** usar `superpowers:executing-plans` (o `subagent-driven-development`) tarea por tarea.
> Pasos con casillas `- [ ]`. TDD: test rojo → código mínimo → verde → commit.

**Encargo:** `docs/prompts/2026-09-24-api-cotizar.md` (leerlo antes; manda sobre este plan si hay choque).

**Objetivo:** corregir los errores de la Fase 1, fijar con tests los casos verificados a mano y exponer
`GET /api/cotizar`, que devuelve solo costos de terceros (notaría, alcabala, consejo provincial, registro)
con base legal, fórmula en texto y supuestos por rubro.

**Arquitectura:** un módulo puro nuevo `src/lib/formulas/cotizar.ts` que compone las funciones existentes
(sin renombrarlas y sin crear `lib/calculos/`). La ruta `src/app/api/cotizar/route.ts` solo valida con zod,
aplica el limitador en memoria de `src/lib/bot/rate-limiter.ts` y serializa.

**Stack:** Next.js 16 (App Router), TypeScript 5.9, zod 4, vitest 4 (`pool: 'vmThreads'`).

**Reparto:** ejecutor `sonnet`/`medium` en sesión propia → revisor `claude-opus-5-5`/`medium`.
Sin medir (0 corridas). Este plan lo escribió `claude-opus-5-5`, no `fable`/`xhigh` como pedía el encargo.

**Tiempo estimado:** 3–4 h de ejecutor. La tarea más larga es la 5 (≈45 min).

---

## Decisiones del planeador (aprobadas por José Luis, 2026-09-24)

Son decisiones que el encargo no tomó. José Luis las aprobó tal cual; no reabrirlas.

1. **La API es pública (sin API key)**, con rate limit por IP (`cotizar:<ip>`, 200/min por instancia).
   La IP solo vive en el `Map` en memoria; no se registra en ningún log.
2. **Hipoteca: base = cuantía (monto del préstamo)**; si viene `avaluo`, se ignora y se dice en supuestos.
   Compraventa, promesa y donación: base = mayor entre cuantía y avalúo.
3. **Fecha de referencia para la rebaja = hoy (UTC del servidor)**. `fecha_adquisicion` futura → 422.
4. **Donación a legitimario:** el rubro alcabala aparece con `valor: 0` y el motivo, en vez de omitirse.
5. **Base legal de alcabala sin número de artículo** («COOTAD, impuesto de alcabala»): no está en el repo
   y no se inventa. Pendiente de José Luis, igual que la tasa fija de hipoteca en el registro.

## Mapa de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/lib/formulas/notarial.ts:482-484` | Modificar | `buscarEnTabla` sin huecos entre X y X,01 |
| `src/lib/formulas/registro.ts:78-84` | Modificar | búsqueda de rango sin huecos |
| `src/lib/formulas/inmobiliario.ts` | Modificar | base = mayor(cuantía, avalúo) en notaría y registro |
| `src/lib/formulas/cotizar.ts` | Crear | cotización pura por tipo |
| `src/lib/formulas/cotizar.test.ts` | Crear | casos obligatorios + tipos |
| `src/lib/formulas/limites.test.ts` | Crear | límites de rangos notaría/registro + casos a mano |
| `src/app/api/cotizar/route.ts` | Crear | GET: zod + rate limit + JSON |
| `src/app/api/cotizar/route.test.ts` | Crear | 200 / 422 / cabeceras |
| `docs/api-cotizar.md` | Crear | documentación con curl |
| `src/components/calculators/animated-counter.tsx` | Modificar | siempre termina en el valor final |
| 5 widgets con `duration={0.8}` | Modificar | quitar la prop (usa 400 ms por defecto) |
| `src/components/calculators/notarial-widget.tsx` | Modificar | cuantía se reinicia y admite vacío |
| `src/components/calculators/consejo-provincial-widget.tsx:24` | Modificar | abre sin rebaja |
| `src/components/calculators/vehicular-widget.tsx:126`, `src/app/(marketing)/calculadoras/vehiculos/page.tsx:70` | Modificar | $14.46 calculado |
| `src/app/(marketing)/calculadoras/inmuebles/page.tsx:55` | Modificar | texto $1.60 → $1.80 |
| `src/lib/formulas/types.ts`, `src/lib/formulas/vehicular.ts:14` | Modificar | un solo `SBU_2026` |
| `src/lib/calculators/`, `scripts/test-calculators.ts` | Borrar | código muerto (solo lo usa ese script) |

**No tocar:** tarifas, JSON de tarifas, `LIMITE_MAXIMO`, fórmula >$40k del registro, cuarto tramo de rebaja,
`src/lib/bot/handlers.ts` (sus supuestos de 80 % y 2020-01-01 quedan como están; la API no los copia).

---

### Tarea 0: Worktree y línea base

- [ ] **Paso 1: Crear la rama en un worktree** (en `main` hay cambios de whatsapp-sessions sin commitear que no van aquí)

```bash
git -C /d/aoe-v2 worktree add /d/aoe-v2/.claude/worktrees/api-cotizar -b claude/api-cotizar main
cd /d/aoe-v2/.claude/worktrees/api-cotizar && npm install
```

Todas las rutas siguientes son relativas a ese worktree.

El encargo y este plan no están commiteados en `main`; copiarlos a la rama para que viajen en el PR:

```bash
mkdir -p docs/prompts docs/plans
cp /d/aoe-v2/docs/prompts/2026-09-24-api-cotizar.md docs/prompts/
cp /d/aoe-v2/docs/plans/2026-09-24-api-cotizar-plan.md docs/plans/
git add docs/prompts/2026-09-24-api-cotizar.md docs/plans/2026-09-24-api-cotizar-plan.md
git commit -m "docs: encargo y plan de /api/cotizar"
```

- [ ] **Paso 2: Línea base**

```bash
npx vitest run
npx tsc --noEmit
```

Esperado: todo verde (el encargo dice 147 tests el 2026-09-24). Anotar el número real. Si algo ya falla,
parar y reportarlo antes de seguir.

---

### Tarea 1: Notaría — rangos sin huecos + casos a mano

**Archivos:** Crear `src/lib/formulas/limites.test.ts` · Modificar `src/lib/formulas/notarial.ts:482-484`

- [ ] **Paso 1: Test (rojo)**

```ts
import { describe, it, expect } from 'vitest'
import tariffCatalog from '@/lib/tariffs/notarial-ecuador-2026.json'
import { calcularTramiteNotarial, SBU_2026, type TipoTramite } from './notarial'

type Regla = { min: number; max: number | null; tarifa_sbu?: number; tipo: string }
const reglas = (id: string) =>
  (tariffCatalog.tablas.find((t) => t.id === id)!.reglas as unknown as Regla[]).filter(
    (r) => r.tipo === 'rango_simple'
  )

const TABLAS: Array<[string, TipoTramite]> = [
  ['tabla_01', 'TRANSFERENCIA_DOMINIO'],
  ['tabla_02', 'PROMESA_COMPRAVENTA'],
  ['tabla_03', 'HIPOTECA'],
]

describe('Notaría: casos verificados a mano', () => {
  it('compraventa $85.000 → $385,60 + $57,84 = $443,44 (Art. 26, Tabla 1)', () => {
    const r = calcularTramiteNotarial('TRANSFERENCIA_DOMINIO', 85000)
    expect(r.subtotal).toBe(385.6)
    expect(r.iva).toBe(57.84)
    expect(r.total).toBe(443.44)
    expect(r.detalles[0]).toContain('Art. 26 - Tabla 1')
  })

  it('promesa $85.000 → $289,20 + $43,38 = $332,58 (Art. 27, Tabla 2)', () => {
    const r = calcularTramiteNotarial('PROMESA_COMPRAVENTA', 85000)
    expect(r.subtotal).toBe(289.2)
    expect(r.iva).toBe(43.38)
    expect(r.total).toBe(332.58)
    expect(r.detalles[0]).toContain('Art. 27 - Tabla 2')
  })
})

describe.each(TABLAS)('Notaría %s: límites de cada rango', (tablaId, tramite) => {
  const rs = reglas(tablaId)
  rs.forEach((regla, i) => {
    if (regla.max === null) return
    const siguiente = rs[i + 1]
    const esperadoEnMax = Math.round(regla.tarifa_sbu! * SBU_2026 * 100) / 100

    it(`$${regla.max} cae en su rango`, () => {
      expect(calcularTramiteNotarial(tramite, regla.max!).subtotal).toBeCloseTo(esperadoEnMax, 2)
    })

    if (!siguiente) return
    const esperadoSiguiente = Math.round(siguiente.tarifa_sbu! * SBU_2026 * 100) / 100

    it(`$${siguiente.min} cae en el rango siguiente`, () => {
      expect(calcularTramiteNotarial(tramite, siguiente.min).subtotal).toBeCloseTo(esperadoSiguiente, 2)
    })

    it(`$${regla.max + 0.005} (entre X y X,01) no da $0: usa el rango siguiente`, () => {
      expect(calcularTramiteNotarial(tramite, regla.max! + 0.005).subtotal).toBeCloseTo(esperadoSiguiente, 2)
    })
  })
})
```

- [ ] **Paso 2: Correr y ver el rojo**

Run: `npx vitest run src/lib/formulas/limites.test.ts`
Esperado: FAIL solo en los casos `(entre X y X,01)` (subtotal 0). Si falla otro, parar: sería un error de tabla,
no del plan, y no se corrige sin preguntar.

- [ ] **Paso 3: Código mínimo** — `src/lib/formulas/notarial.ts:482-484`. Los rangos están ordenados de menor a mayor,
así que el primero cuyo `hasta` cubre el monto es el correcto:

```ts
function buscarEnTabla(monto: number, tabla: RangoTarifa[]): RangoTarifa | undefined {
  return tabla.find((r) => monto <= r.hasta)
}
```

- [ ] **Paso 4: Verde**

Run: `npx vitest run src/lib/formulas/`
Esperado: PASS todo (incluidos los 42+ tests previos de notarial).

- [ ] **Paso 5: Commit**

```bash
git add src/lib/formulas/limites.test.ts src/lib/formulas/notarial.ts
git commit -m "fix(notarial): montos entre X y X,01 ya no caen fuera de rango"
```

---

### Tarea 2: Registro — rangos sin huecos + límites; alcabala y consejo provincial

**Archivos:** Modificar `src/lib/formulas/limites.test.ts`, `src/lib/formulas/registro.ts:78-84`

- [ ] **Paso 1: Test (rojo)** — agregar estos imports arriba de `limites.test.ts`:

```ts
import { calcularArancelRegistro } from './registro'
import { calcularAlcabalaYConsejoProvincial, calcularConsejoProvincial } from './consejo-provincial'
```

y al final del archivo:

```ts
describe('Registro: casos y límites', () => {
  it.each([
    [3000, 22],
    [3000.005, 30], // hueco X–X,01
    [3000.01, 30],
    [40000, 200],
    [40000.01, 250], // salto reportado, no corregido: $100 + 0,5 % × (valor − 10.000)
    [85000, 475],
    [90000, 500],
    [90000.01, 500], // tope
    [250000, 500],
  ])('$%s → $%s', (valor, esperado) => {
    expect(calcularArancelRegistro(valor).arancelFinal).toBe(esperado)
  })

  it('$90.000 llega justo al tope sin excederlo; $90.000,01 lo excede', () => {
    expect(calcularArancelRegistro(90000).excedeMaximo).toBe(false)
    expect(calcularArancelRegistro(90000.01).excedeMaximo).toBe(true)
  })
})

describe('Alcabala y Consejo Provincial: casos a mano', () => {
  it('alcabala $85.000 sin rebaja → $850,00', () => {
    expect(calcularAlcabalaYConsejoProvincial(85000).impuestoAlcabala).toBe(850)
  })

  it('consejo provincial sobre $850 → $86,80', () => {
    expect(calcularConsejoProvincial(850).total).toBe(86.8)
  })

  it('avalúo mayor que cuantía: alcabala sobre el avalúo', () => {
    expect(calcularAlcabalaYConsejoProvincial(80000, 85000).impuestoAlcabala).toBe(850)
  })
})
```

- [ ] **Paso 2: Rojo**

Run: `npx vitest run src/lib/formulas/limites.test.ts`
Esperado: FAIL solo en `$3000.005 → $30` (da 0).

- [ ] **Paso 3: Código mínimo** — en `calcularArancelBase` (`registro.ts`), reemplazar la búsqueda:

```ts
    const encontrado = RANGOS_REGISTRO.find(
      (r) => valorContrato <= r.max && r.rango !== 9
    )
```

- [ ] **Paso 4: Verde** — `npx vitest run src/lib/formulas/` → PASS.

- [ ] **Paso 5: Commit**

```bash
git add src/lib/formulas/limites.test.ts src/lib/formulas/registro.ts
git commit -m "fix(registro): cerrar huecos entre rangos y fijar límites con tests"
```

---

### Tarea 3: Inmobiliario — base = mayor entre cuantía y avalúo

Cambia resultados visibles de `/calculadoras/inmuebles` cuando avalúo > precio (decidido por José Luis).

**Archivos:** Modificar `src/lib/formulas/inmobiliario.test.ts`, `src/lib/formulas/inmobiliario.ts`

- [ ] **Paso 1: Test (rojo)** — agregar al final de `inmobiliario.test.ts` (reusar el `import` existente de
`calcularPresupuestoInmobiliario`):

```ts
describe('Base = mayor entre cuantía y avalúo', () => {
  const input = {
    valorTransferencia: 80000,
    avaluoCatastral: 85000,
    valorAdquisicion: 80000,
    fechaAdquisicion: '2010-01-01',
    fechaTransferencia: '2026-09-24',
    tipoTransferencia: 'Compraventa' as const,
    tipoTransferente: 'Natural' as const,
  }

  it('notaría usa el avalúo cuando es mayor', () => {
    expect(calcularPresupuestoInmobiliario(input).comprador.notarial.total).toBe(443.44)
  })

  it('registro usa el avalúo cuando es mayor', () => {
    expect(calcularPresupuestoInmobiliario(input).comprador.registro.arancelFinal).toBe(475)
  })
})
```

(Con precio $80.000 notaría también cae en Tabla 1 $60.000,01–$90.000, así que ese test pasa ya; el de
registro es el rojo: $80.000 da $450, $85.000 da $475.)

- [ ] **Paso 2: Rojo** — `npx vitest run src/lib/formulas/inmobiliario.test.ts` → FAIL en registro.

- [ ] **Paso 3: Código mínimo** — en `calcularPresupuestoInmobiliario`, antes de `// 1. Notarial`:

```ts
  // Base legal: el mayor entre precio y avalúo (igual que alcabala)
  const baseImponible = Math.max(input.valorTransferencia, input.avaluoCatastral)
```

y usar `baseImponible` en lugar de `input.valorTransferencia` en las llamadas a `calcularTramiteNotarial` y
`calcularArancelRegistro`. Al final, reemplazar
`const valorInmueble = Math.max(input.valorTransferencia, input.avaluoCatastral)` por
`const valorInmueble = baseImponible`.

- [ ] **Paso 4: Verde** — `npx vitest run src/lib/formulas/` → PASS (los tests previos tienen avalúo ≤ precio).

- [ ] **Paso 5: Commit**

```bash
git add src/lib/formulas/inmobiliario.ts src/lib/formulas/inmobiliario.test.ts
git commit -m "fix(inmobiliario): notaría y registro sobre el mayor entre precio y avalúo"
```

---

### Tarea 4: Un solo SBU

**Archivos:** Modificar `src/lib/formulas/types.ts`, `src/lib/formulas/vehicular.ts:14`

- [ ] **Paso 1:** en `vehicular.ts` cambiar `import { SBU_2026, IVA_RATE } from './types'` por
`import { SBU_2026, IVA_RATE } from './notarial'`.
- [ ] **Paso 2:** borrar de `types.ts` el bloque `// CONSTANTES COMPARTIDAS` (`SBU_2026` e `IVA_RATE`).
- [ ] **Paso 3:** `npx vitest run src/lib/formulas/ && npx tsc --noEmit` → verde. Si `tsc` señala otro import de
`SBU_2026`/`IVA_RATE` desde `types`, apuntarlo a `./notarial` (o `@/lib/formulas/notarial`).
- [ ] **Paso 4: Commit** — `git commit -am "refactor(formulas): SBU e IVA solo desde el catálogo notarial"`

---

### Tarea 5: `cotizar.ts` — módulo puro

**Archivos:** Crear `src/lib/formulas/cotizar.ts`, `src/lib/formulas/cotizar.test.ts`

- [ ] **Paso 1: Test (rojo)** — `cotizar.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cotizar } from './cotizar'

const HOY = new Date('2026-09-24T12:00:00Z')
const rubro = (r: ReturnType<typeof cotizar>, id: string) => r.rubros.find((x) => x.id === id)

describe('cotizar: compraventa', () => {
  const r = cotizar({ tipo: 'compraventa', cuantia: 85000 }, HOY)

  it('cuatro rubros con los montos a mano', () => {
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria', 'alcabala', 'consejo_provincial', 'registro'])
    expect(rubro(r, 'notaria')!.valor).toBe(443.44)
    expect(rubro(r, 'alcabala')!.valor).toBe(850)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(86.8)
    expect(rubro(r, 'registro')!.valor).toBe(475)
    expect(r.subtotal).toBe(1855.24)
  })

  it('cada rubro trae base legal, fórmula y supuestos', () => {
    for (const x of r.rubros) {
      expect(x.base_legal.length).toBeGreaterThan(0)
      expect(x.formula.length).toBeGreaterThan(0)
      expect(Array.isArray(x.supuestos)).toBe(true)
    }
    expect(rubro(r, 'notaria')!.base_legal).toContain('Art. 26 - Tabla 1')
  })

  it('sin fecha de adquisición: sin rebaja y lo dice', () => {
    expect(rubro(r, 'alcabala')!.supuestos.join(' ')).toMatch(/sin rebaja/i)
  })

  it('con fecha de adquisición a 10 meses: rebaja 40 %', () => {
    const c = cotizar({ tipo: 'compraventa', cuantia: 85000, fechaAdquisicion: '2025-11-24' }, HOY)
    expect(rubro(c, 'alcabala')!.valor).toBe(510)
    expect(rubro(c, 'consejo_provincial')!.valor).toBe(52.8)
  })

  it('avalúo mayor que cuantía: todo sobre el avalúo', () => {
    const c = cotizar({ tipo: 'compraventa', cuantia: 80000, avaluo: 85000 }, HOY)
    expect(c.base_imponible).toBe(85000)
    expect(rubro(c, 'registro')!.valor).toBe(475)
    expect(rubro(c, 'alcabala')!.valor).toBe(850)
  })
})

describe('cotizar: promesa', () => {
  it('solo notaría Tabla 2: $332,58', () => {
    const r = cotizar({ tipo: 'promesa', cuantia: 85000 }, HOY)
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria'])
    expect(r.subtotal).toBe(332.58)
  })
})

describe('cotizar: hipoteca', () => {
  const r = cotizar({ tipo: 'hipoteca', cuantia: 85000, avaluo: 120000 }, HOY)

  it('registro en null, fuera del subtotal, con supuesto explícito', () => {
    const reg = rubro(r, 'registro')!
    expect(reg.valor).toBeNull()
    expect(reg.supuestos).toContain(
      'Tasa fija del registro para hipotecas no configurada; no incluida en el subtotal.'
    )
    expect(r.subtotal).toBe(rubro(r, 'notaria')!.valor)
  })

  it('base = monto del préstamo, ignora el avalúo', () => {
    expect(r.base_imponible).toBe(85000)
    expect(r.rubros.map((x) => x.id)).toEqual(['notaria', 'registro'])
  })
})

describe('cotizar: donación', () => {
  it('a legitimario (default): alcabala 0 y consejo provincial solo $1,80', () => {
    const r = cotizar({ tipo: 'donacion', cuantia: 85000 }, HOY)
    expect(rubro(r, 'notaria')!.valor).toBe(443.44)
    expect(rubro(r, 'alcabala')!.valor).toBe(0)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(1.8)
    expect(rubro(r, 'registro')!.valor).toBe(475)
  })

  it('a no legitimario: alcabala 1 % igual que compraventa', () => {
    const r = cotizar({ tipo: 'donacion', cuantia: 85000, donacionLegitimario: false }, HOY)
    expect(rubro(r, 'alcabala')!.valor).toBe(850)
    expect(rubro(r, 'consejo_provincial')!.valor).toBe(86.8)
  })
})

it('aviso: sin honorarios ni plusvalía', () => {
  const r = cotizar({ tipo: 'promesa', cuantia: 85000 }, HOY)
  expect(r.aviso).toMatch(/honorarios/)
  expect(r.aviso).toMatch(/plusvalía/)
})
```

Cuentas del caso con rebaja: 850 × 0,60 = 510; 10 % de 510 = 51 + 1,80 = 52,80.

- [ ] **Paso 2: Rojo** — `npx vitest run src/lib/formulas/cotizar.test.ts` → FAIL «Cannot find module './cotizar'».

- [ ] **Paso 3: Implementación** — `cotizar.ts`:

```ts
/**
 * Cotización de costos de terceros — solo notaría, impuestos y registro.
 * Sin honorarios, sin margen, sin plusvalía. La usa GET /api/cotizar.
 * Compone las fórmulas existentes; no define tarifas propias.
 */

import { calcularTramiteNotarial, IVA_RATE, SBU_2026, type TipoTramite } from './notarial'
import { calcularMeses } from './municipal'
import {
  calcularAlcabalaYConsejoProvincial,
  calcularConsejoProvincial,
  VALOR_FIJO_CONSEJO_PROVINCIAL,
} from './consejo-provincial'
import { calcularArancelRegistro, LIMITE_MAXIMO } from './registro'

// ============================================
// INTERFACES
// ============================================

export type TipoCotizacion = 'compraventa' | 'promesa' | 'hipoteca' | 'donacion'

export interface InputCotizacion {
  tipo: TipoCotizacion
  cuantia: number
  avaluo?: number
  fechaAdquisicion?: string // YYYY-MM-DD
  donacionLegitimario?: boolean // default true
}

export interface RubroCotizacion {
  id: 'notaria' | 'alcabala' | 'consejo_provincial' | 'registro'
  nombre: string
  valor: number | null
  base_legal: string
  formula: string
  supuestos: string[]
}

export interface ResultadoCotizacion {
  tipo: TipoCotizacion
  moneda: 'USD'
  base_imponible: number
  rubros: RubroCotizacion[]
  subtotal: number
  supuestos: string[]
  aviso: string
}

// ============================================
// CONSTANTES DE TEXTO
// ============================================

const TRAMITE_NOTARIAL: Record<TipoCotizacion, TipoTramite> = {
  compraventa: 'TRANSFERENCIA_DOMINIO',
  donacion: 'TRANSFERENCIA_DOMINIO',
  promesa: 'PROMESA_COMPRAVENTA',
  hipoteca: 'HIPOTECA',
}

const REGLAMENTO_NOTARIAL =
  'Reglamento del Sistema Notarial Integral de la Función Judicial (R.O. Nº 246, 2023-02-08)'

export const AVISO_COTIZACION =
  'Solo costos de terceros (notaría, alcabala, consejo provincial y registro). ' +
  'No incluye honorarios profesionales, plusvalía ni otros cobros. Valores referenciales.'

export const SUPUESTO_REGISTRO_HIPOTECA =
  'Tasa fija del registro para hipotecas no configurada; no incluida en el subtotal.'

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export function cotizar(input: InputCotizacion, hoy: Date = new Date()): ResultadoCotizacion {
  const supuestos: string[] = []
  const base = baseImponible(input, supuestos)
  const rubros: RubroCotizacion[] = [rubroNotaria(input.tipo, base)]

  if (input.tipo === 'compraventa' || input.tipo === 'donacion') {
    const conAlcabala = input.tipo === 'compraventa' || input.donacionLegitimario === false
    rubros.push(...rubrosImpuestos(base, conAlcabala, input.fechaAdquisicion, hoy))
    rubros.push(rubroRegistro(base))
  }

  if (input.tipo === 'hipoteca') {
    rubros.push({
      id: 'registro',
      nombre: 'Registro de la Propiedad',
      valor: null,
      base_legal: 'Registro de la Propiedad de Quito — tasa fija para hipotecas',
      formula: 'No configurada',
      supuestos: [SUPUESTO_REGISTRO_HIPOTECA],
    })
  }

  supuestos.push(`Fecha de cálculo: ${hoy.toISOString().slice(0, 10)}.`)

  return {
    tipo: input.tipo,
    moneda: 'USD',
    base_imponible: base,
    rubros,
    subtotal: round(rubros.reduce((sum, r) => sum + (r.valor ?? 0), 0)),
    supuestos,
    aviso: AVISO_COTIZACION,
  }
}

// ============================================
// RUBROS
// ============================================

function baseImponible(input: InputCotizacion, supuestos: string[]): number {
  if (input.tipo === 'hipoteca') {
    if (input.avaluo !== undefined) {
      supuestos.push('Hipoteca: base = monto del préstamo (cuantía); el avalúo no se usa.')
    }
    return input.cuantia
  }
  if (input.avaluo !== undefined && input.avaluo > input.cuantia) {
    supuestos.push(`Base = avalúo (${usd(input.avaluo)}) por ser mayor que la cuantía (${usd(input.cuantia)}).`)
    return input.avaluo
  }
  return input.cuantia
}

function rubroNotaria(tipo: TipoCotizacion, base: number): RubroCotizacion {
  const r = calcularTramiteNotarial(TRAMITE_NOTARIAL[tipo], base)
  return {
    id: 'notaria',
    nombre: 'Notaría',
    valor: r.total,
    base_legal: `${REGLAMENTO_NOTARIAL}, ${r.detalles[0]}`,
    formula: `Tarifa del rango ${usd(r.subtotal)} + IVA ${IVA_RATE * 100} % ${usd(r.iva)} = ${usd(r.total)}`,
    supuestos: [
      `SBU vigente: ${usd(SBU_2026)}.`,
      'Sin rebajas por vivienda de interés social ni adulto mayor.',
    ],
  }
}

function rubrosImpuestos(
  base: number,
  conAlcabala: boolean,
  fechaAdquisicion: string | undefined,
  hoy: Date
): RubroCotizacion[] {
  const supuestosCP = ['Aplica a inmuebles en la provincia de Pichincha.']

  if (!conAlcabala) {
    const cp = calcularConsejoProvincial(0)
    return [
      {
        id: 'alcabala',
        nombre: 'Alcabala',
        valor: 0,
        base_legal: 'COOTAD, impuesto de alcabala',
        formula: 'No aplica',
        supuestos: ['Donación a legitimario: sin alcabala (donacion_legitimario=true, valor por defecto).'],
      },
      {
        id: 'consejo_provincial',
        nombre: 'Consejo Provincial',
        valor: cp.total,
        base_legal: 'Ordenanza del Consejo Provincial de Pichincha',
        formula: `Sin alcabala: solo valor fijo ${usd(VALOR_FIJO_CONSEJO_PROVINCIAL)}`,
        supuestos: supuestosCP,
      },
    ]
  }

  const meses = fechaAdquisicion ? calcularMeses(fechaAdquisicion, hoy) : undefined
  const r = calcularAlcabalaYConsejoProvincial(base, base, meses ?? 999)
  const antesRebaja = round(base * 0.01)

  const supuestosAlcabala =
    meses === undefined
      ? ['Sin fecha de adquisición: se calcula sin rebaja por tiempo.']
      : [`${meses} meses desde la adquisición (${fechaAdquisicion}) hasta la fecha de cálculo.`]

  const formulaAlcabala =
    r.rebajaAplicada > 0
      ? `1 % × ${usd(base)} = ${usd(antesRebaja)} − rebaja ${r.rebajaAplicada * 100} % = ${usd(r.impuestoAlcabala)}`
      : `1 % × ${usd(base)} = ${usd(r.impuestoAlcabala)}`

  return [
    {
      id: 'alcabala',
      nombre: 'Alcabala',
      valor: r.impuestoAlcabala,
      base_legal: 'COOTAD, impuesto de alcabala (1 % sobre el mayor entre precio y avalúo, rebaja por tiempo)',
      formula: formulaAlcabala,
      supuestos: supuestosAlcabala,
    },
    {
      id: 'consejo_provincial',
      nombre: 'Consejo Provincial',
      valor: r.impuestoConsejoProvincial,
      base_legal: 'Ordenanza del Consejo Provincial de Pichincha',
      formula: `10 % × alcabala ${usd(r.impuestoAlcabala)} = ${usd(r.valorPorcentaje)} + valor fijo ${usd(r.valorFijo)} = ${usd(r.impuestoConsejoProvincial)}`,
      supuestos: supuestosCP,
    },
  ]
}

function rubroRegistro(base: number): RubroCotizacion {
  const r = calcularArancelRegistro(base)
  const formula =
    r.exceso === null
      ? `Rango ${r.rango} de la tabla: ${usd(r.arancelFinal)}`
      : `$100 + 0,5 % × (${usd(base)} − $10.000) = ${usd(round(100 + r.exceso * 0.005))}` +
        (r.excedeMaximo ? `; tope ${usd(LIMITE_MAXIMO)}` : '')

  return {
    id: 'registro',
    nombre: 'Registro de la Propiedad',
    valor: r.arancelFinal,
    base_legal: 'Tabla de aranceles del Registro de la Propiedad de Quito',
    formula,
    supuestos: ['Sin descuentos por adulto mayor ni discapacidad.'],
  }
}

// ============================================
// HELPERS
// ============================================

function round(value: number): number {
  return Math.round(value * 100) / 100
}

function usd(valor: number): string {
  return `$${valor.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
```

Nota: `calcularAlcabalaYConsejoProvincial` ya recibe los meses y por defecto (999) no aplica rebaja; por eso se usa
en vez de `calcularAlcabala`, que exige fechas.

- [ ] **Paso 4: Verde** — `npx vitest run src/lib/formulas/cotizar.test.ts` → PASS.
`calcularMeses` divide por 30,44 días: 2025-11-24 → 2026-09-24 da 9 meses (≤ 12 → rebaja 40 %).

- [ ] **Paso 5: Commit**

```bash
git add src/lib/formulas/cotizar.ts src/lib/formulas/cotizar.test.ts
git commit -m "feat(formulas): cotizar costos de terceros por tipo de trámite"
```

---

### Tarea 6: `GET /api/cotizar`

**Archivos:** Crear `src/app/api/cotizar/route.ts`, `src/app/api/cotizar/route.test.ts`

- [ ] **Paso 1: Test (rojo)** — `route.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { GET } from './route'

const get = (qs: string) =>
  GET(new Request(`http://localhost/api/cotizar?${qs}`, { headers: { 'x-forwarded-for': '203.0.113.7' } }))

describe('GET /api/cotizar', () => {
  it('compraventa $85.000 → 200 con los cuatro rubros', async () => {
    const res = await get('tipo=compraventa&cuantia=85000')
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.rubros.map((r: { valor: number }) => r.valor)).toEqual([443.44, 850, 86.8, 475])
    expect(res.headers.get('X-RateLimit-Remaining')).not.toBeNull()
  })

  it('promesa $85.000 → subtotal $332,58', async () => {
    const body = await (await get('tipo=promesa&cuantia=85000')).json()
    expect(body.subtotal).toBe(332.58)
  })

  it('donacion_legitimario=false → alcabala 850', async () => {
    const body = await (await get('tipo=donacion&cuantia=85000&donacion_legitimario=false')).json()
    expect(body.rubros[1].valor).toBe(850)
  })

  it.each([
    ['sin tipo', 'cuantia=85000'],
    ['tipo inválido', 'tipo=arriendo&cuantia=85000'],
    ['sin cuantía', 'tipo=compraventa'],
    ['cuantía negativa', 'tipo=compraventa&cuantia=-1'],
    ['cuantía no numérica', 'tipo=compraventa&cuantia=abc'],
    ['fecha mal formada', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=24/09/2020'],
    ['fecha futura', 'tipo=compraventa&cuantia=85000&fecha_adquisicion=2999-01-01'],
    ['legitimario no booleano', 'tipo=donacion&cuantia=85000&donacion_legitimario=si'],
  ])('%s → 422', async (_, qs) => {
    const res = await get(qs)
    expect(res.status).toBe(422)
    expect((await res.json()).error).toBe('Invalid request')
  })
})
```

- [ ] **Paso 2: Rojo** — `npx vitest run src/app/api/cotizar/` → FAIL «Cannot find module './route'».
(Es el primer test de una ruta en el repo. Si `next/server` no carga en vitest, reportarlo; no cambiar el pool.)

- [ ] **Paso 3: Implementación** — `route.ts` (mismo patrón que `src/app/api/bot/query/route.ts`):

```ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { checkRateLimit } from '@/lib/bot/rate-limiter'
import { cotizar } from '@/lib/formulas/cotizar'

// Sin datos personales ni logs de parámetros (LOPDP). Solo costos de terceros.

const querySchema = z.object({
  tipo: z.enum(['compraventa', 'promesa', 'hipoteca', 'donacion']),
  cuantia: z.coerce.number().positive(),
  avaluo: z.coerce.number().positive().optional(),
  fecha_adquisicion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .refine((f) => f <= new Date().toISOString().slice(0, 10), 'No puede ser futura')
    .optional(),
  donacion_legitimario: z.enum(['true', 'false']).optional(),
})

function getClientKey(request: Request): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return `cotizar:${ip || 'anon'}`
}

export async function GET(request: Request) {
  try {
    // 1. Rate limit (en memoria, por instancia)
    const rateLimit = checkRateLimit(getClientKey(request))
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
      return NextResponse.json(
        { error: 'Too many requests', retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter), 'X-RateLimit-Remaining': '0' } },
      )
    }

    // 2. Parse & validate
    const params = Object.fromEntries(new URL(request.url).searchParams)
    const parsed = querySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 422 },
      )
    }

    // 3. Cotizar
    const q = parsed.data
    const resultado = cotizar({
      tipo: q.tipo,
      cuantia: q.cuantia,
      avaluo: q.avaluo,
      fechaAdquisicion: q.fecha_adquisicion,
      donacionLegitimario: q.donacion_legitimario !== 'false',
    })

    return NextResponse.json(resultado, {
      headers: { 'X-RateLimit-Remaining': String(rateLimit.remaining) },
    })
  } catch {
    console.error('[cotizar] Error interno')
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Paso 4: Verde** — `npx vitest run src/app/api/cotizar/` → PASS. Luego `npx tsc --noEmit` → sin errores.

- [ ] **Paso 5: Commit**

```bash
git add src/app/api/cotizar/
git commit -m "feat(api): GET /api/cotizar con costos de terceros por rubro"
```

---

### Tarea 7: `docs/api-cotizar.md`

- [ ] **Paso 1:** crear el archivo con este contenido (completar el JSON de ejemplo pegando la respuesta real del
curl de la Tarea 11, no a mano):

````markdown
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
````

- [ ] **Paso 2: Commit** — `git add docs/api-cotizar.md && git commit -m "docs: API de cotización con ejemplos curl"`

---

### Tarea 8: `AnimatedCounter` siempre muestra el valor final (error a)

Sin test automático: el repo no tiene `jsdom`/`happy-dom` y no se agregan dependencias. Verificación manual en la
Tarea 11.

**Archivos:** Modificar `src/components/calculators/animated-counter.tsx` y los 5 widgets.

- [ ] **Paso 1:** en `animated-counter.tsx`, reemplazar desde `const [displayValue, ...` hasta el cierre del `useEffect`:

```tsx
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    prevValue.current = value

    if (start === end || typeof requestAnimationFrame !== 'function') {
      setDisplayValue(end)
      return
    }

    const startTime = performance.now()
    let frame = 0

    function animate(currentTime: number) {
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(start + (end - start) * eased)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    // Si rAF no corre (pestaña en segundo plano), igual se muestra el valor final
    const fallback = setTimeout(() => setDisplayValue(end), duration + 100)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(fallback)
      setDisplayValue(end)
    }
  }, [value, duration])
```

Y documentar la unidad en la interfaz: `duration?: number // milisegundos`.

- [ ] **Paso 2:** quitar `duration={0.8}` (0,8 ms, no segundos) en:
`consejo-provincial-widget.tsx:199` y `:229`, `municipal-widget.tsx:207`, `notarial-widget.tsx:640`,
`registro-widget.tsx:104`, `vehicular-widget.tsx:273`. `total-display.tsx` ya usa `600` (ms): no tocar.

- [ ] **Paso 3:** `npx tsc --noEmit` → sin errores.
- [ ] **Paso 4: Commit** — `git commit -am "fix(calculadoras): el contador siempre termina en el valor final"`

---

### Tarea 9: Cuantía del widget notarial (error b)

**Archivo:** `src/components/calculators/notarial-widget.tsx`

- [ ] **Paso 1:** estado que admite vacío (línea 36):

```tsx
  const [cuantia, setCuantia] = useState<number | ''>(50000)
```

- [ ] **Paso 2:** en `handleCalcular`, `calcularTramiteNotarial(tipoServicio, Number(cuantia) || 0, opciones)`.

- [ ] **Paso 3:** en el `onChange` del `<select>` (≈línea 227), después de `setTipoServicio(nuevoTipo)`, reiniciar la
cuantía cuando cambia entre arrendamiento y trámite con cuantía:

```tsx
            const eraArrendamiento = ['CONTRATO_ARRIENDO_ESCRITURA', 'INSCRIPCION_ARRENDAMIENTO'].includes(tipoServicio)
            const seraArrendamiento = ['CONTRATO_ARRIENDO_ESCRITURA', 'INSCRIPCION_ARRENDAMIENTO'].includes(nuevoTipo)
            if (eraArrendamiento !== seraArrendamiento) setCuantia('')
```

- [ ] **Paso 4:** en el `<input type="number">` de cuantía (≈línea 270):
`onChange={(e) => setCuantia(e.target.value === '' ? '' : Number(e.target.value))}`.
En el `<Slider>`: `value={[Number(cuantia) || 0]}`. En la línea ≈345 (`cuantia * tiempoMeses`): `(Number(cuantia) || 0) * tiempoMeses`.

- [ ] **Paso 5:** en el botón Calcular (≈línea 625) agregar `disabled={requiereCuantia && cuantia === ''}`.

- [ ] **Paso 6:** `npx tsc --noEmit` → sin errores. Commit:
`git commit -am "fix(notarial-widget): la cuantía se reinicia al cambiar de trámite y admite vacío"`

---

### Tarea 10: Arreglos chicos y código muerto

- [ ] **Paso 1 (error c):** `src/app/(marketing)/calculadoras/inmuebles/page.tsx:55` — en el texto, `$1.60` → `$1.80`.
- [ ] **Paso 2:** `consejo-provincial-widget.tsx:24` — `useState(24)` → `useState(60)` (más de 48 meses: sin rebaja).
- [ ] **Paso 3:** `vehicular-widget.tsx:126` — reemplazar `3% SBU = $14.46 por firma` por
  `{PORCENTAJE_FIRMA * 100}% SBU = ${(SBU_2026 * PORCENTAJE_FIRMA).toFixed(2)} por firma`, e importar
  `PORCENTAJE_FIRMA` de `@/lib/formulas/vehicular` y `SBU_2026` de `@/lib/formulas/notarial`.
  En `vehiculos/page.tsx:70`, convertir el `answer` en template literal con
  `$${(SBU_2026 * PORCENTAJE_FIRMA).toFixed(2)}` en lugar de `$14.46`, con los mismos imports.
- [ ] **Paso 4:** borrar código muerto. Verificar primero que nadie más lo importa:

```bash
grep -rn "lib/calculators" src scripts --include=*.ts --include=*.tsx
```

Esperado: solo `src/lib/calculators/*` y `scripts/test-calculators.ts`. Entonces:

```bash
git rm -r src/lib/calculators scripts/test-calculators.ts
```

Si aparece otro importador, no borrar y reportarlo.

- [ ] **Paso 5:** `npx vitest run && npx tsc --noEmit` → verde. Commit:
`git commit -am "chore: textos de tarifas, rebaja por defecto y borrar lib/calculators"`

---

### Tarea 11: Verificación final y PR

- [ ] **Paso 1:** `npx vitest run` → verde (línea base + los nuevos). `npx tsc --noEmit` → sin errores.
- [ ] **Paso 2:** `npm run dev` y los 5 curl de `docs/api-cotizar.md`. Esperado:
  - compraventa $85.000 → notaría 443.44, alcabala 850, consejo 86.8, registro 475, subtotal 1855.24
  - promesa $85.000 → subtotal 332.58
  - hipoteca → registro `null`, subtotal = notaría
  - donación no legitimario → alcabala 850
  - avalúo 85.000 con fecha 2025-11-24 → base 85000, alcabala 510
- [ ] **Paso 3:** pegar la respuesta real de compraventa en `docs/api-cotizar.md` y commitear.
- [ ] **Paso 4 (manual, navegador):** `/calculadoras/notarial` — promesa $85.000 muestra $332,58; cambiar a
  arrendamiento deja la cuantía vacía; borrar el campo no deja un 0 fijo. `/calculadoras/consejo-provincial`
  abre sin rebaja. `/calculadoras/inmuebles` dice $1.80.
- [ ] **Paso 5: PR, sin desplegar** (producción se despliega por CLI; abrir PR no despliega nada):

```bash
git push -u origin claude/api-cotizar
gh pr create --base main --title "API /api/cotizar + correcciones de calculadoras" --body-file docs/plans/2026-09-24-api-cotizar-plan.md
```

- [ ] **Paso 6:** anotar una línea en `~/.claude/BITACORA.md`: fecha | rol | modelo | effort | acertó | costo | frase.

---

## Cómo se sabe que terminó

`npx vitest run` en verde, `npx tsc --noEmit` sin errores, los 5 curl con los montos de la Tarea 11, PR abierto,
nada desplegado.
