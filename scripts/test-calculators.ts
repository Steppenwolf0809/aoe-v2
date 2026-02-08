import { calcularCostoVehicular } from '../src/lib/calculators/vehicular';
import { obtenerPrecioServicio } from '../src/lib/calculators/servicios-menores';
import { calcularImpuestosMunicipales } from '../src/lib/calculators/municipal';
import { calcularArancelRegistro } from '../src/lib/calculators/registro';

console.log('--- TEST CALCULADORAS ---\n');

// 1. Vehicular
console.log('1. Vehículo $15,000');
const vehiculo = calcularCostoVehicular(15000);
console.log(JSON.stringify(vehiculo, null, 2));

// 2. Servicios Menores
console.log('\n2. Poder');
const poder = obtenerPrecioServicio('poder');
console.log(JSON.stringify(poder, null, 2));

// 3. Municipal (Inmueble)
console.log('\n3. Inmueble Compraventa $80,000 (Avalúo $60,000)');
// Fecha compra 2010, Venta 2026
const municipal = calcularImpuestosMunicipales({
    fechaAdquisicion: '2010-01-01',
    fechaTransferencia: '2026-02-07',
    valorTransferencia: 80000,
    valorAdquisicion: 40000,
    avaluoCatastral: 60000,
    tipoTransferencia: 'Compraventa',
    tipoTransferente: 'Natural'
});
console.log(JSON.stringify(municipal, null, 2));

// 4. Registro
console.log('\n4. Registro Propiedad $80,000');
const registro = calcularArancelRegistro(80000);
console.log(JSON.stringify(registro, null, 2));
