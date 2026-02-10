import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ContratoVehicular } from '@/lib/validations/contract'

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

export function ContratoVehicularPdf({ contrato }: ContratoVehicularPdfProps) {
  const fecha = formatDate()
  const { vendedor, comprador, vehiculo } = contrato
  const precio = vehiculo.avaluo

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.notariaTitle}>ABOGADOS ONLINE ECUADOR</Text>
          <Text style={styles.notariaSubtitle}>Servicio legal digital independiente</Text>
          <Text style={styles.notariaSubtitle}>Quito, Ecuador</Text>
        </View>

        <Text style={styles.contractTitle}>CONTRATO DE COMPRAVENTA DE VEHÍCULO</Text>
        <Text style={styles.cuantia}>CUANTÍA: USD$ {precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
        <Text style={styles.copias}>COPIAS: DOS</Text>

        <Text style={styles.paragraph}>
          En la ciudad de {fecha.ciudad}, a los {fecha.dia} días del mes de {fecha.mes} del año {fecha.anio}, comparecen:
        </Text>

        <Text style={styles.paragraph}>
          1. <Text style={styles.bold}>{vendedor.nombres}</Text>, portador de cédula {vendedor.cedula}, domiciliado en {vendedor.direccion}, quien en adelante se denominará <Text style={styles.bold}>"EL VENDEDOR"</Text>; y,
        </Text>

        <Text style={styles.paragraph}>
          2. <Text style={styles.bold}>{comprador.nombres}</Text>, portador de cédula {comprador.cedula}, domiciliado en {comprador.direccion}, quien en adelante se denominará <Text style={styles.bold}>"EL COMPRADOR"</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Los comparecientes, mayores de edad y capaces para contratar, convienen en celebrar el presente contrato de compraventa vehicular:
        </Text>

        <Text style={styles.clauseTitle}>PRIMERA: ANTECEDENTES.-</Text>
        <Text style={styles.subClause}>
          EL VENDEDOR declara ser propietario del vehículo descrito en este contrato y estar libre de gravámenes.
        </Text>

        <Text style={styles.clauseTitle}>SEGUNDA: OBJETO.-</Text>
        <Text style={styles.paragraph}>
          EL VENDEDOR transfiere a EL COMPRADOR el dominio del siguiente vehículo:
        </Text>
        <Text style={styles.vehicleData}>• PLACA: {vehiculo.placa}</Text>
        <Text style={styles.vehicleData}>• MARCA: {vehiculo.marca}</Text>
        <Text style={styles.vehicleData}>• MODELO: {vehiculo.modelo}</Text>
        <Text style={styles.vehicleData}>• AÑO: {vehiculo.anio}</Text>
        <Text style={styles.vehicleData}>• COLOR: {vehiculo.color}</Text>
        <Text style={styles.vehicleData}>• MOTOR: {vehiculo.motor}</Text>
        <Text style={styles.vehicleData}>• CHASIS: {vehiculo.chasis}</Text>

        <Text style={styles.clauseTitle}>TERCERA: PRECIO.-</Text>
        <Text style={styles.subClause}>
          El precio es USD$ {precio.toLocaleString('en-US', { minimumFractionDigits: 2 })}, que EL VENDEDOR declara haber recibido.
        </Text>

        <Text style={styles.clauseTitle}>CUARTA: GASTOS.-</Text>
        <Text style={styles.paragraph}>
          Los gastos de transferencia serán cubiertos por EL COMPRADOR.
        </Text>

        <Text style={styles.clauseTitle}>QUINTA: ACEPTACIÓN.-</Text>
        <Text style={styles.paragraph}>
          Las partes aceptan el contenido del presente contrato.
        </Text>

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

        <Text style={styles.footer}>
          Documento generado por Abogados Online Ecuador • www.abogadosonlineecuador.com
        </Text>
      </Page>
    </Document>
  )
}
