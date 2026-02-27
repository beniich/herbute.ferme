import { Router } from 'express';
import { authenticate as protect, requireAdmin as adminOnly } from '../middleware/security.js';
import { body, param } from 'express-validator';
import { validator } from '../middleware/validator.js';
import { Intervention } from '../models/Intervention.js';
import { Team } from '../models/Team.js';
import { io } from '../services/socketService.js';

const router = Router();

/* GET /api/planning/interventions */
router.get('/interventions', protect, async (req, res, next) => {
    try {
        const { start, end, teamId } = req.query;

        const query: any = {};

        if (start && end) {
            query.start = { $gte: new Date(start as string), $lte: new Date(end as string) };
        }

        if (teamId) {
            query.teamId = teamId;
        }

        const interventions = await Intervention.find(query)
            .populate('teamId', 'name color')
            .populate('complaintId', 'title number address') // Include address for map
            .populate('assignedTechnicians', 'name')
            .sort({ start: 1 });

        res.json(interventions);
    } catch (err) {
        next(err);
    }
});

/* POST /api/planning/interventions */
router.post(
    '/interventions',
    protect,
    [
        body('teamId').isMongoId(),
        body('complaintId').isMongoId(),
        body('title').notEmpty(),
        body('start').isISO8601(),
        body('end').isISO8601(),
        body('priority').isIn(['low', 'medium', 'high', 'urgent']),
        // body('status') defaults to 'scheduled'
    ],
    validator,
    async (req, res, next) => {
        try {
            // Check for conflicts (simple overlap check)
            const { teamId, start, end } = req.body;

            const conflict = await Intervention.findOne({
                teamId,
                $or: [
                    { start: { $lt: end }, end: { $gt: start } }
                ]
            });

            if (conflict) {
                return res.status(409).json({
                    message: 'Conflit de planning détecté pour cette équipe.',
                    conflictId: conflict._id
                });
            }

            const intervention = await Intervention.create(req.body);

            // Notify team members (mock)
            if (io) {
                io.emit('new-intervention', intervention);
            }

            res.status(201).json(intervention);
        } catch (err) {
            next(err);
        }
    }
);

/* PATCH /api/planning/interventions/:id */
router.patch(
    '/interventions/:id',
    protect,
    [
        param('id').isMongoId(),
        body('start').optional().isISO8601(),
        body('end').optional().isISO8601(),
        body('status').optional().isIn(['scheduled', 'in-progress', 'completed', 'cancelled'])
    ],
    validator,
    async (req, res, next) => {
        try {
            const updated = await Intervention.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!updated) return res.status(404).json({ message: 'Intervention introuvable' });

            if (io) {
                io.emit('intervention-updated', updated);
            }

            res.json(updated);
        } catch (err) {
            next(err);
        }
    }
);

/* DELETE /api/planning/interventions/:id */
router.delete(
    '/interventions/:id',
    protect,
    [param('id').isMongoId()],
    validator,
    async (req, res, next) => {
        try {
            await Intervention.findByIdAndDelete(req.params.id);
            res.json({ message: 'Intervention supprimée' });
        } catch (err) {
            next(err);
        }
    }
);

export default router;
