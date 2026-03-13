'use client';

import { useFetch, UseFetchResult } from '@/hooks/useFetch';

export interface Stats {
  total: number;
  active: number;
  [key: string]: number;
}

export interface DomainItem {
  _id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface DomainData {
  stats: Stats;
  items: DomainItem[];
}

export interface UseDomainDataResult extends UseFetchResult<DomainData> {
  stats: Stats | undefined;
  items: DomainItem[] | undefined;
  refresh: () => Promise<void>;
}

export function useDomainData(
  endpoint: string,
  cacheTime: number = 60_000
): UseDomainDataResult {
  // Use any because backend response formats vary (array or object in .data)
  const { data, isLoading, error, mutate, isValidating } = useFetch<any>(
    endpoint,
    {
      dedupingInterval: cacheTime,
      focusThrottleInterval: cacheTime * 5,
    }
  );

  // Normalize mapping: 
  // 1. If data is an array (already unwrapped by apiClient), use it as items
  // 2. If data has a .data property that is an array, use that
  // 3. Fallback to .items or empty array
  const items = Array.isArray(data) 
    ? data 
    : (Array.isArray((data as any)?.data) ? (data as any).data : ((data as any)?.items || []));
  
  // Stats mapping:
  const stats = !Array.isArray(data) ? ((data as any)?.data || (data as any)?.stats || data) : undefined;

  return {
    data,
    stats,
    items,
    isLoading,
    error,
    mutate,
    isValidating,
    refresh: mutate,
  };
}

// ─── Hooks domaine spécifiques ───────────────────────────
export function useAnimalsData(): UseDomainDataResult {
  return useDomainData('/api/animals', 60_000);  // 1 min
}

export function useCropsData(): UseDomainDataResult {
  return useDomainData('/api/crops', 60_000);    // 1 min
}

export function useFinanceData(): UseDomainDataResult {
  return useDomainData('/api/agro-accounting/stats', 300_000); // 5 min
}

export function useBudgetsData(): UseDomainDataResult {
  return useDomainData('/api/agro-budgets', 300_000); // 5 min
}

export function useIrrigationData(): UseDomainDataResult {
  return useDomainData('/api/irrigation', 120_000); // 2 min
}

export function useInventoryData(): UseDomainDataResult {
  return useDomainData('/api/agro-inventory', 120_000);
}

export function useKnowledgeData(): UseDomainDataResult {
  return useDomainData('/api/agro-knowledge', 300_000);
}
