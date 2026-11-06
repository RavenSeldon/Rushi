// Baracus, 2026-11-05 (night): Realms XI Hungry Ghosts, XII Future, XIII The Fermi Paradox,
// as planned in docs/cosmos-atlas.html (members, attractors, and its sixteen planned bridges).
// Run from the repo root: node scripts/archive/2026-11-05-xi-xiii.mjs — idempotent; a re-run changes nothing.
// Then: npm run ingest -- readings
import fs from 'fs';
import { pathToFileURL } from 'url';

const ROOT = process.cwd() + '/';
const D = ROOT + 'src/data/', DAY = '2026-11-05';
const rd = (p) => JSON.parse(fs.readFileSync(D + p, 'utf8'));
const wr = (p, j) => fs.writeFileSync(D + p, JSON.stringify(j, null, 2) + '\n');
const CB = (n) => `https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/${n}.xml`;
const CP = (f) => `https://github.com/chinese-poetry/chinese-poetry (${f}; a community digital transcription, not a critical edition)`;
const ck = (edition, note) => ({ on: DAY, edition, note });
const ver = (cites) => { const n = cites.filter((c) => c.checked).length; return n === 0 ? 'unchecked' : n === cites.length ? 'source' : 'partial'; };
const claim = (o) => ({ ...o, status: 'WORKING', verification: ver(o.cites), drafted: 'Baracus', reviewed: DAY });

const KOSA = CB('T29/T29n1558'), JG = CB('T08/T08n0235'), FH = CB('T09/T09n0262'), VK = CB('T14/T14n0475'),
  YL = CB('T16/T16n0685'), YK = CB('T21/T21n1313'), NP = CB('T12/T12n0374');
const LUNYU = CP('論語/lunyu.json, simplified characters'), MENG = CP('四书五经/mengzi.json'),
  ZY = CP('四书五经/zhongyong.json'), CHUCI = CP('楚辞/chuci.json, simplified characters'), SHI = CP('诗经/shijing.json, simplified characters');

// ── 1. Attractors ────────────────────────────────────────────────────────────
const ATTR_SRC = `
  // Realm XI — Newton–Leipnik: rigid-body motion with linear feedback control.
  // a = 0.4, b = 0.175. Two strange attractors coexist; the start below lies in
  // the basin of one of them, and only that one is drawn (as the Atlas planned).
  newton: {
    name: 'Newton–Leipnik',
    citation: 'R. B. Leipnik and T. A. Newton, “Double strange attractors in rigid body motion with linear feedback control”, Phys. Lett. A 86 (1981)',
    params: { a: 0.4, b: 0.175 },
    deriv: (x, y, z) => [-0.4 * x + y + 10 * y * z, -x - 0.4 * y + 5 * x * z, 0.175 * z - 5 * x * y],
    dt: 0.005, transient: 5000, start: [0.349, 0, -0.16],
    map: { cx: 0.11, cy: 0.02, cz: 0.21, s: 27 },
    half: { x: 27, y: 20 }, look: [0, 0.5, 0],
  },
  // Realm XII — Lorenz-84: Lorenz's low-order model of the general circulation.
  // a = 0.25, b = 4, F = 8, G = 1. Seen along x, so the y–z plane faces the viewer.
  lorenz84: {
    name: 'Lorenz-84',
    citation: 'E. N. Lorenz, “Irregularity: a fundamental property of the atmosphere”, Tellus A 36 (1984)',
    params: { a: 0.25, b: 4, F: 8, G: 1 },
    deriv: (x, y, z) => [-y * y - z * z - 0.25 * x + 0.25 * 8, x * y - 4 * x * z - y + 1, 4 * x * y + x * z - z],
    dt: 0.005, transient: 5000, start: [1, 0, 0],
    map: { cx: 0.9, cy: 0.06, cz: 0.05, s: 9.8, basis: [[0, 1, 0], [0, 0, 1], [1, 0, 0]] },
    half: { x: 27, y: 28 }, look: [0, 0.5, 0],
  },
  // Realm XIII — Burke–Shaw: Shaw's variant of the Lorenz equations. s = 10, v = 4.272.
  burkeshaw: {
    name: 'Burke–Shaw',
    citation: 'R. Shaw, “Strange attractors, chaotic behavior, and information flow”, Z. Naturforsch. 36a (1981)',
    params: { s: 10, v: 4.272 },
    deriv: (x, y, z) => [-10 * (x + y), -y - 10 * x * z, 10 * x * y + 4.272],
    dt: 0.002, transient: 5000, start: [1, 0, 0],
    map: { cx: 0, cy: 0, cz: -0.01, s: 11 },
    half: { x: 27, y: 28 }, look: [0, 0.5, 0],
  },
`;
{
  const p = ROOT + 'src/scene/attractors.js';
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes('newton: {')) {
    const at = s.indexOf('\n};', s.indexOf('rabinovich: {'));
    s = s.slice(0, at) + ATTR_SRC + s.slice(at);
    fs.writeFileSync(p, s);
  }
  const v = ROOT + 'src/data/vocab.js';
  let t = fs.readFileSync(v, 'utf8');
  if (!t.includes("'newton'")) fs.writeFileSync(v, t.replace("'arneodo', 'rabinovich']", "'arneodo', 'rabinovich', 'newton', 'lorenz84', 'burkeshaw']"));
}

// ── 2. Systems ───────────────────────────────────────────────────────────────
// Positions found by search (2026-11-05): the cosmos keeps its straight-on bearing
// at 390 px and 1440 px, and no new system name overlaps another.
const NEW_REALMS = [
  { id: 'ghosts', name: 'Hungry Ghosts', numeral: 'XI', attractor: 'newton', position: [190, -240, -340],
    anchors: ['e', 'gui', 'hun', 'po', 'tan-greed', 'ke', 'shi-give', 'shi-food'] },
  { id: 'future', name: 'Future', numeral: 'XII', attractor: 'lorenz84', position: [-40, 305, -470],
    anchors: ['wei-notyet', 'lai', 'jiang', 'hou', 'wang', 'meng', 'ming-fate', 'jie'] },
  { id: 'fermi', name: 'The Fermi Paradox', numeral: 'XIII', attractor: 'burkeshaw', position: [-130, 190, -670],
    anchors: ['yu-space', 'zhou-eon', 'ji-still', 'gu', 'yuan', 'ta', 'shei', 'ting'] },
];
{
  const R = rd('realms.json');
  for (const r of NEW_REALMS) if (!R.some((x) => x.id === r.id)) R.push(r);
  wr('realms.json', R);
}

// ── 3. Sources ───────────────────────────────────────────────────────────────
const SOURCES = {
  ullambana: { kind: 'primary', title: '佛說盂蘭盆經 Ullambana Sutra, attributed to Dharmarakṣa, T685', url: 'https://cbetaonline.dila.edu.tw/T0685' },
  yankou: { kind: 'primary', title: '佛說救拔焰口餓鬼陀羅尼經, tr. Amoghavajra, T1313', date: '8th c.', url: 'https://cbetaonline.dila.edu.tw/T1313' },
  nirvana: { kind: 'primary', title: '大般涅槃經 Mahāparinirvāṇa Sūtra, tr. Dharmakṣema, T374', date: '421 CE', url: 'https://cbetaonline.dila.edu.tw/T0374' },
  zuozhuan: { kind: 'primary', title: '左傳 Zuozhuan', url: 'https://ctext.org/chun-qiu-zuo-zhuan' },
  huainanzi: { kind: 'primary', title: '淮南子 Huainanzi', date: '139 BCE', url: 'https://ctext.org/huainanzi' },
  shizi: { kind: 'primary', title: '尸子 Shizi (fragments)' },
  shishuo: { kind: 'primary', title: '世說新語 Shishuo xinyu, Liu Yiqing', date: '5th c.', url: 'https://ctext.org/shi-shuo-xin-yu' },
  'jones-1985': { kind: 'scholarship', title: 'E. M. Jones, “Where is everybody?” An account of Fermi’s question, Los Alamos report LA-10311-MS', date: '1985' },
};
{ const s = rd('sources.json'); for (const [k, v] of Object.entries(SOURCES)) if (!s[k]) s[k] = v; wr('sources.json', s); }

