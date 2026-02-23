import {
  Document as DocxDocument,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  Packer,
} from 'docx'
import type { ContratoVehicular } from '@/lib/validations/contract'
import {
  requiresConyuge,
  compradorIncludesConyuge,
  resolverGenero,
  resolverEstadoCivil,
  buildTextoDocumento,
  getFormaPagoTexto,
} from '@/lib/validations/contract'

const BLANK = '_______________'
const FOOTER_BRAND = 'Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com'
const FOOTER_DISCLAIMER =
  'AVISO LEGAL: Documento generado automáticamente con datos proporcionados por el usuario. Requiere revisión legal y notarial previa a su firma.'

// --- Helpers ---

function normalizeSpaces(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function removeConsecutiveDuplicateWords(value: string): string {
  const words = value.split(' ')
  const result: string[] = []
  let prevNormalized = ''

  for (const word of words) {
    const normalized = word
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    if (normalized !== prevNormalized) {
      result.push(word)
      prevNormalized = normalized
    }
  }

  return result.join(' ')
}

function normalizeContractText(value?: string): string {
  if (!value) return ''

  let text = normalizeSpaces(value)
  text = removeConsecutiveDuplicateWords(text)
  text = text
    .replace(/\s+,/g, ',')
    .replace(/\s+\./g, '.')
    .replace(/\s+;/g, ';')
    .replace(/\s+:/g, ':')

  return text
}

function toUpper(value: string | undefined): string {
  const text = normalizeContractText(value)
  return (text || BLANK).toUpperCase()
}

function orBlank(value: string | undefined): string {
  const text = normalizeContractText(value)
  return text || BLANK
}

function removeAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const UNIDADES: Record<number, string> = {
  0: 'cero',
  1: 'uno',
  2: 'dos',
  3: 'tres',
  4: 'cuatro',
  5: 'cinco',
  6: 'seis',
  7: 'siete',
  8: 'ocho',
  9: 'nueve',
}

const ESPECIALES: Record<number, string> = {
  10: 'diez',
  11: 'once',
  12: 'doce',
  13: 'trece',
  14: 'catorce',
  15: 'quince',
  16: 'dieciséis',
  17: 'diecisiete',
  18: 'dieciocho',
  19: 'diecinueve',
  20: 'veinte',
  21: 'veintiuno',
  22: 'veintidós',
  23: 'veintitrés',
  24: 'veinticuatro',
  25: 'veinticinco',
  26: 'veintiséis',
  27: 'veintisiete',
  28: 'veintiocho',
  29: 'veintinueve',
}

const DECENAS: Record<number, string> = {
  30: 'treinta',
  40: 'cuarenta',
  50: 'cincuenta',
  60: 'sesenta',
  70: 'setenta',
  80: 'ochenta',
  90: 'noventa',
}

const CENTENAS: Record<number, string> = {
  100: 'cien',
  200: 'doscientos',
  300: 'trescientos',
  400: 'cuatrocientos',
  500: 'quinientos',
  600: 'seiscientos',
  700: 'setecientos',
  800: 'ochocientos',
  900: 'novecientos',
}

function toWordsBelow100(n: number): string {
  if (n < 10) return UNIDADES[n]
  if (n <= 29) return ESPECIALES[n]

  const decena = Math.floor(n / 10) * 10
  const unidad = n % 10

  if (unidad === 0) return DECENAS[decena]
  return `${DECENAS[decena]} y ${UNIDADES[unidad]}`
}

function toWordsBelow1000(n: number): string {
  if (n < 100) return toWordsBelow100(n)
  if (n === 100) return 'cien'

  const centena = Math.floor(n / 100) * 100
  const resto = n % 100

  const centenaTexto = centena === 100 ? 'ciento' : CENTENAS[centena]
  if (resto === 0) return centenaTexto
  return `${centenaTexto} ${toWordsBelow100(resto)}`
}

function numberToWords(n: number): string {
  if (!Number.isFinite(n)) return String(n)

  const entero = Math.trunc(Math.abs(n))

  if (entero < 1000) return toWordsBelow1000(entero)

  if (entero < 1000000) {
    const miles = Math.floor(entero / 1000)
    const resto = entero % 1000
    const milesTexto = miles === 1 ? 'mil' : `${toWordsBelow1000(miles)} mil`
    if (resto === 0) return milesTexto
    return `${milesTexto} ${toWordsBelow1000(resto)}`
  }

  if (entero < 1000000000) {
    const millones = Math.floor(entero / 1000000)
    const resto = entero % 1000000
    const millonesTexto = millones === 1 ? 'un millón' : `${numberToWords(millones)} millones`

    if (resto === 0) return millonesTexto
    if (resto < 1000) return `${millonesTexto} ${toWordsBelow1000(resto)}`

    const miles = Math.floor(resto / 1000)
    const restoFinal = resto % 1000
    const milesTexto = miles === 1 ? 'mil' : `${toWordsBelow1000(miles)} mil`

    if (restoFinal === 0) return `${millonesTexto} ${milesTexto}`
    return `${millonesTexto} ${milesTexto} ${toWordsBelow1000(restoFinal)}`
  }

  return String(entero)
}

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function formatDate(): string {
  const now = new Date()
  const dia = now.getDate()
  const mes = MESES[now.getMonth()]
  const anio = now.getFullYear()

  return `${numberToWords(dia)} (${dia}) días del mes de ${mes} del año ${numberToWords(anio)} (${anio})`
}

function formatPrecioLetras(valor: number): string {
  const entero = Math.floor(valor)
  const centavos = Math.round((valor - entero) * 100)
  const precioFormato = valor.toLocaleString('es-EC', { minimumFractionDigits: 2 })

  const centavosTexto = centavos > 0 ? ` CON ${String(centavos).padStart(2, '0')}/100` : ''

  return `${numberToWords(entero).toUpperCase()}${centavosTexto} DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA (USD$ ${precioFormato})`
}

function formatCilindraje(cc: number): string {
  if (!Number.isFinite(cc) || cc <= 0) return BLANK
  return numberToWords(Math.round(cc))
}

function formatPasajerosLetras(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return BLANK
  return numberToWords(Math.round(n))
}

function normalizeObservation(raw?: string, enabled?: boolean): string {
  if (!enabled) {
    return 'No se registran observaciones adicionales sobre el estado físico o mecánico del vehículo.'
  }

  const cleaned = normalizeContractText(raw)
  if (!cleaned) {
    return 'No se registran observaciones adicionales sobre el estado físico o mecánico del vehículo.'
  }

  const normalized = removeAccents(cleaned.toLowerCase())
  const sensitivePatterns = [
    /\brobad[oa]?\b/,
    /\bsin\s+papeles\b/,
    /\bclonad[oa]?\b/,
    /\bkilometraje\s+alterad[oa]?\b/,
    /\bodometro\s+alterad[oa]?\b/,
    /\bnumero\s+de\s+motor\s+alterad[oa]?\b/,
  ]

  if (sensitivePatterns.some((pattern) => pattern.test(normalized))) {
    return '[REVISIÓN MANUAL REQUERIDA] La observación ingresada contiene un término sensible que debe ser verificado por asesoría legal antes de la firma del contrato.'
  }

  const choque = /\bchoque\b/.test(normalized)
  const rayones = /\brayones?\b|\braspones?\b/.test(normalized)
  const fallaMecanica = /\bfalla\s+mecanica\b|\bmecanic[oa]\b/.test(normalized)
  const fallaElectrica = /\bfalla\s+electrica\b|\belectric[oa]\b/.test(normalized)
  const aire = /\bair(e)?\s+acondicionado\b|\ba\/?c\b/.test(normalized)

  if (choque) {
    return 'El vehículo presenta daños por choque, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (rayones) {
    return 'El vehículo presenta rayones o afectaciones estéticas, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (fallaMecanica) {
    return 'El vehículo presenta una novedad mecánica, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (fallaElectrica) {
    return 'El vehículo presenta una novedad eléctrica, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (aire) {
    return 'El vehículo presenta una novedad en el sistema de aire acondicionado, circunstancia conocida y aceptada por la parte compradora.'
  }

  return `Se deja constancia de la siguiente observación sobre el vehículo: ${cleaned}. Esta circunstancia es conocida y aceptada por la parte compradora.`
}

// --- Paragraph builders ---

function boldText(text: string): TextRun {
  return new TextRun({ text, bold: true, font: 'Calibri', size: 22 })
}

function normalText(text: string): TextRun {
  return new TextRun({ text, font: 'Calibri', size: 22 })
}

function smallText(text: string): TextRun {
  return new TextRun({ text, font: 'Calibri', size: 18 })
}

function makeParagraph(runs: TextRun[], spacing = 240): Paragraph {
  return new Paragraph({
    children: runs,
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: spacing },
  })
}

