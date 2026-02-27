import { Router } from 'express';
import { Staff } from '../models/Staff.js';
import { authenticate as protect } from '../middleware/security.js';

const router = Router();

router.get('/', protect, async (req, res, next) => {
    try {
        const staff = await Staff.find().sort({ name: 1 });
        res.json(staff);
    } catch (err) {
        next(err);
    }
});

router.post('/', protect, async (req, res, next) => {
    try {
        const newStaff = await Staff.create(req.body);
        res.status(201).json(newStaff);
    } catch (err) {
        next(err);
    }
});

export default router;
