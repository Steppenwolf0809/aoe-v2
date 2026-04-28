# Fase 1 - Hero y Centro Legal Inteligente

Fecha: 2026-04-24
Proyecto: `D:\aoe-v2-github`
Rama: `codex/home-redesign-plan`

## 1. Objetivo de la fase

Definir la direccion del primer viewport de la nueva home de Abogados Online Ecuador antes de tocar la implementacion visual.

La home debe dejar claro en menos de cinco segundos:

- Se pueden calcular costos legales antes de firmar o comprar.
- Se pueden diagnosticar riesgos antes de negociar o aceptar acuerdos.
- Se pueden generar documentos legales, empezando por contrato vehicular y luego poderes, minutas, promesas y declaraciones.
- Se puede avanzar con respaldo legal en Ecuador.

El concepto visible sera:

**Centro Legal Inteligente**

El concepto de producto completo sera:

**Plataforma Legal Inteligente**

`Legal OS` queda solo como referencia interna de diseno. No debe aparecer como texto visible para usuarios finales.

## 2. Idea central del hero

El hero debe funcionar como una consola premium que convierte una necesidad legal en una ruta concreta.

Entrada:

- "Voy a comprar o vender un inmueble"
- "Tengo una deuda vencida"
- "Necesito vender/comprar un vehiculo"
- "Necesito preparar un documento legal"

Salida:

- Calculadora recomendada.
- Diagnostico o riesgo estimado.
- Documentos requeridos.
- Siguiente accion legal.
- CTA directo a la ruta correcta.

Mensaje sintetico:

> Calcula, diagnostica y resuelve tus tramites legales importantes.

Submensaje:

> Desde el Centro Legal Inteligente puedes estimar costos, evaluar riesgos, generar documentos y avanzar con respaldo legal en Ecuador.

## 3. Arquitectura visual del hero

### Desktop

Composicion recomendada:

- Columna izquierda: marca, headline, subtitulo, CTAs y microprueba de confianza.
- Columna derecha: dashboard animado del Centro Legal Inteligente.

La columna izquierda no debe tener mas de tres CTAs visibles:

- Calcular mi tramite
- Iniciar diagnostico legal
- Evaluar deuda

El dashboard puede incluir CTA contextual segun la escena activa:

- Calcular transferencia
- Evaluar deuda
- Generar contrato vehicular
- Crear documento

### Mobile

Composicion recomendada:

- Headline corto.
- Subtitulo de una o dos lineas.
- CTAs apilados.
- Dashboard simplificado en carrusel vertical o tarjeta unica animada.

En mobile se debe evitar saturar con cuatro tarjetas completas al mismo tiempo. Mostrar una ruta principal activa y pequenas pestanas/chips para las demas.

## 4. Storyboard Hyperframes del hero

Duracion recomendada del loop: 18 a 22 segundos.

Formato:

- 16:9 para desktop.
- Adaptacion 4:5 o vertical simplificada para mobile si se usa asset/render separado.
- No usar video pesado como fondo.
- Usar interfaz generada/animada con HTML, CSS y GSAP/Hyperframes.
- Animacion sobria, sin saltos bruscos, sin loops agresivos.

### Escena 1 - Entrada: "Centro Legal Inteligente"

Duracion: 3 segundos.

Visual:

- Fondo azul noche / negro azulado.
- Panel principal aparece con borde fino, blur sutil y glow controlado.
- Cuatro modulos en estado inicial:
  - Inmueble
  - Deuda
  - Vehiculo
  - Documento

Texto visible dentro del dashboard:

- Centro Legal Inteligente
- Calculadoras
- Diagnostico
- Generadores
- Negociacion

Movimiento:

- Entrada escalonada de modulos.
- Lineas de conexion suaves entre necesidad, analisis y accion.
- No usar iconografia legal cliche.

Objetivo:

Mostrar que el sitio no es solo una landing, sino una plataforma con rutas.

### Escena 2 - Transferencia de dominio

Duracion: 4 segundos.

Datos visibles:

- Tipo: Compra/Venta de inmueble
- Valor referencial: USD 120.000
- Costos: Notaria, alcabala, registro, plusvalia
- Documentos: gravamenes, predio, cedulas, minuta
- Accion sugerida: calcular presupuesto total
- CTA: Calcular transferencia

Visual:

- Tarjeta principal de costos con barras o columnas discretas.
- Checklist documental lateral.
- Timeline compacto:
  - Promesa
  - Minuta
  - Impuestos
  - Notaria
  - Registro

Color:

- Azul premium con pequeno acento verde o cian.

