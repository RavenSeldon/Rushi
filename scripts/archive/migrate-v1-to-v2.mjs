// ARCHIVED one-off migration (2026-11-04): v1 JS data → schema v2 JSON. Kept for provenance; it no longer runs, because the v1 files it read were removed.
import { writeFileSync, mkdirSync } from 'node:fs';
const ROOT = process.argv[2];
const { ANCHORS } = await import(ROOT + '/src/data/anchors.js');
const { BRIDGES } = await import(ROOT + '/src/data/bridges.js');

const c = (source, locator) => (locator ? { source, locator } : { source });
const U = 'unchecked', S2 = 'secondary';
// id: [dimension, mechanism, period, cites, extra]
const META = {
  'dao-form': ['form', null, 'shang_zhou', [c('jicheng', '道 graphs'), c('shuowen', '道')], { verification: S2 }],
  'dao-marga': ['translation', 'semantic_extension', 'han', [c('agamas', '八正道, passim')]],
  'dao-ziran': ['sense', null, 'pre_qin', [c('daodejing', 'ch. 25')]],
  'dao-jalan': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'jalan; aliran'), c('daodejing', 'ch. 8')]],
  'dao-logos': ['sense', 'independent_parallel', null, [c('daodejing', 'ch. 1'), c('lsj', 'λόγος'), c('tlfi', 'voie')]],
  'wu-dancer': ['form', null, 'shang_zhou', [c('heji', '無 graphs'), c('shuowen', '無')]],
  'wu-you': ['sense', null, 'pre_qin', [c('daodejing', 'ch. 2; ch. 40')]],
  'wu-sunyata': ['translation', 'semantic_extension', 'six_dynasties_tang', [c('daoxing-banruo', '本無品'), c('zhaolun', '不真空論')]],
  'wu-kosong': ['sense', 'independent_parallel', null, [c('daodejing', 'ch. 11'), c('kamus-dewan', 'tiada; kosong'), c('tlfi', 'néant')]],
  'wu-mu': ['practice', null, 'song_yuan', [c('wumenguan', 'case 1')], { type: 'ETYMOLOGICAL_SINITIC' }],
  'wei-elephant': ['form', null, 'shang_zhou', [c('heji', '為 graphs'), c('luo-zhenyu-1915'), c('shuowen', '為')]],
  'wei-tonal': ['sound', null, 'pre_qin', [c('downer-1959'), c('baxter-sagart-2014', 'the *-s suffix')]],
  'wei-asamskrta': ['translation', 'semantic_extension', 'six_dynasties_tang', [c('abhidharmakosa', '有為法 / 無為法'), c('agamas', '無為')]],
  'wei-nonagir': ['translation', 'calque', 'modern', [c('jullien-1996'), c('daodejing', 'ch. 37; ch. 48')], { type: 'CANONICAL_TRANSLATION' }],
  'wei-laku': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'perbuatan; tindakan; kelakuan')], { gaps: ['The Javanese sense of laku (spiritual discipline) needs a reference.'] }],
  'ai-etym': ['form', null, 'han', [c('shuowen', '㤅; 愛')], { verification: S2 }],
  'ai-maitri': ['translation', 'semantic_extension', 'six_dynasties_tang', [c('agamas', '十二因緣: 愛 = tṛṣṇā'), c('monier-williams', 'tṛṣṇā; maitrī')]],
  'ai-jianai': ['sense', null, 'pre_qin', [c('mozi', '兼愛 I–III'), c('mencius', '3B9')]],
  'ai-kasih': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'kasih; sayang; berahi'), c('lsj', 'ἀγάπη; φιλία; ἔρως')]],
  'ai-maitradvaita': ['interpretation', null, null, [c('rushi')], { status: 'OPEN_QUESTION', statusNote: 'Wording awaits Ben’s decision (roadmap: Decisions Only Ben Can Make).' }],
  'bu-oracle': ['form', null, 'shang_zhou', [c('heji', '不 graphs'), c('shuowen', '不')], { gaps: ['Name a modern palaeographic source for the calyx reading.'] }],
  'bu-eight': ['translation', 'calque', 'six_dynasties_tang', [c('zhonglun', 'dedicatory verses')], { gaps: ['Cite a source for Bhāviveka and prasajya-pratiṣedha.'] }],
  'bu-fou': ['sound', null, 'modern', [c('guangyun', '不'), c('moe-dict', '不')]],
  'bu-tidak': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'tidak; bukan')]],
  'er-advaya': ['translation', 'calque', 'six_dynasties_tang', [c('vimalakirti', 'ch. 9 入不二法門品'), c('monier-williams', 'advaya')]],
  'er-advaita': ['sense', null, null, [c('monier-williams', 'advaya; advaita')], { gaps: ['Cite a scholarly comparison of Buddhist advaya and Vedāntic advaita.'] }],
  'er-daoshu': ['sense', null, 'pre_qin', [c('zhuangzi', 'ch. 2 齊物論')]],
  'er-tiadadua': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'dua (tiada duanya)')], { gaps: ['French usage of non-dualité is uncited.'] }],
  'liang-tonal': ['sound', null, 'pre_qin', [c('moe-dict', '量'), c('baxter-sagart-2014', '量')], { verification: S2 }],
  'liang-pramana': ['translation', 'semantic_extension', 'six_dynasties_tang', [c('yinming-xuanzang', '現量; 比量'), c('pramanasamuccaya')]],
  'liang-wuliang': ['translation', 'calque', 'six_dynasties_tang', [c('agamas', '四無量心'), c('pure-land', '無量光; 無量壽')]],
  'liang-ukuran': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'ukuran; sukatan'), c('tlfi', 'mesure')]],
  'si-hou': ['form', null, 'shang_zhou', [c('shuowen', '司'), c('jicheng', '司母戊 / 后母戊 ding')], { verification: S2 }],
  'si-siming': ['sense', null, 'pre_qin', [c('chuci', '九歌: 大司命, 少司命'), c('analects', '8.4; 13.2')]],
  'si-kelola': ['sense', 'independent_parallel', null, [c('kamus-dewan', 'kelola; urus')]],
  'si-kubernao': ['sense', 'independent_parallel', null, [c('lsj', 'κυβερνάω'), c('tlfi', 'présider')]],
  'bridge-dao-wu': ['sense', null, 'pre_qin', [c('daodejing', 'ch. 1; ch. 40')]],
  'bridge-wu-wei': ['sense', null, 'pre_qin', [c('daodejing', 'ch. 37; ch. 48'), c('abhidharmakosa', '無為法')]],
  'bridge-wu-liang': ['translation', 'calque', 'six_dynasties_tang', [c('agamas', '四無量心'), c('pure-land', '無量光; 無量壽')]],
  'bridge-bu-er': ['translation', 'calque', 'six_dynasties_tang', [c('vimalakirti', 'ch. 9 入不二法門品')]],
  'bridge-ai-er': ['interpretation', null, null, [c('rushi')], { status: 'OPEN_QUESTION', statusNote: 'Wording awaits Ben’s decision (roadmap: Decisions Only Ben Can Make).' }],
  'bridge-liang-si': ['interpretation', null, null, [c('rushi')], { status: 'OPEN_QUESTION', statusNote: 'Ben to confirm whether this proposition is his to keep.' }],
};

