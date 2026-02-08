'use client'

import { useState } from 'react'
import { Calculator, Landmark, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { calcularArancelRegistro } from '@/lib/formulas/registro'
import { ResultadoRegistro } from '@/lib/formulas/types'
import { AnimatedCounter } from './animated-counter'

export function RegistroCalculatorWidget() {
  const [valorContrato, setValorContrato] = useState(50000)
  const [esTerceraEdad, setEsTerceraEdad] = useState(false)
  const [esDiscapacitado, setEsDiscapacitado] = useState(false)
  const [resultado, setResultado] = useState<ResultadoRegistro | null>(null)

  const handleCalcular = () => {
    const res = calcularArancelRegistro(valorContrato, esTerceraEdad, esDiscapacitado)
    setResultado(res)
  }

  return (
    <div className="space-y-6">
      {/* Valor del Contrato */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center gap-2">
          <Landmark className="w-4 h-4" />
          Valor del Contrato o Avalúo
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
          <input
            type="number"
            value={valorContrato}
            onChange={(e) => setValorContrato(Number(e.target.value))}
            min={0}
            step={100}
            className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent"
            placeholder="0.00"
          />
        </div>
        <Slider
          value={[valorContrato]}
          onValueChange={(value) => setValorContrato(value[0])}
          min={0}
          max={500000}
          step={1000}
        />
        <p className="text-xs text-[var(--text-secondary)]">
          Se considera el mayor valor entre el precio de venta y el avalúo catastral
        </p>
      </div>

      {/* Descuentos */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white">Descuentos Especiales</label>

        <label className="flex items-center gap-3 cursor-pointer group p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={esTerceraEdad}
            onChange={(e) => setEsTerceraEdad(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
          />
          <div className="flex-1">
            <span className="text-sm text-white block">Adulto Mayor (65+ años)</span>
            <span className="text-xs text-green-400">50% de descuento</span>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={esDiscapacitado}
            onChange={(e) => setEsDiscapacitado(e.target.checked)}
            className="w-5 h-5 rounded border-white/20 bg-white/5 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
          />
          <div className="flex-1">
            <span className="text-sm text-white block">Persona con Discapacidad</span>
            <span className="text-xs text-green-400">50% de descuento</span>
          </div>
        </label>
      </div>

      {/* Botón Calcular */}
      <Button
        onClick={handleCalcular}
        className="w-full py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 text-white font-semibold text-lg"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calcular Arancel de Registro
      </Button>

      {/* Resultados */}
      {resultado && (
        <Card className="p-6 bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border-[var(--accent-primary)]/30">
          <div className="space-y-6">
            {/* Total */}
            <div className="text-center">
              <p className="text-sm text-white/70 mb-2">Arancel de Inscripción</p>
              <div className="text-5xl font-bold text-white">
                $<AnimatedCounter value={resultado.arancelFinal} duration={0.8} />
              </div>
              {resultado.excedeMaximo && (
                <p className="text-xs text-amber-400 mt-2">
                  Se aplicó el límite máximo legal de $500
                </p>
              )}
            </div>

            {/* Detalles */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Rango Aplicado</span>
                <span className="text-white font-medium">Rango {resultado.rango}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Arancel Base</span>
                <span className="text-white">${resultado.arancelBase.toFixed(2)}</span>
              </div>

              {resultado.exceso && resultado.exceso > 0 && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Excedente</span>
                  <span className="text-white">${resultado.exceso.toLocaleString()}</span>
                </div>
              )}

              {resultado.descuentos.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {resultado.descuentos.map((descuento, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-green-400">
                        Descuento {descuento.tipo} ({(descuento.porcentaje * 100).toFixed(0)}%)
                      </span>
                      <span className="text-green-400">-${descuento.valor.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="font-medium text-white">Total a Pagar</span>
                <span className="font-bold text-[var(--accent-primary)]">
                  ${resultado.arancelFinal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Información de rangos */}
      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
          <Landmark className="w-4 h-4" />
          Tabla de Aranceles del Registro
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$0 - $3,000</span>
            <span className="text-white">$22</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$3,001 - $6,600</span>
            <span className="text-white">$30</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$6,601 - $10,000</span>
            <span className="text-white">$35</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$10,001 - $15,000</span>
            <span className="text-white">$40</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$15,001 - $25,000</span>
            <span className="text-white">$50</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$25,001 - $30,000</span>
            <span className="text-white">$100</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$30,001 - $35,000</span>
            <span className="text-white">$160</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$35,001 - $40,000</span>
            <span className="text-white">$200</span>
          </div>
          <div className="col-span-2 flex justify-between py-1 border-b border-white/5">
            <span className="text-[var(--text-secondary)]">$40,001 en adelante</span>
            <span className="text-white">Fórmula especial (Máx. $500)</span>
          </div>
        </div>
      </Card>

      {/* Nota legal */}
      <div className="flex items-start gap-2 text-xs text-[var(--text-secondary)] bg-white/5 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Los valores son referenciales según la normativa del Registro de la Propiedad del Ecuador.
          En ningún caso el arancel excederá los $500. Descuentos aplicables únicamente con
          documentación que acredite la condición.
        </p>
      </div>
    </div>
  )
}
