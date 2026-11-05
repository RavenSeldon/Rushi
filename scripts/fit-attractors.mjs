// `node scripts/fit-attractors.mjs` — print each attractor's bounding box in
// attractor space and in the local world frame, so the `map` constants in
// src/scene/attractors.js can be chosen by measurement, not by eye.
import { ATTRACTORS, sampleSystem, toLocal } from '../src/scene/attractors.js';

for (const id of Object.keys(ATTRACTORS)) {
  const s = sampleSystem(id);
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  const wlo = [Infinity, Infinity, Infinity], whi = [-Infinity, -Infinity, -Infinity];
  let bad = 0;
  for (let i = 0; i < s.length / 4; i++) {
    const p = [s[i * 4], s[i * 4 + 1], s[i * 4 + 2]];
    if (!p.every(Number.isFinite)) { bad++; continue; }
    p.forEach((v, k) => { lo[k] = Math.min(lo[k], v); hi[k] = Math.max(hi[k], v); });
    toLocal(id, ...p).forEach((v, k) => { wlo[k] = Math.min(wlo[k], v); whi[k] = Math.max(whi[k], v); });
  }
  const f = (a) => a.map((v) => v.toFixed(2)).join(', ');
  const mid = lo.map((v, k) => ((v + hi[k]) / 2).toFixed(2));
  console.log(`${id.padEnd(10)} attractor [${f(lo)}] → [${f(hi)}]  mid (${mid})${bad ? `  ${bad} non-finite!` : ''}`);
  console.log(`${''.padEnd(10)} world     x ${wlo[0].toFixed(1)}…${whi[0].toFixed(1)}  y ${wlo[1].toFixed(1)}…${whi[1].toFixed(1)}  depth ${wlo[2].toFixed(1)}…${whi[2].toFixed(1)}`);
}
