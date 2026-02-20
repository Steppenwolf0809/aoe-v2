import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { requiresConyuge, compradorIncludesConyuge } from '@/lib/validations/contract'

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 18,
    borderBottom: 2,
    borderBottomColor: '#1e40af',
    paddingBottom: 14,
  },
  notariaTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 3,
  },
  notariaSubtitle: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 2,
  },
  contractTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 18,
    marginBottom: 6,
    textAlign: 'center',
  },
  cuantia: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  copias: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 16,
    color: '#64748b',
  },
  paragraph: {
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  clauseTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 12,
    marginBottom: 6,
  },
  subClause: {
    marginBottom: 6,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  signatures: {
    marginTop: 36,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  signatureBlock: {
    width: '42%',
    textAlign: 'center',
    marginBottom: 12,
  },
  signatureLine: {
    borderTop: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
    marginTop: 48,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  signatureRole: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 50,
    right: 50,
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
})

interface ContratoVehicularPdfProps {
  contrato: ContratoVehicular
}

// --- Date helpers ---

const DIAS_LETRAS: Record<number, string> = {
  1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco',
  6: 'seis', 7: 'siete', 8: 'ocho', 9: 'nueve', 10: 'diez',
  11: 'once', 12: 'doce', 13: 'trece', 14: 'catorce', 15: 'quince',
  16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho', 19: 'diecinueve',
  20: 'veinte', 21: 'veintiuno', 22: 'veintidós', 23: 'veintitrés',
  24: 'veinticuatro', 25: 'veinticinco', 26: 'veintiséis', 27: 'veintisiete',
  28: 'veintiocho', 29: 'veintinueve', 30: 'treinta', 31: 'treinta y uno',
}

const ANIOS_LETRAS: Record<number, string> = {
  2024: 'dos mil veinticuatro',
  2025: 'dos mil veinticinco',
  2026: 'dos mil veintiséis',
  2027: 'dos mil veintisiete',
  2028: 'dos mil veintiocho',
}

const MESES: string[] = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function formatDate() {
  const now = new Date()
  const dia = now.getDate()
  const mes = MESES[now.getMonth()]
  const anio = now.getFullYear()
  const diaLetras = DIAS_LETRAS[dia] ?? dia.toString()
  const anioLetras = ANIOS_LETRAS[anio] ?? anio.toString()
  return {
    ciudad: 'San Francisco de Quito, Distrito Metropolitano, capital de la República del Ecuador',
    texto: `${diaLetras} (${dia}) días del mes de ${mes} del año ${anioLetras} (${anio})`,
  }
}

// --- Price in words ---

function formatPrecioLetras(valor: number): string {
  // Simple implementation for common values; returns formatted string
  const entero = Math.floor(valor)
  const centavos = Math.round((valor - entero) * 100)

  const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
    'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
  const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa']
  const centenas = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
    'seiscientos', 'setecientos', 'ochocientos', 'novecientos']

  function tresDigitos(n: number): string {
    if (n === 0) return ''
    if (n === 100) return 'cien'
    const c = Math.floor(n / 100)
    const resto = n % 100
    const cStr = c > 0 ? (c === 1 && resto > 0 ? 'ciento' : centenas[c]) : ''
    if (resto === 0) return cStr
    if (resto < 20) return [cStr, unidades[resto]].filter(Boolean).join(' ')
    const d = Math.floor(resto / 10)
    const u = resto % 10
    const dStr = decenas[d]
    const uStr = u > 0 ? `y ${unidades[u]}` : ''
    return [cStr, dStr, uStr].filter(Boolean).join(' ')
  }

  let texto = ''
  if (entero >= 1000) {
    const miles = Math.floor(entero / 1000)
    const restoMiles = entero % 1000
    texto = miles === 1 ? 'mil' : `${tresDigitos(miles)} mil`
    if (restoMiles > 0) texto += ` ${tresDigitos(restoMiles)}`
  } else {
    texto = tresDigitos(entero)
  }

  const centStr = centavos > 0 ? ` con ${centavos}/100` : ''
  return `${texto.toUpperCase()}${centStr} DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA (USD$ ${valor.toLocaleString('es-EC', { minimumFractionDigits: 2 })})`
}

// --- Blank placeholder for missing optional fields ---
const BLANK = '_______________'

// --- Build compareciente text ---

