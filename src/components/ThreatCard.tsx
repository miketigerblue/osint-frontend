import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Threat } from '../hooks/useThreats';

interface ThreatCardProps {
  threat: Threat;
}

const ThreatCard: FC<ThreatCardProps> = ({ threat }) => {
  const sanitizedSummary = DOMPurify.sanitize(threat.summary_impact);

  const getSeverityBadgeColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-600';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-400';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

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

      <div
        className="text-gray-700"
        dangerouslySetInnerHTML={{ __html: sanitizedSummary }}
      />

      <div className="flex flex-wrap gap-2">
        {threat.key_iocs.map((ioc) => (
          <span
            key={ioc}
            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
          >
            {ioc}
          </span>
        ))}
      </div>

      <footer className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span
            className={`text-white text-xs px-2 py-1 rounded-full ${getSeverityBadgeColor(
              threat.severity_level
            )}`}
          >
            {threat.severity_level}
          </span>
          <span className="text-sm text-gray-600">
            Confidence: <strong>{threat.confidence_pct}%</strong>
          </span>
        </div>
        <Link
          to={`/threats/${encodeURIComponent(threat.analysis_id)}`}
          className="text-blue-600 hover:underline text-sm"
        >
          Read more
        </Link>
      </footer>
    </article>
  );
};

export default ThreatCard;
