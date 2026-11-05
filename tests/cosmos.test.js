// The solar-systems engine: realms, attractors, layout and routing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ANCHORS, ANCHOR_REALM, BRIDGES, REALMS, anchorsOf, validateData } from '../src/data/index.js';
import { ATTRACTOR_IDS } from '../src/data/vocab.js';
import { ATTRACTORS, sampleSystem, toLocal } from '../src/scene/attractors.js';
import { sampleAttractor, toWorld } from '../src/scene/lorenz.js';
import { buildLayout } from '../src/scene/layout.js';
import { formatHash, parseHash } from '../src/lib/route.js';

test('the data contract holds', () => {
  const { errors } = validateData();
  assert.deepEqual(errors, []);
});

test('the checker and the scene agree on which attractors exist', () => {
  assert.deepEqual([...ATTRACTOR_IDS].sort(), Object.keys(ATTRACTORS).sort());
});

test('every attractor integrates to finite, bounded samples', () => {
  for (const id of Object.keys(ATTRACTORS)) {
    const s = sampleSystem(id, 4000);
    for (let i = 0; i < s.length; i++) assert.ok(Number.isFinite(s[i]), `${id} sample ${i}`);
    for (let i = 0; i < 4000; i++) {
      const w = toLocal(id, s[i * 4], s[i * 4 + 1], s[i * 4 + 2]);
      assert.ok(Math.abs(w[0]) < 40 && Math.abs(w[1]) < 40 && Math.abs(w[2]) < 40, `${id} stays within its frame`);
    }
  }
});

test('the Pillars are laid out exactly as in v1.0', () => {
  // v1.0 sampled Lorenz with lorenz.js and placed every star at toWorld(lorenz).
  const a = sampleAttractor({ samples: 500 });
  const b = sampleSystem('lorenz', 500);
  assert.deepEqual([...a], [...b]);
  const L = buildLayout();
  for (const anchor of anchorsOf('pillars')) {
    const want = toWorld(...anchor.lorenz);
    const got = L.anchors[anchor.id].pos.toArray();
    assert.deepEqual(got, want, anchor.id);
  }
  assert.deepEqual(REALMS[0].position, [0, 0, 0]);
});

test('every anchor belongs to exactly one realm, and each realm has its keys 1…n', () => {
  for (const a of ANCHORS) assert.ok(ANCHOR_REALM[a.id], a.id);
  for (const r of REALMS) {
    const keys = anchorsOf(r.id).map((a) => a.key).sort();
    assert.deepEqual(keys, anchorsOf(r.id).map((_, i) => String(i + 1)).sort(), r.id);
  }
});

test('routes: new scheme round-trips', () => {
  const cases = [
    [{ level: 'cosmos' }, '#/cosmos'],
    [{ level: 'system', realmId: 'pillars' }, '#/pillars'],
    [{ level: 'system', realmId: 'ground' }, '#/ground'],
    [{ level: 'star', anchorId: 'kong' }, '#/ground/kong'],
    [{ level: 'connection', anchorId: 'dao', edgeId: 'dao-marga' }, '#/pillars/dao/dao-marga'],
    [{ level: 'connection', anchorId: 'yi', edgeId: 'bridge-dao-yi' }, '#/ground/yi/bridge-dao-yi'],
  ];
  for (const [route, hash] of cases) {
    assert.equal(formatHash(route), hash);
    const back = parseHash(hash);
    assert.equal(back.level, route.level);
    assert.equal(formatHash(back), hash);
  }
});

test('routes: every v1.0 link still resolves to what it showed', () => {
  assert.deepEqual(parseHash('#/'), { level: 'system', realmId: 'pillars', anchorId: null, edgeId: null });
  assert.deepEqual(parseHash(''), { level: 'system', realmId: 'pillars', anchorId: null, edgeId: null });
  // v1.0 formatted #/<anchor> and #/<anchor>/<edge> for every anchor and edge.
  for (const a of anchorsOf('pillars')) {
    assert.deepEqual(parseHash(`#/${a.id}`), { level: 'star', realmId: 'pillars', anchorId: a.id, edgeId: null });
    for (const s of a.satellites) assert.deepEqual(parseHash(`#/${a.id}/${s.id}`), { level: 'connection', realmId: 'pillars', anchorId: a.id, edgeId: s.id });
  }
  for (const b of BRIDGES.filter((x) => ANCHOR_REALM[x.from] === 'pillars' && ANCHOR_REALM[x.to] === 'pillars')) {
    assert.equal(parseHash(`#/${b.from}/${b.id}`).edgeId, b.id);
    assert.equal(parseHash(`#/${b.to}/${b.id}`).anchorId, b.to);
  }
  // Satellites folded into bridges (2026-11-04) keep their v1.0 links.
  assert.deepEqual(parseHash('#/wu/wu-you'), { level: 'connection', realmId: 'pillars', anchorId: 'wu', edgeId: 'bridge-you-wu' });
  assert.deepEqual(parseHash('#/dao/dao-ziran'), { level: 'connection', realmId: 'pillars', anchorId: 'dao', edgeId: 'bridge-fa-dao' });
  assert.deepEqual(parseHash('#/ming/ming-shi'), { level: 'connection', realmId: 'ground', anchorId: 'ming', edgeId: 'bridge-ming-shi' });
  assert.equal(parseHash('#/words/shi-real').anchorId, 'shi-real');
  assert.equal(parseHash('#/xin/xin-mencius').edgeId, 'bridge-ren-xin');
  assert.equal(parseHash('#/virtues/ren-humane').realmId, 'virtues');
  // A mismatched realm segment is corrected by the anchor, never an error.
  assert.equal(parseHash('#/ground/dao').realmId, 'pillars');
  // Unknown segments fall back gracefully.
  assert.equal(parseHash('#/nowhere').level, 'system');
});