function buildComparecienteText(
  persona: ContratoVehicular['comprador'],
  numero: string,
  rol: string,
  separator: string,
  incluirConyuge?: boolean,
): string {
  const nombres = persona.nombres.toUpperCase()
  const estadoCivilLabel = (() => {
    switch (persona.estadoCivil) {
      case 'soltero': return 'soltero'
      case 'casado': return 'casado'
      case 'divorciado': return 'divorciado'
      case 'viudo': return 'viudo'
      case 'union_de_hecho': return 'en unión de hecho'
      default: return persona.estadoCivil
    }
  })()

  let text = `${numero}. Por una parte, el señor ${nombres}, de nacionalidad ecuatoriana, portador de la cédula de ciudadanía No. ${persona.cedula}, de estado civil ${estadoCivilLabel}`

  // Conyuge block
  const showConyuge = (requiresConyuge(persona.estadoCivil) && (incluirConyuge !== false)) ||
    (rol === 'EL VENDEDOR' && requiresConyuge(persona.estadoCivil))

  if (showConyuge && persona.conyuge?.nombres) {
    const conyugeNombre = persona.conyuge.nombres.toUpperCase()
    const conyugeCedula = persona.conyuge.cedula || BLANK
    text += `, casado con la señora ${conyugeNombre}, portadora de la cédula de ciudadanía No. ${conyugeCedula}, quienes comparecen por sus propios y personales derechos, así como por los que representan dentro de la sociedad conyugal`
  }

  // Apoderado block
  if (persona.comparecencia === 'apoderado' && persona.apoderado) {
    const apNombre = persona.apoderado.nombres.toUpperCase()
    text += `, debidamente representado por ${apNombre}, portador de la cédula de ciudadanía No. ${persona.apoderado.cedula}, según poder especial otorgado ante la ${persona.apoderado.notariaPoder} el ${persona.apoderado.fechaPoder}`
  }

  text += `, domiciliado en ${persona.direccion || BLANK}`

  if (persona.comparecencia !== 'apoderado' && !showConyuge) {
    text += `, por sus propios y personales derechos`
  }

  text += `, quien en adelante se denominará "${rol}"${separator}`

  return text
}

