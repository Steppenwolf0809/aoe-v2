import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ContratoVehicular } from '@/lib/validations/contract'
import { requiresConyuge } from '@/lib/validations/contract'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#1e40af',
    paddingBottom: 15,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  cuantia: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  copias: {
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 20,
    color: '#64748b',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  bold: {
    fontWeight: 'bold',
  },
  clauseTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
    marginTop: 15,
    marginBottom: 8,
  },
  subClause: {
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 1.6,
  },
  vehicleData: {
    marginLeft: 20,
    marginBottom: 3,
  },
  signatures: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    width: '45%',
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: 1,
    borderTopColor: '#1e293b',
    paddingTop: 8,
    marginTop: 50,
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
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 7,
    color: '#94a3b8',
    textAlign: 'center',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
})

interface ContratoVehicularPdfProps {
  contrato: ContratoVehicular
}

function formatDate(): { ciudad: string; dia: string; mes: string; anio: string } {
  const now = new Date()
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  return {
    ciudad: 'San Francisco de Quito',
    dia: now.getDate().toString(),
    mes: meses[now.getMonth()],
    anio: now.getFullYear().toString(),
  }
}

const ESTADO_CIVIL_PDF: Record<string, string> = {
  soltero: 'soltero/a',
  casado: 'casado/a',
  divorciado: 'divorciado/a',
  viudo: 'viudo/a',
  union_de_hecho: 'en union de hecho',
}

/**
 * Build compareciente paragraph as a plain string.
 * Using string building avoids @react-pdf/renderer issues with
 * conditional JSX inside <Text> elements.
 */
function buildComparecienteText(
  persona: ContratoVehicular['comprador'],
  numero: string,
  rol: string,
  separator: string,
): string {
  const ecLabel = ESTADO_CIVIL_PDF[persona.estadoCivil] || persona.estadoCivil

  let text = `${numero}. ${persona.nombres}, portador/a de cedula ${persona.cedula}, de estado civil ${ecLabel}`

  // Conyuge block
  if (requiresConyuge(persona.estadoCivil) && persona.conyuge) {
    text += `, casado/a con ${persona.conyuge.nombres}, portador/a de cedula ${persona.conyuge.cedula}, quienes comparecen por sus propios y personales derechos, asi como por los que representan dentro de la sociedad conyugal`
  }

  // Apoderado block
  if (persona.comparecencia === 'apoderado' && persona.apoderado) {
    text += `, debidamente representado/a por ${persona.apoderado.nombres}, portador/a de cedula ${persona.apoderado.cedula}, segun poder especial otorgado ante la ${persona.apoderado.notariaPoder} el ${persona.apoderado.fechaPoder}`
  }

  text += `, domiciliado/a en ${persona.direccion}`

  // Only add "por sus propios derechos" if NOT through apoderado and NOT already said via conyuge
  if (persona.comparecencia !== 'apoderado' && !requiresConyuge(persona.estadoCivil)) {
    text += `, por sus propios y personales derechos`
  }

  text += `, quien en adelante se denominara "${rol}"${separator}`

  return text
}