// Sinosphere readings — sourced to Unihan, entered as WORKING until checked.
const READINGS = {
  dao: { cmn: 'dào', yue: 'dou6', ja: 'dō, tō', ko: '도 do', vi: 'đạo' },
  wu: { cmn: 'wú', yue: 'mou4', ja: 'mu, bu', ko: '무 mu', vi: 'vô', simplified: '无' },
  wei: { cmn: 'wéi, wèi', yue: 'wai4, wai6', ja: 'i', ko: '위 wi', vi: 'vi, vị', simplified: '为' },
  ai: { cmn: 'ài', yue: 'oi3', ja: 'ai', ko: '애 ae', vi: 'ái', simplified: '爱' },
  bu: { cmn: 'bù, fǒu', yue: 'bat1', ja: 'fu, bu', ko: '불 bul, 부 bu', vi: 'bất' },
  er: { cmn: 'èr', yue: 'ji6', ja: 'ni, ji', ko: '이 i', vi: 'nhị' },
  liang: { cmn: 'liáng, liàng', yue: 'loeng4, loeng6', ja: 'ryō', ko: '량 ryang', vi: 'lượng' },
  si: { cmn: 'sī', yue: 'si1', ja: 'shi', ko: '사 sa', vi: 'ti' },
};

const REVIEW_DATE = '2026-11-04';
const claim = (base, id) => {
  const m = META[id];
  if (!m) throw new Error('no metadata for ' + id);
  const [dimension, mechanism, period, cites, extra = {}] = m;
  const { source: _drop, kind: _k, ...rest } = base;
  const out = { ...rest };
  if (extra.type) out.type = extra.type;
  out.dimension = dimension;
  if (mechanism) out.mechanism = mechanism;
  if (period) out.period = period;
  out.cites = cites;
  out.status = extra.status || 'CANON';
  if (extra.statusNote) out.statusNote = extra.statusNote;
  out.verification = extra.verification || U;
  if (extra.gaps) out.gaps = extra.gaps;
  out.reviewed = REVIEW_DATE;
  return out;
};

mkdirSync(ROOT + '/src/data/anchors', { recursive: true });
for (const a of ANCHORS) {
  const { satellites, oc, ...rest } = a;
  const { simplified, ...readings } = READINGS[a.id];
  const doc = {
    ...rest,
    ...(simplified ? { simplified } : {}),
    oc: { form: oc, source: 'baxter-sagart-2014', verification: S2 },
    readings: { ...readings, source: 'unihan', status: 'WORKING', verification: U },
    satellites: satellites.map((s) => claim(s, s.id)),
  };
  doc.lorenz = doc.lorenz.map((v) => Math.round(v * 1e4) / 1e4);
  writeFileSync(`${ROOT}/src/data/anchors/${a.id}.json`, JSON.stringify(doc, null, 2) + '\n');
}
writeFileSync(ROOT + '/src/data/bridges.json', JSON.stringify(BRIDGES.map((b) => claim(b, b.id)), null, 2) + '\n');
writeFileSync(ROOT + '/src/data/realms.json', JSON.stringify([
  { id: 'pillars', name: 'The Pillars', numeral: 'I', attractor: 'lorenz', anchors: ANCHORS.map((a) => a.id) },
], null, 2) + '\n');
console.log('migrated', ANCHORS.length, 'anchors,', BRIDGES.length, 'bridges');
