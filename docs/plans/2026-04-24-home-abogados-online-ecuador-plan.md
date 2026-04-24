# Plan de rediseno Home - Abogados Online Ecuador

Fecha: 2026-04-24
Proyecto correcto: `D:\aoe-v2-github`
Repositorio: `https://github.com/Steppenwolf0809/aoe-v2`
Base de trabajo: `main` en `49dc43af9d167e4adb3936e0824fc2da11e4ffd8`
Rama sugerida: `codex/home-redesign-plan`

## 1. Contexto recuperado

El plan original se trabajo por error sobre `D:\abogados-online-v2` y el worktree de Codex:

`C:\Users\Usuario02\.codex\worktrees\1059\abogados-online-v2`

Ese entorno no representa el proyecto que esta en Vercel. El proyecto correcto es el repo `Steppenwolf0809/aoe-v2`, clonado ahora en `D:\aoe-v2-github`.

La version desplegada en Vercel no es una plantilla de Next. Es una aplicacion legal ya avanzada, con landing, calculadoras, contratos vehiculares, pagos PayPhone, Supabase, rutas de autenticacion y dashboard. Por eso este plan no debe reemplazar el producto con una home generica. Debe redisenar la entrada comercial preservando lo que ya funciona.

## 2. Estado real del proyecto

Stack actual:

- Next.js `16.1.6`
- React `19.2.3`
- Tailwind CSS v4
- Framer Motion
- Lucide React
- Supabase
- PayPhone
- Resend
- React PDF / PDF tooling

Home actual:

- `src/app/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/stats.tsx`
- `src/components/landing/narrative.tsx`
- `src/components/landing/features.tsx`
- `src/components/landing/calculator-preview.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/blog-preview.tsx`
- `src/components/landing/faq.tsx`
- `src/components/landing/cta.tsx`

Rutas publicas existentes relevantes:

- `/`
- `/servicios`
- `/servicios/[slug]`
- `/calculadoras`
- `/calculadoras/notarial`
- `/calculadoras/inmuebles`
- `/calculadoras/alcabalas`
- `/calculadoras/plusvalia`
- `/calculadoras/registro-propiedad`
- `/calculadoras/vehiculos`
- `/contratos/vehicular`
- `/contratos/[id]/pago`
- `/contratos/pago/callback`
- `/contratos/pago/exito`
- `/blog`
- `/blog/[slug]`
- `/contacto`

Riesgo principal:

No trabajar desde `D:\abogados-online-v2` ni desde `master`. Esa carpeta local es mas pequena y podria borrar partes importantes del producto real si se empuja. Todo cambio debe salir de `D:\aoe-v2-github`.

## 3. Objetivo comercial

Transformar la home desde una propuesta centrada en contratos, calculadoras y notaria en Quito hacia una plataforma legal de mayor alcance:

**Abogados Online Ecuador: plataforma de soluciones legales criticas.**

La home debe comunicar tres ideas en menos de cinco segundos:

1. Somos expertos notariales y documentales.
2. Ahora tambien resolvemos crisis de deuda.
3. La tecnologia acelera diagnostico, estrategia, tramite y seguimiento.

El nuevo posicionamiento no debe sentirse como una notaria tradicional digitalizada. Debe sentirse como un centro de mando legal para situaciones donde el usuario necesita claridad rapida: firmar, calcular, documentar, negociar o defenderse.

## 4. Arquitectura comercial de la home

La home debe abrir dos caminos claros:

- Camino notarial/documental: para quien necesita formalizar, calcular, generar o completar un tramite.
- Camino deuda/contencion: para quien tiene mora, llamadas de cobro, cartas, amenazas, juicio o riesgo financiero.

Los caminos viven bajo la misma marca, pero no deben competir ni usar el mismo lenguaje. La interfaz debe ayudar al usuario a decidir sin pensar demasiado.

Principio de conversion:

- No mezclar beneficios notariales y beneficios de deuda dentro de una misma tarjeta.
- No usar un solo bloque generico de "servicios".
- No repetir CTAs con la misma jerarquia sin explicar cuando usar cada uno.
- Deuda puede tener mas tension comercial porque es la nueva linea critica, pero notaria debe conservar autoridad.

