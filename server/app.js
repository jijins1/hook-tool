const express = require('express');
const http = require('http');
const sse = require('sse');
const url = require('url');

const app = express();
const client = express();

// Premier port avec endpoint SSE /connect
const ssePort = 3000;
const sseClients = [];

client.get('/connect', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const client = new sse.Client(req, res);
    sseClients.push(client);
    let numberConections = sseClients.length;
    console.log("Connexion au sse", numberConections)

    req.on('close', () => {
        console.log("Connexion au sse termine", numberConections)

        const index = sseClients.indexOf(client);
        if (index !== -1) {
            sseClients.splice(index, 1);
        }
    });
});

// Deuxième port qui redirige les requêtes vers SSE
const redirectPort = 4000;
app.use(express.text({type:'*/*'}));

app.all('/*',(req, res) => {
    const { headers, method, url: requestUrl, body } = req;
    // Construire l'objet JSON avec les informations de la requête
    const requestData = {
        headers,
        body,
        path: requestUrl,
        method: method
    };

    // Envoyer l'objet JSON à tous les clients SSE connectés
    for (const client of sseClients) {
        client.send(JSON.stringify(requestData));
    }

    res.sendStatus(200);
});

// Démarrer les serveurs
client.listen(ssePort, () => {
    console.log(`Serveur SSE écoutant sur le port ${ssePort}`);
});

app.listen(redirectPort, () => {
    console.log(`Serveur de redirection écoutant sur le port ${redirectPort}`);
});
