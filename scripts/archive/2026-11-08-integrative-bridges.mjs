// Baracus, 2026-11-08: integrative bridges between systems that had no line between them.
// 78 system pairs; 28 had no bridge. This adds 26, one per pair, each from a passage that
// already sits in Rushi's sources. Two pairs (VI–XIII, VII–XIII) stay open: no passage
// earns them. Run from the repo root: node scripts/archive/2026-11-08-integrative-bridges.mjs
// Idempotent; a re-run changes nothing.
import fs from 'fs';

const D = process.cwd() + '/src/data/', DAY = '2026-11-08';
const CB = (n) => `https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/${n}.xml`;
const CP = (f) => `https://github.com/chinese-poetry/chinese-poetry (${f}; a community digital transcription, not a critical edition)`;
const ck = (edition, note, on = DAY) => ({ on, edition, note });
const ver = (c) => { const n = c.filter((x) => x.checked).length; return n === 0 ? 'unchecked' : n === c.length ? 'source' : 'partial'; };
const KOSA = CB('T29/T29n1558'), XJ = CB('T08/T08n0251'), YL = CB('T16/T16n0685'), YK = CB('T21/T21n1313'), NP = CB('T12/T12n0374');
const LUNYU = CP('論語/lunyu.json, simplified characters'), MENG = CP('四书五经/mengzi.json'), DX = CP('四书五经/daxue.json'), CHUCI = CP('楚辞/chuci.json, simplified characters');

const B = (from, to, label, title, subtitle, type, dimension, evidence, cites, extra = {}) => ({
  id: `bridge-${from}-${to}`, from, to, label, title, subtitle, type, evidence, ...extra, dimension, cites,
  status: 'WORKING', verification: ver(cites), drafted: 'Baracus', reviewed: DAY,
});

