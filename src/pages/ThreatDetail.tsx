// src/pages/ThreatDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { useThreats } from '../hooks/useThreats';
import SeverityBadge from '../components/SeverityBadge';

export default function ThreatDetail() {
  const { guid } = useParams();
  const { threats } = useThreats();
  const threat = threats.find(t => t.guid === decodeURIComponent(guid));
  if (!threat) return <p>Not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <Link to="/" className="text-indigo-600 hover:underline">&larr; Back</Link>
      <h1 className="text-2xl font-bold mt-2">{threat.title}</h1>
      <SeverityBadge level={threat.severity_level} />
      <p className="text-sm text-gray-500 mt-1">Published: {new Date(threat.published).toLocaleString()}</p>
      <div className="mt-4 prose prose-indigo">
        <h2>Summary Impact</h2>
        <p>{threat.summary_impact}</p>
        <h2>Historical Context</h2>
        <p>{threat.historical_context}</p>
        <h2>Recommendations</h2>
        <ul>{threat.recommended_actions.map(a => <li key={a}>{a}</li>)}</ul>
        {threat.cve_references.length > 0 && (
          <> <h2>CVEs</h2> <ul>{threat.cve_references.map(c => <li key={c}>{c}</li>)}</ul> </>
        )}
      </div>
    </div>
  );
}