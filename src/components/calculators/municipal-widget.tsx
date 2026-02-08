'use client'

import { useState } from 'react'
import { Calculator, Home, ArrowRightLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { calcularImpuestosMunicipales } from '@/lib/formulas/municipal'
import { ResultadoMunicipal } from '@/lib/formulas/types'
import { AnimatedCounter } from './animated-counter'

export function MunicipalCalculatorWidget() {
  const [fechaAdquisicion, setFechaAdquisicion] = useState('')
  const [fechaTransferencia, setFechaTransferencia] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [valorTransferencia, setValorTransferencia] = useState(100000)
  const [valorAdquisicion, setValorAdquisicion] = useState(80000)
  const [avaluoCatastral, setAvaluoCatastral] = useState(95000)
  const [tipoTransferencia, setTipoTransferencia] = useState<'Compraventa' | 'Donación' | 'Dación en pago'>('Compraventa')
  const [tipoTransferente, setTipoTransferente] = useState<'Natural' | 'Inmobiliaria'>('Natural')
  const [mejoras, setMejoras] = useState(0)
  const [resultado, setResultado] = useState<ResultadoMunicipal | null>(null)

  const handleCalcular = () => {
    if (!fechaAdquisicion || !fechaTransferencia) return

    const res = calcularImpuestosMunicipales({
      fechaAdquisicion,
      fechaTransferencia,
      valorTransferencia,
      valorAdquisicion,
      avaluoCatastral,
      tipoTransferencia,
      tipoTransferente,
      mejoras,
    })

    setResultado(res)
  }

  return (
    <div className="space-y-6">
      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Fecha de Adquisición</label>
          <input
            type="date"
            value={fechaAdquisicion}
            onChange={(e) => setFechaAdquisicion(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Fecha de Transferencia</label>
          <input
            type="date"
            value={fechaTransferencia}
            onChange={(e) => setFechaTransferencia(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tipo de Transferencia */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Tipo de Transferencia</label>
        <div className="grid grid-cols-3 gap-2">
          {(['Compraventa', 'Donación', 'Dación en pago'] as const).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoTransferencia(tipo)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                tipoTransferencia === tipo
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de Transferente */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Tipo de Transferente (Vendedor)</label>
        <div className="grid grid-cols-2 gap-2">
          {(['Natural', 'Inmobiliaria'] as const).map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoTransferente(tipo)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                tipoTransferente === tipo
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {tipo === 'Natural' ? 'Persona Natural' : 'Inmobiliaria'}
            </button>
          ))}
        </div>
      </div>

      {/* Valores */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Valor de Transferencia (Venta)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <input
              type="number"
              value={valorTransferencia}
              onChange={(e) => setValorTransferencia(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Valor de Adquisición (Compra)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <input
              type="number"
              value={valorAdquisicion}
              onChange={(e) => setValorAdquisicion(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
          <Slider
            value={[valorAdquisicion]}
            onValueChange={(value) => setValorAdquisicion(value[0])}
            min={0}
            max={500000}
            step={1000}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white flex items-center gap-2">
            <Home className="w-4 h-4" />
            Avalúo Catastral
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <input
              type="number"
              value={avaluoCatastral}
              onChange={(e) => setAvaluoCatastral(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Valor de Mejoras (opcional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <input
              type="number"
              value={mejoras}
              onChange={(e) => setMejoras(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Botón Calcular */}
      <Button
        onClick={handleCalcular}
        disabled={!fechaAdquisicion || !fechaTransferencia}
        className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-semibold text-lg disabled:opacity-50"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calcular Impuestos Municipales
      </Button>

      {/* Resultados */}
      {resultado && (
        <div className="space-y-4">
          {/* Resumen General */}
          <Card className="p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30">
            <div className="text-center mb-6">
              <p className="text-sm text-white/70 mb-2">Total Impuestos a Pagar</p>
              <div className="text-5xl font-bold text-white">
                $<AnimatedCounter value={resultado.total} duration={0.8} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-white/60 mb-1">Vendedor (Utilidad)</p>
                <p className="text-xl font-semibold text-white">
                  ${resultado.totalVendedor.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 mb-1">Comprador (Alcabala)</p>
                <p className="text-xl font-semibold text-white">
                  ${resultado.totalComprador.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Detalle de Utilidad (Vendedor) */}
          {resultado.utilidad.impuesto > 0 && (
            <Card className="p-5 bg-white/5 border-white/10">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                Impuesto a la Utilidad (Vendedor)
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Utilidad Bruta</span>
                  <span className="text-white">${resultado.utilidad.utilidadBruta.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Años de Tenencia</span>
                  <span className="text-white">{resultado.utilidad.añosTranscurridos} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Deducción por Tiempo</span>
                  <span className="text-green-400">
                    -${resultado.utilidad.deduccionTiempo.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-[var(--text-secondary)]">Base Imponible</span>
                  <span className="text-white">${resultado.utilidad.baseImponible.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Tarifa Aplicada</span>
                  <span className="text-white">{resultado.utilidad.tarifaDescripcion}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="font-medium text-white">Impuesto a la Utilidad</span>
                  <span className="font-semibold text-orange-400">
                    ${resultado.utilidad.impuesto.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Detalle de Alcabala (Comprador) */}
          <Card className="p-5 bg-white/5 border-white/10">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              Impuesto de Alcabala (Comprador)
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Base Imponible</span>
                <span className="text-white">${resultado.alcabala.baseImponible.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Tarifa Base</span>
                <span className="text-white">1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Meses Transcurridos</span>
                <span className="text-white">{resultado.alcabala.mesesTranscurridos} meses</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Rebaja Aplicada</span>
                <span className="text-green-400">{resultado.alcabala.rebajaDescripcion}</span>
              </div>
              {resultado.alcabala.rebaja > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Valor Rebaja</span>
                  <span className="text-green-400">-${resultado.alcabala.rebaja.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="font-medium text-white">Impuesto de Alcabala</span>
                <span className="font-semibold text-blue-400">
                  ${resultado.alcabala.impuesto.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Nota legal */}
      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-white/5 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Los cálculos son referenciales para la ciudad de Quito. Las tarifas de impuestos municipales
          pueden variar según la ordenanza vigente. Se recomienda verificar con el Municipio.
        </p>
      </div>
    </div>
  )
}
