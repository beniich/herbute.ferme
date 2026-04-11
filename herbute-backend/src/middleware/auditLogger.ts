import { NextFunction, Response } from 'express';
import { AuditLog } from '../models/AuditLog.js';

/**
 * Middleware higher-order function to log actions to AuditLog
 * @param resource - The name of the resource (e.g., 'Crop', 'Animal', 'User')
 * @param action - The action being performed
 */
export const auditAction = (resource: string, action: 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'AI_GENERATION') => {
  return async (req: any, res: Response, next: NextFunction) => {
    // We override res.json to capture the response body and log after successful execution
    const originalJson = res.json;

    res.json = function(body: any) {
      // Only log if the request was successful (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Run logging asynchronously to not block the response
        const logEntry = {
          organizationId: req.organizationId || req.user?.organizationId,
          userId: req.user?._id || req.user?.id,
          userEmail: req.user?.email || 'unknown',
          action,
          resource,
          resourceId: req.params.id || body?.data?._id || body?.id || null,
          ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          severity: action === 'DELETE' ? 'warning' : 'info',
          // Note: In a real production apps, you'd capture 'changes' by comparing 
          // req.body with the document before update, but for now we log basics.
        };

        if (logEntry.organizationId && logEntry.userId) {
          AuditLog.create(logEntry).catch(err => {
            console.error('[Audit] Failed to create audit log:', err.message);
          });
        }
      }

      return originalJson.call(this, body);
    };

    next();
  };
};
