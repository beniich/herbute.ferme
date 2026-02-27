/**
 * middleware/security.ts
 * THE single source of truth for all authentication and authorization middleware.
 * All routes MUST import from here. auth.ts and organization.ts have been removed.
 *
 * Exports:
 *   authenticate         — validates JWT access token, attaches req.user
 *   requireRole          — role-based access control (admin, manager, etc.)
 *   requireOrganization  — ensures user belongs to the org in :orgId param
 *   requireApiKey        — validates x-api-key header via apiKeyService
 *   requireSubscription  — feature-gate based on org subscription plan
 *   restrictToIPs        — IP whitelist (used for /auth/introspect)
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  TokenExpiredAppError,
  TokenInvalidAppError,
  ForbiddenAppError,
  AuthAppError,
  SubscriptionError,
} from '../AppError';
import { apiKeyService } from '../services/apiKeyService';
import { subscriptionService } from '../services/subscriptionService';
import logger from '../utils/logger';

/* ─── Type augmentation ─────────────────────────── */
export interface JwtPayload {
  sub: string;       // user ID
  orgId: string;
  role: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      id: string;
    }
  }
}

/* ═══════════════════════════════════════════════════
   authenticate — JWT access token verification
═══════════════════════════════════════════════════ */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthAppError('No authorization token provided');
    }

    const token = authHeader.substring(7);

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredAppError();
      }
      throw new TokenInvalidAppError();
    }
  } catch (err) {
    next(err);
  }
}

/* ═══════════════════════════════════════════════════
   requireRole — RBAC middleware factory
   Usage: requireRole('admin') or requireRole('admin', 'manager')
═══════════════════════════════════════════════════ */
export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AuthAppError());
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new ForbiddenAppError(
        `This action requires one of the following roles: ${roles.join(', ')}`
      ));
      return;
    }
    next();
  };
}

/** Convenience alias */
export const requireAdmin = requireRole('admin');

/* ═══════════════════════════════════════════════════
   requireOrganization — ensures user belongs to org
═══════════════════════════════════════════════════ */
export function requireOrganization(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AuthAppError());
    return;
  }
  const orgId = req.params.orgId ?? req.body?.orgId;
  if (orgId && req.user.orgId !== orgId && req.user.role !== 'superadmin') {
    next(new ForbiddenAppError('You do not have access to this organization'));
    return;
  }
  next();
}

/* ═══════════════════════════════════════════════════
   requireApiKey — validates x-api-key header
   Sets req.user from the API key's associated user/org
═══════════════════════════════════════════════════ */
export function requireApiKey(req: Request, _res: Response, next: NextFunction): void {
  const rawKey = req.headers['x-api-key'] as string | undefined;
  if (!rawKey) {
    next(new AuthAppError('x-api-key header is required', 'API_KEY_MISSING'));
    return;
  }

  apiKeyService.validateApiKey(rawKey)
    .then((apiKey) => {
      if (!apiKey) {
        throw new AuthAppError('Invalid or inactive API key', 'API_KEY_INVALID');
      }
      // Attach minimal user context from API key
      req.user = {
        sub: apiKey.createdBy.toString(),
        orgId: apiKey.orgId.toString(),
        role: 'api', // API key role
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      next();
    })
    .catch(next);
}

/* ═══════════════════════════════════════════════════
   requireSubscription — feature-gate middleware factory
   Usage: requireSubscription('advanced_analytics')
═══════════════════════════════════════════════════ */
export function requireSubscription(feature: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthAppError();
      }
      const hasFeature = await subscriptionService.hasFeature(req.user.orgId, feature);
      if (!hasFeature) {
        throw new SubscriptionError(feature);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

/* ═══════════════════════════════════════════════════
   restrictToIPs — IP whitelist middleware factory
   Used for internal-only endpoints like /auth/introspect
═══════════════════════════════════════════════════ */
export function restrictToIPs(allowedIPs: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.socket.remoteAddress || '';
    const isAllowed = allowedIPs.some(ip =>
      clientIP === ip ||
      clientIP.endsWith(`::ffff:${ip}`) // IPv4-mapped IPv6
    );

    if (!isAllowed) {
      logger.warn(`[restrictToIPs] Blocked request from ${clientIP} to ${req.path}`, {
        requestId: req.id,
      });
      next(new ForbiddenAppError('This endpoint is not accessible from your IP address'));
      return;
    }
    next();
  };
}
