/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * middleware/authorize.ts â€” ContrÃ´le d'accÃ¨s (RBAC + Plans)
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */

import { Request, Response, NextFunction } from 'express';
import type { UserRole, SubscriptionPlan } from '@reclamtrack/shared';

type AuthMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// authorize(...roles) â€” VÃ©rification de rÃ´le
// Usage: router.delete('/resource', authenticate, authorize('admin', 'manager'), handler)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const authorize = (...roles: UserRole[]): AuthMiddleware => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifiÃ©', code: 'NOT_AUTHENTICATED' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        error:    'AccÃ¨s refusÃ© â€” rÃ´le insuffisant',
        code:     'FORBIDDEN_ROLE',
        required: roles,
        current:  req.user.role,
      });
      return;
    }

    next();
  };
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// requirePlan(...plans) â€” VÃ©rification d'abonnement
// Usage: router.get('/rapports', authenticate, requirePlan('professionnel', 'entreprise'), handler)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const requirePlan = (...plans: SubscriptionPlan[]): AuthMiddleware => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifiÃ©', code: 'NOT_AUTHENTICATED' });
      return;
    }

    if (!plans.includes((req.user as any).plan as SubscriptionPlan)) {
      res.status(403).json({
        error:         'Fonctionnalité non disponible pour votre plan',
        code:          'FORBIDDEN_PLAN',
        currentPlan:   (req.user as any).plan,
        requiredPlans: plans,
      });
      return;
    }

    next();
  };
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// requireFarmAccess â€” VÃ©rifie que l'utilisateur
// appartient bien Ã  la ferme de la ressource demandÃ©e
// Usage: router.get('/farm/:farmId/data', authenticate, requireFarmAccess, handler)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const requireFarmAccess: AuthMiddleware = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ error: 'Non authentifiÃ©' });
    return;
  }

  const requestedFarmId = req.params.farmId || req.body?.farmId;

  // Les super_admin et admin ont accÃ¨s Ã  toutes les fermes
  if (['super_admin', 'admin'].includes(req.user.role)) {
    return next();
  }

  if (requestedFarmId && (req.user as any).farmId !== requestedFarmId) {
    res.status(403).json({
      error: 'AccÃ¨s refusÃ© â€” ferme non autorisÃ©e',
      code:  'FORBIDDEN_FARM',
    });
    return;
  }

  next();
};
