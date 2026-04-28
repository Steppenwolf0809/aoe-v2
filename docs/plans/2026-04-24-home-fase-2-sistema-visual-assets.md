# Fase 2 - Sistema visual y assets del Centro Legal Inteligente

Fecha: 2026-04-24
Proyecto: `D:\aoe-v2-github`
Rama: `codex/home-redesign-plan`

Documento base:

- `docs/plans/2026-04-24-home-fase-1-hero-centro-legal-inteligente.md`

## 1. Objetivo de la fase

Convertir el storyboard del hero en una direccion visual concreta para implementacion.

Esta fase define:

- Paleta extendida para hero, dashboards y rutas.
- Layout desktop/mobile del primer viewport.
- Componentes visuales del Centro Legal Inteligente.
- Sistema de iconos, tarjetas, chips, medidores y timelines.
- Prompts finales para ImageGen.
- Decision tecnica recomendada para animacion.

La meta no es crear una galeria decorativa. La meta es que el usuario vea una plataforma que organiza decisiones legales importantes en Ecuador:

- Calcular costos.
- Diagnosticar riesgos.
- Generar documentos.
- Negociar o pedir apoyo legal.

## 2. Direccion visual

Estilo:

- Legaltech premium.
- SaaS sobrio.
- Dark hero elegante.
- Interfaces abstractas y funcionales.
- Alto contraste.
- Mucho espacio para respirar.
- Microdetalles de producto, no decoracion legal tradicional.

Sensacion buscada:

- Preciso.
- Confiable.
- Moderno.
- Estrategico.
- Humano sin usar fotografia generica.

Evitar:

- Balanzas, martillos, columnas, sellos exagerados.
- Fotos de abogados posando.
- Fondos morados genericos.
- Pantallas con texto ilegible excesivo.
- Animaciones que parezcan fintech de deuda agresiva.

## 3. Paleta extendida

El sitio ya usa el azul oficial:

- Brand Blue: `#024089`
- Deep Slate: `#0f172a`
- Soft Cloud: `#f8fafc`

Para la home nueva, se propone extender sin romper la marca:

### Fondos

- Night Ink: `#070b14`
- Navy Surface: `#0b1220`
- Slate Panel: `#111827`
- White Smoke: `#f7f9fc`
- Pale Blue: `#eef6ff`

### Acentos

- Brand Blue: `#024089`
- Electric Cyan: `#38bdf8`
- Domain Green: `#4ade80`
- Debt Coral: `#fb7185`
- Vehicle Blue: `#60a5fa`
- Document Gold: `#fbbf24`

### Texto

- Hero White: `#f8fafc`
- Soft Text Dark: `#cbd5e1`
- Muted Text Dark: `#94a3b8`
- Body Dark: `#0f172a`
- Body Muted: `#475569`

Regla:

El hero y deuda pueden vivir en dark mode. Las secciones de lectura, calculadoras y FAQ deben volver a fondos claros para no fatigar.

## 4. Tipografia

El proyecto usa Geist via Tailwind. Mantener Geist para evitar dependencias.

Uso recomendado:

- Headline hero: Geist Sans, 56-72 px desktop, 38-44 px mobile.
- Subtitulo hero: 18-20 px desktop, 16-17 px mobile.
- Datos del dashboard: Geist Mono para montos, porcentajes y estados.
- Labels de chips: mayusculas pequenas con tracking moderado.

Reglas:

- No usar tracking negativo excesivo.
- No meter parrafos largos dentro del dashboard.
- Los numeros deben usar `font-variant-numeric: tabular-nums`.

## 5. Layout del hero

### Desktop recomendado

Grid:

- 48% texto y CTAs.
- 52% dashboard animado.
- Max width: `1280px`.
- Altura: entre `calc(100dvh - 64px)` y `760px`.

Columna izquierda:

- Eyebrow: `Plataforma Legal Inteligente en Ecuador`
- H1: `Calcula, diagnostica y resuelve tus tramites legales importantes`
- Subtitulo corto.
- Tres CTAs maximo.
- Fila de confianza:
  - Ecuador
  - Calculadoras gratuitas
  - Documentos legales
  - Atencion online

Columna derecha:

- `HeroSmartLegalDashboard`.
- Vista activa con una ruta principal.
- Chips superiores para las cuatro rutas.
- Panel lateral con siguiente accion.

### Mobile recomendado

Orden:

1. Eyebrow.
2. H1.
3. Subtitulo.
4. CTA primario: `Calcular mi tramite`.
5. CTA secundario compacto: `Evaluar deuda`.
6. Dashboard en tarjeta unica.
7. Chips: Inmueble, Deuda, Vehiculo, Documento.

