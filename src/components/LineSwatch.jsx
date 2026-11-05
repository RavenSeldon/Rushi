import { EDGE_TYPES } from '../data/index.js';

// The same pattern the galaxy draws — solid, dashed or dotted — so the key
// never relies on colour alone.
export default function LineSwatch({ type, width = 22, dim = false, className = '' }) {
  const t = EDGE_TYPES[type];
  const dash = { dashed: '5 3', dotted: '1.4 3', dashdot: '6 2 1.5 2' }[t.pattern];
  return (
    <svg
      width={width}
      height="8"
      viewBox={`0 0 ${width} 8`}
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      style={{ opacity: dim ? 0.35 : 1 }}
    >
      <line
        x1="1"
        y1="4"
        x2={width - 1}
        y2="4"
        stroke={t.color}
        strokeWidth={t.pattern === 'dotted' ? 2.2 : 1.6}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
    </svg>
  );
}
