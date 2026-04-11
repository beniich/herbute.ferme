import { Router, Request, Response } from 'express';
import { authenticate as auth } from '../middleware/security.js';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const router = Router();

// GET /api/audit-logs - Retrieve audit logs scoped to the current organization
router.get('/', auth, async (req: any, res: Response) => {
    try {
        const { limit = '50', page = '1', action, userId, resource } = req.query;
        const organizationId = req.organizationId || req.user?.organizationId;

        if (!organizationId) {
            return sendError(res, 'Context d\'organisation manquant', 'ORG_MISSING', 400);
        }

        const query: any = { organizationId };
        if (action) query.action = action;
        if (userId) query.userId = userId;
        if (resource) query.resource = resource;

        const limitNum = parseInt(limit as string, 10);
        const pageNum = parseInt(page as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const logs = await AuditLog.find(query)
            .sort({ timestamp: -1 })
            .limit(limitNum)
            .skip(skip)
            .populate('userId', 'name email role')
            .lean();

        const total = await AuditLog.countDocuments(query);

        return sendSuccess(res, {
            logs,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error: any) {
        logger.error('Error fetching audit logs:', error);
        return sendError(res, 'Server error retrieving audit logs', 'SERVER_ERROR');
    }
});

export default router;

