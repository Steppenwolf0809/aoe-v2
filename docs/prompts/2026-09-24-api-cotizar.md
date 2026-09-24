# Encargo: API de cotización de costos de terceros (`GET /api/cotizar`)

Sesión siguiente: **planear** (`fable` / `xhigh`). No ejecutar en la misma sesión.
Salida esperada: `docs/plans/2026-09-24-api-cotizar-plan.md` con tareas TDD y código casi completo.

## Qué lograr

1. Corregir los errores de la Fase 1 (abajo).
2. Tests de los casos verificados a mano y de los límites.
3. `GET /api/cotizar` que devuelva solo costos de terceros (sin honorarios ni margen), con base legal,
   fórmula en texto y supuestos por rubro.
4. `docs/api-cotizar.md` con ejemplos en curl.
5. Rama nueva **en worktree** (en `main` hay cambios sin commitear de whatsapp-sessions que no van
   en este PR). Abrir PR. No desplegar.

## Qué leer primero

- `src/lib/formulas/` — la lógica ya es pura, probada (147 tests en verde el 2026-09-24) y la usan
  widgets y bot. **No crear `lib/calculos/` ni renombrar funciones.**
  - `notarial.ts` (`calcularTramiteNotarial`, tablas desde `src/lib/tariffs/notarial-ecuador-2026.json`)
  - `municipal.ts` (`calcularAlcabala`, rebaja por meses)
  - `consejo-provincial.ts` (10 % alcabala + $1,80)
  - `registro.ts` (8 rangos, >$40k: $100 + 0,5 % × (valor − 10.000), tope $500)
  - `inmobiliario.ts` (compone los anteriores)
- `src/app/api/bot/query/route.ts` y `src/lib/bot/rate-limiter.ts` — patrón existente de auth,
  rate limit y zod. Reutilizar el limitador (en memoria, por instancia: decirlo en la doc).
- `src/components/calculators/notarial-widget.tsx`, `animated-counter.tsx`
- `src/app/(marketing)/calculadoras/inmuebles/page.tsx`

## Decidido por José Luis (2026-09-24) y por qué

- **Base = mayor entre cuantía y avalúo** en notaría, registro y alcabala (es la regla legal).
  Consecuencia: `inmobiliario.ts` hoy usa solo `valorTransferencia` para notaría y registro →
  es un error de la web, corregirlo también ahí (cambia resultados visibles cuando avalúo > precio).
- **Rubros por tipo:**
  | tipo | notaría | alcabala | consejo prov. | registro |
  |---|---|---|---|---|
  | compraventa | Tabla 1 | 1 % con rebaja | 10 % + $1,80 | por cuantía |
  | promesa | Tabla 2 | — | — | — |
  | hipoteca | Tabla 3 | — | — | **tasa fija: `null`** (monto desconocido) |
  | donacion | Tabla 1 | a legitimarios: no; a no legitimarios: 1 % igual que compraventa | solo $1,80 si no hay alcabala; si hay, 10 % + $1,80 | por cuantía |
- **Registro de hipoteca:** devolver `valor: null` y un supuesto explícito («tasa fija del registro
  para hipotecas no configurada; no incluida en el subtotal»). No inventar el monto.
- **Donación:** parámetro booleano `donacion_legitimario` (default `true` → sin alcabala).
- **Plusvalía fuera de la API.**
- Sin fecha de adquisición → sin rebaja, y se informa como supuesto. No inventar valores (el bot hoy
  supone adquisición = 80 % y fecha 2020-01-01; no copiar eso).
- Sin datos personales, sin logs del cuerpo, sin leads (LOPDP).
- No cambiar tarifas, tablas ni constantes legales sin preguntar.

## Pendiente de José Luis (no bloquea)

- Monto y base legal de la tasa fija del registro para hipotecas. Mientras tanto, `null`.
- ¿Dónde vio el $0,00 del error (a)? Se corrige el contador igual.

## Fase 1 — errores a corregir

- a) Total $0,00: no reproducido en producción (promesa $85.000 mostró $332,58). Corregir igual
  `AnimatedCounter`: `duration={0.8}` (segundos) contra prop en ms, y depende de
  `requestAnimationFrame` sin fallback ni cleanup → mostrar el valor final siempre.
- b) La cuantía no se reinicia al cambiar de trámite (arrendamiento hereda 50000 como canon
  mensual); al borrar el campo queda un 0 fijo.
- c) `inmuebles/page.tsx:55` dice $1.60 → $1.80 (texto, no tarifa).
- Otros: widget Consejo Provincial abre con 24 meses (rebaja 30 % por defecto); `src/lib/calculators/`
  es código muerto duplicado; SBU duplicado en `types.ts`; "$14.46" a mano en vehicular-widget;
  montos entre X y X,01 caen fuera de rango (notaría da $0).

## Reportado, no corregir sin aprobación

- Registro >$40k usa (valor − 10.000): salto $200 → $250 en $40.000,01.
- Rebaja de alcabala tiene cuarto tramo 10 % (48 meses); confirmar contra la norma.

## Tests obligatorios

- Compraventa $85.000 → $385,60 + $57,84 = $443,44 (Art. 26, Tabla 1, $60.000,01–$90.000)
- Promesa $85.000 → $289,20 + $43,38 = $332,58 (Art. 27, Tabla 2)
- Registro $85.000 → $475,00
- Alcabala $85.000 sin rebaja → $850,00
- Consejo Provincial sobre $850 → $86,80
- Límites de cada rango (X y X,01), registro $40.000 / $40.000,01 / $90.000 / >$90.000 (tope $500),
  avalúo mayor que cuantía.

## Reparto

planeador `fable`/`xhigh` → ejecutor `sonnet`/`medium` en sesión propia → revisor
`claude-opus-5-5`/`medium` (sin medir: 0 corridas).

## Cómo se sabe que terminó

`npx vitest run` en verde, `npx tsc --noEmit` sin errores, `curl` a `/api/cotizar` en local con
los 5 casos devolviendo los montos de arriba, PR abierto sin desplegar.
