import { forwardRef } from 'react';
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';
import { ANCHOR_MAP, ANCHOR_REALM, EDGE_TYPES, REALM_MAP, anchorsOf, bridgesOf } from '../data/index.js';
import LineSwatch from './LineSwatch.jsx';
import Provenance, { Readings } from './Provenance.jsx';

function TypeBadge({ type }) {
  const t = EDGE_TYPES[type];
  return (
    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: t.textColor }}>
      <LineSwatch type={type} width={20} />
      {t.label}
    </span>
  );
}

function EdgeCard({ edge }) {
  const t = EDGE_TYPES[edge.type];
  const isInterp = edge.type === 'INTERPRETIVE_SYNTHESIS';
  return (
    <article
      className="fade-in rounded-2xl border p-5 space-y-3.5"
      style={{ borderColor: `${t.color}55`, background: 'rgba(234,242,255,0.025)' }}
      aria-labelledby="edge-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TypeBadge type={edge.type} />
        {edge.lang && <span className="text-[11px] text-slate-400">{edge.lang}</span>}
      </div>
      <div>
        <p className="font-serif text-[22px] leading-snug text-starlight">
          {edge.kind === 'satellite' && (edge.glyph.includes('↔') || edge.glyph.startsWith(edge.fromGlyph)) ? (
            edge.glyph
          ) : (
            <>
              {edge.fromGlyph}
              <span className="mx-2 text-slate-500" aria-label="relates to">↔</span>
              {edge.kind === 'bridge' ? edge.toGlyph : edge.glyph}
            </>
          )}
        </p>
        <h3 id="edge-title" className="mt-1 text-sm font-medium text-slate-200">
          {edge.title}
        </h3>
      </div>
      <p className="font-serif text-[17px] leading-relaxed text-slate-200">{edge.evidence}</p>
      {edge.caveat && (
        <p
          className={`rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${isInterp ? 'text-rose-100/90' : 'text-slate-300'}`}
          style={{ background: isInterp ? 'rgba(165,47,69,0.14)' : 'rgba(234,242,255,0.04)' }}
        >
          <span className="mr-1.5 text-[10px] uppercase tracking-[0.16em] text-slate-400">Note</span>
          {edge.caveat}
        </p>
      )}
      <Provenance claim={edge} />
      <p className="border-t border-white/5 pt-3 text-[12px] leading-relaxed text-slate-500">
        <span className="text-slate-400">What kind of claim?</span> {t.description}
      </p>
    </article>
  );
}

