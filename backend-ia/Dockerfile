# ════════════════════════════════════════════════
#  Herbute IA — Python Flask Multi-stage
# ════════════════════════════════════════════════

FROM python:3.11-slim AS base
WORKDIR /app

# Dépendances système pour rasterio/numpy
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ libgdal-dev curl \
    && rm -rf /var/lib/apt/lists/*

# ── Dépendances Python ────────────────────────
FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ── Production ────────────────────────────────
FROM base AS production
WORKDIR /app

RUN addgroup --gid 1001 herbute && \
    adduser  --uid 1001 --gid 1001 --no-create-home herbute

# Copier dépendances installées
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Copier code source
COPY --chown=herbute:herbute . .

# Dossiers de travail
RUN mkdir -p uploads results/satellite models/ml && \
    chown -R herbute:herbute uploads results models

USER herbute
EXPOSE 5001

HEALTHCHECK --interval=20s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5001/health || exit 1

CMD ["python", "api_server.py"]
