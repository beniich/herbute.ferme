import { Router, Request, Response, NextFunction } from 'express';
import { Team } from '../models/Team';
import jwt from 'jsonwebtoken';
import { producer } from '../index';

const router = Router();

// Stateless Auth Middleware (Same as other services)
const protect = (req: Request | any, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/* GET / */
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

/* POST / */
router.post('/', protect, async (req: Request, res: Response) => {
    try {
        const team = await Team.create(req.body);

        // Kafka Event
        await producer.send({
            topic: 'team-events',
            messages: [{
                value: JSON.stringify({
                    type: 'TEAM_CREATED',
                    teamId: team._id,
                    name: team.name,
                    timestamp: new Date()
                })
            }]
        });

        res.status(201).json(team);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

/* PATCH /:id/status */
router.patch('/:id/status', protect, async (req: Request, res: Response) => {
    try {
        const { status, lat, lng } = req.body;
        const team = await Team.findById(req.params.id);

        if (!team) return res.status(404).json({ message: 'Team not found' });

        if (status) team.status = status;
        if (lat && lng) team.location = { lat, lng };

        await team.save();

        // Kafka Event
        await producer.send({
            topic: 'team-events',
            messages: [{
                value: JSON.stringify({
                    type: 'TEAM_STATUS_UPDATED',
                    teamId: team._id,
                    status: team.status,
                    location: team.location,
                    timestamp: new Date()
                })
            }]
        });

        res.json(team);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
