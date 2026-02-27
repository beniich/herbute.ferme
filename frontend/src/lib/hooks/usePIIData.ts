import { useQuery } from '@tanstack/react-query';

interface PIIMetrics {
  totalSources: number;
  piiFindings: number;
  criticalRisks: number;
  gdprViolations: number;
}

interface PIIAsset {
  id: string;
  name: string;
  type: string;
  piiTypes: string[];
  sensitivityScore: number;
  status: 'open' | 'pending' | 'mitigated';
}

const mockMetrics: PIIMetrics = {
  totalSources: 1284,
  piiFindings: 42500,
  criticalRisks: 892,
  gdprViolations: 12,
};

const mockAssets: PIIAsset[] = [
  {
    id: '1',
    name: 'production_users_main',
    type: 'Postgres',
    piiTypes: ['Email', 'SSN', '+2 more'],
    sensitivityScore: 92,
    status: 'open',
  },
  {
    id: '2',
    name: 'customer-kyc-documents',
    type: 'S3 Bucket',
    piiTypes: ['Passport ID', 'DOB'],
    sensitivityScore: 74,
    status: 'pending',
  },
];

async function fetchPIIMetrics(): Promise<PIIMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockMetrics;
}

async function fetchPIIAssets(): Promise<PIIAsset[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAssets;
}

export function usePIIData() {
  const metricsQuery = useQuery({
    queryKey: ['pii-metrics'],
    queryFn: fetchPIIMetrics,
    refetchInterval: 60000,
  });

  const assetsQuery = useQuery({
    queryKey: ['pii-assets'],
    queryFn: fetchPIIAssets,
    refetchInterval: 60000,
  });

  return {
    metrics: metricsQuery.data,
    assets: assetsQuery.data,
    loading: metricsQuery.isLoading || assetsQuery.isLoading,
    error: metricsQuery.error || assetsQuery.error,
  };
}
