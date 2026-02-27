/**
 * services/tokenService.ts
 * Issues, rotates, and revokes JWT access + refresh token pairs.
 *
 * Security model:
 *   - Access token: short-lived (15m), stateless JWT
 *   - Refresh token: long-lived (7d), stored as SHA-256 hash in DB
 *   - Family-based rotation: reuse of an already-rotated token revokes
 *     the entire family (all user sessions on that device/chain)
 */
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { Types } from 'mongoose';
import { RefreshToken } from '../models/RefreshToken.js';
import { RefreshTokenError, RefreshTokenReuseError } from '../utils/AppError.js';
import logger from '../utils/logger.js';
import type { JwtPayload } from '../middleware/security.js';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenPayload {
  id: string;
  orgId: string;
  role: string;
}

function hashToken(raw: string): string {
  return crypto
    .createHmac('sha256', process.env.JWT_REFRESH_SECRET!)
    .update(raw)
    .digest('hex');
}

function generateRawRefreshToken(): string {
  return crypto.randomBytes(48).toString('base64url'); // 64-char URL-safe string
}

function signAccessToken(user: UserTokenPayload): string {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub: user.id,
    orgId: user.orgId,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  } as jwt.SignOptions);
}

export const tokenService = {
  /**
   * Issue a fresh token pair — used at login and register.
   * Creates a new family UUID (fresh rotation chain).
   */
  async issueTokenPair(user: UserTokenPayload): Promise<TokenPair> {
    const accessToken = signAccessToken(user);
    const rawRefresh = generateRawRefreshToken();
    const tokenHash = hashToken(rawRefresh);
    const family = uuidv4();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshToken.create({
      userId: new Types.ObjectId(user.id),
      tokenHash,
      family,
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefresh };
  },

  /**
   * Rotate refresh token — used at /auth/refresh.
   *
   * Flow:
   *   1. Hash incoming token and look up in DB
   *   2. If not found → invalid (never existed)
   *   3. If already revoked → REUSE ATTACK → revoke entire family
   *   4. If expired → reject
   *   5. Otherwise → revoke old record, issue new pair in same family
   */
  async rotateRefreshToken(rawToken: string): Promise<TokenPair> {
    const tokenHash = hashToken(rawToken);
    const existing = await RefreshToken.findOne({ tokenHash });

    if (!existing) {
      throw new RefreshTokenError('Refresh token not found');
    }

    // Reuse attack detected — revoke the entire family
    if (existing.isRevoked()) {
      logger.warn('[tokenService] Refresh token reuse detected — revoking family', {
        family: existing.family,
        userId: existing.userId.toString(),
      });
      await RefreshToken.updateMany(
        { family: existing.family, revokedAt: null },
        { revokedAt: new Date() },
      );
      throw new RefreshTokenReuseError();
    }

    if (existing.isExpired()) {
      throw new RefreshTokenError('Refresh token has expired');
    }

    // Revoke the current token
    existing.revokedAt = new Date();
    await existing.save();

    // Lookup user data from the token record
    const user = await (await import('../models/User')).User.findById(existing.userId).lean();
    if (!user) {
      throw new RefreshTokenError('User associated with token no longer exists');
    }

    // Issue new pair with the SAME family
    const accessToken = signAccessToken({
      id: user._id.toString(),
      orgId: user.orgId?.toString() ?? '',
      role: user.role ?? 'user',
    });
    const rawRefresh = generateRawRefreshToken();
    const newHash = hashToken(rawRefresh);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      userId: existing.userId,
      tokenHash: newHash,
      family: existing.family, // same family
      expiresAt,
    });

    return { accessToken, refreshToken: rawRefresh };
  },

  /**
   * Revoke a specific refresh token — used at /auth/logout.
   */
  async revokeRefreshToken(rawToken: string): Promise<void> {
    const tokenHash = hashToken(rawToken);
    await RefreshToken.findOneAndUpdate({ tokenHash }, { revokedAt: new Date() });
  },

  /**
   * Revoke ALL refresh tokens for a user — force logout everywhere.
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await RefreshToken.updateMany(
      { userId: new Types.ObjectId(userId), revokedAt: null },
      { revokedAt: new Date() },
    );
  },

  /**
   * Phantom token introspection — validates opaque token for service-to-service calls.
   * Returns decoded payload or null if invalid.
   */
  async introspect(rawToken: string): Promise<JwtPayload | null> {
    try {
      // The access token IS the opaque token for introspection in this pattern
      const payload = jwt.verify(rawToken, process.env.JWT_SECRET!) as JwtPayload;
      return payload;
    } catch {
      return null;
    }
  },
};