Objetivo:

Dejar a transferencia de dominio como ruta estrella y de mayor valor comercial.

### Escena 3 - Negociacion de deuda

Duracion: 4 segundos.

Datos visibles:

- Tipo: Deuda vencida
- Monto referencial: USD 8.500
- Riesgo: Medio / Alto
- Documentos: contrato, pagare, estado de cuenta, comunicaciones
- Accion sugerida: evaluar estrategia antes de firmar
- CTA: Evaluar deuda

Visual:

- Medidor de riesgo horizontal o semicircular.
- Panel "siguiente accion" con lenguaje prudente.
- Checklist documental.

Color:

- Coral o rojo suave, sin parecer alarma financiera.

Objetivo:

Integrar deuda como ruta importante y estrategica, no como susto ni promesa absoluta.

### Escena 4 - Compraventa vehicular

Duracion: 3.5 segundos.

Datos visibles:

- Tipo: Compraventa vehicular
- Dato: Placa / CUV
- Documento: contrato de compraventa
- Estado: listo para revision / legalizacion
- Accion sugerida: generar contrato
- CTA: Generar contrato vehicular

Visual:

- Tarjeta de vehiculo con datos estructurados.
- Documento al lado que se completa por bloques.
- Indicador de progreso:
  - Comprador
  - Vendedor
  - Vehiculo
  - Pago
  - Firmas

Color:

- Azul electrico con acento gris grafito.

Objetivo:

Mantener el contrato vehicular como producto transaccional claro y facil de encontrar.

### Escena 5 - Generadores legales

Duracion: 4 segundos.

Datos visibles:

- Generadores legales
- Contrato vehicular disponible
- Proximamente: poderes, minutas, promesas, declaraciones
- Accion sugerida: elegir documento
- CTA: Crear documento

Visual:

- Biblioteca de documentos por tipo.
- Documento activo se arma por secciones:
  - Partes
  - Bien / acto
  - Clausulas
  - Forma de pago
  - Requisitos
  - Firma

Color:

- Blanco humo dentro del panel, con acentos cian/azul.

Objetivo:

Introducir la categoria de generadores sin prometer funciones que aun no estan listas. El contrato vehicular debe aparecer como activo actual; poderes y minutas como expansion futura si todavia no existen.

### Escena 6 - Cierre del loop

Duracion: 2.5 a 3 segundos.

Visual:

- Las cuatro rutas vuelven a una vista de decision:
  - Calcular
  - Diagnosticar
  - Generar
  - Negociar

Texto visible:

- Elige tu ruta legal
- Costos, riesgos, documentos y siguiente accion

Movimiento:

- Los modulos se alinean en un mapa claro.
- La escena vuelve a la primera sin corte evidente.

Objetivo:

Que el usuario recuerde cuatro puertas de entrada, no una lista de servicios.

## 5. Copy recomendado del hero

### Opcion principal

Headline:

> Calcula, diagnostica y resuelve tus tramites legales importantes

Subtitulo:

> Transferencias de dominio, negociacion de deuda, contratos y tramites notariales con herramientas inteligentes y respaldo legal en Ecuador.

CTAs:

- Calcular mi tramite
- Iniciar diagnostico legal
- Evaluar deuda

### Variante mas premium

Headline:

> Tu ruta legal clara antes de firmar, comprar o negociar

Subtitulo:

> Calcula costos, mide riesgos, genera documentos y avanza con respaldo legal en Ecuador.

CTAs:

- Empezar con una calculadora
- Ver rutas legales
- Evaluar deuda

Recomendacion:

Usar la opcion principal en V1 por claridad. Probar la variante premium despues si el hero se siente demasiado funcional.

## 6. Rutas que deben salir del hero

El hero no debe mandar todo a WhatsApp. Debe distribuir trafico segun intencion.

- `Calcular mi tramite` -> `/calculadoras` o `/calculadoras/inmuebles`
- `Iniciar diagnostico legal` -> seccion de rutas legales en la home
- `Evaluar deuda` -> `#evaluador-deudas`
- `Generar contrato vehicular` -> `/contratos/vehicular`
- `Crear documento` -> inicialmente `/servicios` o futura ruta `/generadores`
- `Calcular transferencia` -> `/calculadoras/inmuebles`

WhatsApp debe quedar como canal secundario y aparecer despues de que el usuario entiende la ruta, especialmente en deuda.

## 7. Assets visuales a crear o preparar

### Asset 1 - Hero dashboard base

Nombre sugerido:

`public/assets/landing/centro-legal-inteligente-dashboard.webp`

