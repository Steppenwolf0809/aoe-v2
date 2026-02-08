import { MunicipalInput, CalculoDetallado } from '@/types/calculators';
import { calcularImpuestosMunicipales } from './municipal';
import { calcularArancelRegistro } from './registro';
import { calcularTarifaNotarialDeterminada, calcularTotalNotaria } from './notarial';

export interface InmobiliarioInput extends MunicipalInput {
    // Hereda fecha, valores, catastral, tipos.
    // Adicionales para registro/notaría si fueran necesarios
    esTerceraEdad?: boolean;
    esDiscapacidad?: boolean;
    gastosVarios?: number; // Copias, certificaciones etc.
}

export function calcularPresupuestoInmobiliario(input: InmobiliarioInput): CalculoDetallado {

    // 1. Impuestos Municipales (Alcabala + Utilidad)
    const municipal = calcularImpuestosMunicipales(input);

    // 2. Registro de la Propiedad (Aranceles)
    // Usamos el mayor valor entre transferencia y avalúo? 
    // Generalmente Registro cobra sobre el avalúo contractual (precio venta), salvo que avalúo sea mayor.
    // Usaremos el valor de transferencia para ser conservadores (o el mayor).
    const baseRegistro = Math.max(input.valorTransferencia, input.avaluoCatastral);
    const registroCalc = calcularArancelRegistro(baseRegistro, input.esTerceraEdad);
    const registro = {
        total: registroCalc.arancelFinal,
        detalles: registroCalc
    };

    // 3. Notaría (Tarifas)
    // También sobre cuantía (mayor valor)
    const baseNotaria = Math.max(input.valorTransferencia, input.avaluoCatastral);
    const tarifaNotarial = calcularTarifaNotarialDeterminada(baseNotaria, 'transferenciaDominio');
    const notaria = calcularTotalNotaria(tarifaNotarial); // Calcula IVA

    // 4. Otros Gastos (Estimado)
    const otrosGastos = input.gastosVarios || 60; // Certificados, copias, anexos.

    // 5. Total Estimado (SOLO GASTOS DE TERCEROS)
    const totalTerceros = municipal.total + registro.total + notaria.total + otrosGastos;

    return {
        municipal: municipal,
        registro: registro,
        notaria: notaria,
        otrosGastos: otrosGastos,
        totalEstimado: totalTerceros
    };
    // Nota: El honorario de abogado ($500) NO se incluye aquí, se maneja en la capa de UI/Producto.
}
