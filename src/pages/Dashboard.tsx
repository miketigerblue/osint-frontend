// src/pages/Dashboard.tsx
import { useState, useMemo } from 'react';
import { useThreats } from '../hooks/useThreats';
import ThreatCard from '../components/ThreatCard';
import FilterPanel from '../components/FilterPanel';

// Import Recharts components
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from 'recharts';

export default function Dashboard() {
  const { threats, isLoading, isError } = useThreats();
  const [filter, setFilter] = useState<'ALL'|'CRITICAL'|'HIGH'|'MEDIUM'|'LOW'>('ALL');

  // 1) Build trend data once
  const trendData = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};
    threats.forEach(t => {
      const day = t.published.split('T')[0];
      counts[day] = counts[day] || {};
      counts[day][t.severity_level] = (counts[day][t.severity_level] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, sevMap]) => ({
        day,
        CRITICAL: sevMap.CRITICAL || 0,
        HIGH:     sevMap.HIGH     || 0,
        MEDIUM:   sevMap.MEDIUM   || 0,
        LOW:      sevMap.LOW      || 0,
      }));
  }, [threats]);

  // 2) Apply severity filter
  const filtered = useMemo(
    () =>
      threats.filter(t => filter === 'ALL' || t.severity_level === filter),
    [threats, filter]
  );

  if (isLoading) return <p>Loading threats…</p>;
  if (isError)   return <p>Error loading threats.</p>;

  return (
    <div className="space-y-6">
      {/* Trend chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Threats by Severity (Daily)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="CRITICAL" stackId="1" name="Critical" stroke="#c53030" fill="#fed7d7" />
            <Area type="monotone" dataKey="HIGH"     stackId="1" name="High"     stroke="#dd6b20" fill="#fef3c7" />
            <Area type="monotone" dataKey="MEDIUM"   stackId="1" name="Medium"   stroke="#d69e2e" fill="#faf089" />
            <Area type="monotone" dataKey="LOW"      stackId="1" name="Low"      stroke="#38a169" fill="#c6f6d5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Filter & grid */}
      <FilterPanel onFilter={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(threat => (
          <ThreatCard key={threat.guid} threat={threat} />
        ))}
      </div>
    </div>
  );
}
