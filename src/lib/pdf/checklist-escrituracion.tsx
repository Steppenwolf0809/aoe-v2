import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const SECTIONS = [
  {
    title: 'Requisitos Basicos',
    items: [
      'Pago del impuesto predial del ano en curso y del ano anterior.',
      'Certificado de gravamenes actualizado y vigente.',
      'Ficha catastral.',
      'Original y copia a color de cedula y certificado de votacion de los comparecientes (vendedor y comprador).',
      'Minuta elaborada y suscrita por abogado/a.',
    ],
  },
  {
    title: 'Secuencia Municipal (Transferencia de Dominio)',
    items: [
      'Liquidacion de impuestos de transferencia de dominio.',
      'Pago de impuestos: alcabala, plusvalia y consejo provincial (segun corresponda).',
      'Hoja de rentas emitida por el Municipio luego del pago (normalmente la gestiona la notaria).',
    ],
  },
  {
    title: 'Plazos Estimados',
    items: [
      'Recopilacion de documentos: 7 a 15 dias habiles.',
      'Liquidacion y pago municipal: 1 a 2 dias habiles.',
      'Firma de escritura ante notario: 1 dia (con cita previa).',
      'Inscripcion en Registro de la Propiedad: 3 a 5 dias habiles.',
    ],
  },
] as const;

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingRight: 32,
    paddingBottom: 74,
    paddingLeft: 32,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 18,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 4,
  },
  updatedAt: {
    fontSize: 8,
    color: '#64748b',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 7,
    backgroundColor: '#eff6ff',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 6,
  },
  checkbox: {
    width: 10,
    height: 10,
    border: 1,
    borderColor: '#94a3b8',
    marginRight: 8,
    marginTop: 1,
  },
  itemText: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
  },
  note: {
    backgroundColor: '#fef3c7',
    padding: 8,
    marginTop: 6,
    borderLeft: 3,
    borderLeftColor: '#f59e0b',
  },
  noteText: {
    fontSize: 8.5,
    color: '#92400e',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 32,
    right: 32,
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8.5,
    color: '#64748b',
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: 8,
    color: '#2563eb',
    textAlign: 'center',
    marginTop: 3,
  },
});

export const ChecklistEscrituracion = () => {
  const updatedDate = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Checklist de Escrituracion de Inmueble</Text>
          <Text style={styles.subtitle}>
            Documentos necesarios para escriturar tu propiedad en Ecuador
          </Text>
          <Text style={styles.updatedAt}>Actualizado: {updatedDate}</Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <View key={item} style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.note}>
          <Text style={styles.noteText}>
            Importante: La hoja de rentas no es un requisito previo al
            pago. Se obtiene despues de liquidar y pagar los impuestos de
            transferencia de dominio en el Municipio, segun el procedimiento
            aplicable en cada canton.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Abogados Online Ecuador | Notaria 18 de Quito
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
