# ════════════════════════════════════════════════
#  Herbute Frontend — Next.js Multi-stage
# ════════════════════════════════════════════════

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# ── Build ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build args injectés au moment du build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_IA_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_IA_URL=$NEXT_PUBLIC_IA_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Désactiver telemetry Next.js
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Production ────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S herbute && \
    adduser  -u 1001 -S herbute -G herbute

# Copier artefacts Next.js (standalone output)
COPY --from=builder --chown=herbute:herbute /app/public        ./public
COPY --from=builder --chown=herbute:herbute /app/.next/standalone ./
COPY --from=builder --chown=herbute:herbute /app/.next/static  ./.next/static

USER herbute
EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:3000 || exit 1

CMD ["node", "server.js"]
