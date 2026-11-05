import { BookOpen } from 'lucide-react';
import { SOURCES, formatCite } from '../data/index.js';
import { DIMENSIONS, MECHANISMS, PERIODS, STATUSES } from '../data/vocab.js';

const short = (s) => s.split(' — ')[0].split(' (')[0];

const LEDGER = {
  source: 'Checked against the cited source.',
  partial: 'Some citations checked against their sources (✓); others not yet.',
  reference: 'Checked against reference works; not yet against the cited sources themselves.',
  unchecked: 'Citations assigned; not yet checked against the texts themselves.',
};

// Where a claim stands: what it is about, how it crossed languages, when it
// held, what it cites — and how far those citations have actually been checked.
export default function Provenance({ claim }) {
  const meta = [
    DIMENSIONS[claim.dimension] && short(DIMENSIONS[claim.dimension]),
    claim.mechanism && short(MECHANISMS[claim.mechanism]),
    claim.period && PERIODS[claim.period].split(' (')[0],
  ].filter(Boolean);

  return (
    <div className="space-y-2.5">
      {claim.status && claim.status !== 'CANON' && (
        <p className="rounded-xl bg-amber-300/[0.07] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-amber-100/90">
          <span className="mr-1.5 text-[10px] uppercase tracking-[0.16em] text-amber-200/70">
            {claim.status === 'OPEN_QUESTION' ? 'Open question' : 'Working'}
          </span>
          {claim.statusNote || STATUSES[claim.status]}
        </p>
      )}
      {meta.length > 0 && (
        <p className="flex flex-wrap gap-1.5" aria-label="About this claim">
          {meta.map((m) => (
            <span key={m} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-slate-400">
              {m}
            </span>
          ))}
        </p>
      )}
      <div className="flex gap-2 text-[12px] leading-relaxed text-slate-400">
        <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/80" aria-hidden="true" />
        <div>
          <ul className="space-y-0.5">
            {claim.cites.map((c) => {
              const s = SOURCES[c.source];
              const text = formatCite(c);
              return (
                <li key={c.source + (c.locator || '')}>
                  {s?.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className="underline decoration-white/15 underline-offset-2 hover:text-starlight">
                      {text}
                    </a>
                  ) : (
                    text
                  )}
                  {s?.author && <span className="text-slate-500"> — {s.author}{s.date ? `, ${s.date}` : ''}</span>}
                  {c.checked && (
                    <a
                      href={c.checked.edition}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-1 text-emerald-300/80 hover:text-emerald-200"
                      title={`Checked ${c.checked.on}${c.checked.note ? ': ' + c.checked.note : ''}`}
                      aria-label={`checked against an edition on ${c.checked.on}`}
                    >
                      ✓
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          {claim.verification && claim.cites.some((c) => c.source !== 'rushi') && (
            <p className="mt-1 text-[11px] text-slate-500">{LEDGER[claim.verification]}</p>
          )}
        </div>
      </div>
      {claim.gaps?.length > 0 && (
        <p className="text-[11.5px] leading-relaxed text-slate-500">
          <span className="text-slate-400">Evidence wanted: </span>
          {claim.gaps.join(' ')}
        </p>
      )}
    </div>
  );
}

const READING_LABELS = [
  ['cmn', 'Mandarin'],
  ['yue', 'Cantonese'],
  ['ja', 'Japanese (on)'],
  ['ko', 'Korean'],
  ['vi', 'Vietnamese'],
  ['fanqie', 'Middle Chinese'],
];

export function Readings({ anchor }) {
  const r = anchor.readings;
  if (!r) return null;
  const extra = r.extra || {};
  return (
    <div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-[12.5px]">
        {READING_LABELS.map(([k, label]) =>
          r[k] || extra[k] ? (
            <div key={k} className="contents">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-serif text-[14.5px] text-slate-200">
                {r[k]}
                {extra[k] && (
                  <span className="text-slate-400" title={r.extraNote}>
                    {r[k] ? ', ' : ''}
                    {extra[k]}
                    <sup className="ml-0.5 text-[9px] text-amber-200/70">†</sup>
                  </span>
                )}
              </dd>
            </div>
          ) : null
        )}
        {anchor.simplified && (
          <div className="contents">
            <dt className="text-slate-500">Simplified</dt>
            <dd className="font-cjk text-[15px] text-slate-200">{anchor.simplified}</dd>
          </div>
        )}
        {anchor.structure?.parts?.length > 0 && (
          <div className="contents">
            <dt className="text-slate-500">Components</dt>
            <dd className="font-cjk text-[15px] tracking-[0.2em] text-slate-200" title={`Ideographic description: ${anchor.structure.ids}`}>
              {anchor.structure.parts.join(' ')}
            </dd>
          </div>
        )}
      </dl>
      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
        {SOURCES[r.source]?.title}
        {r.version ? ` ${r.version}` : ''}
        {r.verification === 'source' ? ' — copied from the database' : ''}
        {r.fanqie ? '; Middle Chinese as Guangyun fanqie spellings' : ''}
        {anchor.structure ? '. Structure from Mojidata IDS' : ''}.
        {r.extra ? ` † ${r.extraNote}` : ''}
      </p>
    </div>
  );
}
