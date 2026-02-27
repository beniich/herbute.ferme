/**
 * routes/auth.ts
 * Authentication routes.
 *
 * POST /api/auth/register    → register + issue token pair
 * POST /api/auth/login       → login + issue token pair
 * GET  /api/auth/me          → get current user profile
 * POST /api/auth/refresh     → rotate refresh token
 * POST /api/auth/logout      → revoke refresh token
 * POST /api/auth/introspect  → phantom token (IP-restricted, internal services only)
 */
import { Router, Request, Response } from 'express';
import { tokenService } from '../services/tokenService';
import { authenticate, restrictToIPs } from '../middleware/security';
import { validate } from '../middleware/validator';
import { RegisterDto, LoginDto, RefreshTokenDto, LogoutDto, IntrospectDto } from '../dto/auth.dto';
import { asyncHandler } from '../errorHandler';
import { sendSuccess } from '../utils/apiResponse';
import { User } from '../models/User';
import { AuthAppError, NotFoundAppError } from '../AppError';
import { authLimiter } from '../middleware/rateLimiters';

const router = Router();

const INTROSPECT_IPS = (process.env.INTROSPECT_ALLOWED_IPS || '127.0.0.1,::1')
  .split(',').map(ip => ip.trim());

/* ── POST /api/auth/register ────────────────────── */
router.post(
  '/register',
  authLimiter,
  RegisterDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new AuthAppError('An account with this email already exists', 'AUTH_EMAIL_TAKEN');
    }

    const user = await User.create({ email, password, name, role: 'agent' });

    const tokens = await tokenService.issueTokenPair({
      id: user._id.toString(),
      orgId: user.orgId?.toString() ?? '',
      role: user.role,
    });

    return sendSuccess(
      res,
      {
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
        ...tokens,
      },
      201,
      req.id,
    );
  }),
);

/* ── POST /api/auth/login ───────────────────────── */
router.post(
  '/login',
  authLimiter,
  LoginDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      // Generic error — don't reveal if email exists
      throw new AuthAppError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new AuthAppError('This account has been deactivated', 'AUTH_ACCOUNT_DISABLED');
    }

    user.lastLoginAt = new Date();
    await user.save();

    const tokens = await tokenService.issueTokenPair({
      id: user._id.toString(),
      orgId: user.orgId?.toString() ?? '',
      role: user.role,
    });

    return sendSuccess(
      res,
      {
        user: { id: user._id, email: user.email, name: user.name, role: user.role },
        ...tokens,
      },
      200,
      req.id,
    );
  }),
);

/* ── GET /api/auth/me ───────────────────────────── */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.user!.sub);
    if (!user) throw new NotFoundAppError('User');
    return sendSuccess(res, user, 200, req.id);
  }),
);

/* ── POST /api/auth/refresh ─────────────────────── */
router.post(
  '/refresh',
  authLimiter,
  RefreshTokenDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await tokenService.rotateRefreshToken(refreshToken);
    return sendSuccess(res, tokens, 200, req.id);
  }),
);

/* ── POST /api/auth/logout ──────────────────────── */
router.post(
  '/logout',
  LogoutDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    await tokenService.revokeRefreshToken(refreshToken);
    return sendSuccess(res, { message: 'Logged out successfully' }, 200, req.id);
  }),
);

/* ── POST /api/auth/introspect ──────────────────── */
/* Phantom token endpoint — internal services only, IP-restricted */
router.post(
  '/introspect',
  restrictToIPs(INTROSPECT_IPS),
  IntrospectDto,
  validate,
  asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    const payload = await tokenService.introspect(token);
    if (!payload) {
      return sendSuccess(res, { active: false }, 200, req.id);
    }
    return sendSuccess(res, { active: true, ...payload }, 200, req.id);
  }),
);

export default router;
