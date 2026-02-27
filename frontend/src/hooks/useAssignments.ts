import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Assignment {
    _id: string;
    status: 'affecté' | 'en cours' | 'terminé';
    assignedAt: string;
    complaintId: {
        _id: string;
        title: string;
        description: string;
        category: string;
        priority: string;
        address: string;
        status: string;
    };
    teamId: {
        _id: string;
        name: string;
        color: string;
    };
}

export function useAssignments(status?: string) {
    return useQuery({
        queryKey: ['assignments', status],
        queryFn: async () => {
            const params = status ? { status } : {};
            return await api.get<Assignment[]>('/assignments', { params });
        },
        // Rafraîchir toutes les minutes pour avoir les nouvelles tâches
        refetchInterval: 60000,
    });
}