## 5. Copy aprobado para el hero

Headline:

> Soluciones Legales Agiles: Notaria Digital y Negociacion de Deudas.

Subheadline:

> Resolvemos tus tramites notariales y crisis de deuda en minutos con tecnologia de punta y experiencia juridica de 12 anos.

CTA notarial:

> Realizar Tramite Notarial

Destino inicial:

- `/servicios` o `/calculadoras`

CTA deuda:

> Negociar mi Deuda Ahora

Destino inicial:

- `#evaluador-deudas`

Decision recuperada del plan anterior:

El CTA de deuda no debe ir directo a WhatsApp en el primer clic. Primero debe llevar al evaluador interno. WhatsApp aparece despues del resultado o como canal secundario.

## 6. Direccion visual

Referencia revisada en la conversacion previa:

`https://getdesign.md/linear.app/design-md`

La inspiracion es Linear: precision, minimalismo, oscuridad, bordes finos, acentos controlados. Para Abogados Online Ecuador se debe adaptar hacia un tono mas juridico, urgente y comercial.

Direccion recomendada:

- Fondo oscuro premium para hero y evaluador.
- Grafito, negro azulado y capas sutiles.
- Azul electrico para notaria/tramites.
- Morado rojo sofisticado para deuda/crisis.
- Bordes finos y glow localizado.
- Tarjetas limpias, sin cuadros azules pesados.
- Iconografia seria con `lucide-react`.
- Motion sobrio con Framer Motion.

Evitar:

- Gradientes morados genericos de SaaS.
- Caricaturas legales.
- Stock photos obvias o repetidas.
- Promesas de deuda absolutas o irresponsables.
- Exceso de texto en el primer viewport.
- Video de fondo o assets pesados.

## 7. Cambio clave respecto al plan original

El plan original asumia que la home era una plantilla base. En el repo correcto ya existe una landing funcional. Por eso la implementacion debe ser una migracion controlada, no una reconstruccion desde cero.

Se debe preservar:

- Flujo de contrato vehicular.
- Calculadoras existentes.
- PayPhone y paginas post-pago.
- SEO y JSON-LD actuales, ajustandolos al nuevo posicionamiento.
- Header, footer y rutas existentes.
- Componentes compartidos de UI.

Se debe reemplazar o adaptar:

- Hero actual centrado en "tramites notariales rapidos y seguros en Quito".
- Stats actuales para incluir autoridad legal y velocidad sin exagerar.
- Narrative actual, que esta muy centrada en notaria.
- Features actuales, que son una grilla de servicios notariales.
- CTA final generico.
- Blog preview para separar notaria y deuda.
- FAQ para incluir deuda sin prometer eliminacion garantizada.

## 8. Estructura propuesta de la nueva home

Orden recomendado:

1. Header existente con ajuste de navegacion.
2. Hero dual con selector de intencion.
3. Franja de confianza compacta.
4. Evaluador de Deudas como segunda gran seccion.
5. Soluciones legales por intencion.
6. Calculadora de escrituras como utilidad notarial.
7. Contenido editorial separado por notaria y deuda.
8. Testimonios mixtos.
9. FAQ legal prudente.
10. CTA final dual.
11. Footer actualizado.

## 9. Hero dual

Archivo base:

- `src/components/landing/hero.tsx`

Objetivo:

Convertir el hero actual en una decision rapida entre dos caminos.

Composicion desktop:

- Columna izquierda: headline, subheadline, prueba de autoridad y selector de intencion.
- Columna derecha: consola legal animada.

Composicion mobile:

- Una columna.
- Headline corto.
- Dos bloques de decision separados.
- CTA de deuda y CTA notarial con contexto visible.

Selector de intencion:

Bloque notarial:

- Titulo: "Necesito un tramite"
- Contexto: escrituras, poderes, contratos, calculadoras y documentos.
- CTA: "Realizar Tramite Notarial"
- Acento: azul electrico.
- Link inicial: `/servicios`

Bloque deuda:

- Titulo: "Tengo presion por una deuda"
- Contexto: mora, llamadas, cartas, riesgo de juicio o necesidad de acuerdo.
- CTA: "Negociar mi Deuda Ahora"
- Acento: morado rojo sofisticado.
- Link inicial: `#evaluador-deudas`

