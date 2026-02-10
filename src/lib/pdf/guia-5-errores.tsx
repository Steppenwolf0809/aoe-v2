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
    borderBottomColor: '#dc2626',
    paddingBottom: 15,
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
    marginBottom: 15,
  },
  intro: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderLeft: 3,
    borderLeftColor: '#3b82f6',
  },
  errorSection: {
    marginBottom: 25,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  errorNumber: {
    width: 32,
    height: 32,
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 7,
    borderRadius: 16,
    marginRight: 10,
  },
  errorTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  errorContent: {
    paddingLeft: 42,
  },
  errorText: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  errorSolution: {
    backgroundColor: '#dcfce7',
    padding: 10,
    marginTop: 8,
    borderLeft: 3,
    borderLeftColor: '#16a34a',
  },
  solutionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  solutionText: {
    fontSize: 9,
    color: '#166534',
    lineHeight: 1.5,
  },
  costBox: {
    backgroundColor: '#fef3c7',
    padding: 8,
    marginTop: 6,
  },
  costText: {
    fontSize: 9,
    color: '#92400e',
    fontWeight: 'bold',
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
  cta: {
    backgroundColor: '#2563eb',
    padding: 15,
    marginTop: 20,
    borderRadius: 6,
  },
  ctaText: {
    fontSize: 11,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export const Guia5Errores = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            ⚠️ 5 Errores que Encarecen tu Escrituración
          </Text>
          <Text style={styles.subtitle}>
            Y cómo evitarlos para ahorrar miles de dólares en tu compra de
            vivienda
          </Text>
        </View>

        <Text style={styles.intro}>
          La escrituración de un inmueble es uno de los gastos más
          significativos al comprar una casa. Sin embargo, muchas personas
          terminan pagando de más por errores que podrían haberse evitado con
          la asesoría correcta. En esta guía te mostramos los 5 errores más
          comunes y cómo prevenirlos.
        </Text>

        {/* ERROR 1 */}
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorNumber}>1</Text>
            <Text style={styles.errorTitle}>
              Subdeclarar el valor de compraventa
            </Text>
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>
              Muchos vendedores sugieren "declarar menos" para pagar menos
              impuestos. Sin embargo, esto tiene graves consecuencias legales y
              económicas:
            </Text>
            <Text style={styles.errorText}>
              • Es ilegal y puede resultar en multas hasta el 100% del impuesto
              evadido
            </Text>
            <Text style={styles.errorText}>
              • El SRI puede ajustar el valor con base en avalúos catastrales
            </Text>
            <Text style={styles.errorText}>
              • Si necesitas vender en el futuro, pagarás más plusvalía
            </Text>
            <Text style={styles.errorText}>
              • Los bancos no financian escrituras subdeclaradas
            </Text>

            <View style={styles.errorSolution}>
              <Text style={styles.solutionLabel}>✓ SOLUCIÓN:</Text>
              <Text style={styles.solutionText}>
                Siempre declara el valor real de compraventa. Es más seguro y
                evita problemas futuros. Si el monto es alto, existen formas
                legales de optimizar el pago (como aprovechar descuentos por
                pronto pago).
              </Text>
            </View>

            <View style={styles.costBox}>
              <Text style={styles.costText}>
                💰 Costo del error: Multas de $5,000 a $20,000 + estrés legal
              </Text>
            </View>
          </View>
        </View>

        {/* ERROR 2 */}
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorNumber}>2</Text>
            <Text style={styles.errorTitle}>
              No verificar el avalúo catastral actualizado
            </Text>
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>
              Los impuestos municipales (alcabalas) se calculan sobre el valor
              MAYOR entre el precio de venta y el avalúo catastral. Muchos
              compradores no verifican el avalúo antes de negociar.
            </Text>

            <View style={styles.errorSolution}>
              <Text style={styles.solutionLabel}>✓ SOLUCIÓN:</Text>
              <Text style={styles.solutionText}>
                Antes de firmar la promesa de compraventa, solicita el avalúo
                catastral actualizado en el Municipio. Esto te permite calcular
                correctamente los gastos totales.
              </Text>
            </View>

            <View style={styles.costBox}>
              <Text style={styles.costText}>
                💰 Costo del error: Hasta $2,000 extras en impuestos no
                previstos
              </Text>
            </View>
          </View>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* ERROR 3 */}
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorNumber}>3</Text>
            <Text style={styles.errorTitle}>
              No considerar la plusvalía del vendedor
            </Text>
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>
              Si el vendedor compró la propiedad hace menos de 2 años, debe
              pagar impuesto a la plusvalía. Muchos contratos no especifican
              quién asume este costo.
            </Text>
            <Text style={styles.errorText}>
              • Por ley, la plusvalía la paga el vendedor
            </Text>
            <Text style={styles.errorText}>
              • Pero algunos vendedores intentan trasladarla al comprador
            </Text>
            <Text style={styles.errorText}>
              • Si no se negocia correctamente, puedes terminar pagándola tú
            </Text>

            <View style={styles.errorSolution}>
              <Text style={styles.solutionLabel}>✓ SOLUCIÓN:</Text>
              <Text style={styles.solutionText}>
                Incluye en la promesa de compraventa una cláusula que indique
                claramente que el vendedor asume el pago de plusvalía. Verifica
                cuándo compró el vendedor para saber si aplica este impuesto.
              </Text>
            </View>

            <View style={styles.costBox}>
              <Text style={styles.costText}>
                💰 Costo del error: Hasta 10% del valor de compraventa ($10,000
                en una casa de $100,000)
              </Text>
            </View>
          </View>
        </View>

        {/* ERROR 4 */}
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorNumber}>4</Text>
            <Text style={styles.errorTitle}>
              No tener documentos actualizados
            </Text>
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>
              Los certificados del Registro, estados civiles y otros documentos
              tienen vigencia limitada (15-90 días). Si expiran durante el
              trámite, debes pagar nuevamente por duplicados.
            </Text>

            <View style={styles.errorSolution}>
              <Text style={styles.solutionLabel}>✓ SOLUCIÓN:</Text>
              <Text style={styles.solutionText}>
                No tramites documentos con más de 30 días de anticipación.
                Planifica el proceso de escrituración para que todos los
                documentos se obtengan en un período de 2-3 semanas antes de la
                firma.
              </Text>
            </View>

            <View style={styles.costBox}>
              <Text style={styles.costText}>
                💰 Costo del error: $200 a $500 en duplicados + retrasos de 1-2
                semanas
              </Text>
            </View>
          </View>
        </View>

        {/* ERROR 5 */}
        <View style={styles.errorSection}>
          <View style={styles.errorHeader}>
            <Text style={styles.errorNumber}>5</Text>
            <Text style={styles.errorTitle}>
              No elegir correctamente la notaría
            </Text>
          </View>
          <View style={styles.errorContent}>
            <Text style={styles.errorText}>
              No todas las notarías son iguales. Algunas cobran honorarios más
              altos, otras tienen demoras de semanas, y algunas no ofrecen
              gestión completa del trámite.
            </Text>

            <View style={styles.errorSolution}>
              <Text style={styles.solutionLabel}>✓ SOLUCIÓN:</Text>
              <Text style={styles.solutionText}>
                Busca una notaría que ofrezca servicio integral: elaboración de
                minuta, gestión de pagos municipales, inscripción en Registro y
                seguimiento completo. Esto ahorra tiempo, dinero y estrés.
              </Text>
            </View>

            <View style={styles.costBox}>
              <Text style={styles.costText}>
                💰 Costo del error: Hasta $1,000 en honorarios innecesarios +
                pérdida de tiempo
              </Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            📞 ¿Necesitas asesoría personalizada?
          </Text>
          <Text style={styles.ctaText}>
            Agenda tu cita gratuita en abogadosonlineecuador.com
          </Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Abogados Online Ecuador • Servicio legal digital independiente
          </Text>
          <Text style={styles.contactInfo}>
            WhatsApp: +593 97 931 7579 • info@abogadosonlineecuador.com •
            abogadosonlineecuador.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};
