import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Feedback, Department, Keyword } from '@/lib/satisfaction-data';

export interface SatisfactionData {
    kpis: {
        title: string;
        value: string | number;
        sub?: string;
        change: string;
        changePositive: boolean;
        iconStars?: number;
    }[];
    feedbacks: Feedback[];
    departments: Department[];
    keywords: Keyword[];
    trend: { month: string; value: number }[];
}

export const useSatisfactionData = () => {
    return useQuery<SatisfactionData>({
        queryKey: ['satisfaction-dashboard'],
        queryFn: async () => {
            const response = await axios.get('/api/feedback/satisfaction');
            return response.data;
        },
        staleTime: 60000, // 1 minute
    });
};
