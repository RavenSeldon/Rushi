// ============================================================================
// Galaxy — the imperative WebGL scene. React owns the interface; this class
// owns pixels. It is created once and never rebuilt: selection, filters,
// motion and quality are all applied as cheap state changes.
//
// The scene is a cosmos of solar systems (realms), each drawn from its own
// attractor, seen at four levels:
//   COSMOS      every system at once; the visited one in full, others as clouds
//   OVERVIEW    one system and its stars            (the "System" level)
//   FOCUS       one star and its constellation      (the "Star" level)
//   CONNECTION  one claim                           (the "Connection" level)
// Only the visited system is drawn at the System level and below, so a system
// looks exactly as it would if it were alone.
// ============================================================================
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorManagement,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LinearFilter,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Spherical,
  Sprite,
  SpriteMaterial,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { ANCHORS, ANCHOR_REALM, EDGE_MAP, EDGE_TYPES, PALETTE, REALMS } from '../data/index.js';
import { buildLayout } from './layout.js';
import { rng } from './lorenz.js';
import { sampleSystem, toLocal } from './attractors.js';
import { NEBULA_FRAG, NEBULA_VERT, PARTICLE_FRAG, PARTICLE_VERT } from './shaders.js';
import { createHaloTexture, createSpikeTexture } from './textures.js';

// Hex in = hex out: the palette is applied exactly as specified.
ColorManagement.enabled = false;

export const TIERS = {
  HIGH: { label: 'High', maxDpr: 2, keep: 1.0, pointScale: 1.0, nebula: true, frameSkip: 1 },
  BALANCED: { label: 'Balanced', maxDpr: 1.5, keep: 0.62, pointScale: 1.05, nebula: true, frameSkip: 1 },
  ECO: { label: 'Eco', maxDpr: 1, keep: 0.36, pointScale: 1.15, nebula: false, frameSkip: 2 },
};
export const TIER_ORDER = ['HIGH', 'BALANCED', 'ECO'];

const FOV = 45;
const TAN_HALF = Math.tan((FOV * Math.PI) / 360);
const OVERVIEW_DIR = new Vector3(0, 0.16, 1).normalize();
const COSMOS_DIR = new Vector3(0, 0.32, 1).normalize();

// Level of detail. The visited system draws every particle; the others draw
// only the first LIGHT of theirs (particles are generated in random order, so
// any prefix is a fair sample of the shape). One draw call per system either way.
const LIGHT = 1500;
const PILLARS_SEED = 0x2a17; // v1.0's seed: the Pillars must not change

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const approach = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));

