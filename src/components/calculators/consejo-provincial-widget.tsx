'use client'

import { useState } from 'react'
import { Calculator, Building, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  calcularConsejoProvincial,
  calcularAlcabalaYConsejoProvincial,
} from '@/lib/formulas/consejo-provincial'
import { AnimatedCounter } from './animated-counter'

export function ConsejoProvincialCalculatorWidget() {
  const [modoCalculo, setModoCalculo] = useState<'simple' | 'completo'>('completo')

  // Modo simple: solo ingresa valor de alcabala
  const [valorAlcabala, setValorAlcabala] = useState(1000)

  // Modo completo: ingresa datos del inmueble
  const [valorTransferencia, setValorTransferencia] = useState(100000)
  const [avaluoCatastral, setAvaluoCatastral] = useState(95000)
  const [mesesTranscurridos, setMesesTranscurridos] = useState(24)

  const [resultado, setResultado] = useState<
    ReturnType<typeof calcularConsejoProvincial> | null
  >(null)
  const [resultadoCompleto, setResultadoCompleto] = useState<
    ReturnType<typeof calcularAlcabalaYConsejoProvincial> | null
  >(null)

  const handleCalcular = () => {
    if (modoCalculo === 'simple') {
      const res = calcularConsejoProvincial(valorAlcabala)
      setResultado(res)
      setResultadoCompleto(null)
    } else {
      const res = calcularAlcabalaYConsejoProvincial(
        valorTransferencia,
        avaluoCatastral,
        mesesTranscurridos
      )
      setResultadoCompleto(res)
      setResultado(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Selector de modo */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">Modo de Cálculo</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setModoCalculo('completo')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              modoCalculo === 'completo'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            Calcular desde cero
          </button>
          <button
            onClick={() => setModoCalculo('simple')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              modoCalculo === 'simple'
                ? 'bg-[var(--accent-primary)] text-white'
                : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            }`}
          >
            Ya tengo el valor de Alcabala
          </button>
        </div>
      </div>

      {/* Inputs según modo */}
      {modoCalculo === 'simple' ? (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">
            Valor del Impuesto de Alcabala ($)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
            <input
              type="number"
              value={valorAlcabala}
              onChange={(e) => setValorAlcabala(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <Slider
            value={[valorAlcabala]}
            onValueChange={(value) => setValorAlcabala(value[0])}
            min={0}
            max={5000}
            step={10}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Valor de transferencia */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Valor de Transferencia ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                type="number"
                value={valorTransferencia}
                onChange={(e) => setValorTransferencia(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              />
            </div>
            <Slider
              value={[valorTransferencia]}
              onValueChange={(value) => setValorTransferencia(value[0])}
              min={0}
              max={500000}
              step={1000}
            />
          </div>

          {/* Avalúo catastral */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">Avalúo Catastral ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                type="number"
                value={avaluoCatastral}
                onChange={(e) => setAvaluoCatastral(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-3 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
              />
            </div>
            <Slider
              value={[avaluoCatastral]}
              onValueChange={(value) => setAvaluoCatastral(value[0])}
              min={0}
              max={500000}
              step={1000}
            />
          </div>

          {/* Meses transcurridos */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-text-primary">
              Meses desde la adquisición anterior
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={mesesTranscurridos}
                onChange={(e) => setMesesTranscurridos(Number(e.target.value))}
                min={0}
                max={480}
                className="w-24 px-3 py-2 bg-bg-secondary border border-[var(--glass-border)] rounded-lg text-text-primary text-center"
              />
              <Slider
                value={[mesesTranscurridos]}
                onValueChange={(value) => setMesesTranscurridos(value[0])}
                min={0}
                max={60}
                step={1}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">
              Esto determina la rebaja en la alcabala: {' '}
              {mesesTranscurridos <= 12 && '40% primer año'}
              {mesesTranscurridos > 12 && mesesTranscurridos <= 24 && '30% segundo año'}
              {mesesTranscurridos > 24 && mesesTranscurridos <= 36 && '20% tercer año'}
              {mesesTranscurridos > 36 && mesesTranscurridos <= 48 && '10% cuarto año'}
              {mesesTranscurridos > 48 && 'Sin rebaja'}
            </p>
          </div>
        </div>
      )}

      {/* Botón Calcular */}
      <Button
        onClick={handleCalcular}
        className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-semibold text-lg"
      >
        <Calculator className="w-5 h-5 mr-2" />
        {modoCalculo === 'simple'
          ? 'Calcular Consejo Provincial'
          : 'Calcular Alcabala + Consejo Provincial'}
      </Button>

      {/* Resultados Modo Simple */}
      {resultado && modoCalculo === 'simple' && (
        <Card className="p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-2">Contribución al Consejo Provincial</p>
              <div className="text-5xl font-bold text-text-primary">
                $<AnimatedCounter value={resultado.total} duration={0.8} />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[var(--glass-border)] text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Base (Alcabala)</span>
                <span className="text-text-primary">${resultado.baseCalculo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">10% de Alcabala</span>
                <span className="text-text-primary">${resultado.valorPorcentaje.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Valor Fijo</span>
                <span className="text-text-primary">${resultado.valorFijo.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Resultados Modo Completo */}
      {resultadoCompleto && modoCalculo === 'completo' && (
        <div className="space-y-4">
          {/* Total */}
          <Card className="p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-2">Total Impuestos Municipales</p>
              <div className="text-5xl font-bold text-text-primary">
                $<AnimatedCounter value={resultadoCompleto.totalImpuestos} duration={0.8} />
              </div>
            </div>
          </Card>

          {/* Alcabala */}
          <Card className="p-5">
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Impuesto de Alcabala
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Base Imponible</span>
                <span className="text-text-primary">
                  ${resultadoCompleto.baseImponibleAlcabala.toLocaleString()}
                </span>
              </div>
              {resultadoCompleto.rebajaAplicada > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">
                    Rebaja ({(resultadoCompleto.rebajaAplicada * 100).toFixed(0)}%)
                  </span>
                  <span className="text-green-400">
                    -
                    {(
                      resultadoCompleto.baseImponibleAlcabala *
                      0.01 *
                      resultadoCompleto.rebajaAplicada
                    ).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-[var(--glass-border)]">
                <span className="font-medium text-text-primary">Alcabala</span>
                <span className="font-semibold text-blue-400">
                  ${resultadoCompleto.impuestoAlcabala.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* Consejo Provincial */}
          <Card className="p-5">
            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Consejo Provincial de Pichincha
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Base (Alcabala)</span>
                <span className="text-text-primary">
                  ${resultadoCompleto.baseConsejoProvincial.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">10% de Alcabala</span>
                <span className="text-text-primary">
                  ${resultadoCompleto.valorPorcentaje.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Valor Fijo</span>
                <span className="text-text-primary">${resultadoCompleto.valorFijo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--glass-border)]">
                <span className="font-medium text-text-primary">Consejo Provincial</span>
                <span className="font-semibold text-purple-400">
                  ${resultadoCompleto.impuestoConsejoProvincial.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Fórmula explicada */}
      <Card className="p-5">
        <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Building className="w-4 h-4" />
          ¿Cómo se calcula?
        </h4>
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          <p>
            <strong className="text-text-primary">Fórmula:</strong>
          </p>
          <code className="block p-3 bg-bg-tertiary rounded-lg text-[var(--accent-primary)]">
            Consejo Provincial = (Alcabala × 10%) + $1.80
          </code>
          <p className="mt-3">
            La contribución al Consejo Provincial de Pichincha se calcula sobre el valor pagado por
            el impuesto de alcabala, aplicando un 10% más un valor fijo de $1.80.
          </p>
        </div>
      </Card>

      {/* Nota legal */}
      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-bg-secondary p-3 rounded-lg">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Esta calculadora aplica para inmuebles ubicados en el Distrito Metropolitano de Quito
          (Pichincha). El valor calculado es referencial. Verifique el valor oficial en el Consejo
          Provincial de Pichincha antes de realizar el pago.
        </p>
      </div>
    </div>
  )
}
