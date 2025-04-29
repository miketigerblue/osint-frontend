// src/components/FilterPanel.jsx
import { useState } from 'react';
export default function FilterPanel({ onFilter }) {
  const [severity, setSeverity] = useState('ALL');
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center space-x-4">
      <select className="border p-2 rounded" value={severity} onChange={e => { setSeverity(e.target.value); onFilter(e.target.value); }}>
        <option value="ALL">All severities</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
  );
}