const BRIDGES = [
  B('shui', 'dao', '幾於道', 'Water Is Close to the Way', 'Daodejing ch. 8', 'TEXTUAL_CONNECTION', 'sense',
    'Daodejing 8: 上善若水 … 處眾人之所惡，故幾於道 — the highest good is like water; it settles where people disdain to be, “and so it is close to the Way.”',
    [{ source: 'daodejing', locator: 'ch. 8' }], { period: 'pre_qin' }),
  B('fa', 'shui', '灋 · 水', 'Law, Level as Water', 'Shuowen', 'ETYMOLOGICAL_SINITIC', 'form',
    'The Shuowen explains the old form of 法, 灋, by water: 平之如水，从水 — law makes things level, as water does.',
    [{ source: 'shuowen', locator: '廌部 灋' }], { caveat: 'The Shuowen’s explanation, from general knowledge; palaeographers debate the graph’s origin. Buddhist 法, dharma, is a later sense.', period: 'han' }),
  B('ci', 'lai', '慈氏 · 當來', 'The Kind One Who Is Still to Come', 'Maitreya', 'TEXTUAL_CONNECTION', 'sense',
    'Maitreya, called 慈氏 in Chinese, “the Kind One”, is the Buddha still to come: Buddhist texts name him 當來佛, the coming Buddha. 慈 and 來 meet in him.',
    [{ source: 'moe-dict', locator: '慈氏; 彌勒' }], { period: 'six_dynasties_tang' }),
  B('zhen', 'ren-person', '真人', 'The True Person', 'Zhuangzi ch. 6', 'TEXTUAL_CONNECTION', 'sense',
    'Zhuangzi 6 describes 古之真人, the true people of old, who slept without dreams and woke without worry, and says 有真人而後有真知 — there must be a true person before there is true knowledge.',
    [{ source: 'zhuangzi', locator: 'ch. 6 大宗師' }], { period: 'pre_qin' }),
  B('sheng-sound', 'feng', '天籟', 'The Piping of Heaven', 'Zhuangzi ch. 2', 'TEXTUAL_CONNECTION', 'sense',
    'Zhuangzi 2: 夫大塊噫氣，其名為風 — the great clod breathes out, and its name is wind. Every hollow of the forest then sounds in its own voice, the piping of earth, behind which stands the piping of heaven.',
    [{ source: 'zhuangzi', locator: 'ch. 2 齊物論' }], { period: 'pre_qin' }),
  B('yan', 'xing-walk', '言 · 行', 'Words, Then Deeds', 'Analects 5.10', 'TEXTUAL_CONNECTION', 'practice',
    'Analects 5.10: 聽其言而觀其行 — “now I listen to people’s words and watch their deeds.” Speech is weighed against conduct.',
    [{ source: 'analects', locator: '5.10', checked: ck(LUNYU, '公冶长 ¶10: 听其言而观其行') }], { period: 'pre_qin' }),
  B('sheng-sound', 'sheng-life', '聲 · 生', 'Two Words, One Sound', 'Unihan readings', 'SEMANTIC_CONTRAST', 'sound',
    '聲, sound, and 生, life, are both read shēng in Mandarin. The ids of these two stars had to carry gloss words for that reason; their meanings, and their graphs, are unrelated.',
    [{ source: 'unihan', locator: 'kMandarin 聲; 生', checked: ck('Unihan 18.0.0, via Mojidata (data-raw/moji.db)', 'Both read shēng; ingested 2026-11-05', '2026-11-05') }],
    { caveat: 'A homophone pair, not an etymological link.', period: 'modern' }),
  B('zhou-spell', 'shi-give', '陀羅尼 · 施', 'A Spell That Feeds the Hungry', 'Flaming Mouth sutra', 'TEXTUAL_CONNECTION', 'practice',
    'The sutra of the hungry ghost Flaming Mouth is itself a dhāraṇī text: 是名救焰口餓鬼及苦眾生陀羅尼經. Its spell makes one offering of food enough for countless hungry ghosts.',
    [{ source: 'yankou', locator: 'T1313 p. 465b26', checked: ck(YK, '是名救焰口餓鬼及苦眾生陀羅尼經') }], { period: 'six_dynasties_tang' }),
  B('yi-change', 'si-thought', '易無思也', 'Change Has No Thought', 'Yijing, Xici', 'TEXTUAL_CONNECTION', 'sense',
    'Xici, part one: 易無思也，無為也，寂然不動，感而遂通天下之故 — “the Changes have no thought and no action; still and unmoving, when stirred they reach through to everything under heaven.”',
    [{ source: 'yijing', locator: '繫辭上, §10' }], { caveat: 'The same line holds 無為 (the Pillars) and 寂 (the Fermi Paradox).', period: 'han' }),
  B('shi-time', 'xue', '學而時習之', 'Learning, Practised in Its Time', 'Analects 1.1', 'TEXTUAL_CONNECTION', 'practice',
    'Analects 1.1 opens the book: 學而時習之，不亦說乎 — “to learn, and practise it at the right times: is that not a pleasure?”',
    [{ source: 'analects', locator: '1.1', checked: ck(LUNYU, '学而 ¶1: 学而时习之，不亦说乎') }], { caveat: '時 here may mean “at the proper time” or “constantly”; commentators differ.', period: 'pre_qin' }),
  B('xiao', 'shi-give', '孝順 · 供養', 'Filial Care as Offering', 'Ullambana Sutra', 'TEXTUAL_CONNECTION', 'practice',
    'The Ullambana Sutra makes the offering an act of filial piety: 佛弟子修孝順者，應念念中常憶父母供養 — disciples who practise filial devotion should keep their parents in mind and make offerings for them.',
    [{ source: 'ullambana', locator: 'T685 p. 779c15', checked: ck(YL, '諸善男子善女人是佛弟子修孝順者應念念中常憶父母供養') }], { period: 'six_dynasties_tang' }),
  B('ding', 'shan', '艮 · 止 · 定', 'Mountain, Stopping, Stillness', 'Yijing; Daxue', 'TRADITIONAL_CORRESPONDENCE', 'practice',
    'The mountain trigram means stopping: 艮，止也. The Daxue makes stopping the door to stillness: 知止而後有定 — know where to stop, and then there is settledness.',
    [{ source: 'yijing', locator: '艮卦, 彖傳' }, { source: 'liji', locator: '大學', checked: ck(DX, '知止而后有定') }],
    { caveat: 'A chain through two texts (艮 = 止; 止 → 定), joined by Rushi; neither text names both stars.' }),
  B('hui', 'zhao', '般若 · 照見', 'Wisdom That Illuminates', 'Heart Sutra', 'TEXTUAL_CONNECTION', 'practice',
    'The Heart Sutra: 行深般若波羅蜜多時，照見五蘊皆空 — practising the depth of prajñā, the bodhisattva illuminated the five aggregates and saw them empty. Prajñā is the 慧 of this system; 照 is what it does.',
    [{ source: 'xinjing', locator: 'T251 p. 848c07', checked: ck(XJ, '照見五蘊皆空', '2026-11-05') }], { period: 'six_dynasties_tang' }),
  B('shi-conscious', 'sheng-life', '識 … 生', 'Consciousness to Birth in the Twelve Links', 'Abhidharmakośa ch. 3', 'TEXTUAL_CONNECTION', 'sense',
    'In the twelve links of dependent arising, 識, consciousness, is the third link and 生, birth, the eleventh: from ignorance, through consciousness, to birth, aging and death.',
    [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 51a05', checked: ck(KOSA, '謂無明緣行，乃至如是純大苦蘊集 — the check covers the chain’s formula, which the text abbreviates with 乃至', '2026-11-05') }],
    { period: 'six_dynasties_tang' }),
  B('jue', 'meng', '大覺 · 大夢', 'The Great Awakening and the Great Dream', 'Zhuangzi ch. 2', 'TEXTUAL_CONNECTION', 'sense',
    'Zhuangzi 2: 且有大覺而後知此其大夢也 — “only after a great awakening do we know that this was a great dream.”',
    [{ source: 'zhuangzi', locator: 'ch. 2 齊物論' }], { period: 'pre_qin' }),
  B('huo', 'ri', '離為火，為日', 'Fire and Sun Are One Trigram', 'Yijing, Shuogua', 'TRADITIONAL_CORRESPONDENCE', 'symbol',
    'The Shuogua gives the trigram 離 both images: 離為火，為日，為電 — it is fire, it is the sun, it is lightning.',
    [{ source: 'yijing', locator: '說卦, §11' }], { period: 'han' }),
  B('shui', 'xing-walk', '不盈科不行', 'Water Moves On When the Hollow Is Full', 'Mencius 7A24', 'TEXTUAL_CONNECTION', 'practice',
    'Mencius 7A24: 流水之為物也，不盈科不行；君子之志於道也，不成章不達 — flowing water does not go on until it has filled each hollow; one set on the Way does not arrive without completing each stage.',
    [{ source: 'mencius', locator: '7A24', checked: ck(MENG, '盡心上 ¶26 in the transcription’s numbering: 流水之為物也，不盈科不行') }], { period: 'pre_qin' }),
  B('shan', 'cheng', '為山未成', 'A Mountain Short One Basket', 'Analects 9.19', 'TEXTUAL_CONNECTION', 'practice',
    'Analects 9.19: 譬如為山，未成一簣，止，吾止也 — “it is like building a mountain: one basket short of finishing, if I stop, it is I who stopped.”',
    [{ source: 'analects', locator: '9.19', checked: ck(LUNYU, '子罕 ¶19: 譬如为山，未成一篑，止，吾止也') }], { period: 'pre_qin' }),
  B('jie', 'huo', '劫火', 'The Fire at the End of an Eon', 'Abhidharmakośa ch. 3', 'TEXTUAL_CONNECTION', 'cosmos',
    'In the Abhidharmakośa an eon of destruction ends in calamities, first of fire: 初火災興由七日現 — the fire calamity rises when seven suns appear, and 火災焚燒世界, it burns the world.',
    [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 66a26–b04', checked: ck(KOSA, '火災焚燒世界…初火災興由七日現') }], { period: 'six_dynasties_tang' }),
  B('ming-bright', 'xue', '明明德', 'The Way of Great Learning', 'Daxue', 'TEXTUAL_CONNECTION', 'sense',
    'The Daxue opens: 大學之道，在明明德 — “the way of great learning lies in making bright the bright virtue.”',
    [{ source: 'liji', locator: '大學', checked: ck(DX, '大学之道，在明明德') }], { period: 'pre_qin' }),
  B('ming-bright', 'sheng-life', '明生焉', 'Brightness Is Born', 'Yijing, Xici', 'TEXTUAL_CONNECTION', 'cosmos',
    'Xici, part two: 日往則月來，月往則日來，日月相推而明生焉 — the sun goes and the moon comes, the moon goes and the sun comes; sun and moon push each other on, “and brightness is born.”',
    [{ source: 'yijing', locator: '繫辭下, §5' }], { period: 'han' }),
  B('wen', 'si-death', '敢問死', 'Daring to Ask About Death', 'Analects 11.12', 'TEXTUAL_CONNECTION', 'sense',
    'Analects 11.12: 敢問死 — Zilu dares to ask about death, and is told 未知生，焉知死.',
    [{ source: 'analects', locator: '11.12', checked: ck(LUNYU, '先进 ¶12: 敢问死') }], { period: 'pre_qin' }),
  B('qiu', 'shi-food', '食無求飽', 'Eating Without Seeking to Be Full', 'Analects 1.14', 'TEXTUAL_CONNECTION', 'practice',
    'Analects 1.14: 君子食無求飽，居無求安 — the exemplary person eats without seeking to be full, and dwells without seeking comfort.',
    [{ source: 'analects', locator: '1.14', checked: ck(LUNYU, '学而 ¶14: 君子食无求饱，居无求安') }], { period: 'pre_qin' }),
  B('qiu', 'ming-fate', '得之有命', 'Seeking Has a Way, Finding Has a Decree', 'Mencius 7A3', 'TEXTUAL_CONNECTION', 'sense',
    'Mencius 7A3: 求之有道，得之有命 — there is a way to seek it, and whether one gets it is decreed. Seeking what lies outside oneself does not help one get it.',
    [{ source: 'mencius', locator: '7A3', checked: ck(MENG, '盡心上 ¶3: 求之有道，得之有命') }], { period: 'pre_qin' }),
  B('wen', 'shei', '天問', 'The Heavenly Questions', 'Chuci, Tianwen', 'TEXTUAL_CONNECTION', 'cosmos',
    'The Tianwen is a poem made only of 問: question after question to Heaven, most of them asking 誰 or 何, who or what. 遂古之初，誰傳道之？',
    [{ source: 'chuci', locator: '天問', checked: ck(CHUCI, '遂古之初，谁传道之？', '2026-11-05') }], { period: 'pre_qin' }),
  B('sheng-life', 'ji-still', '生滅滅已', 'When Arising and Passing Have Passed', 'Nirvana Sutra', 'TEXTUAL_CONNECTION', 'sense',
    'The Nirvana Sutra’s verse joins them: 生滅滅已，寂滅為樂 — when arising and passing away have themselves passed away, stillness is joy.',
    [{ source: 'nirvana', locator: 'T374 p. 451a01', checked: ck(NP, '生滅滅已，寂滅為樂', '2026-11-05') }], { period: 'six_dynasties_tang' }),
];

const p = D + 'bridges.json';
const br = JSON.parse(fs.readFileSync(p, 'utf8'));
let n = 0;
for (const b of BRIDGES) if (!br.some((x) => x.id === b.id)) { br.push(b); n++; }
fs.writeFileSync(p, JSON.stringify(br, null, 2) + '\n');
console.log(`added ${n} of ${BRIDGES.length} bridges`);
