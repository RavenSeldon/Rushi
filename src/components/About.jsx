import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { EDGE_TYPES, EDGE_TYPE_ORDER } from '../data/index.js';
import LineSwatch from './LineSwatch.jsx';

export function LineKey({ compact = false }) {
  return (
    <ul className={compact ? 'grid grid-cols-2 gap-x-4 gap-y-1.5' : 'space-y-3'}>
      {EDGE_TYPE_ORDER.map((id) => {
        const t = EDGE_TYPES[id];
        return (
          <li key={id} className="flex items-start gap-2.5">
            <LineSwatch type={id} width={compact ? 18 : 24} className="mt-1.5" />
            <span>
              <span className="block text-[12.5px]" style={{ color: t.textColor }}>
                {t.label}
              </span>
              {!compact && <span className="block text-[12.5px] leading-relaxed text-slate-400">{t.description}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function Intro({ onBegin, onDismiss, touch }) {
  return (
    <section
      aria-labelledby="intro-h"
      className="glass fade-in fixed inset-x-4 bottom-24 z-40 mx-auto max-w-[460px] rounded-3xl p-6 sm:bottom-28 sm:p-7"
    >
      <h1 id="intro-h" className="flex items-baseline gap-3">
        <span className="font-cjk text-[34px] leading-none text-amber-100">如實</span>
        <span className="font-serif text-[26px] text-starlight">Rushi</span>
      </h1>
      <p className="mt-1 text-[12.5px] text-slate-400">
        rúshí — “as it really is”, the Chinese rendering of Sanskrit <i>yathābhūta</i>
      </p>
      <p className="mt-4 font-serif text-[17px] leading-relaxed text-slate-200">
        Chinese characters, set as stars along strange attractors, about eight to a system. Every line between them is a
        claim about how two words relate — and every claim says what kind of claim it is.
      </p>
      <div className="mt-4">
        <LineKey compact />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBegin}
          className="rounded-full bg-gold/90 px-5 py-2.5 text-[14px] font-medium text-void transition hover:bg-gold"
        >
          Begin with <span className="font-cjk">道</span>
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-4 py-2.5 text-[14px] text-slate-300 transition hover:bg-white/5 hover:text-starlight"
        >
          Explore freely
        </button>
      </div>
      <p className="mt-4 text-[11.5px] text-slate-500">
        {touch ? 'Tap a star · drag to orbit · pinch to zoom' : 'Select a star · drag to orbit · scroll to zoom · keys 1–8 · [ ] systems · Esc steps back'}
      </p>
    </section>
  );
}

export default function About({ onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    return () => prev?.focus?.();
  }, []);

  const trapFocus = (event) => {
    if (event.key !== 'Tab') return;
    const nodes = [...event.currentTarget.querySelectorAll('button, a[href], select, [tabindex="0"]')];
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-void/60 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onKeyDown={trapFocus}
        aria-labelledby="about-h"
        onClick={(e) => e.stopPropagation()}
        className="glass fade-in scroll-quiet max-h-[88dvh] w-full max-w-[640px] overflow-y-auto rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="about-h" className="flex items-baseline gap-3">
            <span className="font-cjk text-[30px] leading-none text-amber-100">如實</span>
            <span className="font-serif text-[24px] text-starlight">About Rushi</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-starlight"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="prose-rushi mt-5 space-y-8 font-serif text-[16.5px] leading-relaxed text-slate-200">
          <section>
            <p>
              Rushi is a map of relationships between Chinese characters and the words other languages have used for
              them, gathered into thirteen solar systems of eight: the Pillars (道 無 為 愛 不 二 量 司), the Ground,
              Words of Power, Heaven and Change, the Constant Virtues, Knowing, the Five Phases, Light, Seeking,
              Becoming, Hungry Ghosts, the Future and the Fermi Paradox. It is built to be explored the way one explores
              a night sky: the cosmos first, then a single system, a single constellation, a single line.
            </p>
            <p>
              Its name, 如實 rúshí, renders Sanskrit <i>yathābhūta</i>: seeing things as they really are. The design
              follows from that. A beautiful line is not evidence, so every line states its kind.
            </p>
            <p>
              Rushi lives at Maitrism. Maitrism is the practice of Maitrādvaita, the name Rushi gives to the reading on
              the line between 愛 and 不二: that loving-kindness may be how non-duality is lived, when self and other are
              not two. Loving-kindness, <i>maitrī</i>, is 慈 in Buddhist Chinese, and Maitreya, the Buddha to come, takes
              his name from it; in Chinese he is also 慈氏.
            </p>
          </section>

          <section aria-labelledby="key-h">
            <h3 id="key-h" className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-slate-500">
              How to read the lines
            </h3>
            <div className="font-sans">
              <LineKey />
            </div>
            <p className="mt-4 text-[15px] text-slate-300">
              Read the text labels alongside the colours and patterns. Blue also includes graphic structure; violet
              includes reported traditional correspondences. Dotted crimson lines are this project’s own proposals.
              A relation type does not certify its evidence: each card has a separate verification ledger. Where an origin or a reading is debated, the card says so
              in a note rather than smoothing it over.
            </p>
          </section>

          <section aria-labelledby="lor-h">
            <h3 id="lor-h" className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Why the stars sit where they do
            </h3>
            <p>
              The galaxy’s shape is not drawn by hand. It is the <b className="font-medium text-starlight">Lorenz attractor</b>,
              published in 1963 by Edward Lorenz, who reduced a model of convection in a heated layer of fluid to three
              variables and showed that its motion never repeats — and that tiny differences in the starting state grow
              until prediction fails.
            </p>
            <p>The equations answer one question: given the state now, how is it changing this instant?</p>
            <pre className="my-3 overflow-x-auto rounded-xl bg-white/[0.04] px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-200">
{`dx/dt = σ (y − x)
dy/dt = x (ρ − z) − y
dz/dt = x y − β z        σ = 10, ρ = 28, β = 8/3`}
            </pre>
            <p className="text-[15px] text-slate-300">
              Roughly: <i>x</i> is how fast the fluid rolls, <i>y</i> the temperature difference between rising and falling
              currents, <i>z</i> how far the vertical temperature profile is bent. σ, ρ and β are fixed properties of the fluid
              and its container. At the point (1, 1, 1), for instance, the rates are (0, 26, −1.67): <i>x</i> holds, <i>y</i> is
              climbing fast, <i>z</i> is easing down. Rushi takes tiny steps of 0.004 in time, each refined four ways
              (Runge–Kutta), and plots where the state goes — that path is the luminous ribbon.
            </p>
            <p className="text-[15px] text-slate-300">
              What this shows: a fully deterministic rule whose path never repeats and never settles. It circles two
              “eyes” — equilibrium points it can never reach — and crosses between them unpredictably. 不 and 二 are placed
              in those two eyes: two foci, one unbroken trajectory. 無 sits on the origin, the third equilibrium, which the
              flow leaves behind.
            </p>
            <p className="text-[15px] text-slate-300">
              What it does not show: that meaning follows the mathematics. The placements are a deliberate design choice —
              an image to think with — not a claim that the characters obey the equations.
            </p>
          </section>

          <section aria-labelledby="sys-h">
            <h3 id="sys-h" className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-slate-500">
              More than one sky
            </h3>
            <p>
              Each system is drawn from its own attractor, so no two share a shape. The Pillars are the Lorenz attractor. The
              Ground is the <b className="font-medium text-starlight">Aizawa attractor</b>: a sphere-like shell the path winds
              around, with a hollow tube down its axis that the path falls through and climbs back out of.
            </p>
            <pre className="my-3 overflow-x-auto rounded-xl bg-white/[0.04] px-4 py-3 font-mono text-[13px] leading-relaxed text-slate-200">
{`dx/dt = (z − b) x − d y
dy/dt = d x + (z − b) y
dz/dt = c + a z − z³/3 − (x² + y²)(1 + e z) + f z x³
a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1`}
            </pre>
            <p className="text-[15px] text-slate-300">
              The same question, a different rule. The <i>d</i> terms turn the state around the vertical axis; (<i>z</i> − <i>b</i>)
              pushes it outward above height <i>b</i> and draws it inward below; the long third line lifts and lowers it. At the
              point (1, 0, 1), the rates are (0.3, 3.5, 0.07): spinning quickly about the axis, drifting slowly outward,
              almost level. On the axis itself (<i>x</i> = <i>y</i> = 0) the rotation vanishes, and there are fixed points
              where the third line is zero: one above the shell (<i>z</i> ≈ 1.94), where 一 sits, and two below, the higher of
              which (<i>z</i> ≈ −0.84) holds 空.
            </p>
            <p className="text-[15px] text-slate-300">
              Words of Power is the <b className="font-medium text-starlight">Thomas attractor</b>: dx/dt = sin y − b x,
              dy/dt = sin z − b y, dz/dt = sin x − b z, with b = 0.208186. Rename x → y → z and the equations do not
              change, which turns the attractor 120° about the line x = y = z. On that line the flow stands still wherever
              sin x = b x: at the origin, where 如 sits, and at x = y = z ≈ ±2.576; 實 sits at the positive one, the one
              this attractor winds around. So 如實 runs along the axis the whole system turns about.
            </p>
            <p className="text-[15px] text-slate-300">
              Heaven and Change is the <b className="font-medium text-starlight">Halvorsen attractor</b>, also unchanged
              when x → y → z, seen straight down its axis of symmetry: from there it has three lobes, 120° apart, and 天, 地
              and 人, the Three Powers of the Yijing, take one each. The origin is a fixed point near the centre, and 氣 sits
              there.
            </p>
            <p className="text-[15px] text-slate-300">
              The Constant Virtues is the <b className="font-medium text-starlight">Rössler attractor</b>, tilted so its
              two parts show: a flat spiral disk, and one fold where the path lifts away and falls back. 仁 sits on the
              fixed point at the centre of the disk; 德 at the top of the fold, because the Shuowen glosses 德 as 升, “to
              rise”.
            </p>
            <p className="text-[15px] text-slate-300">
              Moving between systems passes through the cosmos, where every system appears at once and faint threads mark the
              bridges between them. Only the system being visited is drawn in full; the others are light clouds, a sample of
              their particles, so the sky stays fast. As with the Pillars, where a star sits is a design choice, not a claim.
            </p>
          </section>

          <section aria-labelledby="src-h">
            <h3 id="src-h" className="mb-3 font-sans text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Sources and method
            </h3>
            <p className="text-[15px] text-slate-300">
              Old Chinese reconstructions follow Baxter &amp; Sagart, <i>Old Chinese: A New Reconstruction</i> (2014). Each
              card names its own textual sources. Glyph origins are given with their competing readings where scholars
              disagree. Corrections are welcome — the data lives in plain files, one card per entry.
            </p>
          </section>

          <section aria-labelledby="ctl-h" className="font-sans">
            <h3 id="ctl-h" className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Moving around
            </h3>
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[13.5px] text-slate-300">
              <dt className="text-slate-500">Select</dt>
              <dd>a star, a label, or a glyph in the dock</dd>
              <dt className="text-slate-500">Orbit</dt>
              <dd>drag anywhere on the sky</dd>
              <dt className="text-slate-500">Zoom</dt>
              <dd>scroll, or pinch</dd>
              <dt className="text-slate-500">Keys</dt>
              <dd>
                1–8 jump to a star in this system · ← → previous / next star · [ ] previous / next system · Esc steps back,
                out to the cosmos · ? opens this page
              </dd>
              <dt className="text-slate-500">Share</dt>
              <dd>the address bar always points to what you are reading</dd>
            </dl>
          </section>

          <footer className="border-t border-white/5 pt-5 font-sans text-[12.5px] text-slate-500">
            <p>
              A project by{' '}
              <a className="text-slate-300 underline decoration-white/20 underline-offset-4 hover:text-gold" href="https://benamuwo.com">
                Ben Amuwo
              </a>{' '}
              ·{' '}
              <a className="text-slate-300 underline decoration-white/20 underline-offset-4 hover:text-gold" href="https://github.com/RavenSeldon/Rushi">
                Source
              </a>
            </p>
            <p className="mt-2 font-cjk tracking-[0.3em] text-slate-600">如實 · 道 · 愛 · 不二</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
