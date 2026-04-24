import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { DebtDiagnosis } from '@/lib/debt-evaluator'

interface DebtPrediagnosisData {
  clientName: string
  clientEmail: string
  phone?: string
  city?: string
  date: string
  diagnosis: DebtDiagnosis
  answers: Array<{
    question: string
    answer: string
  }>
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: '#0f172a',
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginBottom: 22,
  },
  brand: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f172a',
  },
  eyebrow: {
    marginTop: 4,
    fontSize: 9,
    color: '#475569',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    lineHeight: 1.15,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#475569',
  },
  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 8,
  },
  panel: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 14,
    marginBottom: 10,
  },
  riskLabel: {
    fontSize: 18,
    fontWeight: 700,
    color: '#be123c',
    marginBottom: 4,
  },
  muted: {
    color: '#64748b',
    lineHeight: 1.5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  column: {
    flex: 1,
  },
  listItem: {
    marginBottom: 5,
    lineHeight: 1.45,
  },
  answerRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
  },
  answerQuestion: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.35,
  },
  answerValue: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: 700,
    color: '#0f172a',
  },
  disclaimer: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fecdd3',
    backgroundColor: '#fff1f2',
    fontSize: 9,
    lineHeight: 1.45,
    color: '#7f1d1d',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    fontSize: 8,
    color: '#64748b',
  },
})

export function DebtPrediagnosis({ data }: { data: DebtPrediagnosisData }) {
  return (
    <Document title="Pre-Diagnostico de Riesgo de Deuda">
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>Abogados Online Ecuador</Text>
          <Text style={styles.eyebrow}>Negociación Extrajudicial con Blindaje Judicial</Text>
        </View>

        <Text style={styles.title}>Pre-Diagnostico de Riesgo de Deuda</Text>
        <Text style={styles.subtitle}>
          Preparado para {data.clientName} el {data.date}. Este documento organiza las señales
          principales de riesgo y los próximos pasos sugeridos para una primera estrategia legal.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen inicial</Text>
          <View style={styles.panel}>
            <Text style={styles.riskLabel}>{data.diagnosis.label}</Text>
            <Text style={styles.muted}>{data.diagnosis.range}</Text>
            <Text style={[styles.muted, { marginTop: 8 }]}>{data.diagnosis.summary}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Opciones de estrategia</Text>
            <View style={styles.panel}>
              {data.diagnosis.options.map((option) => (
                <Text key={option} style={styles.listItem}>
                  - {option}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Siguiente paso recomendado</Text>
            <View style={styles.panel}>
              {data.diagnosis.nextSteps.map((step) => (
                <Text key={step} style={styles.listItem}>
                  - {step}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de contacto</Text>
          <View style={styles.panel}>
            <Text style={styles.listItem}>Nombre: {data.clientName}</Text>
            <Text style={styles.listItem}>Email: {data.clientEmail}</Text>
            <Text style={styles.listItem}>Teléfono: {data.phone || 'No indicado'}</Text>
            <Text style={styles.listItem}>Ciudad: {data.city || 'No indicada'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Respuestas registradas</Text>
          <View style={styles.panel}>
            {data.answers.map((answer) => (
              <View key={answer.question} style={styles.answerRow}>
                <Text style={styles.answerQuestion}>{answer.question}</Text>
                <Text style={styles.answerValue}>{answer.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.disclaimer}>
          Aviso legal: este pre-diagnóstico no reemplaza asesoría legal personalizada ni garantiza
          resultado, eliminación de deuda o suspensión de procesos. Su objetivo es preparar una
          primera estrategia y ordenar la información antes de la llamada.
        </Text>

        <Text style={styles.footer}>
          abogadosonlineecuador.com | info@abogadosonlineecuador.com | Documento generado por el
          evaluador de Abogados Online Ecuador.
        </Text>
      </Page>
    </Document>
  )
}
