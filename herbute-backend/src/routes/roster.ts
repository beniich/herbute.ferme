import { Router } from 'express';
import { Roster } from '../models/Roster.js';
import { authenticate as protect } from '../middleware/security.js';

const router = Router();

router.get('/', protect, async (req, res, next) => {
    try {
        const { week } = req.query;
        let roster = await Roster.findOne({ week }).populate('shifts.staffId');

        if (!roster) {
            // Return empty roster structure if not found
            return res.json({ week, shifts: [] });
        }

        res.json(roster);
    } catch (err) {
        next(err);
    }
});

router.post('/update', protect, async (req, res, next) => {
    try {
        const { week, shifts } = req.body;
        const roster = await Roster.findOneAndUpdate(
            { week },
            { week, shifts },
            { upsert: true, new: true }
        );
        res.json(roster);
    } catch (err) {
        next(err);
    }
});

export default router;
