import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
    plateNumber: string;
    type: 'car' | 'truck' | 'van' | 'motorcycle' | 'machinery';
    details: string; // Marque/Modèle
    status: 'available' | 'in_use' | 'maintenance' | 'repair';
    driverId?: mongoose.Types.ObjectId;
    mileage: number;
    lastMaintenance: Date;
    nextMaintenanceDue: Date;
    fuelLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

const VehicleSchema = new Schema({
    plateNumber: { type: String, required: true, unique: true },
    type: {
        type: String,
        enum: ['car', 'truck', 'van', 'motorcycle', 'machinery'],
        required: true
    },
    details: { type: String, required: true },
    status: {
        type: String,
        enum: ['available', 'in_use', 'maintenance', 'repair'],
        default: 'available'
    },
    driverId: { type: Schema.Types.ObjectId, ref: 'User' },
    mileage: { type: Number, default: 0 },
    lastMaintenance: { type: Date },
    nextMaintenanceDue: { type: Date },
    fuelLevel: { type: Number, default: 100, min: 0, max: 100 }
}, { timestamps: true });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
