import 'dotenv/config'
import { createAdminClient } from '../lib/supabase/admin'

type SeedBlogPost = {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  category: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  content: string
  publishedAt: string
}

const blogPosts: SeedBlogPost[] = [
  {
    slug: 'poder-desde-espana-estados-unidos-valido-ecuador',
    title: 'Como hacer un poder desde Espana o Estados Unidos para que sea valido en Ecuador',
    excerpt:
      'Guia practica para otorgar un poder desde el exterior y usarlo en Ecuador con apostilla, traduccion y validacion notarial.',
    coverImage:
      'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1600&q=80',
    category: 'Poderes',
    tags: ['poder especial', 'apostilla', 'ecuatorianos en el exterior', 'notaria'],
    seoTitle: 'Poder desde Espana o EEUU para Ecuador: pasos legales',
    seoDescription:
      'Aprende como otorgar un poder desde el exterior para usarlo en Ecuador. Requisitos, apostilla, traduccion y tiempos de gestion.',
    publishedAt: '2026-02-10T10:00:00.000Z',
    content: `
      <p>Si vives en Espana o Estados Unidos y necesitas que un familiar o abogado te represente en Ecuador, puedes otorgar un poder con validez legal. El objetivo es que ese documento sea aceptado por notarias, registros y entidades publicas ecuatorianas sin observaciones.</p>

      <h2>Cuando necesitas un poder desde el exterior</h2>
      <p>Un poder suele utilizarse para vender o comprar bienes, gestionar tramites bancarios, firmar contratos, actuar en juicios o realizar tramites administrativos. En la practica, mientras mas preciso sea el alcance del poder, menos riesgo de rechazo tendras.</p>
      <ul>
        <li>Poder especial para un tramite concreto (por ejemplo, venta de inmueble).</li>
        <li>Poder general para multiples actos de administracion.</li>
        <li>Poder judicial para actuaciones procesales especificas.</li>
      </ul>

      <h2>Ruta legal para que sea efectivo en Ecuador</h2>
      <h3>1) Redactar el texto con alcance exacto</h3>
      <p>Antes de firmar, define con detalle los actos permitidos, limites, plazos y facultades. Un texto ambiguo suele generar observaciones en notaria o en registro.</p>

      <h3>2) Firmar ante autoridad competente del pais donde resides</h3>
      <p>Dependiendo del caso, puede firmarse ante notario local o ante oficina consular. Lo importante es que la firma quede certificada por una autoridad reconocida.</p>

      <h3>3) Apostillar o legalizar</h3>
      <p>Si el pais es parte del Convenio de La Haya, aplica apostilla. Si no lo es, se requiere cadena de legalizaciones. Sin este paso, el documento normalmente no produce efectos en Ecuador.</p>

      <h3>4) Traducir cuando corresponda</h3>
      <p>Si el poder esta en idioma distinto al espanol, se necesita traduccion oficial para presentarlo correctamente en Ecuador.</p>

      <h3>5) Revisar forma de presentacion en Ecuador</h3>
      <p>Segun el tramite, podria requerirse protocolizacion, copias certificadas o validacion adicional. Conviene revisar este punto antes de enviar el documento.</p>

      <h2>Poderes telematicos: alternativa rapida para migrantes</h2>
      <p>En nuestra firma gestionamos poderes telematicos de notaria para reducir tiempos y errores de forma. Esto permite preparar minuta, checklist documental y acompanamiento para que la firma desde el exterior llegue lista para uso en Ecuador.</p>
      <ul>
        <li>Diagnostico del acto juridico y tipo de poder ideal.</li>
        <li>Redaccion orientada a aceptacion notarial y registral.</li>
        <li>Guia de apostilla/legalizacion segun pais.</li>
        <li>Revision final antes de presentar en Ecuador.</li>
      </ul>

      <h2>Errores frecuentes que causan rechazo</h2>
      <ol>
        <li>Facultades incompletas para el tramite real.</li>
        <li>Datos personales inconsistentes con pasaporte o cedula.</li>
        <li>Apostilla incompleta o legalizacion mal encadenada.</li>
        <li>Falta de traduccion certificada cuando aplica.</li>
      </ol>

      <h2>Checklist final antes de enviar el documento</h2>
      <p>Verifica texto, identidad, apostilla/legalizacion, traduccion y formato de presentacion exigido por la entidad ecuatoriana destino. Con estos pasos, el poder emitido en Espana o Estados Unidos puede ser plenamente util y ejecutable en Ecuador.</p>
    `,
  },
  {
    slug: 'cuanto-cuesta-escriturar-casa-quito-2026-guia',
    title: 'Cuanto cuesta escriturar una casa en Quito en 2026: guia de costos',
    excerpt:
      'Resumen claro de impuestos, aranceles y gastos notariales para calcular el costo real de escriturar en Quito.',
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    category: 'Inmuebles',
    tags: ['escritura', 'quito', 'registro de la propiedad', 'impuestos municipales'],
    seoTitle: 'Costo de escriturar en Quito 2026: guia completa',
    seoDescription:
      'Calcula cuanto cuesta escriturar una casa en Quito en 2026 con desglose de notaria, impuestos y registro de la propiedad.',
    publishedAt: '2026-02-06T10:00:00.000Z',
    content: `
      <p>Escriturar un inmueble en Quito implica varios rubros y no solo honorarios notariales. Para evitar sorpresas, debes separar gastos fiscales, gastos registrales y costos operativos del tramite.</p>

      <h2>Rubros principales de una escritura</h2>
      <ul>
        <li>Impuestos municipales que correspondan al acto.</li>
        <li>Arancel notarial por elaboracion y autorizacion de la escritura.</li>
        <li>Derechos del Registro de la Propiedad para inscripcion.</li>
        <li>Certificados y documentos habilitantes.</li>
      </ul>

      <h2>Variables que cambian el costo final</h2>
      <h3>Avaluo y precio de venta</h3>
      <p>El valor base del inmueble influye en impuestos y aranceles. Por eso dos operaciones similares pueden terminar con montos distintos.</p>

      <h3>Tipo de acto</h3>
      <p>No cuesta igual una compraventa, una donacion o una promesa. Cada acto tiene reglas y tablas distintas.</p>

      <h3>Cantones y ordenanzas</h3>
      <p>Aunque esta guia se enfoca en Quito, algunas tasas pueden variar por normativa local o actualizaciones administrativas.</p>

      <h2>Como estimar el presupuesto con menor margen de error</h2>
      <ol>
        <li>Reunir datos del inmueble y del negocio juridico.</li>
        <li>Identificar impuestos aplicables segun tipo de acto.</li>
        <li>Calcular arancel notarial conforme tabla vigente.</li>
        <li>Sumar derechos registrales y documentos adicionales.</li>
      </ol>

      <h2>Recomendacion practica</h2>
      <p>Solicita un pre-calculo antes de firmar promesas o entregar arras. Un presupuesto legal previo evita retrasos, renegociaciones y multas por incumplimientos de plazo.</p>
    `,
  },
  {
    slug: 'compraventa-vehicular-ecuador-checklist-legal',
    title: 'Compraventa vehicular en Ecuador: checklist legal antes de firmar',
    excerpt:
      'Checklist actualizado para evitar riesgos en la compra o venta de vehiculos usados en Ecuador.',
    coverImage:
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&q=80',
    category: 'Vehiculos',
    tags: ['compraventa vehicular', 'contrato', 'revision legal', 'notaria'],
    seoTitle: 'Checklist legal para compraventa vehicular en Ecuador',
    seoDescription:
      'Antes de firmar una compraventa vehicular, revisa documentos, gravamenes, multas y clausulas criticas del contrato.',
    publishedAt: '2026-02-03T10:00:00.000Z',
    content: `
      <p>Una compraventa de vehiculo mal documentada puede terminar en multas, problemas de dominio o disputas por vicios ocultos. Este checklist te ayuda a reducir riesgo legal desde el inicio.</p>

      <h2>Documentos que debes verificar</h2>
      <ul>
        <li>Matricula vigente y coincidencia de datos del automotor.</li>
        <li>Cedula y papeleta del vendedor.</li>
        <li>Historial de multas y obligaciones pendientes.</li>
        <li>Certificados que acrediten ausencia de bloqueos o limitaciones.</li>
      </ul>

      <h2>Revision del estado juridico y tecnico</h2>
      <h3>Dominio y capacidad para vender</h3>
      <p>Confirma que quien firma realmente tiene facultad para transferir el bien. Si hay representacion, revisa el poder correspondiente.</p>

      <h3>Estado del vehiculo</h3>
      <p>Contrasta kilometraje, numero de chasis, motor y condiciones mecanicas. El contrato debe reflejar con precision las caracteristicas relevantes.</p>

      <h2>Clausulas minimas del contrato</h2>
      <ol>
        <li>Identificacion completa de comprador y vendedor.</li>
        <li>Descripcion tecnica del vehiculo y accesorios incluidos.</li>
        <li>Precio, forma de pago y fecha de entrega.</li>
        <li>Responsabilidad por multas o deudas previas.</li>
        <li>Mecanismos ante incumplimiento.</li>
      </ol>

      <h2>Buenas practicas para cierre seguro</h2>
      <p>Firma el contrato con asesoria legal, documenta entrega-recepcion y conserva soportes de pago. Con estos pasos, la transferencia es mas segura para ambas partes.</p>
    `,
  },
  {
    slug: 'declaracion-juramentada-requisitos-costos-ecuador',
    title: 'Declaracion juramentada en Ecuador: requisitos, costos y usos frecuentes',
    excerpt:
      'Todo lo que debes saber para tramitar una declaracion juramentada valida ante notaria en Ecuador.',
    coverImage:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
    category: 'Notarial',
    tags: ['declaracion juramentada', 'notaria', 'requisitos', 'costos'],
    seoTitle: 'Declaracion juramentada en Ecuador: guia practica 2026',
    seoDescription:
      'Revisa requisitos, costos y recomendaciones para presentar una declaracion juramentada valida en Ecuador.',
    publishedAt: '2026-01-30T10:00:00.000Z',
    content: `
      <p>La declaracion juramentada es un instrumento usado para dejar constancia formal de hechos bajo juramento. Se utiliza en tramites migratorios, bancarios, societarios y administrativos.</p>

      <h2>Para que sirve una declaracion juramentada</h2>
      <ul>
        <li>Acreditar hechos que no constan en otro documento inmediato.</li>
        <li>Respaldar tramites ante instituciones publicas o privadas.</li>
        <li>Presentar manifestaciones de responsabilidad personal.</li>
      </ul>

      <h2>Requisitos basicos</h2>
      <h3>Identificacion del compareciente</h3>
      <p>Debe existir concordancia entre nombres, numero de identificacion y datos de contacto. Cualquier inconsistencia puede retrasar el tramite.</p>

      <h3>Texto claro y verificable</h3>
      <p>El contenido debe ser preciso, con fechas y hechos concretos. Evita afirmaciones ambiguas que no puedan sustentarse.</p>

      <h2>Costos y tiempos</h2>
      <p>El costo depende del acto y de los anexos requeridos. Cuando la declaracion es compleja, conviene validar previamente la redaccion para evitar correcciones de ultima hora.</p>

      <h2>Consejo legal</h2>
      <p>Antes de juramentar, revisa que el texto responda exactamente a lo que la entidad destino exige. Esto evita doble comparecencia y reduce costos administrativos.</p>
    `,
  },
  {
    slug: 'promesa-compraventa-inmueble-errores-frecuentes',
    title: 'Promesa de compraventa de inmueble: errores frecuentes y como evitarlos',
    excerpt:
      'Errores comunes en promesas de compraventa y clausulas clave para proteger a comprador y vendedor.',
    coverImage:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    category: 'Inmuebles',
    tags: ['promesa de compraventa', 'inmueble', 'clausulas', 'quito'],
    seoTitle: 'Promesa de compraventa: clausulas clave en Ecuador',
    seoDescription:
      'Evita conflictos en tu promesa de compraventa con una redaccion legal clara y condiciones de cierre bien definidas.',
    publishedAt: '2026-01-24T10:00:00.000Z',
    content: `
      <p>La promesa de compraventa permite asegurar condiciones del negocio antes de la escritura definitiva. Si se redacta mal, puede generar litigios por incumplimiento o perdida de anticipos.</p>

      <h2>Errores que mas generan conflicto</h2>
      <ul>
        <li>No definir fecha de cierre ni condiciones previas.</li>
        <li>Omitir consecuencias por incumplimiento.</li>
        <li>No especificar estado legal del inmueble.</li>
        <li>No regular devolucion o retencion de arras.</li>
      </ul>

      <h2>Clausulas que no pueden faltar</h2>
      <h3>Objeto y precio</h3>
      <p>Describe el inmueble con precision y establece precio total, forma de pago y cronograma de desembolsos.</p>

      <h3>Condiciones suspensivas</h3>
      <p>Incluye aprobacion de credito, levantamiento de gravamenes y entrega de documentos habilitantes.</p>

      <h3>Penalidades y solucion de controversias</h3>
      <p>Define montos, plazos y via de solucion de conflictos para disminuir incertidumbre en caso de incumplimiento.</p>

      <h2>Resultado esperado</h2>
      <p>Una promesa bien estructurada protege a ambas partes y facilita la escritura final sin sorpresas ni retrasos costosos.</p>
    `,
  },
]

async function seed() {
  const supabase = createAdminClient()

  const payload = blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    cover_image: post.coverImage,
    category: post.category,
    tags: post.tags,
    seo_title: post.seoTitle,
    seo_description: post.seoDescription,
    content: post.content,
    published: true,
    published_at: post.publishedAt,
  }))

  const { error } = await supabase
    .from('blog_posts')
    .upsert(payload, { onConflict: 'slug' })

  if (error) {
    throw error
  }

  console.log(`[seed] Blog posts upserted: ${payload.length}`)
}

seed().catch((error) => {
  console.error('[seed] Failed to seed blog posts:', error)
  process.exit(1)
})
