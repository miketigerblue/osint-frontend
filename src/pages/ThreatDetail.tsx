// src/pages/ThreatDetail.tsx

import React, { type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThreats, type Threat } from '../hooks/useThreats';
import SeverityBadge from '../components/SeverityBadge';

type Params = { guid: string };

// A small reusable component for list sections
const ListSection: FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (items.length === 0) return null;
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
  );
};

const ThreatDetail: FC = () => {
  const { guid } = useParams<Params>();
  const { threats, isLoading, isError } = useThreats();

  if (isLoading) {
    return <p className="p-6 text-gray-600">Loading threat…</p>;
  }
  if (isError) {
    return <p className="p-6 text-red-600">Unable to load threats.</p>;
  }

  const decoded = decodeURIComponent(guid || '');
  const threat = threats.find((t: Threat) => t.guid === decoded);

  if (!threat) {
    return (
      <div className="p-6">
        <p className="text-red-600">Threat not found.</p>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
          ← Back to list
        </Link>
      </div>
    );
  }

  // British date/time formatting
  const published = new Date(threat.published);
  const publishedStr = published.toLocaleString('en-GB', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
    hour:   '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      {/* Back link */}
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to list
      </Link>

      {/* Title & Meta */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{threat.title}</h1>
        <div className="flex items-center space-x-4">
          <SeverityBadge level={threat.severity_level} />
          <span className="text-sm text-gray-600">
            Published: {publishedStr}
          </span>
        </div>
      </header>

      {/* Main content */}
      <section className="text-gray-800 whitespace-pre-line">
        {threat.content}
      </section>

      {/* Impact & Context */}
      {threat.summary_impact && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Impact &amp; Context
          </h2>
          <p className="text-gray-700">{threat.summary_impact}</p>
        </section>
      )}

      {/* Historical Context */}
      {threat.historical_context && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Historical Context
          </h2>
          <p className="text-gray-700">{threat.historical_context}</p>
        </section>
      )}

      {/* Lists: IOCs, Recommendations, Mitigations, CVEs */}
      <ListSection title="Indicators of Compromise" items={threat.key_iocs} />
      <ListSection title="Recommended Actions"    items={threat.recommended_actions} />
      <ListSection title="Mitigation Strategies"  items={threat.mitigation_strategies} />
      <ListSection title="CVE References"         items={threat.cve_references} />

      {/* Other details as a definition list */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Other Details
        </h2>
        <dl className="space-y-2 text-gray-700">
          <div className="flex">
            <dt className="w-40 font-medium">Confidence:</dt>
            <dd>{threat.confidence_pct}%</dd>
          </div>
          {threat.relevance && (
            <div className="flex">
              <dt className="w-40 font-medium">Relevance:</dt>
              <dd>{threat.relevance}</dd>
            </div>
          )}
          {threat.additional_notes && (
            <div className="flex">
              <dt className="w-40 font-medium">Additional Notes:</dt>
              <dd>{threat.additional_notes}</dd>
            </div>
          )}
          {threat.potential_threat_actors.length > 0 && (
            <div className="flex">
              <dt className="w-40 font-medium">Threat Actors:</dt>
              <dd>{threat.potential_threat_actors.join(', ')}</dd>
            </div>
          )}
        </dl>
      </section>
    </div>
  );
};

export default ThreatDetail;
