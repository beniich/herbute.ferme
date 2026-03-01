import mongoose, { Document, Schema } from 'mongoose';

export interface IAnimal extends Document {
  organizationId: mongoose.Types.ObjectId;
  type: string;
  breed: string;
  count: number;
  averageAge: number;
  category: 'LIVESTOCK' | 'POULTRY';
  status: 'PRODUCTION' | 'ACTIVE' | 'GROWING' | 'LAYING' | 'SICK' | 'SOLD';
  estimatedValue: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnimalSchema: Schema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  category: { type: String, required: true, enum: ['LIVESTOCK', 'POULTRY'], default: 'LIVESTOCK' },
  count: { type: Number, required: true, min: 0 },
  averageAge: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    required: true, 
    enum: ['PRODUCTION', 'ACTIVE', 'GROWING', 'LAYING', 'SICK', 'SOLD'],
    default: 'ACTIVE'
  },
  estimatedValue: { type: Number, default: 0 },
  notes: { type: String },
}, {
  timestamps: true
});

export default mongoose.model<IAnimal>('Animal', AnimalSchema);
