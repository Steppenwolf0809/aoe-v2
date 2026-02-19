require('dotenv').config({ path: '.env' });
const https = require('https');

const API_URL = 'https://pay.payphonetodoesposible.com/api';
const token = process.env.PAYPHONE_TOKEN;

function get(path) {
    return new Promise((resolve) => {
        https.get(`${API_URL}${path}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data }));
        });
    });
}

async function test() {
    console.log("Get /Sale/client/AOE123TEST:");
    console.log(await get('/Sale/client/AOE123TEST'));
}
test();
