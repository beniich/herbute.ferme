/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * utils/tokens.ts â€” GÃ©nÃ©ration et vÃ©rification JWT RS256
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { jwtConfig } from '../config/jwt';
import type { JwtPayload, TokenPair, UserTokenData } from '@reclamtrack/shared';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// GÃ©nÃ©ration d'une paire de tokens
// AppelÃ© UNIQUEMENT lors du login / refresh
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const generateTokenPair = (user: UserTokenData): TokenPair => {
  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    sub:    user.id,
    email:  user.email,
    role:   user.role,
    farmId: user.farmId,
    plan:   user.plan,
    org:    user.organizationId,
  };

  const accessToken = jwt.sign(payload, jwtConfig.privateKey, {
    algorithm: jwtConfig.algorithm as jwt.Algorithm,
    expiresIn: jwtConfig.accessTokenTtl as jwt.SignOptions['expiresIn'],
    issuer:    jwtConfig.issuer,
    audience:  jwtConfig.audience,
  } as jwt.SignOptions);

  // Le refresh token est un token opaque (UUID hashÃ©) â€” pas un JWT
  // StockÃ© en DB â†’ rÃ©vocable individuellement sans blacklist Redis
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const refreshTokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  return {
    accessToken,
    refreshToken,      // Token brut â†’ envoyÃ© au client (cookie HttpOnly)
    refreshTokenHash,  // Hash â†’ stockÃ© en DB
    expiresIn: jwtConfig.accessTokenTtl,
  };
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// VÃ©rification d'un access token
// Utilise UNIQUEMENT la clÃ© publique
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtConfig.publicKey, {
    algorithms: [jwtConfig.algorithm],
    issuer:     jwtConfig.issuer,
    audience:   jwtConfig.audience,
  }) as JwtPayload;
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Hash d'un refresh token pour stockage DB
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const hashRefreshToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