// ── 4. Anchors ───────────────────────────────────────────────────────────────
const OC = { form: 'not yet researched', source: 'baxter-sagart-2014', verification: 'unchecked', note: 'Placeholder, NOT an Old Chinese reconstruction. Consult Baxter–Sagart 2014 before entering a form.' };
const ANCH = {
  e: ['餓', 'è', 'hunger · starving', 'Hunger past need: to starve. In 餓鬼 it names the preta, the ghost defined by a hunger nothing can fill.'],
  gui: ['鬼', 'guǐ', 'ghost · the returned dead', 'A ghost: in early China the dead who are served in rites, or who return; in Buddhist translation, a whole realm of rebirth. The Shuowen glosses it by 歸, to return.'],
  hun: ['魂', 'hún', 'cloud-soul · the yang soul', 'The light, rising soul, the one a summons can call back. It is paired with 魄.'],
  po: ['魄', 'pò', 'white-soul · the yin soul', 'The heavy soul that stays with the body and returns to earth; also the dark part of the moon.'],
  'tan-greed': ['貪', 'tān', 'greed · craving', 'Greed: wanting more. The first of the three roots of harm, 貪瞋癡.'],
  ke: ['渴', 'kě', 'thirst · longing', 'Thirst, and thirst as longing. Buddhist Chinese calls the craving that keeps rebirth turning 渴愛, thirst-love.'],
  'shi-give': ['施', 'shī', 'to give · to bestow', 'To give or bestow: 布施, dāna, the first perfection, and 施食, the feeding of hungry ghosts.'],
  'shi-food': ['食', 'shí', 'food · to eat', 'Food and eating. Buddhist texts count four kinds of food, of which morsels are only the first.'],
  'wei-notyet': ['未', 'wèi', 'not yet', 'Not yet: the negative that leaves the future open. With 來 it makes 未來, the future, part for part the Sanskrit anāgata, the not-come.'],
  lai: ['來', 'lái', 'to come · what is coming', 'To come, and what is coming: 來者, those still to come; 如來, the Thus-Come.'],
  jiang: ['將', 'jiāng', 'about to · will · to lead', 'About to: the future marker of Classical Chinese, and in 將來 a modern word for the future. Read jiàng, it is a general.'],
  hou: ['後', 'hòu', 'after · later · descendants', 'After and later; also those who come after us, descendants. 後生, the young, may surpass us.'],
  wang: ['望', 'wàng', 'to gaze toward · hope · the full moon', 'To look into the distance, and so to hope; also the full moon, when moon and sun face each other.'],
  meng: ['夢', 'mèng', 'dream', 'Dream: an omen in the Odes, a doubt in the Zhuangzi, and in the Diamond Sutra a figure for everything conditioned.'],
  'ming-fate': ['命', 'mìng', 'command · fate · lifespan', 'A command, and so fate as Heaven’s command; also a lifespan. 天命 and 司命 are its two great compounds.'],
  jie: ['劫', 'jié', 'kalpa · eon · calamity', 'An eon: 劫 renders kalpa by sound. The graph already meant to stop by force, and the eon’s end in fire lent it the sense of calamity.'],
  'yu-space': ['宇', 'yǔ', 'eaves · space', 'First the edge of a roof, then all space. With 宙 it makes 宇宙, the universe.'],
  'zhou-eon': ['宙', 'zhòu', 'all time', 'All time, past and still to come: 往古來今謂之宙.'],
  'ji-still': ['寂', 'jì', 'silent · still', 'Silence and stillness. In Buddhist Chinese 寂滅, stilled and extinguished, names nirvāṇa.'],
  gu: ['孤', 'gū', 'orphaned · alone', 'Fatherless, and so alone. Rulers called themselves 孤, the orphan, in humility.'],
  yuan: ['遠', 'yuǎn', 'far · distant', 'Far: in space, in time, and in the length of a road still to walk.'],
  ta: ['他', 'tā', 'other · another; he', 'Other: 他人, other people; 他山, another hill. Its use as the pronoun “he” came later.'],
  shei: ['誰', 'shéi', 'who?', 'Who? The question of the Heavenly Questions, and of an empty sky.'],
  ting: ['聽', 'tīng', 'to listen', 'To listen, attend and heed. Listening is not the same as hearing, 聞.'],
};
const ATTR_NAME = { newton: 'Newton–Leipnik', lorenz84: 'Lorenz-84', burkeshaw: 'Burke–Shaw' };
const SPECIAL = {
  ghosts: '魂 takes the highest of the eight points and 魄 the lowest, after the Liji’s 魂氣歸于天，形魄歸于地.',
  future: '望 takes the highest point, gazing up; 劫 the point farthest from the rest, at the edge of the eon.',
  fermi: '遠 takes the point farthest from the system’s centre, 孤 the most isolated of the rest, and 寂 the point nearest the centre.',
};
const { sampleSystem, toLocal } = await import(pathToFileURL(ROOT + 'src/scene/attractors.js').href);
function place(realm) {
  const S = sampleSystem(realm.attractor, 14000), pts = [];
  for (let i = 0; i < S.length / 4; i += 7) {
    const a = [S[i * 4], S[i * 4 + 1], S[i * 4 + 2]], l = toLocal(realm.attractor, ...a);
    pts.push({ a, x: l[0], y: l[1] });
  }
  // Farthest-point sampling in the projected plane, seeded at the top.
  let first = pts.reduce((m, p) => (p.y > m.y ? p : m));
  const chosen = [first];
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  while (chosen.length < 8) {
    let best = null, bd = -1;
    for (const p of pts) { const d = Math.min(...chosen.map((c) => dist(p, c))); if (d > bd) { bd = d; best = p; } }
    chosen.push(best);
  }
  const cx = chosen.reduce((s, p) => s + p.x, 0) / 8, cy = chosen.reduce((s, p) => s + p.y, 0) / 8;
  const c = { x: cx, y: cy }, free = [...chosen], take = (p) => { free.splice(free.indexOf(p), 1); return p; };
  const pick = {};
  const by = (f) => free.reduce((m, p) => (f(p) > f(m) ? p : m));
  if (realm.id === 'ghosts') { pick.hun = take(by((p) => p.y)); pick.po = take(by((p) => -p.y)); }
  if (realm.id === 'future') { pick.wang = take(by((p) => p.y)); pick.jie = take(by((p) => dist(p, c))); }
  if (realm.id === 'fermi') {
    pick.yuan = take(by((p) => dist(p, c)));
    pick.gu = take(by((p) => Math.min(...chosen.filter((q) => q !== p).map((q) => dist(p, q)))));
    pick['ji-still'] = take(by((p) => -dist(p, c)));
  }
  for (const id of realm.anchors) if (!pick[id]) pick[id] = take(free[0]);
  return pick;
}
for (const realm of NEW_REALMS) {
  const pick = place(realm);
  realm.anchors.forEach((id, i) => {
    const p = `anchors/${id}.json`;
    if (fs.existsSync(D + p)) return;
    const [glyph, pinyin, gloss, summary] = ANCH[id];
    wr(p, {
      id, key: String(i + 1), glyph, pinyin, gloss,
      form: 'not yet researched', formNote: '', summary,
      coords: pick[id].a.map((v) => +v.toFixed(4)),
      placement: `Chosen by farthest-point sampling on the integrated ${ATTR_NAME[realm.attractor]} trajectory, so the eight stars spread across its projected shape. ${SPECIAL[realm.id]} A design choice, not a claim.`,
      oc: OC, satellites: [],
    });
  });
}

