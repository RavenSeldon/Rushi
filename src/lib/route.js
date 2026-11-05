import { ANCHOR_MAP, ANCHOR_REALM, COSMOS, EDGE_MAP, FOLDED, REALMS, REALM_MAP } from '../data/index.js';

// URL scheme (shareable, back-button friendly), one level per segment:
//   #/cosmos                         every system at once
//   #/<realm>                        one solar system          #/pillars
//   #/<realm>/<anchor>               one star's constellation  #/pillars/dao
//   #/<realm>/<anchor>/<edge>        one claim, read from it   #/pillars/dao/dao-marga
//
// Links from before realms still resolve, because every anchor id is unique
// across realms:
//   #/                → the first system (the Pillars), as in v1.0
//   #/dao             → #/pillars/dao
//   #/dao/dao-marga   → #/pillars/dao/dao-marga
//
// A route is { level, realmId, anchorId, edgeId }, level being one of
// 'cosmos' | 'system' | 'star' | 'connection'.
const decode = (p) => {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
};

export function parseHash(hash = '') {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decode);
  const firstRealm = REALMS[0].id;
  if (parts[0] === COSMOS) return { level: 'cosmos', realmId: null, anchorId: null, edgeId: null };

  let realmId = null;
  if (REALM_MAP[parts[0]]) realmId = parts.shift();

  let anchorId = ANCHOR_MAP[parts[0]] ? parts[0] : null;
  // A claim folded into a bridge is found under its new id.
  const edge = EDGE_MAP[parts[1]] || EDGE_MAP[FOLDED[parts[1]]] || null;
  // An edge read from an anchor it does not touch is read from its own anchor.
  if (edge && edge.from !== anchorId && edge.to !== anchorId) anchorId = edge.from;
  // The anchor decides the realm; a mismatched realm segment is corrected.
  if (anchorId) realmId = ANCHOR_REALM[anchorId];
  if (!realmId) realmId = firstRealm;

  const edgeId = edge ? edge.id : null;
  const level = edgeId ? 'connection' : anchorId ? 'star' : 'system';
  return { level, realmId, anchorId, edgeId };
}

export function formatHash({ level, realmId, anchorId, edgeId } = {}) {
  if (level === 'cosmos') return `#/${COSMOS}`;
  const realm = (anchorId && ANCHOR_REALM[anchorId]) || realmId || REALMS[0].id;
  if (!anchorId) return `#/${realm}`;
  return edgeId ? `#/${realm}/${anchorId}/${edgeId}` : `#/${realm}/${anchorId}`;
}
