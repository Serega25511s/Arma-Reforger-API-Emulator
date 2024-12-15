const net = require("net");
const config = require("./config.json");
const axios = require("axios");
let ticket = '';
let token = '';
let host = "127.0.0.1"
let port = config.Workshop.PORT
function setTicket(newTicket) {
    ticket = newTicket;
}

function setToken(newToken) {
    return token = newToken;
}
function getToken() {
    return token;
}

function getTicketFromServer(host, port) {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();

        client.connect(port, host, () => {
            console.log('Connected to server');
            client.write(config.Workshop.KEY);
        });

        client.on('data', (data) => {
            const ticketHex = data.toString().trim();
            console.log('Received ticket (hex):', ticketHex);
            resolve(ticketHex);
            client.destroy();
        });

        client.on('error', (err) => {
            console.error('Error:', err);
            reject(err); // Возвращаем ошибку через reject
            client.destroy();
        });

        client.on('close', () => {
            console.log('Connection closed');
        });
    });
}
function hexToBase64(hexString) {
    const buffer = Buffer.from(hexString, 'hex');
    return buffer.toString('base64');
}
async function getAccessToken(){
    const url = 'https://api-ar-id.bistudio.com/game-identity/api/v1.1/identities/reforger/auth?include=profile';
    const headers = {
        'Content-Type': 'application/json',
        'user-agent': "Arma Reforger/1.1.0.42 (Client; Windows)",
    }

    let JsonData = JSON.stringify({
        "platform": "steam",
        "token": ticket,
        "platformOpts": {
            "appId": "1874880"
        }
    })
    const response = await axios.post(url, JsonData, { headers });
    return response.data["accessToken"]
}
async function fetchTicketPeriodically() {


    try {
        let ticketHex = await getTicketFromServer(host, port);
        let ticketBase64 = hexToBase64(ticketHex);
        setTicket(ticketBase64)
        console.log('Received ticket (base64):', ticketBase64);
        let token = await getAccessToken()
		console.log('Received token:', token);
        setToken(token)

    } catch (err) {
        console.error('Failed to get ticket:', err);
    }
}

function startPeriodicTask() {
    if (!config.API.ActivateWorkshop) {
        console.log('Workshop is deactivated, set static token');
        setToken("eyJhbGciOiJSUzUxMiJ9.eyJpYXQiOjE3MjM5NDA3NDUsImV4cCI6MTcyMzk0NDM0NSwiaXNzIjoiZ2kiLCJhdWQiOiJnaSwgY2xpZW50LCBiaS1hY2NvdW50IiwiZ2lkIjoiYmNkM2NkMDctZjg3ZC00YzUwLTk3ZmItMzcyNWU5NGUzYTcxIiwiZ21lIjoicmVmb3JnZXIiLCJwbHQiOiJzdGVhbSJ9.INGYyPfKS2bkGk1nWLnydzczwHtHCycAUE5QRMHrL0f3nAIA3cv6uXVwHOUpqdEgDqdqo49YCTBE6BHam8MbWHQysilTX04e-Z2XXWX6YePIukQ6fjyH0xw1C_KKXzTOekbmlU-KCZ9dLi3D8vVC-4fkWwrL3czxpCclbwRxYQPOTmoTy5G-Fv3-U4edKET3a5-RyVMRsD5p0K_6wba3l6j8cET0SXH-5P46yxxyp1mUu76SdLT2nDDmEYdIgNWkWpXO-ONyxd0CJr_M3RQaTSIMF2r5A4gyMMpzlvF5kmnhOkiO0p1i1-1WAG21yrMrz6xM0DjAPLJFAAAAAAAAAA");
        return;
    }
    console.log('Workshop is activated');
    console.log("Start auth ticket");
    fetchTicketPeriodically();


    setInterval(fetchTicketPeriodically, 30*50*1000);
}

module.exports = {
    getToken,
    startPeriodicTask
};