import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Complaint } from '../models/Complaint';
import jwt from 'jsonwebtoken';
import { producer } from '../index';

const router = Router();

// Stateless Auth Middleware
const protect = (req: Request | any, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded; // { id, role }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

/* POST / */
router.post(
    '/',
    // protect, // Optional: Public complaints allowed? Let's assume protected for now or check isAnonymous
    [
        body('title').notEmpty(),
        body('description').notEmpty(),
        body('category').notEmpty(),
        body('address').notEmpty()
    ],
    validate,
    async (req: Request, res: Response) => {
        try {
            const complaint = await Complaint.create(req.body);

            // Kafka Event
            await producer.send({
                topic: 'complaint-events',
                messages: [{
                    value: JSON.stringify({
                        type: 'COMPLAINT_CREATED',
                        complaintId: complaint._id,
                        number: complaint.number,
                        category: complaint.category,
                        priority: complaint.priority,
                        status: complaint.status,
                        timestamp: new Date()
                    })
                }]
            });

            res.status(201).json(complaint);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
);

/* GET / */
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

/* GET /:id */
router.get('/:id', protect, async (req: Request, res: Response) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        res.json(complaint);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

/* PATCH /:id/status */
router.patch('/:id/status', protect, async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        const oldStatus = complaint.status;
        complaint.status = status;
        await complaint.save();

        if (oldStatus !== status) {
            // Kafka Event
            await producer.send({
                topic: 'complaint-events',
                messages: [{
                    value: JSON.stringify({
                        type: 'COMPLAINT_STATUS_UPDATED',
                        complaintId: complaint._id,
                        oldStatus,
                        newStatus: status,
                        timestamp: new Date()
                    })
                }]
            });
        }

        res.json(complaint);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
