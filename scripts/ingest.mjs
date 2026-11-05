// `npm run ingest -- <command>` — fill mechanical fields from reference data,
// so hand-typing is reserved for scholarship. Requires `npm run fetch-raw`.
//
//   readings            refresh readings + structure for every anchor from Unihan / IDS
//   add <char> <id> [realm]
//                       scaffold src/data/anchors/<id>.json (status WORKING, empty
//                       satellites) and, if a realm is named, list it in that realm
//
// Values copied from the database are marked verification "source". Anything
// the database lacks is never invented: an existing `extra` entry is kept, and
// stays marked as unverified.
import { DatabaseSync } from 'node:sqlite';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const ROOT = new URL('../', import.meta.url).pathname;
const DB = ROOT + 'data-raw/moji.db';
if (!existsSync(DB)) {
  console.error('No data-raw/moji.db — run `npm run fetch-raw` first.');
  process.exit(1);
}
const db = new DatabaseSync(DB, { readOnly: true });
const UNIHAN_VERSION = (readFileSync(ROOT + 'data-raw/package/download.txt', 'utf8').match(/Public\/([\d.]+)\/ucd\/Unihan/) || [])[1] || 'unknown';

const field = (f, ch) => {
  try {
    return db.prepare(`select value from unihan_${f} where UCS = ?`).all(ch).map((r) => r.value);
  } catch {
    return [];
  }
};

// Unihan's Japanese on'yomi are upper-case kunrei-like romaji: DOU, RYOU.
const hepburn = (s) => s.toLowerCase().replace(/ou/g, 'ō').replace(/uu/g, 'ū');

// Revised Romanization of a single Hangul syllable.
const RR_L = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const RR_V = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const RR_T = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
export function romanizeHangul(syl) {
  const c = syl.codePointAt(0) - 0xac00;
  if (c < 0 || c > 11171) return syl;
  return RR_L[Math.floor(c / 588)] + RR_V[Math.floor((c % 588) / 28)] + RR_T[c % 28];
}

const cp = (u) => String.fromCodePoint(parseInt(u.replace('U+', ''), 16));

function idsOf(ch) {
  const rows = db.prepare('select source, IDS from ids where UCS = ?').all(ch);
  // Prefer the decomposition that applies to Traditional (T) usage.
  const row = rows.find((r) => r.source.includes('T')) || rows[0];
  return row ? row.IDS : null;
}

// Components reachable by expanding IDS up to `depth` levels.
function components(ch, depth = 3, seen = new Set()) {
  const ids = idsOf(ch);
  if (!ids || depth === 0) return seen;
  for (const part of [...ids]) {
    if (/[⿰-⿿{}0-9]/.test(part) || part === ch || seen.has(part)) continue;
    seen.add(part);
    components(part, depth - 1, seen);
  }
  return seen;
}

function lookup(ch) {
  const ko = field('kHangul', ch).flatMap((v) => v.split(' ')).map((v) => v.split(':')[0]);
  const ja = field('kJapaneseOn', ch).flatMap((v) => v.split(' ')).map(hepburn);
  const simp = field('kSimplifiedVariant', ch).flatMap((v) => v.split(' ')).map(cp).filter((s) => s !== ch);
  const out = {
    cmn: field('kMandarin', ch).join(', ') || undefined,
    yue: field('kCantonese', ch).join(', ') || undefined,
    ja: ja.join(', ') || undefined,
    ko: ko.map((h) => `${h} ${romanizeHangul(h)}`).join(', ') || undefined,
    vi: field('kVietnamese', ch).join(', ') || undefined,
    fanqie: field('kFanqie', ch).flatMap((v) => v.split(' ')).map((f) => f + '切').join(', ') || undefined,
  };
  // `parts`: two levels deep, common characters only — what a reader can see and
  // every font can draw (no description operators, strokes or rare extensions).
  const STROKES = new Set([...'一丨丶丿乙亅乚丆丷']);
  const parts = [...components(ch, 2)].filter((p) => /^[\u4E00-\u9FFF]$/u.test(p) && !STROKES.has(p));
  return { readings: out, simplified: simp[0], definition: field('kDefinition', ch)[0], ids: idsOf(ch), parts, components: [...components(ch)] };
}

const order = ['source', 'version', 'status', 'verification', 'cmn', 'yue', 'ja', 'ko', 'vi', 'fanqie', 'extra', 'extraNote'];
const sortKeys = (o) => Object.fromEntries(order.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]));

const [cmd, ...args] = process.argv.slice(2);
const anchorPath = (id) => `${ROOT}src/data/anchors/${id}.json`;

if (cmd === 'readings') {
  const realms = JSON.parse(readFileSync(ROOT + 'src/data/realms.json', 'utf8'));
  for (const id of realms.flatMap((r) => r.anchors)) {
    const a = JSON.parse(readFileSync(anchorPath(id), 'utf8'));
    const L = lookup(a.glyph);
    const prev = a.readings || {};
    a.readings = sortKeys({
      source: 'unihan',
      version: UNIHAN_VERSION,
      status: prev.status || 'WORKING',
      verification: 'source',
      ...L.readings,
      extra: prev.extra,
      extraNote: prev.extra ? prev.extraNote || 'Readings beyond Unihan’s list; not yet checked.' : undefined,
    });
    if (L.simplified) a.simplified = L.simplified;
    a.structure = { ids: L.ids, parts: L.parts, components: L.components, source: 'mojidata-ids' };
    writeFileSync(anchorPath(id), JSON.stringify(a, null, 2) + '\n');
    console.log(`${a.glyph}  ${Object.entries(L.readings).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join('  ')}  ids=${L.ids}`);
  }
} else if (cmd === 'add') {
  const [ch, id, realmId] = args;
  if (!ch || !id) throw new Error('usage: add <char> <id> [realm]');
  if (existsSync(anchorPath(id))) throw new Error(`${id}.json already exists`);
  const realmsPath = ROOT + 'src/data/realms.json';
  const realms = JSON.parse(readFileSync(realmsPath, 'utf8'));
  const realm = realmId ? realms.find((r) => r.id === realmId) : null;
  if (realmId && !realm) throw new Error(`no realm "${realmId}" in realms.json`);
  if (realms.some((r) => r.anchors.includes(id))) throw new Error(`"${id}" is already listed in a realm`);
  const L = lookup(ch);
  const doc = {
    id,
    key: '',
    glyph: ch,
    ...(L.simplified ? { simplified: L.simplified } : {}),
    pinyin: L.readings.cmn || '',
    gloss: '',
    glossUnihan: L.definition || '',
    form: L.ids || '',
    formNote: '',
    summary: '',
    coords: [0, 0, 0],
    placement: '',
    oc: { form: '', source: 'baxter-sagart-2014', verification: 'unchecked' },
    readings: sortKeys({ source: 'unihan', version: UNIHAN_VERSION, status: 'WORKING', verification: 'source', ...L.readings }),
    structure: { ids: L.ids, parts: L.parts, components: L.components, source: 'mojidata-ids' },
    satellites: [],
  };
  writeFileSync(anchorPath(id), JSON.stringify(doc, null, 2) + '\n');
  if (realm) {
    realm.anchors.push(id);
    writeFileSync(realmsPath, JSON.stringify(realms, null, 2) + '\n');
  }
  console.log(
    `scaffolded src/data/anchors/${id}.json${realm ? ` in realm ${realm.id}` : ''} — write key, gloss, form, summary, coords, placement, oc` +
      (realm ? '; then import it in src/data/index.js.' : '; then list it in a realm.')
  );
} else {
  console.log('commands: readings | add <char> <id> [realm]');
}