function gauss(r) {
  const u = Math.max(r(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

export class Galaxy {
  constructor(container, opts = {}) {
    this.container = container;
    this.opts = opts;
    this.labels = opts.labels || new Map();
    this.layout = buildLayout();

    this.realmIds = REALMS.map((r) => r.id);
    const first = opts.view?.realmId && this.layout.realms[opts.view.realmId] ? opts.view.realmId : this.realmIds[0];
    // view: what the visitor asked for. activeRealm: the system drawn in full.
    this.view = { level: 'system', realmId: first, anchorId: null, edge: null, ...(opts.view || {}) };
    if (this.view.anchorId && ANCHOR_REALM[this.view.anchorId]) this.view.realmId = ANCHOR_REALM[this.view.anchorId];
    if (!this.layout.realms[this.view.realmId]) this.view.realmId = first;
    this.selection = { anchorId: this.view.anchorId || null, edge: this.view.edge || null };
    this.activeRealm = this.view.realmId;
    this.transit = null; // realms shown while flying between systems
    this.filters = Object.fromEntries(Object.keys(EDGE_TYPES).map((k) => [k, true]));
    this.motion = !opts.reducedMotion;
    this.tierId = opts.tier && TIERS[opts.tier] ? opts.tier : 'HIGH';
    this.autoTier = opts.autoTier !== false;
    this.insets = { right: 0, bottom: 0, top: 0 };
    this.offset = { x: 0, y: 0 };

    this.mode = 'OVERVIEW';
    this.rig = { pos: new Vector3(), look: this.layout.realms[this.activeRealm].look.clone() };
    this.home = this.layout.realms[this.activeRealm].origin.clone(); // where the deep field is centred
    this.flight = null;
    this.pointers = new Map();
    this.dirtyUntil = 0;
    this.frame = 0;
    this.stats = { samples: [], lastReport: 0, slowWindows: 0, holdUntil: performance.now() + 2500 };
    this.labelCache = new WeakMap();

    this._initRenderer();
    this._buildScene();
    this._bindInput();
    this._resize();
    this._applyTier();
    const pose = this._poseFor(this.view);
    this.rig.pos.copy(pose.pos);
    this.rig.look.copy(pose.look);
    this.mode = pose.mode;
    this._posed = true;
    if (this.view.level === 'cosmos') this.home.copy(this.rig.pos);
    this._snapPresence();

    // Development builds only: a read-only handle for tests and the console.
    if (import.meta.env?.DEV) window.__rushi = this;

    this._last = performance.now();
    this._tick = this._tick.bind(this);
    this._raf = requestAnimationFrame(this._tick);
  }

  // --------------------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------------------
  _initRenderer() {
    const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setClearColor(new Color(PALETTE.void), 1);
    renderer.domElement.className = 'galaxy-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.scene = new Scene();
    this.camera = new PerspectiveCamera(FOV, 1, 0.5, 1200);

    this._onLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(this._raf);
      this.opts.onContextLost?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', this._onLost);
  }

  _buildScene() {
    this.spikeTex = createSpikeTexture();
    this.haloTex = createHaloTexture();
    this.disposables = [this.spikeTex, this.haloTex];

    this._buildNebula();
    this._buildParticles();
    this._buildLandmarks();
    this._buildAnchors();
    this._buildEdges();
  }

  _buildNebula() {
    const coarse = matchMedia('(pointer: coarse)').matches;
    const w = coarse ? 1024 : 2048;
    const target = new WebGLRenderTarget(w, w / 2, { minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false });
    const mat = new ShaderMaterial({
      vertexShader: NEBULA_VERT,
      fragmentShader: NEBULA_FRAG,
      uniforms: {
        uBlue: { value: new Color(PALETTE.nebula) },
        uDeep: { value: new Color('#0B1B3D') },
        uGold: { value: new Color(PALETTE.gold) },
      },
      depthTest: false,
      depthWrite: false,
    });
    const quad = new Mesh(new PlaneGeometry(2, 2), mat);
    const bakeScene = new Scene();
    bakeScene.add(quad);
    const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.renderer.setRenderTarget(target);
    this.renderer.render(bakeScene, cam);
    this.renderer.setRenderTarget(null);
    quad.geometry.dispose();
    mat.dispose();

    const sky = new Mesh(
      new SphereGeometry(600, 48, 24),
      new MeshBasicMaterial({ map: target.texture, side: BackSide, depthTest: false, depthWrite: false })
    );
    sky.renderOrder = -10;
    this.scene.add(sky);
    this.sky = sky;
    this.disposables.push(target, sky.geometry, sky.material);
  }

  // One particle system per realm. The Pillars are generated exactly as in
  // v1.0 (same seed, same order of random draws); their deep field of distant
  // stars, which v1.0 kept in the same buffer, is split into its own object so
  // it can travel with the visitor between systems.
  _buildParticles() {
    this.shared = {
      uTime: { value: 0 },
      uTier: { value: 1 },
      uPointScale: { value: 1 },
      uPixelRatio: { value: 1 },
      uMotion: { value: this.motion ? 1 : 0 },
    };
    const material = () => {
      const mat = new ShaderMaterial({
        vertexShader: PARTICLE_VERT,
        fragmentShader: PARTICLE_FRAG,
        uniforms: { ...this.shared, uDim: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      });
      this.disposables.push(mat);
      return mat;
    };
    this.systems = {};
    REALMS.forEach((realm, index) => {
      const sys = this._buildSystem(realm, index, material());
      this.systems[realm.id] = sys;
    });
    const pillars = this.systems[this.realmIds[0]];
    // The shell keeps its own dim, applied from the visited system.
    this.shell = pillars.shell;
    this.shellMat = pillars.shellMat;
    // Kept for the tier and motion code paths that predate realms.
    this.particleMat = { uniforms: this.shared };
  }

  _buildSystem(realm, index, mat) {
    const S = 14000;
    const samples = sampleSystem(realm.attractor, S);
    const origin = this.layout.realms[realm.id].origin;
    const world = (k) => {
      const l = toLocal(realm.attractor, samples[k * 4], samples[k * 4 + 1], samples[k * 4 + 2]);
      return [l[0] + origin.x, l[1] + origin.y, l[2] + origin.z];
    };
    let maxSpeed = 0;
    for (let i = 0; i < S; i++) maxSpeed = Math.max(maxSpeed, samples[i * 4 + 3]);

    // Every realm keeps v1.0's proportions: 60% backbone, 24% dust. Only the
    // first realm (the Pillars) also carries the 16% deep field.
    const withShell = index === 0;
    const N = 30000;
    const nBackbone = Math.floor(N * 0.6);
    const nDust = Math.floor(N * 0.24);
    const nGalaxy = nBackbone + nDust;
    const nShell = withShell ? N - nGalaxy : 0;
    const mk = (n) => ({
      pos: new Float32Array(n * 3),
      col: new Float32Array(n * 3),
      size: new Float32Array(n),
      alpha: new Float32Array(n),
      phase: new Float32Array(n),
      flow: new Float32Array(n),
      keep: new Float32Array(n),
    });
    const G = mk(nGalaxy);
    const H = mk(nShell);

    const r = rng(index === 0 ? PILLARS_SEED : PILLARS_SEED + 7919 * index);
    const cStar = new Color(PALETTE.starlight);
    const cGold = new Color(PALETTE.gold);
    const cBlue = new Color(PALETTE.sinitic);
    const cNebula = new Color(PALETTE.nebula);
    const cPale = new Color('#9DB8FF');
    const tmp = new Color();

    // Realms after the first interleave backbone and dust, so the light cloud
    // (a prefix of the buffer) shows both. The Pillars keep v1.0's order.
    const order = withShell ? null : Array.from({ length: nGalaxy }, (_, i) => i);
    if (order) {
      const shuffle = rng(0x51de + index);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(shuffle() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }

    for (let i = 0; i < nGalaxy + nShell; i++) {
      const inGalaxy = i < nGalaxy;
      const B = inGalaxy ? G : H;
      const j = inGalaxy ? (order ? order[i] : i) : i - nGalaxy;
      const j3 = j * 3;
      if (inGalaxy) {
        const backbone = i < nBackbone;
        const k = Math.floor(r() * S);
        const [wx, wy, wz] = world(k);
        const spread = backbone ? 0.24 : 1.15;
        B.pos[j3] = wx + gauss(r) * spread;
        B.pos[j3 + 1] = wy + gauss(r) * spread;
        B.pos[j3 + 2] = wz + gauss(r) * spread;
        B.flow[j] = k / S;
        const speed = samples[k * 4 + 3] / maxSpeed;
        if (backbone) {
          // Fast outer arcs run warm; slow turns near the eyes run cool.
          tmp.copy(cStar).lerp(cGold, Math.min(1, Math.pow(speed, 1.4) * 1.1));
          if (r() < 0.18) tmp.lerp(cBlue, 0.55);
          B.alpha[j] = 0.22 + 0.5 * Math.pow(r(), 2);
          B.size[j] = 0.5 + 0.85 * r();
          B.keep[j] = r() * 0.85;
        } else {
          tmp.copy(cNebula).lerp(cBlue, r() * 0.45);
          B.alpha[j] = 0.08 + 0.12 * r();
          B.size[j] = 0.9 + 1.5 * r();
          B.keep[j] = r();
        }
      } else {
        const u = r() * 2 - 1;
        const th = r() * Math.PI * 2;
        const rad = 160 + r() * 220;
        const s = Math.sqrt(1 - u * u);
        B.pos[j3] = rad * s * Math.cos(th);
        B.pos[j3 + 1] = rad * u;
        B.pos[j3 + 2] = rad * s * Math.sin(th);
        B.flow[j] = -1;
        const pick = r();
        tmp.copy(pick < 0.7 ? cStar : pick < 0.9 ? cPale : cGold);
        B.alpha[j] = 0.16 + 0.75 * Math.pow(r(), 4);
        B.size[j] = 0.55 + 1.6 * Math.pow(r(), 3);
        B.keep[j] = r();
      }
      B.col[j3] = tmp.r;
      B.col[j3 + 1] = tmp.g;
      B.col[j3 + 2] = tmp.b;
      B.phase[j] = r() * Math.PI * 2;
    }

    const geometry = (B) => {
      const geo = new BufferGeometry();
      geo.setAttribute('position', new BufferAttribute(B.pos, 3));
      geo.setAttribute('aColor', new BufferAttribute(B.col, 3));
      geo.setAttribute('aSize', new BufferAttribute(B.size, 1));
      geo.setAttribute('aAlpha', new BufferAttribute(B.alpha, 1));
      geo.setAttribute('aPhase', new BufferAttribute(B.phase, 1));
      geo.setAttribute('aFlow', new BufferAttribute(B.flow, 1));
      geo.setAttribute('aKeep', new BufferAttribute(B.keep, 1));
      this.disposables.push(geo);
      return geo;
    };

    const geo = geometry(G);
    const points = new Points(geo, mat);
    points.frustumCulled = false;
    this.scene.add(points);

    const sys = { id: realm.id, points, geo, mat, full: nGalaxy, light: Math.min(LIGHT, nGalaxy), presence: 0, lod: null };

    if (withShell) {
      const shellMat = mat.clone();
      shellMat.uniforms = { ...this.shared, uDim: { value: 1 } };
      this.disposables.push(shellMat);
      const shell = new Points(geometry(H), shellMat);
      shell.frustumCulled = false;
      this.scene.add(shell);
      sys.shell = shell;
      sys.shellMat = shellMat;
    }

    // One whisper-thin thread tracing the exact trajectory.
    const step = 3;
    const linePos = new Float32Array(Math.floor(S / step) * 3);
    for (let j = 0, k = 0; k < S && j < linePos.length / 3; k += step, j++) linePos.set(world(k), j * 3);
    const lineGeo = new BufferGeometry();
    lineGeo.setAttribute('position', new BufferAttribute(linePos, 3));
    const threadMat = new LineBasicMaterial({ color: PALETTE.starlight, transparent: true, opacity: 0.05, blending: AdditiveBlending, depthWrite: false });
    sys.thread = new Line(lineGeo, threadMat);
    sys.threadMat = threadMat;
    this.scene.add(sys.thread);
    this.disposables.push(lineGeo, threadMat);
    return sys;
  }

  _buildLandmarks() {
    // A handful of bright foreground-of-the-sky stars — the only spikes
    // besides the eight anchors. Fixed directions, so the sky is stable.
    const dirs = [
      [-0.55, 0.42, -0.72, 1.0, '#EAF2FF'],
      [0.62, 0.3, -0.73, 0.75, '#E4AE60'],
      [0.2, -0.5, -0.84, 0.6, '#EAF2FF'],
      [-0.8, -0.25, -0.55, 0.55, '#C9D8FF'],
      [0.85, -0.38, 0.36, 0.7, '#EAF2FF'],
      [-0.3, 0.75, 0.6, 0.5, '#E4AE60'],
      [0.05, 0.12, -0.99, 0.45, '#EAF2FF'],
    ];
    this.landmarks = dirs.map(([x, y, z, b, c]) => {
      const m = new SpriteMaterial({ map: this.spikeTex, color: c, transparent: true, opacity: 0.55 * b, blending: AdditiveBlending, depthWrite: false });
      const s = new Sprite(m);
      const dir = new Vector3(x, y, z).normalize();
      s.position.copy(dir).multiplyScalar(230);
      s.scale.setScalar(11 + 6 * b);
      this.scene.add(s);
      this.disposables.push(m);
      return { sprite: s, base: 0.55 * b, dir };
    });
  }

  _buildAnchors() {
    this.anchorSprites = {};
    for (const a of ANCHORS) {
      const L = this.layout.anchors[a.id];
      const m = new SpriteMaterial({ map: this.spikeTex, color: PALETTE.starlight, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false });
      const s = new Sprite(m);
      s.position.copy(L.pos);
      s.scale.setScalar(5.4);
      this.scene.add(s);
      this.anchorSprites[a.id] = { sprite: s, opacity: 0.95, scale: 5.4, realm: ANCHOR_REALM[a.id] };
      this.disposables.push(m);
    }
  }

  _lineMaterial(type, opacity = 0) {
    const meta = EDGE_TYPES[type];
    const common = { color: meta.color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false };
    if (meta.pattern === 'dashed') return new LineDashedMaterial({ ...common, dashSize: 0.55, gapSize: 0.38 });
    if (meta.pattern === 'dotted') return new LineDashedMaterial({ ...common, dashSize: 0.12, gapSize: 0.34 });
    return new LineBasicMaterial(common);
  }

  _buildEdges() {
    this.edgeVisuals = [];
    // Satellites: a soft halo and a thread back to the anchor.
    for (const a of ANCHORS) {
      const L = this.layout.anchors[a.id];
      for (const sat of L.sats) {
        const halo = new SpriteMaterial({ map: this.haloTex, color: EDGE_TYPES[sat.type].color, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false });
        const sprite = new Sprite(halo);
        sprite.position.copy(sat.pos);
        sprite.scale.setScalar(1.6);
        sprite.visible = false;
        this.scene.add(sprite);

        const mid = L.pos.clone().add(sat.pos).multiplyScalar(0.5).addScaledVector(L.up, 0.35);
        const pts = [];
        for (let i = 0; i <= 24; i++) {
          const t = i / 24;
          // quadratic Bézier, inline
          const a0 = (1 - t) * (1 - t), a1 = 2 * (1 - t) * t, a2 = t * t;
          pts.push(new Vector3(
            a0 * L.pos.x + a1 * mid.x + a2 * sat.pos.x,
            a0 * L.pos.y + a1 * mid.y + a2 * sat.pos.y,
            a0 * L.pos.z + a1 * mid.z + a2 * sat.pos.z
          ));
        }
        const geo = new BufferGeometry().setFromPoints(pts);
        const mat = this._lineMaterial(sat.type);
        const line = new Line(geo, mat);
        line.computeLineDistances();
        line.visible = false;
        this.scene.add(line);
        this.edgeVisuals.push({ id: sat.id, kind: 'satellite', parent: a.id, realm: L.realm, type: sat.type, settled: EDGE_MAP[sat.id]?.status === 'CANON', line, sprite, opacity: 0 });
        this.disposables.push(geo, mat, halo);
      }
    }
    // Bridges between anchors.
    for (const b of this.layout.bridges) {
      const geo = new BufferGeometry().setFromPoints(b.curve.getPoints(b.cross ? 96 : 48));
      const mat = this._lineMaterial(b.type);
      const line = new Line(geo, mat);
      line.computeLineDistances();
      this.scene.add(line);
      this.edgeVisuals.push({
        id: b.id,
        kind: 'bridge',
        from: b.from,
        to: b.to,
        cross: b.cross,
        realm: ANCHOR_REALM[b.from],
        realms: [ANCHOR_REALM[b.from], ANCHOR_REALM[b.to]],
        type: b.type,
        settled: EDGE_MAP[b.id]?.status === 'CANON',
        line,
        opacity: 0,
      });
      this.disposables.push(geo, mat);
    }
  }

  // --------------------------------------------------------------------------
  // Input: drag to orbit, wheel / pinch to zoom.
  // --------------------------------------------------------------------------
  _bindInput() {
    const el = this.renderer.domElement;
    const down = (e) => {
      el.setPointerCapture?.(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) this._pinchDist = this._pointerSpan();
    };
    const move = (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      if (this.pointers.size === 1) {
        if (Math.abs(dx) + Math.abs(dy) < 0.5) return;
        this._orbit(dx, dy);
      }
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.pointers.size === 2) {
        const span = this._pointerSpan();
        if (this._pinchDist) this._zoom(this._pinchDist / span);
        this._pinchDist = span;
      }
    };
    const up = (e) => {
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this._pinchDist = null;
    };
    const wheel = (e) => {
      e.preventDefault();
      const k = e.ctrlKey ? 0.01 : 0.0015; // trackpad pinch arrives as ctrl+wheel
      this._zoom(Math.exp(e.deltaY * k));
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('wheel', wheel, { passive: false });
    this._unbind = () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('wheel', wheel);
    };

    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(this.container);
    this._onVis = () => {
      this.stats.samples.length = 0;
      this.stats.holdUntil = performance.now() + 1500;
      this._last = performance.now();
    };
    document.addEventListener('visibilitychange', this._onVis);
  }

  _pointerSpan() {
    const [a, b] = [...this.pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y) || 1;
  }

  _takeControl() {
    this.flight = null;
    if (this.mode !== 'FREE_ORBIT') this._setMode('FREE_ORBIT');
    this._touch();
  }

  _orbit(dx, dy) {
    this._takeControl();
    const off = this.rig.pos.clone().sub(this.rig.look);
    const s = new Spherical().setFromVector3(off);
    s.theta -= dx * 0.0055;
    s.phi = Math.min(Math.PI - 0.2, Math.max(0.2, s.phi - dy * 0.0055));
    off.setFromSpherical(s);
    this.rig.pos.copy(this.rig.look).add(off);
  }

  _zoom(factor) {
    this._takeControl();
    const off = this.rig.pos.clone().sub(this.rig.look);
    const d = Math.min(this._maxZoom(), Math.max(6, off.length() * factor));
    this.rig.pos.copy(this.rig.look).add(off.setLength(d));
  }

  // --------------------------------------------------------------------------
  // Camera poses and flights
  // --------------------------------------------------------------------------
  _available() {
    const { w, h } = this.size;
    return { w: Math.max(120, w - this.insets.right), h: Math.max(120, h - this.insets.bottom - this.insets.top), H: h };
  }

  // Distance at which world half-extents (hx, hy) fit the free part of the
  // screen, leaving (mx, my) px of margin for labels.
  _fit(hx, hy, mx, my) {
    const { w, h, H } = this._available();
    const dx = (hx * H) / (2 * TAN_HALF * Math.max(40, w / 2 - mx));
    const dy = (hy * H) / (2 * TAN_HALF * Math.max(40, h / 2 - my));
    return Math.max(dx, dy);
  }

  _maxZoom() {
    return Math.max(260, this._cosmosDistance(this.realmIds) * 1.6);
  }

  _cosmosDistance(realmIds) {
    const { half } = this._cosmosFrame(realmIds);
    return this._fit(half.x, half.y, 40, 40);
  }

  // Centre and half-extents of a set of systems, seen from COSMOS_DIR.
  _cosmosFrame(realmIds) {
    const rs = realmIds.map((id) => this.layout.realms[id]);
    const centre = new Vector3();
    rs.forEach((r) => centre.add(r.look));
    centre.divideScalar(rs.length);
    let x = 0;
    let y = 0;
    for (const r of rs) {
      const off = r.look.clone().sub(centre);
      x = Math.max(x, Math.abs(off.x) + r.half.x, Math.abs(off.z) * 0.4 + r.half.x);
      y = Math.max(y, Math.abs(off.y) + Math.abs(off.z) * COSMOS_DIR.y + r.half.y * 0.9);
    }
    return { centre, half: { x, y } };
  }

  _cosmosPose(realmIds = this.realmIds, scale = 1) {
    const { centre, half } = this._cosmosFrame(realmIds);
    const d = this._fit(half.x, half.y, 70, 70) * 1.08 * scale;
    return { pos: centre.clone().addScaledVector(COSMOS_DIR, d), look: centre.clone(), mode: 'COSMOS' };
  }

  _systemPose(realmId) {
    const R = this.layout.realms[realmId];
    const d = this._fit(R.half.x, R.half.y, 24, 24);
    // Return to the overview from wherever the drift had carried us, as long
    // as we are already in this system; arriving from elsewhere, face it.
    const here = this._posed && this.rig.look.distanceTo(R.look) < 60;
    const flat = this.rig.pos.clone().sub(this.rig.look).setY(0);
    const dir =
      here && flat.lengthSq() > 1
        ? flat.normalize().multiplyScalar(Math.hypot(OVERVIEW_DIR.x, OVERVIEW_DIR.z)).setY(OVERVIEW_DIR.y)
        : OVERVIEW_DIR.clone();
    return { pos: R.look.clone().addScaledVector(dir, d), look: R.look.clone(), mode: 'OVERVIEW' };
  }

  _poseFor({ level, realmId, anchorId, edge } = this.view) {
    if (level === 'cosmos') return this._cosmosPose();
    if (edge && edge.kind === 'bridge') {
      const b = this.layout.bridges.find((x) => x.id === edge.id);
      const p0 = this.layout.anchors[b.from].pos;
      const p1 = this.layout.anchors[b.to].pos;
      const seg = p1.clone().sub(p0);
      let n = new Vector3().crossVectors(seg, new Vector3(0, 1, 0));
      if (n.lengthSq() < 1e-4) n.set(0, 0, 1);
      n.normalize();
      if (n.z < 0) n.negate();
      const dir = n.multiplyScalar(0.45).add(OVERVIEW_DIR).normalize();
      const look = b.label.clone().lerp(p0.clone().add(p1).multiplyScalar(0.5), 0.5);
      const right = new Vector3().crossVectors(new Vector3(0, 1, 0), dir).normalize();
      const upv = new Vector3().crossVectors(dir, right);
      const hx = Math.max(Math.abs(p0.clone().sub(look).dot(right)), Math.abs(p1.clone().sub(look).dot(right)));
      const hy = Math.max(Math.abs(p0.clone().sub(look).dot(upv)), Math.abs(p1.clone().sub(look).dot(upv)));
      const d = Math.max(16, this._fit(hx + 2, hy + 2, 70, 70));
      return { pos: look.clone().addScaledVector(dir, d), look, mode: 'CONNECTION' };
    }
    if (anchorId) {
      const A = this.layout.anchors[anchorId];
      const [rx, ry] = A.ringRadius;
      const compact = this.size.w < 640;
      const d = Math.max(14, this._fit(rx + 0.8, ry + 0.8, compact ? 64 : 205, compact ? 44 : 48));
      return { pos: A.pos.clone().addScaledVector(A.viewDir, d), look: A.pos.clone(), mode: edge ? 'CONNECTION' : 'FOCUS' };
    }
    return this._systemPose(realmId || this.activeRealm);
  }

  // The realm a view belongs to (for a bridge between systems: its first end).
  _realmOf(view) {
    if (view.level === 'cosmos') return this.activeRealm;
    if (view.anchorId) return ANCHOR_REALM[view.anchorId];
    return view.realmId || this.activeRealm;
  }

  _flyTo(pose, quick = false, via = null) {
    if (!this.motion) {
      this.rig.pos.copy(pose.pos);
      this.rig.look.copy(pose.look);
      this.flight = null;
      this._setMode(pose.mode);
      this._touch();
      return;
    }
    if (via) {
      // Between systems: rise through a view of both, then descend. The path
      // is a quadratic Bézier whose midpoint is exactly the waypoint.
      const ctrl = (a, m, b) => m.clone().multiplyScalar(2).sub(a.clone().add(b).multiplyScalar(0.5));
      this.flight = {
        fromPos: this.rig.pos.clone(),
        fromLook: this.rig.look.clone(),
        toPos: pose.pos,
        toLook: pose.look,
        ctrlPos: ctrl(this.rig.pos, via.pos, pose.pos),
        ctrlLook: ctrl(this.rig.look, via.look, pose.look),
        t0: performance.now(),
        dur: 3000,
        lift: 0,
        then: pose.mode,
      };
      this._setMode('TRANSITION');
      return;
    }
    const dist = this.rig.pos.distanceTo(pose.pos) + this.rig.look.distanceTo(pose.look);
    const dur = quick ? 520 : Math.min(1900, Math.max(950, 820 + dist * 7));
    this.flight = {
      fromPos: this.rig.pos.clone(),
      fromLook: this.rig.look.clone(),
      toPos: pose.pos,
      toLook: pose.look,
      t0: performance.now(),
      dur,
      lift: quick ? 0 : Math.min(14, dist * 0.08),
      then: pose.mode,
    };
    this._setMode('TRANSITION');
  }

  _setMode(m) {
    if (this.mode === m) return;
    this.mode = m;
    this.opts.onMode?.(m);
  }

  _touch(ms = 1400) {
    this.dirtyUntil = Math.max(this.dirtyUntil, performance.now() + ms);
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  /**
   * view: { level: 'cosmos' | 'system' | 'star' | 'connection',
   *         realmId, anchorId, edge }
   */
  setView(view) {
    const next = { level: 'system', realmId: null, anchorId: null, edge: null, ...view };
    if (next.anchorId) next.realmId = ANCHOR_REALM[next.anchorId];
    if (!next.realmId || !this.layout.realms[next.realmId]) next.realmId = this.activeRealm;
    const { anchorId, edge } = next;
    const fromRealm = this.view.level === 'cosmos' ? null : this._realmOf(this.view);
    const toRealm = next.level === 'cosmos' ? null : this._realmOf(next);
    this.view = next;
    this.selection = { anchorId: anchorId || null, edge: edge || null };
    // A satellite never moves the camera away from its constellation.
    const keep = edge && edge.kind === 'satellite' && this.mode !== 'FREE_ORBIT' && this._lastAnchor === anchorId;
    this._lastAnchor = anchorId;
    const crossEdge = edge && edge.kind === 'bridge' && ANCHOR_REALM[edge.from] !== ANCHOR_REALM[edge.to];
    if (!keep) {
      const pose = this._poseFor(next);
      if (fromRealm && toRealm && fromRealm !== toRealm && !crossEdge) {
        // Travel between systems passes through the cosmos, so the visitor
        // sees where they are going.
        this.transit = { from: fromRealm, to: toRealm };
        this._flyTo(pose, false, this._cosmosPose([fromRealm, toRealm], 1.15));
      } else {
        this.transit = null;
        if (toRealm && !crossEdge) this.activeRealm = toRealm;
        this._flyTo(pose);
      }
    }
    if (!this.motion) {
      if (toRealm) this.activeRealm = toRealm;
      this.transit = null;
    }
    this._touch();
  }

  // Back-compatible: v1.0's interface, within the current system.
  setSelection(anchorId, edge) {
    this.setView({ level: edge ? 'connection' : anchorId ? 'star' : 'system', realmId: this.view.realmId, anchorId, edge });
  }

  recenter() {
    this._flyTo(this._poseFor(this.view));
  }

  setFilters(filters) {
    this.filters = { ...filters };
    this._touch();
  }

  setReducedMotion(reduced) {
    this.motion = !reduced;
    this.shared.uMotion.value = this.motion ? 1 : 0;
    this._touch();
  }

  setTier(id, auto) {
    if (TIERS[id]) this.tierId = id;
    if (typeof auto === 'boolean') this.autoTier = auto;
    this.stats.samples.length = 0;
    this.stats.slowWindows = 0;
    this.stats.holdUntil = performance.now() + 2500;
    this._applyTier();
  }

  setInsets(insets) {
    const next = { right: Math.round(insets.right || 0), bottom: Math.round(insets.bottom || 0), top: Math.round(insets.top || 0) };
    if (next.right === this.insets.right && next.bottom === this.insets.bottom && next.top === this.insets.top) return;
    this.insets = next;
    if (this.transit) this._refitAfter = true;
    else if (this.mode !== 'FREE_ORBIT') this._flyTo(this._poseFor(this.view), true);
    this._touch();
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    this._unbind?.();
    this._ro?.disconnect();
    document.removeEventListener('visibilitychange', this._onVis);
    this.renderer.domElement.removeEventListener('webglcontextlost', this._onLost);
    this.disposables.forEach((d) => d.dispose?.());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // --------------------------------------------------------------------------
  // Frame loop
  // --------------------------------------------------------------------------
  _applyTier() {
    const t = TIERS[this.tierId];
    const dpr = Math.min(window.devicePixelRatio || 1, t.maxDpr);
    this.renderer.setPixelRatio(dpr);
    if (this.size) this.renderer.setSize(this.size.w, this.size.h, false);
    const u = this.shared;
    u.uTier.value = t.keep;
    u.uPointScale.value = t.pointScale;
    u.uPixelRatio.value = dpr;
    this.sky.visible = t.nebula;
    this._touch();
    this.opts.onTier?.(this.tierId, this.autoTier);
  }

  _resize() {
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.size = { w, h };
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.mode !== 'FREE_ORBIT' && this.flight === null && this.rig.pos.lengthSq() > 0) {
      const pose = this._poseFor(this.view);
      this.rig.pos.copy(pose.pos);
      this.rig.look.copy(pose.look);
    }
    this._touch();
  }

  _measure(now, dt) {
    const s = this.stats;
    if (document.hidden || now < s.holdUntil) return;
    s.samples.push(dt);
    if (s.samples.length > 90) s.samples.shift();
    if (now - s.lastReport < 1000 || s.samples.length < 30) return;
    s.lastReport = now;
    const avg = s.samples.reduce((a, b) => a + b, 0) / s.samples.length;
    this.opts.onTelemetry?.({ ms: avg, fps: Math.round(1000 / avg) });
    if (!this.autoTier) return;
    // Frame time is only meaningful while we render every frame.
    s.slowWindows = avg > 24 && TIERS[this.tierId].frameSkip === 1 ? s.slowWindows + 1 : 0;
    if (s.slowWindows >= 2) {
      const i = TIER_ORDER.indexOf(this.tierId);
      if (i < TIER_ORDER.length - 1) this.setTier(TIER_ORDER[i + 1]);
    }
  }

  _tick(now) {
    this._raf = requestAnimationFrame(this._tick);
    const dtMs = Math.min(100, now - this._last);
    this._last = now;
    const dt = dtMs / 1000;
    this.frame++;

    const flying = !!this.flight;
    const interacting = this.pointers.size > 0;
    const busy = flying || interacting || now < this.dirtyUntil;
    if (!this.motion && !busy) return; // nothing changes: draw nothing, burn nothing
    if (!busy && this.frame % TIERS[this.tierId].frameSkip !== 0) return;

    this._measure(now, dtMs * (busy ? 1 : TIERS[this.tierId].frameSkip));
    this._updateCamera(now, dt);
    this._updateVisuals(dt);
    this.renderer.render(this.scene, this.camera);
    this._projectLabels();
    if (!this._ready) {
      this._ready = true;
      this.opts.onReady?.();
    }
  }

  _updateCamera(now, dt) {
    const f = this.flight;
    if (f) {
      const raw = Math.min(1, (now - f.t0) / f.dur);
      const e = easeInOut(raw);
      if (f.ctrlPos) {
        const q = (a, c, b, out) => out.copy(a).multiplyScalar((1 - e) * (1 - e)).addScaledVector(c, 2 * (1 - e) * e).addScaledVector(b, e * e);
        q(f.fromLook, f.ctrlLook, f.toLook, this.rig.look);
        q(f.fromPos, f.ctrlPos, f.toPos, this.rig.pos);
        // Hand the full-density drawing to the destination at the top of the arc.
        if (e >= 0.5 && this.transit) {
          this.activeRealm = this.transit.to;
        }
      } else {
        this.rig.look.lerpVectors(f.fromLook, f.toLook, e);
        this.rig.pos.lerpVectors(f.fromPos, f.toPos, e);
      }
      if (f.lift) {
        const back = this.rig.pos.clone().sub(this.rig.look).normalize();
        this.rig.pos.addScaledVector(back, Math.sin(Math.PI * e) * f.lift);
      }
      if (raw >= 1) {
        this.flight = null;
        this.transit = null;
        this._setMode(f.then);
        // The reading sheet may have opened or resized during a long flight.
        if (this._refitAfter) {
          this._refitAfter = false;
          this._flyTo(this._poseFor(this.view), true);
        }
      }
    } else if ((this.mode === 'OVERVIEW' || this.mode === 'COSMOS') && this.motion) {
      // A slow sidereal drift around the vertical axis.
      const off = this.rig.pos.clone().sub(this.rig.look);
      off.applyAxisAngle(new Vector3(0, 1, 0), dt * (this.mode === 'COSMOS' ? 0.005 : 0.018));
      this.rig.pos.copy(this.rig.look).add(off);
    }

    const rate = this.motion ? 5 : 1e3;
    this.offset.x = approach(this.offset.x, this.insets.right / 2, rate, dt);
    this.offset.y = approach(this.offset.y, (this.insets.bottom - this.insets.top) / 2, rate, dt);
    const { w, h } = this.size;
    this.camera.setViewOffset(w, h, this.offset.x, this.offset.y, w, h);

    this.camera.position.copy(this.rig.pos);
    this.camera.lookAt(this.rig.look);
    this.sky.position.copy(this.rig.pos);

    // The deep field and the landmark stars are centred on the visited system
    // (for the Pillars: the origin, exactly as in v1.0); in the cosmos view
    // they travel with the visitor, like the sky.
    const homeTarget = this.view.level === 'cosmos' ? this.rig.pos : this.layout.realms[this._realmOf(this.view)].origin;
    if (this.motion && this.flight) this.home.lerp(homeTarget, 1 - Math.exp(-3 * dt));
    else this.home.lerp(homeTarget, this.motion ? 1 - Math.exp(-4 * dt) : 1);
    if (this.home.distanceToSquared(homeTarget) < 1e-6) this.home.copy(homeTarget);
    this.shell.position.copy(this.home);
    for (const l of this.landmarks) l.sprite.position.copy(this.home).addScaledVector(l.dir, 230);
  }

  // How present each system is: 1 = drawn, 0 = not drawn at all (zero cost).
  _presenceTarget(realmId) {
    const v = this.view;
    if (v.level === 'cosmos') return 1;
    if (realmId === this._realmOf(v)) return 1;
    if (this.transit && (this.transit.from === realmId || this.transit.to === realmId)) return 1;
    const e = v.edge;
    if (e && e.kind === 'bridge' && (ANCHOR_REALM[e.from] === realmId || ANCHOR_REALM[e.to] === realmId)) return 1;
    // Zooming far out by hand lets the rest of the cosmos fade in.
    if (this.mode === 'FREE_ORBIT') {
      const d = this.rig.pos.distanceTo(this.rig.look);
      const R = this.layout.realms[this._realmOf(v)];
      const dSys = this._fit(R.half.x, R.half.y, 24, 24);
      return Math.min(1, Math.max(0, (d - 1.7 * dSys) / (1.3 * dSys)));
    }
    return 0;
  }

  _snapPresence() {
    for (const s of Object.values(this.systems)) s.presence = this._presenceTarget(s.id);
  }

  _updateVisuals(dt) {
    const { anchorId, edge } = this.selection;
    const rate = this.motion ? 6 : 1e3;
    const cosmos = this.view.level === 'cosmos';
    const u = this.shared;
    u.uTime.value = performance.now() / 1000;

    // The deep field dims with the visited system's selection, as in v1.0.
    const sel = this.shellMat.uniforms.uDim;
    sel.value = approach(sel.value, anchorId ? 0.34 : 1, rate * 0.6, dt);
    this.landmarks.forEach((l) => (l.sprite.material.opacity = l.base * (0.45 + 0.55 * sel.value)));

    const presence = {};
    for (const s of Object.values(this.systems)) {
      s.presence = approach(s.presence, this._presenceTarget(s.id), (this.motion ? 3.2 : 1e3), dt);
      if (s.presence < 0.005) s.presence = 0;
      presence[s.id] = s.presence;
      const visible = s.presence > 0;
      s.points.visible = visible;
      s.thread.visible = visible;
      if (!visible) continue;
      const lod = s.id === this.activeRealm ? 'full' : 'light';
      if (lod !== s.lod) {
        s.geo.setDrawRange(0, lod === 'full' ? s.full : s.light);
        s.lod = lod;
      }
      // Within the visited system the dim follows the selection, exactly as
      // v1.0 did; elsewhere a system is a quieter cloud.
      const home = s.id === this._realmOf(this.view) && !cosmos;
      const dimTarget = home ? (anchorId ? 0.34 : 1) : lod === 'full' ? 0.85 : 0.75;
      s.mat.uniforms.uDim.value = home && s.presence >= 0.999 ? sel.value : approach(s.mat.uniforms.uDim.value, dimTarget * s.presence, rate * 0.6, dt);
      s.threadMat.opacity = 0.05 * s.mat.uniforms.uDim.value;
    }

    const bridgeEnds = edge && edge.kind === 'bridge' ? [edge.from, edge.to] : null;
    for (const [id, a] of Object.entries(this.anchorSprites)) {
      const p = presence[a.realm];
      const lit = !anchorId || (bridgeEnds ? bridgeEnds.includes(id) : id === anchorId);
      let targetOp = lit ? 0.98 : 0.26;
      if (cosmos) targetOp = a.realm === this.activeRealm ? 0.7 : 0.45;
      else if (bridgeEnds && !bridgeEnds.includes(id) && a.realm !== this._realmOf(this.view)) targetOp = 0;
      const targetScale = anchorId === id && !bridgeEnds ? 5.9 : lit && anchorId ? 5.8 : 5.4;
      a.opacity = approach(a.opacity, targetOp, rate, dt);
      a.scale = approach(a.scale, targetScale, rate, dt);
      a.sprite.material.opacity = a.opacity * p;
      a.sprite.visible = p > 0 && a.opacity * p > 0.004;
      // Keep spikes a constant-ish size on screen: grand in the overview,
      // never swallowing the text when the camera comes close.
      const near = Math.min(1, Math.max(0.42, this.camera.position.distanceTo(a.sprite.position) / 62));
      a.sprite.scale.setScalar(a.scale * near);
    }

    for (const v of this.edgeVisuals) {
      let target = 0;
      if (this.filters[v.type]) {
        if (v.kind === 'bridge' && v.cross) {
          // Between systems: faint threads in the cosmos; drawn in full only
          // when it is the claim being read.
          if (edge && edge.kind === 'bridge') target = edge.id === v.id ? 1 : 0;
          else if (cosmos) target = 0.32;
          else if (this.mode === 'FREE_ORBIT') target = 0.32 * Math.min(presence[v.realms[0]], presence[v.realms[1]]);
        } else if (v.kind === 'bridge') {
          if (cosmos) target = 0.12;
          else if (edge && edge.kind === 'bridge') target = edge.id === v.id ? 1 : 0.04;
          else if (anchorId) target = v.from === anchorId || v.to === anchorId ? (edge ? 0.18 : 0.34) : 0.04;
          else target = 0.45;
          target *= presence[v.realm];
        } else if (v.parent === anchorId && !(edge && edge.kind === 'bridge') && !cosmos) {
          target = edge ? (edge.id === v.id ? 1 : 0.14) : 0.62;
        }
      }
      // Unsettled claims (WORKING, OPEN QUESTION) draw fainter, unless selected.
      if (!v.settled && !(edge && edge.id === v.id)) target *= 0.6;
      v.opacity = approach(v.opacity, target, rate, dt);
      const visible = v.opacity > 0.01;
      v.line.visible = visible;
      v.line.material.opacity = v.opacity;
      if (v.sprite) {
        v.sprite.visible = visible;
        v.sprite.material.opacity = Math.min(1, v.opacity * 1.3);
      }
    }
  }

  // Write label positions straight to the DOM — no React re-render per frame.
  _projectLabels() {
    const { w, h } = this.size;
    const v = new Vector3();
    const anchorScreen = {};
    const place = (key, el) => {
      const p = this.layout.positions[key];
      if (!p) return null;
      v.copy(p).project(this.camera);
      const visible = v.z < 1 && v.z > -1;
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      const last = this.labelCache.get(el) || {};
      if (visible !== last.visible) el.style.visibility = visible ? 'visible' : 'hidden';
      if (visible && (Math.abs(x - (last.x ?? -1e9)) > 0.2 || Math.abs(y - (last.y ?? -1e9)) > 0.2)) {
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        last.x = x;
        last.y = y;
      }
      last.visible = visible;
      this.labelCache.set(el, last);
      return { x, y };
    };
    for (const [key, el] of this.labels) if (key.startsWith('a:')) anchorScreen[key.slice(2)] = place(key, el);
    for (const [key, el] of this.labels) {
      if (key.startsWith('a:')) continue;
      const p = place(key, el);
      if (p && key.startsWith('s:') && this.selection.anchorId) {
        const a = anchorScreen[this.selection.anchorId];
        if (a) {
          const side = Math.abs(p.x - a.x) < 24 ? 'c' : p.x < a.x ? 'l' : 'r';
          if (el.dataset.side !== side) el.dataset.side = side;
          const vert = p.y < a.y + 40 ? 't' : 'b'; // the anchor's own name sits just below it
          if (el.dataset.vert !== vert) el.dataset.vert = vert;
        }
      }
    }
  }
}
