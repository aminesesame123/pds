# Étape 1 : build Angular

FROM node:20-alpine AS build

WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances

COPY package*.json ./

RUN npm ci --no-audit --no-fund --prefer-offline

# Copier tout le code source

COPY . .

# Construire l'application pour la production

RUN npm run build -- --output-path=dist

# Étape 2 : serveur Nginx

FROM nginx:alpine

# Copier les fichiers build dans le dossier par défaut de Nginx

COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copier la configuration Nginx personnalisée si nécessaire

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80

EXPOSE 80

# Lancer Nginx en mode foreground

CMD ["nginx", "-g", "daemon off;"]
