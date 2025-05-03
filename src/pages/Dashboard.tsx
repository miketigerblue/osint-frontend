// src/pages/Dashboard.tsx

import React, { type FC, useState, useMemo } from 'react';
import { useThreats } from '../hooks/useThreats';
import ThreatCard from '../components/ThreatCard';
import FilterPanel from '../components/FilterPanel';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  BarChart,
  Bar
} from 'recharts';

// Import the metrics functions to use in the component
import {
  getSeverityDistribution,
  getTopThreatActors,
  getTopActions,
  getDailyTimeline,
  getUniqueIOCs,
  getRecentCritical,
} from '../lib/metrics';


/**
 * Each option describes a label, a key, and its duration in milliseconds.
 */
const RANGE_OPTIONS = [
  { label: '24 hrs',  key: '24h', ms: 1000 * 60 * 60 * 24 },
  { label: '48 hrs',  key: '48h', ms: 1000 * 60 * 60 * 48 },
  { label: '7 days',  key: '7d', ms: 1000 * 60 * 60 * 24 * 7 },
  { label: '1 month', key: '1m', ms: 1000 * 60 * 60 * 24 * 30 },
  { label: '3 months',key: '3m', ms: 1000 * 60 * 60 * 24 * 90 },
  { label: '6 months',key: '6m', ms: 1000 * 60 * 60 * 24 * 180 },
  { label: '1 year', key: '1y', ms: 1000 * 60 * 60 * 24 * 365 },
  { label: 'All',     key: 'all', ms: 1000 * 60 * 60 * 24 * 365 * 10 }
] as const;
type RangeKey = typeof RANGE_OPTIONS[number]['key'];
type Severity   = 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/**
 * Dashboard page:
 * - Shows a row of date-range buttons
 * - Shows a severity filter (via FilterPanel)
 * - Renders an AreaChart of daily counts
 * - Lists a grid of ThreatCard components
 */
const Dashboard: FC = () => {
  // 1. Fetch + loading/error state
  const { threats, isLoading, isError } = useThreats();

  // 2. UI state: selected date‐range & severity filter
  const [range,  setRange]  = useState<RangeKey>('7d');
  const [filter, setFilter] = useState<Severity>('ALL');

  // 3. Guard out any entries missing a published date
  const validThreats = useMemo(
    () => threats.filter(t => typeof t.published === 'string'),
    [threats]
  );

  // 4. Compute cutoff timestamp for the selected range
  const cutoff = useMemo(() => {
    const opt = RANGE_OPTIONS.find(o => o.key === range)!;
    return Date.now() - opt.ms;
  }, [range]);

  // 5. Apply both date-range & severity filters
  const visibleThreats = useMemo(
    () =>
      validThreats.filter(t => {
        const ts = new Date(t.published!).getTime();
        const inDateRange = ts >= cutoff;
        const inSeverity  = filter === 'ALL' || t.severity_level === filter;
        return inDateRange && inSeverity;
      }),
    [validThreats, cutoff, filter]
  );


const severityDist = useMemo(
  () => getSeverityDistribution(visibleThreats),
  [visibleThreats]
);

const topActors = useMemo(
  () => getTopThreatActors(visibleThreats),
  [visibleThreats]
);

const topActions = useMemo(
  () => getTopActions(visibleThreats),
  [visibleThreats]
);

const dailyTimeline = useMemo(
  () => getDailyTimeline(visibleThreats),
  [visibleThreats]
);

const uniqueIOCs = useMemo(
  () => getUniqueIOCs(visibleThreats),  
  [visibleThreats]
);

const recentCritical = useMemo(
  () => getRecentCritical(visibleThreats),
  [visibleThreats]
);


  // 6. Build trend data for the chart from *visibleThreats*
  const trendData = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {};

    visibleThreats.forEach(t => {
      const [day] = t.published!.split('T');
      counts[day] = counts[day] || {};
      counts[day][t.severity_level] = (counts[day][t.severity_level] || 0) + 1;
    });

    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, sev]) => ({
        day,
        CRITICAL: sev.CRITICAL || 0,
        HIGH:     sev.HIGH     || 0,
        MEDIUM:   sev.MEDIUM   || 0,
        LOW:      sev.LOW      || 0,
      }));
  }, [visibleThreats]);

  // 7. Handle loading / error states early
  if (isLoading) return <p>Loading threats…</p>;
  if (isError)   return <p>Error loading threats.</p>;

  return (
    <div className="p-6 space-y-8">
     

      {/* Date-range buttons */}
      <div className="flex space-x-2">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => setRange(opt.key)}
            className={
              `px-3 py-1 rounded ${
                range === opt.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Trend chart – guarded so Recharts never chokes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">
          Threats by Severity ({range})
        </h2>

        {trendData.length > 0 ? (
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
        ) : (
          <p className="text-centre text-gray-500">
            No data in this window.
          </p>
        )}
      </div>

      {/* Severity filter panel */}
      <FilterPanel onFilter={setFilter} />

      {/* ──────────── Metrics Row ──────────── */}
      <div className="grid gap-6 mb-8
                      grid-cols-1
                      md:grid-cols-2
                      lg:grid-cols-3">
        {/* 1. Severity Distribution */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityDist}>
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#E53E3E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Top Threat Actors */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Top Threat Actors</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topActors}>
              <XAxis dataKey="actor" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="occurrences" fill="#3182CE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 3. Top Recommended Actions */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Top Recommended Actions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr><th className="text-left">Action</th><th>Count</th></tr>
            </thead>
            <tbody>
              {topActions.map(a => (
                <tr key={a.action}>
                  <td className="py-1">{a.action}</td>
                  <td className="py-1 text-center">{a.occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Daily Analysis Timeline */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Daily Analysis Timeline</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyTimeline}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#38A169" fill="#C6F6D5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 5. Unique IOCs */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Unique IOCs</h2>
          <ul className="text-xs space-y-1">
            {uniqueIOCs.map(ioc => (
              <li key={ioc} className="truncate">{ioc}</li>
            ))}
          </ul>
        </div>

        {/* 6. Recent Critical Alerts */}
        <div className="bg-white p-4 rounded shadow overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Recent Critical Alerts</h2>
          <table className="w-full text-sm">
            <thead>
              <tr><th>Date</th><th>GUID</th><th>Confidence</th></tr>
            </thead>
            <tbody>
              {recentCritical.map(r => (
                <tr key={r.guid}>
                  <td className="py-1">
                  {r.analysed_at ? r.analysed_at.split('T')[0] : '—'}
                  </td>
                  <td className="py-1 truncate">{r.guid}</td>
                  <td className="py-1 text-center">{Math.round(r.confidence * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* ─────────────────────────────────────── */}

      {/* Grid of threat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleThreats.map(threat => (
          <ThreatCard key={threat.guid} threat={threat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
