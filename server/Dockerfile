# Utiliser une image de base Node.js
FROM node:14

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier les fichiers du projet dans le répertoire de travail
COPY . .

# Exposer le port du serveur SSE
EXPOSE 3000

# Démarrer le serveur SSE
CMD [ "node", "app.js" ]
