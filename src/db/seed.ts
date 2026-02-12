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
    title: 'Cómo hacer un poder desde España o Estados Unidos para que sea válido en Ecuador',
    excerpt:
      'Guía práctica para otorgar un poder desde el exterior y usarlo en Ecuador con apostilla, traducción y validación notarial.',
    coverImage:
      'https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&w=1600&q=80',
    category: 'Poderes',
    tags: ['poder especial', 'apostilla', 'ecuatorianos en el exterior', 'notaría'],
    seoTitle: 'Poder desde España o EEUU para Ecuador: pasos legales',
    seoDescription:
      'Aprende cómo otorgar un poder desde el exterior para usarlo en Ecuador. Requisitos, apostilla, traducción y tiempos de gestión.',
    publishedAt: '2026-02-10T10:00:00.000Z',
    content: `
      <p>La semana pasada atendí a María, quien desde Madrid intentaba vender su departamento en La Carolina sin poder viajar. Su hermano tenía un poder "general" que firmó hace tres años en el consulado, pero el Registro de la Propiedad lo rechazó porque no mencionaba expresamente la facultad de venta. Perdió dos semanas y USD 200 en trámites duplicados.</p>

      <h2>Cuándo necesitas un poder desde el exterior (y cuándo NO)</h2>
      <p>Un poder bien otorgado te permite actuar legalmente en Ecuador sin estar presente. Los casos más frecuentes que atendemos son:</p>
      <ul>
        <li><strong>Venta de inmuebles heredados</strong> — requiere poder especial con facultad expresa de venta, hipoteca y recepción de dinero.</li>
        <li><strong>Cobro de rentas o administración de propiedades</strong> — poder especial de administración con facultades específicas de cobro, firma de contratos de arrendamiento y desahucio.</li>
        <li><strong>Defensa en juicio laboral o civil</strong> — poder especial judicial con facultades procesales del Art. 41 COGEP (transigir, desistir, absolver posiciones).</li>
        <li><strong>Trámites societarios en tu empresa</strong> — poder especial corporativo para modificar estatutos, aumentar capital o nombrar representantes.</li>
      </ul>
      <p>⚠️ <strong>No necesitas poder</strong> si solo vas a firmar documentos digitalmente (tu firma electrónica desde el exterior es válida) o si el trámite puede hacerse con una autorización simple notariada.</p>

      <h2>Ruta legal paso a paso (actualizada 2026)</h2>

      <h3>Paso 1: Redactar el texto con precisión quirúrgica</h3>
      <p>El error número uno es usar modelos genéricos de internet. Un poder para venta debe incluir:</p>
      <ul>
        <li>Identificación exacta del inmueble (clave catastral, linderos, matrícula)</li>
        <li>Facultad de venta, permuta o cualquier negocio jurídico</li>
        <li>Autorización para recibir dinero y otorgar finiquito</li>
        <li>Facultad de hipotecar si el comprador va a financiar</li>
        <li>Plazo de vigencia (recomendamos 24 meses máximo)</li>
      </ul>
      <p><strong>Ejemplo real:</strong> "Otorgo poder especial a mi hermano Juan Pérez (CI 1712345678) para que EN MI NOMBRE Y REPRESENTACIÓN venda el departamento ubicado en calle Los Shyris N34-123 y Av. Naciones Unidas, matrícula 12345 del Registro de la Propiedad del Distrito Metropolitano de Quito, con facultad de fijar precio no menor a USD $120,000, cobrar, otorgar recibos y escrituras públicas necesarias."</p>

      <h3>Paso 2: Firmar ante la autoridad correcta según tu país</h3>
      <p><strong>En España:</strong></p>
      <ul>
        <li>Notaría española (costo aproximado €60-120)</li>
        <li>Consulado de Ecuador en Madrid o Barcelona (gratis, pero demora 15-30 días hábiles)</li>
      </ul>
      <p><strong>En Estados Unidos:</strong></p>
      <ul>
        <li>Consulado de Ecuador (Miami, Nueva York, Houston, Los Ángeles) — sin costo, agenda con 3 semanas de anticipación</li>
        <li>Notary Public + apostilla estatal (válido pero requiere dos trámites separados)</li>
      </ul>
      <p>💡 <strong>Recomendación:</strong> Si estás en España, usa notaría española porque es más rápida. En Estados Unidos, el consulado es más económico pero menos flexible con horarios.</p>

      <h3>Paso 3: Apostillar (no legalizar) según Convenio de La Haya</h3>
      <p>Tanto España como Estados Unidos son parte del Convenio de La Haya, así que necesitas <strong>apostilla</strong>, no cadena de legalizaciones.</p>
      <p><strong>En España:</strong> Tramita la apostilla en el Colegio Notarial correspondiente (Madrid, Barcelona, Valencia). Costo €8, demora 24-48 horas. Puedes hacerlo online en algunos colegios.</p>
      <p><strong>En Estados Unidos:</strong> La apostilla se tramita en la Secretary of State del estado donde se firmó el documento. Ejemplo:</p>
      <ul>
        <li>Florida: $10, en línea en <em>dos.myflorida.com</em></li>
        <li>Nueva York: $10, presencial o por correo (demora 2-3 semanas)</li>
        <li>California: $20, en línea o presencial</li>
      </ul>
      <p>⚠️ Si el poder fue firmado ante Notary Public de EEUU, primero necesitas autenticación del condado y luego apostilla estatal (dos pasos). Si fue en el consulado ecuatoriano, solo apostilla.</p>

      <h3>Paso 4: Traducir si está en inglés</h3>
      <p>Si el poder está en inglés, debe traducirse al español por <strong>traductor oficial registrado</strong> en Ecuador. El Ministerio de Relaciones Exteriores mantiene un registro actualizado.</p>
      <p>Costo aproximado: USD $15-25 por página. Demora: 3-5 días hábiles.</p>
      <p>La traducción también debe apostillarse si se hizo en el exterior, o certificarse ante notaría si se hizo en Ecuador.</p>

      <h3>Paso 5: Validar en Ecuador antes de usar</h3>
      <p>Dependiendo del trámite destino:</p>
      <ul>
        <li><strong>Registro de la Propiedad:</strong> No requiere protocolización, el poder apostillado es suficiente.</li>
        <li><strong>Bancos:</strong> Algunos exigen copia certificada por notaría ecuatoriana del poder apostillado.</li>
        <li><strong>Juicios:</strong> Protocolización en notaría ecuatoriana (Art. 47 Ley Notarial) — costo USD $30-50.</li>
      </ul>

      <h2>Alternativa moderna: Poder telemático con firma electrónica</h2>
      <p>Desde 2023, las notarías ecuatorianas pueden recibir poderes otorgados con <strong>firma electrónica calificada</strong> sin necesidad de apostilla física. Esto funciona si:</p>
      <ul>
        <li>Tienes certificado digital vigente (en España: DNI electrónico, FNMT; en EEUU: IdenTrust, DocuSign con nivel calificado)</li>
        <li>La notaría destino en Ecuador tiene sistema de verificación de firmas electrónicas</li>
        <li>El acto no requiere protocolización previa (ej: poderes para trámites administrativos)</li>
      </ul>
      <p>Nosotros gestionamos este proceso completo: redactamos la minuta, coordinamos firma electrónica y verificamos aceptación en la entidad destino. Tiempo total: 5-7 días hábiles vs. 4-6 semanas con apostilla física.</p>

      <h2>Los 5 errores que más dinero cuestan</h2>
      <ol>
        <li><strong>Poder "genérico" sin facultades específicas</strong> — La notaría lo acepta, pero el Registro lo rechaza. Pierdes tiempo y aranceles ($100-300).</li>
        <li><strong>Datos de identidad mal escritos</strong> — Si tu cédula en Ecuador tiene "Pérez" pero tu pasaporte español dice "Perez", el Registro puede observar. Solución: incluir ambos documentos en la redacción del poder.</li>
        <li><strong>Apostilla en el orden equivocado</strong> — Si apostillas antes de firmar ante notario, no sirve. Orden correcto: firma → apostilla.</li>
        <li><strong>Traducción sin certificación</strong> — Una traducción de Google o de un traductor no oficial no es válida. Debe ser traductor registrado.</li>
        <li><strong>Confundir "poder notarial" con "poder consular"</strong> — Ambos son válidos, pero el consular puede tener limitaciones según el país. Confirma siempre con la entidad destino.</li>
      </ol>

      <h2>Checklist final antes de enviar por courier</h2>
      <p>Antes de enviar el documento físico por DHL o FedEx (costo $60-120, demora 3-5 días), verifica:</p>
      <ul>
        <li>✅ Texto redactado con facultades específicas del trámite real</li>
        <li>✅ Firma ante autoridad competente (notario o cónsul)</li>
        <li>✅ Apostilla del país de origen adherida al documento</li>
        <li>✅ Traducción oficial si el poder está en inglés</li>
        <li>✅ Fotocopia de tu cédula o pasaporte adjunta</li>
        <li>✅ Confirmación de la entidad destino sobre formato aceptado</li>
      </ul>
      <p>Con estos pasos, el poder emitido en España o Estados Unidos será aceptado sin observaciones en notarías, registros y bancos de Ecuador.</p>
    `,
  },
  {
    slug: 'cuanto-cuesta-escriturar-casa-quito-2026-guia',
    title: 'Cuánto cuesta escriturar una casa en Quito en 2026: guía de costos reales',
    excerpt:
      'Resumen claro de impuestos, aranceles y gastos notariales para calcular el costo real de escriturar en Quito.',
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    category: 'Inmuebles',
    tags: ['escritura', 'quito', 'registro de la propiedad', 'impuestos municipales'],
    seoTitle: 'Costo de escriturar en Quito 2026: guía completa',
    seoDescription:
      'Calcula cuánto cuesta escriturar una casa en Quito en 2026 con desglose de notaría, impuestos y registro de la propiedad.',
    publishedAt: '2026-02-06T10:00:00.000Z',
    content: `
      <p>Ayer una clienta me preguntó: "¿Por qué en la calculadora de internet me salía $800 y en la notaría me cobraron $1,450?" La respuesta es simple: la mayoría de calculadoras online solo suman el impuesto municipal y el arancel notarial, pero omiten certificados, derechos registrales, alcabalas y otros rubros "invisibles" que pueden sumar 40-60% del costo total.</p>

      <h2>Desglose de costos para escriturar una casa de $120,000 en Quito</h2>
      <p>Usemos un ejemplo real: compraventa de casa en Cumbayá, precio $120,000, sin hipoteca.</p>

      <h3>1. Impuesto Municipal de Alcabala (comprador paga)</h3>
      <p>Base: 1% sobre el exceso del avalúo que supere la fracción básica desgravada ($28,240 en 2026).</p>
      <p><strong>Cálculo:</strong><br/>
      ($120,000 - $28,240) × 1% = $917.60</p>
      <p>⚠️ Si la casa es de interés social (menor a $70,000), la alcabala es 0%. Si es vivienda única y primera compra, hay descuentos del 50% en Quito.</p>

      <h3>2. Arancel Notarial (usualmente se divide 50/50)</h3>
      <p>Según Tabla del Consejo de la Judicatura 2026:</p>
      <ul>
        <li>Hasta $10,000: $53.00</li>
        <li>De $10,001 a $25,000: $82.00</li>
        <li>De $25,001 a $50,000: $117.00</li>
        <li>De $50,001 a $100,000: $164.00</li>
        <li>De $100,001 a $200,000: $217.00</li>
      </ul>
      <p>Para $120,000: <strong>$217.00</strong></p>
      <p>Más: $35 por cada copia certificada (necesitas mínimo 3 copias) = $105</p>
      <p><strong>Total notaría: $322.00</strong></p>

      <h3>3. Derechos del Registro de la Propiedad</h3>
      <p>Tarifa 2026: 0.10% del valor de la escritura</p>
      <p>$120,000 × 0.10% = <strong>$120.00</strong></p>

      <h3>4. Certificados previos (obligatorios)</h3>
      <ul>
        <li>Certificado de gravámenes del Registro: $5.00</li>
        <li>Certificado de no adeudar impuestos municipales: $3.00</li>
        <li>Certificado de valoración catastral: $3.00</li>
        <li>Certificado de administración (si es conjunto): $25-50</li>
        <li>Certificado de no adeudar servicios básicos: Gratis (presenta planilla al día)</li>
      </ul>
      <p><strong>Subtotal certificados: $36-61</strong></p>

      <h3>5. Otros gastos operativos</h3>
      <ul>
        <li>Honorarios de abogado para revisión: $150-300</li>
        <li>Levantamiento de planos (si no tiene actualizado): $80-150</li>
        <li>Copias simples, carpetas, transporte: $20-40</li>
      </ul>

      <h2>💰 Costo total estimado</h2>
      <table>
        <tr><th>Rubro</th><th>Monto</th></tr>
        <tr><td>Alcabala municipal</td><td>$917.60</td></tr>
        <tr><td>Arancel notarial + copias</td><td>$322.00</td></tr>
        <tr><td>Derechos registrales</td><td>$120.00</td></tr>
        <tr><td>Certificados</td><td>$50.00</td></tr>
        <tr><td>Honorarios abogado</td><td>$200.00</td></tr>
        <tr><td>Varios</td><td>$30.00</td></tr>
        <tr><td><strong>TOTAL</strong></td><td><strong>$1,639.60</strong></td></tr>
      </table>
      <p>Es decir, aproximadamente <strong>1.37% del valor de la casa</strong>.</p>

      <h2>Variables que cambian el costo dramáticamente</h2>

      <h3>Si vas a pedir hipoteca (suma 30-40% más)</h3>
      <ul>
        <li>Constitución de hipoteca: arancel adicional de $164-217</li>
        <li>Prohibición de enajenar: $82</li>
        <li>Póliza de seguros (1 año anticipado): $300-600</li>
        <li>Avalúo bancario: $150-250</li>
      </ul>
      <p><strong>Costo total con hipoteca: $2,335 - $2,800</strong></p>

      <h3>Si el vendedor NO tiene escrituras al día</h3>
      <ul>
        <li>Declaratoria de prescripción adquisitiva: $1,500-3,000</li>
        <li>Partición de herencia previa: $800-2,500</li>
        <li>Levantamiento de hipotecas canceladas: $200-400</li>
      </ul>

      <h3>Si es compra a través de fideicomiso o promotor</h3>
      <ul>
        <li>Comisión fiduciaria: 0.5-1% del valor</li>
        <li>Escritura de bien futuro: arancel adicional $164</li>
      </ul>

      <h2>Casos especiales en Quito</h2>

      <h3>Vivienda de interés social (VIS)</h3>
      <p>Si la casa vale menos de $70,000 y es tu única vivienda:</p>
      <ul>
        <li>❌ No pagas alcabala</li>
        <li>✅ Arancel notarial normal ($164-217)</li>
        <li>✅ Descuento 50% en derechos registrales = $60</li>
      </ul>
      <p><strong>Ahorro: $900-1,000</strong></p>

      <h3>Herencia o donación (no es compraventa)</h3>
      <ul>
        <li>No hay alcabala</li>
        <li>Pero se paga impuesto a donaciones: 0% (padres a hijos), 5% (hermanos), 10% (terceros)</li>
        <li>Para casa de $120,000 donada a hermano: $6,000 de impuesto</li>
      </ul>

      <h3>Compra a un adulto mayor (exoneración IESS)</h3>
      <p>Si el vendedor es adulto mayor de 65+ años con ingresos menores a $15,000/año, puede estar exento de alcabala. Requiere certificado del IESS.</p>

      <h2>Errores que te cuestan dinero extra</h2>

      <h3>1. No verificar linderos antes de escriturar</h3>
      <p>Si hay inconsistencia entre el catastro municipal y la escritura madre, el Registro puede observar. Solución: levantamiento topográfico previo ($150). Si lo haces después, pierdes tiempo y pagas doble arancel.</p>

      <h3>2. Escriturar por un valor menor al real (subfacturación)</h3>
      <p>Muchos vendedores proponen "escriturar por $80,000 para pagar menos alcabala, el resto en efectivo". Consecuencias:</p>
      <ul>
        <li>Multa tributaria del SRI: 5% del valor omitido + intereses</li>
        <li>Si vendes después, pagas plusvalía sobre $80,000 aunque hayas pagado $120,000</li>
        <li>Si hay problemas con el vendedor, solo puedes reclamar los $80,000 que constan en escritura</li>
      </ul>

      <h3>3. No revisar impuestos prediales atrasados</h3>
      <p>Si el vendedor debe impuestos prediales de 3 años, esa deuda queda como carga del inmueble. El Municipio puede cobrarte a ti como nuevo propietario. Solución: exige certificado de "no adeudar impuestos" actualizado (máximo 15 días de antigüedad).</p>

      <h2>Cómo estimar TU costo específico en 3 pasos</h2>

      <h3>Paso 1: Obtén el valor catastral actualizado</h3>
      <p>Ingresa a <em>quitoinforma.gob.ec → Catastros</em> con el código catastral. El valor catastral puede diferir del precio de venta, usa el mayor de los dos para calcular alcabala.</p>

      <h3>Paso 2: Usa la fórmula</h3>
      <p><strong>Costo mínimo = (Valor - $28,240) × 1% + $217 + Valor × 0.10% + $250</strong></p>
      <p>Esto te da el piso sin sorpresas. Si hay hipoteca, suma 40%.</p>

      <h3>Paso 3: Solicita pre-cálculo notarial</h3>
      <p>Casi todas las notarías de Quito ofrecen cálculo gratuito si les envías:</p>
      <ul>
        <li>Copia de cédulas de comprador y vendedor</li>
        <li>Certificado de gravámenes</li>
        <li>Promesa de compraventa o intención de compra</li>
      </ul>
      <p>Te responden en 24 horas con el monto exacto.</p>

      <h2>Recomendación final</h2>
      <p>No firmes promesa de compraventa sin saber el costo total de escrituración. Muchos compradores presupuestan solo el 10% del valor de la casa para gastos de cierre, pero en Quito el promedio real es 1.5-2.5% del valor (sin hipoteca) y 2.5-3.5% (con hipoteca).</p>
      <p>Si necesitas cálculo personalizado para tu caso, envíanos los datos del inmueble y te respondemos con desglose detallado en 24 horas.</p>
    `,
  },
  {
    slug: 'compraventa-vehicular-ecuador-checklist-legal',
    title: 'Compraventa vehicular en Ecuador: checklist legal antes de firmar',
    excerpt:
      'Checklist actualizado para evitar riesgos en la compra o venta de vehículos usados en Ecuador.',
    coverImage:
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?auto=format&fit=crop&w=1600&q=80',
    category: 'Vehículos',
    tags: ['compraventa vehicular', 'contrato', 'revisión legal', 'notaría'],
    seoTitle: 'Checklist legal para compraventa vehicular en Ecuador',
    seoDescription:
      'Antes de firmar una compraventa vehicular, revisa documentos, gravámenes, multas y cláusulas críticas del contrato.',
    publishedAt: '2026-02-03T10:00:00.000Z',
    content: `
      <p>El mes pasado defendí a un cliente que compró un Chevrolet Spark 2018 por $8,500. Tres semanas después, la ANT le notificó que el vehículo tenía orden de retención por multa de tránsito de $2,400 que el vendedor nunca mencionó. Además, el contrato decía "se vende en el estado en que se encuentra", lo que legalmente lo dejaba sin derecho a reclamar. Terminamos en arbitraje y recuperó solo $1,200 después de seis meses de trámite.</p>

      <h2>Verificaciones obligatorias ANTES de transferir dinero</h2>

      <h3>1. Consulta ANT: historial completo del vehículo</h3>
      <p>Ingresa a <em>ant.gob.ec → Consulta Ciudadana → Información Vehicular</em> con la placa. Verifica:</p>
      <ul>
        <li><strong>Estado de matrícula:</strong> Activa, sin bloqueos ni órdenes de retención</li>
        <li><strong>Propietario registrado:</strong> Debe coincidir exactamente con el nombre del vendedor (mismo orden de apellidos)</li>
        <li><strong>Multas pendientes:</strong> Verifica que sume $0.00. Si hay multas, exige al vendedor pagarlas ANTES de firmar</li>
        <li><strong>Gravámenes:</strong> Si dice "prenda vehicular activa", el auto está hipotecado. El vendedor debe cancelar la prenda primero</li>
        <li><strong>Limitaciones al dominio:</strong> "Prohibición de enajenar" significa que el auto no se puede vender legalmente hasta levantar la prohibición</li>
      </ul>
      <p>⚠️ <strong>Caso real:</strong> Un Toyota Corolla 2020 aparecía "sin multas" en consulta rápida, pero en consulta detallada (requiere CAPTCHA) tenía $890 en multas de radares de Guayaquil. El comprador solo revisó la consulta rápida y tuvo que pagar las multas después.</p>

      <h3>2. Certificado de no tener multas (oficial ANT)</h3>
      <p>La consulta web es referencial. Para transferir de dominio necesitas el <strong>certificado oficial</strong> emitido por ventanilla ANT o en línea (costo $3, válido 30 días).</p>
      <p>Si el vendedor dice "yo pago las multas después", NO aceptes. Exige el certificado de $0.00 antes de firmar.</p>

      <h3>3. Matrícula original (no fotocopia)</h3>
      <p>La matrícula debe estar:</p>
      <ul>
        <li>A nombre del vendedor (si está a nombre de otra persona, pide carta de autorización notariada + copia de cédula del propietario real)</li>
        <li>Con año vigente (si está vencida, el vendedor debe renovar primero)</li>
        <li>Sin enmendaduras ni borrones (si tiene correcciones a mano, puede ser falsa)</li>
      </ul>

      <h3>4. Revisión técnica vehicular vigente</h3>
      <p>Desde 2020, la revisión técnica es obligatoria para transferencia en la mayoría de ciudades (Quito, Guayaquil, Cuenca, Ambato). Costo: $35-50, válida 1 año.</p>
      <p>Si el auto no tiene revisión técnica vigente, el vendedor debe tramitarla antes. Si la hace después de la firma, cualquier problema mecánico será tu responsabilidad.</p>

      <h3>5. Historial CERO kilómetros vs. real</h3>
      <p>Usa herramientas como <em>carfax.com.ec</em> (si el auto es importado) o <em>revisatuauto.com</em> para contrastar kilometraje. Si el odómetro marca 80,000 km pero el historial de mantenimiento del concesionario dice 130,000 km, hay adulteración.</p>

      <h2>Revisión jurídica del vendedor</h2>

      <h3>¿El vendedor puede vender legalmente?</h3>
      <p>Verifica que:</p>
      <ul>
        <li>Su cédula no esté caducada (si está vencida, no puede firmar actos notariales)</li>
        <li>Sea mayor de edad o, si es menor emancipado, tenga autorización judicial</li>
        <li>No tenga capacidad legal restringida (consulta en el Registro Civil si hay interdicción)</li>
      </ul>
      <p>Si el vendedor es una persona jurídica (empresa, concesionario), exige:</p>
      <ul>
        <li>RUC activo de la empresa</li>
        <li>Nombramiento vigente del representante legal (máximo 3 meses de antigüedad)</li>
        <li>Certificado de cumplimiento de obligaciones tributarias (SRI)</li>
      </ul>

      <h3>Si el vendedor actúa con poder</h3>
      <p>Si quien firma no es el dueño registrado, debe presentar <strong>poder especial</strong> que incluya expresamente:</p>
      <ul>
        <li>"Facultad de vender, enajenar y transferir el vehículo placa ABC-1234"</li>
        <li>Datos completos del apoderado (nombre, cédula)</li>
        <li>Vigencia del poder (no debe estar vencido)</li>
      </ul>
      <p>⚠️ Un "poder general" sin mencionar el vehículo específico puede ser rechazado por la notaría.</p>

      <h2>Revisión técnica del vehículo (no confiar solo en el papel)</h2>

      <h3>Inspección mecánica pre-compra</h3>
      <p>Paga $80-150 por una inspección en taller certificado. Debe incluir:</p>
      <ul>
        <li>Escaneo de computadora (códigos de error OBD-II)</li>
        <li>Revisión de motor, transmisión, suspensión</li>
        <li>Prueba de frenos y alineación</li>
        <li>Estado de llantas, amortiguadores, batería</li>
      </ul>
      <p>Si el vendedor se niega a llevar el auto a inspección, es señal de alerta.</p>

      <h3>Verificación física de números de serie</h3>
      <p>Contrasta que coincidan:</p>
      <ul>
        <li><strong>Número de chasis:</strong> Grabado en el chasis (parte frontal derecha bajo el capó) vs. matrícula</li>
        <li><strong>Número de motor:</strong> Grabado en el bloque del motor vs. matrícula</li>
        <li><strong>VIN (17 dígitos):</strong> En el tablero inferior del parabrisas vs. matrícula</li>
      </ul>
      <p>Si algún número está borrado, regrabado o no coincide, NO compres. Puede ser vehículo robado o con identidad alterada.</p>

      <h2>Cláusulas críticas del contrato de compraventa</h2>

      <h3>1. Identificación exacta del vehículo</h3>
      <p>Incluye en el contrato:</p>
      <ul>
        <li>Marca, modelo, año, color, placa</li>
        <li>Número de chasis y motor (no solo VIN)</li>
        <li>Kilometraje exacto al momento de la firma</li>
        <li>Accesorios incluidos: "Incluye aro de repuesto, gata, herramientas, manual de usuario, segundo juego de llaves"</li>
      </ul>

      <h3>2. Precio y forma de pago (con protección)</h3>
      <p><strong>❌ Malo:</strong> "El comprador pagará $8,500 al vendedor."</p>
      <p><strong>✅ Bueno:</strong> "El comprador pagará $8,500 así: (a) $1,000 en este acto como señal, (b) $7,500 al momento de la transferencia de dominio ante notaría, mediante cheque certificado o transferencia bancaria a cuenta [datos]. Si la transferencia no se concreta por causas imputables al vendedor, este devolverá la señal duplicada."</p>

      <h3>3. Responsabilidad por multas previas</h3>
      <p><strong>❌ Malo:</strong> "El vendedor se responsabiliza de multas anteriores."</p>
      <p><strong>✅ Bueno:</strong> "El vendedor declara bajo juramento que el vehículo no registra multas, deudas tributarias ni obligaciones pendientes. En caso de aparecer multas con fecha anterior a la firma de este contrato, el vendedor se obliga a pagarlas en un plazo de 15 días y reembolsar al comprador cualquier valor que este haya pagado, más intereses legales. Si no cumple, autoriza se le ejecute mediante acción coactiva."</p>

      <h3>4. Garantía sobre vicios ocultos</h3>
      <p><strong>❌ Malo:</strong> "Se vende en el estado en que se encuentra."</p>
      <p><strong>✅ Bueno:</strong> "El vendedor garantiza que el vehículo no presenta vicios ocultos en motor, transmisión ni chasis. Si dentro de los 15 días posteriores a la entrega se detectan fallas mecánicas ocultas que existían al momento de la venta, el comprador podrá exigir reparación a costo del vendedor o devolución del 20% del precio. Se excluyen desgastes normales por uso."</p>

      <h3>5. Fecha de entrega y transferencia</h3>
      <p>"La entrega física del vehículo y transferencia de dominio ante notaría se realizará el [fecha], a más tardar. Si el vendedor incumple, el comprador podrá resolver el contrato y exigir devolución del anticipo más 10% por daños."</p>

      <h2>Proceso de firma y traspaso seguro</h2>

      <h3>Paso 1: Firma del contrato ante notario</h3>
      <p>Aunque no es obligatorio, firma el contrato ante notario para que tenga fecha cierta y ejecutoriedad. Costo: $35-50. Esto evita que el vendedor después diga "ese no es mi contrato".</p>

      <h3>Paso 2: Entrega condicionada del dinero</h3>
      <p>Opciones:</p>
      <ul>
        <li><strong>Cheque certificado:</strong> Solo se cobra cuando ambas partes presenten el contrato firmado</li>
        <li><strong>Depósito en garantía:</strong> El dinero queda en cuenta de abogado o gestor hasta que se complete la transferencia ANT</li>
        <li><strong>Transferencia bancaria post-traspaso:</strong> Solo transfieres cuando el auto esté a tu nombre en ANT</li>
      </ul>

      <h3>Paso 3: Acta de entrega-recepción</h3>
      <p>El día de la entrega física, firma un acta que documente:</p>
      <ul>
        <li>Fecha, hora, lugar de entrega</li>
        <li>Kilometraje exacto (foto del odómetro)</li>
        <li>Estado de carrocería (lista de rayones, abolladuras existentes)</li>
        <li>Elementos entregados (llaves, documentos, accesorios)</li>
      </ul>
      <p>Si el vendedor se niega a firmar acta, graba video del estado del vehículo antes de pagar.</p>

      <h3>Paso 4: Transferencia en ANT en un plazo máximo de 30 días</h3>
      <p>Desde la firma del contrato, tienes 30 días para hacer la transferencia en ANT. Si tardas más, pagas multa de $45 por cada mes de retraso.</p>
      <p>Documentos para transferir en ANT:</p>
      <ul>
        <li>Contrato de compraventa original (con firmas notariadas o reconocidas ante notario)</li>
        <li>Cédula de comprador y vendedor</li>
        <li>Matrícula original</li>
        <li>Certificado de no tener multas</li>
        <li>Revisión técnica vigente</li>
        <li>Pago de impuesto de traspaso (3% del avalúo, aprox. $200-600 dependiendo del vehículo)</li>
      </ul>

      <h2>Errores que más dinero cuestan</h2>

      <h3>1. Pagar todo antes de verificar multas</h3>
      <p>Nunca transfieras el 100% del dinero antes de confirmar que el certificado de multas está en $0.00. Retén al menos 20% hasta ver el certificado físico.</p>

      <h3>2. Firmar "contrato de buena fe" sin cláusulas de protección</h3>
      <p>Un contrato de una página sin penalidades ni garantías no sirve en caso de conflicto. Invierte $50 en que un abogado revise el texto antes de firmar.</p>

      <h3>3. Aceptar matrícula "en trámite de renovación"</h3>
      <p>Si el vendedor dice "la matrícula está en trámite, te la doy después", NO cierres el negocio. Sin matrícula original, no puedes hacer la transferencia en ANT.</p>

      <h3>4. No revisar el estado del SOAT</h3>
      <p>El SOAT es responsabilidad del propietario actual. Si el vendedor no tiene SOAT vigente al momento de la entrega y ocurre un accidente antes de que lo transfieras, tú pagas la multa ($405).</p>

      <h2>Checklist final antes de transferir dinero</h2>
      <ul>
        <li>✅ Consulta ANT muestra: propietario correcto, sin multas, sin gravámenes, sin limitaciones</li>
        <li>✅ Certificado oficial ANT de $0.00 en multas (máximo 30 días de antigüedad)</li>
        <li>✅ Matrícula original vigente en mano</li>
        <li>✅ Revisión técnica vigente</li>
        <li>✅ Cédula del vendedor no vencida</li>
        <li>✅ Inspección mecánica profesional aprobada</li>
        <li>✅ Números de chasis, motor y VIN coinciden con matrícula</li>
        <li>✅ Contrato con cláusulas de garantía, penalidades y fecha de transferencia</li>
        <li>✅ Acta de entrega-recepción firmada</li>
        <li>✅ SOAT vigente transferido a tu nombre</li>
      </ul>
      <p>Con estos pasos, reduces el riesgo de fraude vehicular a menos del 5%. Si necesitas revisión legal del contrato antes de firmar, envíanos el borrador y te respondemos en 24 horas.</p>
    `,
  },
  {
    slug: 'declaracion-juramentada-requisitos-costos-ecuador',
    title: 'Declaración juramentada en Ecuador: requisitos, costos y usos frecuentes',
    excerpt:
      'Todo lo que debes saber para tramitar una declaración juramentada válida ante notaría en Ecuador.',
    coverImage:
      'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80',
    category: 'Notarial',
    tags: ['declaración juramentada', 'notaría', 'requisitos', 'costos'],
    seoTitle: 'Declaración juramentada en Ecuador: guía práctica 2026',
    seoDescription:
      'Revisa requisitos, costos y recomendaciones para presentar una declaración juramentada válida en Ecuador.',
    publishedAt: '2026-01-30T10:00:00.000Z',
    content: `
      <p>Esta mañana un cliente me envió una declaración juramentada que le rechazaron en el banco por tercera vez. El problema: decía "declaro ser solvente económicamente" sin especificar ingresos, cuentas ni patrimonio. El banco necesitaba montos exactos, fuentes de ingreso y referencias bancarias. Tuvo que volver a notaría, pagar $35 nuevamente y esperar otros 5 días.</p>

      <h2>¿Qué es realmente una declaración juramentada?</h2>
      <p>Es un documento notarial donde afirmas bajo juramento que ciertos hechos son verdaderos. La diferencia con una declaración simple es que tiene <strong>fe pública notarial</strong> y puede usarse como prueba judicial. Si mientes en una declaración juramentada, cometes delito de perjurio (Art. 273 COIP) con pena de 1-3 años de prisión.</p>

      <h2>Cuándo necesitas una declaración juramentada (casos reales)</h2>

      <h3>1. Trámites migratorios</h3>
      <ul>
        <li><strong>Visa de turista extendida:</strong> Declaras que tienes medios económicos para mantenerte sin trabajar (ingresos, ahorros, pensiones)</li>
        <li><strong>Visa de estudiante:</strong> Si tus padres te financian, ellos declaran que tienen capacidad económica para cubrir tus gastos</li>
        <li><strong>Visa de inversionista:</strong> Declaras el origen lícito de los fondos que traes a Ecuador</li>
        <li><strong>Reunificación familiar:</strong> Declaras parentesco cuando no existe acta de nacimiento o está extraviada</li>
      </ul>

      <h3>2. Trámites bancarios</h3>
      <ul>
        <li><strong>Crédito sin comprobantes de ingresos:</strong> Declaras tus ingresos mensuales y su origen (si eres independiente o trabajas informalmente)</li>
        <li><strong>Apertura de cuenta corporativa:</strong> Declaras la actividad económica real de tu empresa</li>
        <li><strong>Bloqueo de cuenta por fallecimiento:</strong> Los herederos declaran ser los únicos beneficiarios</li>
      </ul>

      <h3>3. Trámites de identidad y estado civil</h3>
      <ul>
        <li><strong>Pérdida de cédula o pasaporte:</strong> Declaras las circunstancias de la pérdida (fecha, lugar, razón)</li>
        <li><strong>Unión de hecho:</strong> Declaras que convives maritalmente por más de 2 años sin impedimentos legales</li>
        <li><strong>Corrección de nombre:</strong> Si tu acta de nacimiento tiene errores, declaras cuál es tu nombre real usado toda tu vida</li>
      </ul>

      <h3>4. Trámites societarios y laborales</h3>
      <ul>
        <li><strong>Constitución de empresa:</strong> Los socios declaran el origen lícito del capital aportado</li>
        <li><strong>Renuncia sin preaviso:</strong> Declaras las razones de fuerza mayor que justifican la salida inmediata</li>
        <li><strong>Acoso laboral:</strong> Declaras los hechos, fechas, testigos y evidencias</li>
      </ul>

      <h3>5. Trámites educativos</h3>
      <ul>
        <li><strong>Título extranjero:</strong> Declaras que el documento es auténtico y no ha sido revocado</li>
        <li><strong>Beca estudiantil:</strong> Declaras tu situación socioeconómica real</li>
      </ul>

      <h2>Requisitos para que sea válida (checklist por tipo)</h2>

      <h3>Datos de identificación obligatorios</h3>
      <p>La declaración DEBE incluir:</p>
      <ul>
        <li>Nombres completos (tal como aparecen en cédula o pasaporte, sin abreviaturas)</li>
        <li>Número de cédula o pasaporte (si eres extranjero, indica país de emisión)</li>
        <li>Nacionalidad y edad</li>
        <li>Domicilio legal exacto (ciudad, calle, número, referencia)</li>
        <li>Estado civil actualizado</li>
      </ul>
      <p>⚠️ Si tu cédula dice "María José" y declaras como "Mary", la notaría puede rechazarla.</p>

      <h3>Contenido del texto: específico, NO genérico</h3>
      <p><strong>❌ Declaración genérica (rechazada):</strong></p>
      <p>"Declaro ser una persona solvente económicamente y tener los medios para mantenerme en el país."</p>
      <p><strong>✅ Declaración específica (aceptada):</strong></p>
      <p>"Declaro que mis ingresos mensuales provienen de: (a) Pensión de jubilación del IESS por USD $850/mes, número de afiliación 1234567890; (b) Arriendo de departamento en Quito por USD $400/mes; (c) Ahorros bancarios en Banco Pichincha cuenta N° 2100XXXXXX por USD $15,000. Total ingresos: USD $1,250/mes más ahorros líquidos."</p>

      <h3>Elementos de verificación (cuando aplica)</h3>
      <p>Si tu declaración menciona hechos verificables, incluye:</p>
      <ul>
        <li>Fechas exactas (día, mes, año)</li>
        <li>Lugares específicos (dirección, ciudad)</li>
        <li>Nombres de terceros involucrados (con cédula si es posible)</li>
        <li>Números de referencia (cuentas, matrículas, expedientes)</li>
      </ul>

      <h3>Documentos de respaldo (anexa copias)</h3>
      <p>Aunque la declaración es tu "palabra bajo juramento", gana credibilidad si anexas:</p>
      <ul>
        <li>Para declaración de ingresos: últimas 3 planillas de luz (demuestran residencia estable)</li>
        <li>Para declaración de unión de hecho: fotos, contratos de arriendo a nombre de ambos, facturas compartidas</li>
        <li>Para declaración de pérdida de documentos: denuncia en Fiscalía o UPC</li>
      </ul>

      <h2>Cómo redactar tu declaración (plantilla paso a paso)</h2>

      <h3>Estructura estándar</h3>
      <p><strong>1. Encabezado de identificación</strong></p>
      <p>"Yo, [NOMBRE COMPLETO], [nacionalidad], mayor de edad, con cédula de identidad N° [número], estado civil [soltero/casado/divorciado], domiciliado en [dirección completa], comparezco ante el señor Notario y DECLARO BAJO JURAMENTO lo siguiente:"</p>

      <p><strong>2. Cuerpo de la declaración (numerado)</strong></p>
      <p>"PRIMERO.- [Primer hecho que declaras con detalles]"</p>
      <p>"SEGUNDO.- [Segundo hecho relacionado]"</p>
      <p>"TERCERO.- [Consecuencias o solicitudes]"</p>

      <p><strong>3. Cláusula de responsabilidad</strong></p>
      <p>"Declaro que la información proporcionada es verdadera y asumo plena responsabilidad legal por su exactitud, sometiéndome a las sanciones civiles y penales que correspondan en caso de falsedad."</p>

      <p><strong>4. Cierre</strong></p>
      <p>"Suscribo la presente declaración en la ciudad de [ciudad], a los [día] días del mes de [mes] de [año]."</p>

      <h3>Ejemplo real: Declaración de solvencia económica para visa de turista</h3>
      <p>"Yo, CARLOS ANDRÉS MORALES LÓPEZ, ecuatoriano, mayor de edad, con cédula de ciudadanía N° 1712345678, estado civil casado, domiciliado en calle Los Cipreses Oe3-45 y Av. 10 de Agosto, sector La Floresta, Quito, comparezco ante el señor Notario y DECLARO BAJO JURAMENTO lo siguiente:</p>
      <p>PRIMERO.- Que tengo capacidad económica para permanecer en España por 90 días sin trabajar, sustentada en: (a) Ingresos mensuales de USD $2,100 provenientes de mi actividad como diseñador gráfico independiente, RUC 1712345678001; (b) Cuenta de ahorros en Banco Guayaquil N° 0123456789 con saldo de USD $8,500 al 25 de enero de 2026.</p>
      <p>SEGUNDO.- Que adjunto como respaldo: estados de cuenta bancarios de los últimos 6 meses, declaración de impuesto a la renta 2025 donde consta ingreso anual de USD $25,200, y carta de invitación de mi hermana MARÍA ISABEL MORALES LÓPEZ, residente legal en Madrid con NIE X-1234567-A.</p>
      <p>TERCERO.- Que la presente declaración la realizo para efectos de solicitud de visa Schengen de turista ante el Consulado de España en Quito.</p>
      <p>Declaro que la información proporcionada es verdadera y asumo plena responsabilidad legal por su exactitud. Quito, 28 de enero de 2026."</p>

      <h2>Costos 2026 (tarifas notariales vigentes)</h2>
      <p>Según la Tabla de Aranceles del Consejo de la Judicatura:</p>
      <ul>
        <li><strong>Declaración juramentada simple (1-2 páginas):</strong> $12.00</li>
        <li><strong>Declaración juramentada con anexos (3-5 páginas):</strong> $18.00</li>
        <li><strong>Copia certificada de la declaración:</strong> $3.00 por copia</li>
        <li><strong>Protocolización (si se requiere insertar en protocolo notarial):</strong> $35.00 adicionales</li>
      </ul>
      <p>⚠️ Algunas notarías cobran "derechos de digitación" adicionales ($5-10) si tú no llevas el texto ya impreso.</p>

      <h3>Tiempo de trámite</h3>
      <ul>
        <li>Si llevas el texto redactado y revisado: 15-30 minutos</li>
        <li>Si el notario debe redactar por ti: 1-2 horas (o te piden volver al día siguiente)</li>
        <li>Si necesitas apostilla para el exterior: +2-3 días hábiles</li>
      </ul>

      <h2>Errores que causan rechazo (y cómo evitarlos)</h2>

      <h3>1. Declaración contradictoria con documentos públicos</h3>
      <p><strong>Caso real:</strong> Cliente declaró "soy soltero sin hijos" para visa, pero el Registro Civil mostraba que tiene unión de hecho inscrita desde 2020. El consulado negó la visa por inconsistencia.</p>
      <p><strong>Solución:</strong> Antes de declarar tu estado civil, consulta tu certificado de estado civil actualizado en Registro Civil en línea (gratis).</p>

      <h3>2. Texto ambiguo o sin fechas exactas</h3>
      <p><strong>❌ Malo:</strong> "Perdí mi cédula hace unos meses en algún lugar de Quito."</p>
      <p><strong>✅ Bueno:</strong> "Perdí mi cédula de ciudadanía N° 1712345678 el día 15 de diciembre de 2025, aproximadamente a las 18h30, en el sector de La Mariscal, calle Foch y Juan León Mera, al salir de un restaurante. He buscado sin éxito y presento denuncia N° 2025-12-15-001 de la UPC La Mariscal."</p>

      <h3>3. No incluir cláusula de responsabilidad</h3>
      <p>Si tu declaración no dice explícitamente "asumo responsabilidad por la veracidad", algunas entidades (especialmente bancos y consulados) la rechazan por incompleta.</p>

      <h3>4. Firma de menor de edad sin representante legal</h3>
      <p>Los menores de 18 años NO pueden hacer declaraciones juramentadas por sí mismos. Debe comparecer un representante legal (padre, madre o tutor con nombramiento judicial).</p>

      <h2>¿Necesitas apostilla para el exterior?</h2>
      <p>Si vas a usar la declaración en otro país (ejemplo: declaración de soltería para casarte en España), necesitas:</p>
      <ol>
        <li><strong>Declaración juramentada notariada</strong> en Ecuador</li>
        <li><strong>Certificación del Ministerio de Relaciones Exteriores</strong> (si el país destino NO es parte del Convenio de La Haya) — costo $10, demora 3-5 días</li>
        <li><strong>Apostilla</strong> (si el país SÍ es parte del Convenio de La Haya) — costo $5-10, demora 24-48 horas</li>
      </ol>
      <p>Lista de países que aceptan apostilla: España, EEUU, Colombia, Perú, Argentina, Chile, México, Italia, Francia, Alemania, entre otros 100+ países.</p>

      <h2>Preguntas frecuentes</h2>

      <h3>¿Puedo hacer la declaración en una notaría diferente a mi domicilio?</h3>
      <p>Sí, puedes hacerla en cualquier notaría del país. No estás obligado a ir a la notaría de tu sector.</p>

      <h3>¿Cuánto tiempo es válida?</h3>
      <p>No tiene caducidad legal, pero las entidades suelen exigir que tenga máximo 30-90 días de antigüedad. Confirma con la entidad destino.</p>

      <h3>¿Puedo rectificar una declaración después de firmada?</h3>
      <p>No. Si te equivocaste, debes hacer una nueva declaración. No se puede "enmendar" una declaración juramentada.</p>

      <h3>¿Qué pasa si miento en la declaración?</h3>
      <p>Cometes delito de perjurio (Art. 273 COIP). Pena: 1-3 años de prisión. Además, el documento pierde toda validez y puedes ser demandado civilmente por daños.</p>

      <h2>Recomendación final</h2>
      <p>Antes de ir a notaría, confirma con la entidad destino (banco, consulado, Registro Civil, etc.) qué contenido exacto necesitan. Muchas instituciones tienen formatos referenciales que puedes solicitar. Invertir $50 en que un abogado revise tu borrador puede ahorrarte $150 en rechazos y re-trámites.</p>
      <p>Si necesitas que redactemos tu declaración juramentada para un caso específico, envíanos los detalles y te entregamos el texto listo para firmar en 24 horas.</p>
    `,
  },
  {
    slug: 'promesa-compraventa-inmueble-errores-frecuentes',
    title: 'Promesa de compraventa de inmueble: errores frecuentes y cómo evitarlos',
    excerpt:
      'Errores comunes en promesas de compraventa y cláusulas clave para proteger a comprador y vendedor.',
    coverImage:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80',
    category: 'Inmuebles',
    tags: ['promesa de compraventa', 'inmueble', 'cláusulas', 'quito'],
    seoTitle: 'Promesa de compraventa: cláusulas clave en Ecuador',
    seoDescription:
      'Evita conflictos en tu promesa de compraventa con una redacción legal clara y condiciones de cierre bien definidas.',
    publishedAt: '2026-01-24T10:00:00.000Z',
    content: `
      <p>El viernes pasado medié en un conflicto que ya lleva 8 meses sin resolverse: un comprador entregó $15,000 de arras por un departamento en La Carolina, pero la promesa decía "escritura en un plazo prudente después de entregar documentos". El vendedor nunca definió qué documentos ni cuándo, y ahora el comprador no puede recuperar su dinero porque la promesa no estableció causales de resolución. Ambos perdieron: el vendedor no puede vender a otro (está en demanda), el comprador no tiene ni dinero ni departamento.</p>

      <h2>Qué es (y qué NO es) una promesa de compraventa</h2>
      <p>Una promesa de compraventa es un <strong>contrato preparatorio</strong> donde comprador y vendedor se obligan a firmar la escritura definitiva en el futuro, bajo condiciones específicas. NO es la compraventa final — el inmueble sigue siendo del vendedor hasta la escritura pública.</p>

      <h3>Diferencias clave</h3>
      <table>
        <tr><th>Promesa de compraventa</th><th>Escritura pública definitiva</th></tr>
        <tr><td>No transfiere dominio</td><td>Transfiere dominio</td></tr>
        <tr><td>Puede firmarse en documento privado o ante notario</td><td>Obligatorio ante notario</td></tr>
        <tr><td>No se inscribe en Registro de la Propiedad</td><td>Sí se inscribe</td></tr>
        <tr><td>Establece obligación de vender/comprar en el futuro</td><td>Perfecciona la venta</td></tr>
      </table>

      <h2>Los 7 errores que más dinero cuestan</h2>

      <h3>Error #1: No definir fecha límite de escritura (el más común)</h3>
      <p><strong>❌ Cláusula mal redactada:</strong></p>
      <p>"Las partes se comprometen a firmar la escritura definitiva una vez que se cumplan las condiciones."</p>
      <p><strong>Problema:</strong> ¿Cuándo es "una vez"? ¿1 mes, 6 meses, 2 años? Sin fecha, el vendedor puede dilatar indefinidamente.</p>
      <p><strong>✅ Cláusula correcta:</strong></p>
      <p>"Las partes se obligan a otorgar la escritura pública definitiva ante notario el día 15 de marzo de 2026, a las 10h00, en la Notaría Décima de Quito. Si alguna de las condiciones suspensivas no se cumple para esa fecha, el plazo se extenderá automáticamente por 30 días adicionales, vencidos los cuales cualquiera de las partes podrá resolver el contrato."</p>

      <h3>Error #2: Arras imprecisas (sin regular qué pasa si alguien incumple)</h3>
      <p><strong>❌ Cláusula mal redactada:</strong></p>
      <p>"El comprador entrega $10,000 como arras."</p>
      <p><strong>Problema:</strong> ¿Son arras confirmatorias, penitenciales o de garantía? Si el vendedor incumple, ¿devuelve simple o duplicadas?</p>
      <p><strong>✅ Cláusula correcta:</strong></p>
      <p>"El comprador entrega en este acto $10,000 (diez mil dólares) como ARRAS PENITENCIALES. Si el comprador se retracta sin justa causa, pierde las arras en favor del vendedor. Si el vendedor incumple sin justa causa, debe devolver las arras DUPLICADAS ($20,000) al comprador en un plazo de 15 días hábiles. Se consideran justas causas de resolución: (a) Rechazo del crédito hipotecario del comprador, (b) Aparición de gravámenes no declarados por el vendedor, (c) Prohibición judicial de enajenar."</p>

      <h3>Error #3: No especificar el estado legal del inmueble</h3>
      <p><strong>❌ Omisión frecuente:</strong></p>
      <p>No mencionar si el inmueble tiene gravámenes, hipotecas, prohibiciones, sucesiones pendientes o problemas catastrales.</p>
      <p><strong>✅ Cláusula de garantía de estado legal:</strong></p>
      <p>"El vendedor declara que el inmueble objeto de esta promesa: (a) Se encuentra libre de gravámenes, hipotecas, prohibiciones de enajenar, embargos o limitaciones de dominio; (b) No tiene deudas de impuestos prediales, servicios básicos ni administración; (c) Cuenta con escritura debidamente inscrita en el Registro de la Propiedad bajo matrícula N° 12345; (d) No está en proceso de sucesión ni existe conflicto judicial sobre su propiedad. El vendedor se obliga a entregar certificados que acrediten estos extremos en un plazo de 15 días. Si se descubre que alguna declaración es falsa, el comprador podrá resolver el contrato y exigir devolución de arras duplicadas más daños."</p>

      <h3>Error #4: No condicionar la escritura al crédito hipotecario (si aplica)</h3>
      <p><strong>Caso real:</strong> Comprador firmó promesa por departamento de $95,000 con arras de $9,500. El banco negó el crédito porque el departamento tenía problemas de título de propiedad. Como la promesa no incluyó cláusula de "condición suspensiva por crédito", el comprador perdió las arras.</p>
      <p><strong>✅ Cláusula de condición suspensiva (si vas a pedir crédito):</strong></p>
      <p>"La presente promesa está sujeta a CONDICIÓN SUSPENSIVA consistente en que el comprador obtenga aprobación de crédito hipotecario por mínimo USD $70,000 en Banco Pichincha, Guayaquil o Produbanco, en un plazo de 45 días desde la firma. Si el crédito es negado por causas no imputables al comprador (ej: problemas del inmueble, avalúo menor al precio pactado), el comprador podrá resolver el contrato sin penalidad y con devolución íntegra de arras en 10 días. Si el rechazo es por insuficiencia de ingresos del comprador, este pierde el 50% de las arras."</p>

      <h3>Error #5: No definir quién paga qué en la escritura</h3>
      <p><strong>❌ Omisión frecuente:</strong></p>
      <p>No establecer quién paga alcabala, arancel notarial, derechos registrales, impuestos de plusvalía, certificados.</p>
      <p><strong>✅ Cláusula de distribución de gastos:</strong></p>
      <p>"Los gastos de escrituración se distribuyen así: (a) VENDEDOR paga: impuesto de plusvalía, certificado de gravámenes, certificado de no adeudar predial, levantamiento de hipoteca si aplica, 50% del arancel notarial; (b) COMPRADOR paga: alcabala municipal, derechos del Registro de la Propiedad, avalúo bancario si aplica crédito, 50% del arancel notarial, póliza de seguros. Cualquier gasto no previsto se divide por partes iguales."</p>

      <h3>Error #6: No incluir cláusula de verificación física antes del cierre</h3>
      <p><strong>Caso real:</strong> Comprador firmó promesa por casa en Cumbayá. Cuando fue a hacer la escritura 3 meses después, descubrió que el vendedor había retirado toda la cocina equipada, aires acondicionados y pisos de madera que estaban cuando firmaron la promesa. Como no había inventario detallado, no pudo reclamar.</p>
      <p><strong>✅ Cláusula de verificación de estado del inmueble:</strong></p>
      <p>"El comprador tendrá derecho a inspeccionar el inmueble 5 días hábiles antes de la escritura para verificar que se mantiene en las condiciones en que fue ofrecido. El vendedor se obliga a entregar el inmueble con: (a) Todos los acabados, instalaciones y mejoras existentes al momento de esta promesa, detallados en Anexo A (inventario fotográfico); (b) Servicios básicos al día y medidores funcionando; (c) Desocupado de personas y bienes del vendedor. Si hay deterioro mayor al 10% del valor o falta algún elemento del inventario, el comprador podrá exigir reparación o reducción proporcional del precio."</p>

      <h3>Error #7: No establecer mecanismo de resolución de conflictos</h3>
      <p><strong>❌ Omisión fatal:</strong></p>
      <p>No decir qué pasa si hay disputa ni cómo se resuelve (arbitraje, mediación, vía judicial).</p>
      <p><strong>✅ Cláusula de solución de controversias:</strong></p>
      <p>"Cualquier controversia derivada de esta promesa se resolverá mediante MEDIACIÓN en el Centro de Mediación de la Cámara de Comercio de Quito, en un plazo de 30 días. Si no hay acuerdo en mediación, las partes se someten a ARBITRAJE ante un árbitro único del mismo Centro, aplicando el procedimiento simplificado. La ley aplicable es la ecuatoriana. El laudo arbitral es inapelable y de cumplimiento obligatorio."</p>

      <h2>Cláusulas que SÍ o SÍ debe tener tu promesa</h2>

      <h3>1. Identificación completa del inmueble</h3>
      <ul>
        <li>Dirección exacta (calle, número, sector, ciudad)</li>
        <li>Número de matrícula del Registro de la Propiedad</li>
        <li>Clave catastral municipal</li>
        <li>Área de terreno y construcción (según escritura madre)</li>
        <li>Linderos (Norte, Sur, Este, Oeste)</li>
        <li>Alícuota si es conjunto o edificio (ej: "2.5% de alícuota del condominio")</li>
      </ul>

      <h3>2. Precio total y forma de pago detallada</h3>
      <p><strong>Ejemplo completo:</strong></p>
      <p>"El precio total es USD $120,000 (ciento veinte mil dólares), pagaderos así:</p>
      <ul>
        <li>$12,000 en este acto como arras penitenciales (recibo N° 001)</li>
        <li>$18,000 al cumplirse 45 días desde hoy (al obtener aprobación de crédito)</li>
        <li>$90,000 el día de la escritura, de los cuales $70,000 serán desembolsados directamente por Banco Pichincha mediante cheque certificado y $20,000 mediante transferencia bancaria a cuenta N° 2100123456 del vendedor</li>
      </ul>
      <p>Si el banco desembolsa menos de $70,000 por observaciones al inmueble, el vendedor deberá corregir las observaciones o aceptar reducción proporcional del precio."</p>

      <h3>3. Obligaciones del vendedor previas a la escritura</h3>
      <ul>
        <li>Entregar certificado de gravámenes (máximo 15 días de antigüedad)</li>
        <li>Presentar certificado de no adeudar impuestos prediales</li>
        <li>Cancelar todas las deudas de servicios básicos</li>
        <li>Si es departamento: certificado de no adeudar a la administración</li>
        <li>Si hay hipoteca: gestionar cancelación y entregar finiquito</li>
        <li>Tramitar levantamiento de cualquier prohibición o limitación</li>
        <li>Entregar copia certificada de escritura madre</li>
      </ul>

      <h3>4. Obligaciones del comprador previas a la escritura</h3>
      <ul>
        <li>Gestionar aprobación de crédito hipotecario (si aplica) en máximo 45 días</li>
        <li>Pagar la segunda cuota pactada según cronograma</li>
        <li>Contratar póliza de seguro si el banco lo exige</li>
        <li>Presentar documentos requeridos por el banco o notario</li>
      </ul>

      <h3>5. Causales de resolución sin penalidad</h3>
      <p>Define situaciones donde cualquier parte puede salir del contrato sin perder dinero:</p>
      <ul>
        <li>Rechazo de crédito por problemas del inmueble (no del comprador)</li>
        <li>Aparición de gravámenes, embargos o prohibiciones no declarados</li>
        <li>Incumplimiento de obligaciones de la contraparte</li>
        <li>Daño sustancial del inmueble (incendio, inundación, terremoto) mayor al 30%</li>
        <li>Expropiación o afectación por obra pública</li>
      </ul>

      <h2>¿Necesitas firmar ante notario o basta documento privado?</h2>

      <h3>Documento privado (firmado entre partes, sin notario)</h3>
      <p><strong>Ventajas:</strong> Rápido (lo firmas hoy), sin costo, flexible para modificar</p>
      <p><strong>Desventajas:</strong> Si hay conflicto, primero debes "reconocer firmas" ante notario o juez. Puede ser impugnado fácilmente ("esa no es mi firma")</p>

      <h3>Documento notariado (firmado ante notario)</h3>
      <p><strong>Ventajas:</strong> Fecha cierta, fe pública notarial, ejecutoriedad inmediata (si hay incumplimiento, puedes demandar directo sin trámites previos), difícil de impugnar</p>
      <p><strong>Desventajas:</strong> Costo ($35-82 según valor), más lento (necesitas cita), más formal (no se puede modificar después sin hacer addendum notariado)</p>

      <p><strong>Recomendación:</strong> Si las arras superan $5,000, firma ante notario. La inversión de $50 te ahorra $5,000 en litigios.</p>

      <h2>Qué pasa si alguien incumple (escenarios reales)</h2>

      <h3>Escenario A: Comprador se arrepiente sin causa justificada</h3>
      <p>Si las arras son <strong>penitenciales</strong>: pierde las arras completas y el vendedor puede vender a otro.</p>
      <p>Si las arras son <strong>confirmatorias</strong>: el vendedor puede demandar cumplimiento forzoso (obligar al comprador a escriturar) O pedir indemnización por daños más las arras.</p>

      <h3>Escenario B: Vendedor incumple sin causa justificada</h3>
      <p>Si las arras son <strong>penitenciales</strong>: debe devolver arras DUPLICADAS (si recibió $10K, devuelve $20K).</p>
      <p>Si las arras son <strong>confirmatorias</strong>: el comprador puede demandar cumplimiento forzoso (obligar al vendedor a escriturar) O pedir indemnización por daños más devolución de arras.</p>

      <h3>Escenario C: Incumplimiento por causa justificada (condición suspensiva)</h3>
      <p>Ejemplo: banco rechaza crédito por avalúo menor al esperado. Si la promesa incluyó "condición suspensiva por crédito", el comprador recupera arras completas sin penalidad.</p>

      <h2>Checklist final antes de firmar tu promesa</h2>
      <ul>
        <li>✅ Incluye fecha límite exacta para la escritura definitiva</li>
        <li>✅ Define tipo de arras (penitenciales o confirmatorias) y consecuencias de incumplimiento</li>
        <li>✅ Vendedor declara estado legal del inmueble (sin gravámenes, deudas, conflictos)</li>
        <li>✅ Si vas a pedir crédito, incluye condición suspensiva por aprobación bancaria</li>
        <li>✅ Especifica quién paga cada gasto de escrituración</li>
        <li>✅ Incluye cláusula de verificación física del inmueble antes del cierre</li>
        <li>✅ Define mecanismo de solución de controversias (mediación o arbitraje)</li>
        <li>✅ Anexa inventario fotográfico del estado actual del inmueble</li>
        <li>✅ Establece obligaciones previas de ambas partes con plazos específicos</li>
        <li>✅ Si las arras superan $5,000, firma ante notario</li>
      </ul>

      <h2>¿Cuánto cuesta una promesa bien hecha?</h2>
      <ul>
        <li><strong>Redacción legal:</strong> $150-350 (dependiendo de complejidad)</li>
        <li><strong>Notarización:</strong> $35-82 (según valor del inmueble)</li>
        <li><strong>Certificados previos:</strong> $15-30</li>
        <li><strong>Total:</strong> $200-460</li>
      </ul>
      <p>Es decir, menos del 0.5% del valor de una casa de $100,000. Un seguro muy barato contra conflictos de $10,000-$50,000.</p>

      <h2>Recomendación final</h2>
      <p>No firmes una promesa de compraventa redactada por un corredor inmobiliario sin revisión legal. Los corredores usan modelos genéricos que protegen más al vendedor (quien les paga comisión) que al comprador. Invierte en un abogado que revise el texto ANTES de firmar, no después de tener problemas.</p>
      <p>Si necesitas que redactemos tu promesa de compraventa con todas las cláusulas de protección, envíanos los datos del inmueble y de las partes, y te entregamos el documento completo en 48 horas.</p>
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
