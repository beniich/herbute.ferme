import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

export function useSecurityMetrics() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/admin/security-metrics');
                setMetrics(response);
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch security metrics:', err);
                setError(err.message || 'Failed to fetch security metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    return { metrics, loading, error };
}
