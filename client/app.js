const EventSource = require('eventsource');
const axios = require('axios');

// Adresse IP et port du serveur SSE
const sseServerAddress = 'http://hook-connect.ruokki.ovh/connect';

// Adresse IP et port de destination des requêtes redirigées
let destinationAddress = process.argv[2];
if (!destinationAddress){
    destinationAddress = 'http://localhost:8080'; // Exemple : localhost:8000
}
console.log("Redirection vers ", destinationAddress)
// Établir une connexion SSE avec le serveur
const eventSource = new EventSource(sseServerAddress);

// Écouter les événements SSE
eventSource.onmessage = (event) => {
    const requestData = JSON.parse(event.data);
    console.log("Redirection de la requete", requestData)
    // Rediriger la requête vers l'adresse de destination spécifiée
    delete requestData.headers.host;
    axios({
        method: requestData.method,
        url: destinationAddress + requestData.path,
        headers: requestData.headers,
        data: requestData.body
    })
        .then((response) => {
            console.log('Réponse reçue du serveur de destination:', response.data);
        })
        .catch((error) => {
            console.error('Erreur lors de la redirection de la requête:', error);
        });
};

// Gérer les erreurs de connexion SSE
eventSource.onerror = (error) => {
    console.error('Erreur de connexion SSE:', error);
};