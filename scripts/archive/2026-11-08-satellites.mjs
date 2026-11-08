// Baracus, 2026-11-08 (afternoon): satellites for the thinnest stars. 忠 had none; these
// stars had one. Every passage but 陽's was checked the same day against a digital
// transcription. Run from the repo root; idempotent, so a re-run changes nothing.
import fs from 'fs';

const D = process.cwd() + '/src/data/anchors/', DAY = '2026-11-08';
const CP = (f) => `https://github.com/chinese-poetry/chinese-poetry (${f}; a community digital transcription, not a critical edition)`;
const LY = CP('論語/lunyu.json, simplified characters'), MZ = CP('四书五经/mengzi.json'), DX = CP('四书五经/daxue.json'), SJ = CP('诗经/shijing.json, simplified characters');
const ck = (edition, note) => ({ on: DAY, edition, note });
const S = (anchor, id, glyph, title, evidence, cite, extra = {}) => [anchor, {
  id, glyph, title, lang: extra.lang || 'Classical Chinese', type: 'TEXTUAL_CONNECTION', evidence,
  ...(extra.caveat ? { caveat: extra.caveat } : {}), dimension: extra.dimension || 'sense', period: extra.period || 'pre_qin',
  cites: [cite], status: 'WORKING', verification: cite.checked ? 'source' : 'unchecked', drafted: 'Baracus', reviewed: DAY,
}];
const a = (loc, note) => ({ source: 'analects', locator: loc, checked: ck(LY, note) });
const m = (loc, note) => ({ source: 'mencius', locator: loc, checked: ck(MZ, note) });