Consola visual:

- Dos carriles: "Tramite notarial" y "Crisis de deuda".
- Estados: "Diagnostico inicial", "Estrategia", "Documento / negociacion".
- Indicadores: "12 anos", "Ecuador", "minutos", "evaluacion guiada".

## 10. Evaluador de Deudas

Nuevo archivo sugerido:

- `src/components/landing/debt-evaluator-preview.tsx`

Ancla:

- `id="evaluador-deudas"`

Copy principal:

> Tienes deudas? Usa nuestro evaluador y obten tu estrategia en minutos.

Soporte:

> Responde 15 preguntas guiadas para entender tu nivel de riesgo, tus opciones de negociacion y los proximos pasos legales recomendados.

Formato V1 recomendado:

- Simulacion de formulario/chat legal.
- Barra de progreso: "Pregunta 1 de 15".
- Preguntas visibles:
  - "Tu deuda esta en mora?"
  - "Recibiste llamadas, cartas o amenazas de cobro?"
  - "Tienes ingresos actuales para proponer un acuerdo?"
  - "Ya existe demanda o citacion judicial?"
- Panel de resultado simulado:
  - Riesgo estimado.
  - Opciones de negociacion.
  - Siguiente paso recomendado.

CTA:

> Iniciar evaluacion gratuita

Nota legal:

> La evaluacion no reemplaza asesoria legal personalizada. Sirve para preparar una estrategia inicial.

Decision V1:

El evaluador debe parecer funcional desde la home. Si no se implementa almacenamiento real en la primera fase, debe dejar preparada la estructura para conectar la captura despues. Si se implementa captura desde V1, usar server actions y una tabla/CRM definido, no localStorage como fuente final.

Pendiente tecnico:

Definir donde se guardaran los leads del evaluador: Supabase, email operativo, CRM, Google Sheet o n8n.

## 11. Soluciones legales por intencion

Archivo base:

- `src/components/landing/features.tsx`

Reemplazar la grilla actual de 6 tarjetas por grupos de intencion:

Grupo 1: Resolver una crisis financiera

- Negociacion de deuda.
- Blindaje judicial.
- Preparacion documental para acuerdo.
- CTA: "Evaluar mi caso".

Grupo 2: Completar un tramite notarial

- Escrituras.
- Poderes.
- Certificaciones.
- Contratos.
- CTA: "Iniciar tramite".

Grupo 3: Calcular, aprender o prepararte

- Calculadoras notariales.
- Guias legales.
- Presupuestador inmobiliario.
- CTA: "Calcular ahora".

Tarjetas principales:

1. Negociacion de Deuda
   - Icono: `LockOpen` o `Handshake`.
   - Mensaje: diagnostico guiado, estrategia, negociacion y contencion.
   - CTA: "Evaluar mi caso".

2. Tramites Notariales Digitales
   - Icono: `FileCheck2` o `Stamp`.
   - Mensaje: escrituras, poderes, certificaciones y documentos.
   - CTA: "Iniciar tramite".

3. Calculadora de Escrituras
   - Icono: `Calculator`.
   - Mensaje: referencia de costos antes de iniciar.
   - CTA: "Calcular ahora".

4. Asesoria Legal Urgente
   - Icono: `Scale` o `MessageCircleWarning`.
   - Mensaje: orientacion para decisiones sensibles.
   - CTA: "Consultar".

## 12. Calculadoras

Archivo base:

- `src/components/landing/calculator-preview.tsx`

La calculadora no debe competir con deuda. Debe funcionar como prueba de autoridad notarial y utilidad concreta.

Cambios recomendados:

- Mantener el bloque.
- Reducir jerarquia visual respecto al evaluador de deudas.
- Presentarlo como "Calcula una referencia antes de iniciar tu tramite".
- Mantener links existentes a calculadoras reales.
- No mover calculadoras a una posicion que tape la nueva conversion principal de deuda.

## 13. Contenido editorial y SEO

Archivo base:

- `src/components/landing/blog-preview.tsx`

Problema actual:

El blog preview esta centrado en articulos notariales/inmobiliarios. Para la nueva estrategia, se necesita separar intenciones.

Direccion:

