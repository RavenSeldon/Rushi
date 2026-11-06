// ============================================================================
// The knowledge layer. Data lives in JSON (one file per anchor, plus bridges,
// sources and realms); this module assembles lookups and validates them.
// Schema: docs/SCHEMA.md. Vocabulary: vocab.js. Run `npm run check`.
// ============================================================================
import realms from './realms.json' with { type: 'json' };
import SOURCES from './sources.json' with { type: 'json' };
import BRIDGES from './bridges.json' with { type: 'json' };
import COMPOUNDS from './compounds.json' with { type: 'json' };
import RELATIONS from './relations.json' with { type: 'json' };
import COMPOUND_CLAIMS from './compoundClaims.json' with { type: 'json' };
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
// Realms VI–X — WORKING, proposed content (not author-accepted)
import viX_yiIntent from './anchors/yi-intent.json' with { type: 'json' };
import viX_shiConscious from './anchors/shi-conscious.json' with { type: 'json' };
import viX_nian from './anchors/nian.json' with { type: 'json' };
import viX_jue from './anchors/jue.json' with { type: 'json' };
import viX_wuAwaken from './anchors/wu-awaken.json' with { type: 'json' };
import viX_ding from './anchors/ding.json' with { type: 'json' };
import viX_hui from './anchors/hui.json' with { type: 'json' };
import viX_siThought from './anchors/si-thought.json' with { type: 'json' };
import viX_jin from './anchors/jin.json' with { type: 'json' };
import viX_mu from './anchors/mu.json' with { type: 'json' };
import viX_shui from './anchors/shui.json' with { type: 'json' };
import viX_huo from './anchors/huo.json' with { type: 'json' };
import viX_tu from './anchors/tu.json' with { type: 'json' };
import viX_feng from './anchors/feng.json' with { type: 'json' };
import viX_lei from './anchors/lei.json' with { type: 'json' };
import viX_shan from './anchors/shan.json' with { type: 'json' };
import viX_guang from './anchors/guang.json' with { type: 'json' };
import viX_mingBright from './anchors/ming-bright.json' with { type: 'json' };
import viX_ri from './anchors/ri.json' with { type: 'json' };
import viX_yue from './anchors/yue.json' with { type: 'json' };
import viX_xing from './anchors/xing.json' with { type: 'json' };
import viX_ye from './anchors/ye.json' with { type: 'json' };
import viX_ying from './anchors/ying.json' with { type: 'json' };
import viX_zhao from './anchors/zhao.json' with { type: 'json' };
import viX_qiu from './anchors/qiu.json' with { type: 'json' };
import viX_wen from './anchors/wen.json' with { type: 'json' };
import viX_xun from './anchors/xun.json' with { type: 'json' };
import viX_xue from './anchors/xue.json' with { type: 'json' };
import viX_tan from './anchors/tan.json' with { type: 'json' };
import viX_xingWalk from './anchors/xing-walk.json' with { type: 'json' };
import viX_lu from './anchors/lu.json' with { type: 'json' };
import viX_men from './anchors/men.json' with { type: 'json' };
import viX_shengLife from './anchors/sheng-life.json' with { type: 'json' };
import viX_hua from './anchors/hua.json' with { type: 'json' };
import viX_cheng from './anchors/cheng.json' with { type: 'json' };
import viX_bian from './anchors/bian.json' with { type: 'json' };
import viX_chang from './anchors/chang.json' with { type: 'json' };
import viX_shiBegin from './anchors/shi-begin.json' with { type: 'json' };
import viX_zhongEnd from './anchors/zhong-end.json' with { type: 'json' };
import viX_siDeath from './anchors/si-death.json' with { type: 'json' };
import xiXiii_e from './anchors/e.json' with { type: 'json' };
import xiXiii_gui from './anchors/gui.json' with { type: 'json' };
import xiXiii_hun from './anchors/hun.json' with { type: 'json' };
import xiXiii_po from './anchors/po.json' with { type: 'json' };
import xiXiii_tanGreed from './anchors/tan-greed.json' with { type: 'json' };
import xiXiii_ke from './anchors/ke.json' with { type: 'json' };
import xiXiii_shiGive from './anchors/shi-give.json' with { type: 'json' };
import xiXiii_shiFood from './anchors/shi-food.json' with { type: 'json' };
import xiXiii_weiNotyet from './anchors/wei-notyet.json' with { type: 'json' };
import xiXiii_lai from './anchors/lai.json' with { type: 'json' };
import xiXiii_jiang from './anchors/jiang.json' with { type: 'json' };
import xiXiii_hou from './anchors/hou.json' with { type: 'json' };
import xiXiii_wang from './anchors/wang.json' with { type: 'json' };
import xiXiii_meng from './anchors/meng.json' with { type: 'json' };
import xiXiii_mingFate from './anchors/ming-fate.json' with { type: 'json' };
import xiXiii_jie from './anchors/jie.json' with { type: 'json' };
import xiXiii_yuSpace from './anchors/yu-space.json' with { type: 'json' };
import xiXiii_zhouEon from './anchors/zhou-eon.json' with { type: 'json' };
import xiXiii_jiStill from './anchors/ji-still.json' with { type: 'json' };
import xiXiii_gu from './anchors/gu.json' with { type: 'json' };
import xiXiii_yuan from './anchors/yuan.json' with { type: 'json' };
import xiXiii_ta from './anchors/ta.json' with { type: 'json' };
import xiXiii_shei from './anchors/shei.json' with { type: 'json' };
import xiXiii_ting from './anchors/ting.json' with { type: 'json' };
import { webUrl } from '../lib/citations.js';
import { EDGE_TYPES } from './edgeTypes.js';
import { ATTRACTOR_IDS, DIMENSIONS, MECHANISMS, PERIODS, STATUSES, VERIFICATION } from './vocab.js';

