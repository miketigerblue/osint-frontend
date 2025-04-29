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

const fetcher = (url: string) =>
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then((data: Threat[]) => data);

export function useThreats() {
  const { data, error } = useSWR<Threat[]>('/mv_threat_frontend', fetcher, {
    refreshInterval: 900_000, // 15 minutes
  });

  return {
    threats: data ?? [],
    isLoading: !error && !data,
    isError: Boolean(error),
  };
}