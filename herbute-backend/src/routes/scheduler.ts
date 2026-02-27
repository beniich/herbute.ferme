import { Router, Request, Response } from 'express';
import { authenticate as auth } from '../middleware/security.js';
import { logger } from '../utils/logger.js';
import { ShiftType, ShiftAssignment } from '../models/Scheduler.js';

const router = Router();

// GET /api/scheduler/shifts - Liste des types de shifts
router.get('/shifts', auth, async (req: Request, res: Response) => {
    try {
        // Si vide, initialiser avec des données par défaut (pour démo)
        const count = await ShiftType.countDocuments();
        if (count === 0) {
            await ShiftType.insertMany([
                { id: 'morning', name: 'Matin', description: 'Équipe du matin', startTime: '08:00', endTime: '16:00', color: '#3b82f6', requiredStaff: 3 },
                { id: 'afternoon', name: 'Après-midi', description: 'Équipe d\'après-midi', startTime: '16:00', endTime: '00:00', color: '#f59e0b', requiredStaff: 3 },
                { id: 'night', name: 'Nuit', description: 'Équipe de nuit', startTime: '00:00', endTime: '08:00', color: '#8b5cf6', requiredStaff: 2 },
                { id: 'oncall', name: 'Astreinte', description: 'Disponible en cas d\'urgence', startTime: '00:00', endTime: '23:59', color: '#ef4444', requiredStaff: 1 }
            ]);
        }

        const shifts = await ShiftType.find();
        res.json({
            success: true,
            data: shifts
        });
    } catch (error) {
        logger.error('Erreur récupération shifts:', error);
        res.status(500).json({ success: false, message: 'Erreur récupération shifts' });
    }
});

// GET /api/scheduler/assignments - Liste des assignations
router.get('/assignments', auth, async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, memberId } = req.query;
        const query: any = {};

        if (startDate) query.date = { $gte: startDate };
        if (endDate) {
            if (!query.date) query.date = {};
            query.date.$lte = endDate;
        }
        if (memberId) query.memberId = memberId;

        const assignments = await ShiftAssignment.find(query);

        res.json({
            success: true,
            data: assignments
        });
    } catch (error) {
        logger.error('Erreur récupération assignments:', error);
        res.status(500).json({ success: false, message: 'Erreur récupération assignations' });
    }
});

// POST /api/scheduler/assignments - Créer une assignation
router.post('/assignments', auth, async (req: Request, res: Response) => {
    try {
        const { shiftId, memberId, memberName, date } = req.body;

        // Vérifier doublons
        const exists = await ShiftAssignment.findOne({ memberId, date, shiftId });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: 'Ce membre est déjà assigné à cette date pour ce shift'
            });
        }

        const newAssignment = new ShiftAssignment({
            shiftId,
            memberId,
            memberName,
            date,
            status: 'scheduled'
        });

        await newAssignment.save();

        logger.info(`Nouvelle assignation: ${memberName} le ${date}`);

        res.status(201).json({
            success: true,
            data: newAssignment
        });
    } catch (error) {
        logger.error('Erreur création assignation:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

// DELETE /api/scheduler/assignments/:id - Supprimer une assignation
router.delete('/assignments/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ShiftAssignment.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Assignation introuvable' });
        }

        res.json({ success: true, message: 'Assignation supprimée' });
    } catch (error) {
        logger.error('Erreur suppression assignation:', error);
        res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
});

export default router;
