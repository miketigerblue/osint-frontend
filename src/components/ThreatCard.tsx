// src/components/ThreatCard.jsx
import { Link } from 'react-router-dom';
import SeverityBadge from './SeverityBadge';
export default function ThreatCard({ threat }) {
  return (
    <Link to={`/threat/${encodeURIComponent(threat.guid)}`} className="block bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <h2 className="font-semibold text-lg">{threat.title}</h2>
        <SeverityBadge level={threat.severity_level} />
      </div>
      <p className="text-sm text-gray-600 mt-2 truncate">{threat.summary_impact}</p>
      <div className="text-xs text-gray-500 mt-2">Published: {new Date(threat.published).toLocaleString()}</div>
    </Link>
  );
}