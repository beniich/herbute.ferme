import useSWR from 'swr';
import { animalsApi, cropsApi, financeApi, irrigationApi } from '@/lib/api';

// ─── Types exportés ────────────────────────────────────────────────────────
export interface FinanceStats {
  year:  { revenue: number; expenses: number; profit: number };
  month: { revenue: number; expenses: number; profit: number };
  bySector: Array<{ _id: string; revenue: number; expenses: number }>;
}
export interface AnimalStats { totalAnimals: number; }
export interface CropStats {
  byStatus:   Array<{ _id: string; count: number }>;
  byCategory: Array<{ _id: string; count: number }>;
}
export interface IrrigationStats { totalVolume: number; }
export interface Transaction {
  _id: string; date: string; description: string;
  category: string; sector: string; type: 'recette' | 'depense'; amount: number;
}

// ─── Fetcher parallèle avec Promise.allSettled ─────────────────────────────
const fetchAll = async () => {
  const results = await Promise.allSettled([
    financeApi.getStats(),
    animalsApi.getStats(),
    cropsApi.getStats(),
    irrigationApi.getStats(),
    financeApi.getTransactions({ limit: '8' }),
  ]);
  const get = <T>(r: PromiseSettledResult<any>): T | null =>
    r.status === 'fulfilled' ? r.value?.data ?? null : null;
  return {
    financeStats:       get<FinanceStats>(results[0]),
    animalStats:        get<AnimalStats>(results[1]),
    cropStats:          get<CropStats>(results[2]),
    irrigationStats:    get<IrrigationStats>(results[3]),
    recentTransactions: results[4].status === 'fulfilled'
      ? (results[4].value?.data ?? []) as Transaction[]
      : [] as Transaction[],
  };
};

// ─── Hook principal ────────────────────────────────────────────────────────
export function useDashboardData() {
  const { data, error, isLoading, mutate } = useSWR('dashboard-all', fetchAll, {
    revalidateOnFocus:    false,
    dedupingInterval:     60_000,    // Dédupliquer les requêtes pendant 60s
    focusThrottleInterval:300_000,   // Limiter les refreshs sur focus
    errorRetryCount:      2,
    keepPreviousData:     true,      // Pas de flash vide lors du refresh
  });
  return {
    financeStats:       data?.financeStats       ?? null,
    animalStats:        data?.animalStats         ?? null,
    cropStats:          data?.cropStats           ?? null,
    irrigationStats:    data?.irrigationStats     ?? null,
    recentTransactions: data?.recentTransactions  ?? [],
    loading:  isLoading,
    error,
    refresh: () => mutate(),
  };
}
