# Image optimisée pour Next.js 15 (Node 20+)
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de package et lock (si existant)
COPY package.json package-lock.json* ./
RUN npm install

# Copie du code source
COPY . .

# Build du frontend Next.js (SSG/SSR)
RUN npm run build

# Stage 2: Serveur de production leger
FROM node:20-alpine AS runner

WORKDIR /app

# On n'a besoin que du dossier .next et node_modules pour le runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Variables d'environnement par défaut
ENV NODE_ENV=production
ENV PORT=3000

# Next.js 15 nécessite souvent cette variable pour le standalone si activé
# ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "start"]
