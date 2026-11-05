// ============================================================================
// The knowledge layer. Data lives in JSON (one file per anchor, plus bridges,
// sources and realms); this module assembles lookups and validates them.
// Schema: docs/SCHEMA.md. Vocabulary: vocab.js. Run `npm run check`.
// ============================================================================
import realms from './realms.json' with { type: 'json' };
import SOURCES from './sources.json' with { type: 'json' };
import BRIDGES from './bridges.json' with { type: 'json' };
import dao from './anchors/dao.json' with { type: 'json' };
import wu from './anchors/wu.json' with { type: 'json' };
import wei from './anchors/wei.json' with { type: 'json' };
import ai from './anchors/ai.json' with { type: 'json' };
import bu from './anchors/bu.json' with { type: 'json' };
import er from './anchors/er.json' with { type: 'json' };
import liang from './anchors/liang.json' with { type: 'json' };
import si from './anchors/si.json' with { type: 'json' };
// Realm II — The Ground
import you from './anchors/you.json' with { type: 'json' };
import kong from './anchors/kong.json' with { type: 'json' };
import xin from './anchors/xin.json' with { type: 'json' };
import fa from './anchors/fa.json' with { type: 'json' };
import yi from './anchors/yi.json' with { type: 'json' };
import ci from './anchors/ci.json' with { type: 'json' };
import bei from './anchors/bei.json' with { type: 'json' };
import ming from './anchors/ming.json' with { type: 'json' };
// Realm III — Words of Power
import ru from './anchors/ru.json' with { type: 'json' };
import shiReal from './anchors/shi-real.json' with { type: 'json' };
import zhen from './anchors/zhen.json' with { type: 'json' };
import yan from './anchors/yan.json' with { type: 'json' };
import zhouSpell from './anchors/zhou-spell.json' with { type: 'json' };
import shengSound from './anchors/sheng-sound.json' with { type: 'json' };
import fu from './anchors/fu.json' with { type: 'json' };
import yinSeal from './anchors/yin-seal.json' with { type: 'json' };
// Realm IV — Heaven and Change; Realm V — The Constant Virtues
import tian from './anchors/tian.json' with { type: 'json' };
import di from './anchors/di.json' with { type: 'json' };
import renPerson from './anchors/ren-person.json' with { type: 'json' };
import yinShade from './anchors/yin-shade.json' with { type: 'json' };
import yang from './anchors/yang.json' with { type: 'json' };
import qi from './anchors/qi.json' with { type: 'json' };
import yiChange from './anchors/yi-change.json' with { type: 'json' };
import shiTime from './anchors/shi-time.json' with { type: 'json' };
import de from './anchors/de.json' with { type: 'json' };
import renHumane from './anchors/ren-humane.json' with { type: 'json' };
import yiRight from './anchors/yi-right.json' with { type: 'json' };
import liRite from './anchors/li-rite.json' with { type: 'json' };
import zhiWisdom from './anchors/zhi-wisdom.json' with { type: 'json' };
import xinTrust from './anchors/xin-trust.json' with { type: 'json' };
import xiao from './anchors/xiao.json' with { type: 'json' };
import zhong from './anchors/zhong.json' with { type: 'json' };
import { EDGE_TYPES } from './edgeTypes.js';
import { ATTRACTOR_IDS, DIMENSIONS, MECHANISMS, PERIODS, STATUSES, VERIFICATION } from './vocab.js';

// Every anchor file must be imported here (Vite and Node both read this
// module, so no globbing). A realm that lists an unimported id fails the check.
const ANCHOR_FILES = {
  dao, wu, wei, ai, bu, er, liang, si,
  you, kong, xin, fa, yi, ci, bei, ming,
  ru, 'shi-real': shiReal, zhen, yan, 'zhou-spell': zhouSpell, 'sheng-sound': shengSound, fu, 'yin-seal': yinSeal,
  tian, di, 'ren-person': renPerson, 'yin-shade': yinShade, yang, qi, 'yi-change': yiChange, 'shi-time': shiTime, de, 'ren-humane': renHumane, 'yi-right': yiRight, 'li-rite': liRite, 'zhi-wisdom': zhiWisdom, 'xin-trust': xinTrust, xiao, zhong,
};

