# Vision DevOps — Herbute

Cette vision transforme Herbute d'un projet local en une application scalable, automatisée et prête pour la production.

## 🏗️ Architecture des Conteneurs

Nous adoptons une approche **Multi-Service Containerization** pilotée par Docker.

| Service | Technologie | Rôle |
|:--- |:--- |:--- |
| **frontend** | Next.js | Interface utilisateur & SSR |
| **backend** | Node.js (Express) | API principale & Logique métier |
| **ia-service** | Python (Flask) | Inférence YOLOv8 & Traitement d'images |
| **mongodb** | DB NoSQL | Stockage persistant des données |
| **redis** | Cache & Queue | Cache API, BullMQ & Sessions |

---

## 📂 Organisation du Répertoire `devops/`

```
herbute/
├── devops/
│   ├── docker/
│   │   ├── frontend.Dockerfile
│   │   ├── backend.Dockerfile
│   │   └── ia.Dockerfile
│   ├── nginx/
│   │   └── default.conf            # Reverse proxy & SSL termination
│   ├── ci-cd/
│   │   └── github-actions.yml      # Pipeline Build/Test/Deploy
│   └── scripts/
│       ├── setup.sh                # Installation environnement
│       └── backup-db.sh            # Sauvegarde automatique MongoDB
├── docker-compose.yml              # Orchestration locale / Dev
└── docker-compose.prod.yml         # Configuration Production (Swarm/K8s ready)
```

---

## 🔄 Pipeline CI/CD (Vision)

Chaque `git push` déclenche le cycle suivant :

1.  **LINT & FORMAT** : Vérification de la qualité du code (ESLint, Prettier, Ruff).
2.  **TEST** : Exécution des tests unitaires et d'intégration (Vitest, Pytest).
3.  **BUILD** : Création des images Docker avec tags versionnés.
4.  **PUSH** : Envoi des images vers un Registry (Docker Hub, AWS ECR, GitHub Container Registry).
5.  **DEPLOY** : Mise à jour automatique de l'environnement (Staging ou Production) via Webhooks ou GitOps.

---

## 📈 Monitoring & Observabilité

Pour une vision claire de la santé de l'app en production :

*   **Logs** : Centralisation via la stack ELK ou Grafana Loki.
*   **Métriques** : Prometheus pour collecter les données (CPU, RAM, temps de réponse) + Grafana pour les dashboards.
*   **Alerting** : Notifications Slack/Discord en cas d'erreur critique (via BullMQ ou Sentry).

---

## 🔐 Gestion des Secrets

*   **Développement** : Fichiers `.env` (ignorés par Git).
*   **Production** : Utilisation de **Docker Secrets**, **HashiCorp Vault** ou les secrets natifs des providers (GitHub Secrets, Vercel Env).

---

## 🛠️ Actions Immédiates (Roadmap)

1.  **Standardisation des Dockerfiles** pour les 3 services.
2.  **Création du `docker-compose.yml`** pour lancer toute la ferme en une commande : `docker compose up`.
3.  **Script de Health-Check** pour s'assurer que l'IA ne démarre pas avant la DB.
4.  **Optimisation du Build** : Utilisation de "Multi-stage builds" pour réduire la taille des images (ex: image finale frontend < 200MB).
