const fs = require('fs'); // ES6 MODULE
const qrcode = require('qrcode-terminal'); // KODE QR GENERATOR
const { Client, LocalAuth } = require('whatsapp-web.js'); // WA WEB 
const { Configuration, OpenAIApi} = require("openai"); // OPENAI API
require('dotenv').config();



// Deteksi sesi login yang tersimpan, jika sudah pernah login sebelumnya
const client = new Client({
    authStrategy: new LocalAuth()
});

// Scan QR Code, jika belum pernah login
client.on('qr',(qr) => {
    console.log('Scan QR Code ini\n');
    qrcode.generate(qr, { small: true });
});

// Client telah pernah login dan sudah terautentikasi
client.on('authenticated', (session) => {
    console.log('Client telah terautentikasi');
});

// Bot telah siap digunakan
client.on('ready', () => {
    console.log('Bot telah online!');
});

client.initialize();


// KONFIGURASI OPENAI API
const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY,
});
const openai = new OpenAIApi(configuration);


// FUNGSI BALASAN PESAN
//
client.on('message', message => {
    console.log(message.body);
    if(message.body) {
        runCompletion(message.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion (message) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 4000,
    });
    return completion.data.choices[0].text;
};
//
// FUNGSI BALASAN PESAN
