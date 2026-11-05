import { ANCHOR_MAP, ANCHOR_REALM, BRIDGES, EDGE_TYPES, REALMS, anchorsOf, isCrossRealm } from '../data/index.js';

const Unsettled = ({ status }) =>
  status && status !== 'CANON' ? (
    <sup className="ml-0.5 text-[9px] text-amber-200/80" title={status === 'OPEN_QUESTION' ? 'Open question' : 'Working'}>
      ?
    </sup>
  ) : null;

// Every label is a real <button>: keyboard-reachable, screen-reader named.
// The galaxy positions them; React only decides which exist and how they look.
//
// Restraint at every level (never more than about twelve labels):
//   Cosmos      one name per system
//   System      that system's stars + the bridges within it
//   Star        its satellites
//   Connection  the claim's two ends
export default function Labels({ refFor, route, edge, filters, onAnchor, onEdge, onRealm, compact }) {
  const { anchorId, level, realmId } = route;
  const focused = anchorId ? ANCHOR_MAP[anchorId] : null;
  const bridgeEnds = edge?.kind === 'bridge' ? [edge.from, edge.to] : null;

  if (level === 'cosmos') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-label="Map of the cosmos">
        {REALMS.map((r) => (
          <div key={r.id} ref={refFor(`r:${r.id}`)} className="lbl lbl-anchor">
            <button type="button" onClick={() => onRealm(r.id)} aria-label={`System ${r.numeral}: ${r.name}`} className="group">
              <span className="glow-text font-serif text-[20px] leading-none text-amber-100 group-hover:text-gold">{r.numeral}</span>
              <span className="glow-text mt-1 whitespace-nowrap text-[11px] tracking-[0.18em] uppercase text-slate-300 group-hover:text-starlight">
                {r.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    );
  }

  // The stars on screen: the visited system's, plus the far end of a bridge
  // between systems when that bridge is the claim being read.
  const shown = anchorsOf(realmId);
  if (bridgeEnds) for (const id of bridgeEnds) if (!shown.some((a) => a.id === id)) shown.push(ANCHOR_MAP[id]);

  const visibleBridges = BRIDGES.filter((b) => {
    if (!filters[b.type]) return false;
    if (edge?.kind === 'bridge') return b.id === edge.id;
    if (anchorId) return false; // the sheet lists them; the sky stays quiet
    // Bridges to other systems are drawn in the cosmos view, not here.
    return !isCrossRealm(b) && ANCHOR_REALM[b.from] === realmId;
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-label="Galaxy map">
      {shown.map((a) => {
        const selected = anchorId === a.id;
        const lit = !anchorId || (bridgeEnds ? bridgeEnds.includes(a.id) : selected);
        return (
          <div key={a.id} ref={refFor(`a:${a.id}`)} className="lbl lbl-anchor">
            <button
              type="button"
              onClick={() => onAnchor(a.id)}
              aria-label={`${a.glyph} ${a.pinyin} — ${a.gloss}`}
              aria-current={selected ? 'true' : undefined}
              className={`group ${lit ? 'opacity-100' : 'opacity-30 hover:opacity-80'}`}
            >
              <span className="star-hit" />
              <span
                className={`glow-text font-cjk leading-none transition-colors ${
                  selected ? 'text-[28px] text-amber-100' : 'text-[22px] text-starlight group-hover:text-amber-100'
                }`}
              >
                {a.glyph}
              </span>
              <span
                className={`glow-text mt-1 text-[10px] tracking-[0.18em] uppercase ${
                  selected ? 'text-gold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {a.pinyin.split(' · ')[0]}
              </span>
            </button>
          </div>
        );
      })}

      {focused &&
        edge?.kind !== 'bridge' &&
        focused.satellites
          .filter((s) => filters[s.type])
          .map((s) => {
            const t = EDGE_TYPES[s.type];
            const selected = edge?.id === s.id;
            const sibling = edge && !selected;
            return (
              <div key={s.id} ref={refFor(`s:${s.id}`)} className={`lbl lbl-sat${compact ? ' is-compact' : ''}`} data-side="r">
                <button
                  type="button"
                  onClick={() => onEdge(selected ? null : s.id)}
                  aria-pressed={selected}
                  aria-label={`${s.glyph}: ${s.title} (${t.label}${s.status === 'OPEN_QUESTION' ? ', open question' : ''})`}
                  className={`fade-in rounded-lg px-2 py-1 transition ${
                    selected
                      ? 'bg-void/85 ring-1 ring-gold/60'
                      : sibling
                        ? 'opacity-35 hover:opacity-90'
                        : 'hover:bg-void/70'
                  }`}
                >
                  <span className="glow-text block font-serif text-[15px] leading-tight text-starlight whitespace-nowrap">
                    {s.glyph}
                    <Unsettled status={s.status} />
                  </span>
                  {!compact && (
                    <span className="glow-text block max-w-[190px] text-[11px] leading-snug" style={{ color: t.textColor }}>
                      {s.title}
                    </span>
                  )}
                </button>
              </div>
            );
          })}

      {visibleBridges.map((b) => {
        const t = EDGE_TYPES[b.type];
        const selected = edge?.id === b.id;
        return (
          <div key={b.id} ref={refFor(`b:${b.id}`)} className="lbl lbl-bridge">
            <button
              type="button"
              onClick={() => onEdge(b.id, b.from)}
              aria-label={`${b.title} (${t.label}${b.status === 'OPEN_QUESTION' ? ', open question' : ''})`}
              className={`glow-text fade-in whitespace-nowrap rounded-full px-2 py-0.5 font-cjk text-[13px] transition ${
                selected ? 'text-starlight' : 'opacity-75 hover:opacity-100'
              }`}
              style={{ color: selected ? undefined : t.textColor }}
            >
              {b.label}
              <Unsettled status={b.status} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
