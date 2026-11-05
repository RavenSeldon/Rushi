import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { ANCHORS, BRIDGES, EDGE_TYPES, EDGE_TYPE_ORDER } from '../data/index.js';
import { TIERS, TIER_ORDER } from '../scene/Galaxy.js';
import LineSwatch from './LineSwatch.jsx';

const COUNTS = (() => {
  const c = Object.fromEntries(EDGE_TYPE_ORDER.map((k) => [k, 0]));
  ANCHORS.forEach((a) => a.satellites.forEach((s) => c[s.type]++));
  BRIDGES.forEach((b) => c[b.type]++);
  return c;
})();

export default function Display({ filters, onToggle, reducedMotion, onMotion, tier, autoTier, onTier, telemetry, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.('[data-display-toggle]')) onClose();
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [onClose]);

  const seg = (active) =>
    `rounded-md px-2 py-1 text-[11.5px] transition ${active ? 'bg-gold/15 text-gold ring-1 ring-gold/40' : 'text-slate-400 hover:text-starlight'}`;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Display and line key"
      className="glass fade-in absolute right-0 top-11 w-[min(320px,calc(100vw-2rem))] space-y-5 rounded-2xl p-4 text-[13px]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Lines</span>
        <button type="button" onClick={onClose} className="text-slate-500 hover:text-starlight" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <ul className="-mt-2 space-y-0.5">
        {EDGE_TYPE_ORDER.map((id) => {
          const t = EDGE_TYPES[id];
          const on = filters[id];
          return (
            <li key={id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => onToggle(id)}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
              >
                <LineSwatch type={id} dim={!on} />
                <span className="flex-1">
                  <span className={on ? 'text-slate-100' : 'text-slate-500'}>{t.label}</span>
                  <span className="ml-1.5 text-[11px] text-slate-500">{COUNTS[id]}</span>
                </span>
                <span
                  className={`relative h-4 w-7 rounded-full transition ${on ? 'bg-gold/70' : 'bg-white/10'}`}
                  aria-hidden="true"
                >
                  <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-void transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="space-y-3 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Motion</span>
          <div className="flex gap-1">
            <button type="button" className={seg(!reducedMotion)} onClick={() => onMotion(false)} aria-pressed={!reducedMotion}>
              Drift
            </button>
            <button type="button" className={seg(reducedMotion)} onClick={() => onMotion(true)} aria-pressed={reducedMotion}>
              Still
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-400">Quality</span>
          <div className="flex gap-1">
            <button type="button" className={seg(autoTier)} onClick={() => onTier(tier, true)} aria-pressed={autoTier}>
              Auto
            </button>
            {TIER_ORDER.map((k) => (
              <button key={k} type="button" className={seg(!autoTier && tier === k)} onClick={() => onTier(k, false)} aria-pressed={!autoTier && tier === k}>
                {TIERS[k].label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[11.5px] leading-relaxed text-slate-500">
          {reducedMotion
            ? 'Still mode draws a frame only when something changes.'
            : telemetry
              ? `${telemetry.ms.toFixed(1)} ms per frame now (${TIERS[tier].label}). Target: 16.7 ms or less.`
              : `Measuring… (${TIERS[tier].label})`}
          {autoTier && !reducedMotion ? ' Auto steps quality down if frames run long.' : ''}
        </p>
      </div>
    </div>
  );
}
