import { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useThreats, Threat } from '../hooks/useThreats';

const ThreatDetail: FC = () => {
  const { guid } = useParams<{ guid: string }>();
  const { threats, isLoading, isError } = useThreats();

  if (isLoading) return <p>Loading threat…</p>;
  if (isError) return <p>Unable to load threats.</p>;

  const threat = threats.find(t => t.guid === decodeURIComponent(guid ?? ''));
  if (!threat) return <p>Threat not found.</p>;

  return (
    <section className="prose mx-auto py-8">
      <h1>{threat.title}</h1>
      <p><em>Published:</em> {new Date(threat.published).toLocaleString()}</p>
      <p>{threat.content}</p>

      <h2>Impact & Context</h2>
      <p>{threat.summary_impact}</p>
      <p><strong>Historical Context:</strong> {threat.historical_context}</p>

      <h2>Indicators of Compromise</h2>
      <ul>
        {threat.key_iocs.map(ioc => <li key={ioc}>{ioc}</li>)}
      </ul>

      <h2>Recommended Actions</h2>
      <ul>
        {threat.recommended_actions.map((act, idx) => <li key={idx}>{act}</li>)}
      </ul>

      <h2>Mitigation Strategies</h2>
      <ul>
        {threat.mitigation_strategies.map((m, i) => <li key={i}>{m}</li>)}
      </ul>

      <h2>Other Details</h2>
      <p><strong>Confidence:</strong> {threat.confidence_pct}%</p>
      <p><strong>Relevance:</strong> {threat.relevance}</p>
      <p><strong>Additional Notes:</strong> {threat.additional_notes}</p>
      <p><strong>Potential Threat Actors:</strong> {threat.potential_threat_actors.join(', ')}</p>
      {threat.cve_references.length > 0 && (
        <p><strong>CVE References:</strong> {threat.cve_references.join(', ')}</p>
      )}

      <p className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline">← Back to list</Link>
      </p>
    </section>
  );
};

export default ThreatDetail;