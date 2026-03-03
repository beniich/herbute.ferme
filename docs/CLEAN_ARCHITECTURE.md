# Clean Architecture — Herbute

## Principe fondamental : La Règle de Dépendance

```
                  ┌─────────────────────────────────────────────┐
                  │         FRAMEWORKS & DRIVERS                │
                  │  (Express, MongoDB, Redis, Next.js, Flask)  │
                  │                                             │
                  │   ┌─────────────────────────────────────┐   │
                  │   │      INTERFACE ADAPTERS             │   │
                  │   │  (Controllers, Repositories,        │   │
                  │   │   Presenters, Gateways)             │   │
                  │   │                                     │   │
                  │   │   ┌─────────────────────────────┐   │   │
                  │   │   │    APPLICATION (Use Cases)  │   │   │
                  │   │   │                             │   │   │
                  │   │   │   ┌─────────────────────┐   │   │   │
                  │   │   │   │  DOMAIN (Entities)  │   │   │   │
                  │   │   │   │  Business Rules     │   │   │   │
                  │   │   │   │  ← Nul dépendance  │   │   │   │
                  │   │   │   │    vers l'extérieur │   │   │   │
                  │   │   │   └─────────────────────┘   │   │   │
                  │   │   └─────────────────────────────┘   │   │
                  │   └─────────────────────────────────────┘   │
                  └─────────────────────────────────────────────┘

  LES DÉPENDANCES NE POINTENT QUE VERS L'INTÉRIEUR ←←←
```

**La règle d'or :** Le domaine et les use cases ne connaissent NI MongoDB, NI Express, NI Redis, NI Next.js.

---

## Structure des dossiers — Clean Architecture

```
herbute-backend/src/
│
├── domain/                        ← CERCLE 1 : ENTITÉS (pur TypeScript, 0 dépendance)
│   ├── entities/
│   │   ├── Crop.entity.ts         ← Classe métier avec règles et invariants
│   │   └── Animal.entity.ts
│   ├── value-objects/
│   │   ├── CropStatus.vo.ts       ← Objet valeur immuable
│   │   └── OrganizationId.vo.ts
│   ├── repositories/
│   │   └── ICropRepository.ts     ← Interface (contrat) — PAS d'implémentation
│   └── errors/
│       └── DomainError.ts         ← Erreurs métier typées
│
├── application/                   ← CERCLE 2 : CAS D'USAGE
│   └── use-cases/
│       └── crops/
│           ├── GetCropStats.usecase.ts
│           ├── CreateCrop.usecase.ts
│           ├── HarvestCrop.usecase.ts
│           └── ListCrops.usecase.ts
│
├── infrastructure/                ← CERCLE 3 : ADAPTATEURS
│   └── repositories/
│       └── MongoCropRepository.ts ← Implémentation MongoDB d'ICropRepository
│
├── interfaces/                    ← CERCLE 4 : FRAMEWORKS
│   ├── controllers/
│   │   └── crop.controller.ts
│   └── routes/
│       └── crops.ts
│
└── server.ts                      ← Point d'entrée + Injection de dépendances
```

---

## Les 4 couches en détail

### 1. DOMAIN — Le cœur (aucune dépendance)

```typescript
// Entité : règles métier pures
class CropEntity {
  harvest(actualYield: number): void {
    if (this.status === CropStatus.HARVESTED)
      throw new DomainError('ALREADY_HARVESTED', 'Culture déjà récoltée');
    if (actualYield < 0)
      throw new DomainError('INVALID_YIELD', 'Rendement ne peut pas être négatif');
    this.status = CropStatus.HARVESTED;
    this.harvestedAt = new Date();
    this.estimatedYield = actualYield;
  }
}

// Repository Interface : le domaine définit le contrat
interface ICropRepository {
  findAll(orgId: string, filters?: CropFilters): Promise<CropEntity[]>;
  findById(id: string, orgId: string): Promise<CropEntity | null>;
  save(crop: CropEntity): Promise<CropEntity>;
  delete(id: string, orgId: string): Promise<boolean>;
  getStats(orgId: string): Promise<CropStats>;
}
```

### 2. APPLICATION — Cas d'usage (dépend uniquement du domaine)

```typescript
// Use Case : orchestre le domaine
class HarvestCropUseCase {
  constructor(private cropRepo: ICropRepository) {} // injection d'interface

  async execute(id: string, orgId: string, actualYield: number): Promise<CropEntity> {
    const crop = await this.cropRepo.findById(id, orgId);
    if (!crop) throw new NotFoundError('Culture introuvable');

    crop.harvest(actualYield); // Règle métier dans l'entité
    return this.cropRepo.save(crop);
  }
}
```

### 3. INFRASTRUCTURE — Adaptateurs (implémente les interfaces du domaine)