export function ContratoVehicularPdf({ contrato }: ContratoVehicularPdfProps) {
  const fecha = formatDate()
  const { vendedor, comprador, vehiculo } = contrato
  const precio =
    typeof vehiculo.valorContrato === 'number' && vehiculo.valorContrato > 0
      ? vehiculo.valorContrato
      : vehiculo.avaluo

  const vendedorText = buildComparecienteText(vendedor, '1', 'EL VENDEDOR', '; y,')
  const compradorText = buildComparecienteText(comprador, '2', 'EL COMPRADOR', '.')

  // Determine which conyuge signatures are needed
  const vendedorConyuge = requiresConyuge(vendedor.estadoCivil) && vendedor.conyuge
  const compradorConyuge = requiresConyuge(comprador.estadoCivil) && comprador.conyuge

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.notariaTitle}>ABOGADOS ONLINE ECUADOR</Text>
          <Text style={styles.notariaSubtitle}>Servicio legal digital independiente</Text>
          <Text style={styles.notariaSubtitle}>Quito, Ecuador</Text>
        </View>

        <Text style={styles.contractTitle}>CONTRATO DE COMPRAVENTA DE VEHICULO</Text>
        <Text style={styles.cuantia}>CUANTIA: USD$ {precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        <Text style={styles.copias}>COPIAS: DOS</Text>

        <Text style={styles.paragraph}>
          En la ciudad de {fecha.ciudad}, a los {fecha.dia} dias del mes de {fecha.mes} del ano {fecha.anio}, comparecen a la celebracion del presente contrato de compraventa:
        </Text>

        <Text style={styles.paragraph}>{vendedorText}</Text>
        <Text style={styles.paragraph}>{compradorText}</Text>

        <Text style={styles.paragraph}>
          Los comparecientes, mayores de edad, habiles y capaces para contratar y obligarse, libre y voluntariamente convienen en celebrar el presente contrato de compraventa de vehiculo automotor:
        </Text>

        <Text style={styles.clauseTitle}>PRIMERA: ANTECEDENTES.-</Text>
        <Text style={styles.subClause}>
          EL VENDEDOR declara ser propietario del vehiculo descrito en este contrato y estar libre de gravamenes.
        </Text>

        <Text style={styles.clauseTitle}>SEGUNDA: OBJETO.-</Text>
        <Text style={styles.paragraph}>
          EL VENDEDOR transfiere a EL COMPRADOR el dominio del siguiente vehiculo:
        </Text>
        <Text style={styles.vehicleData}>• PLACA: {vehiculo.placa}</Text>
        <Text style={styles.vehicleData}>• MARCA: {vehiculo.marca}</Text>
        <Text style={styles.vehicleData}>• MODELO: {vehiculo.modelo}</Text>
        <Text style={styles.vehicleData}>• ANO: {vehiculo.anio}</Text>
        <Text style={styles.vehicleData}>• COLOR: {vehiculo.color}</Text>
        <Text style={styles.vehicleData}>• MOTOR: {vehiculo.motor}</Text>
        <Text style={styles.vehicleData}>• CHASIS: {vehiculo.chasis}</Text>

        <Text style={styles.clauseTitle}>TERCERA: PRECIO.-</Text>
        <Text style={styles.subClause}>
          El precio es USD$ {precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}, que EL VENDEDOR declara haber recibido.
        </Text>

        <Text style={styles.clauseTitle}>CUARTA: GASTOS.-</Text>
        <Text style={styles.paragraph}>
          Los gastos de transferencia seran cubiertos por EL COMPRADOR.
        </Text>

        <Text style={styles.clauseTitle}>QUINTA: ACEPTACION.-</Text>
        <Text style={styles.paragraph}>
          Las partes aceptan el contenido del presente contrato.
        </Text>

        {/* Main signatures: vendedor + comprador */}
        <View style={styles.signatures}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{vendedor.nombres}</Text>
              <Text style={styles.signatureRole}>C.I. {vendedor.cedula}</Text>
              <Text style={styles.signatureRole}>VENDEDOR</Text>
            </View>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>{comprador.nombres}</Text>
              <Text style={styles.signatureRole}>C.I. {comprador.cedula}</Text>
              <Text style={styles.signatureRole}>COMPRADOR</Text>
            </View>
          </View>
        </View>

        {/* Conyuge signatures (if applicable) */}
        {(vendedorConyuge || compradorConyuge) && (
          <View style={styles.signatures}>
            {vendedorConyuge && (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureName}>{vendedor.conyuge!.nombres}</Text>
                  <Text style={styles.signatureRole}>C.I. {vendedor.conyuge!.cedula}</Text>
                  <Text style={styles.signatureRole}>CONYUGE DEL VENDEDOR</Text>
                </View>
              </View>
            )}
            {compradorConyuge && (
              <View style={styles.signatureBlock}>
                <View style={styles.signatureLine}>
                  <Text style={styles.signatureName}>{comprador.conyuge!.nombres}</Text>
                  <Text style={styles.signatureRole}>C.I. {comprador.conyuge!.cedula}</Text>
                  <Text style={styles.signatureRole}>CONYUGE DEL COMPRADOR</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={styles.footer}>
          Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com
        </Text>
      </Page>
    </Document>
  )
}
