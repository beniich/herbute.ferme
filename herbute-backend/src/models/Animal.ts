import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  organizationId: mongoose.Types.ObjectId;
  type: string;      // species label, e.g. 'Bovin', 'Ovin', 'Poulet'
  breed: string;
  count: number;
  averageAge: number;
  category: 'LIVESTOCK' | 'POULTRY';
  status: 'PRODUCTION' | 'ACTIVE' | 'GROWING' | 'LAYING' | 'SICK' | 'SOLD';
  health?: 'healthy' | 'ill' | 'recovering' | 'deceased'; // champ étendu
  estimatedValue: number;
  notes?: string;
  vaccinations?: Array<{ name: string; date: Date; nextDue?: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema: Schema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  type:           { type: String, required: true },
  breed:          { type: String, required: true },
  category:       { type: String, required: true, enum: ['LIVESTOCK', 'POULTRY'], default: 'LIVESTOCK' },
  count:          { type: Number, required: true, min: 0 },
  averageAge:     { type: Number, required: true, min: 0 },
  status:         { type: String, required: true, enum: ['PRODUCTION', 'ACTIVE', 'GROWING', 'LAYING', 'SICK', 'SOLD'], default: 'ACTIVE' },
  health:         { type: String, enum: ['healthy', 'ill', 'recovering', 'deceased'], default: 'healthy' },
  estimatedValue: { type: Number, default: 0 },
  notes:          { type: String },
  vaccinations: [{
    name:    { type: String },
    date:    { type: Date },
    nextDue: { type: Date },
  }],
}, { timestamps: true });

// ─── INDEXES OPTIMISÉS ────────────────────────────────────────────────────────

// 1. Requête principale — useAnimals() + getStats()
//    find({ organizationId }) — couvre toutes les listes
AnimalSchema.index({ organizationId: 1 });

// 2. Filtrage par catégorie — page /elevage (LIVESTOCK), /volaille (POULTRY)
AnimalSchema.index({ organizationId: 1, category: 1 });

// 3. Filtrage par status — dashboard, alertes (SICK)
AnimalSchema.index({ organizationId: 1, status: 1 });

// 4. Filtrage par santé si champ health utilisé
AnimalSchema.index({ organizationId: 1, health: 1 });

// 5. Combiné catégorie + status — requête la plus sélective
//    stats: répartition par catégorie ET status
AnimalSchema.index({ organizationId: 1, category: 1, status: 1 });

// 6. Vaccinations imminentes — alertes cron automatisées
//    find({ 'vaccinations.nextDue': { $lte: date_limite } })
AnimalSchema.index({ 'vaccinations.nextDue': 1 });

// 7. Tri chronologique — liste paginée
AnimalSchema.index({ organizationId: 1, createdAt: -1 });

// 8. Recherche full-text — barre de recherche
AnimalSchema.index({ type: 'text', breed: 'text', notes: 'text' });

// ─── AGGREGATION DASHBOARD ─────────────────────────────────────────────────────
(AnimalSchema as any).statics.getDashboardStats = async function(organizationId: string) {
  return this.aggregate([
    { $match: { organizationId: new mongoose.Types.ObjectId(organizationId) } },
    {
      $facet: {
        // Total cheptel (count d'entrées * count par entrée)
        totalAnimals: [
          { $group: { _id: null, total: { $sum: '$count' } } },
        ],
        // Répartition par catégorie
        byCategory: [
          { $group: { _id: '$category', count: { $sum: '$count' }, entries: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ],
        // Répartition par statut
        byStatus: [
          { $group: { _id: '$status', count: { $sum: '$count' } } },
          { $sort: { count: -1 } },
        ],
        // Animaux malades (SICK) — pour alertes dashboard
        sickAnimals: [
          { $match: { status: 'SICK' } },
          { $project: { type: 1, breed: 1, count: 1, category: 1 } },
          { $limit: 10 },
        ],
        // Vaccinations imminentes (≤ 7 jours)
        upcomingVaccinations: [
          { $unwind: { path: '$vaccinations', preserveNullAndEmptyArrays: false } },
          {
            $match: {
              'vaccinations.nextDue': {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            },
          },
          { $project: { type: 1, breed: 1, 'vaccinations.name': 1, 'vaccinations.nextDue': 1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);
};

export default mongoose.model<IAnimal>('Animal', AnimalSchema);
