'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  DollarSign,
  Calendar,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCalculator } from '@/hooks/use-calculator'
import {
  calcularPresupuestoInmobiliario,
  type InputInmobiliario,
  type ResultadoInmobiliario,
} from '@/lib/formulas/inmobiliario'
import { captureLead, trackCalculatorSession } from '@/actions/leads'
import { sendPresupuestoDetallado } from '@/actions/send-lead-magnet'
import type { LeadCaptureInput } from '@/lib/validations/leads'
import { WizardStep, WizardOption } from './wizard-step'
import { SliderInput } from './slider-input'
import { TotalDisplay } from './total-display'
import { EmailGate } from '@/components/lead-capture/EmailGate'
import { LeadMagnetsMenu } from '@/components/lead-capture/lead-magnets-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// ============================================
// TYPES
// ============================================

type Rol = 'comprador' | 'vendedor' | null

interface WizardState {
  rol: Rol
  valorTransferencia: number
  avaluoCatastral: number
  usarMismoValorAvaluo: boolean
  fechaAdquisicion: string
  valorAdquisicion: number
  esViviendaSocial: boolean
  esTerceraEdad: boolean
  esDiscapacitado: boolean
}

const INITIAL_STATE: WizardState = {
  rol: null,
  valorTransferencia: 100000,
  avaluoCatastral: 0,
  usarMismoValorAvaluo: true,
  fechaAdquisicion: '',
  valorAdquisicion: 0,
  esViviendaSocial: false,
  esTerceraEdad: false,
  esDiscapacitado: false,
}

// ============================================
// HELPERS
// ============================================