const Sheet = forwardRef(function Sheet(
  { anchor, realm, edge, filters, onAnchor, onEdge, onBack, onClose, compact, collapsed, onToggleCollapsed },
  ref
) {
  // Previous / next stay within the star's own system.
  const siblings = anchorsOf(ANCHOR_REALM[anchor.id]);
  const idx = siblings.findIndex((a) => a.id === anchor.id);
  const prev = siblings[(idx + siblings.length - 1) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];
  const bridges = bridgesOf(anchor.id);
  const sats = anchor.satellites;

  return (
    <aside
      ref={ref}
      aria-label={`Reading: ${anchor.glyph} ${anchor.pinyin}`}
      className={
        compact
          ? `glass fixed inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl border-b-0 pb-[env(safe-area-inset-bottom)] transition-[height] duration-300 ${
              collapsed ? 'h-[92px]' : 'h-[58dvh]'
            }`
          : 'glass fixed right-0 top-0 bottom-0 z-30 flex w-[400px] lg:w-[440px] flex-col border-y-0 border-r-0'
      }
    >
      {compact && (
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="mx-auto mt-2 flex h-6 w-16 items-center justify-center text-slate-500"
          aria-label={collapsed ? 'Expand reading' : 'Collapse reading'}
          aria-expanded={!collapsed}
        >
          <span className="h-1 w-10 rounded-full bg-white/20" />
        </button>
      )}

      <div className={`flex items-center justify-between gap-2 px-5 ${compact ? 'pb-2' : 'px-7 pt-6 pb-4'} border-b border-white/5`}>
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-9 items-center gap-1.5 text-[13px] text-slate-400 transition hover:text-starlight"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {!(compact && collapsed) &&
            (edge ? (
              <span className="whitespace-nowrap">
                Back to <span className="font-cjk text-slate-200">{anchor.glyph}</span>
              </span>
            ) : (
              <span>{realm ? `${realm.numeral} · ${realm.name}` : 'Galaxy'}</span>
            ))}
        </button>

        {compact && collapsed && (
          <button type="button" onClick={onToggleCollapsed} className="flex min-w-0 items-baseline gap-2 truncate">
            <span className="font-cjk text-xl text-amber-100">{anchor.glyph}</span>
            <span className="truncate text-[13px] text-slate-300">{edge ? edge.title : anchor.pinyin}</span>
          </button>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAnchor(prev.id)}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-starlight"
            aria-label={`Previous: ${prev.glyph} ${prev.pinyin}`}
            title={`${prev.glyph} ${prev.pinyin}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onAnchor(next.id)}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-starlight"
            aria-label={`Next: ${next.glyph} ${next.pinyin}`}
            title={`${next.glyph} ${next.pinyin}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {compact ? (
            <button
              type="button"
              onClick={onToggleCollapsed}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:text-starlight"
              aria-label={collapsed ? 'Expand reading' : 'Collapse reading'}
            >
              {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-starlight"
              aria-label="Close and return to the galaxy (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className={`scroll-quiet flex-1 overflow-y-auto overscroll-contain ${compact ? 'px-5 py-5' : 'px-7 py-7'} space-y-7 ${compact && collapsed ? 'hidden' : ''}`}>
        <header key={anchor.id} className="fade-in">
          <div className="flex items-end gap-4">
            <h2 className="font-cjk text-[64px] leading-[0.95] text-amber-50">{anchor.glyph}</h2>
            <div className="pb-1.5">
              <p className="font-serif text-2xl leading-tight text-starlight">{anchor.pinyin}</p>
              <p className="mt-1 text-[12px] text-slate-400">
                <span className="font-serif text-[14px] text-slate-300">{anchor.oc.form}</span>
                {/* Only an unchecked form is marked; checked forms read as before. */}
                {anchor.oc.verification === 'unchecked' && (
                  <sup className="ml-0.5 text-[10px] text-amber-200/80" title={anchor.oc.note || 'Not yet checked against the source'}>
                    †
                  </sup>
                )}
                <span className="ml-1.5" title={anchor.oc.note ? `Old Chinese reconstruction, Baxter & Sagart 2014. ${anchor.oc.note}` : 'Old Chinese reconstruction, Baxter & Sagart 2014'}>
                  Old Chinese · B–S 2014{anchor.oc.verification === 'unchecked' ? ' · unchecked' : ''}
                </span>
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] tracking-wide text-gold">{anchor.gloss}</p>
          <p className="mt-4 font-serif text-[17px] leading-relaxed text-slate-200">{anchor.summary}</p>
          <div className="mt-4 rounded-xl bg-white/[0.03] px-4 py-3">
            <p className="text-[12px] text-slate-300">
              <span className="mr-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">Form</span>
              <span className="font-serif text-[15px]">{anchor.form}</span>
            </p>
            {anchor.formNote && <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-400">{anchor.formNote}</p>}
          </div>
          <details className="group mt-3 rounded-xl bg-white/[0.02] px-4 py-2.5">
            <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.16em] text-slate-500 hover:text-slate-300">
              Readings across the Sinosphere <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
            </summary>
            <div className="mt-2.5">
              <Readings anchor={anchor} />
            </div>
          </details>
        </header>

        {edge && <EdgeCard key={edge.id} edge={edge} />}

        <section aria-labelledby="rel-h">
          <h3 id="rel-h" className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Relationships · {sats.length}
          </h3>
          <ul className="divide-y divide-white/5 border-y border-white/5">
            {sats.map((s) => {
              const t = EDGE_TYPES[s.type];
              const selected = edge?.id === s.id;
              const off = !filters[s.type];
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onEdge(selected ? null : s.id)}
                    aria-pressed={selected}
                    className={`group flex w-full items-start gap-3 px-2 py-3 text-left transition ${
                      selected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.025]'
                    } ${off ? 'opacity-45' : ''}`}
                  >
                    <LineSwatch type={s.type} width={18} className="mt-2" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[16px] leading-snug text-starlight group-hover:text-amber-100">
                        {s.glyph} <span className="text-slate-400">— {s.title}</span>
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-slate-500">
                        <span style={{ color: t.textColor }}>{t.shortLabel}</span> · {s.lang}
                      </span>
                    </span>
                    <ChevronRight
                      className={`mt-1.5 h-4 w-4 shrink-0 transition-transform ${selected ? 'rotate-90 text-gold' : 'text-slate-600 group-hover:text-slate-300'}`}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {bridges.length > 0 && (
          <section aria-labelledby="br-h" className="pb-4">
            <h3 id="br-h" className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Bridges to other stars
            </h3>
            <ul className="space-y-2">
              {bridges.map((b) => {
                const t = EDGE_TYPES[b.type];
                const partner = ANCHOR_MAP[b.from === anchor.id ? b.to : b.from];
                const elsewhere = ANCHOR_REALM[partner.id] !== ANCHOR_REALM[anchor.id] ? REALM_MAP[ANCHOR_REALM[partner.id]] : null;
                const selected = edge?.id === b.id;
                return (
                  <li
                    key={b.id}
                    className={`flex items-center gap-2 rounded-xl border p-3 transition ${
                      selected ? 'border-gold/50 bg-white/[0.05]' : 'border-white/5 bg-white/[0.015] hover:border-white/15'
                    }`}
                  >
                    <button type="button" onClick={() => onEdge(b.id)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                      <LineSwatch type={b.type} width={18} className="mt-2" />
                      <span className="min-w-0">
                        <span className="block font-serif text-[16px] text-starlight">{b.title}</span>
                        <span className="block text-[11.5px]" style={{ color: t.textColor }}>
                          {b.subtitle}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onAnchor(partner.id)}
                      className="shrink-0 rounded-lg bg-white/5 px-2.5 py-1.5 font-cjk text-[14px] text-amber-100 transition hover:bg-white/10"
                      aria-label={`Travel to ${partner.glyph} ${partner.pinyin}${elsewhere ? `, in system ${elsewhere.numeral}: ${elsewhere.name}` : ''}`}
                      title={elsewhere ? `${elsewhere.numeral} · ${elsewhere.name}` : undefined}
                    >
                      → {partner.glyph}
                      {elsewhere && <span className="ml-1 font-serif text-[11px] text-slate-400">{elsewhere.numeral}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
        <p className="pb-6 text-[11.5px] leading-relaxed text-slate-500">
          Placement: {anchor.placement}
        </p>
      </div>
    </aside>
  );
});

export default Sheet;
