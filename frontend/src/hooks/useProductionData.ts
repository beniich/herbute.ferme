import useSWR from 'swr';
import { useOrgStore } from '@/store/orgStore';

const fetcher = (url: string, orgId: string) =>
  fetch(url, { headers: { 'x-organization-id': orgId } }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function useCrops() {
  const { activeOrganization } = useOrgStore();
  const orgId = activeOrganization?._id ?? '';
  const { data, error, isLoading, mutate } = useSWR(
    orgId ? [`${process.env.NEXT_PUBLIC_API_URL}/api/crops`, orgId] : null,
    ([url, id]: [string, string]) => fetcher(url, id),
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );
  return {
    crops:   data?.data ?? data ?? [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

export function useAnimals() {
  const { activeOrganization } = useOrgStore();
  const orgId = activeOrganization?._id ?? '';
  const { data, error, isLoading, mutate } = useSWR(
    orgId ? [`${process.env.NEXT_PUBLIC_API_URL}/api/animals`, orgId] : null,
    ([url, id]: [string, string]) => fetcher(url, id),
    { revalidateOnFocus: false, dedupingInterval: 30_000 }
  );
  return {
    animals: data?.data ?? data ?? [],
    loading: isLoading,
    error,
    refresh: mutate,
  };
}