Regla mobile:

No mostrar los cuatro modulos completos simultaneamente. Eso se volveria confuso y pequeno.

## 6. Componentes visuales del dashboard

### 6.1 Shell principal

Nombre recomendado:

`HeroSmartLegalDashboard`

Elementos:

- Header interno: `Centro Legal Inteligente`.
- Estado: `Analizando ruta`.
- Chips de ruta:
  - Inmueble
  - Deuda
  - Vehiculo
  - Documento
- Panel principal.
- Panel secundario de documentos o riesgos.
- CTA contextual.

Estilo:

- Fondo `#0b1220`.
- Borde `rgba(255,255,255,0.10)`.
- Shadow profundo, no exagerado.
- Glow cian sutil desde esquina superior.
- Glow coral solo cuando deuda esta activa.

### 6.2 Tarjetas de datos

Formato:

- Label pequeno.
- Valor grande.
- Descripcion corta.

Ejemplos:

- `Valor referencial` / `USD 120.000`
- `Riesgo estimado` / `Medio alto`
- `Documento` / `Contrato vehicular`
- `Estado` / `Listo para revisar`

### 6.3 Checklist documental

Uso:

- Inmueble: gravamenes, predio, cedulas, minuta.
- Deuda: contrato, pagare, estado de cuenta, comunicaciones.
- Vehiculo: matricula, CUV, cedulas, forma de pago.
- Documento: partes, acto, clausulas, requisitos.

Estilo:

- Check circular pequeno.
- Color de ruta.
- Texto breve.

### 6.4 Timeline

Uso:

- Transferencia de dominio:
  - Promesa
  - Minuta
  - Impuestos
  - Notaria
  - Registro

- Generador documental:
  - Datos
  - Validacion
  - Documento
  - Revision
  - Firma

Estilo:

- Linea fina.
- Puntos con estado.
- No mas de cinco pasos visibles.

### 6.5 Medidor de riesgo

Uso principal:

- Deuda.

Estados:

- Bajo
- Medio
- Alto
- Urgente

Regla:

No usar rojo agresivo para todo. Coral debe aparecer como alerta sobria, no como panico.

## 7. Sistema de rutas visuales

Cada ruta debe tener color, icono y lenguaje propio.

### Inmueble

- Color: cian + verde sutil.
- Iconos: Building2, Home, Calculator, FileCheck2.
- Lenguaje: costos claros, documentos, escritura, registro.
- CTA: `Calcular transferencia`.

### Deuda

- Color: coral.
- Iconos: ShieldAlert, Handshake, FileWarning, MessageCircleWarning.
- Lenguaje: riesgo, estrategia, acuerdo, defensa responsable.
- CTA: `Evaluar deuda`.

### Vehiculo

- Color: azul electrico.
- Iconos: Car, FileSignature, ClipboardCheck.
- Lenguaje: contrato, CUV, legalizacion, comprador/vendedor.
- CTA: `Generar contrato vehicular`.

### Documento

- Color: dorado sobrio o blanco humo + cian.
- Iconos: Files, FileText, PenLine, ScrollText.
- Lenguaje: poderes, minutas, promesas, declaraciones.
- CTA: `Crear documento`.

Nota:

Si poderes/minutas todavia no estan implementados, se deben presentar como "proximamente" o "ruta en preparacion", no como disponibles.

## 8. Assets ImageGen

La implementacion del dashboard debe ser preferentemente code-native. ImageGen se usara para:

- Mockups/frames de referencia.
- Texturas oscuras suaves.
- Assets promocionales o fondos secundarios.
- Imagenes para secciones que necesiten una sensacion visual premium sin depender de fotos de stock.

No se debe generar texto incrustado dentro de las imagenes. El texto se renderiza con HTML para SEO, responsive y accesibilidad.

### 8.1 Hero dashboard reference

Archivo sugerido:

`public/assets/landing/hero-centro-legal-inteligente-v1.webp`

Prompt:

```text
Use case: ui-mockup
Asset type: landing page hero reference image
Primary request: Premium legaltech dashboard interface for a Spanish-speaking legal services platform in Ecuador.
Scene/backdrop: dark navy enterprise SaaS command center, elegant glass panels, subtle depth and soft grid texture.
Subject: central dashboard with four abstract modules representing property transfer cost estimation, debt risk evaluation, vehicle contract generation, and legal document generation.
Style/medium: high-end product UI mockup, refined, minimal, sober, premium B2B SaaS.
Composition/framing: wide 16:9, dashboard angled slightly but still readable as interface, strong empty space around edges for website placement.
Lighting/mood: controlled cyan glow, small coral accent for risk module, dark premium atmosphere.
Color palette: night navy, graphite, official deep blue, electric cyan, soft coral, white smoke.
Constraints: no readable text, no people, no gavel, no scales, no columns, no law firm stock photo look, no purple gradient blobs, no watermark.
Avoid: alarmist debt imagery, money piles, courthouse cliches, cluttered tiny UI.
```

