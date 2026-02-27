import { Router } from 'express';
import { Leave } from '../models/Leave.js';
import { authenticate as protect } from '../middleware/security.js';

const router = Router();

router.get('/', protect, async (req, res, next) => {
    try {
        const leaves = await Leave.find().populate('staffId').sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/status', protect, async (req, res, next) => {
    try {
        const { status } = req.body;
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(leave);
    } catch (err) {
        next(err);
    }
});

export default router;
