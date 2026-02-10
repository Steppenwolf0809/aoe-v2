
import http from 'http';

const REDIRECTS = new Map([
    ['/documentos', '/servicios'],
    ['/documentos-ai', '/servicios'],
    ['/servicios/documentos-ai', '/servicios'],
    ['/documentos/transferencia', '/calculadoras/inmuebles'],
    ['/servicios/transferencia', '/servicios/transferencia-de-dominio'],
    ['/documentos/promesa', '/servicios/promesa-compraventa'],
    ['/servicios/promesa', '/servicios/promesa-compraventa'],
    ['/servicios/poderes', '/calculadoras/servicios'],
    ['/documentos/poderes', '/calculadoras/servicios'],
    ['/servicios/declaraciones', '/calculadoras/servicios'],
    ['/documentos/declaraciones', '/calculadoras/servicios'],
    ['/servicios/viaje', '/calculadoras/servicios'],
    ['/documentos/viaje', '/calculadoras/servicios'],
    ['/documentos/contratos', '/calculadoras/vehiculos'],
    ['/servicios/contratos', '/calculadoras/vehiculos'],
]);

const BASE_URL = 'http://localhost:3000';

async function checkRedirect(path: string, expectedDest: string) {
    return new Promise<void>((resolve) => {
        const req = http.request(`${BASE_URL}${path}`, { method: 'HEAD', followRedirect: false }, (res) => {
            const location = res.headers.location;
            const status = res.statusCode;

            if (status === 301 || status === 308) {
                if (location === expectedDest || location === `${BASE_URL}${expectedDest}`) {
                    console.log(`✅ ${path} -> ${location}`);
                } else {
                    console.error(`❌ ${path} -> ${location} (Expected: ${expectedDest})`);
                }
            } else {
                console.error(`❌ ${path} -> Status ${status} (Expected 301/308 redirect to ${expectedDest})`);
            }
            resolve();
        });

        req.on('error', (e) => {
            console.error(`❌ ${path} -> Connection error: ${e.message}`);
            resolve();
        });

        req.end();
    });
}

async function run() {
    console.log('--- Verifying Redirects ---');
    console.log(`Target: ${BASE_URL}\n`);

    for (const [path, dest] of REDIRECTS) {
        await checkRedirect(path, dest);
    }
}

run();
