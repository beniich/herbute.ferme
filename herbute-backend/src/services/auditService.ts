import { AuditLog, AuditAction } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';

interface AuditOptions {
  organizationId: string;
  userId?: string;
  userEmail: string;
  userName?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  description?: string;
  changes?: { before: Record<string, any>; after: Record<string, any> };
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity?: 'info' | 'warning' | 'critical';
}

export class AuditService {
  /**
   * Create an audit log entry (fire-and-forget)
   */
  static async log(opts: AuditOptions): Promise<void> {
    try {
      const severity = opts.severity ?? this.inferSeverity(opts.action);
      await AuditLog.create({ ...opts, severity, timestamp: new Date() });
    } catch (err: any) {
      logger.error('[AuditService] Failed to write audit log:', err.message);
    }
  }

  /**
   * Extract user & IP from Express request and log
   */
  static async logFromRequest(
    req: any,
    action: AuditAction,
    resource: string,
    opts: Partial<Omit<AuditOptions, 'action' | 'resource' | 'organizationId' | 'userEmail'>> = {}
  ): Promise<void> {
    const organizationId = req.organizationId || req.user?.organizationId || req.params?.orgId;
    if (!organizationId) return;

    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.socket?.remoteAddress ||
      req.ip;

    return this.log({
      organizationId,
      userId: req.user?._id?.toString() || req.user?.id,
      userEmail: req.user?.email || 'system',
      userName: req.user?.name || req.user?.prenom,
      action,
      resource,
      resourceId: opts.resourceId || req.params?.id,
      ipAddress,
      userAgent: req.headers['user-agent'],
      ...opts,
    });
  }

  /**
   * Shorthand to log a modification (create/update/delete) with before/after diff
   */
  static async logModification(
    userId: string | undefined,
    orgId: string | undefined,
    resource: string,
    id: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    newData?: any,
    oldData?: any
  ) {
    if (!orgId) return;
    return this.log({
      organizationId: orgId,
      userId,
      userEmail: 'system',
      action,
      resource,
      resourceId: id,
      changes: oldData || newData ? { before: oldData || {}, after: newData || {} } : undefined,
    });
  }

  private static inferSeverity(action: AuditAction): 'info' | 'warning' | 'critical' {
    if (['DELETE', 'MEMBER_REMOVED', 'PASSWORD_CHANGED', 'PERMISSION_CHANGED', 'LOGIN_FAILED'].includes(action)) {
      return 'critical';
    }
    if (['QUOTA_EXCEEDED', 'LOGOUT', 'EXPORT', 'IMPORT', 'INVOICE_SENT', 'WHATSAPP_SENT'].includes(action)) {
      return 'warning';
    }
    return 'info';
  }
}

export const auditService = AuditService;

