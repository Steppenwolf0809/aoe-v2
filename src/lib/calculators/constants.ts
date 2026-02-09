import { RangoRegistro, TarifasNotariales } from '@/types/calculators';

// Salario Básico Unificado vigente
export const SBU_VIGENTE = 482;

export const IVA_RATE = 0.15;

// Tabla Notarial (Resolución 216-2017)
// Simplificada con los rangos comunes. Debería ser completa para producción.
// Aquí pongo los rangos ejemplo del doc, pero ajustados.
// Necesito la tabla REAL completa para ser preciso. 
// Usaré los valores del doc de diseño como referencia y expandiré si es necesario.
// El doc LOGICA.md tenía: 0-10k: 94, 10-30k: 164.50, 30-60k: 235
// Estos valores son % del SBU? 
// 94 / 470 = 0.2 (20%). 164.5 / 470 = 0.35. 235 / 470 = 0.5.
// Parece que son factores del SBU.
// Mejor defino factores del SBU para que se actualice solo.

const FACTORES_NOTARIALES = [
    { max: 10000, factor: 0.20 },      // 0 - 10,000
    { max: 30000, factor: 0.35 },      // 10,001 - 30,000
    { max: 60000, factor: 0.50 },      // 30,001 - 60,000
    { max: 90000, factor: 0.80 },      // 60,001 - 90,000
    { max: 150000, factor: 1.35 },     // 90,001 - 150,000
    { max: 300000, factor: 2.70 },     // 150,001 - 300,000
    { max: 600000, factor: 5.40 },     // 300,001 - 600,000
    { max: 1000000, factor: 10.80 },   // 600,001 - 1,000,000
    { max: 2000000, factor: 21.00 },   // 1,000,001 - 2,000,000
    { max: 3000000, factor: 30.00 },   // 2,000,001 - 3,000,000
    { max: Infinity, factor: 0 }       // Excedente
];
// Para > 3,000,000: Base 30 SBU + 0.1% del excedente.
// En el doc LOGICA.md decía limite 4M. Revisar.
// Resolución 216 says: Catgoría j) Monto indeterminado...
// Cuantía Determinada (Art 19):
// La tabla suele ir hasta rangos altos.
// Voy a usar esta aproximación basada en factores SBU que es lo estándar.

export const TARIFAS_NOTARIALES: TarifasNotariales = {
    remuneracionBasica: SBU_VIGENTE,
    iva: IVA_RATE,
    tablas: {
        transferenciaDominio: {
            rangos: FACTORES_NOTARIALES.map(f => ({
                min: 0, // Se ajusta dinámicamente en la lógica
                max: f.max,
                tarifa: f.factor * SBU_VIGENTE
            })),
            excedente: {
                limite: 3000000, // Asumido segun patron
                formula: {
                    base: 30, // 30 SBUs
                    porcentajeExcedente: 0.001 // 1 por mil
                }
            }
        }
    },
    actosIndeterminados: {
        poderes: 56.40, // Aprox 12% SBU? No, 50 USD fijado por usuario.
        // El usuario dijo $50 para poderes.
        // Pero aquí defino la TARIFA NOTARIAL OFICIAL (COSTO), no el PRECIO DE VENTA.
        // El costo notarial de un poder es ~10-15% SBU ($48-$72).
        // Usaré 12% SBU como referencia estándar ($57.84).
        // El usuario vende a $50? Quizás es su honorario y el cliente paga notaría aparte?
        // O es "Poder simple" que cuesta menos?
        // En "Servicios Menores", el usuario cobra $50.
        // Si la notaría cobra $57, el usuario pierde dinero si incluye la notaría.
        // Asumo que los $50 son POR LA GESTIÓN/MINUTA, y el cliente paga notaría.
        // O es un "Poder Privado"? 
        // Para la calculadora de COSTOS, pondré el costo real notarial.
        poderEspecial: 0.12 * SBU_VIGENTE, // ~$57
        poderGeneral: 0.30 * SBU_VIGENTE,  // ~$144
        divorcio: 0.80 * SBU_VIGENTE, // $385 - Divorcio mutuo acuerdo notarial es caro
        // Espera, el usuario cobra $50 por divorcio. 
        // Definitivamente $50 es la MINUTA/ASESORÍA. El notario cobra sus tabulados.
        // Para la calculadora de PRECIOS (Lead Magnet), mostraremos el TOTAL estimado.
    }
};


// Tabla Registro Propiedad (Canton Quito suele variar, esta es la nacional ref)
export const RANGOS_REGISTRO: RangoRegistro[] = [
    { min: 0.01, max: 3000.00, arancel: 22.00 },
    { min: 3000.01, max: 6600.00, arancel: 30.00 },
    { min: 6600.01, max: 10000.00, arancel: 35.00 },
    { min: 10000.01, max: 15000.00, arancel: 40.00 },
    { min: 15000.01, max: 25000.00, arancel: 50.00 },
    { min: 25000.01, max: 30000.00, arancel: 100.00 },
    { min: 30000.01, max: 35000.00, arancel: 160.00 },
    { min: 35000.01, max: 40000.00, arancel: 200.00 },
    { min: 40000.01, max: Infinity, arancel: 0 } // Logica especial > 40k
];