Uso:

- Imagen o frame base para hero si se combina con HTML overlay.
- Referencia visual para el componente animado.

Prompt base ImageGen:

> Premium legaltech dashboard interface for Ecuador legal services, dark navy background, elegant SaaS command center, modules for property transfer costs, debt risk, vehicle contract generator and legal document generator, clean linear icons, glass panels, subtle cyan and coral accents, no people, no gavels, no scales, no columns, no readable text, high-end enterprise software aesthetic.

### Asset 2 - Transferencia de dominio

Nombre sugerido:

`public/assets/landing/transferencia-dominio-costos.webp`

Prompt base:

> Premium SaaS dashboard module showing property transfer cost estimation, dark and white interface, cost breakdown cards, legal document checklist, timeline from promise to deed to taxes to registry, cyan and subtle green accents, abstract legaltech style, no people, no legal cliches, no readable text.

### Asset 3 - Riesgo de deuda

Nombre sugerido:

`public/assets/landing/riesgo-deuda-dashboard.webp`

Prompt base:

> Premium legal risk dashboard for debt negotiation, dark navy interface, risk meter, document checklist, timeline of negotiation steps, coral accent for medium risk, sober and strategic, no alarmist imagery, no people, no money piles, no readable text.

### Asset 4 - Contrato vehicular

Nombre sugerido:

`public/assets/landing/generador-contrato-vehicular.webp`

Prompt base:

> Modern legal document generator interface for vehicle sale contract, structured form panels, vehicle data card, document preview assembling sections, premium SaaS style, dark and light surfaces, blue accents, no readable text, no people, no stock photo look.

### Asset 5 - Generadores legales

Nombre sugerido:

`public/assets/landing/generadores-legales.webp`

Prompt base:

> Premium legal document generator library, modular cards for powers, minutes, promises, sworn statements and vehicle contracts, document sections assembling automatically, elegant legaltech dashboard, dark navy and white smoke palette, cyan accents, no readable text, no legal cliches.

## 8. Componentes que se derivan de esta fase

Implementacion probable:

- `Hero`
- `HeroSmartLegalDashboard`
- `HeroRouteTabs`
- `HeroMetricStrip`
- `CalculatorGateway`
- `LegalRoutesGateway`
- `DocumentGeneratorsPreview`

Si se usa Hyperframes dentro del proyecto:

- Mantenerlo como animacion principal exportada o embebida.
- Evitar que el hero dependa de un video pesado.
- Si Hyperframes genera un mp4/webm para el hero, usarlo con poster liviano y fallback estatico.
- Si se implementa como React/Framer Motion, respetar el storyboard y dejar Hyperframes para piezas/render promocional.

Decision recomendada para V1:

- Construir el dashboard como componente React animado ligero.
- Usar Hyperframes como storyboard/render de referencia y para assets promocionales si el pipeline esta listo.
- No bloquear la home por un render pesado.

## 9. Reglas de estilo

Usar:

- Azul noche / negro azulado.
- Acento cian para calculadoras, inmuebles y plataforma.
- Coral suave para deuda.
- Blanco humo para superficies secundarias.
- Bordes finos.
- Sombras y glows localizados.
- Iconos lineales modernos.
- Numeros tabulares.

Evitar:

- Balanzas, martillos, columnas, fotos de abogados genericas.
- Fondos con blobs morados genericos.
- Texto largo dentro del dashboard.
- Promesas de deuda absolutas.
- Hero dominado por contrato de arriendo.
- Mostrar poderes/minutas como disponibles si aun no existen.

## 10. Criterios de aceptacion de Fase 1

La fase esta lista cuando:

- El concepto visible es `Centro Legal Inteligente`.
- El hero tiene storyboard de 6 escenas.
- Las cuatro rutas principales estan definidas: calcular, diagnosticar, generar, negociar.
- Transferencia de dominio aparece como ruta estrella.
- Deuda aparece como ruta estrategica, sin tono alarmista.
- Contrato vehicular y generadores legales aparecen como categoria clara.
- Los CTAs tienen destinos concretos.
- Existe una lista inicial de assets y prompts ImageGen.
- La implementacion futura puede empezar sin debatir desde cero la narrativa del primer viewport.

## 11. Siguiente fase recomendada

Fase 2 debe convertir este storyboard en sistema visual:

- Tokens de color para hero y modulos.
- Layout desktop/mobile.
- Prompts finales de ImageGen.
- Primer mock del dashboard.
- Decision tecnica: React animado, Hyperframes embebido, o mezcla React + assets generados.

