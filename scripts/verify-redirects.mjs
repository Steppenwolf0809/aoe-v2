import { strict as assert } from 'node:assert';
// fetch is global in Node 18+

const BASE_URL = 'http://localhost:3000'; // Adjust if your local server runs on a different port

const REDIRECTS = [
    // Defined in next.config.ts
    { source: '/documentos', destination: '/servicios' },
    { source: '/documentos-ai', destination: '/servicios' },
    { source: '/servicios/documentos-ai', destination: '/servicios' },
    { source: '/documentos/transferencia', destination: '/calculadoras/inmuebles' },
    { source: '/servicios/transferencia', destination: '/servicios/compraventa-inmuebles' },
    { source: '/documentos/promesa', destination: '/servicios/promesa-compraventa' },
    { source: '/servicios/promesa', destination: '/servicios/promesa-compraventa' },
    { source: '/servicios/poderes', destination: '/calculadoras/notarial' },
    { source: '/documentos/poderes', destination: '/calculadoras/notarial' },
    { source: '/servicios/declaraciones', destination: '/calculadoras/notarial' },
    { source: '/documentos/declaraciones', destination: '/calculadoras/notarial' },
    { source: '/servicios/viaje', destination: '/calculadoras/notarial' },
    { source: '/documentos/viaje', destination: '/calculadoras/notarial' },
    { source: '/documentos/contratos', destination: '/calculadoras/vehiculos' },
    { source: '/servicios/contratos', destination: '/calculadoras/vehiculos' },
];

async function verifyRedirects() {
    console.log(`Starting redirect verification against ${BASE_URL}...\n`);
    let successCount = 0;
    let failCount = 0;

    for (const { source, destination } of REDIRECTS) {
        try {
            const response = await fetch(`${BASE_URL}${source}`, { redirect: 'manual' });

            // Check for 301 (Moved Permanently) or 308 (Permanent Redirect) or 307 (Temporary Redirect - unlikely for permanent)
            // Next.js often uses 308 for "permanent: true" redirects to preserve method
            const status = response.status;
            const location = response.headers.get('location');

            if (status === 301 || status === 308 || status === 307) {
                // Handle relative or absolute location headers
                const normalizedLocation = location.startsWith('http')
                    ? new URL(location).pathname
                    : location;

                if (normalizedLocation === destination) {
                    console.log(`✅ [PASS] ${source} -> ${destination} (${status})`);
                    successCount++;
                    continue;
                } else {
                    console.error(`❌ [FAIL] ${source} redirected to ${normalizedLocation}, expected ${destination}`);
                }
            } else {
                console.error(`❌ [FAIL] ${source} returned status ${status} (expected redirect)`);
            }
            failCount++;

        } catch (error) {
            console.error(`❌ [ERROR] Failed to fetch ${source}: ${error.message}`);
            failCount++;
        }
    }

    console.log(`\nverification complete: ${successCount} passed, ${failCount} failed.`);

    if (failCount > 0) {
        process.exit(1);
    }
}

verifyRedirects();
