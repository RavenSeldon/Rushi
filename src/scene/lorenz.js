// ============================================================================
// The Lorenz system, integrated numerically (classical 4th-order Runge–Kutta).
//
//   dx/dt = σ (y − x)      σ = 10
//   dy/dt = x (ρ − z) − y  ρ = 28
//   dz/dt = x y − β z      β = 8/3
//
// Deterministic: same parameters, same start, same galaxy on every visit.
// ============================================================================

export const SIGMA = 10;
export const RHO = 28;
export const BETA = 8 / 3;

const deriv = (x, y, z) => [SIGMA * (y - x), x * (RHO - z) - y, x * y - BETA * z];

function rk4(s, dt) {
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

/**
 * Sample the attractor. Returns a Float32Array of [x,y,z, speed] per sample,
 * in Lorenz coordinates. A transient is discarded first so every sample lies
 * on the attractor itself.
 */
export function sampleAttractor({ samples = 14000, dt = 0.004, transient = 3000 } = {}) {
  let s = [0.1, 0, 0];
  for (let i = 0; i < transient; i++) s = rk4(s, dt);
  const out = new Float32Array(samples * 4);
  for (let i = 0; i < samples; i++) {
    s = rk4(s, dt);
    const d = deriv(s[0], s[1], s[2]);
    out[i * 4] = s[0];
    out[i * 4 + 1] = s[1];
    out[i * 4 + 2] = s[2];
    out[i * 4 + 3] = Math.hypot(d[0], d[1], d[2]);
  }
  return out;
}

// Lorenz space → world space. The (x, z) plane faces the camera so the
// classic two-winged "butterfly" reads at a glance; y becomes depth.
export const WORLD_SCALE = 1.2;
export const toWorld = (x, y, z) => [x * WORLD_SCALE, (z - 24) * WORLD_SCALE, y * WORLD_SCALE];

// Small seeded PRNG (mulberry32) so particle scatter is reproducible.
export function rng(seed = 0x5eed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
