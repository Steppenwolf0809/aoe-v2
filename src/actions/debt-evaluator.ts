'use server'

import { renderToBuffer } from '@react-pdf/renderer'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  debtAnswerLabels,
  debtEvaluatorQuestions,
  evaluateDebtAnswers,
  type DebtAnswerValue,
} from '@/lib/debt-evaluator'
import { DebtPrediagnosis } from '@/lib/pdf/debt-prediagnosis'
import { notifyN8NLead } from '@/lib/n8n'
import { SOCIAL_LINKS } from '@/lib/constants'

const answerValueSchema = z.enum(['si', 'no', 'no_estoy_seguro'])

const debtEvaluationSchema = z.object({
  name: z.string().min(2, 'Ingresa tu nombre'),
  email: z.string().email('Ingresa un email válido'),
  phone: z.string().min(7, 'Ingresa un teléfono válido').optional().or(z.literal('')),
  city: z.string().optional(),
  answers: z.record(z.string(), answerValueSchema),
})

export type DebtEvaluationInput = z.infer<typeof debtEvaluationSchema>

export interface SubmitDebtEvaluationSuccess {
  success: true
  filename: string
  pdfBase64: string
  whatsappUrl: string
  diagnosis: ReturnType<typeof evaluateDebtAnswers>
}

export interface SubmitDebtEvaluationError {
  success: false
  error: string
}

export type SubmitDebtEvaluationResult = SubmitDebtEvaluationSuccess | SubmitDebtEvaluationError

function isSchemaMismatchError(error: { message?: string | null; code?: string | null } | null): boolean {
  if (!error) return false

  const text = `${error.code || ''} ${error.message || ''}`.toLowerCase()
  return text.includes('could not find') || text.includes('column') || text.includes('schema cache')
}

function buildAnswersForStorage(answers: Record<string, DebtAnswerValue>) {
  return debtEvaluatorQuestions.map((question) => ({
    id: question.id,
    category: question.category,
    question: question.question,
    answer: debtAnswerLabels[answers[question.id]] || 'Sin respuesta',
  }))
}

export async function submitDebtEvaluation(input: DebtEvaluationInput): Promise<SubmitDebtEvaluationResult> {
  const parsed = debtEvaluationSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, error: 'Revisa tus datos de contacto antes de generar el PDF.' }
  }

  const missingAnswers = debtEvaluatorQuestions.filter((question) => !parsed.data.answers[question.id])
  if (missingAnswers.length > 0) {
    return { success: false, error: 'Completa las 15 preguntas para generar el pre-diagnóstico.' }
  }

  const { name, email, phone, city, answers } = parsed.data
  const diagnosis = evaluateDebtAnswers(answers)
  const storedAnswers = buildAnswersForStorage(answers)
  const date = new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const metadata = {
    name,
    city: city || null,
    serviceType: 'Negociación Extrajudicial con Blindaje Judicial',
    diagnosis,
    answers: storedAnswers,
    generatedAt: new Date().toISOString(),
  }

  try {
    const supabase = await createClient()

    let { error: dbError } = await supabase.from('leads').insert({
      email,
      phone: phone || null,
      source: 'debt-evaluator',
      calculator_type: 'negociacion-deudas',
      data: metadata,
    })

    if (dbError && isSchemaMismatchError(dbError)) {
      const fallback = await supabase.from('leads').insert({
        name,
        email,
        phone: phone || null,
        source: 'debt-evaluator',
        status: 'new',
        metadata,
      })
      dbError = fallback.error
    }

    if (dbError) {
      console.error('Supabase error saving debt evaluation:', dbError)
      return { success: false, error: 'No pudimos guardar tu evaluación. Intenta nuevamente.' }
    }

    void notifyN8NLead({
      email,
      name,
      phone,
      source: 'debt-evaluator',
      interes: 'Negociación Extrajudicial con Blindaje Judicial',
      metadata,
    })

    const pdfBuffer = await renderToBuffer(
      DebtPrediagnosis({
        data: {
          clientName: name,
          clientEmail: email,
          phone: phone || undefined,
          city: city || undefined,
          date,
          diagnosis,
          answers: storedAnswers.map((answer) => ({
            question: answer.question,
            answer: answer.answer,
          })),
        },
      }),
    )

    const whatsappMessage =
      'Hola, acabo de completar mi evaluación de riesgo y quiero iniciar mi estrategia de negociación.'
    const whatsappUrl = `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`

    return {
      success: true,
      diagnosis,
      filename: `pre-diagnostico-deuda-${Date.now()}.pdf`,
      pdfBase64: Buffer.from(pdfBuffer).toString('base64'),
      whatsappUrl,
    }
  } catch (error) {
    console.error('Debt evaluation error:', error)
    return { success: false, error: 'No pudimos generar el pre-diagnóstico. Intenta nuevamente.' }
  }
}
