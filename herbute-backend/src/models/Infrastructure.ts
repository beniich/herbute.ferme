import mongoose, { Document, Schema } from 'mongoose';

export interface IInfrastructure extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  type: 'BUILDING' | 'EQUIPMENT' | 'WELL' | 'FENCE' | 'ROAD' | 'OTHER';
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'DAMAGED' | 'CONSTRUCTION';
  location: string;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
  value?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InfrastructureSchema: Schema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['BUILDING', 'EQUIPMENT', 'WELL', 'FENCE', 'ROAD', 'OTHER'],
    default: 'BUILDING'
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['OPERATIONAL', 'MAINTENANCE', 'DAMAGED', 'CONSTRUCTION'],
    default: 'OPERATIONAL'
  },
  location: { type: String, required: true },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  value: { type: Number, default: 0 },
  notes: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IInfrastructure>('Infrastructure', InfrastructureSchema);
