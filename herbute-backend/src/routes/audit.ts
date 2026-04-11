import { Router, Request, Response } from 'express';
import { authenticate as auth, requireOrganization } from '../middleware/security.js';
import { authorize, Permission } from '../middleware/authorize.js';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const router = Router();
router.use(auth as any, requireOrganization as any);

// ─────────────────────────────────────────────
// GET /api/audit-logs  — Paginated logs list
// ─────────────────────────────────────────────
router.get('/', authorize(Permission.AUDIT_READ), async (req: any, res: Response) => {
    try {
        const { limit = '50', page = '1', action, userId, resource, severity, search, from, to } = req.query;
        const organizationId = req.organizationId;

        const query: any = { organizationId };
        if (action)   query.action = action;
        if (userId)   query.userId = userId;
        if (resource) query.resource = resource;
        if (severity) query.severity = severity;
        if (from || to) {
            query.timestamp = {};
            if (from) query.timestamp.$gte = new Date(from as string);
            if (to)   query.timestamp.$lte = new Date(to as string);
        }
        if (search) {
            query.$or = [
                { userEmail: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { resource: { $regex: search, $options: 'i' } },
            ];
        }

        const limitNum = Math.min(parseInt(limit as string, 10), 200);
        const pageNum  = parseInt(page as string, 10);
        const skip     = (pageNum - 1) * limitNum;

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ timestamp: -1 })
                .limit(limitNum)
                .skip(skip)
                .populate('userId', 'name prenom email role')
                .lean(),
            AuditLog.countDocuments(query),
        ]);

        return sendSuccess(res, { logs, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) } });
    } catch (error: any) {
        logger.error('Error fetching audit logs:', error);
        return sendError(res, 'Erreur serveur lors de la récupération des logs', 'SERVER_ERROR');
    }
});

// ─────────────────────────────────────────────
// GET /api/audit-logs/stats — KPIs for dashboard
// ─────────────────────────────────────────────
router.get('/stats', authorize(Permission.AUDIT_READ), async (req: any, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days

        const [byAction, bySeverity, topUsers, recent] = await Promise.all([
            AuditLog.aggregate([
                { $match: { organizationId: organizationId, timestamp: { $gte: since } } },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            AuditLog.aggregate([
                { $match: { organizationId: organizationId, timestamp: { $gte: since } } },
                { $group: { _id: '$severity', count: { $sum: 1 } } },
            ]),
            AuditLog.aggregate([
                { $match: { organizationId: organizationId, timestamp: { $gte: since } } },
                { $group: { _id: '$userEmail', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ]),
            AuditLog.find({ organizationId, severity: 'critical' })
                .sort({ timestamp: -1 })
                .limit(5)
                .lean(),
        ]);

        return sendSuccess(res, { byAction, bySeverity, topUsers, recentCritical: recent });
    } catch (error: any) {
        return sendError(res, 'Erreur lors du calcul des stats', 'SERVER_ERROR');
    }
});

// ─────────────────────────────────────────────
// GET /api/audit-logs/export.csv — CSV Export
// ─────────────────────────────────────────────
router.get('/export.csv', authorize(Permission.AUDIT_READ), async (req: any, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const logs = await AuditLog.find({ organizationId }).sort({ timestamp: -1 }).limit(1000).lean();

        const header = 'Timestamp,Action,Resource,ResourceId,User,Severity,IP,Description\n';
        const rows = logs.map(l =>
            `"${l.timestamp}","${l.action}","${l.resource}","${l.resourceId || ''}","${l.userEmail}","${l.severity}","${l.ipAddress || ''}","${(l.description || '').replace(/"/g, "'")}"`
        ).join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=herbute-audit-log.csv');
        res.send(header + rows);
    } catch (err) { res.status(500).send('Erreur export'); }
});

export default router;