### 8.2 Transferencia de dominio module

Archivo sugerido:

`public/assets/landing/modulo-transferencia-dominio-v1.webp`

Prompt:

```text
Use case: ui-mockup
Asset type: landing page section visual
Primary request: Premium SaaS dashboard module for estimating property transfer costs in Ecuador.
Scene/backdrop: clean dark and white interface, elegant cards, subtle legaltech atmosphere.
Subject: cost breakdown cards, document checklist, and timeline from promise to deed to taxes to notary to registry.
Style/medium: polished UI mockup, premium product design, no photography.
Composition/framing: 16:9, main cost panel prominent, checklist and timeline secondary.
Lighting/mood: calm, precise, trustworthy.
Color palette: navy, white smoke, cyan, subtle green.
Constraints: no readable text, no people, no legal cliches, no real logos, no watermark.
Avoid: real estate stock photos, keys in hands, contract signing photo.
```

### 8.3 Riesgo de deuda module

Archivo sugerido:

`public/assets/landing/modulo-riesgo-deuda-v1.webp`

Prompt:

```text
Use case: ui-mockup
Asset type: landing page section visual
Primary request: Premium legal risk dashboard for debt negotiation in Ecuador.
Scene/backdrop: dark navy interface with sober risk analysis panels.
Subject: risk meter, document checklist, negotiation timeline, next-action card.
Style/medium: high-end legaltech SaaS UI, strategic and calm.
Composition/framing: 16:9, risk meter visible but not alarmist, checklist and action card balanced.
Lighting/mood: serious, controlled, reassuring.
Color palette: night navy, graphite, soft coral, muted white, small cyan accent.
Constraints: no readable text, no people, no money piles, no aggressive red warning screen, no legal cliches, no watermark.
Avoid: debt collection imagery, fear-based visuals, courtroom photos.
```

### 8.4 Contrato vehicular module

Archivo sugerido:

`public/assets/landing/modulo-contrato-vehicular-v1.webp`

Prompt:

```text
Use case: ui-mockup
Asset type: landing page section visual
Primary request: Modern legal document generator interface for a vehicle sale contract.
Scene/backdrop: premium SaaS dashboard with dark and light surfaces.
Subject: vehicle data card, buyer/seller form blocks, document preview assembling sections, progress checklist.
Style/medium: polished UI mockup, clean legaltech product design.
Composition/framing: 16:9, document preview prominent, structured form panels nearby.
Lighting/mood: efficient, clear, trustworthy.
Color palette: navy, white smoke, official blue, electric blue, slate.
Constraints: no readable text, no people, no car stock photo dominance, no real license plate, no watermark.
Avoid: dealership look, racing visuals, cluttered forms.
```

### 8.5 Generadores legales module

Archivo sugerido:

`public/assets/landing/modulo-generadores-legales-v1.webp`

Prompt:

```text
Use case: ui-mockup
Asset type: landing page section visual
Primary request: Premium legal document generator library for powers, minutes, promises, sworn statements, and vehicle contracts.
Scene/backdrop: elegant legaltech platform interface with modular document cards.
Subject: library of document types, active document assembling from sections, route cards for legal document generation.
Style/medium: premium SaaS UI mockup, refined and minimal.
Composition/framing: 16:9, document library on one side, assembling document preview on the other.
Lighting/mood: modern, capable, calm.
Color palette: night navy, white smoke, cyan, muted gold, graphite.
Constraints: no readable text, no people, no legal cliches, no fake logos, no watermark.
Avoid: paper stacks, old parchment, seals, cluttered office visuals.
```

### 8.6 Dark texture background

Archivo sugerido:

`public/assets/landing/texture-hero-navy-v1.webp`

Prompt:

```text
Use case: productivity-visual
Asset type: subtle landing page background texture
Primary request: Abstract premium dark navy texture for a legaltech SaaS landing page.
Scene/backdrop: deep navy and graphite surface with very subtle grid, fine noise, soft cyan edge light.
Subject: non-representational background texture.
Style/medium: minimal abstract digital texture.
Composition/framing: seamless-feeling 16:9, low contrast, no focal object.
Lighting/mood: premium, quiet, technical.
Color palette: dark navy, graphite, faint cyan.
Constraints: no text, no people, no icons, no law symbols, no watermark, no bright gradients.
Avoid: bokeh blobs, purple clouds, generic AI glow.
```

