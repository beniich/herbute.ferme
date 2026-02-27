import { Router } from 'express';
import { authenticate as protect } from '../middleware/security.js';
import { Complaint } from '../models/Complaint.js';
import { Team } from '../models/Team.js';
import mongoose from 'mongoose';

const router = Router();

/* GET /api/dashboard */
router.get('/', protect, async (req, res, next) => {
    try {
        const totalComplaints = await Complaint.countDocuments();

        // Distribution by Status
        const statusStats = await Complaint.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Distribution by Category
        const categoryStats = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Distribution by Priority
        const priorityStats = await Complaint.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Evolution Trend (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const trendStats = await Complaint.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Team Stats
        const teamStats = await Team.aggregate([
            {
                $lookup: {
                    from: 'assignments',
                    localField: '_id',
                    foreignField: 'teamId',
                    as: 'assignments'
                }
            },
            {
                $project: {
                    name: 1,
                    color: 1,
                    activeAssignments: {
                        $size: {
                            $filter: {
                                input: '$assignments',
                                as: 'a',
                                cond: { $ne: ['$$a.status', 'terminé'] }
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            total: totalComplaints,
            byStatus: statusStats.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
            byCategory: categoryStats,
            byPriority: priorityStats,
            trends: trendStats,
            teamStats
        });
    } catch (err) {
        next(err);
    }
});

export default router;