// Every anchor file must be imported here (Vite and Node both read this
// module, so no globbing). A realm that lists an unimported id fails the check.
const ANCHOR_FILES = {
  dao, wu, wei, ai, bu, er, liang, si,
  you, kong, xin, fa, yi, ci, bei, ming,
  ru, 'shi-real': shiReal, zhen, yan, 'zhou-spell': zhouSpell, 'sheng-sound': shengSound, fu, 'yin-seal': yinSeal,
  tian, di, 'ren-person': renPerson, 'yin-shade': yinShade, yang, qi, 'yi-change': yiChange, 'shi-time': shiTime, de, 'ren-humane': renHumane, 'yi-right': yiRight, 'li-rite': liRite, 'zhi-wisdom': zhiWisdom, 'xin-trust': xinTrust, xiao, zhong,
  // Realms VI–X; no existing mapping replaced.
  'yi-intent': viX_yiIntent,
  'shi-conscious': viX_shiConscious,
  'nian': viX_nian,
  'jue': viX_jue,
  'wu-awaken': viX_wuAwaken,
  'ding': viX_ding,
  'hui': viX_hui,
  'si-thought': viX_siThought,
  'jin': viX_jin,
  'mu': viX_mu,
  'shui': viX_shui,
  'huo': viX_huo,
  'tu': viX_tu,
  'feng': viX_feng,
  'lei': viX_lei,
  'shan': viX_shan,
  'guang': viX_guang,
  'ming-bright': viX_mingBright,
  'ri': viX_ri,
  'yue': viX_yue,
  'xing': viX_xing,
  'ye': viX_ye,
  'ying': viX_ying,
  'zhao': viX_zhao,
  'qiu': viX_qiu,
  'wen': viX_wen,
  'xun': viX_xun,
  'xue': viX_xue,
  'tan': viX_tan,
  'xing-walk': viX_xingWalk,
  'lu': viX_lu,
  'men': viX_men,
  'sheng-life': viX_shengLife,
  'hua': viX_hua,
  'cheng': viX_cheng,
  'bian': viX_bian,
  'chang': viX_chang,
  'shi-begin': viX_shiBegin,
  'zhong-end': viX_zhongEnd,
  'si-death': viX_siDeath,
  'e': xiXiii_e,
  'gui': xiXiii_gui,
  'hun': xiXiii_hun,
  'po': xiXiii_po,
  'tan-greed': xiXiii_tanGreed,
  'ke': xiXiii_ke,
  'shi-give': xiXiii_shiGive,
  'shi-food': xiXiii_shiFood,
  'wei-notyet': xiXiii_weiNotyet,
  'lai': xiXiii_lai,
  'jiang': xiXiii_jiang,
  'hou': xiXiii_hou,
  'wang': xiXiii_wang,
  'meng': xiXiii_meng,
  'ming-fate': xiXiii_mingFate,
  'jie': xiXiii_jie,
  'yu-space': xiXiii_yuSpace,
  'zhou-eon': xiXiii_zhouEon,
  'ji-still': xiXiii_jiStill,
  'gu': xiXiii_gu,
  'yuan': xiXiii_yuan,
  'ta': xiXiii_ta,
  'shei': xiXiii_shei,
  'ting': xiXiii_ting,
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

export { BRIDGES, SOURCES, EDGE_TYPES, COMPOUNDS, RELATIONS, COMPOUND_CLAIMS };
export const COMPOUND_MAP = Object.fromEntries(COMPOUNDS.map((c) => [c.id, c]));
export const NODE_MAP = { ...ANCHOR_MAP, ...COMPOUND_MAP };
export const compoundsOf = (id) => COMPOUNDS.filter((c) => c.components.includes(id));
export const relationsOf = (id) => RELATIONS.filter((r) => r.from === id || r.to === id);
// Membership describes written composition only. Keep it separate from semantic
// bridges so pathfinding cannot silently equate a character with a compound.
export const MEMBERSHIPS = COMPOUNDS.flatMap((c) => (c.components || []).map((id) => ({
  id: `member-${c.id}-${id}`, from: id, to: c.id, compound: c.id,
  kind: 'membership', type: 'GRAPHIC_STRUCTURE', status: 'WORKING',
  title: `${ANCHOR_MAP[id]?.glyph || id} is a written component of ${c.glyph}`,
})));
export const GRAPH_EDGES = [...BRIDGES, ...RELATIONS, ...MEMBERSHIPS];
export { PALETTE, EDGE_TYPE_ORDER, EDGE_DETAIL_ORDER } from './edgeTypes.js';

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
  for (const r of RELATIONS) map[r.id] = {
    ...r, kind: 'relation', glyph: r.label, lang: r.subtitle,
    fromGlyph: NODE_MAP[r.from]?.glyph, toGlyph: NODE_MAP[r.to]?.glyph,
  };
  for (const c of COMPOUND_CLAIMS) map[c.id] = { ...c, kind: 'sense' };
  return map;
})();

