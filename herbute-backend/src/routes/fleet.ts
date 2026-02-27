import { Router, Request, Response } from 'express';
import { authenticate as auth } from '../middleware/security.js';
import { logger } from '../utils/logger.js';
import { Vehicle } from '../models/Vehicle.js';

const router = Router();

// GET /api/fleet/vehicles - Liste des véhicules
router.get('/vehicles', auth, async (req: Request, res: Response) => {
    try {
        // Initialisation par défaut si vide (pour démo)
        const count = await Vehicle.countDocuments();
        if (count === 0) {
            await Vehicle.insertMany([
                { plateNumber: '1234-A-50', type: 'van', details: 'Renault Master', status: 'available', mileage: 45000, lastMaintenance: new Date('2024-12-01'), nextMaintenanceDue: new Date('2025-06-01'), fuelLevel: 75 },
                { plateNumber: '5678-B-50', type: 'truck', details: 'Isuzu NPR', status: 'in_use', mileage: 82000, lastMaintenance: new Date('2024-11-15'), nextMaintenanceDue: new Date('2025-05-15'), fuelLevel: 40 },
                { plateNumber: '9012-C-50', type: 'car', details: 'Dacia Duster', status: 'maintenance', mileage: 30000, lastMaintenance: new Date('2024-10-01'), nextMaintenanceDue: new Date('2025-04-01'), fuelLevel: 10 }
            ]);
        }

        const { status, type } = req.query;
        const query: any = {};

        if (status) query.status = status;
        if (type) query.type = type;

        const vehicles = await Vehicle.find(query);

        // Calcul agrégé pour le résumé
        const total = await Vehicle.countDocuments();
        const available = await Vehicle.countDocuments({ status: 'available' });
        const maintenance = await Vehicle.countDocuments({ status: { $in: ['maintenance', 'repair'] } });

        res.json({
            success: true,
            data: vehicles,
            summary: {
                total,
                available,
                maintenance
            }
        });
    } catch (error) {
        logger.error('Erreur récupération véhicules:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// GET /api/fleet/vehicles/:id - Détails véhicule
router.get('/vehicles/:id', auth, async (req: Request, res: Response) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('driverId', 'name');

        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
        }

        res.json({ success: true, data: vehicle });
    } catch (error) {
        logger.error('Erreur récupération véhicule:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// PUT /api/fleet/vehicles/:id/status - Mise à jour statut
router.put('/vehicles/:id/status', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, driverId } = req.body;

        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Véhicule introuvable' });
        }

        // Mettre à jour
        vehicle.status = status;
        if (driverId !== undefined) vehicle.driverId = driverId;

        await vehicle.save();

        logger.info(`Véhicule ${vehicle.plateNumber} statut changé vers ${status}`);

        res.json({ success: true, data: vehicle });
    } catch (error) {
        logger.error('Erreur mise à jour véhicule:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

export default router;
