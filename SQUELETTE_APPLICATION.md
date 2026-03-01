# 🌿 SQUELETTE COMPLET — HERBOFERME / AGROMAÎTRE
> Document de référence — Architecture, Modules et Modes de Fonctionnement  
> Généré le : 1er Mars 2026

---

## 🏗️ ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR (Client)                          │
│                  Next.js 14 — App Router — Port 3000                │
│                                                                     │
│  ┌────────────┐   ┌──────────────────────────┐   ┌──────────────┐  │
│  │  Sidebar   │   │      Pages / Modules      │   │ Right Panel  │  │
│  │  (gauche)  │   │   (contenu principal)     │   │  (droite)   │  │
│  └────────────┘   └──────────────────────────┘   └──────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
            │  HTTP  (cookies HttpOnly + x-organization-id)
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Serveur)                               │
│              herbute-backend — Express.js — Port 2065               │
│                                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │  Routes  │  │  Ctrl.   │  │ Services │  │   Middleware     │  │
│   │  /api/*  │  │          │  │          │  │ auth + org guard │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
            │  Mongoose / ODM
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES                                  │
│                  MongoDB (port 27017) — Local                       │
│                                                                     │
│  32 Modèles : Animal, Complaint, Crop, ITAsset, Team, ...          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 AUTHENTIFICATION & SÉCURITÉ

| Élément | Détail |
|---------|--------|
| **Système** | JWT (JSON Web Token) |
| **Access Token** | Cookie HttpOnly, durée 15 min |
| **Refresh Token** | Cookie HttpOnly, durée 7 jours, rotation automatique |
| **Multi-org** | Chaque requête porte `x-organization-id` en header |
| **Rôles** | `OWNER`, `ADMIN`, `EMPLOYE` |
| **Rate Limiting** | 10 tentatives/15 min sur les routes auth |
| **Verrouillage** | Compte verrouillé 15 min après 5 échecs |

### Routes d'authentification (`/api/auth/...`)
```
POST  /register       → Inscription + création auto de l'organisation
POST  /login          → Connexion, renvoie les cookies
POST  /logout         → Déconnexion, efface les cookies
POST  /refresh        → Renouvellement du token
GET   /me             → Profil de l'utilisateur connecté
POST  /forgot-password → Demande de réinitialisation
POST  /reset-password  → Réinitialisation avec token
```

---

## 🗺️ CARTE DES MODULES (34 PAGES)

### Légende des statuts
| Icône | Signification |
|-------|---------------|
| ✅ | **Dynamique** — Données réelles depuis la BDD |
| 🔶 | **Semi-dynamique** — Données mixtes (réelles + statiques) |
| 📋 | **Squelette** — Page affichée, données statiques/démo |
| 🚧 | **À développer** — Route existe, formulaire de saisie à créer |

---

## 1. 🏠 TABLEAU DE BORD PRINCIPAL
**Route** : `/dashboard`  
**Statut** : ✅ Semi-dynamique

| Bloc | Source de données | Saisie possible |
|------|------------------|-----------------|
| Nom de l'organisation | MongoDB → `Organization` | Via Paramètres |
| Météo du domaine | Statique (démo) | 🚧 À connecter (API météo) |
| KPIs financiers | Statique (démo) | 🚧 Via module Comptabilité |
| Accès rapides modules | Navigation statique | N/A |
| Transactions récentes | Statique (démo) | 🚧 Via module Finance |

---

## 2. 🗺️ CARTE INTERACTIVE
**Route** : `/map`  
**Statut** : ✅ Dynamique

| Bloc | Source de données | Saisie possible |
|------|------------------|-----------------|
| Points heatmap | MongoDB → `Complaint` (latitude/longitude) | Oui — via Réclamations |
| Mode Flux Opérations | Données des réclamations | Oui |
| Mode Heatmap Risques | Intensité par priorité | Automatique |

**💾 Modèle BDD utilisé** : `Complaint` (champs `latitude`, `longitude`, `priority`)

---

## 3. 📊 ANALYTICS & KPIs
**Route** : `/analytics`  
**Statut** : 📋 Squelette

| Bloc | Source de données | Saisie possible |
|------|------------------|-----------------|
| Graphiques | Statiques (démo) | 🚧 À connecter |
| Export Excel | `/api/analytics/export/complaints` | Automatique |

---

## 4. 🌤️ MÉTÉO & ENVIRONNEMENT
**Route** : `/meteo`  
**Statut** : 📋 Squelette

| Bloc | Statut | Note |
|------|--------|------|
| Température, humidité | Statique | Possible d'intégrer API OpenWeather |

---

## 5. 🐄 ÉLEVAGE BOVIN & OVIN
**Route** : `/elevage`  
**Statut** : 📋 Squelette → **Données de démo**

| Bloc | Source de données | Saisie possible |
|------|------------------|-----------------|
| Inventaire cheptel | Statique | 🚧 Formulaire à créer |
| Production de lait | Statique | 🚧 Saisie manuelle à créer |
| Santé & Alertes | Statique | 🚧 À créer |

**💾 Modèle BDD existant** : `Animal` (id, name, species, breed, birthDate, health, organizationId)

---

## 6. 🐓 FERME AVICOLE
**Route** : `/volaille`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `Animal` (filtré par species='volaille')

---

## 7. 🗺️ PARCELLES & CULTURES
**Route** : `/parcelles`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `Crop` (id, name, variety, area, status, plantingDate, harvestDate, yieldEstimate)

---

## 8. 🌿 HERBES & AROMATES
**Route** : `/herbes`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `Crop` (filtré par type='herbe')

---

## 9. 🥕 LÉGUMES & FRUITS
**Route** : `/legumes`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `Crop` (filtré par type='légume')

---

## 10. 🪴 PÉPINIÈRE
**Route** : `/pepiniere`  
**Statut** : 📋 Squelette

---

## 11. 💧 IRRIGATION & EAU
**Route** : `/irrigation`  
**Statut** : 📋 Squelette

---

## 12. 🌲 GESTION FORESTIÈRE
**Route** : `/foret`  
**Statut** : 📋 Squelette

---

## 13. 🏡 DOMAINE & INFRASTRUCTURE
**Route** : `/domaine`  
**Statut** : 📋 Squelette

---

## 14. 🚜 ÉQUIPEMENTS & FLOTTE
**Route** : `/fleet`  
**Statut** : 🔶 Semi-dynamique

| Bloc | Source | Saisie |
|------|--------|--------|
| Véhicules / Engins | `/api/fleet/vehicles` (BDD) | 🚧 Formulaire partiel |
| Carte de flotte | Statique | À compléter |

---

## 15. 📒 COMPTABILITÉ
**Route** : `/comptabilite`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `FarmTransaction` (id, type, category, amount, date)

---

## 16. 💰 BUDGET & FINANCE
**Route** : `/budget`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `FarmKPI` (id, label, value, unit, trend)

---

## 17. 👥 ÉQUIPES
**Route** : `/teams`  
**Statut** : ✅ Dynamique

| Bloc | Source | Saisie |
|------|--------|--------|
| Liste des équipes | MongoDB → `Team` | Oui — Formulaire actif |
| Membres d'équipes | MongoDB → `Membership` | Oui — Invitation par email |
| Planning équipe | MongoDB → `PlanningSlot` | Oui |

---

## 18. 🗓️ PLANNING RH (ROSTER)
**Route** : `/roster`  
**Statut** : 🔶 Semi-dynamique

**💾 Modèle BDD existant** : `Roster`, `Leave`, `Staff`

---

## 19. ✅ TÂCHES
**Route** : `/tasks`  
**Statut** : 📋 Squelette

**💾 Modèle BDD existant** : `Assignment`

---

## 20. 📅 CALENDRIER / PLANNING
**Route** : `/planning`  
**Statut** : 🔶 Semi-dynamique

**💾 Modèle BDD existant** : `PlanningSlot`, `Intervention`

---

## 21. 💬 MESSAGES
**Route** : `/messages`  
**Statut** : 🔶 Semi-dynamique

**💾 Modèle BDD existant** : `Message` (from, to, content, timestamp)

---

## 22. 📋 RAPPORTS & EXPORT
**Route** : `/reports`  
**Statut** : 🔶 Semi-dynamique

| Sous-module | Route | Statut |
|-------------|-------|--------|
| Vue générale | `/reports` | 📋 Squelette |
| Heatmap | `/reports/analytics/heatmap` | 📋 Squelette |
| Satisfaction | `/reports/analytics/satisfaction` | 🔶 Semi |
| Export | API `/analytics/export/complaints` | ✅ Actif |

---

## 23. 📦 INVENTAIRE
**Route** : `/inventory`  
**Statut** : ✅ Dynamique

| Sous-module | Route | Statut |
|-------------|-------|--------|
| Vue générale | `/inventory` | ✅ Actif |
| Inventaire avancé | `/inventory/inventory/advanced` | ✅ Actif |
| Réquisitions | `/inventory/approvals` | ✅ Actif |
| **Saisie possible** | Via formulaire dans la page | Oui |

**💾 Modèle BDD** : `Requisition` (id, items, requestedBy, status, organizationId)

---

## 24. 📚 BASE DE CONNAISSANCE
**Route** : `/knowledge`  
**Statut** : ✅ Dynamique

**💾 Modèle BDD** : `Knowledge` (title, content, tags, category)

---

## 25. 📣 RÉCLAMATIONS
**Route** : `/complaints`  
**Statut** : ✅ Dynamique — **SAISIE POSSIBLE**

| Sous-page | Route | Statut |
|-----------|-------|--------|
| Liste | `/complaints/list` | ✅ Dynamique |
| Nouvelle réclamation | `/complaints/new` | ✅ Formulaire actif |
| Détail | `/complaints/[id]` | ✅ Dynamique |

**💾 Modèle BDD** : `Complaint`
```
Champs : title, description, category, priority, status,
         latitude, longitude, submittedBy, organizationId,
         assignedTo, images[], comments[]
```

**APIs disponibles** :
```
GET    /api/complaints        → Liste des réclamations
POST   /api/complaints        → Créer une réclamation ← SAISIE
GET    /api/complaints/:id    → Détail
PATCH  /api/complaints/:id    → Modifier ← SAISIE
DELETE /api/complaints/:id    → Supprimer
POST   /api/complaints/:id/approve → Approuver
POST   /api/complaints/:id/reject  → Rejeter
GET    /api/complaints/stats  → Statistiques
```

---

## 26. 💡 FEEDBACK
**Route** : `/feedback`  
**Statut** : 🔶 Semi-dynamique

**💾 Modèle BDD** : `Feedback` (rating, comment, module, userId)

---

## 27. 🔍 JOURNAUX D'AUDIT
**Route** : `/audit-logs`  
**Statut** : ✅ Dynamique (lecture seule)

**💾 Modèle BDD** : `AuditLog` (action, userId, targetId, timestamp, ipAddress)

---

## 28. ⚙️ PARAMÈTRES
**Route** : `/settings`  
**Statut** : 🔶 Semi-dynamique

| Sous-page | Route | Statut |
|-----------|-------|--------|
| Général | `/settings` | 🔶 Partiel |
| Notifications | `/settings/notifications` | 📋 Squelette |

---

## 29. 🖥️ ADMINISTRATION IT
**Route** : `/it-admin`  
**Statut** : ✅ Dynamique

| Sous-module | Statut |
|-------------|--------|
| Tickets IT | ✅ CRUD complet |
| Assets IT | ✅ CRUD complet |
| Réseau & Appareils | ✅ Lecture dynamique |

**💾 Modèle BDD** : `ITTicket`, `ITAsset`, `NetworkDevice`

---

## 30. 👥 ADMINISTRATION UTILISATEURS
**Route** : `/admin`  
**Statut** : ✅ Dynamique

| Sous-module | Route | Statut |
|-------------|-------|--------|
| Gestion des utilisateurs | `/admin/users` | ✅ Actif |
| Catégories | `/admin/categories` | ✅ Actif |
| Contrôle réclamations | `/admin/complaints/control` | ✅ Actif |

---

## 🔌 APIs BACKEND — RÉSUMÉ COMPLET

| Groupe | Préfixe | Nb Routes | Statut |
|--------|---------|-----------|--------|
| Auth | `/api/auth` | 8 | ✅ Complet |
| Organisations | `/api/organizations` | 5 | ✅ Complet |
| Réclamations | `/api/complaints` | 8 | ✅ Complet |
| Équipes | `/api/teams` | 6 | ✅ Complet |
| Membres | `/api/members` | 4 | ✅ Complet |
| Inventaire | `/api/inventory` | 5 | ✅ Complet |
| Flotte | `/api/fleet` | 4 | ✅ Complet |
| RH | `/api/hr` | 4 | ✅ Complet |
| Planning | `/api/planning` | 5 | ✅ Complet |
| Messages | `/api/messages` | 3 | ✅ Complet |
| IT Assets | `/api/admin/it/assets` | 5 | ✅ Complet |
| IT Tickets | `/api/admin/it/tickets` | 5 | ✅ Complet |
| Analytics | `/api/analytics` | 4 | ✅ Complet |
| Feedback | `/api/feedback` | 4 | ✅ Complet |
| Knowledge | `/api/knowledge` | 5 | ✅ Complet |
| Audit | `/api/audit` | 2 | ✅ Complet |
| Billing | `/api/billing` | 3 | ✅ Complet |
| Admin | `/api/admin` | 10 | ✅ Complet |
| Sécurité | `/api/security` | 8 | ✅ Complet |
| **À créer** | `/api/animals` | 0 | 🚧 Manquant |
| **À créer** | `/api/crops` | 0 | 🚧 Manquant |
| **À créer** | `/api/finance` | 0 | 🚧 Manquant |

---

## 📝 DONNÉES — CE QUE VOUS POUVEZ SAISIR MAINTENANT

### ✅ Saisie Immédiate Possible

| Module | Comment saisir | URL |
|--------|---------------|-----|
| **Réclamations** | Bouton "Nouvelle Réclamation" | `/complaints/new` |
| **Tickets IT** | Via `/it-admin` | `/it-admin` |
| **Membres d'équipe** | Invitation par email | `/teams` |
| **Inventaire** | Formulaire dans la page | `/inventory` |
| **Base de Connaissance** | Éditeur intégré | `/knowledge` |
| **Feedback** | Formulaire utilisateur | `/feedback` |

### 🚧 Saisie À Développer (Priorité)

| Module | Données à saisir | Modèle BDD prêt |
|--------|-----------------|-----------------|
| **Élevage** | Animaux, poids, santé, lait | ✅ `Animal` |
| **Cultures** | Parcelles, récoltes, rendement | ✅ `Crop` |
| **Finance** | Transactions, dépenses, revenus | ✅ `FarmTransaction` |
| **Budget** | Prévisions, KPIs | ✅ `FarmKPI` |
| **Volaille** | Effectifs, ponte, mortalité | ✅ `Animal` |
| **Météo** | Données capteurs | 🚧 Nouveau modèle |

---

## 🚀 MODES DE FONCTIONNEMENT

### Mode 1 — DÉVELOPPEMENT LOCAL
```
Backend  : http://localhost:2065  (npm run dev -w herbute-backend)
Frontend : http://localhost:3000  (npm run dev -w frontend)
BDD      : MongoDB local port 27017
```
**Compte admin** : `admin@reclamtrack.com` / `Admin123!`

### Mode 2 — RÉSEAU LOCAL (Autre PC)
```
Backend  : http://[IP-PC]:2065
Frontend : http://[IP-PC]:3000
```
Le frontend détecte automatiquement l'IP et adapte les URLs.

### Mode 3 — PRODUCTION (Vercel + BDD distante)
```
Frontend : Déployé sur Vercel (Next.js)
Backend  : À déployer (Railway, Render, VPS...)
BDD      : MongoDB Atlas (cloud)
```

---

## 🗄️ MODÈLES DE DONNÉES EXISTANTS

| Modèle | Champs principaux | Utilisé par |
|--------|-----------------|-------------|
| `User` | email, nom, prenom, role, plan | Auth, Admin |
| `Organization` | name, slug, ownerId, subscription | Tous les modules |
| `Membership` | userId, organizationId, roles | Équipes, Auth |
| `Complaint` | title, priority, status, lat, lng | Réclamations, Carte |
| `Animal` | name, species, breed, health | Élevage, Volaille |
| `Crop` | name, type, area, yieldEstimate | Cultures, Herbes |
| `Team` | name, members[], leader | Équipes |
| `ITAsset` | name, type, status, location | IT Admin |
| `ITTicket` | title, priority, status, assignee | IT Tickets |
| `FarmTransaction` | type, amount, category, date | Finance |
| `FarmKPI` | label, value, unit, trend | Dashboard |
| `Knowledge` | title, content, tags | Base Connaissance |
| `Feedback` | rating, comment, module | Feedback |
| `AuditLog` | action, userId, timestamp | Journaux |
| `Message` | from, to, content | Messagerie |
| `PlanningSlot` | date, userId, task | Planning |
| `Staff` | name, role, department | RH |
| `Leave` | userId, startDate, endDate | RH |
| `Requisition` | items, requestedBy, status | Inventaire |
| `NetworkDevice` | ip, mac, type, status | IT Réseau |

---

## 📊 BILAN : CE QUI EST FAIT VS CE QUI RESTE

### ✅ TERMINÉ
- Infrastructure complète (Auth, Org, Multi-tenant)
- 20+ APIs backend fonctionnelles
- Interface AgroMaître avec thème premium
- Module Réclamations complet (CRUD + Carte)
- Module IT (Tickets + Assets + Réseau)
- Inventaire & Réquisitions
- Messagerie & Planning partiel

### 🚧 PRIORITÉ DÉVELOPPEMENT
1. **Formulaires Élevage** — Saisie animaux (modèle prêt)
2. **Formulaires Cultures** — Saisie récoltes (modèle prêt)
3. **Module Finance** — APIs + Formulaires (modèle prêt)
4. **Connexion données statiques** — Remplacer les démos par des vraies données
5. **API Météo** — Intégration OpenWeatherMap

---

*Document généré automatiquement — AgroMaître v2.0 — Mars 2026*
