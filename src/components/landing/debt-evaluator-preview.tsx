'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  Loader2,
  MessageCircle,
} from 'lucide-react'
import { submitDebtEvaluation, type SubmitDebtEvaluationSuccess } from '@/actions/debt-evaluator'
import {
  debtAnswerLabels,
  debtEvaluatorQuestions,
  evaluateDebtAnswers,
  type DebtAnswerValue,
} from '@/lib/debt-evaluator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const answerOptions: DebtAnswerValue[] = ['si', 'no', 'no_estoy_seguro']

const riskToneClass = {
  inicial: 'text-emerald-200',
  moderado: 'text-amber-200',
  alto: 'text-rose-200',
} as const

const evaluatorPrimaryButtonClass =
  'min-h-12 h-auto rounded-2xl whitespace-normal px-4 py-3 text-center leading-tight bg-rose-400 text-white shadow-none hover:bg-rose-300 active:translate-y-px'

const evaluatorOutlineButtonClass =
  'min-h-12 h-auto rounded-2xl whitespace-normal px-4 py-3 text-center leading-tight border-white/15 text-white hover:bg-white/10 active:translate-y-px'

function downloadPdfFromBase64(base64: string, filename: string) {
  const byteCharacters = window.atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    byteArrays.push(new Uint8Array(byteNumbers))
  }

  const blob = new Blob(byteArrays, { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function DebtEvaluatorPreview() {
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, DebtAnswerValue>>({})
  const [stage, setStage] = useState<'questions' | 'lead' | 'result'>('questions')
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', city: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitResult, setSubmitResult] = useState<SubmitDebtEvaluationSuccess | null>(null)

  const currentQuestion = debtEvaluatorQuestions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const allAnswered = debtEvaluatorQuestions.every((question) => answers[question.id])
  const diagnosis = useMemo(() => evaluateDebtAnswers(answers), [answers])
  const progress = Math.max(((currentIndex + 1) / debtEvaluatorQuestions.length) * 100, 7)

  const handleAnswer = (answer: DebtAnswerValue) => {
    setStarted(true)
    setSubmitResult(null)
    setSubmitStatus('idle')
    setErrorMessage('')
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))
  }

  const handleNext = () => {
    if (!started) {
      setStarted(true)
      return
    }

    if (!answers[currentQuestion.id]) {
      setErrorMessage('Selecciona una respuesta para continuar.')
      return
    }

    setErrorMessage('')

    if (currentIndex === debtEvaluatorQuestions.length - 1) {
      if (!allAnswered) {
        const missingIndex = debtEvaluatorQuestions.findIndex((question) => !answers[question.id])
        setCurrentIndex(Math.max(missingIndex, 0))
        return
      }

      setStage('lead')
      return
    }

    setCurrentIndex((index) => index + 1)
  }

  const handleBack = () => {
    setErrorMessage('')

    if (stage === 'lead') {
      setStage('questions')
      setCurrentIndex(debtEvaluatorQuestions.length - 1)
      return
    }

    setCurrentIndex((index) => Math.max(index - 1, 0))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!allAnswered) {
      setErrorMessage('Completa las 15 preguntas antes de generar el PDF.')
      setStage('questions')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage('')

    const result = await submitDebtEvaluation({
      ...leadForm,
      answers,
    })

    if (!result.success) {
      setSubmitStatus('error')
      setErrorMessage(result.error)
      return
    }

    setSubmitResult(result)
    setSubmitStatus('success')
    setStage('result')
    downloadPdfFromBase64(result.pdfBase64, result.filename)
  }

  return (
    <section id="evaluador-deudas" className="relative overflow-hidden bg-[#090d16] px-4 py-16 sm:px-6 sm:py-24">
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.9) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-rose-300/10 blur-3xl" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div>
          <Badge className="mb-5 border-rose-300/20 bg-rose-400/10 font-mono text-[10px] uppercase tracking-[0.14em] text-rose-100 sm:text-[11px]">
            Negociación Extrajudicial con Blindaje Judicial
          </Badge>
          <h2 className="max-w-2xl text-[2rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-5xl">
            Primero diagnóstico. Después estrategia.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Responde 15 preguntas para recibir un PDF de pre-diagnóstico con nivel de riesgo,
            señales de negociación y próximos pasos legales recomendados.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {['Captura interna', 'PDF inmediato', 'WhatsApp después'].map((item) => (
              <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                <p className="text-xs font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-xl text-xs leading-relaxed text-slate-500">
            La evaluación no reemplaza asesoría legal personalizada. Sirve para preparar
            una estrategia inicial antes de una negociación o defensa.
          </p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-2 shadow-[0_32px_100px_-70px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm sm:p-3">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/80 p-5">
              {stage === 'questions' && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Evaluador legal</p>
                      <p className="mt-1 text-sm text-white">
                        Pregunta {currentIndex + 1} de {debtEvaluatorQuestions.length}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-rose-400/10">
                      <ClipboardList className="h-5 w-5 text-rose-200" />
                    </div>
                  </div>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-300 to-sky-300"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>

                  <div className="mt-8 min-h-36">
                    <p className="text-xs font-semibold uppercase text-rose-200">{currentQuestion.category}</p>
                    <h3 className="mt-2 text-[1.7rem] font-semibold leading-[1.06] tracking-[-0.035em] text-white">{currentQuestion.question}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{currentQuestion.detail}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {answerOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAnswer(option)}
                        className={cn(
                          'min-h-12 rounded-2xl border px-3 py-3 text-sm font-semibold leading-tight transition-colors active:translate-y-px',
                          answers[currentQuestion.id] === option
                            ? 'border-rose-200 bg-rose-300 text-slate-950'
                            : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]',
                        )}
                      >
                        {debtAnswerLabels[option]}
                      </button>
                    ))}
                  </div>

                  {errorMessage && submitStatus !== 'loading' && (
                    <p className="mt-3 text-sm text-rose-200">{errorMessage}</p>
                  )}

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:hidden">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Resultado preliminar
                        </p>
                        <p className={`mt-1 text-lg font-semibold ${riskToneClass[diagnosis.level]}`}>
                          {diagnosis.label}
                        </p>
                      </div>
                      <div className="text-right font-mono text-sm text-slate-300">
                        {answeredCount}/15
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{diagnosis.summary}</p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    {currentIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleBack}
                        className={evaluatorOutlineButtonClass}
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Anterior
                      </Button>
                    )}
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleNext}
                      className={`flex-1 ${evaluatorPrimaryButtonClass}`}
                    >
                      {!started
                        ? 'Iniciar evaluación gratuita'
                        : currentIndex === debtEvaluatorQuestions.length - 1
                          ? 'Continuar al PDF'
                          : 'Siguiente pregunta'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {stage === 'lead' && (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-emerald-300/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Listo para generar</p>
                      <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-[-0.03em] text-white">
                        Dejamos tus datos y descargas el PDF.
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        El registro queda guardado como lead interno para seguimiento legal.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      value={leadForm.name}
                      onChange={(event) => setLeadForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                      placeholder="Nombre completo"
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                    />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                      placeholder="Email"
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                    />
                    <input
                      type="tel"
                      value={leadForm.phone}
                      onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                      required
                      placeholder="Teléfono"
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                    />
                    <input
                      value={leadForm.city}
                      onChange={(event) => setLeadForm((prev) => ({ ...prev, city: event.target.value }))}
                      placeholder="Ciudad"
                      className="h-12 rounded-2xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                    />
                  </div>

                  {errorMessage && (
                    <p className="mt-3 text-sm text-rose-200">{errorMessage}</p>
                  )}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleBack}
                      className={evaluatorOutlineButtonClass}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Revisar respuestas
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitStatus === 'loading'}
                      className={`flex-1 ${evaluatorPrimaryButtonClass}`}
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          Generar PDF
                          <Download className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {stage === 'result' && submitResult && (
                <div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-emerald-300/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Pre-diagnóstico generado</p>
                      <h3 className="mt-1 text-2xl font-semibold leading-tight text-white">
                        Tu PDF está listo.
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        También guardamos tu evaluación para seguimiento interno del equipo legal.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => downloadPdfFromBase64(submitResult.pdfBase64, submitResult.filename)}
                      className="min-h-12 h-auto w-full whitespace-normal px-4 py-3 text-center leading-tight bg-white text-slate-950 hover:bg-slate-200"
                    >
                      <Download className="h-4 w-4" />
                      Descargar PDF de nuevo
                    </Button>
                    <Button asChild size="lg" className="min-h-12 h-auto w-full rounded-2xl whitespace-normal bg-emerald-400 px-4 py-3 text-center leading-tight text-slate-950 shadow-none hover:bg-emerald-300">
                      <a href={submitResult.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Iniciar estrategia por WhatsApp
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden rounded-[24px] border border-white/10 bg-slate-900/55 p-5 lg:block">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-amber-300/10">
                  <AlertTriangle className="h-5 w-5 text-amber-200" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Resultado preliminar</p>
                  <h3 className={`mt-1 text-2xl font-semibold ${riskToneClass[diagnosis.level]}`}>
                    {diagnosis.label}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-300">{diagnosis.summary}</p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Rango general</p>
                <p className="mt-1 text-sm leading-relaxed text-white">{diagnosis.range}</p>
              </div>

              <div className="mt-6 space-y-3">
                {diagnosis.nextSteps.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Avance</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{answeredCount}/15</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Score</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{diagnosis.score}</p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-slate-500">
                El diagnóstico es estático y prudente: orienta la primera llamada, pero no promete
                resultado ni eliminación de deuda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
