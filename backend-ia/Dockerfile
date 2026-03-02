# Image de base optimisée pour l'IA
FROM python:3.11-slim

# Dépendances système pour OpenCV & YOLO
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code et des modèles
COPY . .

# Création des dossiers nécessaires
RUN mkdir -p uploads models

# Dossier volume pour les modèles (persistance si nécessaire)
VOLUME /app/models

ENV PORT=5001
ENV DEBUG=false

EXPOSE 5001

CMD ["python", "api_server.py"]