export const REALMS = realms;
export const REALM_MAP = Object.fromEntries(realms.map((r) => [r.id, r]));
// Reserved first path segment: #/cosmos is the view of every system at once.
export const COSMOS = 'cosmos';

// ANCHORS: every anchor in every realm, in realm order.
export const ANCHORS = realms.flatMap((r) => r.anchors.map((id) => ANCHOR_FILES[id]));
export const ANCHOR_MAP = Object.fromEntries(ANCHORS.filter(Boolean).map((a) => [a.id, a]));
// Which realm each anchor belongs to (exactly one; the checker enforces it).
export const ANCHOR_REALM = Object.fromEntries(realms.flatMap((r) => r.anchors.map((id) => [id, r.id])));
export const anchorsOf = (realmId) => (REALM_MAP[realmId]?.anchors || []).map((id) => ANCHOR_MAP[id]).filter(Boolean);

// An anchor's position in its realm's attractor space. The Pillars predate
// realms and keep their field name `lorenz`; every later anchor uses `coords`.
export const coordsOf = (a) => a.coords || a.lorenz;

export { BRIDGES, SOURCES, EDGE_TYPES };
export { PALETTE, EDGE_TYPE_ORDER } from './edgeTypes.js';

// Every relationship, flattened into one lookup: id → edge.
// kind 'satellite': anchor → outside term. kind 'bridge': anchor → anchor.
export const EDGE_MAP = (() => {
  const map = {};
  for (const a of ANCHORS) {
    for (const s of a.satellites) {
      map[s.id] = { ...s, kind: 'satellite', from: a.id, to: null, fromGlyph: a.glyph, toGlyph: s.glyph };
    }
  }
  for (const b of BRIDGES) {
    map[b.id] = {
      ...b,
      kind: 'bridge',
      glyph: b.label,
      lang: b.subtitle,
      fromGlyph: ANCHOR_MAP[b.from]?.glyph,
      toGlyph: ANCHOR_MAP[b.to]?.glyph,
    };
  }
  return map;
})();

// A claim folded into another keeps its old id as an alias, so links to it
// still resolve: { 'wu-you': 'bridge-you-wu', … }.
export const FOLDED = Object.fromEntries(BRIDGES.flatMap((b) => (b.folded || []).map((old) => [old, b.id])));

export const bridgesOf = (anchorId) => BRIDGES.filter((b) => b.from === anchorId || b.to === anchorId);
// A bridge whose two ends live in different solar systems.
export const isCrossRealm = (b) => ANCHOR_REALM[b.from] !== ANCHOR_REALM[b.to];

// "Daodejing, ch. 25" — a citation as a reader sees it.
export function formatCite({ source, locator }) {
  const s = SOURCES[source];
  if (!s) return source;
  return locator ? `${s.title}, ${locator}` : s.title;
}

