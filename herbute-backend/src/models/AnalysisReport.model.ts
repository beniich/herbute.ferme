import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisReport extends Document {
  title: string;
  summary: string;
  type: 'daily' | 'weekly' | 'manual';
  recommendations: string[];
  dataSources: string[];
  organizationId: mongoose.Types.ObjectId | string;
  metrics: {
    totalYield?:   number;
    totalAnimals?: number;
    growingCrops?: number;
    illAnimals?:   number;
    monthProfit?:  number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisReportSchema = new Schema<IAnalysisReport>({
  title:           { type: String, required: true },
  summary:         { type: String, required: true },
  type:            { type: String, enum: ['daily', 'weekly', 'manual'], default: 'daily' },
  recommendations: { type: [String], default: [] },
  dataSources:     { type: [String], default: [] },
  organizationId:  { type: Schema.Types.Mixed, required: true },
  metrics: {
    totalYield:   Number,
    totalAnimals: Number,
    growingCrops: Number,
    illAnimals:   Number,
    monthProfit:  Number,
  },
}, { timestamps: true });

// ─── INDEXES OPTIMISÉS ────────────────────────────────────────────────────────

// 1. Liste paginée des rapports — GET /api/reports
//    find({ organizationId }).sort({ createdAt: -1 })
AnalysisReportSchema.index({ organizationId: 1, createdAt: -1 });

// 2. Filtrage par type de rapport (daily/weekly/manual) + tri chronologique
AnalysisReportSchema.index({ organizationId: 1, type: 1, createdAt: -1 });

// 3. TTL index — suppression automatique des rapports > 90 jours
//    Évite l'accumulation infinie de rapports journaliers sans maintenance manuelle
AnalysisReportSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 jours = 7 776 000 secondes
);

export default mongoose.model<IAnalysisReport>('AnalysisReport', AnalysisReportSchema);
