import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ANCHOR_MAP, BRIDGES, COMPOUNDS, EDGE_MAP, EDGE_TYPES, EDGE_TYPE_ORDER, GRAPH_EDGES, RELATIONS, validateData } from '../src/data/index.js';
import { parseHash, formatHash } from '../src/lib/route.js';
import { chainStrength, findChain } from '../src/lib/claims.js';
import { citationUrl, webUrl } from '../src/lib/citations.js';

test('compound routes round-trip and invalid compounds fall back safely', () => {
  for (const c of COMPOUNDS) {
    const hash = formatHash({ compoundId: c.id });
    const route = parseHash(hash);
    assert.equal(route.compoundId, c.id);
    assert.equal(formatHash(route), hash);
    assert.equal(route.anchorId, c.components[0]);
  }
  assert.equal(parseHash('#/wu/wuwei-daoist').compoundId, 'wuwei');
  assert.equal(parseHash('#/ci/ci-sanbao').edgeId, 'bridge-dao-ci');
  assert.equal(parseHash('#/compounds/missing').level, 'system');
  assert.equal(parseHash('#/compounds/%E0%A4%A').level, 'system');
});

test('Maitrādvaita reaches 不二, never a false 愛–二 shortcut', () => {
  const relation = RELATIONS.find((r) => r.id === 'bridge-ai-er');
  assert.equal(relation.to, 'buer');
  assert.equal(relation.type, 'INTERPRETIVE_SYNTHESIS');
  // Ben closed the wording question on 2026-11-05 (CANON). Whatever its status,
  // it stays a declared interpretation with its caveat.
  assert.ok(['OPEN_QUESTION', 'CANON'].includes(relation.status));
  assert.ok(relation.caveat && relation.dimension === 'interpretation');
  assert.ok(!BRIDGES.some((b) => b.id === relation.id));
  assert.ok(!ANCHOR_MAP.ai.satellites.some((s) => s.id === 'ai-maitradvaita'));
  for (const hash of ['#/ai/bridge-ai-er', '#/er/bridge-ai-er', '#/ai/ai-maitradvaita']) {
    const r = parseHash(hash);
    assert.equal(r.edgeId, relation.id);
    assert.equal(r.anchorId, 'ai');
  }
  const path = findChain('ai', 'buer', GRAPH_EDGES);
  assert.deepEqual(path.map((e) => e.id), [relation.id]);
  assert.equal(chainStrength(path).tier, 'proposed');
  const membership = findChain('bu', 'buer', GRAPH_EDGES);
  assert.equal(membership[0].kind, 'membership');
  assert.equal(chainStrength(membership).includesMembership, true);
});

test('compound validation rejects broken senses, spelling, and relation endpoints', () => {
  const c = COMPOUNDS[0], oldSense = c.senses[0], glyph = c.glyph;
  try {
    c.senses[0] = 'missing';
    assert.ok(validateData().errors.some((s) => s.includes('invalid senses')));
    c.senses[0] = oldSense;
    c.glyph = '假';
    assert.ok(validateData().errors.some((s) => s.includes('spelling')));
  } finally { c.senses[0] = oldSense; c.glyph = glyph; }
  const r = RELATIONS[0], target = r.to;
  try {
    r.to = 'er';
    assert.ok(validateData().errors.some((s) => s.includes('expected anchor → compound')));
  } finally { r.to = target; }
});

test('six main hues preserve readable text and explicit structural subtypes', () => {
  assert.equal(EDGE_TYPE_ORDER.length, 6);
  assert.equal(new Set(Object.values(EDGE_TYPES).map((t) => t.color)).size, 6);
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/../g).map((s) => parseInt(s, 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const t of Object.values(EDGE_TYPES)) {
    assert.ok((luminance(t.textColor) + 0.05) / (luminance('#05060B') + 0.05) >= 4.5, t.id);
    assert.ok(t.label && t.pattern);
  }
});

test('edition descriptions and unsafe schemes never become citation links', () => {
  assert.equal(webUrl('Mojidata IDS via @mandel59/mojidata@1.9.3'), null);
  assert.equal(webUrl('https://ctext.org/analects (opened 2026-11-04)'), null);
  assert.equal(webUrl('javascript:alert(1)'), null);
  assert.equal(citationUrl({ url: 'https://example.org/passage' }, { url: 'https://example.org/' }), 'https://example.org/passage');
  assert.equal(citationUrl({}, { url: 'https://example.org/' }), 'https://example.org/');
});

test('relation types do not silently certify unchecked citations', () => {
  assert.equal(chainStrength([{ type: 'TEXTUAL_CONNECTION', status: 'CANON', verification: 'unchecked' }]).includesUnverified, true);
  assert.equal(chainStrength([{ type: 'TEXTUAL_CONNECTION', status: 'WORKING', verification: 'source' }]).includesUnverified, false);
  for (const id of ['wuwei-daoist', 'wuliang-four', 'bridge-bu-wu', 'bridge-dao-ci']) assert.equal(EDGE_MAP[id].status, 'WORKING');
  assert.notEqual(EDGE_MAP['ai-jianai'].type, 'ETYMOLOGICAL_SINITIC');
});
