// src/hooks/useThreats.ts
import useSWR from 'swr';

export interface Threat {
  guid: string;
  title: string;
  link: string;
  published: string;
  content: string;
  severity_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_pct: number;
  summary_impact: string;
  historical_context: string;
  relevance: string;
  additional_notes: string;
  source_name: string;
  source_url: string;
  analysed_at: string;
  recommended_actions: string[];
  key_iocs: string[];
  affected_systems_sectors: string[];
  mitigation_strategies: string[];
  potential_threat_actors: string[];
  cve_references: string[];
}

/** Generic JSON fetcher for SWR */
const fetcher = async (url: string): Promise<Threat[]> => {
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Hook returning the threats array.
 * - Hits `/api/analysis.json` in both dev & prod
 * - Refreshes every 15 minutes
 * - Re-fetches on window focus
 * - Dedupes identical calls for 60 s
 */
export function useThreats() {
  const feedUrl = '/api/analysis.json';

  const { data, error, isValidating } = useSWR<Threat[]>(
    feedUrl,
    fetcher,
    {
      refreshInterval: 900_000,   // 15 minutes
      revalidateOnFocus: true,    // refetch when tab regains focus
      dedupingInterval: 60_000    // no duplicate calls within 60 s
    }
  );

  return {
    threats:      data ?? [],
    isLoading:    !data && !error,
    isError:      Boolean(error),
    isRefreshing: isValidating
  };
}
