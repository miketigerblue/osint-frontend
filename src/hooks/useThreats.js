// src/hooks/useThreats.js
import useSWR from 'swr';
const fetcher = (url) => fetch(url).then(res => res.json());
export function useThreats() {
  const { data, error } = useSWR('/mv_threat_frontend', fetcher, { refreshInterval: 900000 });
  return { threats: data || [], isLoading: !error && !data, isError: error };
}