const SATS = [
  S('zhong', 'zhong-sanxing', '為人謀而不忠乎', 'Was I Loyal in Planning for Others?',
    'Analects 1.4: Zengzi examines himself three times a day, and the first question is 為人謀而不忠乎 — “in planning for others, have I failed to give them my whole heart?” 忠 is wholeheartedness toward others before it is loyalty to a ruler.',
    a('1.4', '学而 ¶4: 为人谋而不忠乎'), { dimension: 'practice' }),
  S('zhong', 'zhong-zhongshu', '忠恕而已矣', 'The One Thread: Wholeheartedness and Reciprocity',
    'Analects 4.15: Confucius says his way has one thread running through it, and Zengzi explains: 夫子之道，忠恕而已矣 — “the Master’s way is wholeheartedness and reciprocity, nothing more.”',
    a('4.15', '里仁 ¶15: 夫子之道，忠恕而已矣')),
  S('ren-humane', 'ren-humane-airen', '愛人', 'Humaneness Is Loving People',
    'Analects 12.22: 樊遲問仁。子曰：愛人 — Fan Chi asks about 仁, and the answer is two characters: “love people.”',
    a('12.22', '颜渊 ¶22: 樊迟问仁。子曰：爱人')),
  S('ren-humane', 'ren-humane-keji', '克己復禮為仁', 'Mastering Oneself, Returning to the Rites',
    'Analects 12.1: 克己復禮為仁 — “to master oneself and return to the rites is humaneness.” Here 仁 is reached through 禮.',
    a('12.1', '颜渊 ¶1: 克己复礼为仁'), { caveat: 'The reading of 克己 (“overcome the self” or “discipline oneself”) is debated.' }),
  // 必也正名乎 (Analects 13.3) is already the bridge 名 · 言 (bridge-ming-yan); not repeated here.
  S('shi-real', 'shi-real-mingshi', '先名實者', 'Name and Substance',
    'Mencius 6B6: Chunyu Kun says 先名實者，為人也 — those who put name and substance first act for others. The pair 名實, name and reality, becomes a classical topic of its own.',
    m('6B6', '告子下 ¶25 in the transcription’s numbering: 先名實者，為人也')),
  S('yang', 'yang-yiyin', '一陰一陽之謂道', 'One Yin, One Yang: That Is the Way',
    'Xici, part one: 一陰一陽之謂道 — “one yin, one yang: this is called the Way.” Neither alone; their alternation.',
    { source: 'yijing', locator: '繫辭上, §5' }, { period: 'han' }),
  S('shan', 'shan-dongshan', '登東山而小魯', 'From the Mountain, the State Looks Small',
    'Mencius 7A24: 孔子登東山而小魯 — Confucius climbed the eastern hill and Lu looked small; climbing Mount Tai, the whole world looked small. What one has seen of the sea makes other waters hard to call water.',
    m('7A24', '盡心上 ¶26 in the transcription’s numbering: 孔子登東山而小魯'), { caveat: 'The check covers the first clause; the rest is paraphrase of the same passage.' }),
  S('ri', 'ri-shi', '如日月之食焉', 'Faults Like an Eclipse',
    'Analects 19.21: 君子之過也，如日月之食焉 — the exemplary person’s faults are like eclipses of the sun and moon: everyone sees them, and when they are corrected, everyone looks up.',
    a('19.21', '子张 ¶21: 君子之过也，如日月之食焉')),
  S('xing', 'xing-xiaoxing', '嘒彼小星', 'Those Little Stars',
    'The Odes, Xiaoxing: 嘒彼小星，三五在東。肅肅宵征，夙夜在公。寔命不同 — faint little stars, three or five in the east; hurrying by night, early and late on duty: “truly, our fates are not the same.”',
    { source: 'shijing', locator: '召南 · 小星', checked: ck(SJ, '小星: 嘒彼小星，三五在东…寔命不同') }),
  S('ye', 'ye-zhouye', '不舍晝夜', 'Not Resting, Day or Night',
    'Analects 9.17: by the river, Confucius says 逝者如斯夫，不舍晝夜 — “it passes on like this, never resting, day or night.”',
    a('9.17', '子罕 ¶17: 逝者如斯夫，不舍昼夜')),
  S('xue', 'xue-zhiyu', '十有五而志于學', 'At Fifteen, Set on Learning',
    'Analects 2.4: 吾十有五而志于學 — “at fifteen I set my heart on learning”, the first step of the life that runs to 不踰矩 at seventy.',
    a('2.4', '为政 ¶4: 吾十有五而志于学'), { dimension: 'practice' }),
  S('cheng', 'cheng-chengmei', '成人之美', 'Helping Others Complete What Is Good in Them',
    'Analects 12.16: 君子成人之美，不成人之惡 — the exemplary person brings others’ good to completion, and does not bring their bad to completion. 成 is something done for someone else.',
    a('12.16', '颜渊 ¶16: 君子成人之美')),
  S('shi-begin', 'shi-begin-benmo', '事有終始', 'Things Have Ends and Beginnings',
    'The Daxue: 物有本末，事有終始，知所先後，則近道矣 — things have roots and branches, affairs have ends and beginnings; know what comes first and what after, and you are near the Way.',
    { source: 'liji', locator: '大學', checked: ck(DX, '物有本末，事有終始') }),
  S('gui', 'gui-chan', '非其鬼而祭之', 'Sacrificing to Someone Else’s Ghosts',
    'Analects 2.24: 非其鬼而祭之，諂也 — to sacrifice to spirits that are not one’s own is flattery. Ghosts here are ancestors, owed rites by their own descendants.',
    a('2.24', '为政 ¶24: 非其鬼而祭之，谄也'), { dimension: 'practice' }),
  S('ke', 'ke-ganyin', '渴者甘飲', 'To the Thirsty, Any Drink Is Sweet',
    'Mencius 7A27: 飢者甘食，渴者甘飲 — the hungry find any food sweet, the thirsty any drink; hunger and thirst spoil the palate, and need can spoil the heart the same way.',
    m('7A27', '盡心上 ¶29 in the transcription’s numbering: 飢者甘食，渴者甘飲')),
  S('jiang', 'jiang-darren', '天將降大任', 'When Heaven Is About to Confer a Great Task',
    'Mencius 6B15: 天將降大任於是人也，必先苦其心志 — when Heaven is about to lay a great task on someone, it first troubles their heart and will. 將 is the hinge between hardship now and the task to come.',
    m('6B15', '告子下 ¶53 in the transcription’s numbering: 天將降大任於是人也')),
  S('hou', 'hou-housu', '繪事後素', 'The Painting Comes After the Plain Ground',
    'Analects 3.8: 繪事後素 — painting comes after the plain silk; and Zixia sees that the rites, too, come after (後) what they adorn. 後 is order, not only time.',
    a('3.8', '八佾 ¶8: 绘事后素'), { caveat: 'Whether 後素 means “after the white ground” or “the white is applied last” is a classic dispute.' }),
  S('yuan', 'yuan-zhongdao', '任重而道遠', 'The Load Is Heavy, the Road Is Long',
    'Analects 8.7: 士不可以不弘毅，任重而道遠 — a scholar must be broad and resolute, for the load is heavy and the road is long. 仁以為己任 … 死而後已 — humaneness is the load, and it ends only at death.',
    a('8.7', '泰伯 ¶7: 任重而道远')),
];

let n = 0;
for (const [anchor, sat] of SATS) {
  const p = D + anchor + '.json';
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!j.satellites.some((s) => s.id === sat.id)) { j.satellites.push(sat); n++; }
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
console.log(`added ${n} of ${SATS.length} satellites`);
