import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chainStrength, findChain, tierOf } from '../src/lib/claims.js';
import { BRIDGES, ANCHORS, ANCHOR_MAP, EDGE_TYPES, REALM_MAP } from '../src/data/index.js';
import { TYPE_TIER, CLAIM_TIERS } from '../src/data/vocab.js';

test('every claim type has a tier', () => {
  for (const t of Object.keys(EDGE_TYPES)) assert.ok(TYPE_TIER[t], t);
});

test('a chain is never stronger than its weakest link', () => {
  const types = Object.keys(TYPE_TIER);
  // every ordered pair and triple of types
  for (const a of types) for (const b of types) for (const c of types) {
    const chain = [a, b, c].map((type) => ({ type, status: 'CANON' }));
    const s = chainStrength(chain);
    const min = Math.min(...[a, b, c].map((t) => CLAIM_TIERS[tierOf(t)].rank));
    assert.equal(CLAIM_TIERS[s.tier].rank, min);
    for (const t of [a, b, c]) assert.ok(s.kinds.includes(t), 'chain must list every kind it passed through');
  }
});

test('one analogy makes a documented chain comparative; one interpretation makes it proposed', () => {
  assert.equal(chainStrength([{ type: 'CANONICAL_TRANSLATION' }, { type: 'CROSS_LINGUISTIC_LEXICAL' }]).tier, 'comparative');
  assert.equal(chainStrength([{ type: 'CANONICAL_TRANSLATION' }, { type: 'INTERPRETIVE_SYNTHESIS' }]).tier, 'proposed');
});

test('unsettled links are flagged', () => {
  assert.equal(chainStrength([{ type: 'CANONICAL_TRANSLATION', status: 'OPEN_QUESTION' }]).includesUnsettled, true);
});

test('pathfinding over the real bridges', () => {
  const chain = findChain('dao', 'si', BRIDGES);
  assert.deepEqual(chain.map((b) => b.id), ['bridge-dao-wu', 'bridge-wu-liang', 'bridge-liang-si']);
  assert.equal(chainStrength(chain).tier, 'proposed'); // 量 ↔ 司 is an interpretation
  // In v1.0 the Pillars were two islands: 不 二 愛 did not connect to 道 無 為 量 司.
  // Realm II joins them through 一 (Daodejing ch. 42: 道生一，一生二).
  const joined = findChain('dao', 'bu', BRIDGES);
  assert.deepEqual(joined.map((b) => b.id), ['bridge-dao-yi', 'bridge-yi-er', 'bridge-bu-er']);
  assert.equal(chainStrength(joined).tier, 'documented');
  assert.equal(chainStrength(joined).includesUnsettled, true); // the 一 bridges are WORKING
  assert.ok(ANCHORS.length >= 8);
});

test('every new claim enters as WORKING until the author accepts it', () => {
  // Realms II and III were drafted by Baracus; nothing in them may claim to be CANON yet.
  for (const realm of ['ground', 'words']) for (const id of REALM_MAP[realm].anchors) for (const s of ANCHOR_MAP[id].satellites) assert.equal(s.status, 'WORKING', s.id);
  for (const b of BRIDGES) if (b.drafted === 'Baracus') assert.equal(b.status, 'WORKING', b.id);
});
