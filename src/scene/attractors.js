// ============================================================================
// The attractor registry. Each solar system in Rushi is drawn from its own
// real strange attractor, integrated numerically (classical 4th-order
// Runge–Kutta) with the published parameters named below.
//
// Every entry gives:
//   deriv(x, y, z)  the equations of motion
//   dt, transient, start
//   map             attractor space → the system's local world frame:
//                   local = ((x − cx)·s, (z − cz)·s, (y − cy)·s)
//                   so the attractor's z axis stands upright on screen
//   half            world half-extents to frame, including room for labels
//   look            the point the system overview looks at (local frame)
//
// The citations are Baracus's, from general knowledge, and have not yet been
// opened (unchecked). The equations and parameters are the ones in common use.
//
// The Lorenz entry delegates to lorenz.js unchanged, so the Pillars are drawn
// exactly as in v1.0. The map constants for the others were computed from a
// bounding box of 14 000 samples (scripts/fit-attractors.mjs) and written
// down here, so the cosmos is the same on every visit.
// ============================================================================
import { BETA, RHO, SIGMA, sampleAttractor as sampleLorenz, WORLD_SCALE } from './lorenz.js';

function rk4(deriv, s, dt) {
  const [x, y, z] = s;
  const k1 = deriv(x, y, z);
  const k2 = deriv(x + 0.5 * dt * k1[0], y + 0.5 * dt * k1[1], z + 0.5 * dt * k1[2]);
  const k3 = deriv(x + 0.5 * dt * k2[0], y + 0.5 * dt * k2[1], z + 0.5 * dt * k2[2]);
  const k4 = deriv(x + dt * k3[0], y + dt * k3[1], z + dt * k3[2]);
  return [
    x + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

export const ATTRACTORS = {
  lorenz: {
    name: 'Lorenz',
    citation: 'E. N. Lorenz, “Deterministic Nonperiodic Flow”, J. Atmos. Sci. 20 (1963)',
    params: { sigma: SIGMA, rho: RHO, beta: BETA },
    deriv: (x, y, z) => [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z],
    dt: 0.004,
    transient: 3000,
    start: [0.1, 0, 0],
    map: { cx: 0, cy: 0, cz: 24, s: WORLD_SCALE },
    half: { x: 27, y: 32 },
    look: [0, 0.5, 0],
  },
  aizawa: {
    name: 'Aizawa',
    citation: 'Attributed to Yoji Aizawa; parameters as in common use (source not yet traced)',
    params: { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1 },
    deriv: (x, y, z) => {
      const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
      return [(z - b) * x - d * y, d * x + (z - b) * y, c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x];
    },
    dt: 0.01,
    transient: 4000,
    start: [0.1, 0, 0],
    map: { cx: 0, cy: 0.02, cz: 0.74, s: 14.2 },
    half: { x: 27, y: 28 },
    look: [0, 0.5, 0],
  },
  thomas: {
    name: 'Thomas',
    citation: 'R. Thomas, “Deterministic chaos seen in terms of feedback circuits”, Int. J. Bifurc. Chaos 9 (1999)',
    params: { b: 0.208186 },
    deriv: (x, y, z) => {
      const b = 0.208186;
      return [Math.sin(y) - b * x, Math.sin(z) - b * y, Math.sin(x) - b * z];
    },
    dt: 0.05,
    transient: 3000,
    start: [1.1, 1.1, -0.01],
    map: { cx: 1.35, cy: 1.35, cz: 1.35, s: 8.5 },
    half: { x: 27, y: 29 },
    look: [0, 0.5, 0],
  },
  halvorsen: {
    name: 'Halvorsen',
    citation: 'A. Halvorsen’s cyclically symmetric system, as given in J. C. Sprott, Elegant Chaos (2010)',
    params: { a: 1.89 },
    deriv: (x, y, z) => {
      const a = 1.89;
      return [-a * x - 4 * y - 4 * z - y * y, -a * y - 4 * z - 4 * x - z * z, -a * z - 4 * x - 4 * y - x * x];
    },
    dt: 0.005,
    transient: 4000,
    start: [-1.48, -1.51, 2.04],
    // Seen down its axis of symmetry: three lobes, 120° apart.
    map: { cx: -3.494, cy: -3.696, cz: -0.733, s: 1.9, basis: 'diagonal' },
    half: { x: 27, y: 27 },
    look: [0, 0.5, 0],
  },
  rossler: {
    name: 'Rössler',
    citation: 'O. E. Rössler, “An equation for continuous chaos”, Phys. Lett. A 57 (1976)',
    params: { a: 0.2, b: 0.2, c: 5.7 },
    deriv: (x, y, z) => [-y - z, x + 0.2 * y, 0.2 + z * (x - 5.7)],
    dt: 0.01,
    transient: 5000,
    start: [0.1, 0, 0],
    // Tilted so the spiral disk and its single fold are both in view.
    map: { cx: 1.17, cy: 3.714, cz: 4.952, s: 1.83, basis: [[1, 0, 0], [0, 0.6, 0.8], [0, -0.8, 0.6]] },
    half: { x: 27, y: 31 },
    look: [0, 0.5, 0],
  },
  chen: {
    name: 'Chen',
    citation: 'G. Chen and T. Ueta, “Yet another chaotic attractor”, Int. J. Bifurc. Chaos 9 (1999)',
    params: { a: 35, b: 3, c: 28 },
    deriv: (x, y, z) => [35 * (y - x), (28 - 35) * x - x * z + 28 * y, x * y - 3 * z],
    dt: 0.002,
    transient: 5000,
    start: [-0.1, 0.5, -0.6],
    map: { cx: 2.11, cy: 2.69, cz: 27.9, s: 0.88 },
    half: { x: 27, y: 28 },
    look: [0, 0.5, 0],
  },
  dadras: {
    name: 'Dadras',
    citation: 'S. Dadras and H. R. Momeni, “A novel three-dimensional autonomous chaotic system”, Phys. Lett. A 373 (2009)',
    params: { a: 3, b: 2.7, c: 1.7, d: 2, e: 9 },
    deriv: (x, y, z) => [y - 3 * x + 2.7 * y * z, 1.7 * y - x * z + z, 2 * x * y - 9 * z],
    dt: 0.005,
    transient: 4000,
    start: [1.1, 2.1, -2],
    map: { cx: 3.42, cy: -2.05, cz: -2.71, s: 1.35 },
    half: { x: 27, y: 23 },
    look: [0, 0.5, 0],
  },
  sprott: {
    name: 'Sprott',
    citation: 'J. C. Sprott, “A dynamical system with a strange attractor and invariant tori”, Phys. Lett. A 378 (2014)',
    params: { a: 2.07, b: 1.79 },
    deriv: (x, y, z) => [y + 2.07 * x * y + x * z, 1 - 1.79 * x * x + y * z, x - x * x - y * y],
    dt: 0.005,
    transient: 4000,
    start: [0.63, 0.47, -0.54],
    map: { cx: 0.7, cy: -0.04, cz: 0, s: 22 },
    half: { x: 27, y: 29 },
    look: [0, 0.5, 0],
  },
  // Realm IX — Arneodo–Coullet–Tresser chaotic system.
  // β=(−5.5, 3.5, 1, −1), x'=y, y'=z, z'=5.5x−3.5y−z−x³.
  // Initial state / scale numerically sampled 2026-11-05; source not yet primary-verified.
  arneodo: {
    name: 'Arneodo',
    citation: 'Arneodo, Coullet & Tresser (1980), Phys. Lett. A 79, 259–263; equation also documented by Brown University chaos tutorial',
    params: { a: -5.5, b: 3.5, c: 1 },
    deriv: (x, y, z) => [y, z, 5.5 * x - 3.5 * y - z - x * x * x],
    dt: 0.01, transient: 5000, start: [0.2, 0.2, -0.75],
    map: { cx: 0, cy: 0, cz: 0, s: 2 },
    half: { x: 23, y: 28 }, look: [0, 0.5, 0],
  },
  // Realm X — Rabinovich–Fabrikant (1979): nonlinear-wave instabilities.
  // α=0.14, γ=0.1 as used in Scientific Reports (2023), equation (23).
  // The basis exposes the two horizontal wings without altering the integrator.
  rabinovich: {
    name: 'Rabinovich–Fabrikant',
    citation: 'Rabinovich & Fabrikant (1979), Sov. Phys. JETP 50, 311–317; equations/parameters: Scientific Reports 13 (2023), doi:10.1038/s41598-023-39886-w',
    params: { alpha: 0.14, gamma: 0.1 },
    deriv: (x, y, z) => [y * (z - 1 + x * x) + 0.1 * x,
      x * (3 * z + 1 - x * x) + 0.1 * y, -2 * z * (0.14 + x * y)],
    dt: 0.01, transient: 5000, start: [-0.4, 0.1, 0.7],
    map: { cx: 0, cy: 0, cz: 0.8, s: 9, basis: [[0, 1, 0], [1, 0, 0], [0, 0, 1]] },
    half: { x: 29, y: 28 }, look: [0, 0.5, 0],
  },

  // Realm XI — Newton–Leipnik: rigid-body motion with linear feedback control.
  // a = 0.4, b = 0.175. Two strange attractors coexist; the start below lies in
  // the basin of one of them, and only that one is drawn (as the Atlas planned).
  newton: {
    name: 'Newton–Leipnik',
    citation: 'R. B. Leipnik and T. A. Newton, “Double strange attractors in rigid body motion with linear feedback control”, Phys. Lett. A 86 (1981)',
    params: { a: 0.4, b: 0.175 },
    deriv: (x, y, z) => [-0.4 * x + y + 10 * y * z, -x - 0.4 * y + 5 * x * z, 0.175 * z - 5 * x * y],
    dt: 0.005, transient: 5000, start: [0.349, 0, -0.16],
    map: { cx: 0.11, cy: 0.02, cz: 0.21, s: 27 },
    half: { x: 27, y: 20 }, look: [0, 0.5, 0],
  },
  // Realm XII — Lorenz-84: Lorenz's low-order model of the general circulation.
  // a = 0.25, b = 4, F = 8, G = 1. Seen along x, so the y–z plane faces the viewer.
  lorenz84: {
    name: 'Lorenz-84',
    citation: 'E. N. Lorenz, “Irregularity: a fundamental property of the atmosphere”, Tellus A 36 (1984)',
    params: { a: 0.25, b: 4, F: 8, G: 1 },
    deriv: (x, y, z) => [-y * y - z * z - 0.25 * x + 0.25 * 8, x * y - 4 * x * z - y + 1, 4 * x * y + x * z - z],
    dt: 0.005, transient: 5000, start: [1, 0, 0],
    map: { cx: 0.9, cy: 0.06, cz: 0.05, s: 9.8, basis: [[0, 1, 0], [0, 0, 1], [1, 0, 0]] },
    half: { x: 27, y: 28 }, look: [0, 0.5, 0],
  },
  // Realm XIII — Burke–Shaw: Shaw's variant of the Lorenz equations. s = 10, v = 4.272.
  burkeshaw: {
    name: 'Burke–Shaw',
    citation: 'R. Shaw, “Strange attractors, chaotic behavior, and information flow”, Z. Naturforsch. 36a (1981)',
    params: { s: 10, v: 4.272 },
    deriv: (x, y, z) => [-10 * (x + y), -y - 10 * x * z, 10 * x * y + 4.272],
    dt: 0.002, transient: 5000, start: [1, 0, 0],
    map: { cx: 0, cy: 0, cz: -0.01, s: 11 },
    half: { x: 27, y: 28 }, look: [0, 0.5, 0],
  },

};

/**
 * Attractor space → the system's local world frame. By default the
 * attractor's z axis stands upright and y is depth. A `basis` [right, up,
 * toward the viewer] instead views the attractor along a chosen direction
 * (Halvorsen is seen down its axis of symmetry, x = y = z).
 */
export function toLocal(attractorId, x, y, z) {
  const { cx, cy, cz, s } = ATTRACTORS[attractorId].map;
  const basis = ATTRACTORS[attractorId].map.basis === 'diagonal' ? DIAGONAL_BASIS : ATTRACTORS[attractorId].map.basis;
  const d = [x - cx, y - cy, z - cz];
  if (!basis) return [d[0] * s, d[2] * s, d[1] * s];
  const dot = (v) => (d[0] * v[0] + d[1] * v[1] + d[2] * v[2]) * s;
  return [dot(basis[0]), dot(basis[1]), dot(basis[2])];
}

// Right, up and toward-the-viewer for a view straight down the line x = y = z.
const R2 = Math.SQRT1_2, R3 = 1 / Math.sqrt(3), R6 = 1 / Math.sqrt(6);
export const DIAGONAL_BASIS = [[R2, -R2, 0], [-R6, -R6, 2 * R6], [R3, R3, R3]];

/**
 * Sample an attractor. Returns a Float32Array of [x,y,z, speed] per sample,
 * in attractor coordinates, with the transient discarded. Lorenz uses the
 * original sampler, so the Pillars stay bit-for-bit as they were.
 */
export function sampleSystem(attractorId, samples = 14000) {
  if (attractorId === 'lorenz') return sampleLorenz({ samples });
  const A = ATTRACTORS[attractorId];
  let s = A.start.slice();
  for (let i = 0; i < A.transient; i++) s = rk4(A.deriv, s, A.dt);
  const out = new Float32Array(samples * 4);
  for (let i = 0; i < samples; i++) {
    s = rk4(A.deriv, s, A.dt);
    const d = A.deriv(s[0], s[1], s[2]);
    out[i * 4] = s[0];
    out[i * 4 + 1] = s[1];
    out[i * 4 + 2] = s[2];
    out[i * 4 + 3] = Math.hypot(d[0], d[1], d[2]);
  }
  return out;
}
