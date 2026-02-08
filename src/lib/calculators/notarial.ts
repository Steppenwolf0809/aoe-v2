import { TarifasNotariales, TablaNotarial } from '@/types/calculators';
import { TARIFAS_NOTARIALES, SBU_VIGENTE } from '@/lib/calculators/constants';

export function calcularTarifaNotarialDeterminada(
    monto: number,
    tipoActo: 'transferenciaDominio' | 'hipoteca' | 'otros' = 'transferenciaDominio'
): number {
    const tabla = TARIFAS_NOTARIALES.tablas[tipoActo] || TARIFAS_NOTARIALES.tablas['transferenciaDominio'];

    if (!tabla) return 0;

    // Buscar rango
    const rango = tabla.rangos.find(r => monto >= r.min && monto <= r.max);

    if (rango) {
        return rango.tarifa;
    }

    // Si no está en rangos, verificar excedente
    // Asumimos el último rango es el límite para excedente en la lógica simplificada
    // Pero la estructura correcta usa tabla.excedente
    if (tabla.excedente && monto > tabla.excedente.limite) {
        const baseExcedente = tabla.excedente.limite;
        const montoExcedente = monto - baseExcedente;

        // Formula: Base (ej 30 SBU) + % excedente
        const tarifaBase = tabla.excedente.formula.base * SBU_VIGENTE;
        const tarifaExcedente = montoExcedente * tabla.excedente.formula.porcentajeExcedente;

        return tarifaBase + tarifaExcedente;
    }

    return 0;
}

export function calcularCostoReconocimientoFirma(numFirmas: number = 1): number {
    // 3% SBU por firma (aprox)
    const tarifaPorFirma = SBU_VIGENTE * 0.03;
    return tarifaPorFirma * numFirmas;
}

export function calcularTotalNotaria(subtotal: number): {
    subtotal: number;
    iva: number;
    total: number;
} {
    const iva = subtotal * TARIFAS_NOTARIALES.iva;
    return {
        subtotal,
        iva,
        total: subtotal + iva
    };
}
