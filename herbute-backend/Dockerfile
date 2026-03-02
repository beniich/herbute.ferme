# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Build (TypeScript -> JavaScript)
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Copie des dépendances de prod uniquement
COPY package*.json ./
RUN npm install --omit=dev

# Copie du build
COPY --from=builder /app/dist ./dist

# Variables d'environnement par défaut
ENV PORT=2065
ENV NODE_ENV=production

EXPOSE 2065

CMD ["node", "dist/server.js"]
