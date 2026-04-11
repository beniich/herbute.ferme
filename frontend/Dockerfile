# ════════════════════════════════════════════════
#  Herbute Frontend — Next.js Multi-stage (Monorepo Context)
# ════════════════════════════════════════════════

FROM node:20-alpine AS builder
WORKDIR /app

# Build args
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_IA_URL
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_IA_URL=$NEXT_PUBLIC_IA_URL
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_TELEMETRY_DISABLED=1

# Copier manifestes et sources
COPY package.json package-lock.json* ./
COPY shared ./shared
COPY frontend ./frontend

# Installation et Build
RUN npm install --legacy-peer-deps
RUN npm run build -w @reclamtrack/shared
RUN npm run build -w reclamtrack-frontend

# ── Production ────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -g 1001 -S herbute && \
    adduser  -u 1001 -S herbute -G herbute

# Copier les artefacts Next.js
COPY --from=builder --chown=herbute:herbute /app/frontend/public ./public
COPY --from=builder --chown=herbute:herbute /app/frontend/.next/standalone ./
COPY --from=builder --chown=herbute:herbute /app/frontend/.next/static ./frontend/.next/static

USER herbute
EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:3000 || exit 1

# Note: In standalone mode, Next.js expects files to be in certain places
CMD ["node", "frontend/server.js"]