function buildFormulaInput(state: WizardState): InputInmobiliario {
  const today = new Date().toISOString().split('T')[0]
  const avaluo = state.usarMismoValorAvaluo
    ? state.valorTransferencia
    : state.avaluoCatastral || state.valorTransferencia

  if (state.rol === 'vendedor') {
    return {
      valorTransferencia: state.valorTransferencia,
      avaluoCatastral: avaluo,
      valorAdquisicion: state.valorAdquisicion || state.valorTransferencia * 0.7,
      fechaAdquisicion: state.fechaAdquisicion || '2021-01-01',
      fechaTransferencia: today,
      tipoTransferencia: 'Compraventa',
      tipoTransferente: 'Natural',
      esViviendaSocial: state.esViviendaSocial,
      esTerceraEdad: state.esTerceraEdad,
      esDiscapacitado: state.esDiscapacitado,
    }
  }

  // Buyer: set defaults for seller fields (no plusvalía calculation needed)
  return {
    valorTransferencia: state.valorTransferencia,
    avaluoCatastral: avaluo,
    valorAdquisicion: state.valorTransferencia,
    fechaAdquisicion: '2020-01-01',
    fechaTransferencia: today,
    tipoTransferencia: 'Compraventa',
    tipoTransferente: 'Natural',
    esViviendaSocial: state.esViviendaSocial,
    esTerceraEdad: state.esTerceraEdad,
    esDiscapacitado: state.esDiscapacitado,
  }
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

// ============================================
// COMPONENT
// ============================================

export function InmobiliarioWidget() {
  const [wizardState, setWizardState] = useState<WizardState>(INITIAL_STATE)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [showLeadMenu, setShowLeadMenu] = useState(false)

  const totalSteps = wizardState.rol === 'vendedor' ? 3 : 2

  const {
    result,
    error,
    currentStep,
    completed,
    computeResult,
    nextStep,
    prevStep,
    goToStep,
    reset: resetCalculator,
    isFirstStep,
    isLastStep,
  } = useCalculator<InputInmobiliario, ResultadoInmobiliario>({
    calculate: calcularPresupuestoInmobiliario,
    initialInput: buildFormulaInput(INITIAL_STATE),
    totalSteps,
  })

  const updateWizard = useCallback(
    (updates: Partial<WizardState>) => {
      setWizardState((prev) => ({ ...prev, ...updates }))
    },
    [],
  )

  const handleRolSelect = (rol: Rol) => {
    updateWizard({ rol })
  }

  const handleCalculate = async () => {
    const formulaInput = buildFormulaInput(wizardState)
    const calc = calcularPresupuestoInmobiliario(formulaInput)

    // Use computeResult to trigger result state in hook
    computeResult()

    // Track anonymous session
    try {
      await trackCalculatorSession({
        type: 'presupuestador_inmobiliario',
        inputs: {
          rol: wizardState.rol,
          valorTransferencia: wizardState.valorTransferencia,
          avaluoCatastral: wizardState.usarMismoValorAvaluo
            ? wizardState.valorTransferencia
            : wizardState.avaluoCatastral,
        },
        result: {
          totalComprador: calc.comprador.total,
          totalVendedor: calc.vendedor.total,
          totalTransaccion: calc.totalTransaccion,
        },
      })
    } catch {
      // Non-blocking tracking
    }
  }

  const handleNextStep = () => {
    if (isLastStep) {
      handleCalculate()
    } else {
      nextStep()
    }
  }

  const handleReset = () => {
    setWizardState(INITIAL_STATE)
    setShowEmailGate(false)
    setShowLeadMenu(false)
    resetCalculator()
    goToStep(0)
  }

  const handleLeadSubmit = async (data: LeadCaptureInput) => {
    if (!result || !wizardState.rol) {
      throw new Error('No hay una cotización lista para enviar')
    }

    const leadResult = await captureLead(
      { ...data, source: 'presupuestador_inmobiliario' },
      { sendWelcomeEmail: false },
    )

    if (!leadResult.success) {
      throw new Error(leadResult.error || 'Error guardando lead')
    }

    const esComprador = wizardState.rol === 'comprador'
    const quoteResult = await sendPresupuestoDetallado({
      clientName: data.name?.trim() || 'Cliente',
      clientEmail: data.email,
      rol: wizardState.rol,
      valorInmueble: wizardState.valorTransferencia,
      avaluoCatastral: wizardState.usarMismoValorAvaluo
        ? undefined
        : wizardState.avaluoCatastral,
      desglose: {
        notarial: esComprador ? result.comprador.notarial.total : 0,
        alcabalas: esComprador ? result.comprador.alcabala.impuesto : 0,
        utilidad: esComprador ? 0 : result.vendedor.plusvalia.impuesto,
        registro: esComprador ? result.comprador.registro.arancelFinal : 0,
        consejoProvincial: esComprador ? result.comprador.consejoProvincial.total : 0,
      },
      total: esComprador ? result.comprador.total : result.vendedor.total,
    })

    if (!quoteResult.success) {
      throw new Error(
        quoteResult.error || 'No se pudo enviar la cotización por correo',
      )
    }
  }

  const isStep1Valid = wizardState.rol !== null
  const isStep2Valid = wizardState.valorTransferencia >= 10000
  const isStep3Valid =
    wizardState.rol !== 'vendedor' ||
    (wizardState.fechaAdquisicion !== '' && wizardState.valorAdquisicion > 0)

  const isCurrentStepValid = () => {
    if (currentStep === 0) return isStep1Valid
    if (currentStep === 1) return isStep2Valid
    if (currentStep === 2) return isStep3Valid
    return false
  }

  // Determine displayed total based on role
  const displayTotal = result
    ? wizardState.rol === 'vendedor'
      ? result.vendedor.total
      : result.comprador.total
    : 0

  const displayLabel = wizardState.rol === 'vendedor'
    ? 'Total estimado de impuestos por vender'
    : 'Total estimado de gastos legales para tu compra'

  // ============================================
  // STEP RENDERERS
  // ============================================

  const renderStep0 = () => (
    <WizardStep
      question="¿Qué vas a hacer?"
      hint="Selecciona tu situación para calcular los costos específicos"
      isFirst
      isLast={false}
      onNext={handleNextStep}
      nextDisabled={!isStep1Valid}
    >
      <WizardOption
        icon={<Home className="w-6 h-6" />}
        label="Voy a COMPRAR un inmueble"
        description="Calcula notaría, alcabalas, registro y consejo provincial"
        selected={wizardState.rol === 'comprador'}
        onClick={() => handleRolSelect('comprador')}
      />
      <WizardOption
        icon={<DollarSign className="w-6 h-6" />}
        label="Voy a VENDER un inmueble"
        description="Calcula el impuesto de plusvalía (utilidad) que debes pagar"
        selected={wizardState.rol === 'vendedor'}
        onClick={() => handleRolSelect('vendedor')}
      />
    </WizardStep>
  )

  const renderStep1 = () => (
    <WizardStep
      question="Cuéntanos sobre el inmueble"
      hint="Ingresa el valor de la propiedad para calcular tus costos"
      onPrev={prevStep}
      onNext={handleNextStep}
      nextDisabled={!isStep2Valid}
      isLast={wizardState.rol === 'comprador'}
      nextLabel={wizardState.rol === 'comprador' ? 'Calcular' : undefined}
    >
      <div className="space-y-5">
        {/* Valor del inmueble */}
        <SliderInput
          label="¿Cuánto cuesta el inmueble?"
          value={wizardState.valorTransferencia}
          onChange={(v) => updateWizard({ valorTransferencia: v })}
          min={10000}
          max={500000}
          step={5000}
        />

        {/* Manual input for exact amount */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--text-muted)]">Monto exacto:</span>
          <div className="relative flex-1 max-w-[200px]">
            <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)]">$</span>
            <Input
              id="valor-exacto"
              type="number"
              value={wizardState.valorTransferencia || ''}
              onChange={(e) =>
                updateWizard({
                  valorTransferencia: Math.max(0, Number(e.target.value)),
                })
              }
              className="pl-7"
              min={0}
            />
          </div>
        </div>

        {/* Avalúo catastral */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
              Avalúo catastral
              <a
                href="https://pam.quito.gob.ec/mdmq_web_cedcatastral/cat/buscarPredio.jsf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-primary hover:underline inline-flex items-center gap-0.5"
                title="Descargar cédula catastral del Municipio de Quito"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wizardState.usarMismoValorAvaluo}
              onChange={(e) =>
                updateWizard({ usarMismoValorAvaluo: e.target.checked })
              }
              className="w-4 h-4 rounded border-[var(--glass-border)] bg-bg-secondary text-accent-primary accent-[var(--accent-primary)]"
            />
            <span className="text-sm text-[var(--text-secondary)]">
              No conozco el avalúo, usar el mismo valor de compra
            </span>
          </label>

          {!wizardState.usarMismoValorAvaluo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative max-w-[260px]">
                <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)]">$</span>
                <Input
                  id="avaluo-catastral"
                  type="number"
                  placeholder="Ej: 85000"
                  value={wizardState.avaluoCatastral || ''}
                  onChange={(e) =>
                    updateWizard({
                      avaluoCatastral: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="pl-7"
                  hint="Descarga tu cédula catastral en pam.quito.gob.ec"
                  min={0}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Discounts (compact) */}
        <div className="pt-2 border-t border-[var(--glass-border)]">
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
            onClick={() => {
              const el = document.getElementById('descuentos-section')
              if (el) el.classList.toggle('hidden')
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            ¿Aplicas para algún descuento?
          </button>
          <div id="descuentos-section" className="hidden mt-3 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wizardState.esViviendaSocial}
                onChange={(e) =>
                  updateWizard({ esViviendaSocial: e.target.checked })
                }
                className="w-4 h-4 rounded border-[var(--glass-border)] bg-bg-secondary accent-[var(--accent-primary)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Vivienda de interés social (hasta $60,000)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wizardState.esTerceraEdad}
                onChange={(e) =>
                  updateWizard({ esTerceraEdad: e.target.checked })
                }
                className="w-4 h-4 rounded border-[var(--glass-border)] bg-bg-secondary accent-[var(--accent-primary)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Adulto mayor (65+ años)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wizardState.esDiscapacitado}
                onChange={(e) =>
                  updateWizard({ esDiscapacitado: e.target.checked })
                }
                className="w-4 h-4 rounded border-[var(--glass-border)] bg-bg-secondary accent-[var(--accent-primary)]"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                Persona con discapacidad
              </span>
            </label>
          </div>
        </div>
      </div>
    </WizardStep>
  )

  const renderStep2Seller = () => (
    <WizardStep
      question="¿Cuándo compraste este inmueble?"
      hint="Necesitamos estos datos para calcular el impuesto de plusvalía"
      onPrev={prevStep}
      onNext={handleNextStep}
      nextDisabled={!isStep3Valid}
      isLast
      nextLabel="Calcular"
    >
      <div className="space-y-5">
        <div>
          <Input
            id="fecha-adquisicion"
            type="date"
            label="Fecha en que compraste"
            value={wizardState.fechaAdquisicion}
            onChange={(e) =>
              updateWizard({ fechaAdquisicion: e.target.value })
            }
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            ¿Cuánto pagaste cuando compraste?
          </label>
          <div className="relative max-w-[260px]">
            <span className="absolute left-3 top-2.5 text-sm text-[var(--text-muted)]">$</span>
            <Input
              id="valor-adquisicion"
              type="number"
              placeholder="Ej: 70000"
              value={wizardState.valorAdquisicion || ''}
              onChange={(e) =>
                updateWizard({
                  valorAdquisicion: Math.max(0, Number(e.target.value)),
                })
              }
              className="pl-7"
              hint="El valor que consta en tu escritura de compra"
              min={0}
            />
          </div>
        </div>
      </div>
    </WizardStep>
  )

  // ============================================
  // RESULT VIEW
  // ============================================

  const renderResult = () => {
    if (!result) return null

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Total */}
        <TotalDisplay
          total={displayTotal}
          label={displayLabel}
          sublabel={
            wizardState.rol === 'comprador'
              ? `para un inmueble de $${wizardState.valorTransferencia.toLocaleString('es-EC')}`
              : `por vender un inmueble de $${wizardState.valorTransferencia.toLocaleString('es-EC')}`
          }
        />

        {/* Summary cards (non-technical, conceptual) */}
        {wizardState.rol === 'comprador' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            <SummaryCard label="Notaría" icon="📄" />
            <SummaryCard label="Municipio" icon="🏛️" />
            <SummaryCard label="Registro" icon="📋" />
            <SummaryCard label="Consejo Provincial" icon="🏢" />
          </motion.div>
        )}

        {wizardState.rol === 'vendedor' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 gap-3"
          >
            <SummaryCard label="Impuesto de Plusvalía (Utilidad)" icon="🏛️" />
          </motion.div>
        )}

        {/* Percentage indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-[var(--text-muted)]">
            Esto representa el{' '}
            <span className="font-semibold text-accent-primary">
              {wizardState.rol === 'comprador'
                ? result.resumen.porcentajeGastosComprador
                : result.resumen.porcentajeGastosVendedor}
              %
            </span>{' '}
            del valor del inmueble
          </p>
        </motion.div>

        {/* Lead capture section */}
        {!showEmailGate && !showLeadMenu && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <LeadMagnetsMenu
              onEmailClick={() => setShowEmailGate(true)}
              onChecklistClick={() => setShowEmailGate(true)}
            />
          </motion.div>
        )}

        {showEmailGate && (
          <EmailGate
            title="¿Quieres saber a dónde va tu dinero?"
            description="Recibe el desglose completo con cada costo detallado + checklist de documentos."
            source="presupuestador_inmobiliario"
            onSubmit={handleLeadSubmit}
          />
        )}

        {/* Reset */}
        <div className="text-center pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Calcular otro inmueble
          </Button>
        </div>
      </motion.div>
    )
  }

  // ============================================
  // STEP INDICATOR
  // ============================================

  const steps = wizardState.rol === 'vendedor'
    ? [{ label: 'Tipo' }, { label: 'Inmueble' }, { label: 'Historial' }]
    : [{ label: 'Tipo' }, { label: 'Inmueble' }]

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
              i < currentStep
                ? 'bg-accent-primary text-white'
                : i === currentStep
                  ? 'bg-accent-primary/20 text-accent-primary border-2 border-accent-primary'
                  : 'bg-bg-tertiary text-[var(--text-muted)]',
            )}
          >
            {i < currentStep ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span
            className={cn(
              'text-xs hidden sm:block',
              i <= currentStep ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]',
            )}
          >
            {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'w-8 h-0.5 rounded-full',
                i < currentStep ? 'bg-accent-primary' : 'bg-bg-tertiary',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="space-y-2">
      {!completed && renderStepIndicator()}

      <AnimatePresence mode="wait">
        {completed && result ? (
          <motion.div
            key="result"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderResult()}
          </motion.div>
        ) : (
          <motion.div
            key={`step-${currentStep}`}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {currentStep === 0 && renderStep0()}
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && wizardState.rol === 'vendedor' && renderStep2Seller()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-accent-error/10 border border-accent-error/30 rounded-lg"
        >
          <p className="text-sm text-accent-error">{error}</p>
        </motion.div>
      )}
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function SummaryCard({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-bg-secondary border border-[var(--glass-border)] rounded-xl">
      <span className="text-lg">{icon}</span>
      <span className="text-sm text-[var(--text-secondary)] font-medium">{label}</span>
    </div>
  )
}