- Silo notarial: `/blog` o futuro `/notaria/blog`.
- Silo deuda: futuro `/deudas/blog`.

Ejemplos de titulos:

- "Que revisar antes de firmar una escritura".
- "Como prepararte antes de negociar una deuda".
- "Que hacer si ya recibiste una notificacion de cobro".
- "Cuando una deuda pasa de cobranza a riesgo judicial".

Riesgo SEO:

No mezclar demasiado notaria y deuda en una sola taxonomia si se quiere construir autoridad por tema. En V1 se puede mostrar el contenido en home, pero la arquitectura futura debe separar clusters.

## 14. Testimonios

Archivo base:

- `src/components/landing/testimonials.tsx`

Tono:

- Humano.
- Concreto.
- Prudente.
- Sin prometer eliminacion total de deudas.

Mezcla recomendada:

- Rapidez y claridad notarial.
- Seguridad en calculadoras.
- Tranquilidad frente a cobros.
- Estrategia y pasos concretos para deuda.

Ejemplos:

- "En una tarde entendi el costo de mi escritura y pude avanzar sin vueltas."
- "Llegue con miedo por llamadas de cobro; sali con una estrategia y pasos claros."
- "La plataforma me ayudo a organizar documentos, tiempos y opciones reales."

Nota:

Si no hay testimonios reales de deuda, usar placeholders sobrios con iniciales y ciudad, sin atribuir resultados especificos.

## 15. FAQ

Archivo base:

- `src/components/landing/faq.tsx`
- `src/app/page.tsx` para FAQ schema

Preguntas nuevas sugeridas:

- La evaluacion de deuda tiene costo?
- Pueden garantizar que eliminaran mi deuda?
- Que pasa si ya recibi una notificacion de cobro?
- La negociacion es extrajudicial o tambien hay defensa judicial?
- Que necesito para empezar un tramite notarial?

Regla legal:

La home puede vender velocidad y metodo, pero no resultados garantizados. Evitar frases como "eliminamos tu deuda" o "detenemos cualquier juicio".

## 16. Metadata y schema

Archivos:

- `src/app/page.tsx`
- `src/app/layout.tsx`
- `src/lib/constants.ts`

Metadata sugerida:

Title:

`Abogados Online Ecuador | Notaria Digital y Negociacion de Deudas`

Description:

`Soluciones legales agiles para tramites notariales, calculadoras juridicas y negociacion de deudas en Ecuador. Tecnologia legal con 12 anos de experiencia.`

Keywords iniciales:

- abogados online ecuador
- negociacion de deudas ecuador
- deudas en mora ecuador
- calculadora notarial
- tramites notariales ecuador
- contratos vehiculares
- escrituras ecuador

JSON-LD:

Actualizar `hasOfferCatalog` para incluir:

- Tramites notariales.
- Calculadoras juridicas.
- Contratos vehiculares.
- Negociacion de deudas.

No sobreoptimizar con promesas de deuda.

## 17. Imagenes y assets

El plan anterior propuso generar imagenes con OpenAI. En el repo correcto ya existen imagenes en:

- `public/assets/landing/*`
- `public/logo/*`

Problema:

Varias imagenes actuales usan estetica de stock/abstracta y el blog preview usa Unsplash remoto.

Direccion:

- Mantener logo oficial.
- Usar visuales propios o generados para:
  - Hero legal command center.
  - Evaluador de deuda.
  - Notaria digital.
  - Editorial deuda/notaria.
- Evitar imagenes con texto incrustado.
- Guardar assets optimizados en `public/assets/landing/`.

## 18. Movimiento

Framer Motion ya esta instalado y usado.

Principios:

- Animaciones ligeras.
- Entradas escalonadas: headline, subheadline, selector de intencion, consola.
- Hover refinado en tarjetas.
- Evaluador con progresion clara.
- Respetar `prefers-reduced-motion`.
- Evitar loops agresivos.

Riesgo actual:

`features.tsx` usa canvas con estrellas interactivas. Puede funcionar visualmente, pero debe revisarse en mobile y performance. Si el nuevo rediseño usa fondo oscuro premium, evaluar si ese canvas aporta o distrae.

## 19. Archivos a modificar en Fase 1

Home:

