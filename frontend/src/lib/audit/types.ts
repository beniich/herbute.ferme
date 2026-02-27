export interface LogEntry {
    _id: string;
    action: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
    targetId?: string;
    targetType?: string;
    details?: any;
    ipAddress?: string;
    timestamp: string;
    severity?: "critical" | "normal"; // Computed on frontend or added to backend later
}
