import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
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

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 68,
    paddingHorizontal: 44,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    lineHeight: 1.45,
  },
  centeredTitle: {
    textAlign: 'center',
    fontWeight: 700,
    marginBottom: 4,
  },
  paragraph: {
    marginBottom: 7,
    textAlign: 'justify',
  },
  clauseTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 700,
  },
  vehicleItem: {
    marginBottom: 4,
    marginLeft: 12,
  },
  signaturesSection: {
    marginTop: 24,
    gap: 14,
  },
  signaturesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  signatureBlock: {
    width: '48%',
    minHeight: 64,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 28,
    paddingTop: 6,
  },
  signatureName: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 700,
  },
  signatureRole: {
    textAlign: 'center',
    fontSize: 8,
    color: '#475569',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    left: 44,
    right: 44,
    bottom: 18,
    textAlign: 'center',
    fontSize: 7,
    color: '#64748b',
    lineHeight: 1.35,
  },
})

interface ContratoVehicularPdfProps {
  contrato: ContratoVehicular
}

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

function orBlank(value?: string): string {
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

function formatDate() {
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
  ]

  if (sensitivePatterns.some((pattern) => pattern.test(normalized))) {
    return '[REVISIÓN MANUAL REQUERIDA] La observación ingresada contiene un término sensible que debe ser verificado por asesoría legal antes de la firma del contrato.'
  }

  if (/\bchoque\b/.test(normalized)) {
    return 'El vehículo presenta daños por choque, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (/\brayones?\b|\braspones?\b/.test(normalized)) {
    return 'El vehículo presenta rayones o afectaciones estéticas, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (/\bfalla\s+mecanica\b|\bmecanic[oa]\b/.test(normalized)) {
    return 'El vehículo presenta una novedad mecánica, circunstancia conocida y aceptada por la parte compradora.'
  }

  if (/\bfalla\s+electrica\b|\belectric[oa]\b/.test(normalized)) {
    return 'El vehículo presenta una novedad eléctrica, circunstancia conocida y aceptada por la parte compradora.'
  }

  return `Se deja constancia de la siguiente observación sobre el vehículo: ${cleaned}. Esta circunstancia es conocida y aceptada por la parte compradora.`
}

function buildComparecienteText(
  persona: ContratoVehicular['comprador'],
  numero: '1' | '2',
  denominacion: string,
  inclConyuge: boolean,
): string {
  const prefix = numero === '1' ? '1. Por una parte,' : '2. Por otra parte,'
  const g = resolverGenero(persona.sexo)
  const estadoCivilLabel = resolverEstadoCivil(persona.estadoCivil, persona.sexo)
  const textoDoc = buildTextoDocumento(persona.tipoDocumento, persona.cedula)

  let text = `${prefix} ${g.articulo} ${orBlank(persona.nombres).toUpperCase()}, de nacionalidad ${orBlank(persona.nacionalidad)}, ${g.portador} de la ${textoDoc}, de estado civil ${estadoCivilLabel}`

  if (inclConyuge && persona.conyuge?.nombres) {
    const gConyuge = resolverGenero(persona.conyuge.sexo ?? (persona.sexo === 'M' ? 'F' : 'M'))
    const textoDocConyuge = buildTextoDocumento(
      persona.conyuge.tipoDocumento ?? 'cedula',
      persona.conyuge.cedula,
    )

    text += ` con ${gConyuge.articulo} ${orBlank(persona.conyuge.nombres).toUpperCase()}, ${gConyuge.portador} de la ${textoDocConyuge}, quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal`
  } else if (persona.comparecencia === 'apoderado' && persona.apoderado) {
    text += `, debidamente representado por ${orBlank(persona.apoderado.nombres).toUpperCase()}, portador de la cédula No. ${orBlank(persona.apoderado.cedula)}, según poder especial otorgado ante la ${orBlank(persona.apoderado.notariaPoder)} el ${orBlank(persona.apoderado.fechaPoder)}`
  } else {
    text += ', por sus propios y personales derechos'
  }

  const comparecienteFinal = inclConyuge ? 'quienes en adelante se denominarán' : 'quien en adelante se denominará'
  text += `, con domicilio en ${orBlank(persona.direccion)}, ${comparecienteFinal} "${denominacion}"${numero === '1' ? '; y,' : '.'}`

  return text
}

