import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { ANCHOR_MAP, ANCHOR_REALM, BRIDGES, EDGE_TYPES, REALMS, REALM_MAP, anchorsOf } from '../data/index.js';
import { chainStrength, findChain } from '../lib/claims.js';
import LineSwatch from './LineSwatch.jsx';

const TIER_NOTE = {
  documented: 'Every link in it is documented: a translation, a usage, a graph or a traditional correspondence.',
  comparative: 'At least one link is an analogy across languages, so the chain is a comparison, not a history.',
  proposed: 'At least one link is Rushi’s own proposition, so the chain as a whole is a proposal.',
};

function AnchorSelect({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="block min-w-0 flex-1">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-void/80 px-2 py-1.5 font-cjk text-[15px] text-starlight outline-none focus-visible:ring-1 focus-visible:ring-gold/60"
      >
        {REALMS.map((r) => (
          <optgroup key={r.id} label={`${r.numeral} · ${r.name}`}>
            {anchorsOf(r.id).map((a) => (
              <option key={a.id} value={a.id}>
                {a.glyph} {a.pinyin}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

/**
 * "How are these connected?" The shortest chain of bridges between two
 * stars, across every system, with its strength by the weakest-link rule.
 */
export default function Pathfinder({ initialFrom, onEdge, onClose }) {
  const ref = useRef(null);
  const [from, setFrom] = useState(() => (ANCHOR_MAP[initialFrom] ? initialFrom : REALMS[0].anchors[0]));
  const [to, setTo] = useState(() => {
    const pick = REALMS.length > 1 ? REALMS[1].anchors[0] : REALMS[0].anchors[1];
    return pick === from ? REALMS[0].anchors[1] : pick;
  });

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.('[data-paths-toggle]')) onClose();
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [onClose]);

  const chain = useMemo(() => findChain(from, to, BRIDGES), [from, to]);
  const strength = chain && chain.length ? chainStrength(chain) : null;

  // Walk the chain in reading order, so each step names where it starts.
  const steps = useMemo(() => {
    if (!chain) return [];
    return chain.reduce((acc, bridge) => {
      const at = acc.length ? acc[acc.length - 1].b : from;
      acc.push({ bridge, a: at, b: bridge.from === at ? bridge.to : bridge.from });
      return acc;
    }, []);
  }, [chain, from]);

  const realmTag = (id) => {
    const r = REALM_MAP[ANCHOR_REALM[id]];
    return r ? r.numeral : '';
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="How are these connected?"
      className="glass fade-in absolute right-0 top-11 w-[min(360px,calc(100vw-2rem))] space-y-4 rounded-2xl p-4 text-[13px]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">How are these connected?</span>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-starlight" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-end gap-2">
        <AnchorSelect id="path-from" label="From" value={from} onChange={setFrom} />
        <button
          type="button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="mb-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-white/5 hover:text-starlight"
          aria-label="Swap"
          title="Swap"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </button>
        <AnchorSelect id="path-to" label="To" value={to} onChange={setTo} />
      </div>

      <div aria-live="polite">
        {from === to ? (
          <p className="text-slate-400">Choose two different stars.</p>
        ) : !chain ? (
          <p className="leading-relaxed text-slate-300">
            No chain of bridges joins {ANCHOR_MAP[from].glyph} and {ANCHOR_MAP[to].glyph} yet. Rushi draws a bridge only
            when a source, a graph or a declared proposition earns it, so an absence here is information too.
          </p>
        ) : (
          <>
            <ol className="space-y-1.5">
              {steps.map(({ bridge, a, b }, i) => {
                const t = EDGE_TYPES[bridge.type];
                const settled = bridge.status === 'CANON';
                return (
                  <li key={bridge.id}>
                    <button
                      type="button"
                      onClick={() => onEdge(bridge.id, a)}
                      className="flex w-full items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.015] px-3 py-2 text-left transition hover:border-white/15"
                    >
                      <span className="mt-0.5 w-4 shrink-0 text-[11px] text-slate-500">{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-cjk text-[15px] text-starlight">
                          {ANCHOR_MAP[a].glyph}
                          <span className="mx-1.5 text-slate-500" aria-label="to">→</span>
                          {ANCHOR_MAP[b].glyph}
                          {realmTag(a) !== realmTag(b) && (
                            <span className="ml-2 font-sans text-[10px] tracking-wide text-slate-500">
                              {realmTag(a)} → {realmTag(b)}
                            </span>
                          )}
                        </span>
                        <span className="block text-[12px] text-slate-300">
                          {bridge.title}
                          {!settled && (
                            <span className="ml-1 text-amber-200/80">({bridge.status === 'OPEN_QUESTION' ? 'open question' : 'working'})</span>
                          )}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px]" style={{ color: t.textColor }}>
                          <LineSwatch type={bridge.type} width={14} />
                          {t.shortLabel}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 rounded-xl bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-300">
              <p>
                <span className="mr-1.5 text-[10px] uppercase tracking-[0.16em] text-slate-500">Strength</span>
                <span className="text-starlight">{strength.label}</span>, by its weakest link. {TIER_NOTE[strength.tier]}
              </p>
              <p className="mt-1 text-slate-400">
                Passes through: {strength.kinds.map((k) => EDGE_TYPES[k].shortLabel).join(' · ')}.
                {strength.includesUnsettled && ' Includes claims not yet accepted (working or open questions).'}
              </p>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-slate-500">
              The shortest chain, not the only one. A chain says the stars are linked step by step; it does not say the
              first means the last.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
