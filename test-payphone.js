require('dotenv').config({ path: '.env' });
const https = require('https');

const API_URL = 'https://pay.payphonetodoesposible.com/api/Sale';
const token = process.env.PAYPHONE_TOKEN;

function get(path) {
    return new Promise((resolve) => {
        https.get(`${API_URL}${path}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
    });
}

async function test() {
    console.log("By ClientTx:");
    console.log(await get('/clientTransaction/78611865')); // just testing endpoints
    console.log(await get('/clientTx/78611865'));

    // What about getting the latest DB entry to see what clientTransactionId was used?
}
test();