export function ContratoVehicularPdf({ contrato }: ContratoVehicularPdfProps) {
  const { vendedor, comprador, vehiculo } = contrato
  const precio = vehiculo.valorContrato > 0 ? vehiculo.valorContrato : vehiculo.avaluo
  const precioLetras = formatPrecioLetras(precio)
  const precioFormato = precio.toLocaleString('es-EC', { minimumFractionDigits: 2 })
  const fechaTexto = formatDate()

  const vendedorConConyuge = requiresConyuge(vendedor.estadoCivil) && !!vendedor.conyuge?.nombres
  const compradorConConyuge = compradorIncludesConyuge(comprador)

  const gVend = resolverGenero(vendedor.sexo)
  const gComp = resolverGenero(comprador.sexo)
  const denomVend = gVend.denominacionVendedor
  const denomComp = gComp.denominacionComprador

  const vendedorText = buildComparecienteText(vendedor, '1', denomVend, vendedorConConyuge)
  const compradorText = buildComparecienteText(comprador, '2', denomComp, compradorConConyuge)

  const observacionNormalizada = normalizeObservation(contrato.observacionesTexto, contrato.tieneObservaciones)
  const formaPagoTexto = getFormaPagoTexto(contrato.formaPago)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.centeredTitle}>CONTRATO DE COMPRAVENTA DE VEHÍCULO</Text>
        <Text style={[styles.centeredTitle, { marginBottom: 10 }]}>CUANTÍA: USD$ {precioFormato}</Text>

        <Text style={styles.paragraph}>
          En la ciudad de San Francisco de Quito, Distrito Metropolitano, capital de la República del Ecuador, a los {fechaTexto}, comparecen a la celebración del presente contrato de compraventa:
        </Text>
        <Text style={styles.paragraph}>{vendedorText}</Text>
        <Text style={styles.paragraph}>{compradorText}</Text>
        <Text style={styles.paragraph}>
          Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:
        </Text>

        <Text style={styles.clauseTitle}>PRIMERA: ANTECEDENTES.-</Text>
        <Text style={styles.paragraph}>
          1.1.- {denomVend} declara ser {gVend.propietario} del vehículo que se describe en el presente contrato, según consta en los registros y documentos habilitantes de la Agencia Nacional de Tránsito.
        </Text>
        <Text style={styles.paragraph}>
          1.2.- {denomVend} declara que el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, prendas, reserva de dominio, prohibiciones de enajenar, medidas cautelares y demás limitaciones al dominio que afecten su transferencia.
        </Text>
        <Text style={styles.paragraph}>
          1.3.- {denomVend} declara que el vehículo se encuentra con su matrícula en regla, conforme a los registros de la Agencia Nacional de Tránsito del Ecuador.
        </Text>

        <Text style={styles.clauseTitle}>SEGUNDA: OBJETO.-</Text>
        <Text style={styles.paragraph}>
          Por el presente contrato, {denomVend} transfiere en favor de {denomComp}, a título de venta, el dominio, posesión y todos los derechos que le corresponden sobre el siguiente vehículo automotor:
        </Text>
        <Text style={styles.vehicleItem}>PLACA: {orBlank(vehiculo.placa)}</Text>
        <Text style={styles.vehicleItem}>MARCA: {orBlank(vehiculo.marca)}</Text>
        <Text style={styles.vehicleItem}>MODELO: {orBlank(vehiculo.modelo)}</Text>
        <Text style={styles.vehicleItem}>TIPO: {orBlank(vehiculo.tipo)}</Text>
        <Text style={styles.vehicleItem}>AÑO DE MODELO: {numberToWords(vehiculo.anio)} ({vehiculo.anio})</Text>
        <Text style={styles.vehicleItem}>NÚMERO DE MOTOR: {orBlank(vehiculo.motor)}</Text>
        <Text style={styles.vehicleItem}>NÚMERO DE CHASIS/VIN: {orBlank(vehiculo.chasis)}</Text>
        <Text style={styles.vehicleItem}>COLOR: {orBlank(vehiculo.color)}</Text>
        <Text style={styles.vehicleItem}>CILINDRAJE: {numberToWords(vehiculo.cilindraje)} ({vehiculo.cilindraje}) cc</Text>
        <Text style={styles.vehicleItem}>CARROCERÍA: {orBlank(vehiculo.carroceria)}</Text>
        <Text style={styles.vehicleItem}>CLASE: {orBlank(vehiculo.clase)}</Text>
        <Text style={styles.vehicleItem}>PAÍS DE ORIGEN: {orBlank(vehiculo.pais)}</Text>
        <Text style={styles.vehicleItem}>COMBUSTIBLE: {orBlank(vehiculo.combustible)}</Text>
        <Text style={styles.vehicleItem}>NÚMERO DE PASAJEROS: {numberToWords(vehiculo.pasajeros)} ({vehiculo.pasajeros})</Text>
        <Text style={styles.vehicleItem}>SERVICIO: {orBlank(vehiculo.servicio)}</Text>

        <Text style={styles.clauseTitle}>TERCERA: PRECIO Y FORMA DE PAGO.-</Text>
        <Text style={styles.paragraph}>
          3.1.- El precio de la presente compraventa es la suma de {precioLetras}, cantidad que {denomVend} declara haber recibido a su entera satisfacción mediante {formaPagoTexto} realizada por {denomComp}.
        </Text>
        <Text style={styles.paragraph}>
          3.2.- Para fines de respaldo documental, las partes podrán incorporar al presente instrumento la fecha de pago [FECHA], la entidad financiera [COMPLETAR] y el comprobante No. [COMPLETAR].
        </Text>
        <Text style={styles.paragraph}>
          3.3.- Con el pago del precio señalado, {denomVend} se da por {gVend.cancelado} y {gVend.satisfecho} de la obligación contraída por {denomComp}, otorgando el más amplio y eficaz finiquito de pago.
        </Text>

        <Text style={styles.clauseTitle}>CUARTA: TRADICIÓN Y TRANSFERENCIA DE DOMINIO.-</Text>
        <Text style={styles.paragraph}>
          4.1.- Con la suscripción del presente contrato y el pago total del precio convenido, {denomVend} transfiere y hace la tradición del dominio del vehículo a favor de {denomComp}.
        </Text>
        <Text style={styles.paragraph}>
          4.2.- Las partes se obligan a suscribir y gestionar los documentos adicionales que resulten necesarios ante la autoridad de tránsito competente para perfeccionar el traspaso registral.
        </Text>

        <Text style={styles.clauseTitle}>QUINTA: DECLARACIÓN DE GRAVÁMENES Y SANEAMIENTO.-</Text>
        <Text style={styles.paragraph}>
          5.1.- {denomVend} declara expresamente que el vehículo objeto de la presente compraventa se encuentra libre de gravámenes, prendas, reserva de dominio, prohibiciones de enajenar, medidas cautelares y demás limitaciones al dominio que afecten su transferencia.
        </Text>
        <Text style={styles.paragraph}>
          5.2.- {denomVend} garantiza a {denomComp} el saneamiento por evicción del bien vendido, comprometiéndose a responder por cualquier reclamo de terceros sobre la propiedad del vehículo.
        </Text>

        <Text style={styles.clauseTitle}>SEXTA: ENTREGA MATERIAL DEL VEHÍCULO Y DOCUMENTOS.-</Text>
        <Text style={styles.paragraph}>6.1.- La entrega material del vehículo se realizará el [FECHA], en [COMPLETAR].</Text>
        <Text style={styles.paragraph}>6.2.- En el acto de entrega, la parte vendedora hará entrega a la parte compradora de las llaves, matrícula original, Certificado Único Vehicular y demás documentos habilitantes.</Text>

        <Text style={styles.clauseTitle}>SÉPTIMA: RESPONSABILIDAD POSTERIOR A LA ENTREGA.-</Text>
        <Text style={styles.paragraph}>7.1.- Desde la fecha y hora de entrega material del vehículo, {denomComp} asume toda responsabilidad administrativa, civil y de uso del automotor, incluyendo multas, infracciones, tasas, tributos y demás obligaciones posteriores.</Text>
        <Text style={styles.paragraph}>7.2.- Las multas, obligaciones y responsabilidades generadas con anterioridad a la entrega material serán de cargo de {denomVend}, salvo pacto expreso en contrario.</Text>

        <Text style={styles.clauseTitle}>OCTAVA: ESTADO FÍSICO Y MECÁNICO DEL VEHÍCULO.-</Text>
        <Text style={styles.paragraph}>8.1.- {denomComp} declara conocer y aceptar el estado físico y mecánico actual del vehículo, luego de su revisión previa.</Text>
        <Text style={styles.paragraph}>8.2.- {observacionNormalizada}</Text>

        <Text style={styles.clauseTitle}>NOVENA: GASTOS.-</Text>
        <Text style={styles.paragraph}>Todos los gastos que origine la transferencia de dominio del vehículo, tales como derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos por {denomComp}, salvo aquellos que por disposición legal correspondan a {denomVend}.</Text>

        <Text style={styles.clauseTitle}>DÉCIMA: PLAZO PARA REALIZAR LA TRANSFERENCIA DE DOMINIO.-</Text>
        <Text style={styles.paragraph}>Las partes se obligan a realizar el trámite de transferencia de dominio ante la autoridad competente dentro del plazo de [PLAZO] días contados a partir de la fecha de suscripción del presente contrato.</Text>

        <Text style={styles.clauseTitle}>DÉCIMA PRIMERA: JURISDICCIÓN Y COMPETENCIA.-</Text>
        <Text style={styles.paragraph}>Para todos los efectos legales derivados del presente contrato, las partes se someten a los jueces competentes de la ciudad de Quito, renunciando expresamente al fuero especial que pudieren tener.</Text>

        <Text style={styles.clauseTitle}>DÉCIMA SEGUNDA: ACEPTACIÓN Y RATIFICACIÓN.-</Text>
        <Text style={styles.paragraph}>Las partes aceptan íntegramente las cláusulas del presente contrato, declarando que han sido redactadas de común acuerdo y que las mismas son expresión fiel de su voluntad. El presente contrato se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada una de las partes.</Text>

        <Text style={styles.clauseTitle}>DÉCIMA TERCERA: CUANTÍA.-</Text>
        <Text style={styles.paragraph}>La cuantía de la presente compraventa asciende a la suma de {precioLetras}.</Text>

        <Text style={styles.paragraph}>En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.</Text>

        <View style={styles.signaturesSection}>
          <View style={styles.signaturesRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{orBlank(vendedor.nombres).toUpperCase()}</Text>
                <Text style={styles.signatureRole}>C.I. {orBlank(vendedor.cedula)}</Text>
                <Text style={styles.signatureRole}>{denomVend}</Text>
              </View>
            </View>
            {vendedorConConyuge ? (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureName}>{orBlank(vendedor.conyuge?.nombres).toUpperCase()}</Text>
                  <Text style={styles.signatureRole}>C.I. {orBlank(vendedor.conyuge?.cedula)}</Text>
                  <Text style={styles.signatureRole}>CÓNYUGE DE {denomVend}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.signatureBlock} />
            )}
          </View>

          <View style={styles.signaturesRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{orBlank(comprador.nombres).toUpperCase()}</Text>
                <Text style={styles.signatureRole}>C.I. {orBlank(comprador.cedula)}</Text>
                <Text style={styles.signatureRole}>{denomComp}</Text>
              </View>
            </View>
            {compradorConConyuge ? (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureName}>{orBlank(comprador.conyuge?.nombres).toUpperCase()}</Text>
                  <Text style={styles.signatureRole}>C.I. {orBlank(comprador.conyuge?.cedula)}</Text>
                  <Text style={styles.signatureRole}>CÓNYUGE DE {denomComp}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.signatureBlock} />
            )}
          </View>
        </View>

        <Text style={styles.footer}>{FOOTER_BRAND}{'\n'}{FOOTER_DISCLAIMER}</Text>
      </Page>
    </Document>
  )
}
