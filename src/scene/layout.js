import { Vector3, QuadraticBezierCurve3 } from 'three';
import { ANCHOR_REALM, BRIDGES, REALMS, anchorsOf, coordsOf } from '../data/index.js';
import { ATTRACTORS, toLocal } from './attractors.js';

const SAT_RX = 6.4;
const SAT_RY = 4.9;

/**
 * Pure spatial layout: data in, positions out. No renderer, no DOM.
 * Every interactive thing in the cosmos gets a world position and a key:
 *   r:<realmId>  a:<anchorId>  s:<satelliteId>  b:<bridgeId>
 *
 * Each realm (solar system) has its own local frame, drawn from its
 * attractor, placed at `position` in the cosmos. The Pillars sit at the
 * origin, so their layout is exactly what it was before realms existed.
 */
export function buildLayout() {
  const positions = {};
  const anchors = {};
  const realms = {};

  for (const r of REALMS) {
    const A = ATTRACTORS[r.attractor];
    const origin = new Vector3(...r.position);
    const members = anchorsOf(r.id);
    for (const a of members) {
      const local = new Vector3(...toLocal(r.attractor, ...coordsOf(a)));
      const pos = local.clone().add(origin);
      // Each constellation is viewed from slightly above and to its own side,
      // so the ring of satellites always faces the reader.
      const viewDir = new Vector3(local.x * 0.012, 0.14, 1).normalize();
      const right = new Vector3().crossVectors(new Vector3(0, 1, 0), viewDir).normalize();
      const up = new Vector3().crossVectors(viewDir, right).normalize();

      const n = a.satellites.length;
      const sats = a.satellites.map((s, i) => {
        // Clockwise from 12 o'clock, offset so that no satellite sits directly
        // above or below its star, where bridges tend to run.
        const ang = Math.PI / 2 - ((i + (n % 2 ? 0.25 : 0.5)) / n) * Math.PI * 2;
        const p = pos
          .clone()
          .addScaledVector(right, Math.cos(ang) * SAT_RX)
          .addScaledVector(up, Math.sin(ang) * SAT_RY);
        positions[`s:${s.id}`] = p;
        return { id: s.id, type: s.type, pos: p };
      });

      positions[`a:${a.id}`] = pos;
      anchors[a.id] = { id: a.id, realm: r.id, pos, viewDir, right, up, sats, ringRadius: [SAT_RX, SAT_RY] };
    }

    const centroid = new Vector3();
    members.forEach((a) => centroid.add(anchors[a.id].pos));
    if (members.length) centroid.divideScalar(members.length);
    const look = new Vector3(...A.look).add(origin);
    // The system's name in the cosmos view sits just below its cloud.
    const labelPos = origin.clone().add(new Vector3(0, -A.half.y, 0));
    positions[`r:${r.id}`] = labelPos;
    realms[r.id] = { id: r.id, attractor: r.attractor, origin, look, half: A.half, centroid, labelPos };
  }

  const placed = {}; // bridge labels already placed, per realm
  const bridges = BRIDGES.map((b) => {
    const p0 = anchors[b.from].pos;
    const p1 = anchors[b.to].pos;
    const cross = ANCHOR_REALM[b.from] !== ANCHOR_REALM[b.to];
    const mid = p0.clone().add(p1).multiplyScalar(0.5);
    const span = p0.distanceTo(p1);
    let curve;
    if (cross) {
      // Between systems: a long, high arc, so it reads as a thread across the
      // cosmos rather than a line through either galaxy.
      const ctrl = mid.clone().add(new Vector3(0, Math.min(60, span * 0.28), Math.min(20, span * 0.08)));
      curve = new QuadraticBezierCurve3(p0, ctrl, p1);
      positions[`b:${b.id}`] = curve.getPoint(0.5);
      return { id: b.id, from: b.from, to: b.to, type: b.type, curve, label: positions[`b:${b.id}`], span, cross };
    }
    const centroid = realms[ANCHOR_REALM[b.from]].centroid;
    // Bow each bridge sideways in the picture plane, away from the centre,
    // so it never lies on top of a satellite thread or another bridge.
    const seg = p1.clone().sub(p0);
    const side = new Vector3(-seg.y, seg.x, 0).normalize();
    const away = mid.clone().sub(centroid);
    if (side.dot(away) < 0 || (Math.abs(side.dot(away)) < 1e-3 && side.x < 0)) side.negate();
    const bow = (dir) => new QuadraticBezierCurve3(p0, mid.clone().addScaledVector(dir, span * 0.16).add(new Vector3(0, 0, Math.min(5, span * 0.15))), p1);
    curve = bow(side);
    if (ANCHOR_REALM[b.from] !== REALMS[0].id) {
      // Later realms: bow to whichever side keeps the line further from the
      // other stars and their names. (The first realm keeps v1.0's rule.)
      const others = Object.values(anchors).filter((a) => a.realm === ANCHOR_REALM[b.from] && a.id !== b.from && a.id !== b.to);
      const clearance = (c) => {
        let m = Infinity;
        for (let t = 0.15; t <= 0.851; t += 0.05) {
          const p = c.getPoint(t);
          for (const a of others) m = Math.min(m, Math.hypot(p.x - a.pos.x, p.y - a.pos.y), Math.hypot(p.x - a.pos.x, p.y - a.pos.y + 2.8));
        }
        return m;
      };
      const flipped = bow(side.clone().negate());
      if (clearance(flipped) > clearance(curve) + 0.5) curve = flipped;
    }
    // Put the label where the curve runs furthest from any star of its own
    // system, so it never sits on top of an anchor's own name.
    const realmId = ANCHOR_REALM[b.from];
    const own = Object.values(anchors).filter((a) => a.realm === realmId);
    // The first realm keeps v1.0's rule exactly. Later realms also keep clear
    // of each star's own name (drawn just below it) and of bridge labels
    // already placed, and may search a little further along the curve.
    const careful = realmId !== REALMS[0].id;
    // A star's name sits below it and is wider than it is tall.
    const nameBox = (p) => [[0, -2.8], [-2.4, -2.8], [2.4, -2.8], [0, -4.4]].map(([dx, dy]) => p.clone().add(new Vector3(dx, dy, 0)));
    const avoid = careful ? [...own.map((a) => a.pos), ...own.flatMap((a) => nameBox(a.pos)), ...(placed[realmId] || [])] : own.map((a) => a.pos);
    let label = curve.getPoint(0.5);
    let best = -Infinity;
    const [t0, t1] = careful ? [0.2, 0.801] : [0.3, 0.701];
    for (let t = t0; t <= t1; t += 0.05) {
      const p = curve.getPoint(t);
      let near = Infinity;
      for (const q of avoid) near = Math.min(near, Math.hypot(p.x - q.x, p.y - q.y));
      const score = near - Math.abs(t - 0.5) * 6; // prefer the middle, all else equal
      if (score > best) {
        best = score;
        label = p;
      }
    }
    (placed[realmId] ||= []).push(label);
    positions[`b:${b.id}`] = label;
    return { id: b.id, from: b.from, to: b.to, type: b.type, curve, label, span, cross };
  });

  // The cosmos: every system's centre, and the half-extents that hold them all.
  const cosmosCentre = new Vector3();
  Object.values(realms).forEach((r) => cosmosCentre.add(r.look));
  cosmosCentre.divideScalar(Math.max(1, REALMS.length));
  let hx = 0;
  let hy = 0;
  for (const r of Object.values(realms)) {
    hx = Math.max(hx, Math.abs(r.look.x - cosmosCentre.x) + r.half.x, Math.abs(r.look.z - cosmosCentre.z) * 0.4 + r.half.x);
    hy = Math.max(hy, Math.abs(r.look.y - cosmosCentre.y) + r.half.y);
  }
  const cosmos = { centre: cosmosCentre, half: { x: hx, y: hy } };

  return { anchors, bridges, positions, realms, cosmos };
}