// A claim folded into another keeps its old id as an alias, so links to it
// still resolve: { 'wu-you': 'bridge-you-wu', … }.
export const FOLDED = Object.fromEntries([...BRIDGES, ...RELATIONS].flatMap((b) => (b.folded || []).map((old) => [old, b.id])));

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
      if (c.url && !webUrl(c.url)) errors.push(`${where}: invalid citation URL`);
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
    if ([COSMOS, 'compounds'].includes(r.id)) errors.push(`realm id "${COSMOS}" is reserved for the cosmos view`);
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
  for (const id of Object.keys(member)) if (realmIds.has(id) || id === 'compounds') errors.push(`anchor id "${id}" collides with a realm id`);

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
  for (const c of COMPOUNDS) {
    seen(c.id, 'compound');
    if (REALM_MAP[c.id] || ['cosmos', 'compounds'].includes(c.id)) errors.push(`compound ${c.id}: reserved id`);
    if (!c.glyph || !c.pinyin || !c.summary) errors.push(`compound ${c.id}: missing display fields`);
    if (!Array.isArray(c.components) || c.components.length < 2 || new Set(c.components).size !== c.components.length || c.components.some((id) => !ANCHOR_MAP[id])) errors.push(`compound ${c.id}: invalid components`);
    if (c.glyph !== (c.components || []).map((id) => ANCHOR_MAP[id]?.glyph || '').join('')) errors.push(`compound ${c.id}: spelling disagrees with components`);
    const bridge = BRIDGES.find((b) => b.id === c.bridge);
    if (!bridge || bridge.compound !== c.id || !c.components.includes(bridge.from) || !c.components.includes(bridge.to)) errors.push(`compound ${c.id}: invalid bridge`);
    if (!c.senses?.length || new Set(c.senses).size !== c.senses.length || c.senses.some((id) => !EDGE_MAP[id] || ['bridge','relation'].includes(EDGE_MAP[id].kind))) errors.push(`compound ${c.id}: invalid senses`);
  }
  for (const c of COMPOUND_CLAIMS) {
    seen(c.id, 'compound sense');
    checkClaim(c, `compound sense ${c.id}`);
    if (!COMPOUNDS.some((compound) => compound.senses.includes(c.id))) errors.push(`compound sense ${c.id}: no owner`);
  }
  for (const r of RELATIONS) {
    seen(r.id, 'relation');
    if (!ANCHOR_MAP[r.from] || !COMPOUND_MAP[r.to] || r.compound !== r.to) errors.push(`relation ${r.id}: expected anchor → compound`);
    checkClaim({ ...r, glyph: r.label, lang: r.subtitle }, `relation ${r.id}`);
  }
  for (const c of [...BRIDGES, ...RELATIONS]) if (c.compound && !COMPOUND_MAP[c.compound]) errors.push(`${c.id}: unknown compound`);
  const aliases = [...BRIDGES, ...RELATIONS].flatMap((b) => b.folded || []);
  if (new Set(aliases).size !== aliases.length) errors.push('duplicate folded alias');
  for (const [old, to] of Object.entries(FOLDED)) if (ids.has(old)) errors.push(`folded id "${old}" (now ${to}) is still in use`);
  ledger.uncitedSources = Object.keys(SOURCES).filter((k) => !k.startsWith('$') && !usedSources.has(k));
  for (const k of ledger.uncitedSources) warnings.push(`source ${k} is registered but nothing cites it`);
  return { errors, warnings, ledger };
}
