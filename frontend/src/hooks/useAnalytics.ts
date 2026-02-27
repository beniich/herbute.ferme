import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';

export interface SatisfactionData {
    averageRating: number;
    satisfactionRate: number;
    totalResponses: number;
    averageResponseTime: string;
    trends: {
        rating: string;
        satisfactionRate: string;
        responseTime: string;
    };
    distribution: { name: string; value: number; color: string }[];
    categoryRatings: { category: string; rating: number; max: number }[];
    recentFeedback: {
        id: string;
        rating: number;
        comment: string;
        category: string;
        date: string;
    }[];
}

export interface PerformanceData {
    averageResolutionTime: string;
    firstResponseTime: string;
    completionRate: number;
    onTimeRate: number;
    byCategory: { category: string; completionRate: number; avgTime: string }[];
}

export interface HeatmapData {
    lat: number;
    lng: number;
    intensity: number;
    complaint: {
        id: string;
        category: string;
        priority: string;
        status: string;
    };
}

export function useSatisfactionStats(range: string = '30d') {
    return useQuery({
        queryKey: ['analytics', 'satisfaction', range],
        queryFn: () => apiClient.get<SatisfactionData>(`/api/analytics/satisfaction?range=${range}`),
    });
}

export function usePerformanceStats() {
    return useQuery({
        queryKey: ['analytics', 'performance'],
        queryFn: () => apiClient.get<PerformanceData>('/api/analytics/performance'),
    });
}

export function useHeatmapData(filters?: any) {
    return useQuery({
        queryKey: ['analytics', 'heatmap', filters],
        queryFn: () => {
            const params = filters ? new URLSearchParams(filters).toString() : '';
            return apiClient.get<HeatmapData[]>(`/api/analytics/heatmap${params ? '?' + params : ''}`);
        },
    });
}
