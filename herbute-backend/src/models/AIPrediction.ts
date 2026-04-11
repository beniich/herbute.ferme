import mongoose, { Schema, Document } from 'mongoose';

export interface IAIPrediction extends Document {
  organizationId: mongoose.Types.ObjectId;
  domainId: mongoose.Types.ObjectId;
  type: 'yield' | 'disease' | 'weather_impact' | 'market' | 'stock' | 'hr' | 'maintenance';
  target: string;
  predictionData: any;
  confidence: number;
  modelUsed: string;
  generatedAt: Date;
}

const aiPredictionSchema = new Schema<IAIPrediction>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    domainId: { type: Schema.Types.ObjectId, index: true }, // Optional link to specific field/plot
    type: { 
      type: String, 
      enum: ['yield', 'disease', 'weather_impact', 'market', 'stock', 'hr', 'maintenance'], 
      required: true 
    },
    target: { type: String, required: true },
    predictionData: { type: Schema.Types.Mixed, required: true },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    modelUsed: { type: String, default: 'llama3.1' },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

aiPredictionSchema.index({ organizationId: 1, type: 1, createdAt: -1 });

export default mongoose.model<IAIPrediction>('AIPrediction', aiPredictionSchema);

