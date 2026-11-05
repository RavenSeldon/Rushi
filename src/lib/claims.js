// ============================================================================
// The weakest-link rule. A chain of connections is only as strong as its
// weakest claim: one analogy makes the whole chain "at most comparative",
// one interpretation makes it "proposed". The chain also reports every kind
// of claim it passed through, so "documented" never hides that a link was,
// say, an astrological correspondence.
// ============================================================================
import { CLAIM_TIERS, TYPE_TIER } from '../data/vocab.js';

export function tierOf(type) {
  const tier = TYPE_TIER[type];
  if (!tier) throw new Error(`no tier for claim type ${type}`);
  return tier;
}

export function chainStrength(edges) {
  if (!edges.length) return null;
  let weakest = null;
  const kinds = [];
  for (const e of edges) {
    const t = tierOf(e.type);
    if (!kinds.includes(e.type)) kinds.push(e.type);
    if (!weakest || CLAIM_TIERS[t].rank < CLAIM_TIERS[weakest].rank) weakest = t;
  }
  const open = edges.some((e) => e.status && e.status !== 'CANON');
  return { tier: weakest, label: CLAIM_TIERS[weakest].label, kinds, includesUnsettled: open };
}

// Shortest chain between two anchors through bridges (breadth-first).
// Returns the list of bridge edges, or null when the anchors are not joined.
export function findChain(fromId, toId, bridges) {
  if (fromId === toId) return [];
  const prev = new Map([[fromId, null]]);
  const queue = [fromId];
  while (queue.length) {
    const at = queue.shift();
    for (const b of bridges) {
      const next = b.from === at ? b.to : b.to === at ? b.from : null;
      if (!next || prev.has(next)) continue;
      prev.set(next, { via: b, from: at });
      if (next === toId) {
        const path = [];
        for (let n = toId; prev.get(n); n = prev.get(n).from) path.unshift(prev.get(n).via);
        return path;
      }
      queue.push(next);
    }
  }
  return null;
}
