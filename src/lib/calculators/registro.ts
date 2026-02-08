import { RANGOS_REGISTRO } from '@/lib/calculators/constants';
import { ResultadoRegistro } from '@/types/calculators';

export function calcularArancelRegistro(valorContrato: number, esTerceraEdad: boolean = false): ResultadoRegistro {
    if (valorContrato <= 0) {
        return { arancelBase: 0, descuentos: 0, arancelFinal: 0, excedeMaximo: false };
    }

    let arancel = 0;

    // Buscar en rangos
    const rango = RANGOS_REGISTRO.find(r => valorContrato >= r.min && valorContrato <= r.max);

    if (rango && rango.max !== Infinity) {
        arancel = rango.arancel;
    } else {
        // Excedente (> 40,000 según tabla constante)
        // La tabla constante tenía max: Infinity en el último elemento (index 8)
        // Lógica: $200 base? No, la tabla decía otra cosa en el MD.
        // MD: "Rango 9... $100 + 0.5% del exceso de $10,000" <- Esto parece contradictorio con los rangos anteriores.
        // Revisar MD:
        // Rango 8: 35k-40k -> $200.
        // Rango 9: >40k -> $100 + 0.5% exceso 10k? No tiene sentido que baje la base.
        // Probablemente es: Base del rango anterior + porcentaje.
        // Asumiremos la lógica estándar de registro: 
        // Cobran un % (ej 0.5%) sobre el excedente de cierto monto, más una base.

        // Usaremos la lógica del MD "Rango 9" literalmente si es lo documentado, pero con cuidado.
        // MD dice: "$100 + 0.5% del exceso de $10,000".
        // Si valor es 40,001:
        // Exceso 10k = 30,001. 
        // 0.5% de 30,001 = 150.
        // 100 + 150 = 250.
        // Rango anterior (35-40k) era 200. Tiene sentido (sube).

        const exceso = valorContrato - 10000;
        arancel = 100 + (exceso * 0.005);
    }

    // Límite máximo $500
    const LIMITE = 500;
    const excedeMaximo = arancel > LIMITE;
    let arancelFinal = Math.min(arancel, LIMITE);

    let descuentos = 0;
    if (esTerceraEdad) {
        const descuento = arancelFinal * 0.5;
        descuentos = descuento;
        arancelFinal -= descuento;
    }

    return {
        arancelBase: arancel,
        arancelFinal,
        descuentos,
        excedeMaximo
    };
}
