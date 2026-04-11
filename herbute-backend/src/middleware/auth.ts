import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../config/jwt.js';

/**
 * Modernized authenticate middleware
 * Harmonized with global Request type extension
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request (merged via global Express.Request in security.ts or local cast)
  (req as any).user = payload;
  next();
};

export default authenticate;
