# Architecture en Couches — Herbute

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│              Next.js 15 · React 19 · TypeScript                 │
└─────────────────────────┬───────────────────────────────────────┘
                           │ HTTP / WebSocket
┌──────────────────────────▼──────────────────────────────────────┐
│                   COUCHE PRÉSENTATION (Frontend)                │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   Pages     │  │  Components  │  │     Providers          │ │
│  │ /dashboard  │  │ AgroSidebar  │  │ AuthProvider           │ │
│  │ /production │  │ AgroTopBar   │  │ QueryProvider (SWR)    │ │
│  │ /analytics  │  │ DataTable    │  │ OrgStore (Zustand)     │ │
│  └──────┬──────┘  └──────┬───────┘  └────────────┬───────────┘ │
│         │                │                        │             │
│  ┌──────▼────────────────▼────────────────────────▼───────────┐ │
│  │              COUCHE HOOKS (Data Access Layer)               │ │
│  │  useDashboardData · useCrops · useAnimals · useProductionData│ │
│  │          SWR → cache 60s · dedup · keepPreviousData         │ │
│  └──────────────────────────┬───────────────────────────────── ┘ │
│                              │ axios/fetch                       │
│  ┌───────────────────────────▼─────────────────────────────────┐ │
│  │              COUCHE API CLIENT (lib/api.ts)                 │ │
│  │  animalsApi · cropsApi · financeApi · irrigationApi         │ │
│  │         Intercepteurs axios · token injection               │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────┬───────────────────────────────────┘
                               │ HTTPS REST / JWT
┌──────────────────────────────▼──────────────────────────────────┐
│                    COUCHE API GATEWAY                           │
│         Express · Port 2065 · Rate Limit · CORS · Helmet       │
│                  Compression Gzip · Cache Redis                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                   BACKEND — ARCHITECTURE EN COUCHES             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  COUCHE ROUTEUR (Routes)                                │   │
│  │  routes/crops.ts · routes/animals.ts · routes/auth.ts   │   │
│  │  Validation (express-validator) · Auth middleware        │   │
│  └────────────────────────────┬────────────────────────────┘   │
│                                │                                │
│  ┌─────────────────────────────▼──────────────────────────────┐ │
│  │  COUCHE CONTRÔLEUR (Controllers)                           │ │
│  │  controllers/crop.controller.ts                            │ │
│  │  controllers/animal.controller.ts                          │ │
│  │  Décode req → appelle Service → formate réponse HTTP       │ │
│  └─────────────────────────────┬──────────────────────────────┘ │
│                                 │                               │
│  ┌──────────────────────────────▼─────────────────────────────┐ │
│  │  COUCHE SERVICE (Business Logic)                           │ │
│  │  services/crop.service.ts · services/animal.service.ts     │ │
│  │  Logique métier · Règles · Aggregations · AI triggers      │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
│                                  │                              │
│  ┌───────────────────────────────▼────────────────────────────┐ │
│  │  COUCHE DÉPÔT / REPOSITORY (Data Access)                  │ │
│  │  models/Crop.ts · models/Animal.ts · models/AnalysisReport │ │
│  │  Indexes MongoDB · Aggregations · TTL · Text search        │ │
│  └──────────────────────────────┬──────────────────────────────┘ │
│                                  │                              │
│  ┌───────────────────────────────▼────────────────────────────┐ │
│  │  COUCHE INFRASTRUCTURE                                     │ │
│  │  middleware/cache.ts  → Redis + In-Memory                  │ │
│  │  middleware/compression.ts → Gzip                          │ │
│  │  config/db.ts  → MongoDB Pool 5-10                         │ │
│  │  services/agent/ → BullMQ + IA Analyzer                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                   SERVICE IA PYTHON (Port 5001)                 │
│  backend-ia/api_server.py → Flask + YOLOv8                     │
│  /analyze-image · /health · /models                             │
└─────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                      BASE DE DONNÉES                            │
│  MongoDB Atlas / Local · Collections indexées                   │
│  Redis (Cache TTL · BullMQ Queue)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Structure des dossiers cibles

### Backend `herbute-backend/src/`