function clauseTitle(text: string): Paragraph {
  return new Paragraph({
    children: [boldText(text)],
    alignment: AlignmentType.LEFT,
    spacing: { before: 280, after: 120 },
  })
}

function subClause(text: string): Paragraph {
  return makeParagraph([normalText(text)], 160)
}

function centeredBold(text: string): Paragraph {
  return new Paragraph({
    children: [boldText(text)],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  })
}

function centeredNormal(text: string, spacing = 100): Paragraph {
  return new Paragraph({
    children: [normalText(text)],
    alignment: AlignmentType.CENTER,
    spacing: { after: spacing },
  })
}

function centeredSmall(text: string, spacing = 80): Paragraph {
  return new Paragraph({
    children: [smallText(text)],
    alignment: AlignmentType.CENTER,
    spacing: { after: spacing },
  })
}

function blankLine(spacing = 200): Paragraph {
  return new Paragraph({ children: [normalText('')], spacing: { after: spacing } })
}

function bulletItem(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [boldText(`${label}: `), normalText(value)],
    alignment: AlignmentType.LEFT,
    spacing: { after: 60 },
    indent: { left: 360 },
  })
}

// --- Main function ---

export async function generateContratoVehicularDocx(contrato: ContratoVehicular): Promise<Buffer> {
  const { vendedor, comprador, vehiculo } = contrato
  const precio = vehiculo.valorContrato > 0 ? vehiculo.valorContrato : vehiculo.avaluo
  const precioLetras = formatPrecioLetras(precio)
  const precioFormato = precio.toLocaleString('es-EC', { minimumFractionDigits: 2 })
  const fechaTexto = formatDate()

  const compradorConConyuge = compradorIncludesConyuge(comprador)
  const vendedorConConyuge = requiresConyuge(vendedor.estadoCivil) && !!vendedor.conyuge?.nombres

  const gVend = resolverGenero(vendedor.sexo)
  const gComp = resolverGenero(comprador.sexo)
  const denomVend = gVend.denominacionVendedor
  const denomComp = gComp.denominacionComprador

  function buildCompareciente(
    persona: typeof vendedor,
    num: '1' | '2',
    denominacion: string,
    inclConyuge: boolean,
  ): Paragraph {
    const prefix = num === '1' ? '1. Por una parte,' : '2. Por otra parte,'
    const g = resolverGenero(persona.sexo)
    const estadoCivilLabel = resolverEstadoCivil(persona.estadoCivil, persona.sexo)
    const textoDoc = buildTextoDocumento(persona.tipoDocumento, persona.cedula)

    const runs: TextRun[] = [
      normalText(`${prefix} ${g.articulo} `),
      boldText(toUpper(persona.nombres)),
      normalText(`, de nacionalidad ${orBlank(persona.nacionalidad)}, ${g.portador} de la ${textoDoc}, de estado civil ${estadoCivilLabel}`),
    ]

    if (inclConyuge && persona.conyuge?.nombres) {
      const gConyuge = resolverGenero(persona.conyuge.sexo ?? (persona.sexo === 'M' ? 'F' : 'M'))
      const textoDocConyuge = buildTextoDocumento(
        persona.conyuge.tipoDocumento ?? 'cedula',
        persona.conyuge.cedula,
      )

      runs.push(
        normalText(` con ${gConyuge.articulo} `),
        boldText(toUpper(persona.conyuge.nombres)),
        normalText(`, ${gConyuge.portador} de la ${textoDocConyuge}`),
        normalText(', quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal'),
      )
    } else if (persona.comparecencia === 'apoderado' && persona.apoderado) {
      runs.push(
        normalText(', debidamente representado por '),
        boldText(toUpper(persona.apoderado.nombres)),
        normalText(', portador de la cédula No. '),
        boldText(orBlank(persona.apoderado.cedula)),
        normalText(`, según poder especial otorgado ante la ${orBlank(persona.apoderado.notariaPoder)} el ${orBlank(persona.apoderado.fechaPoder)}`),
      )
    } else {
      runs.push(normalText(', por sus propios y personales derechos'))
    }

    const comparecienteFinal = inclConyuge ? 'quienes en adelante se denominarán' : 'quien en adelante se denominará'

    runs.push(
      normalText(`, con domicilio en ${orBlank(persona.direccion)}, ${comparecienteFinal} `),
      boldText(`"${denominacion}"`),
      normalText(num === '1' ? '; y,' : '.'),
    )

    return makeParagraph(runs, 200)
  }

  function buildAntecedentes(): Paragraph[] {
    const paragraphs: Paragraph[] = [clauseTitle('PRIMERA: ANTECEDENTES.-')]
    const hasCuv = Boolean(contrato.cuvNumero && contrato.cuvNumero.trim())

    if (contrato.tipoAntecedente === 'compraventa') {
      if (hasCuv) {
        paragraphs.push(
          subClause(
            `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular No. ${orBlank(contrato.cuvNumero)}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}, habiendo adquirido la propiedad del mismo mediante transferencia de dominio inscrita el ${orBlank(contrato.fechaInscripcion)}.`,
          ),
        )
      } else {
        paragraphs.push(
          subClause(
            `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato.`,
          ),
        )
      }
    }

    if (contrato.tipoAntecedente === 'herencia') {
      const h = contrato.herencia

      if (h) {
        const cuvText = hasCuv
          ? `, según el Certificado Único Vehicular No. ${orBlank(contrato.cuvNumero)} emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
          : ', según consta en los registros de la Agencia Nacional de Tránsito'

        paragraphs.push(
          subClause(
            `1.1.- ${denomVend} declara(n) que mediante Acta Notarial de Posesión Efectiva otorgada ante la ${orBlank(h.posEfectivaNotaria)} con fecha ${orBlank(h.posEfectivaFecha)}, se concedió la posesión efectiva proindiviso de los bienes dejados por ${orBlank(h.causanteNombre)}, quien falleció el ${orBlank(h.causanteFechaFallecimiento)}, a favor de ${orBlank(h.herederosLista)} en calidad de ${orBlank(h.parentesco)}. Entre los bienes del causante se encuentra el vehículo descrito en este contrato${cuvText}.`,
          ),
        )
      } else {
        paragraphs.push(
          subClause(
            `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante posesión efectiva, según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato.`,
          ),
        )
      }
    }

    if (contrato.tipoAntecedente === 'donacion') {
      const cuvText = hasCuv
        ? `, según consta en el Certificado Único Vehicular No. ${orBlank(contrato.cuvNumero)}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
        : ', según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato'

      paragraphs.push(
        subClause(
          `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante escritura pública de donación${cuvText}.`,
        ),
      )
    }

    if (contrato.tipoAntecedente === 'importacion') {
      const cuvText = hasCuv
        ? `, según consta en el Certificado Único Vehicular No. ${orBlank(contrato.cuvNumero)}, emitido por la Agencia Nacional de Tránsito el ${orBlank(contrato.cuvFecha)}`
        : ', según consta en los registros de la Agencia Nacional de Tránsito, documento que será anexo al presente contrato'

      paragraphs.push(
        subClause(
          `1.1.- ${denomVend} declara ser ${gVend.propietario} del vehículo que se describe en el presente contrato, habiéndolo adquirido mediante importación directa debidamente nacionalizada${cuvText}.`,
        ),
      )
    }

    paragraphs.push(
      subClause(
        `1.2.- ${denomVend} declara que el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, prendas, reserva de dominio, prohibiciones de enajenar, medidas cautelares y demás limitaciones al dominio que afecten su transferencia, encontrándose en estado jurídico apto para la transferencia de dominio.`,
      ),
    )

    if (contrato.matriculaVigencia && contrato.matriculaVigencia.trim()) {
      paragraphs.push(
        subClause(
          `1.3.- ${denomVend} declara que el vehículo se encuentra con su matrícula vigente hasta el ${orBlank(contrato.matriculaVigencia)}, según los registros de la Agencia Nacional de Tránsito.`,
        ),
      )
    } else {
      paragraphs.push(
        subClause(
          `1.3.- ${denomVend} declara que el vehículo se encuentra con su matrícula en regla, conforme a los registros de la Agencia Nacional de Tránsito del Ecuador.`,
        ),
      )
    }

    return paragraphs
  }

  const vehicleItems: Paragraph[] = [
    bulletItem('PLACA', orBlank(vehiculo.placa)),
    bulletItem('MARCA', orBlank(vehiculo.marca)),
    bulletItem('MODELO', orBlank(vehiculo.modelo)),
    bulletItem('TIPO', orBlank(vehiculo.tipo)),
    bulletItem('AÑO DE MODELO', `${numberToWords(vehiculo.anio)} (${vehiculo.anio})`),
    bulletItem('NÚMERO DE MOTOR', orBlank(vehiculo.motor)),
    bulletItem('NÚMERO DE CHASIS/VIN', orBlank(vehiculo.chasis)),
    bulletItem('COLOR', orBlank(vehiculo.color)),
  ]

  if (vehiculo.cilindraje && vehiculo.cilindraje > 0) {
    vehicleItems.push(
      bulletItem('CILINDRAJE', `${formatCilindraje(vehiculo.cilindraje)} (${vehiculo.cilindraje}) cc`),
    )
  }

  if (vehiculo.carroceria) vehicleItems.push(bulletItem('CARROCERÍA', orBlank(vehiculo.carroceria)))
  if (vehiculo.clase) vehicleItems.push(bulletItem('CLASE', orBlank(vehiculo.clase)))
  if (vehiculo.pais) vehicleItems.push(bulletItem('PAÍS DE ORIGEN', orBlank(vehiculo.pais)))
  if (vehiculo.combustible) vehicleItems.push(bulletItem('COMBUSTIBLE', orBlank(vehiculo.combustible)))

  if (vehiculo.pasajeros && vehiculo.pasajeros > 0) {
    vehicleItems.push(
      bulletItem('NÚMERO DE PASAJEROS', `${formatPasajerosLetras(vehiculo.pasajeros)} (${vehiculo.pasajeros})`),
    )
  }

  vehicleItems.push(bulletItem('SERVICIO', orBlank(vehiculo.servicio)))

  if (vehiculo.tonelaje && vehiculo.tonelaje.trim()) {
    vehicleItems.push(bulletItem('TONELAJE', orBlank(vehiculo.tonelaje)))
  }

  const formaPagoTexto = getFormaPagoTexto(contrato.formaPago)
  const observacionNormalizada = normalizeObservation(contrato.observacionesTexto, contrato.tieneObservaciones)

  const children: Paragraph[] = [
    centeredBold('ABOGADOS ONLINE ECUADOR'),
    centeredNormal('Servicio legal digital independiente | Quito, Ecuador'),
    blankLine(160),
    centeredBold('CONTRATO DE COMPRAVENTA DE VEHÍCULO'),
    centeredBold(`CUANTÍA: USD$ ${precioFormato}`),
    blankLine(100),

    makeParagraph(
      [
        normalText('En la ciudad de San Francisco de Quito, Distrito Metropolitano, capital de la República del Ecuador, a los '),
        boldText(fechaTexto),
        normalText(', comparecen a la celebración del presente contrato de compraventa:'),
      ],
      200,
    ),

    buildCompareciente(vendedor, '1', denomVend, vendedorConConyuge),
    buildCompareciente(comprador, '2', denomComp, compradorConConyuge),

    makeParagraph([
      normalText('Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:'),
    ]),

    ...buildAntecedentes(),

    clauseTitle('SEGUNDA: OBJETO.-'),
    subClause(
      `Por el presente contrato, ${denomVend} transfiere en favor de ${denomComp}, a título de venta, el dominio, posesión y todos los derechos que le corresponden sobre el siguiente vehículo automotor:`,
    ),
    ...vehicleItems,
    blankLine(100),

    clauseTitle('TERCERA: PRECIO Y FORMA DE PAGO.-'),
    subClause(
      `3.1.- El precio de la presente compraventa es la suma de ${precioLetras}, cantidad que ${denomVend} declara haber recibido a su entera satisfacción mediante ${formaPagoTexto} realizada por ${denomComp}.`,
    ),
    subClause(
      '3.2.- Para fines de respaldo documental, las partes podrán incorporar al presente instrumento la fecha de pago [FECHA], la entidad financiera [COMPLETAR] y el comprobante No. [COMPLETAR].',
    ),
    subClause(
      `3.3.- Con el pago del precio señalado, ${denomVend} se da por ${gVend.cancelado} y ${gVend.satisfecho} de la obligación contraída por ${denomComp}, otorgando el más amplio y eficaz finiquito de pago.`,
    ),

    clauseTitle('CUARTA: TRADICIÓN Y TRANSFERENCIA DE DOMINIO.-'),
    subClause(
      `4.1.- Con la suscripción del presente contrato y el pago total del precio convenido, ${denomVend} transfiere y hace la tradición del dominio del vehículo a favor de ${denomComp}.`,
    ),
    subClause(
      '4.2.- Las partes se obligan a suscribir y gestionar los documentos adicionales que resulten necesarios ante la autoridad de tránsito competente para perfeccionar el traspaso registral.',
    ),

    clauseTitle('QUINTA: DECLARACIÓN DE GRAVÁMENES Y SANEAMIENTO.-'),
    subClause(
      `5.1.- ${denomVend} declara expresamente que el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, prendas, reserva de dominio, prohibiciones de enajenar, medidas cautelares y demás limitaciones al dominio que afecten su transferencia.`,
    ),
    subClause(
      `5.2.- ${denomVend} garantiza a ${denomComp} el saneamiento por evicción del bien vendido, comprometiéndose a responder por cualquier reclamo de terceros sobre la propiedad del vehículo.`,
    ),

    clauseTitle('SEXTA: ENTREGA MATERIAL DEL VEHÍCULO Y DOCUMENTOS.-'),
    subClause('6.1.- La entrega material del vehículo se realizará el [FECHA], en [COMPLETAR].'),
    subClause(
      '6.2.- En el acto de entrega, la parte vendedora hará entrega a la parte compradora de las llaves, matrícula original, Certificado Único Vehicular y demás documentos habilitantes que reposen en su poder para la transferencia de dominio.',
    ),
    subClause(
      '6.3.- Las partes podrán suscribir un acta de entrega-recepción para dejar constancia de la entrega del vehículo y de los documentos mencionados.',
    ),

    clauseTitle('SÉPTIMA: RESPONSABILIDAD POSTERIOR A LA ENTREGA.-'),
    subClause(
      `7.1.- Desde la fecha y hora de entrega material del vehículo, ${denomComp} asume toda responsabilidad administrativa, civil y de uso del automotor, incluyendo multas, infracciones, tasas, tributos y demás obligaciones que se generen con posterioridad a la entrega.`,
    ),
    subClause(
      `7.2.- Las multas, obligaciones y responsabilidades generadas con anterioridad a la entrega material serán de cargo de ${denomVend}, salvo pacto expreso en contrario.`,
    ),

    clauseTitle('OCTAVA: ESTADO FÍSICO Y MECÁNICO DEL VEHÍCULO.-'),
    subClause(`8.1.- ${denomComp} declara conocer y aceptar el estado físico y mecánico actual del vehículo, luego de su revisión previa.`),
    subClause(`8.2.- ${observacionNormalizada}`),
    subClause(
      `8.3.- En virtud de lo anterior, ${denomComp} acepta el estado físico y mecánico en que recibe el automotor, sin perjuicio de la garantía de saneamiento por evicción prevista en este contrato.`,
    ),

    clauseTitle('NOVENA: GASTOS.-'),
    makeParagraph([
      normalText(
        `Todos los gastos que origine la transferencia de dominio del vehículo, tales como derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos por ${denomComp}, salvo aquellos que por disposición legal correspondan a ${denomVend}.`,
      ),
    ]),

    clauseTitle('DÉCIMA: PLAZO PARA REALIZAR LA TRANSFERENCIA DE DOMINIO.-'),
    makeParagraph([
      normalText(
        'Las partes se obligan a realizar el trámite de transferencia de dominio ante la autoridad competente dentro del plazo de [PLAZO] días contados a partir de la fecha de suscripción del presente contrato.',
      ),
    ]),

    clauseTitle('DÉCIMA PRIMERA: JURISDICCIÓN Y COMPETENCIA.-'),
    makeParagraph([
      normalText(
        'Para todos los efectos legales derivados del presente contrato, las partes se someten a los jueces competentes de la ciudad de Quito, renunciando expresamente al fuero especial que pudieren tener.',
      ),
    ]),

    clauseTitle('DÉCIMA SEGUNDA: ACEPTACIÓN Y RATIFICACIÓN.-'),
    makeParagraph([
      normalText(
        'Las partes aceptan íntegramente las cláusulas del presente contrato, declarando que han sido redactadas de común acuerdo y que las mismas son expresión fiel de su voluntad. El presente contrato se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada una de las partes.',
      ),
    ]),

    clauseTitle('DÉCIMA TERCERA: CUANTÍA.-'),
    makeParagraph([
      normalText(`La cuantía de la presente compraventa asciende a la suma de ${precioLetras}.`),
    ]),

    makeParagraph(
      [normalText('En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.')],
      400,
    ),
    new Paragraph({ children: [], spacing: { after: 0 } }),
  ]

  function sigCell(nombre: string, cedula: string, rol: string): TableCell {
    return new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: '1e293b' },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
      },
      children: [
        new Paragraph({
          children: [boldText(toUpper(nombre))],
          alignment: AlignmentType.CENTER,
          spacing: { before: 60, after: 40 },
        }),
        new Paragraph({
          children: [normalText(`C.I. ${orBlank(cedula)}`)],
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [normalText(rol)],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
      ],
    })
  }

  function emptyCell(): TableCell {
    return new TableCell({
      width: { size: 50, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
      },
      children: [new Paragraph({ children: [] })],
    })
  }

  const sigRow1Cells = [
    sigCell(vendedor.nombres, vendedor.cedula, denomVend),
    vendedorConConyuge
      ? sigCell(vendedor.conyuge!.nombres, orBlank(vendedor.conyuge!.cedula), `CÓNYUGE DE ${denomVend}`)
      : emptyCell(),
  ]

  const sigRow2Cells = [
    sigCell(comprador.nombres, comprador.cedula, denomComp),
    compradorConConyuge && comprador.conyuge?.nombres
      ? sigCell(comprador.conyuge!.nombres, orBlank(comprador.conyuge!.cedula), `CÓNYUGE DE ${denomComp}`)
      : emptyCell(),
  ]

  const sigTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [new TableRow({ children: sigRow1Cells }), new TableRow({ children: sigRow2Cells })],
  })

  const doc = new DocxDocument({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          ...children,
          // @ts-ignore docx Table is also a valid section child
          sigTable,
          blankLine(240),
          centeredSmall(FOOTER_BRAND, 50),
          centeredSmall(FOOTER_DISCLAIMER, 30),
        ],
      },
    ],
  })

  const buffer = await Packer.toBuffer(doc)
  return buffer
}
