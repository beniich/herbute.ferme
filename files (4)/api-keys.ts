/**
 * routes/api-keys.ts
 * API key management — admin only.
 *
 * GET    /api/api-keys           → list org API keys
 * POST   /api/api-keys           → create new key (raw key returned ONCE)
 * POST   /api/api-keys/:id/rotate → rotate key
 * DELETE /api/api-keys/:id        → revoke key
 */
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { apiKeyService } from '../services/apiKeyService';
import { authenticate, requireAdmin } from '../middleware/security';
import { validate } from '../middleware/validator';
import { CreateApiKeyDto } from '../dto/organization.dto';
import { asyncHandler } from '../errorHandler';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

// All routes require authentication + admin role
router.use(authenticate, requireAdmin);

/* ── GET /api/api-keys ──────────────────────────── */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const keys = await apiKeyService.listOrgKeys(req.user!.orgId);
    return sendSuccess(res, keys, 200, req.id);
  }),
);

/* ── POST /api/api-keys ─────────────────────────── */
router.post(
  '/',
  CreateApiKeyDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, scopes, rateLimit, expiresInDays } = req.body;

    const { rawKey, apiKey } = await apiKeyService.generateApiKey({
      orgId: req.user!.orgId,
      createdBy: req.user!.sub,
      name,
      scopes,
      rateLimit,
      expiresInDays,
    });

    return sendSuccess(
      res,
      {
        message: '⚠️ Save this key — it will not be shown again.',
        key: rawKey,
        id: apiKey._id,
        name: apiKey.name,
        scopes: apiKey.scopes,
        createdAt: apiKey.createdAt,
      },
      201,
      req.id,
    );
  }),
);

/* ── POST /api/api-keys/:id/rotate ─────────────── */
router.post(
  '/:id/rotate',
  [param('id').isMongoId().withMessage('Invalid key ID')],
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { rawKey, apiKey } = await apiKeyService.rotateApiKey(
      req.params.id,
      req.user!.sub,
    );

    return sendSuccess(
      res,
      {
        message: '⚠️ Save this new key — it will not be shown again. The old key is now revoked.',
        key: rawKey,
        id: apiKey._id,
        name: apiKey.name,
      },
      200,
      req.id,
    );
  }),
);

/* ── DELETE /api/api-keys/:id ───────────────────── */
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid key ID')],
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    await apiKeyService.revokeApiKey(req.params.id);
    return sendSuccess(res, { message: 'API key revoked successfully' }, 200, req.id);
  }),
);

export default router;
