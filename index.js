const fetch = require('node-fetch');
const VERCEL_PROXY_URL = "https://gemini-proxy-ten-bay.vercel.app/api/proxy";

exports.main = async (event, context) => {
    const geminiApiPath = event.path;
    const finalVercelUrl = `${VERCEL_PROXY_URL}?path=${geminiApiPath.substring(1)}`;
    console.log("Requesting URL:", finalVercelUrl);

    try {
        const response = await fetch(finalVercelUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: event.body, 
        });
        const responseData = await response.json();
        console.log("Received data from Vercel.");

        return {
            isBase64Encoded: false,
            statusCode: response.status,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responseData),
        };
    } catch (error) {
        console.error('Error occurred in Tencent SCF:', error);
        return {
            isBase64Encoded: false,
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Internal Server Error in Tencent Cloud Function' }),
        };
    }
};