## 9. Decision tecnica recomendada

### Recomendacion V1

Implementar el hero principal como React animado, no como video obligatorio.

Razon:

- Mejor SEO y accesibilidad.
- Menor peso en mobile.
- CTAs reales y clicables.
- Facil de iterar.
- No bloquea la home por render/export de video.

Hyperframes se usara para:

- Storyboard de movimiento.
- Render promocional si luego se quiere video corto.
- Pruebas de escenas y timing.
- Assets visuales si conviene exportar un loop liviano.

### Estructura tecnica sugerida

Componentes:

- `Hero`
- `HeroSmartLegalDashboard`
- `HeroRouteTabs`
- `HeroCasePanel`
- `HeroChecklist`
- `HeroTimeline`
- `HeroRiskMeter`
- `HeroActionCard`

Datos:

- Crear un arreglo `heroCases` con cuatro rutas:
  - `domainTransfer`
  - `debt`
  - `vehicle`
  - `documentGenerator`

Animacion:

- Rotacion automatica cada 4 a 5 segundos.
- Permitir seleccion manual con tabs/chips.
- Pausar rotacion cuando el usuario interactua.
- Respetar `prefers-reduced-motion`.
- Usar transiciones de opacidad, y, scale y pequenas transformaciones.

No hacer:

- No usar canvas pesado para el hero.
- No usar video autoplay como unica fuente visual.
- No usar loops infinitos agresivos.
- No animar propiedades costosas como blur excesivo o layout grande en cada frame.

## 10. Estados responsive

### Desktop

- Dashboard completo.
- Dos paneles principales visibles.
- Tabs de ruta arriba.
- Timeline horizontal.
- CTA contextual visible.

### Tablet

- Dashboard mas compacto.
- Panel principal arriba, checklist abajo.
- Timeline reducido.

### Mobile

- Mostrar una sola ruta activa.
- Ocultar metricas secundarias.
- Usar chips horizontales scrolleables.
- CTA contextual debajo de la tarjeta.
- Altura maxima del dashboard controlada para no empujar toda la conversion fuera del viewport.

## 11. Accesibilidad

Requisitos:

- Todo CTA debe ser enlace real o boton accesible.
- Tabs de ruta deben tener estado activo claro.
- El dashboard animado no debe ser la unica forma de navegar.
- Si hay rotacion automatica, debe ser pausada por interaccion.
- Contraste minimo WCAG AA en textos.
- No depender solo del color para indicar riesgo o estado.
- Texto importante debe estar en HTML, no incrustado en imagen.

## 12. Riesgos y mitigaciones

### Riesgo 1: El hero intenta vender demasiadas cosas

Mitigacion:

- El headline vende la promesa general.
- El dashboard muestra rutas, no una lista completa de servicios.
- Las secciones posteriores desarrollan cada ruta.

### Riesgo 2: Deuda rompe la marca

Mitigacion:

- Tono coral sobrio.
- Lenguaje de estrategia y evaluacion.
- CTA al evaluador, no directo a WhatsApp.
- Sin promesas de eliminar deudas.

### Riesgo 3: Generadores legales prometen mas de lo actual

Mitigacion:

- Contrato vehicular como disponible.
- Poderes, minutas, promesas y declaraciones como expansion si no estan listas.
- Copy: "proximamente" o "en preparacion" cuando aplique.

### Riesgo 4: ImageGen produce texto malo o cliches

Mitigacion:

- Prompts prohiben texto legible.
- UI real se implementa en HTML.
- Imagenes se usan como referencia/fondo, no como fuente de informacion.

## 13. Criterios de aceptacion de Fase 2

La fase esta lista cuando:

- Existe paleta extendida compatible con la marca actual.
- Esta definido el layout desktop/mobile del hero.
- Estan definidos los componentes visuales del dashboard.
- Las cuatro rutas tienen color, icono, lenguaje y CTA.
- Hay prompts ImageGen listos para generar assets.
- Existe decision tecnica clara: React animado como V1, Hyperframes como storyboard/render complementario.
- La siguiente fase puede empezar creando componentes sin redefinir el estilo.

## 14. Siguiente fase recomendada

Fase 3:

- Crear el primer componente del hero animado.
- Implementar `HeroSmartLegalDashboard` con datos mock reales.
- Mantener links existentes.
- Validar desktop/mobile.
- Revisar capturas antes de reorganizar el resto de la home.

