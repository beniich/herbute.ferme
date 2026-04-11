import { Response, NextFunction } from 'express';
import { TenantService } from '../services/tenantService.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware to enforce SaaS quotas
 * @param resource - The resource type to check
 */
export const quotaGuard = (resource: 'users' | 'storage' | 'aiRequests' | 'animals' | 'crops') => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.organizationId || req.user?.organizationId || req.params.orgId;
      
      if (!organizationId) {
        return sendError(res, 'ID Organisation manquant ou invalide', 'ORG_MISSING', 400);
      }


      const { allowed, limit, current } = await TenantService.checkQuota(organizationId, resource);

      if (!allowed) {
        return sendError(
          res, 
          `Quota atteint pour les ${resource}. Limite: ${limit}, Actuel: ${current}. Veuillez passer à un plan supérieur.`, 
          'QUOTA_EXCEEDED', 
          403
        );
      }

      next();
    } catch (error: any) {
      console.error('[QuotaGuard] Error:', error.message);
      next(error);
    }
  };
};
