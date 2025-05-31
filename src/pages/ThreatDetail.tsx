import React, { type FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThreats, type Threat } from '../hooks/useThreats';
import SeverityBadge from '../components/SeverityBadge';
import DOMPurify from 'dompurify';

// Update Params type for analysis_id
type Params = { analysis_id: string };

// Reusable component for rendering list sections
const ListSection: FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items || items.length === 0) return null;
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
  // Get analysis_id from route params
  const { analysis_id } = useParams<Params>();
  const { threats, isLoading, isError } = useThreats();

  if (isLoading) {
    return <p className="p-6 text-gray-600">Loading threat…</p>;
  }
  if (isError) {
    return <p className="p-6 text-red-600">Unable to load threats.</p>;
  }

  const decoded = decodeURIComponent(analysis_id || '');
  // Find by analysis_id instead of guid
  const threat = threats.find((t: Threat) => t.analysis_id === decoded);

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

  // Format published date in British English
  const published = new Date(threat.published);
  const publishedStr = published.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(threat.content || '');
  const sanitizedSummaryImpact = DOMPurify.sanitize(threat.summary_impact || '');
  const sanitizedHistoricalContext = DOMPurify.sanitize(threat.historical_context || '');

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      {/* Back link */}
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to list
      </Link>

      {/* Title & Meta Information */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{threat.title}</h1>
        <div className="flex items-center space-x-4">
          <SeverityBadge level={threat.severity_level} />
          <span className="text-sm text-gray-600">
            Published: {publishedStr}
          </span>
        </div>
      </header>


      {/* Impact & Context */}
      {threat.summary_impact && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Impact &amp; Context
          </h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizedSummaryImpact }} />
        </section>
      )}

      {/* Historical Context */}
      {threat.historical_context && (
        <section>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Historical Context
          </h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: sanitizedHistoricalContext }} />
        </section>
      )}

      {/* Lists: IOCs, Recommendations, Mitigations, CVEs, TTPs, etc. */}
      <ListSection title="Indicators of Compromise" items={threat.key_iocs} />
      <ListSection title="Recommended Actions" items={threat.recommended_actions} />
      <ListSection title="Mitigation Strategies" items={threat.mitigation_strategies} />
      <ListSection title="CVE References" items={threat.cve_references} />
      <ListSection title="TTPs" items={threat.ttps} />
      <ListSection title="Attack Vectors" items={threat.attack_vectors} />
      <ListSection title="Tools Used" items={threat.tools_used} />
      <ListSection title="Malware Families" items={threat.malware_families} />
      <ListSection title="Target Geographies" items={threat.target_geographies} />
      <ListSection title="Exploit References" items={threat.exploit_references} />
      <ListSection title="Affected Systems/Sectors" items={threat.affected_systems_sectors} />

      {/* Additional Details */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Additional Details
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
          <div className="flex">
            <dt className="w-40 font-medium">Analysed At:</dt>
            <dd>{new Date(threat.analysed_at).toLocaleString('en-GB')}</dd>
          </div>
        </dl>
      </section>

      {/* Feed Information */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Feed Information</h2>
        <dl className="space-y-2 text-gray-700">
          <div className="flex">
            <dt className="w-40 font-medium">Feed Title:</dt>
            <dd>{threat.analysis_feed_title}</dd>
          </div>
          <div className="flex">
            <dt className="w-40 font-medium">Feed Description:</dt>
            <dd>{threat.analysis_feed_description}</dd>
          </div>
          <div className="flex">
            <dt className="w-40 font-medium">Feed Language:</dt>
            <dd>{threat.analysis_feed_language}</dd>
          </div>
          {threat.analysis_feed_icon && (
            <div className="flex">
              <dt className="w-40 font-medium">Feed Icon:</dt>
              <dd><img src={threat.analysis_feed_icon} alt="Feed Icon" className="h-6 w-6" /></dd>
            </div>
          )}
          {threat.analysis_feed_updated && (
            <div className="flex">
              <dt className="w-40 font-medium">Feed Updated:</dt>
              <dd>{new Date(threat.analysis_feed_updated).toLocaleString('en-GB')}</dd>
            </div>
          )}
        </dl>
      </section>
      {/* Provenance & Extracted Metadata */}
<section className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
  <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3A9 9 0 11 3 12a9 9 0 0118 0z" />
    </svg>
    Provenance &amp; Extracted Metadata
  </h2>
  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
    <div>
      <dt className="font-medium">Archive ID:</dt>
      <dd className="break-all text-gray-600">{threat.archive_id}</dd>
    </div>
    <div>
      <dt className="font-medium">Analysis ID:</dt>
      <dd className="break-all text-gray-600">{threat.analysis_id}</dd>
    </div>
    <div>
      <dt className="font-medium">Archive GUID:</dt>
      <dd className="break-all text-gray-600">{threat.archive_guid}</dd>
    </div>
    <div>
      <dt className="font-medium">Analysis GUID:</dt>
      <dd className="break-all text-gray-600">{threat.analysis_guid}</dd>
    </div>
    <div>
      <dt className="font-medium">Source Name:</dt>
      <dd>{threat.source_name}</dd>
    </div>
    <div>
      <dt className="font-medium">Source URL:</dt>
      <dd>
        <a
          href={threat.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {threat.source_url}
        </a>
      </dd>
    </div>
    <div>
      <dt className="font-medium">Original Article:</dt>
      <dd>
        <a
          href={threat.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          {threat.link}
        </a>
      </dd>
    </div>
    <div>
      <dt className="font-medium">Enriched At:</dt>
      <dd>{new Date(threat.enriched_at).toLocaleString('en-GB')}</dd>
    </div>
    <div>
      <dt className="font-medium">Analysis Inserted At:</dt>
      <dd>{new Date(threat.analysis_inserted_at).toLocaleString('en-GB')}</dd>
    </div>
  </dl>
</section>


    </div>
  );
};

export default ThreatDetail;
