import useSWR from 'swr';
import api from '@/lib/api';

export interface AuditLogEntry {
    _id: string;
    action: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    targetId?: string;
    targetType?: string;
    details?: any;
    ipAddress?: string;
    timestamp: string;
}

interface AuditLogResponse {
    data: AuditLogEntry[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useAuditLogs(page: number = 1, limit: number = 50) {
    const { data, error, isLoading, mutate } = useSWR<AuditLogResponse>(
        `/api/audit-logs?page=${page}&limit=${limit}`,
        fetcher,
        {
            refreshInterval: 10000 // Auto-refresh every 10 seconds for live monitoring feel
        }
    );

    return {
        logs: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        isError: error,
        mutate
    };
}
