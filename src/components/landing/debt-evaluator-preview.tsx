'use client'

import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Loader2,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'
import { submitDebtEvaluation, type SubmitDebtEvaluationSuccess } from '@/actions/debt-evaluator'
import { Button } from '@/components/ui/button'
import {
  debtAnswerLabels,
  debtEvaluatorQuestions,
  evaluateDebtAnswers,
  type DebtAnswerValue,
} from '@/lib/debt-evaluator'
import { cn } from '@/lib/utils'

const answerOptions: DebtAnswerValue[] = ['si', 'no', 'no_estoy_seguro']

const riskToneClass = {
  inicial: 'text-emerald-200',
  moderado: 'text-amber-200',
  alto: 'text-rose-200',
} as const

const evaluatorPrimaryButtonClass =
  'min-h-12 h-auto rounded-xl whitespace-normal px-4 py-3 text-center leading-tight bg-cyan-300 text-slate-950 shadow-[0_16px_42px_-24px_rgba(34,211,238,0.95)] hover:bg-cyan-200 active:translate-y-px'

const evaluatorOutlineButtonClass =
  'min-h-12 h-auto rounded-xl whitespace-normal px-4 py-3 text-center leading-tight border-white/15 text-white hover:bg-white/10 active:translate-y-px'

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
  const progressLabel = `${Math.round(progress)}%`

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
    <section
      id="evaluador-deudas"
      className="relative scroll-mt-24 overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-16"
      style={{ backgroundColor: '#050914' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% 8%, rgba(34,211,238,0.12), transparent 28%), radial-gradient(circle at 84% 20%, rgba(16,185,129,0.12), transparent 30%), linear-gradient(180deg, #050914 0%, #08111f 58%, #050914 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.55) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-7 lg:grid-cols-[0.72fr_1.44fr] lg:items-center xl:gap-8">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span className="truncate">Negociacion extrajudicial con blindaje judicial</span>
          </div>

          <h2 className="max-w-xl text-[2.6rem] font-semibold leading-none tracking-normal text-white sm:text-5xl xl:text-[4.2rem]">
            Primero diagnostico. Despues <span className="text-cyan-200">estrategia.</span>
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
            Responde 15 preguntas para recibir un PDF de pre-diagnostico con nivel de riesgo,
            senales de negociacion y proximos pasos legales recomendados.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
            {[
              { label: 'Captura interna', icon: TrendingUp },
              { label: 'PDF inmediato', icon: FileText },
              { label: 'WhatsApp despues', icon: MessageCircle },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="inline-flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-3">
                  <Icon className="h-5 w-5 shrink-0 text-cyan-200" />
                  <p className="text-xs font-semibold leading-tight text-white">{item.label}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-slate-500" />
              <p className="text-sm leading-relaxed text-slate-400">
                La evaluacion no reemplaza asesoria legal personalizada. Sirve para preparar una
                estrategia inicial antes de una negociacion o defensa.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/15 bg-slate-950/78 p-5 shadow-[0_26px_90px_-54px_rgba(34,211,238,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
            {stage === 'questions' && (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 sm:grid">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        Evaluador legal
                      </p>
                      <p className="mt-1 text-lg text-white">
                        Pregunta {currentIndex + 1} de {debtEvaluatorQuestions.length}
                      </p>
                    </div>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                    <ClipboardList className="h-5 w-5 text-slate-200" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-4">
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-200 to-cyan-300"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>
                  <span className="font-mono text-sm text-slate-300">{progressLabel}</span>
                </div>

                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-200">
                    {currentQuestion.category}
                  </p>
                  <h3 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-normal text-white sm:text-3xl">
                    {currentQuestion.question}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-300">{currentQuestion.detail}</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {answerOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(option)}
                      className={cn(
                        'relative min-h-24 rounded-2xl border px-4 py-4 text-base font-semibold leading-tight transition-colors active:translate-y-px',
                        answers[currentQuestion.id] === option
                          ? 'border-cyan-200 bg-cyan-300/10 text-white shadow-[0_0_30px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.14)]'
                          : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.08]',
                      )}
                    >
                      {answers[currentQuestion.id] === option && (
                        <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-cyan-100" />
                      )}
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                      ? 'Iniciar evaluacion gratuita'
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
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-200/15 bg-emerald-300/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Listo para generar</p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-normal text-white">
                      Dejamos tus datos y descargas el PDF.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      El registro queda guardado como lead interno para seguimiento legal.
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={leadForm.name}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, name: event.target.value }))}
                    required
                    placeholder="Nombre completo"
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                  />
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, email: event.target.value }))}
                    required
                    placeholder="Email"
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                  />
                  <input
                    type="tel"
                    value={leadForm.phone}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, phone: event.target.value }))}
                    required
                    placeholder="Telefono"
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                  />
                  <input
                    value={leadForm.city}
                    onChange={(event) => setLeadForm((prev) => ({ ...prev, city: event.target.value }))}
                    placeholder="Ciudad"
                    className="h-11 rounded-xl border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-rose-300"
                  />
                </div>

                {errorMessage && (
                  <p className="mt-3 text-sm text-rose-200">{errorMessage}</p>
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
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
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-200/15 bg-emerald-300/10">
                    <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">Pre-diagnostico generado</p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight text-white">
                      Tu PDF esta listo.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      Tambien guardamos tu evaluacion para seguimiento interno del equipo legal.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => downloadPdfFromBase64(submitResult.pdfBase64, submitResult.filename)}
                    className="min-h-12 h-auto w-full whitespace-normal px-4 py-3 text-center leading-tight bg-white text-slate-950 hover:bg-slate-200"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF de nuevo
                  </Button>
                  <Button asChild size="lg" className="min-h-12 h-auto w-full rounded-xl whitespace-normal bg-emerald-400 px-4 py-3 text-center leading-tight text-slate-950 shadow-none hover:bg-emerald-300">
                    <a href={submitResult.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      Iniciar estrategia por WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden rounded-[28px] border border-emerald-200/20 bg-emerald-300/[0.055] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] lg:block">
            <div className="flex items-start gap-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-emerald-200/20 bg-emerald-300/10">
                <TrendingUp className="h-7 w-7 text-emerald-200" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Resultado preliminar</p>
                <h3 className={`mt-1 text-2xl font-semibold ${riskToneClass[diagnosis.level]}`}>
                  {diagnosis.label}
                </h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-200">{diagnosis.summary}</p>

            <div className="mt-5 rounded-2xl border border-emerald-200/20 bg-slate-950/45 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Rango general</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-white">{diagnosis.range}</p>
            </div>

            <div className="mt-5 space-y-3">
              {diagnosis.nextSteps.map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                Siguiente paso
              </p>
              <div className="mt-4 grid gap-3 xl:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleNext}
                  className="min-h-11 h-auto rounded-xl border-white/15 bg-white/[0.035] px-4 py-2.5 text-sm text-white shadow-none hover:bg-white/10"
                >
                  <FileText className="h-4 w-4" />
                  Ver plan sugerido
                </Button>
                {stage === 'result' && submitResult ? (
                  <Button asChild size="lg" className="min-h-11 h-auto rounded-xl bg-emerald-400 px-4 py-2.5 text-sm text-slate-950 shadow-none hover:bg-emerald-300">
                    <a href={submitResult.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="lg"
                    disabled
                    className="min-h-11 h-auto rounded-xl bg-emerald-400/15 px-4 py-2.5 text-sm text-emerald-100 shadow-none"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp al final
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
