import mongoose, { Schema, Document } from 'mongoose';

export type AuditAction =
  | 'CREATE' | 'UPDATE' | 'DELETE'
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED'
  | 'EXPORT' | 'IMPORT'
  | 'AI_GENERATION' | 'AI_ALERT'
  | 'INVOICE_GENERATED' | 'INVOICE_SENT'
  | 'QUOTA_EXCEEDED'
  | 'MEMBER_INVITED' | 'MEMBER_REMOVED'
  | 'PASSWORD_CHANGED' | 'PERMISSION_CHANGED'
  | 'WHATSAPP_SENT' | 'PDF_GENERATED'
  | 'EXECUTE_POWERSHELL';

export interface IAuditLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userEmail: string;
  userName?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  description?: string;  // Human-readable description
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata?: Record<string, any>; // Any extra context
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
}

const AuditLogSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userEmail: { type: String, required: true },
    userName:  { type: String },
    action: {
      type: String,
      required: true,
      index: true,
      enum: [
        'CREATE', 'UPDATE', 'DELETE',
        'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
        'EXPORT', 'IMPORT',
        'AI_GENERATION', 'AI_ALERT',
        'INVOICE_GENERATED', 'INVOICE_SENT',
        'QUOTA_EXCEEDED',
        'MEMBER_INVITED', 'MEMBER_REMOVED',
        'PASSWORD_CHANGED', 'PERMISSION_CHANGED',
        'WHATSAPP_SENT', 'PDF_GENERATED',
        'EXECUTE_POWERSHELL',
      ],
    },
    resource:   { type: String, required: true, index: true },
    resourceId: { type: String, default: null },
    description: { type: String },
    changes: {
      before: { type: Schema.Types.Mixed },
      after:  { type: Schema.Types.Mixed },
    },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent:  { type: String },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient org-scoped queries
AuditLogSchema.index({ organizationId: 1, timestamp: -1 });
AuditLogSchema.index({ organizationId: 1, action: 1 });
AuditLogSchema.index({ organizationId: 1, severity: 1 });

// TTL: auto-archive after 1 year
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLog;


