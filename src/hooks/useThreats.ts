import useSWR from 'swr';

export interface Threat {
  archive_id: string;
  analysis_id: string;
  archive_guid: string;
  analysis_guid: string;
  title: string;
  link: string;
  published: string;
  content: string | null;
  severity_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence_pct: number;
  historical_context: string;
  summary_impact: string;
  relevance: string;
  additional_notes: string;
  source_name: string;
  source_url: string;
  analysis_feed_title: string;
  analysis_feed_description: string;
  analysis_feed_language: string;
  analysis_feed_icon: string | null;
  analysis_feed_updated: string | null;
  analysed_at: string;
  enriched_at: string;
  analysis_inserted_at: string;
  recommended_actions: string[];
  key_iocs: string[];
  affected_systems_sectors: string[];
  mitigation_strategies: string[];
  potential_threat_actors: string[];
  cve_references: string[];
  ttps: string[];
  attack_vectors: string[];
  tools_used: string[];
  malware_families: string[];
  target_geographies: string[];
  exploit_references: string[];
}

// Use local API only in dev, otherwise default to production path
const getApiUrl = () =>
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/enriched_archive_analysis_mv'
    : '/api/analysis';

const fetcher = async (url: string): Promise<Threat[]> => {
  const res = await fetch(url, { credentials: 'omit' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/**
 * Custom React hook for fetching threat analyses.
 * - Uses local backend in dev, Next.js API route in prod
 */
export function useThreats() {
  const feedUrl = getApiUrl();

  const { data, error, isValidating } = useSWR<Threat[]>(
    feedUrl,
    fetcher,
    {
      refreshInterval: 300_000,   // 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 60_000
    }
  );

  return {
    threats:      data ?? [],
    isLoading:    !data && !error,
    isError:      Boolean(error),
    isRefreshing: isValidating
  };
}
