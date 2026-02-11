import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 15,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metadataItem: {
    fontSize: 9,
    color: '#64748b',
  },
  metadataLabel: {
    fontWeight: 'bold',
    color: '#475569',
  },
  clientInfo: {
    backgroundColor: '#f8fafc',
    padding: 15,
    marginBottom: 20,
    borderRadius: 4,
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  clientDetail: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
  },
  tableColConcept: {
    flex: 2,
    fontSize: 10,
    color: '#334155',
  },
  tableColAmount: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
    textAlign: 'right',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtotalRow: {
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
  },
  subtotalText: {
    fontWeight: 'bold',
    color: '#475569',
  },
  totalRow: {
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    marginTop: 5,
  },
  totalText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  percentageBox: {
    backgroundColor: '#dbeafe',
    padding: 10,
    marginTop: 10,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 10,
    color: '#1e40af',
    textAlign: 'center',
  },
  notes: {
    backgroundColor: '#fef3c7',
    padding: 12,
    marginTop: 20,
    borderLeft: 3,
    borderLeftColor: '#f59e0b',
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  disclaimer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    marginTop: 15,
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 9,
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 3,
  },
  ctaBox: {
    backgroundColor: '#2563eb',
    padding: 12,
    marginTop: 20,
    borderRadius: 4,
  },
  ctaText: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

interface PresupuestoData {
  clientName: string;
  clientEmail: string;
  fecha: string;
  rol: 'comprador' | 'vendedor';
  valorInmueble: number;
  avaluoCatastral?: number;
  desglose: {
    notarial: number;
    alcabalas: number;
    utilidad: number;
    registro: number;
    consejoProvincial: number;
  };
  total: number;
}

export const PresupuestoDetallado = ({ data }: { data: PresupuestoData }) => {
  const porcentajeDelInmueble = (
    (data.total / data.valorInmueble) *
    100
  ).toFixed(2);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>Abogados Online Ecuador</Text>
          <Text style={styles.title}>Presupuesto de Escrituración</Text>
          <View style={styles.metadata}>
            <Text style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Fecha: </Text>
              {data.fecha}
            </Text>
            <Text style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Rol: </Text>
              {data.rol === 'comprador' ? 'Comprador' : 'Vendedor'}
            </Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <Text style={styles.clientTitle}>Información del Cliente</Text>
          <Text style={styles.clientDetail}>
            <Text style={styles.metadataLabel}>Nombre: </Text>
            {data.clientName}
          </Text>
          <Text style={styles.clientDetail}>
            <Text style={styles.metadataLabel}>Email: </Text>
            {data.clientEmail}
          </Text>
          <Text style={styles.clientDetail}>
            <Text style={styles.metadataLabel}>Valor del inmueble: </Text>
            {formatCurrency(data.valorInmueble)}
          </Text>
          {data.avaluoCatastral && (
            <Text style={styles.clientDetail}>
              <Text style={styles.metadataLabel}>Avalúo catastral: </Text>
              {formatCurrency(data.avaluoCatastral)}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desglose de Gastos</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableColConcept, styles.tableHeaderText]}>
                Concepto
              </Text>
              <Text style={[styles.tableColAmount, styles.tableHeaderText]}>
                Monto
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColConcept}>
                Honorarios Notariales
              </Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(data.desglose.notarial)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColConcept}>
                Impuesto de Alcabalas (Municipal)
              </Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(data.desglose.alcabalas)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColConcept}>Impuesto de Utilidad</Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(data.desglose.utilidad)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColConcept}>
                Registro de la Propiedad
              </Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(data.desglose.registro)}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableColConcept}>
                Consejo Provincial (10% Alcabalas)
              </Text>
              <Text style={styles.tableColAmount}>
                {formatCurrency(data.desglose.consejoProvincial)}
              </Text>
            </View>

            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={[styles.tableColConcept, styles.totalText]}>
                TOTAL A PAGAR
              </Text>
              <Text style={[styles.tableColAmount, styles.totalAmount]}>
                {formatCurrency(data.total)}
              </Text>
            </View>
          </View>

          <View style={styles.percentageBox}>
            <Text style={styles.percentageText}>
              Este presupuesto representa el {porcentajeDelInmueble}% del valor
              del inmueble
            </Text>
          </View>
        </View>

        <View style={styles.notes}>
          <Text style={styles.notesTitle}>Notas Importantes:</Text>
          <Text style={styles.notesText}>
            - Este presupuesto es referencial y está basado en valores vigentes
            para Quito.
          </Text>
          <Text style={styles.notesText}>
            - Los valores finales pueden variar según el avalúo catastral
            actualizado y descuentos aplicables.
          </Text>
          <Text style={styles.notesText}>
            - Si el vendedor compró el inmueble hace menos de 20 años, podría
            pagar impuesto a la plusvalía (no incluido aquí).
          </Text>
          <Text style={styles.notesText}>
            - Plazos estimados: 15 a 25 días hábiles para completar el proceso.
          </Text>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaText}>
            Listo para escriturar? Agenda tu cita en
            abogadosonlineecuador.com
          </Text>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            DISCLAIMER: Los valores indicados son estimaciones basadas en las
            tarifas vigentes del Consejo de la Judicatura, municipios de la
            zona metropolitana de Quito y Registro de la Propiedad. Los montos
            finales pueden variar según el caso particular. Este documento no
            constituye una cotización formal vinculante. Para un presupuesto
            exacto, se requiere revisión de documentación completa.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Abogados Online Ecuador | Servicio legal digital independiente
          </Text>
          <Text style={styles.contactInfo}>
            WhatsApp: +593 97 931 7579 | info@abogadosonlineecuador.com |
            abogadosonlineecuador.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
