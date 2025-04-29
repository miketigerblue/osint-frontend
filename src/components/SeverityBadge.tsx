// src/components/SeverityBadge.jsx
const colors = { CRITICAL: 'bg-red-600', HIGH: 'bg-orange-500', MEDIUM: 'bg-yellow-400', LOW: 'bg-green-400' };
export default function SeverityBadge({ level }) {
  return (
    <span className={`${colors[level]} text-white px-2 py-1 rounded-lg text-sm`}>
      {level}
    </span>
  );
}