export function ContratoVehicularPdf({ contrato }: ContratoVehicularPdfProps) {
  const fecha = formatDate()
  const { vendedor, comprador, vehiculo } = contrato
  const precio =
    typeof vehiculo.valorContrato === 'number' && vehiculo.valorContrato > 0
      ? vehiculo.valorContrato
      : vehiculo.avaluo

  const precioLetras = formatPrecioLetras(precio)
  const precioFormato = precio.toLocaleString('es-EC', { minimumFractionDigits: 2 })

  const compradorConConyuge = compradorIncludesConyuge(comprador)

  const vendedorText = buildComparecienteText(vendedor, '1', 'EL VENDEDOR', '; y,')
  const compradorText = buildComparecienteText(comprador, '2', 'EL COMPRADOR', '.', compradorConConyuge)

  // Signatures setup
  const vendedorConyuge = requiresConyuge(vendedor.estadoCivil) && vendedor.conyuge
  const compradorConyuge = compradorConConyuge && comprador.conyuge

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.notariaTitle}>ABOGADOS ONLINE ECUADOR</Text>
          <Text style={styles.notariaSubtitle}>Servicio legal digital independiente</Text>
          <Text style={styles.notariaSubtitle}>Quito, Ecuador</Text>
        </View>

        <Text style={styles.contractTitle}>CONTRATO DE COMPRAVENTA DE VEHÍCULO</Text>
        <Text style={styles.cuantia}>CUANTÍA: USD$ {precioFormato}</Text>
        <Text style={styles.copias}>COPIAS: DOS</Text>

        {/* Intro */}
        <Text style={styles.paragraph}>
          En la ciudad de {fecha.ciudad}, a los {fecha.texto}, comparecen a la celebración del presente contrato de compraventa:
        </Text>

        <Text style={styles.paragraph}>{vendedorText}</Text>
        <Text style={styles.paragraph}>{compradorText}</Text>

        <Text style={styles.paragraph}>
          Los comparecientes, mayores de edad, hábiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehículo automotor al tenor de las siguientes cláusulas:
        </Text>

        {/* PRIMERA */}
        <Text style={styles.clauseTitle}>PRIMERA: ANTECEDENTES.-</Text>
        <Text style={styles.subClause}>
          {`1.1.- ${vendedor.nombres.toUpperCase()} declara ser legítimo propietario del vehículo que se describe en el presente contrato, según consta en el Certificado Único Vehicular emitido por la Agencia Nacional de Tránsito, el mismo que se encuentra libre de gravámenes, embargos y prohibiciones de enajenar.`}
        </Text>
        <Text style={styles.subClause}>
          {`1.2.- El referido vehículo se encuentra con su matrícula en regla, conforme los registros de la Agencia Nacional de Tránsito del Ecuador.`}
        </Text>

        {/* SEGUNDA */}
        <Text style={styles.clauseTitle}>SEGUNDA: OBJETO.-</Text>
        <Text style={styles.subClause}>
          {`Por el presente contrato, EL VENDEDOR transfiere en favor de EL COMPRADOR, a título de venta, el dominio, posesión y todos los derechos que le corresponden sobre el siguiente vehículo automotor:`}
        </Text>
        <Text style={styles.subClause}>{`PLACA: ${vehiculo.placa}   |   MARCA: ${vehiculo.marca}   |   MODELO: ${vehiculo.modelo}`}</Text>
        <Text style={styles.subClause}>{`AÑO: ${vehiculo.anio}   |   COLOR: ${vehiculo.color}   |   SERVICIO: USO PARTICULAR`}</Text>
        <Text style={styles.subClause}>{`NÚMERO DE MOTOR: ${vehiculo.motor}   |   NÚMERO DE CHASIS/VIN: ${vehiculo.chasis}`}</Text>

        {/* TERCERA */}
        <Text style={styles.clauseTitle}>TERCERA: PRECIO Y FORMA DE PAGO.-</Text>
        <Text style={styles.subClause}>
          {`3.1.- El precio de la presente compraventa es la suma de ${precioLetras}, valor que EL VENDEDOR declara haber recibido a su entera satisfacción por parte de EL COMPRADOR, otorgando el más completo y eficaz finiquito de pago.`}
        </Text>
        <Text style={styles.subClause}>
          {`3.2.- Con la recepción del precio señalado, EL VENDEDOR se da por satisfecho y cancela toda obligación derivada de la presente compraventa.`}
        </Text>

        {/* CUARTA */}
        <Text style={styles.clauseTitle}>CUARTA: ESTADO DEL VEHÍCULO Y GARANTÍAS.-</Text>
        <Text style={styles.subClause}>
          {`4.1.- EL VENDEDOR declara expresamente que el vehículo se encuentra libre de todo gravamen, hipoteca, prenda, embargo, prohibición de enajenar o cualquier otra limitación de dominio vigente.`}
        </Text>
        <Text style={styles.subClause}>
          {`4.2.- EL VENDEDOR garantiza el saneamiento por evicción del bien vendido, comprometiéndose a responder ante EL COMPRADOR por cualquier reclamo de terceros sobre la propiedad o dominio del vehículo.`}
        </Text>
        <Text style={styles.subClause}>
          {`4.3.- EL COMPRADOR declara conocer el estado físico y mecánico del vehículo y manifiesta su total conformidad, renunciando expresamente a todo reclamo por vicios redhibitorios o defectos ocultos.`}
        </Text>

        {/* QUINTA */}
        <Text style={styles.clauseTitle}>QUINTA: GASTOS.-</Text>
        <Text style={styles.paragraph}>
          {`Todos los gastos que origine la transferencia de dominio del vehículo, incluyendo derechos de matrícula, especies valoradas, impuestos y demás tributos establecidos por la ley, serán cubiertos en su totalidad por EL COMPRADOR.`}
        </Text>

        {/* SEXTA */}
        <Text style={styles.clauseTitle}>SEXTA: JURISDICCIÓN Y COMPETENCIA.-</Text>
        <Text style={styles.paragraph}>
          {`Para todos los efectos legales derivados del presente contrato, las partes se someten expresamente a los jueces competentes de la ciudad de Quito, renunciando a fuero especial que pudieren tener o corresponderles.`}
        </Text>

        {/* SÉPTIMA */}
        <Text style={styles.clauseTitle}>SÉPTIMA: ACEPTACIÓN.-</Text>
        <Text style={styles.paragraph}>
          {`Las partes libre y voluntariamente aceptan íntegramente el contenido del presente contrato, declarando que sus cláusulas han sido redactadas de común acuerdo y son expresión fiel de su voluntad. El presente instrumento se extiende en dos (2) ejemplares de igual tenor y valor, uno para cada parte.`}
        </Text>

        {/* OCTAVA */}
        <Text style={styles.clauseTitle}>OCTAVA: CUANTÍA.-</Text>
        <Text style={styles.paragraph}>
          {`La cuantía de la presente compraventa asciende a la suma de ${precioLetras}.`}
        </Text>

        <Text style={styles.paragraph}>
          {`En fe de lo cual, firman las partes en el lugar y fecha indicados en el encabezamiento del presente contrato.`}
        </Text>

        {/* SIGNATURES ROW 1: Vendedor + Cónyuge Vendedor */}
        <View style={styles.signatures}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{vendedor.nombres.toUpperCase()}</Text>
              <Text style={styles.signatureRole}>C.I. {vendedor.cedula}</Text>
              <Text style={styles.signatureRole}>EL VENDEDOR</Text>
            </View>
          </View>

          {vendedorConyuge && (
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{vendedor.conyuge!.nombres.toUpperCase()}</Text>
                <Text style={styles.signatureRole}>C.I. {vendedor.conyuge!.cedula}</Text>
                <Text style={styles.signatureRole}>CÓNYUGE DEL VENDEDOR</Text>
              </View>
            </View>
          )}
        </View>

        {/* SIGNATURES ROW 2: Comprador + Cónyuge Comprador */}
        <View style={styles.signatures}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{comprador.nombres.toUpperCase()}</Text>
              <Text style={styles.signatureRole}>C.I. {comprador.cedula}</Text>
              <Text style={styles.signatureRole}>EL COMPRADOR</Text>
            </View>
          </View>

          {compradorConyuge && (
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureName}>{comprador.conyuge!.nombres.toUpperCase()}</Text>
                <Text style={styles.signatureRole}>C.I. {comprador.conyuge!.cedula}</Text>
                <Text style={styles.signatureRole}>CÓNYUGE DEL COMPRADOR</Text>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com
        </Text>
      </Page>
    </Document>
  )
}
