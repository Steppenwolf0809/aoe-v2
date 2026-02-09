import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
    width: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
    backgroundColor: '#eff6ff',
    padding: 8,
    borderRadius: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 10,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: 1,
    borderColor: '#94a3b8',
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
  },
  note: {
    backgroundColor: '#fef3c7',
    padding: 10,
    marginTop: 15,
    borderLeft: 3,
    borderLeftColor: '#f59e0b',
  },
  noteText: {
    fontSize: 9,
    color: '#92400e',
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
});

export const ChecklistEscrituracion = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            ✓ Checklist de Escrituración de Inmueble
          </Text>
          <Text style={styles.subtitle}>
            Documentos necesarios para escriturar tu propiedad en Ecuador
          </Text>
        </View>

        {/* DOCUMENTOS DEL COMPRADOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Documentos del Comprador</Text>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Cédula de identidad y certificado de votación (originales y
              copias a color)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Estado civil actualizado (Registro Civil, no mayor a 3 meses)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Si es casado: Cédula y certificado de votación del cónyuge
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Planilla de servicio básico (luz, agua o teléfono) del domicilio
              actual
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Carta de aprobación del crédito hipotecario (si aplica)
            </Text>
          </View>
        </View>

        {/* DOCUMENTOS DEL VENDEDOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏠 Documentos del Vendedor</Text>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Cédula de identidad y certificado de votación (originales y
              copias)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Estado civil actualizado (no mayor a 3 meses)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Si es casado: Autorización del cónyuge y sus documentos
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Escritura de propiedad original inscrita en el Registro
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Certificados del Registro de la Propiedad (no mayor a 15 días)
            </Text>
          </View>
        </View>

        {/* DOCUMENTOS DEL INMUEBLE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏢 Documentos del Inmueble</Text>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Certificado de gravámenes del Registro de la Propiedad (vigente)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Certificado de no adeudar impuestos prediales (Municipio)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Avalúo catastral actualizado (Municipio o Catastro)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Pago de plusvalía (si el vendedor compró hace menos de 2 años)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Solvencia de expensas de condominio (si es departamento)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Solvencia de servicios básicos (luz, agua, teléfono)
            </Text>
          </View>
        </View>

        {/* PLAZOS ESTIMADOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏱️ Plazos Estimados</Text>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Recopilación de documentos: 7 a 15 días hábiles
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Elaboración de minuta notarial: 2 a 3 días hábiles
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Firma de escritura ante notario: 1 día (con cita previa)
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Pago de impuestos municipales: 1 a 2 días hábiles
            </Text>
          </View>
          <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.itemText}>
              Inscripción en Registro de la Propiedad: 3 a 5 días hábiles
            </Text>
          </View>
        </View>

        {/* NOTA IMPORTANTE */}
        <View style={styles.note}>
          <Text style={styles.noteText}>
            ⚠️ IMPORTANTE: Estos son los documentos generales. Dependiendo del
            caso (herencia, donación, propiedad horizontal, etc.), podrían
            requerirse documentos adicionales. Para un checklist personalizado,
            agenda tu cita con nosotros.
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Abogados Online Ecuador • Notaría 18 de Quito
          </Text>
          <Text style={styles.contactInfo}>
            WhatsApp: +593 98 765 4321 • info@abogadosonlineecuador.com •
            abogadosonlineecuador.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
