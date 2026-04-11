import { Router, Response } from 'express';
import { Organization } from '../models/Organization.js';
import { authenticate as auth } from '../middleware/security.js';
import { requireAdmin } from '../middleware/organization.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { auditAction } from '../middleware/auditLogger.js';

const router = Router();

/**
 * @route   GET /api/tenant/info
 * @desc    Get current tenant (organization) plan and quota info
 * @access  Private (Admin)
 */
router.get('/info', auth, requireAdmin, async (req: any, res: Response) => {
  try {
    const org = await Organization.findById(req.organizationId);
    if (!org) return sendError(res, 'Organisation introuvable', 'NOT_FOUND', 404);

    sendSuccess(res, {
      id: org._id,
      name: org.name,
      slug: org.slug,
      plan: org.subscription.plan,
      status: org.subscription.status,
      quotas: org.subscription.quotas,
      billing: org.billing,
      expiresAt: org.subscription.expiresAt
    });
  } catch (error: any) {
    sendError(res, error.message, 'INTERNAL_ERROR', 500);
  }
});

/**
 * @route   PATCH /api/tenant/settings
 * @desc    Update organization settings (timezone, currency, etc.)
 * @access  Private (Admin)
 */
router.patch('/settings', auth, requireAdmin, auditAction('Organization', 'UPDATE'), async (req: any, res: Response) => {
  try {
    const { settings } = req.body;
    
    const org = await Organization.findByIdAndUpdate(
      req.organizationId,
      { $set: { settings } },
      { new: true, runValidators: true }
    );

    sendSuccess(res, org);
  } catch (error: any) {
    sendError(res, error.message, 'UPDATE_ERROR', 400);
  }
});

export default router;
