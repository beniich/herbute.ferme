import { Router } from 'express';
import { body, param } from 'express-validator';
import { validator } from '../middleware/validator.js';
import { authenticate as protect } from '../middleware/security.js';
import { requireOrganization } from '../middleware/security.js';

const router = Router();

// Apply organization context to all intervention routes
router.use(protect, requireOrganization);

// Mock data for interventions (linked to complaints/assignments)
// In a real implementation, this would be a Mongoose model
const mockInterventions = [
    {
        id: '1',
        complaintId: 'complaint_1',
        teamId: 'team_1',
        technicianId: 'tech_1',
        status: 'scheduled',
        scheduledDate: new Date('2026-02-17T10:00:00'),
        completedDate: null,
        notes: '',
        duration: 120, // minutes
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

/**
 * @route   GET /api/interventions
 * @desc    Get all interventions (optionally filtered)
 * @access  Private
 */
router.get('/', async (req: any, res, next) => {
    try {
        const { complaintId, teamId, status } = req.query;

        let results = [...mockInterventions];

        // Filter by complaint
        if (complaintId) {
            results = results.filter(i => i.complaintId === complaintId);
        }

        // Filter by team
        if (teamId) {
            results = results.filter(i => i.teamId === teamId);
        }

        // Filter by status
        if (status) {
            results = results.filter(i => i.status === status);
        }

        res.json({
            success: true,
            data: results,
            total: results.length
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @route   GET /api/interventions/:id
 * @desc    Get intervention by ID
 * @access  Private
 */
router.get('/:id', async (req: any, res, next) => {
    try {
        const intervention = mockInterventions.find(i => i.id === req.params.id);

        if (!intervention) {
            return res.status(404).json({
                success: false,
                message: 'Intervention non trouvée'
            });
        }

        res.json({
            success: true,
            data: intervention
        });
    } catch (err) {
        next(err);
    }
});

/**
 * @route   POST /api/interventions
 * @desc    Create new intervention
 * @access  Private
 */
router.post(
    '/',
    [
        body('complaintId').notEmpty().withMessage('Complaint ID is required'),
        body('teamId').notEmpty().withMessage('Team ID is required'),
        body('scheduledDate').isISO8601().toDate().withMessage('Valid scheduled date is required'),
        body('duration').optional().isInt({ min: 1 }),
        body('notes').optional().isString()
    ],
    validator,
    async (req: any, res, next) => {
        try {
            const newIntervention = {
                id: `intervention_${Date.now()}`,
                ...req.body,
                status: 'scheduled',
                completedDate: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockInterventions.push(newIntervention);

            res.status(201).json({
                success: true,
                data: newIntervention,
                message: 'Intervention créée avec succès'
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * @route   PUT /api/interventions/:id
 * @desc    Update intervention
 * @access  Private
 */
router.put(
    '/:id',
    [
        param('id').notEmpty(),
        body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']),
        body('completedDate').optional().isISO8601().toDate(),
        body('notes').optional().isString(),
        body('duration').optional().isInt({ min: 1 })
    ],
    validator,
    async (req: any, res, next) => {
        try {
            const index = mockInterventions.findIndex(i => i.id === req.params.id);

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    message: 'Intervention non trouvée'
                });
            }

            mockInterventions[index] = {
                ...mockInterventions[index],
                ...req.body,
                updatedAt: new Date()
            };

            res.json({
                success: true,
                data: mockInterventions[index],
                message: 'Intervention mise à jour'
            });
        } catch (err) {
            next(err);
        }
    }
);

/**
 * @route   DELETE /api/interventions/:id
 * @desc    Delete intervention
 * @access  Private
 */
router.delete('/:id', async (req: any, res, next) => {
    try {
        const index = mockInterventions.findIndex(i => i.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Intervention non trouvée'
            });
        }

        mockInterventions.splice(index, 1);

        res.json({
            success: true,
            message: 'Intervention supprimée'
        });
    } catch (err) {
        next(err);
    }
});

export default router;