// ---------------------------------------------------------------------------
// Validation. Returns { errors, warnings, ledger }.
// errors   break the contract and fail `npm run check`
// warnings are known gaps, reported so they stay visible
// ledger   counts of what has actually been verified
// ---------------------------------------------------------------------------
export function validateData() {
  const errors = [];
  const warnings = [];
  const ids = new Set();
  const seen = (id, where) => {
    if (ids.has(id)) errors.push(`duplicate id "${id}" (${where})`);
    ids.add(id);
  };
  const ledger = { claims: 0, byStatus: {}, byVerification: {}, gaps: 0, uncitedSources: [] };
  const usedSources = new Set();

  for (const [id, s] of Object.entries(SOURCES)) {
    if (id.startsWith('$')) continue;
    if (!s.title) errors.push(`source ${id} has no title`);
    if (!['primary', 'scholarship', 'reference', 'dataset'].includes(s.kind)) errors.push(`source ${id} has unknown kind ${s.kind}`);
    if (s.kind === 'dataset' && !s.license) errors.push(`dataset ${id} has no licence`);
  }

  const checkCites = (cites, where) => {
    if (!Array.isArray(cites) || cites.length === 0) errors.push(`${where} cites nothing`);
    for (const c of cites || []) {
      if (!SOURCES[c.source] || c.source.startsWith('$')) errors.push(`${where} cites unknown source "${c.source}"`);
      else usedSources.add(c.source);
    }
  };

  const checkClaim = (c, where) => {
    ledger.claims++;
    if (!EDGE_TYPES[c.type]) errors.push(`${where}: unknown type ${c.type}`);
    if (!DIMENSIONS[c.dimension]) errors.push(`${where}: unknown dimension ${c.dimension}`);
    if (c.mechanism && !MECHANISMS[c.mechanism]) errors.push(`${where}: unknown mechanism ${c.mechanism}`);
    if (c.period && !PERIODS[c.period]) errors.push(`${where}: unknown period ${c.period}`);
    if (!STATUSES[c.status]) errors.push(`${where}: unknown status ${c.status}`);
    if (!VERIFICATION[c.verification]) errors.push(`${where}: unknown verification ${c.verification}`);
    if (c.status === 'OPEN_QUESTION' && !c.statusNote) errors.push(`${where}: an open question must say what is open (statusNote)`);
    if (c.type === 'INTERPRETIVE_SYNTHESIS') {
      if (!c.caveat) errors.push(`${where} is interpretive but carries no caveat`);
      if (c.dimension !== 'interpretation') errors.push(`${where} is interpretive but its dimension is ${c.dimension}`);
    }
    if (c.dimension === 'interpretation' && c.type !== 'INTERPRETIVE_SYNTHESIS') {
      errors.push(`${where}: only an Original Interpretation may live on the interpretation dimension`);
    }
    if (c.type === 'CROSS_LINGUISTIC_LEXICAL' && c.mechanism && c.mechanism !== 'independent_parallel') {
      warnings.push(`${where}: an analogy with mechanism "${c.mechanism}" may really be a translation`);
    }
    checkCites(c.cites, where);
    // The claim's verification must agree with what its citations record.
    const checked = (c.cites || []).filter((x) => x.checked).length;
    const expected = checked === 0 ? null : checked === c.cites.length ? 'source' : 'partial';
    if (expected && c.verification !== expected) errors.push(`${where}: ${checked}/${c.cites.length} citations checked, so verification must be "${expected}"`);
    if (!expected && (c.verification === 'source' || c.verification === 'partial')) errors.push(`${where}: verification "${c.verification}" but no citation records a check`);
    for (const x of c.cites || []) if (x.checked && !(x.checked.on && x.checked.edition)) errors.push(`${where}: a checked citation must record when and against which edition`);
    ledger.citations = (ledger.citations || 0) + (c.cites || []).length;
    ledger.citationsChecked = (ledger.citationsChecked || 0) + checked;
    for (const f of ['glyph', 'title', 'lang', 'evidence']) if (!c[f]) errors.push(`${where} missing ${f}`);
    ledger.byStatus[c.status] = (ledger.byStatus[c.status] || 0) + 1;
    ledger.byVerification[c.verification] = (ledger.byVerification[c.verification] || 0) + 1;
    for (const g of c.gaps || []) {
      ledger.gaps++;
      warnings.push(`${where}: gap — ${g}`);
    }
  };

  // Realms: each has a name, numeral, a known attractor and a cosmos position;
  // every anchor belongs to exactly one realm; ids never collide.
  const realmIds = new Set();
  const member = {};
  for (const r of REALMS) {
    if (realmIds.has(r.id)) errors.push(`duplicate realm id "${r.id}"`);
    realmIds.add(r.id);
    if (r.id === COSMOS) errors.push(`realm id "${COSMOS}" is reserved for the cosmos view`);
    for (const f of ['name', 'numeral']) if (!r[f]) errors.push(`realm ${r.id} missing ${f}`);
    if (!ATTRACTOR_IDS.includes(r.attractor)) errors.push(`realm ${r.id}: unknown attractor "${r.attractor}"`);
    if (!Array.isArray(r.position) || r.position.length !== 3 || !r.position.every(Number.isFinite)) errors.push(`realm ${r.id} needs position [x,y,z]`);
    const keysHere = new Set();
    for (const id of r.anchors) {
      if (!ANCHOR_FILES[id]) errors.push(`realm ${r.id} lists "${id}", which has no imported anchor file`);
      if (member[id]) errors.push(`anchor ${id} is listed in both ${member[id]} and ${r.id}`);
      member[id] = r.id;
      const a = ANCHOR_FILES[id];
      if (!a) continue;
      // Number keys 1–8 select a star within the current system.
      if (!a.key || keysHere.has(a.key)) errors.push(`anchor ${id}: key "${a.key}" missing or repeated in realm ${r.id}`);
      keysHere.add(a.key);
      if (r.attractor === 'lorenz' ? !(a.coords || a.lorenz) : !a.coords) errors.push(`anchor ${id} needs coords [x,y,z] in ${r.attractor} space`);
    }
  }
  for (const id of Object.keys(ANCHOR_FILES)) if (!member[id]) warnings.push(`anchor file ${id} is imported but listed in no realm`);
  for (const id of Object.keys(member)) if (realmIds.has(id)) errors.push(`anchor id "${id}" collides with a realm id`);

  for (const a of ANCHORS) {
    if (!a) continue;
    seen(a.id, 'anchor');
    for (const f of ['glyph', 'pinyin', 'gloss', 'form', 'summary', 'placement']) if (!a[f]) errors.push(`anchor ${a.id} missing ${f}`);
    if (!a.oc?.form || !SOURCES[a.oc.source]) errors.push(`anchor ${a.id}: oc needs a form and a known source`);
    if (a.readings && !SOURCES[a.readings.source]) errors.push(`anchor ${a.id}: readings cite unknown source`);
    if (a.readings) usedSources.add(a.readings.source);
    if (a.readings && !VERIFICATION[a.readings.verification]) errors.push(`anchor ${a.id}: readings verification unknown`);
    if (a.oc && !VERIFICATION[a.oc.verification]) errors.push(`anchor ${a.id}: oc verification unknown`);
    if (a.structure) {
      if (!SOURCES[a.structure.source]) errors.push(`anchor ${a.id}: structure cites unknown source`);
      usedSources.add(a.structure.source);
    }
    if (a.oc) usedSources.add(a.oc.source);
    const xyz = coordsOf(a);
    if (!Array.isArray(xyz) || xyz.length !== 3 || !xyz.every(Number.isFinite)) errors.push(`anchor ${a.id} needs coords [x,y,z]`);
    for (const s of a.satellites) {
      seen(s.id, `satellite of ${a.id}`);
      checkClaim(s, `satellite ${s.id}`);
    }
  }
  for (const b of BRIDGES) {
    seen(b.id, 'bridge');
    if (!ANCHOR_MAP[b.from]) errors.push(`bridge ${b.id}: unknown from "${b.from}"`);
    if (!ANCHOR_MAP[b.to]) errors.push(`bridge ${b.id}: unknown to "${b.to}"`);
    if (b.from === b.to) errors.push(`bridge ${b.id} joins an anchor to itself`);
    if (ANCHOR_MAP[b.from] && ANCHOR_MAP[b.to] && isCrossRealm(b)) ledger.crossRealm = (ledger.crossRealm || 0) + 1;
    checkClaim({ ...b, glyph: b.label, lang: b.subtitle }, `bridge ${b.id}`);
  }
  for (const [old, to] of Object.entries(FOLDED)) if (ids.has(old)) errors.push(`folded id "${old}" (now ${to}) is still in use`);
  ledger.uncitedSources = Object.keys(SOURCES).filter((k) => !k.startsWith('$') && !usedSources.has(k));
  for (const k of ledger.uncitedSources) warnings.push(`source ${k} is registered but nothing cites it`);
  return { errors, warnings, ledger };
}
