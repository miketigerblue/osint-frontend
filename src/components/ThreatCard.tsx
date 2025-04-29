import React, { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Threat } from '../hooks/useThreats';

interface ThreatCardProps {
  threat: Threat;
}

const ThreatCard: FC<ThreatCardProps> = ({ threat }) => {
  return (
    <article className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <header className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">
          <a href={threat.link} target="_blank" rel="noopener noreferrer">
            {threat.title}
          </a>
        </h2>
        <span className="text-sm text-gray-500">
          {new Date(threat.published).toLocaleDateString()}
        </span>
      </header>

      <p className="text-gray-700 truncate-3-lines">{threat.summary_impact}</p>

      <div className="flex flex-wrap gap-2">
        {threat.key_iocs.map(ioc => (
          <span
            key={ioc}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
          >
            {ioc}
          </span>
        ))}
      </div>

      <footer className="flex justify-between items-center">
        <small className="text-sm">
          Severity: <strong>{threat.severity_level}</strong>, Confidence: <strong>{threat.confidence_pct}%</strong>
        </small>
            <Link to={`/threat/${encodeURIComponent(threat.guid)}`}>
     Read more
   </Link>
      </footer>
    </article>
  );
};

export default ThreatCard;