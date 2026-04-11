# ════════════════════════════════════════════════
#  Herbute Backend — Multi-stage Dockerfile (Monorepo Context)
# ════════════════════════════════════════════════

# ── Stage 1: Build ────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les manifestes racine
COPY package.json package-lock.json* ./

# Copier les dossiers nécessaires
COPY shared ./shared
COPY herbute-backend ./herbute-backend

# Installation des dépendances (inclut les workspaces)
RUN npm install --legacy-peer-deps

# Build du package shared puis du backend
RUN npm run build -w @reclamtrack/shared
RUN npm run build -w herbute-backend

# ── Stage 2: Production ────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache wget && \
    addgroup -g 1001 -S herbute && \
    adduser  -u 1001 -S herbute -G herbute

# Copier node_modules (optimisé par npm workspaces) et les fichiers buildés
COPY --from=builder --chown=herbute:herbute /app/node_modules ./node_modules
COPY --from=builder --chown=herbute:herbute /app/herbute-backend/dist ./dist
COPY --from=builder --chown=herbute:herbute /app/herbute-backend/package.json ./
COPY --from=builder --chown=herbute:herbute /app/herbute-backend/keys ./keys

# Créer les dossiers nécessaires
RUN mkdir -p uploads logs && \
    chown -R herbute:herbute uploads logs

USER herbute
ENV NODE_ENV=production
ENV PORT=2065
EXPOSE 2065

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:2065/health || exit 1

CMD ["node", "dist/server.js"]