- `src/app/page.tsx`
- `src/components/landing/hero.tsx`
- `src/components/landing/features.tsx`
- `src/components/landing/calculator-preview.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/blog-preview.tsx`
- `src/components/landing/faq.tsx`
- `src/components/landing/cta.tsx`

Nuevo componente:

- `src/components/landing/debt-evaluator-preview.tsx`

Sistema:

- `src/app/globals.css`
- `src/lib/constants.ts`

Opcional en Fase 1:

- `src/components/landing/trust-strip.tsx`
- `src/components/landing/legal-path-selector.tsx`
- `src/components/landing/legal-command-console.tsx`

## 20. Fases de implementacion

### Fase 0 - Seguridad de repo

- Usar `D:\aoe-v2-github`.
- Trabajar desde rama nueva basada en `origin/main`.
- No tocar `D:\abogados-online-v2` para publicar.
- Confirmar `npm install` o `npm ci`.
- Validar `npm run build` antes de cualquier push.

### Fase 1 - Plan y base comercial

- Adaptar este plan al repo correcto.
- Confirmar copy del hero.
- Confirmar si el evaluador V1 guarda leads o solo simula diagnostico.
- Confirmar si "Negociacion Extrajudicial con Blindaje Judicial" sera el nombre comercial publico.

### Fase 2 - Rediseño visual de home

- Rehacer hero dual.
- Agregar evaluador de deudas debajo del hero.
- Reorganizar soluciones por intencion.
- Ajustar CTA final dual.
- Actualizar metadata y FAQ.

### Fase 3 - Evaluador V1

Opcion A: preview interactivo sin persistencia.

- Rapido.
- Bajo riesgo.
- Bueno para validar copy y conversion.
- Requiere contacto/WhatsApp posterior.

Opcion B: captura real de leads.

- Mejor para ventas.
- Requiere definir almacenamiento.
- Puede usar Supabase, n8n, email o CRM.
- Requiere validacion de datos y politica de privacidad alineada.

Recomendacion:

Implementar interfaz completa con estructura lista para captura. Si el destino de leads no esta definido, dejar V1 sin persistencia irreversible y preparar el adaptador.

### Fase 4 - Contenido y SEO

- Separar articulos de notaria y deuda.
- Agregar FAQ de deuda.
- Ajustar JSON-LD.
- Revisar sitemap/robots si se crean rutas nuevas.

### Fase 5 - Validacion

- `npm run build`.
- Revisar desktop y mobile con navegador.
- Verificar que no se rompen rutas de contratos/pagos.
- Verificar contraste y CTAs.
- Capturar screenshots finales.

## 21. Criterios de aceptacion

La home estara lista cuando:

- El primer viewport diga claramente "Abogados Online Ecuador".
- El headline aprobado este visible y legible.
- Existan dos caminos claros: tramite notarial y crisis de deuda.
- El CTA de deuda tenga mayor tension comercial sin borrar la autoridad notarial.
- El evaluador de deudas sea prominente y creible.
- Las soluciones esten agrupadas por intencion, no como grilla generica.
- Las calculadoras sigan visibles como prueba de utilidad.
- La home no prometa resultados imposibles en deuda.
- La pagina funcione bien en mobile.
- No haya texto cortado ni CTAs apretados.
- `npm run build` pase.
- La app existente de contratos, pagos y calculadoras no quede afectada.

## 22. Pendientes para decidir

1. Donde se guardan los leads del evaluador: Supabase, n8n, email, CRM o Google Sheet.
2. Si el nombre comercial de deuda sera "Negociacion Extrajudicial con Blindaje Judicial".
3. Si se usaran testimonios reales o placeholders prudentes.
4. Si se crearan rutas nuevas `/deudas` y `/deudas/blog` en la primera version.
5. Si se reemplazan imagenes remotas de Unsplash por assets propios/generados desde esta fase.

## 23. Recomendacion

No empezar con backend de deuda. Primero construir una home completa, rapida y convincente, con un evaluador que prepare la captura real. La primera version debe vender con claridad:

> Abogados Online Ecuador no es solo una notaria digital. Es una plataforma para resolver tramites legales urgentes y crisis financieras con velocidad, metodo y respaldo juridico.
