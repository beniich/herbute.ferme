# ════════════════════════════════════════════════
#  Herbute Backend — Multi-stage Dockerfile
#  Stage 1: deps     → install production deps
#  Stage 2: builder  → compile TypeScript
#  Stage 3: production → image minimale
# ════════════════════════════════════════════════

# ── Stage 1: Dépendances ──────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Cache npm efficace : copier d'abord les manifestes
COPY package.json package-lock.json* ./
RUN npm ci --only=production && \
    cp -R node_modules /prod_node_modules && \
    npm ci

# ── Stage 2: Build TypeScript ─────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Production ───────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S herbute && \
    adduser  -u 1001 -S herbute -G herbute

# Copier uniquement le nécessaire
COPY --from=deps     --chown=herbute:herbute /prod_node_modules ./node_modules
COPY --from=builder  --chown=herbute:herbute /app/dist          ./dist
COPY --from=builder  --chown=herbute:herbute /app/package.json  ./

# Dossier uploads
RUN mkdir -p uploads && chown herbute:herbute uploads

USER herbute

EXPOSE 2065

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:2065/ || exit 1

CMD ["node", "dist/server.js"]
