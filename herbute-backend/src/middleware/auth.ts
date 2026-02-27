import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JwtPayload } from './security.js';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[Auth Middleware] Missing or invalid Authorization header');
        return res.status(401).json({ message: 'Token requis' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.user = decoded;
        console.log(`[Auth Middleware] ✅ Token valid for user ${decoded.id}`);
        next();
    } catch (err) {
        console.error('[Auth Middleware] ❌ Token verification failed:', err instanceof Error ? err.message : 'Unknown error');
        return res.status(401).json({ message: 'Token invalide' });
    }
};

export const auth = protect; // Alias for backward compatibility

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin')
        return res.status(403).json({ message: 'Accès admin requis' });
    next();
};
