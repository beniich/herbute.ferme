.PHONY: dev prod stop logs ps clean build ps-health

# ── Développement (avec simulateur IoT) ──
dev:
	docker compose --profile dev up -d
	@echo "✅ Herbute DEV démarré"
	@echo "   Frontend  → http://localhost:3000"
	@echo "   Backend   → http://localhost:2065"
	@echo "   IA        → http://localhost:5001"
	@echo "   MongoDB   → localhost:27017"

# ── Production ────────────────────────────
prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
	@echo "✅ Herbute PROD démarré"

# ── Build uniquement ──────────────────────
build:
	docker compose build --parallel

# ── Arrêt ─────────────────────────────────
stop:
	docker compose --profile dev down

# ── Logs en temps réel ────────────────────
logs:
	docker compose logs -f --tail=50

logs-backend:
	docker compose logs -f backend

logs-ia:
	docker compose logs -f backend-ia

# ── État des services ─────────────────────
ps:
	docker compose ps

ps-health:
	@docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

# ── Nettoyage ─────────────────────────────
clean:
	docker compose down -v --remove-orphans
	docker system prune -f

# ── Indexes MongoDB ───────────────────────
indexes:
	docker compose exec backend npx tsx src/scripts/ensure-indexes.ts

# ── Entraîner modèle ML ───────────────────
train-ml:
	docker compose exec backend-ia python intelligence/stress_predictor.py

# ── Shell interactif ──────────────────────
shell-backend:
	docker compose exec backend sh

shell-ia:
	docker compose exec backend-ia bash

shell-mongo:
	docker compose exec mongo mongosh herbute -u admin -p