```typescript
// Implémentation MongoDB — adapte Mongoose à l'interface ICropRepository
class MongoCropRepository implements ICropRepository {
  async findById(id: string, orgId: string): Promise<CropEntity | null> {
    const doc = await CropModel.findOne({ _id: id, organizationId: orgId }).lean();
    if (!doc) return null;
    return CropMapper.toDomain(doc); // Document MongoDB → Entité domaine
  }

  async save(crop: CropEntity): Promise<CropEntity> {
    const doc = CropMapper.toPersistence(crop); // Entité → Document MongoDB
    const saved = await CropModel.findByIdAndUpdate(crop.id, doc, { upsert: true, new: true });
    return CropMapper.toDomain(saved);
  }
}
```

### 4. INTERFACES — Contrôleurs (orchestre les use cases)

```typescript
// Contrôleur : parse HTTP → use case → réponse HTTP
class CropController {
  constructor(private harvestUseCase: HarvestCropUseCase) {}

  async harvest(req: Request, res: Response): Promise<void> {
    const crop = await this.harvestUseCase.execute(
      req.params.id, req.organizationId!, req.body.actualYield
    );
    res.json({ success: true, data: crop });
  }
}
```

### 5. COMPOSITION ROOT — server.ts (câblage des dépendances)

```typescript
// LE SEUL endroit où tout est assemblé
const cropRepo        = new MongoCropRepository();
const harvestUseCase  = new HarvestCropUseCase(cropRepo);
const cropController  = new CropController(harvestUseCase);
```

---

## Comparaison Architecture en Couches vs Clean Architecture

| Aspect | Architecture en Couches | Clean Architecture |
|--------|------------------------|-------------------|
| **Dépendances** | Route → Controller → Service → Model | Tout pointe vers le domaine |
| **Domain** | Pas de couche dédiée | Entités pures + interfaces |
| **Base de données** | Model connaît MongoDB | Infrastructure implémente une interface |
| **Tests** | Mocke MongoDB | Mocke juste l'interface repository |
| **Framework** | Service dépend d'Express | Use Case ne sait pas qu'Express existe |
| **Changement de DB** | Refactorisation massive | Change juste l'Infrastructure |
| **Complexité** | Faible | Plus élevée mais très maintenable |

---

## Flux complet d'une requête (POST /api/crops/:id/harvest)

```
HTTP POST /api/crops/123/harvest { actualYield: 450 }
    │
    ▼ [INTERFACES]
routes/crops.ts
  → authenticate() → requireOrganization() → validator()
  → cropController.harvest(req, res)
    │
    ▼ [INTERFACES → APPLICATION]
CropController.harvest()
  → extrait (id="123", orgId="org_abc", actualYield=450)
  → harvestCropUseCase.execute("123", "org_abc", 450)
    │
    ▼ [APPLICATION → DOMAIN]
HarvestCropUseCase.execute()
  → cropRepository.findById("123", "org_abc")   ← appelle l'interface
    │
    ▼ [APPLICATION → INFRASTRUCTURE]
MongoCropRepository.findById()
  → CropModel.findOne({ _id: "123" })           ← MongoDB
  → CropMapper.toDomain(mongoDoc)               ← doc → entité
    │
    ▼ [DOMAIN]
CropEntity.harvest(450)
  → vérifie status !== HARVESTED                ← règle métier pure
  → this.status = "HARVESTED"
  → this.harvestedAt = new Date()
    │
    ▼ [APPLICATION → INFRASTRUCTURE]
cropRepository.save(cropEntity)
  → CropMapper.toPersistence(entity)            ← entité → doc
  → CropModel.findByIdAndUpdate(...)            ← MongoDB
    │
    ▼ [INTERFACES]
CropController
  → { success: true, data: cropEntity }
    │
    ▼
HTTP 200 JSON Response
```

---

## Avantages concrets pour Herbute

| Bénéfice | Exemple concret |
|---------|----------------|
| **Testabilité** | `HarvestCropUseCase` testable avec un `MockCropRepository` — sans MongoDB |
| **Remplacer MongoDB** | Changer `MongoCropRepository` → `PostgresCropRepository` sans toucher au domaine |
| **Ajouter le service IA** | `AnalyzeAfterHarvestUseCase` compose `HarvestCropUseCase` + `AnalysisService` |
| **Règles métier explicites** | `CropEntity.harvest()` documente les invariants dans le code |
| **Erreurs typées** | `DomainError('ALREADY_HARVESTED')` vs un string générique |

---

## Quand utiliser laquelle ?

```
Complexité du projet      Petite    Moyenne     Grande
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Architecture en Couches     ✅✅✅     ✅✅         ✅
Clean Architecture          ⚠️        ✅✅         ✅✅✅

Pour Herbute (39+ pages, IA, multi-modules) → Clean Architecture ✅
```
