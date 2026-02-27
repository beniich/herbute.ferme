/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * middleware/authenticate.ts â€” VÃ©rification JWT RS256
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * IMPORTANT : Ce middleware utilise UNIQUEMENT la clÃ© publique
 * pour vÃ©rifier les tokens â€” il ne peut pas en Ã©mettre.
 *
 * Lecture du token : Cookie HttpOnly en prioritÃ©,
 * fallback header Authorization (pour clients API non-browser)
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens';
// The Express.Request global augmentation (user?) is declared in middleware/security.ts

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Extraction du token depuis la requÃªte
// PrioritÃ© : Cookie HttpOnly > Header Authorization
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const extractToken = (req: Request): string | null => {
  // 1. Cookie HttpOnly (recommandÃ© â€” protÃ¨ge contre XSS)
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  // 2. Fallback header Bearer (pour clients API, mobile, scripts)
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Middleware : authentification obligatoire
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({
      error: 'Non authentifiÃ©',
      code:  'TOKEN_MISSING',
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Session expirÃ©e',
        code:  'TOKEN_EXPIRED',
      });
      return;
    }

    res.status(401).json({
      error: 'Token invalide',
      code:  'TOKEN_INVALID',
    });
  }
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Middleware : authentification optionnelle
// Attache req.user si un token valide est prÃ©sent,
// mais laisse passer si absent (routes publiques enrichies)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const authenticateOptional = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Token prÃ©sent mais invalide â†’ on ignore silencieusement
    }
  }

  next();
};