// ── 5. index.js ──────────────────────────────────────────────────────────────
{
  const p = ROOT + 'src/data/index.js';
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes('xiXiii_')) {
    const ids = NEW_REALMS.flatMap((r) => r.anchors);
    const v = (id) => 'xiXiii_' + id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    const imp = ids.map((id) => `import ${v(id)} from './anchors/${id}.json' with { type: 'json' };`).join('\n');
    const lastImp = "import viX_siDeath from './anchors/si-death.json' with { type: 'json' };";
    s = s.replace(lastImp, lastImp + '\n' + imp);
    const lastEntry = "  'si-death': viX_siDeath,";
    s = s.replace(lastEntry, lastEntry + '\n' + ids.map((id) => `  '${id}': ${v(id)},`).join('\n'));
    fs.writeFileSync(p, s);
  }
}

// ── 6. Satellites ────────────────────────────────────────────────────────────
const SAT = {
  e: [
    claim({ id: 'e-preta', glyph: 'प्रेत · Preta', title: 'The Departed, Named by Hunger', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
      evidence: 'Sanskrit preta means “departed”, one who has gone before. Chinese named these beings by their torment instead: 餓鬼, hungry ghosts. The Abhidharmakośa counts them among five destinies, 地獄、傍生、鬼及人、天, and the Ullambana Sutra sees Maudgalyāyana’s mother 生餓鬼中，不見飲食，皮骨連立 — reborn among the hungry ghosts, seeing no food, all skin and bone.',
      caveat: 'The Ullambana Sutra’s attribution to Dharmarakṣa is doubted; many scholars hold it was composed in China.',
      dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
      cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 42a18', checked: ck(KOSA, '地獄、傍生、鬼及人、天，是名五趣') },
        { source: 'ullambana', locator: 'T685 p. 779b01', checked: ck(YL, '見其亡母生餓鬼中，不見飲食，皮骨連立') },
        { source: 'monier-williams', locator: 'preta' }], gaps: ['Check preta in Monier-Williams.'] }),
    claim({ id: 'e-epiao', glyph: '塗有餓莩', title: 'The Starved on the Roads', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Mencius 1A3: 狗彘食人食而不知檢，塗有餓莩而不知發；人死，則曰：非我也，歲也 — dogs and pigs eat people’s food and no one stops them, the starved lie on the roads and no one opens the granaries, and when people die the ruler says “not I: the harvest”. Mencius calls that stabbing a man and blaming the blade. Hunger here is a policy.',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'mencius', locator: '1A3', checked: ck(MENG, '梁惠王上 ¶9 in the transcription’s numbering: 狗彘食人食而不知檢，塗有餓莩而不知發') }] }),
  ],
  gui: [claim({ id: 'gui-return', glyph: '人所歸為鬼', title: 'The Dead Are the Returned', lang: 'Han lexicography', type: 'ETYMOLOGICAL_SINITIC',
    evidence: 'The Shuowen glosses 鬼 by its near-homophone 歸, to return: 人所歸為鬼, “what people return to is 鬼”. To die is to go home, and the ghost is the one who has gone back.',
    caveat: 'A sound gloss (聲訓) is Han hermeneutics, not historical etymology. Wording from general knowledge.',
    dimension: 'sound', period: 'han', cites: [{ source: 'shuowen', locator: '鬼部 鬼' }] })],
  hun: [claim({ id: 'hun-zhaohun', glyph: '魂兮歸來', title: 'Soul, Come Back', lang: 'Classical Chinese (Chuci)', type: 'TEXTUAL_CONNECTION',
    evidence: 'In the Summons of the Soul the shaman Wuyang is told 魂魄離散, the souls are scattered, and calls: 魂兮歸來！去君之恒幹，何為四方些 — “soul, come back! Why leave your constant frame for the four directions?” Each direction is then shown as a place of horrors where no soul can stay.',
    caveat: 'Attributed to Song Yu or to Qu Yuan; the attribution is disputed.',
    dimension: 'practice', period: 'pre_qin',
    cites: [{ source: 'chuci', locator: '招魂', checked: ck(CHUCI, '魂魄离散，汝筮予之…魂兮归来！去君之恒干，何为四方些') }] })],
  po: [claim({ id: 'po-tianxing', glyph: '形魄歸于地', title: 'The Bodily Soul Returns to Earth', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Liji: 魂氣歸于天，形魄歸于地 — at death the breath-soul returns to heaven and the bodily soul to earth. The two souls part toward where each belongs.',
    dimension: 'sense', period: 'han', cites: [{ source: 'liji', locator: '郊特牲' }] })],
  'tan-greed': [claim({ id: 'tan-greed-sangen', glyph: '貪 · 瞋 · 癡', title: 'The First Root of Harm', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: 'The Abhidharmakośa: 世尊說為貪瞋癡三不善根 — the Buddha called greed, hatred and delusion the three roots of the unwholesome. 貪 renders lobha in this list, and rāga, passion, elsewhere.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 4, p. 103a03', checked: ck(KOSA, '世尊說為貪瞋癡三不善根') },
      { source: 'monier-williams', locator: 'lobha; rāga' }], gaps: ['Check lobha and rāga in Monier-Williams.'] })],
  ke: [claim({ id: 'ke-ershiwuyou', glyph: '渴愛之病', title: 'The Sickness of Thirst', lang: 'Chinese Buddhist textual usage', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Nirvana Sutra speaks of freeing beings from 二十五有渴愛之病, the sickness of thirst-love through the twenty-five kinds of existence. Thirst is the illness that keeps rebirth going.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'nirvana', locator: 'T374 p. 509a23', checked: ck(NP, '能令眾生悉得遠離二十五有渴愛之病') }] })],
  'shi-give': [
    claim({ id: 'shi-give-dana', glyph: '布施 · Dāna', title: 'Giving While Dwelling on Nothing', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
      evidence: '布施 renders dāna, giving, the first of the six perfections. The Diamond Sutra asks that it be done without fixing on anything: 菩薩於法應無所住行於布施 — a bodhisattva should give while dwelling on nothing.',
      dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
      cites: [{ source: 'diamond', locator: 'T235 p. 749a12', checked: ck(JG, '菩薩於法應無所住行於布施，所謂不住色布施') },
        { source: 'monier-williams', locator: 'dāna' }], gaps: ['Check dāna in Monier-Williams.'] }),
    claim({ id: 'shi-give-yankou', glyph: '焰口', title: 'Flaming Mouth', lang: 'Chinese Buddhist (esoteric)', type: 'TEXTUAL_CONNECTION',
      evidence: 'In Amoghavajra’s sutra, Ānanda, alone at night, sees a hungry ghost named 焰口, Flaming Mouth, 其形醜陋，身體枯瘦，口中火然: ugly, withered, fire burning in its mouth. It tells him he will die in three days unless he gives food to countless hungry ghosts, and the Buddha teaches a dhāraṇī by which one offering feeds them all.',
      caveat: 'The later rite of 放焰口 grew from this text through Song to Qing liturgies; those are not cited here.',
      dimension: 'practice', period: 'six_dynasties_tang',
      cites: [{ source: 'yankou', locator: 'T1313 p. 464b29–c23', checked: ck(YK, '見一餓鬼名曰焰口，其形醜陋，身體枯瘦，口中火然…汝過三日必當…') }] }),
  ],
  'shi-food': [
    claim({ id: 'shi-food-sishi', glyph: '四食', title: 'The Four Foods', lang: 'Sanskrit → Chinese (Abhidharma)', type: 'CANONICAL_TRANSLATION',
      evidence: 'The Abhidharmakośa counts four foods that sustain beings: 段食, food in morsels; 觸食, contact; 思食, volition; and 識食, consciousness. It cites the Buddha that 四食皆為病癰箭根 — all four are disease, boil and arrow, roots of aging and death.',
      dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
      cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 55b17–c26', checked: ck(KOSA, '世尊說四食皆為病癰箭根…觸食…思食…識食') },
        { source: 'monier-williams', locator: 'āhāra' }], gaps: ['Check āhāra in Monier-Williams.'] }),
    claim({ id: 'shi-food-shise', glyph: '食色，性也', title: 'Food and Sex Are Nature', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Mencius 6A4: Gaozi says 食色，性也 — appetite for food and sex is human nature — and that humaneness is inside us while rightness is outside. Mencius rejects the second claim.',
      caveat: 'The famous line is Gaozi’s, Mencius’s opponent, not Mencius’s own view.',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'mencius', locator: '6A4', checked: ck(MENG, '告子上 ¶9 in the transcription’s numbering: 告子曰：食色，性也。仁，內也，非外也；義，外也，非內也') }] }),
  ],

  'wei-notyet': [claim({ id: 'wei-notyet-sanshi', glyph: '三世實有', title: 'Does the Future Already Exist?', lang: 'Sanskrit → Chinese (Abhidharma)', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Abhidharmakośa reports the thesis 三世實有, that dharmas of past, present and future all really exist, and says only one who holds it 是說一切有宗, belongs to the school that “says all exists”, the Sarvāstivāda. On this view the future is already there, and comes into the present.',
    caveat: 'Vasubandhu reports the thesis in order to criticize it.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 5, p. 104b05–24', checked: ck(KOSA, '論曰：三世實有…謂若有人說三世實有，方許彼是說一切有宗') }] })],
  lai: [claim({ id: 'lai-laizhe', glyph: '來者猶可追', title: 'What Is Coming Can Still Be Reached', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 18.5, the madman of Chu sings as he passes Confucius: 鳳兮鳳兮，何德之衰？往者不可諫，來者猶可追 — “phoenix, phoenix, how virtue has declined! What is gone cannot be argued with; what is coming can still be caught.”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '18.5', checked: ck(LUNYU, '微子 ¶5: 凤兮凤兮，何德之衰？往者不可谏，来者犹可追') }] })],
  jiang: [claim({ id: 'jiang-laozhi', glyph: '不知老之將至', title: 'Not Knowing Old Age Is Coming', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 7.19: Confucius would have himself described as one who 發憤忘食，樂以忘憂，不知老之將至 — “forgets to eat in his zeal, forgets his cares in his joy, and does not know that old age is about to arrive.” 將 marks what is on its way.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '7.19', checked: ck(LUNYU, '述而 ¶19: 发愤忘食，乐以忘忧，不知老之将至云尔') }] })],
  hou: [claim({ id: 'hou-wuhou', glyph: '其無後乎', title: 'Will He Have No Descendants?', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius 1A4 quotes Confucius on the first maker of tomb figurines: 始作俑者，其無後乎 — “whoever first made figures to bury with the dead, surely he will have no posterity!”, because they were made in human likeness. Mencius turns it on a king whose stables are fat while 野有餓莩, the starved lie in the fields. 後 is the future as descendants.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '1A4', checked: ck(MENG, '梁惠王上 ¶15 in the transcription’s numbering: 野有餓莩…仲尼曰：始作俑者，其無後乎') }] })],
  wang: [claim({ id: 'wang-hope', glyph: '跂予望之', title: 'On Tiptoe, Looking Toward It', lang: 'Classical Chinese (Odes)', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Odes, Hekuang: 誰謂宋遠？跂予望之 — “who says Song is far? On tiptoe I can see it.” 望 begins as looking toward the far; from there it comes to mean hoping, as in 希望 and 願望.',
    caveat: 'The semantic route from gazing to hoping is the dictionaries’ account.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'shijing', locator: '衛風 · 河廣', checked: ck(SHI, '河广: 谁谓宋远？跂予望之') }, { source: 'moe-dict', locator: '望' }] })],
  meng: [
    claim({ id: 'meng-jimeng', glyph: '吉夢維何', title: 'What Are the Lucky Dreams?', lang: 'Classical Chinese (Odes)', type: 'TEXTUAL_CONNECTION',
      evidence: 'The Odes, Sigan: 吉夢維何？維熊維羆，維虺維蛇 … 維熊維羆，男子之祥；維虺維蛇，女子之祥 — the lucky dreams are bears and snakes, and the diviner reads bears as the omen of sons and snakes of daughters. Here a dream is a message from what is coming.',
      dimension: 'practice', period: 'pre_qin',
      cites: [{ source: 'shijing', locator: '小雅 · 斯干', checked: ck(SHI, '斯干: 吉梦维何…男子之祥') }] }),
    claim({ id: 'meng-zhougong', glyph: '夢見周公', title: 'No Longer Dreaming of the Duke of Zhou', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Analects 7.5: 甚矣吾衰也！久矣吾不復夢見周公 — “how far I have declined! It is long since I dreamed of the Duke of Zhou.” Confucius measures his failing hope by a dream that no longer comes.',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'analects', locator: '7.5', checked: ck(LUNYU, '述而 ¶5: 甚矣吾衰也！久矣吾不复梦见周公') }] }),
  ],
  'ming-fate': [
    claim({ id: 'ming-fate-xing', glyph: '天命之謂性', title: 'What Heaven Commands Is Called Nature', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'The Zhongyong opens: 天命之謂性，率性之謂道，修道之謂教 — “what Heaven commands is called nature; following nature is called the Way; cultivating the Way is called teaching.”',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'liji', locator: '中庸 §1', checked: ck(ZY, '天命之謂性，率性之謂道，修道之謂教') }] }),
    claim({ id: 'ming-fate-sisheng', glyph: '死生有命', title: 'Death and Life Have Their Decree', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Analects 12.5: to Sima Niu, grieving that he has no brothers, Zixia says 死生有命，富貴在天 … 四海之內皆兄弟也 — “death and life have their decree, wealth and rank lie with Heaven … within the four seas all are brothers.”',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'analects', locator: '12.5', checked: ck(LUNYU, '颜渊 ¶5: 死生有命，富贵在天…四海之内皆兄弟也') }] }),
  ],
  jie: [
    claim({ id: 'jie-kalpa', glyph: 'कल्प · Kalpa', title: 'An Eon, Borrowed by Sound', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
      evidence: '劫 is short for 劫波, which renders kalpa by sound. In the Abhidharmakośa a great eon passes through formation, abiding, destruction and emptiness, and 所言成劫，謂從風起乃至地獄始有情生 — the eon of formation runs from the first wind to the first being born in hell.',
      dimension: 'translation', mechanism: 'phonetic_loan', period: 'six_dynasties_tang',
      cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 63a09', checked: ck(KOSA, '所言成劫，謂從風起乃至地獄始有情生') },
        { source: 'monier-williams', locator: 'kalpa' }], gaps: ['Check kalpa in Monier-Williams.'] }),
    claim({ id: 'jie-force', glyph: '以力脅止曰劫', title: 'A Graph That Meant Force', lang: 'Han lexicography', type: 'SEMANTIC_CONTRAST',
      evidence: 'Before it meant an eon, 劫 meant to stop someone by force; the Shuowen: 人欲去，以力脅止曰劫. The translators chose a graph that already had a meaning, and the eon’s ending in fire later lent the word its sense of calamity, 劫難, 浩劫.',
      caveat: 'The Shuowen wording is from general knowledge; the route from kalpa to calamity is the usual explanation, not a documented step.',
      dimension: 'sense', period: 'han', cites: [{ source: 'shuowen', locator: '力部 劫' }, { source: 'moe-dict', locator: '浩劫' }] }),
  ],

  'yu-space': [
    claim({ id: 'yu-space-roof', glyph: '宇，屋邊也', title: 'The Edge of a Roof', lang: 'Han lexicography', type: 'ETYMOLOGICAL_SINITIC',
      evidence: 'The Shuowen: 宇，屋邊也 — the eaves. The word for all of space began as the edge of a roof, the line between shelter and sky.',
      caveat: 'Wording from general knowledge; check an edition.',
      dimension: 'form', period: 'han', cites: [{ source: 'shuowen', locator: '宀部 宇' }] }),
    claim({ id: 'yu-space-wuchu', glyph: '有實而無乎處', title: 'Real, but Located Nowhere', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Zhuangzi 23 (Gengsang Chu): 有實而無乎處者，宇也；有長而無本剽者，宙也 — “what is real but has no place is 宇, space; what has length but neither root nor tip is 宙, time.”',
      dimension: 'cosmos', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 23 庚桑楚' }] }),
  ],
  'zhou-eon': [claim({ id: 'zhou-eon-uchu', glyph: '宇宙 · Uchū', title: 'Space and Time, Folded into One Word', lang: 'Chinese · Japanese · English', type: 'CROSS_LINGUISTIC_LEXICAL',
    evidence: 'In modern Chinese and Japanese (uchū), 宇宙 is simply the universe. The classical pair named space and time separately; the modern word folds them into one, much as physics speaks of spacetime.',
    caveat: 'An analogy, not a history: the modern sense of 宇宙 did not come from relativity.',
    dimension: 'sense', mechanism: 'independent_parallel', period: 'modern', cites: [{ source: 'moe-dict', locator: '宇宙' }] })],
  'ji-still': [
    claim({ id: 'ji-still-jimie', glyph: '寂滅為樂', title: 'Stillness Is Joy', lang: 'Chinese Buddhist textual usage', type: 'TEXTUAL_CONNECTION',
      evidence: 'The Nirvana Sutra’s half-verses: 諸行無常，是生滅法 … 生滅滅已，寂滅為樂 — all conditioned things are impermanent, they arise and pass away; when arising and passing have passed, stillness is joy. A young ascetic offers his body to a rākṣasa to hear the second half.',
      dimension: 'sense', period: 'six_dynasties_tang',
      cites: [{ source: 'nirvana', locator: 'T374 p. 450a16; 451a01', checked: ck(NP, '宣過去佛所說半偈：諸行無常，是生滅法…羅剎即說：生滅滅已，寂滅為樂') }] }),
    claim({ id: 'ji-still-liao', glyph: '寂兮寥兮', title: 'Silent, Empty, Standing Alone', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Daodejing 25: 有物混成，先天地生。寂兮寥兮，獨立不改，周行而不殆 … 吾不知其名，字之曰道 — “something formed from the undivided, born before heaven and earth: silent, empty, standing alone and unchanging, going round without wearing out … I do not know its name; I style it the Way.”',
      dimension: 'cosmos', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'ch. 25' }] }),
  ],
  gu: [claim({ id: 'gu-guagua', glyph: '孤 · 寡 · 不穀', title: 'Kings Call Themselves Orphans', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Daodejing 42: 人之所惡，唯孤、寡、不穀，而王公以為稱 — what people hate is to be orphaned, widowed, unworthy, and these the kings and lords take as their titles. The loneliest names are worn by those at the top.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'chs. 39, 42' }],
    gaps: ['Open Daodejing ch. 42 in a reliable edition and record the passage.'] })],
  yuan: [claim({ id: 'yuan-yuanyou', glyph: '願輕舉而遠遊', title: 'Far Roaming', lang: 'Classical Chinese (Chuci)', type: 'TEXTUAL_CONNECTION',
    evidence: 'Yuanyou: 悲時俗之迫阨兮，願輕舉而遠遊 … 惟天地之無窮兮，哀人生之長勤。往者余弗及兮，來者吾不聞 — “grieving the narrowness of the age, I long to rise lightly and roam far … heaven and earth have no end; I mourn the long toil of human life. Those gone before I cannot reach; those yet to come I will not hear.”',
    caveat: 'Traditionally ascribed to Qu Yuan; many scholars date it later.',
    dimension: 'cosmos', period: 'han',
    cites: [{ source: 'chuci', locator: '遠遊', checked: ck(CHUCI, '悲时俗之迫阨兮，愿轻举而远游…往者余弗及兮，来者吾不闻') }] })],
  ta: [
    claim({ id: 'ta-tashan', glyph: '他山之石', title: 'Stones from Another Hill', lang: 'Classical Chinese (Odes)', type: 'TEXTUAL_CONNECTION',
      evidence: 'The Odes, Heming: 他山之石，可以為錯 … 他山之石，可以攻玉 — “stones from another hill can serve as a whetstone … stones from another hill can work jade.” What shapes us comes from elsewhere.',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'shijing', locator: '小雅 · 鶴鳴', checked: ck(SHI, '鹤鸣: 他山之石，可以为错…他山之石，可以攻玉') }] }),
    claim({ id: 'ta-pronoun', glyph: '他 · 她 · 它', title: 'When the Other Became “He”', lang: 'Chinese (modern)', type: 'SEMANTIC_CONTRAST',
      evidence: 'Classical 他 means other: 他人, other people; 他山, another hill. Later it became the third-person pronoun for anyone, and in the early twentieth century writers split it into 他, 她 and 它, he, she and it.',
      caveat: 'The coinage of 她 is usually credited to Liu Bannong (c. 1920); dates and credit are from general knowledge.',
      dimension: 'sense', period: 'modern', cites: [{ source: 'moe-dict', locator: '他; 她' }],
      gaps: ['Cite a history of the 她 coinage.'] }),
  ],
  shei: [
    claim({ id: 'shei-tianwen', glyph: '遂古之初，誰傳道之', title: 'The Heavenly Questions', lang: 'Classical Chinese (Chuci)', type: 'TEXTUAL_CONNECTION',
      evidence: 'The Tianwen opens: 遂古之初，誰傳道之？上下未形，何由考之 — “of the beginning of the distant past, who has told it? Before above and below had taken form, how could it be examined?” The poem asks well over a hundred questions and answers none.',
      caveat: 'Traditionally ascribed to Qu Yuan.',
      dimension: 'cosmos', period: 'pre_qin',
      cites: [{ source: 'chuci', locator: '天問', checked: ck(CHUCI, '遂古之初，谁传道之？上下未形，何由考之') }] }),
    claim({ id: 'shei-fermi', glyph: 'Where is everybody?', title: 'Two Questions to an Empty Sky', lang: 'English · Classical Chinese', type: 'INTERPRETIVE_SYNTHESIS',
      evidence: 'Proposed pairing: at lunch at Los Alamos in 1950, Enrico Fermi is reported to have asked “Where is everybody?”: if life is common, why is the sky silent? Rushi sets the question beside the Tianwen. Both ask the sky who is there, and neither has been answered.',
      caveat: 'Fermi’s words are remembered differently by those present (Jones 1985). The pairing with the Tianwen is Rushi’s proposition, not a historical link.',
      dimension: 'interpretation', cites: [{ source: 'rushi' }, { source: 'jones-1985' }] }),
  ],
  ting: [
    claim({ id: 'ting-tianhe', glyph: '天何言哉', title: 'What Does Heaven Say?', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Analects 17.19: 予欲無言 … 天何言哉？四時行焉，百物生焉，天何言哉 — “I wish to say nothing … What does Heaven say? The four seasons go round, the hundred things are born. What does Heaven say?” A sky that does not speak, and is not empty.',
      dimension: 'sense', period: 'pre_qin',
      cites: [{ source: 'analects', locator: '17.19', checked: ck(LUNYU, '阳货 ¶19: 予欲无言…天何言哉？四时行焉，百物生焉，天何言哉') }] }),
    claim({ id: 'ting-qi', glyph: '聽之以氣', title: 'Listening with the Breath', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Zhuangzi 4, the fasting of the heart: 無聽之以耳而聽之以心，無聽之以心而聽之以氣 — “listen not with the ear but with the heart; not with the heart but with the breath.”',
      dimension: 'practice', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 4 人間世, 心齋' }] }),
  ],
};
for (const [a, sats] of Object.entries(SAT)) {
  const j = rd(`anchors/${a}.json`);
  for (const s of sats) if (!j.satellites.some((x) => x.id === s.id)) j.satellites.push(s);
  wr(`anchors/${a}.json`, j);
}

// ── 7. Bridges ───────────────────────────────────────────────────────────────
const B = (from, to, label, title, subtitle, o) => claim({ id: `bridge-${from}-${to}`, from, to, label, title, subtitle, ...o });
const P = (from, to, label, title, evidence, caveat, extra = []) => B(from, to, label, title, 'Original interpretation', {
  type: 'INTERPRETIVE_SYNTHESIS', evidence, caveat, dimension: 'interpretation', cites: [{ source: 'rushi' }, ...extra] });
const BRIDGES = [
  // XI within
  B('e', 'gui', '餓鬼', 'The Hungry Ghost', 'Ullambana Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Together the two stars name the preta: in the Ullambana Sutra Maudgalyāyana’s mother is 生餓鬼中, reborn among the hungry ghosts, and the rice he brings her 食未入口，化成火炭, turns to burning coal before it reaches her mouth.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'ullambana', locator: 'T685 p. 779b01–04', checked: ck(YL, '生餓鬼中，不見飲食…食未入口，化成火炭') }] }),
  B('hun', 'po', '魂魄', 'The Two Souls', 'Chuci; Zuozhuan', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Zichan in the Zuozhuan: 人生始化曰魄，既生魄，陽曰魂 — when a life first takes shape it is called 魄; once there is 魄, its yang is called 魂. In the Summons of the Soul, death is 魂魄離散, the two scattered apart.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'zuozhuan', locator: '昭公七年' }, { source: 'chuci', locator: '招魂', checked: ck(CHUCI, '魂魄离散') }],
    gaps: ['Open the Zuozhuan, Zhao 7, in an edition.'] }),
  B('shi-food', 'e', '食 · 餓', 'Food Given to Pigs, Hunger on the Roads', 'Mencius 1A3', { type: 'TEXTUAL_CONNECTION',
    evidence: 'One sentence of Mencius holds both stars: 狗彘食人食而不知檢，塗有餓莩而不知發 — dogs and pigs eat people’s food, and the starved lie on the roads.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '1A3', checked: ck(MENG, '狗彘食人食而不知檢，塗有餓莩而不知發') }] }),
  B('shi-give', 'shi-food', '施食', 'Giving Food', 'Ullambana Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Ullambana offering: 以百味飲食安盂蘭盆中，施十方自恣僧 — food of a hundred flavours placed in the bowl and given to the assembled monks, whose merit frees parents of seven generations.',
    dimension: 'practice', period: 'six_dynasties_tang',
    cites: [{ source: 'ullambana', locator: 'T685 p. 779c11', checked: ck(YL, '以百味飲食安盂蘭盆中，施十方自恣僧') }] }),
  // XI → others
  B('gui', 'si-death', '事鬼 · 知死', 'Serving Ghosts, Knowing Death', 'Analects 11.12', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 11.12 pairs them: 未能事人，焉能事鬼 … 未知生，焉知死 — not yet able to serve the living, how serve ghosts? Not yet knowing life, how know death?',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '11.12', checked: ck(LUNYU, '先进 ¶12: 未能事人，焉能事鬼？…未知生，焉知死？') }] }),
  B('gui', 'yuan', '敬鬼神而遠之', 'Revere the Spirits, Keep Them at a Distance', 'Analects 6.22', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 6.22, asked about wisdom: 務民之義，敬鬼神而遠之，可謂知矣 — attend to what is right for the people, revere ghosts and spirits but keep them at a distance: that may be called wisdom.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '6.22', checked: ck(LUNYU, '雍也 ¶22: 务民之义，敬鬼神而远之，可谓知矣') }] }),
  B('gui', 'shan', '山鬼', 'The Mountain Spirit', 'Chuci, Nine Songs', { type: 'TEXTUAL_CONNECTION',
    evidence: 'One of the Nine Songs is 山鬼, the spirit of the mountain: 若有人兮山之阿 — “there seems to be someone in the fold of the hill”, waiting in the bamboo and never seeing the sky.',
    caveat: '鬼 here is a spirit of place, not a dead person.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'chuci', locator: '九歌 · 山鬼', checked: ck(CHUCI, '山鬼: 若有人兮山之阿…余处幽篁兮终不见天') }] }),
  B('hun', 'yang', '陽曰魂', 'The Yang of the Soul', 'Zuozhuan, Zhao 7', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Zichan: 既生魄，陽曰魂 — once the bodily soul exists, its yang is called 魂. The rising soul is the yang one.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zuozhuan', locator: '昭公七年' }],
    gaps: ['Open the Zuozhuan, Zhao 7, in an edition.'] }),
  B('hun', 'lai', '魂兮歸來', 'Come Back', 'Chuci, Zhaohun', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The refrain of the Summons of the Soul is 魂兮歸來, “soul, come back”: 來 is the word the living call into the dark.',
    dimension: 'practice', period: 'pre_qin',
    cites: [{ source: 'chuci', locator: '招魂', checked: ck(CHUCI, '魂兮归来！去君之恒干，何为四方些') }] }),
  B('po', 'hua', '始化曰魄', 'The First Shaping', 'Zuozhuan, Zhao 7', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Zichan: 人生始化曰魄 — when a person’s life first takes shape, first transforms, it is called 魄. The bodily soul begins in 化.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zuozhuan', locator: '昭公七年' }],
    gaps: ['Open the Zuozhuan, Zhao 7, in an edition.'] }),
  B('po', 'yue', '哉生魄', 'The Dark of the Moon', 'Shangshu', { type: 'TEXTUAL_CONNECTION',
    evidence: '魄 is also the unlit part of the moon. The Shangshu dates events by it: 惟三月哉生魄, “in the third month, when the dark of the moon began to grow”. Bronze inscriptions write the same lunar terms with 霸.',
    caveat: 'Locator and the bronze form 霸 are Baracus’s, from general knowledge.',
    dimension: 'cosmos', period: 'shang_zhou', cites: [{ source: 'shangshu', locator: '康誥' }] }),
  B('ke', 'ai', '渴愛', 'Thirst-Love', 'Vimalakīrti Sūtra', { type: 'CANONICAL_TRANSLATION',
    evidence: '渴愛 renders tṛṣṇā, thirst, the craving of the twelve links. The Vimalakīrti: 是身如炎，從渴愛生 — this body is like a mirage, born of thirst-love.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'vimalakirti', locator: 'T475 p. 539b17', checked: ck(VK, '是身如炎，從渴愛生') }, { source: 'monier-williams', locator: 'tṛṣṇā' }],
    gaps: ['Check tṛṣṇā in Monier-Williams.'] }),
  B('tan-greed', 'ai', '貪愛', 'Greed and Craving', 'Lotus Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Lotus Sutra: 深著於五欲，如犛牛愛尾，以貪愛自蔽，盲瞑無所見 — clinging to the five desires as a yak loves its tail, they blind themselves with greed and craving and see nothing.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'lotus', locator: 'T262 p. 9b29', checked: ck(FH, '深著於五欲，如犛牛愛尾，以貪愛自蔽，盲瞑無所見') }] }),
  B('shi-give', 'bei', '施 · 悲', 'Giving Answers Grief', 'Ullambana Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Ullambana story begins in grief: 目連悲哀，即鉢盛飯往餉其母 — Maudgalyāyana, grieving, fills his bowl with rice and brings it to his mother. The giving that the sutra then teaches is his answer to that grief.',
    caveat: '悲哀 here is grief, not the karuṇā of 慈悲. The Atlas’s reading of 施餓鬼 as an act of compassion still needs the ritual texts.',
    dimension: 'practice', period: 'six_dynasties_tang',
    cites: [{ source: 'ullambana', locator: 'T685 p. 779b02', checked: ck(YL, '目連悲哀，即鉢盛飯往餉其母') }],
    gaps: ['Trace 施餓鬼 as compassion in the ritual texts (e.g. the 瑜伽焰口 liturgy).'] }),
  B('shi-food', 'si-thought', '思食', 'Volition Is a Food', 'Abhidharmakośa ch. 3', { type: 'CANONICAL_TRANSLATION',
    evidence: 'Among the four foods the third is 思食, volition: intention feeds a being as morsels do, and the Kośa says 思食能引, volition draws on the next life.',
    dimension: 'translation', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 55b18–c08', checked: ck(KOSA, '亦見思食安住現身…當生思食能引') }] }),
  B('ke', 'wang', '望梅止渴', 'Gazing at Plums to Quench a Thirst', 'Shishuo xinyu', { type: 'TEXTUAL_CONNECTION',
    evidence: 'In the Shishuo xinyu, Cao Cao’s army is dying of thirst; he tells them there is a plum grove ahead, their mouths water, and they march on. 望梅止渴: a thirst eased by looking toward what has not yet come.',
    dimension: 'sense', period: 'six_dynasties_tang', cites: [{ source: 'shishuo', locator: '假譎' }] }),
  // XII within
  B('wei-notyet', 'lai', '未來', 'The Not-Yet-Come', 'anāgata', { type: 'CANONICAL_TRANSLATION',
    evidence: '未來 renders anāgata part for part: an- “not”, āgata “come”. The Abhidharmakośa uses it throughout of the three times, 過去未來 and the present.',
    dimension: 'translation', mechanism: 'calque', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 1, p. 8b19', checked: ck(KOSA, '過去未來名無執受') }, { source: 'monier-williams', locator: 'anāgata' }],
    gaps: ['Check anāgata in Monier-Williams.'] }),
  B('hou', 'lai', '後生可畏', 'The Young Should Be Respected', 'Analects 9.23', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 9.23: 後生可畏，焉知來者之不如今也 — “the young deserve awe: how do we know those to come will not equal us now?”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '9.23', checked: ck(LUNYU, '子罕 ¶23: 后生可畏，焉知来者之不如今也') }] }),
  B('jiang', 'lai', '將來 · 未來', 'Two Words for the Future', 'Modern Chinese', { type: 'SEMANTIC_CONTRAST',
    evidence: 'Modern Chinese has two words for the future: 將來, “about to come”, the near and personal future of plans, and 未來, “not yet come”, the open and often grand future, the word Buddhist translation made.',
    caveat: 'The difference in register is the dictionaries’ and usage’s, not a strict rule.',
    dimension: 'sense', period: 'modern', cites: [{ source: 'moe-dict', locator: '將來; 未來' }] }),
  B('wang', 'wei-notyet', '望道而未之見', 'Gazing at the Way as If Not Yet Seen', 'Mencius 4B20', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius 4B20: 文王視民如傷，望道而未之見 — King Wen looked on the people as if they were wounded, and gazed toward the Way as though he had not yet seen it.',
    caveat: 'Zhu Xi reads 而 as 如, “as though”; others read it as plain fact.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '4B20', checked: ck(MENG, '離婁下 ¶23 in the transcription’s numbering: 文王視民如傷，望道而未之見') }] }),
  // XII → others
  B('lai', 'ru', '如來', 'The Thus-Come', 'Diamond Sutra', { type: 'CANONICAL_TRANSLATION',
    evidence: '如來 renders tathāgata, “thus-come” (or “thus-gone”). The Diamond Sutra plays on it: 如來者，無所從來，亦無所去，故名如來 — the Thus-Come comes from nowhere and goes nowhere, and so is called the Thus-Come.',
    dimension: 'translation', mechanism: 'calque', period: 'six_dynasties_tang',
    cites: [{ source: 'diamond', locator: 'T235 p. 752b04', checked: ck(JG, '如來者，無所從來，亦無所去，故名如來') }, { source: 'monier-williams', locator: 'tathāgata' }],
    gaps: ['Check tathāgata in Monier-Williams.'] }),
  B('wang', 'yue', '望 · 朢', 'The Full Moon Facing the Sun', 'Shuowen', { type: 'GRAPHIC_STRUCTURE',
    evidence: 'The Shuowen keeps a separate graph 朢, with 月 in it, for the full moon: 月滿與日相朢 — the full moon faces the sun. In the lunar calendar 望 is still the full-moon day.',
    caveat: 'Wording from general knowledge; check an edition of the Shuowen.',
    dimension: 'form', period: 'han', cites: [{ source: 'shuowen', locator: '壬部 朢' }] }),
  B('meng', 'hua', '夢 · 化', 'The Butterfly Dream', 'Zhuangzi ch. 2', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Zhuangzi 2: 昔者莊周夢為胡蝶 … 此之謂物化 — Zhuang Zhou dreamed he was a butterfly, woke, and did not know whether he was Zhou who had dreamed a butterfly or a butterfly dreaming Zhou: “this is called the transformation of things.”',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 2 齊物論' }] }),
  B('meng', 'ying', '如夢幻泡影', 'Dream and Shadow', 'Diamond Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Diamond Sutra’s last verse sets the two side by side: 一切有為法，如夢幻泡影 — all conditioned things are like a dream, an illusion, a bubble, a shadow.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'diamond', locator: 'T235 p. 752b28', checked: ck(JG, '一切有為法，如夢幻泡影') }] }),
  B('ming-fate', 'tian', '天命', 'The Mandate of Heaven', 'Analects 2.4', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 2.4: 五十而知天命 — “at fifty I knew the decree of Heaven”, between 四十而不惑 and 六十而耳順.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '2.4', checked: ck(LUNYU, '为政 ¶4: 四十而不惑，五十而知天命，六十而耳顺') }] }),
  B('ming-fate', 'si', '司命', 'The Master of Fate', 'Chuci, Nine Songs', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Two of the Nine Songs are for 大司命 and 少司命, the Greater and Lesser Masters of Fate. The greater says: 紛總總兮九州，何壽夭兮在予 — of all the crowds of the nine provinces, whether they live long or die young lies with me.',
    dimension: 'cosmos', period: 'pre_qin',
    cites: [{ source: 'chuci', locator: '九歌 · 大司命', checked: ck(CHUCI, '纷总总兮九州，何寿夭兮在予') }] }),
  B('jie', 'liang', '無量劫', 'Immeasurable Eons', 'Lotus Sutra', { type: 'CANONICAL_TRANSLATION',
    evidence: 'Buddhist time is counted in 無量劫, immeasurable kalpas. The Lotus Sutra: 於億無量劫，欲思佛實智，莫能知少分 — through a hundred million immeasurable eons, none could grasp the smallest part of the Buddha’s true wisdom.',
    dimension: 'translation', mechanism: 'phonetic_loan', period: 'six_dynasties_tang',
    cites: [{ source: 'lotus', locator: 'T262 p. 6a09', checked: ck(FH, '斯等共一心，於億無量劫，欲思佛實智，莫能知少分') }] }),
  B('jie', 'cheng', '成劫', 'The Eon of Formation', 'Abhidharmakośa ch. 3', { type: 'TEXTUAL_CONNECTION',
    evidence: '成劫, the eon of formation, is the first of the four: 所言成劫，謂從風起乃至地獄始有情生.',
    dimension: 'cosmos', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 63a09', checked: ck(KOSA, '所言成劫，謂從風起乃至地獄始有情生') }] }),
  B('wei-notyet', 'yi-change', '未濟 ䷿', 'The Book Ends Not Yet Across', 'Yijing', { type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'The sixty-third hexagram is 既濟, Already Across, and the sixty-fourth and last is 未濟, Not Yet Across. The Book of Changes does not end on completion; it ends on the not-yet.',
    dimension: 'symbol', period: 'shang_zhou', cites: [{ source: 'yijing', locator: 'hexagrams 63–64' }] }),
  B('hou', 'xiao', '無後為大', 'No Descendants Is the Greatest Failing', 'Mencius 4A26', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius 4A26: 不孝有三，無後為大 — of three ways to fail one’s parents, leaving no descendants is the greatest. Filial care reaches into the future.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '4A26', checked: ck(MENG, '離婁上 ¶36 in the transcription’s numbering: 不孝有三，無後為大') }] }),
  // XIII within
  B('yu-space', 'zhou-eon', '宇宙', 'Space and Time', 'Huainanzi; Shizi', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Huainanzi: 往古來今謂之宙，四方上下謂之宇 — past and present are called 宙, the four directions with up and down are called 宇. The Shizi has nearly the same words. Together they make the universe.',
    dimension: 'cosmos', period: 'han', cites: [{ source: 'huainanzi', locator: '齊俗訓' }, { source: 'shizi', locator: 'fragment' }],
    gaps: ['Open the Huainanzi and the Shizi fragment in editions; the wording differs between them.'] }),
  B('shei', 'yuan', '誰謂宋遠', 'Who Says It Is Far?', 'Odes, Hekuang', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Odes, Hekuang: 誰謂河廣？一葦杭之。誰謂宋遠？跂予望之 — “who says the river is wide? One reed would cross it. Who says Song is far? On tiptoe I can see it.” The question 誰 is asked against distance.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'shijing', locator: '衛風 · 河廣', checked: ck(SHI, '谁谓河广？一苇杭之。谁谓宋远？跂予望之') }] }),
  B('gu', 'ji-still', '孤寂', 'Alone and Silent', 'Modern Chinese', { type: 'SEMANTIC_CONTRAST',
    evidence: '孤寂 joins the two: 孤 is being without others, 寂 the silence around one who is. Together, loneliness.',
    dimension: 'sense', period: 'modern', cites: [{ source: 'moe-dict', locator: '孤寂' }] }),
  // XIII → others
  B('zhou-eon', 'shi-time', '宙 · 時', 'Time as Extent, Time as Moment', 'Huainanzi; Mencius', { type: 'SEMANTIC_CONTRAST',
    evidence: '宙 is all of time as one extent, 往古來今, past and present together. 時 is the season and the fitting moment. One is time as a dimension, the other as an occasion.',
    caveat: 'A contrast of senses drawn by Rushi from the two definitions, not a classical pairing.',
    dimension: 'sense', cites: [{ source: 'huainanzi', locator: '齊俗訓' }, { source: 'moe-dict', locator: '時' }] }),
  B('ji-still', 'kong', '空寂', 'Empty and Still', 'Vimalakīrti Sūtra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Vimalakīrti praises the Buddha who 善入於空寂行, enters well into the practice of emptiness and stillness.',
    dimension: 'practice', period: 'six_dynasties_tang',
    cites: [{ source: 'vimalakirti', locator: 'T475 p. 538a13', checked: ck(VK, '善入於空寂行') }] }),
  B('gu', 'de', '德不孤', 'Virtue Is Never Alone', 'Analects 4.25', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 4.25: 德不孤，必有鄰 — “virtue is not alone; it will have neighbours.”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '4.25', checked: ck(LUNYU, '里仁 ¶25: 德不孤，必有邻') }] }),
  P('gu', 'yi', '孤 · 一', 'The Solitary One',
    'Proposed pairing: 一 is the One that the Way gives birth to; 孤 is being one, alone. Rushi asks whether unity and loneliness are the same count, seen from inside and from outside.',
    'No classical text joins these graphs; the pairing is Rushi’s, as the Atlas planned.'),
  B('yuan', 'lai', '有朋自遠方來', 'A Friend from Far Away', 'Analects 1.1', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 1.1: 有朋自遠方來，不亦樂乎 — “to have a friend come from far away: is that not a joy?”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '1.1', checked: ck(LUNYU, '学而 ¶1: 有朋自远方来，不亦乐乎') }] }),
  P('yuan', 'guang', '遠 · 光', 'Distant Light',
    'Proposed pairing: light from far away is old light. A star seen tonight shows how it was when the light left it, so to look far is also to look back. In a silent sky, distance is time.',
    'The physics (light takes time to travel) is settled; joining it to 遠 and 光 is Rushi’s reading, not a Chinese source’s.'),
  B('yuan', 'hun', '魂營營', 'The Soul Restless Till Dawn', 'Chuci, Yuanyou', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Far Roaming: 夜耿耿而不寐兮，魂營營而至曙 — “awake all night, unable to sleep, my soul restless until dawn.” The longing to travel far begins in a soul that cannot rest.',
    dimension: 'sense', period: 'han',
    cites: [{ source: 'chuci', locator: '遠遊', checked: ck(CHUCI, '夜耿耿而不寐兮，魂营营而至曙') }] }),
  B('yuan', 'wang', '跂予望之', 'Seeing the Far on Tiptoe', 'Odes, Hekuang', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Hekuang: 誰謂宋遠？跂予望之 — Song is far, and still it can be seen from tiptoe. 遠 is answered by 望.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'shijing', locator: '衛風 · 河廣', checked: ck(SHI, '谁谓宋远？跂予望之') }] }),
  P('ta', 'er', '他 · 二', 'Is There a Second?',
    'Proposed pairing: 不二 teaches that self and other are not two. The Fermi question asks whether there is any other out there at all. Rushi sets them side by side: non-duality is a teaching about the one who asks; the silence is a fact about the sky.',
    'No source joins these; the pairing is Rushi’s, as the Atlas planned.'),
  B('shei', 'tian', '天問', 'Questions to Heaven', 'Chuci, Tianwen', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Tianwen, “Heavenly Questions”, asks Heaven 誰 again and again: 遂古之初，誰傳道之 … 冥昭瞢暗，誰能極之 — of the first beginning, who told it? Of light and dark still blurred, who could fathom it?',
    caveat: 'Wang Yi read the title as “questions about Heaven”, since Heaven itself may not be questioned; the sense of 天問 is debated.',
    dimension: 'cosmos', period: 'pre_qin',
    cites: [{ source: 'chuci', locator: '天問', checked: ck(CHUCI, '遂古之初，谁传道之？…冥昭瞢暗，谁能极之？') }] }),
  B('ting', 'yan', '聽其言', 'Listening to Words, Watching Deeds', 'Analects 5.10', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 5.10: 始吾於人也，聽其言而信其行；今吾於人也，聽其言而觀其行 — “once I listened to people’s words and trusted their deeds; now I listen to their words and watch their deeds.”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '5.10', checked: ck(LUNYU, '公冶长 ¶10: 听其言而信其行…听其言而观其行') }] }),
  P('ting', 'sheng-sound', '聽 · 聲', 'Listening for a Voice in the Silence',
    'Proposed pairing, read through two Daodejing lines: 聽之不聞名曰希 (ch. 14), what is listened for and not heard is called faint; and 大音希聲 (ch. 41), the great sound is faint of voice. Listening that hears nothing need not mean there is nothing.',
    'Both lines are real (not yet opened in an edition here); the bridge between them, and to listening for signals from the sky, is Rushi’s.',
    [{ source: 'daodejing', locator: 'chs. 14, 41' }]),
];
{
  const br = rd('bridges.json');
  for (const b of BRIDGES) if (!br.some((x) => x.id === b.id)) br.push(b);
  wr('bridges.json', br);
}
console.log(`XI–XIII: ${Object.values(SAT).flat().length} satellites, ${BRIDGES.length} bridges, ${Object.keys(SOURCES).length} sources`);
