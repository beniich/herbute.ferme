import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export interface AuditLogEntry {
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldData?: any;
  newData?: any;
  metadata?: any;
}

/**
 * Service to sync audit logs and modifications to Supabase.
 */
export class AuditService {
  /**
   * Logs an action to Supabase.
   * This allows real-time sync of modifications for external reporting/LLM usage.
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      if (!supabaseAdmin) {
        logger.debug('[AuditSync] ⏭️ Supabase sync skipped (not configured)');
        return;
      }

      const { error } = await supabaseAdmin
        .from('audit_logs')
        .insert([{
          user_id: entry.userId,
          org_id: entry.organizationId,
          action: entry.action,
          resource_type: entry.resource,
          resource_id: entry.resourceId,
          old_data: entry.oldData,
          new_data: entry.newData,
          metadata: entry.metadata || {},
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        logger.error(`[AuditSync] ❌ Failed to sync to Supabase: ${error.message}`);
      } else {
        logger.debug(`[AuditSync] ✅ Synced ${entry.action} on ${entry.resource} to Supabase`);
      }
    } catch (err: any) {
      logger.error(`[AuditSync] ⛈️ Unexpected error during Supabase sync: ${err.message}`);
    }
  }

  /**
   * Helper for standard modification logging.
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
    return this.log({
      userId,
      organizationId: orgId,
      action,
      resource,
      resourceId: id,
      newData,
      oldData
    });
  }
}

export const auditService = AuditService;