```
src/
├── config/               # Configuration (DB, JWT, env)
│   ├── db.ts             # MongoDB Pool + retry
│   └── jwt.ts
│
├── middleware/           # Middlewares transversaux
│   ├── auth.ts           # JWT authentication
│   ├── cache.ts          # Redis + in-memory cache
│   ├── compression.ts    # Gzip
│   ├── security.ts       # Helmet, CORS, rate-limit
│   └── validator.ts      # express-validator wrapper
│
├── routes/               # COUCHE 1 — Routeur (HTTP mapping)
│   ├── crops.ts          # POST /api/crops → CropController
│   ├── animals.ts        # GET /api/animals → AnimalController
│   └── ...
│
├── controllers/          # COUCHE 2 — Contrôleurs (req/res)
│   ├── crop.controller.ts
│   ├── animal.controller.ts
│   └── ...
│
├── services/             # COUCHE 3 — Logique métier
│   ├── crop.service.ts
│   ├── animal.service.ts
│   ├── agent/            # IA — Analyzer + BullMQ Queue
│   └── ...
│
├── models/               # COUCHE 4 — Données / Repository
│   ├── Crop.ts           # Schéma + 6 indexes
│   ├── Animal.ts         # Schéma + 8 indexes
│   └── ...
│
├── dto/                  # Data Transfer Objects (validation shapes)
├── types/                # Types TypeScript partagés
├── utils/                # Helpers (logger, errors, dates)
└── server.ts             # Point d'entrée
```

### Frontend `frontend/src/`

```
src/
├── app/[locale]/         # COUCHE 1 — Pages (Next.js App Router)
│   ├── (app)/dashboard/page.tsx
│   ├── (app)/production/page.tsx
│   └── (app)/image-correction/page.tsx
│
├── components/           # COUCHE 2 — UI Components
│   ├── layout/           # AgroSidebar, AgroTopBar, AgroLayout
│   ├── ui/               # DataTable, StatsCard, Timeline
│   └── AnnotationCanvas.tsx
│
├── hooks/                # COUCHE 3 — Data Access (SWR)
│   ├── useDashboardData.ts
│   ├── useProductionData.ts
│   └── ...
│
├── lib/                  # COUCHE 4 — API Client
│   └── api.ts            # animalsApi, cropsApi, financeApi...
│
├── store/                # État global (Zustand)
│   └── orgStore.ts
│
├── providers/            # Providers React (Auth, Query, Call)
├── types/                # Interfaces TypeScript
└── styles/               # agro-theme.css, globals.css
```

---

## Règles de l'architecture en couches

| Règle | Description |
|-------|-------------|
| **Flux unidirectionnel** | Route → Controller → Service → Model. Jamais l'inverse. |
| **Isolation des couches** | Un Controller n'importe JAMAIS un Model directement |
| **DRY Business Logic** | La logique métier est UNIQUEMENT dans les Services |
| **DTO validation** | La validation des données d'entrée se fait dans les Routes |
| **Pas de SQL dans les Routes** | Les Routes ne font que router et valider |
| **Cache à la couche Service** | Le cache Redis s'applique dans le Service, pas le Controller |

---

## Flux d'une requête type

```
Browser → GET /api/crops/stats

1. [MIDDLEWARE]   authenticate() → vérifie JWT
2. [MIDDLEWARE]   requireOrganization() → extrait orgId
3. [MIDDLEWARE]   cacheMiddleware(300s) → cherche en cache
4. [ROUTE]        crops.ts → délègue à CropController.getStats()
5. [CONTROLLER]   CropController.getStats(req, res)
                  → extrait params, appelle CropService
6. [SERVICE]      CropService.getStats(orgId, filters)
                  → applique logique métier
                  → appelle Crop.aggregate(...)
7. [MODEL]        MongoDB query avec index { orgId, status }
8. ← [SERVICE]    retourne données brutes
9. ← [CONTROLLER] formate réponse HTTP { success, data }
10. [MIDDLEWARE]  cache.ts → sauvegarde en Redis/memory
11. ← Browser    JSON { success: true, data: {...} }
```
