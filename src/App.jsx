import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info, Orbit, RotateCcw, Route, SlidersHorizontal } from 'lucide-react';
import { ANCHOR_MAP, COMPOUND_MAP, EDGE_MAP, EDGE_TYPES, REALMS, REALM_MAP, anchorsOf } from './data/index.js';
import { Galaxy } from './scene/Galaxy.js';
import { formatHash, parseHash } from './lib/route.js';
import { load, save } from './lib/storage.js';
import Labels from './components/Labels.jsx';
import Sheet from './components/Sheet.jsx';
import About, { Intro } from './components/About.jsx';
import MusicToggle from './components/MusicToggle.jsx';
import Display from './components/Display.jsx';
import Pathfinder from './components/Pathfinder.jsx';

const useMedia = (q) => {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q);
    const on = (e) => setM(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
};

const navigate = (route) => {
  const h = formatHash(route);
  if (window.location.hash !== h) window.location.hash = h;
};

// ◎ Cosmos · ‹ previous system · › next system. The current system's numeral
// sits between the arrows so the visitor always knows where they are.
function TravelButtons({ inCosmos, realm, onCosmos, onCycle, onRealm, compact }) {
  const i = REALMS.findIndex((r) => r.id === realm.id);
  const prev = REALMS[(i + REALMS.length - 1) % REALMS.length];
  const next = REALMS[(i + 1) % REALMS.length];
  const btn = `grid place-items-center rounded-full transition ${compact ? 'h-[22px] w-7' : 'h-11 w-9'}`;
  return (
    <>
      <button
        type="button"
        onClick={onCosmos}
        aria-current={inCosmos ? 'page' : undefined}
        aria-label="The cosmos: every system at once"
        title="Cosmos"
        className={`${compact ? 'flex h-[22px] items-center gap-1 rounded-full px-2' : btn} ${inCosmos ? 'text-gold' : 'text-slate-300 hover:bg-white/5 hover:text-starlight'}`}
      >
        <Orbit className={compact ? 'h-3.5 w-3.5' : 'h-[18px] w-[18px]'} aria-hidden="true" />
        {compact && <span>Cosmos</span>}
      </button>
      <button
        type="button"
        onClick={() => onCycle(-1)}
        aria-label={`Previous system: ${prev.numeral} ${prev.name} ([)`}
        title={`${prev.numeral} · ${prev.name}  [`}
        className={`${btn} text-slate-400 hover:bg-white/5 hover:text-starlight`}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onRealm(realm.id)}
        aria-label={`System ${realm.numeral}: ${realm.name}`}
        title={realm.name}
        className={`rounded-full px-1 font-serif transition ${compact ? 'text-[12px]' : 'text-[14px]'} ${
          inCosmos ? 'text-slate-400 hover:text-starlight' : 'text-amber-100'
        }`}
      >
        {realm.numeral}
        {compact && <span className="ml-1.5 font-sans text-[11px] text-slate-400">{realm.name}</span>}
      </button>
      <button
        type="button"
        onClick={() => onCycle(1)}
        aria-label={`Next system: ${next.numeral} ${next.name} (])`}
        title={`${next.numeral} · ${next.name}  ]`}
        className={`${btn} text-slate-400 hover:bg-white/5 hover:text-starlight`}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [filters, setFilters] = useState(() => Object.fromEntries(Object.keys(EDGE_TYPES).map((k) => [k, true])));
  const systemReduced = useMedia('(prefers-reduced-motion: reduce)');
  const [motionPref, setMotionPref] = useState(() => load('motion', null)); // null = follow system
  const reducedMotion = motionPref === null ? systemReduced : motionPref === 'still';
  const coarse = useMedia('(pointer: coarse)');
  const compact = !useMedia('(min-width: 768px)');
  const narrow = !useMedia('(min-width: 640px)');

  const [tierState, setTierState] = useState(() => {
    const saved = load('tier', null);
    if (saved) return { tier: saved, auto: false };
    const modest = matchMedia('(pointer: coarse)').matches || (window.devicePixelRatio || 1) > 2;
    return { tier: modest ? 'BALANCED' : 'HIGH', auto: true };
  });
  const [telemetry, setTelemetry] = useState(null);
  const [mode, setMode] = useState('OVERVIEW');
  const [webgl, setWebgl] = useState('pending'); // pending | ok | failed | lost
  const [showIntro, setShowIntro] = useState(() => !load('introSeen', false) && !parseHash(window.location.hash).anchorId);
  const [showAbout, setShowAbout] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [moved, setMoved] = useState(false);

  const mountRef = useRef(null);
  const galaxyRef = useRef(null);
  const sheetRef = useRef(null);
  const labelsRef = useRef(new Map());
  const refCache = useRef(new Map());
  const refFor = useCallback((key) => {
    let fn = refCache.current.get(key);
    if (!fn) {
      fn = (el) => (el ? labelsRef.current.set(key, el) : labelsRef.current.delete(key));
      refCache.current.set(key, fn);
    }
    return fn;
  }, []);

  const anchor = route.anchorId ? ANCHOR_MAP[route.anchorId] : null;
  const edge = route.edgeId ? EDGE_MAP[route.edgeId] : null;
  const compound = COMPOUND_MAP[route.compoundId];
  // Compound reading and semantic relations reuse the existing camera without
  // pretending that a compound is a single-character star or drawing a false edge.
  const sceneEdge = compound ? EDGE_MAP[compound.bridge] : edge && ['bridge', 'satellite'].includes(edge.kind) ? edge : null;
  const inCosmos = route.level === 'cosmos';
  // The system the dock and number keys refer to: in the cosmos view, the one
  // last visited.
  const [lastRealm, setLastRealm] = useState(() => route.realmId || REALMS[0].id);
  useEffect(() => {
    if (route.realmId) setLastRealm(route.realmId);
  }, [route.realmId]);
  const realm = REALM_MAP[route.realmId || lastRealm];
  const realmAnchors = useMemo(() => anchorsOf(realm.id), [realm.id]);
  const realmIndex = REALMS.findIndex((r) => r.id === realm.id);

  // ---- routing ------------------------------------------------------------
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const dismissIntro = useCallback(() => {
    setShowIntro(false);
    save('introSeen', true);
  }, []);

  const goAnchor = useCallback(
    (id) => {
      dismissIntro();
      setCollapsed(false);
      navigate({ level: 'star', anchorId: id });
    },
    [dismissIntro]
  );
  const goCompound = useCallback((compoundId) => {
    dismissIntro();
    setCollapsed(false);
    navigate({ compoundId });
  }, [dismissIntro]);
  const goEdge = useCallback(
    (edgeId, fallbackAnchor) => {
      if (!edgeId) return navigate({ level: 'star', anchorId: route.anchorId });
      const e = EDGE_MAP[edgeId];
      if (!e) return;
      const a = ANCHOR_MAP[fallbackAnchor] && (e.from === fallbackAnchor || e.to === fallbackAnchor)
        ? fallbackAnchor
        : route.anchorId && (e.from === route.anchorId || e.to === route.anchorId) ? route.anchorId : e.from;
      dismissIntro();
      setCollapsed(false);
      navigate({ level: 'connection', anchorId: a, edgeId });
    },
    [route.anchorId, dismissIntro]
  );
  const goRealm = useCallback(
    (id) => {
      dismissIntro();
      navigate({ level: 'system', realmId: id });
    },
    [dismissIntro]
  );
  const goOverview = useCallback(() => navigate({ level: 'system', realmId: realm.id }), [realm.id]);
  const goCosmos = useCallback(() => {
    dismissIntro();
    navigate({ level: 'cosmos' });
  }, [dismissIntro]);
  const cycleRealm = useCallback(
    (step) => goRealm(REALMS[(realmIndex + step + REALMS.length) % REALMS.length].id),
    [goRealm, realmIndex]
  );
  // Connection → Star → System → Cosmos; in the cosmos, recentre.
  const stepBack = useCallback(() => {
    if (route.compoundId) navigate({ level: 'star', anchorId: route.anchorId });
    else if (route.edgeId) navigate({ level: 'star', anchorId: route.anchorId });
    else if (route.anchorId) navigate({ level: 'system', realmId: route.realmId });
    else if (!inCosmos && REALMS.length > 1) navigate({ level: 'cosmos' });
    else galaxyRef.current?.recenter();
  }, [route, inCosmos]);

  // ---- the galaxy -----------------------------------------------------------
  useEffect(() => {
    let g;
    try {
      const r0 = parseHash(window.location.hash);
      g = new Galaxy(mountRef.current, {
        labels: labelsRef.current,
        view: { level: r0.level, realmId: r0.realmId, anchorId: r0.anchorId, edge: r0.compoundId ? EDGE_MAP[COMPOUND_MAP[r0.compoundId].bridge] : r0.edgeId && ['bridge', 'satellite'].includes(EDGE_MAP[r0.edgeId]?.kind) ? EDGE_MAP[r0.edgeId] : null },
        reducedMotion,
        tier: tierState.tier,
        autoTier: tierState.auto,
        onMode: (m) => {
          setMode(m);
          if (m === 'FREE_ORBIT') setMoved(true);
        },
        onTier: (tier, auto) => setTierState({ tier, auto }),
        onTelemetry: setTelemetry,
        onReady: () => setWebgl('ok'),
        onContextLost: () => setWebgl('lost'),
      });
      galaxyRef.current = g;
    } catch (err) {
      console.warn('Rushi: 3D view unavailable', err);
      setWebgl('failed');
    }
    return () => {
      g?.dispose();
      galaxyRef.current = null;
    };
    // Created once; later changes are applied through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (webgl === 'pending') return;
    const boot = document.getElementById('boot');
    if (boot) {
      boot.classList.add('gone');
      setTimeout(() => boot.remove(), 700);
    }
  }, [webgl]);

  useEffect(() => {
    galaxyRef.current?.setView({ level: route.level, realmId: route.realmId, anchorId: route.anchorId, edge: sceneEdge });
    if (route.anchorId || route.level === 'cosmos') setMoved(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.level, route.realmId, route.anchorId, route.edgeId, route.compoundId]);
  useEffect(() => galaxyRef.current?.setFilters(filters), [filters]);
  useEffect(() => galaxyRef.current?.setReducedMotion(reducedMotion), [reducedMotion]);

  // The reading sheet covers part of the sky; tell the camera how much, so the
  // constellation is framed in what remains visible.
  useEffect(() => {
    const g = galaxyRef.current;
    if (!g) return;
    const TOP = 64; // header
    const DOCK = 112; // dock + hint
    if (!anchor) return g.setInsets({ right: 0, bottom: DOCK, top: TOP });
    const el = sheetRef.current;
    if (!el) return;
    const apply = () =>
      g.setInsets(compact ? { right: 0, bottom: el.offsetHeight, top: TOP } : { right: el.offsetWidth, bottom: DOCK, top: TOP });
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [anchor, compound, compact, collapsed, webgl]);

  // ---- keyboard -------------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target?.isContentEditable) return;
      if (e.key === 'Escape') {
        if (showAbout) return setShowAbout(false);
        if (showDisplay) return setShowDisplay(false);
        if (showPaths) return setShowPaths(false);
        if (showIntro) return dismissIntro();
        return stepBack();
      }
      if (showAbout) return;
      if (e.key >= '1' && e.key <= String(Math.min(9, realmAnchors.length))) {
        const a = realmAnchors[Number(e.key) - 1];
        return route.anchorId === a.id && !route.edgeId ? goOverview() : goAnchor(a.id);
      }
      if (e.key === '?') return setShowAbout(true);
      if ((e.key === '[' || e.key === ']') && REALMS.length > 1) return cycleRealm(e.key === ']' ? 1 : -1);
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && route.anchorId) {
        const inScroll = e.target?.closest?.('aside');
        if (inScroll && e.target !== document.body) return;
        const i = realmAnchors.findIndex((a) => a.id === route.anchorId);
        const n = realmAnchors.length;
        goAnchor(realmAnchors[(i + (e.key === 'ArrowRight' ? 1 : n - 1)) % n].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, realmAnchors, showAbout, showDisplay, showPaths, showIntro, stepBack, goAnchor, goOverview, cycleRealm, dismissIntro]);

  // ---- display preferences -----------------------------------------------
  const onMotion = (still) => {
    const v = still ? 'still' : 'drift';
    setMotionPref(v);
    save('motion', v);
  };
  const onTier = (tier, auto) => {
    save('tier', auto ? null : tier);
    setTierState({ tier, auto });
    galaxyRef.current?.setTier(tier, auto);
  };
  const toggleFilter = (id) => setFilters((f) => ({ ...f, [id]: !f[id] }));

  const docTitle = useMemo(() => {
    if (compound) return `${compound.glyph} · Compounds · 如實 Rushi`;
    if (edge && anchor) return `${edge.title} · ${anchor.glyph} · 如實 Rushi`;
    if (anchor) return `${anchor.glyph} ${anchor.pinyin} · 如實 Rushi`;
    if (inCosmos) return '如實 Rushi — The Cosmos';
    if (realm.id !== REALMS[0].id) return `${realm.numeral} · ${realm.name} · 如實 Rushi`;
    return '如實 Rushi — Eight Characters as a Navigable Cosmos';
  }, [anchor, compound, edge, inCosmos, realm]);
  useEffect(() => {
    document.title = docTitle;
  }, [docTitle]);

  useEffect(() => {
    if (route.anchorId) document.getElementById('main-reading')?.focus({ preventScroll: true });
  }, [route.anchorId, route.edgeId, route.compoundId]);

  const sheetOpen = !!anchor;
  const dockShifted = sheetOpen && !compact;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void text-starlight select-none">
      <a
        href="#main-reading"
        onClick={(e) => { e.preventDefault(); document.getElementById('main-reading')?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2"
      >
        Skip to reading
      </a>

      <div ref={mountRef} className="absolute inset-0" />

      {webgl !== 'failed' && webgl !== 'lost' && (
        <Labels
          refFor={refFor}
          route={route}
          edge={sceneEdge}
          filters={filters}
          onAnchor={goAnchor}
          onEdge={goEdge}
          onRealm={goRealm}
          compact={narrow}
        />
      )}

      {(webgl === 'failed' || webgl === 'lost') && (
        <div className="absolute inset-0 grid place-items-center px-6">
          <div className="max-w-sm text-center">
            <p className="font-serif text-lg text-slate-200">
              {webgl === 'lost' ? 'The 3D view was interrupted by the graphics driver.' : 'This device could not start the 3D view.'}
            </p>
            <p className="mt-2 text-sm text-slate-400">Every reading is still here — choose a character below.</p>
            {webgl === 'lost' && (
              <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
                Reload the galaxy
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---- header ---- */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-5">
        <nav aria-label="Breadcrumb" className="pointer-events-auto flex min-w-0 items-center gap-2 text-[13px]">
          <button
            type="button"
            onClick={REALMS.length > 1 ? goCosmos : goOverview}
            aria-current={inCosmos ? 'page' : undefined}
            className="flex shrink-0 items-baseline gap-2 rounded-lg px-1 py-1 transition hover:text-gold"
            aria-label={REALMS.length > 1 ? 'Rushi — the whole cosmos' : 'Rushi — return to the whole galaxy'}
          >
            <span className="font-cjk text-[19px] text-amber-100">如實</span>
            <span className={`font-serif text-[17px] ${anchor ? 'hidden sm:inline text-slate-400' : inCosmos ? 'text-starlight' : 'hidden sm:inline text-slate-400'}`}>Rushi</span>
          </button>
          {!inCosmos && (
            <>
              <span className="text-slate-600" aria-hidden="true">/</span>
              <button
                type="button"
                onClick={goOverview}
                aria-current={!anchor ? 'page' : undefined}
                aria-label={`System ${realm.numeral}: ${realm.name}`}
                className={`flex shrink-0 items-baseline gap-1.5 rounded-lg px-1 py-1 ${anchor ? 'text-slate-400 hover:text-starlight' : 'text-amber-100'}`}
              >
                <span className="font-serif text-[15px]">{realm.numeral}</span>
                <span className={`text-[12px] ${anchor ? 'hidden lg:inline' : 'inline'}`}>{realm.name}</span>
              </button>
            </>
          )}
          {anchor && (
            <>
              <span className="text-slate-600" aria-hidden="true">/</span>
              <button
                type="button"
                onClick={() => goAnchor(anchor.id)}
                aria-current={!edge && !compound ? 'page' : undefined}
                className={`flex shrink-0 items-baseline gap-1.5 rounded-lg px-1 py-1 ${edge ? 'text-slate-400 hover:text-starlight' : 'text-amber-100'}`}
              >
                <span className="font-cjk text-[16px]">{anchor.glyph}</span>
                <span className="hidden text-[12px] sm:inline">{anchor.pinyin}</span>
              </button>
            </>
          )}
          {(edge || compound) && (
            <>
              <span className="text-slate-600" aria-hidden="true">/</span>
              <span aria-current="page" className="truncate font-serif text-[15px] text-amber-100">
                {compound ? compound.glyph : edge.kind === 'bridge' ? edge.label : edge.glyph}
              </span>
            </>
          )}
        </nav>

        <div className={`pointer-events-auto relative flex shrink-0 items-center gap-1 transition-[margin] duration-300 ${dockShifted ? 'md:mr-[400px] lg:mr-[440px]' : ''}`}>
          <MusicToggle still={reducedMotion} />
          <button
            type="button"
            data-paths-toggle
            onClick={() => {
              setShowPaths((v) => !v);
              setShowDisplay(false);
            }}
            aria-expanded={showPaths}
            aria-label="How are these connected?"
            title="How are these connected?"
            className="flex h-9 items-center gap-2 rounded-full px-3 text-[13px] text-slate-300 transition hover:bg-white/5 hover:text-starlight"
          >
            <Route className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Paths</span>
          </button>
          <button
            type="button"
            aria-label="Display and line key"
            data-display-toggle
            onClick={() => {
              setShowDisplay((v) => !v);
              setShowPaths(false);
            }}
            aria-expanded={showDisplay}
            className="flex h-9 items-center gap-2 rounded-full px-3 text-[13px] text-slate-300 transition hover:bg-white/5 hover:text-starlight"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Lines</span>
          </button>
          <button
            type="button"
            aria-label="About Rushi"
            onClick={() => setShowAbout(true)}
            className="flex h-9 items-center gap-2 rounded-full px-3 text-[13px] text-slate-300 transition hover:bg-white/5 hover:text-starlight"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">About</span>
          </button>
          {showPaths && <Pathfinder initialFrom={route.anchorId || realmAnchors[0]?.id} onEdge={(id, from) => { goEdge(id, from); setShowPaths(false); }} onCompound={(id) => { goCompound(id); setShowPaths(false); }} onClose={() => setShowPaths(false)} />}
          {showDisplay && (
            <Display
              filters={filters}
              onToggle={toggleFilter}
              reducedMotion={reducedMotion}
              onMotion={onMotion}
              tier={tierState.tier}
              autoTier={tierState.auto}
              onTier={onTier}
              telemetry={telemetry}
              onClose={() => setShowDisplay(false)}
            />
          )}
        </div>
      </header>

      {/* ---- reading sheet ---- */}
      <div id="main-reading" tabIndex={-1} className="outline-none">
        {anchor && (
          <Sheet
            ref={sheetRef}
            anchor={anchor}
            compound={compound}
            onCompound={goCompound}
            realm={realm}
            edge={edge}
            filters={filters}
            onAnchor={goAnchor}
            onEdge={goEdge}
            onBack={stepBack}
            onClose={goOverview}
            compact={compact}
            collapsed={compact && collapsed}
            onToggleCollapsed={() => setCollapsed((c) => !c)}
          />
        )}
      </div>

      {/* ---- recentre after free orbit ---- */}
      {mode === 'FREE_ORBIT' && !(compact && sheetOpen) && (
        <button
          type="button"
          onClick={() => galaxyRef.current?.recenter()}
          className={`glass fade-in fixed bottom-[110px] sm:bottom-[88px] z-30 flex -translate-x-1/2 items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] text-slate-300 hover:text-starlight ${
            dockShifted ? 'left-[calc(50%-200px)] lg:left-[calc(50%-220px)]' : 'left-1/2'
          }`}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Recentre
        </button>
      )}

      {!anchor && !moved && !showIntro && webgl === 'ok' && (
        <p className="pointer-events-none fixed bottom-[92px] left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap text-[11.5px] tracking-wide text-slate-500 fade-in sm:block">
          {coarse ? 'Tap a star · drag to orbit · pinch to zoom' : 'Select a star · drag to orbit · scroll to zoom'}
        </p>
      )}

      {/* ---- dock: the current system's stars, and travel between systems ---- */}
      {!(compact && sheetOpen) && (
        <nav
          aria-label={`${realm.numeral} · ${realm.name}: its characters, and travel between systems`}
          className={`fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-30 flex -translate-x-1/2 flex-col items-center gap-1 transition-[left] duration-300 ${
            dockShifted ? 'left-[calc(50%-200px)] lg:left-[calc(50%-220px)]' : 'left-1/2'
          }`}
        >
          {/* Narrow screens: travel controls on their own row, inside the space
              the dock already reserves, so the sky is framed exactly as before. */}
          {REALMS.length > 1 && narrow && (
            <div className="glass flex h-[26px] items-center rounded-full px-1 text-[11.5px] text-slate-300">
              <TravelButtons inCosmos={inCosmos} realm={realm} onCosmos={goCosmos} onCycle={cycleRealm} onRealm={goRealm} compact />
            </div>
          )}
          <ul className="glass flex items-center rounded-full px-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
            {REALMS.length > 1 && !narrow && (
              <li className="flex items-center border-r border-white/10 pr-1 mr-1">
                <TravelButtons inCosmos={inCosmos} realm={realm} onCosmos={goCosmos} onCycle={cycleRealm} onRealm={goRealm} />
              </li>
            )}
            {realmAnchors.map((a) => {
              const active = route.anchorId === a.id;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => (active && !edge ? goOverview() : goAnchor(a.id))}
                    aria-current={active ? 'true' : undefined}
                    aria-label={`${a.glyph} ${a.pinyin} (key ${a.key})`}
                    title={`${a.glyph} ${a.pinyin} — ${a.key}`}
                    className={`grid h-10 w-10 place-items-center rounded-full font-cjk text-[19px] transition sm:h-11 sm:w-11 sm:text-[20px] ${
                      active ? 'bg-gold/15 text-amber-100 ring-1 ring-gold/50' : 'text-slate-300 hover:bg-white/5 hover:text-starlight'
                    }`}
                  >
                    {a.glyph}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {showIntro && webgl !== 'pending' && (
        <Intro
          touch={coarse}
          onBegin={() => goAnchor('dao')}
          onDismiss={dismissIntro}
        />
      )}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </div>
  );
}
