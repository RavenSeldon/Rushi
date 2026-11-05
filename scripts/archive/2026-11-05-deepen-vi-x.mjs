// Baracus, 2026-11-05: deepen Realms VI–X. Archived for provenance: its output is already in src/data.
// Run from the repo root (node scripts/archive/2026-11-05-deepen-vi-x.mjs); idempotent, so a re-run changes nothing.
import fs from 'fs';
const D = 'src/data/', DAY = '2026-11-05';
const rd = p => JSON.parse(fs.readFileSync(D + p, 'utf8'));
const wr = (p, j) => fs.writeFileSync(D + p, JSON.stringify(j, null, 2) + '\n');
const CB = n => `https://raw.githubusercontent.com/cbeta-org/xml-p5/master/T/${n}.xml`;
const CP = f => `https://github.com/chinese-poetry/chinese-poetry (${f}; a community digital transcription, not a critical edition)`;
const ck = (edition, note) => ({ on: DAY, edition, note });
const ver = cites => { const n = cites.filter(c => c.checked).length; return n === 0 ? 'unchecked' : n === cites.length ? 'source' : 'partial'; };
const claim = o => ({ ...o, status: 'WORKING', verification: ver(o.cites), drafted: 'Baracus', reviewed: DAY });

// Opened passages
const KOSA = CB('T29/T29n1558'), XJ = CB('T08/T08n0251'), JG = CB('T08/T08n0235'), LY = CB('T19/T19n0945'),
  FY = CB('T54/T54n2131'), TJ = CB('T48/T48n2008'), WLS = CB('T12/T12n0360'), WS = CB('T31/T31n1585'), FH = CB('T09/T09n0262');
const LUNYU = CP('論語/lunyu.json, simplified characters'), MENG = CP('四书五经/mengzi.json');

const SOURCES = {
  chengweishi: { kind: 'primary', title: '成唯識論 Cheng weishi lun, compiled and tr. Xuanzang, T1585', date: '659 CE', url: 'https://cbetaonline.dila.edu.tw/T1585' },
  'platform-sutra': { kind: 'primary', title: '六祖大師法寶壇經 Platform Sutra, Zongbao edition, T2008', date: '1291', url: 'https://cbetaonline.dila.edu.tw/T2008' },
  shurangama: { kind: 'primary', title: '大佛頂首楞嚴經 Śūraṅgama Sūtra, T945', date: 'c. 705 CE', url: 'https://cbetaonline.dila.edu.tw/T0945' },
  'fanyi-mingyi': { kind: 'primary', title: '翻譯名義集 Fanyi mingyi ji, Fayun, T2131', date: '1143', url: 'https://cbetaonline.dila.edu.tw/T2131' },
  diamond: { kind: 'primary', title: '金剛般若波羅蜜經 (Vajracchedikā, the Diamond Sutra), tr. Kumārajīva, T235', date: '402 CE', url: 'https://cbetaonline.dila.edu.tw/T0235' },
  'chunqiu-fanlu': { kind: 'primary', title: '春秋繁露 Chunqiu fanlu, attributed to Dong Zhongshu', url: 'https://ctext.org/chun-qiu-fan-lu' },
  liezi: { kind: 'primary', title: '列子 Liezi', url: 'https://ctext.org/liezi' },
  'shiniu-tu': { kind: 'primary', title: '十牛圖頌 Ten Oxherding Pictures, Kuoan Shiyuan, with verses', date: '12th c.', url: 'https://cbetaonline.dila.edu.tw/X1269' },
};

const SAT = {
  'yi-intent': [claim({ id: 'yi-intent-manas', glyph: 'मनस् · Manas', title: 'Mind, the Sixth Sense-Base', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: 'In Buddhist translation 意 renders manas, the mind counted as a sixth faculty beside eye, ear, nose, tongue and body. The Heart Sutra runs the list as 無眼耳鼻舌身意, “no eye, ear, nose, tongue, body, mind”.',
    caveat: 'Everyday 意 is intention or meaning; the faculty is a technical Buddhist sense of the same graph.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'xinjing', locator: 'T251 p. 848c10', checked: ck(XJ, '是故空中無色，無受想行識，無眼耳鼻舌身意') },
      { source: 'monier-williams', locator: 'manas' }], gaps: ['Check manas in Monier-Williams.'] })],
  'shi-conscious': [claim({ id: 'shi-conscious-alaya', glyph: '阿賴耶識 · Ālaya-vijñāna', title: 'The Storehouse Consciousness', lang: 'Sanskrit → Chinese (Yogācāra)', type: 'CANONICAL_TRANSLATION',
    evidence: 'Yogācāra counts eight consciousnesses: six of the senses, then manas, transcribed 末那, then the ālaya-vijñāna, 阿賴耶識. The Cheng weishi lun names the first transformation 初阿賴耶識, and makes 末那 the support on which the sixth, 意識, turns.',
    caveat: 'A hybrid rendering: 阿賴耶 keeps ālaya by sound, while 識 translates vijñāna.',
    dimension: 'translation', mechanism: 'phonetic_loan', period: 'six_dynasties_tang',
    cites: [{ source: 'chengweishi', locator: 'T1585 p. 7c15; p. 14a24–25', checked: ck(WS, '頌曰：初阿賴耶識…; 又與末那為依止故，第六意識依之而轉') }] })],
  nian: [claim({ id: 'nian-shinian', glyph: '乃至十念', title: 'Even Ten Recollections', lang: 'Chinese Pure Land', type: 'TEXTUAL_CONNECTION',
    evidence: 'The vow of the Sutra of Immeasurable Life numbered eighteenth reads: 至心信樂，欲生我國，乃至十念，若不生者，不取正覺 — beings who wish with sincere trust to be born in that land, “even with ten recollections”. Later Pure Land teachers read these 念 as recitations of the Buddha’s name, so 念 came to mean recollecting and saying at once.',
    caveat: 'Whether 十念 means ten thoughts or ten recitations is a classic Pure Land dispute that the passage alone does not settle; numbering the vows is conventional.',
    dimension: 'practice', period: 'six_dynasties_tang',
    cites: [{ source: 'pure-land', locator: 'T360 p. 268a27', checked: ck(WLS, '十方眾生至心信樂欲生我國乃至十念若不生者不取正覺') }] })],
  jue: [claim({ id: 'jue-zhengjue', glyph: '正覺 · Sambodhi', title: 'Right Awakening', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: '覺 renders bodhi, awakening, and 正覺 renders sambodhi, full awakening. In the Sutra of Immeasurable Life the vows end one after another with 不取正覺, “may I not take right awakening” unless the vow is fulfilled.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'pure-land', locator: 'T360 p. 267c17 ff.', checked: ck(WLS, '設我得佛，國有地獄、餓鬼、畜生者，不取正覺 — the formula recurs through the vows') },
      { source: 'monier-williams', locator: 'bodhi; saṃbodhi' }], gaps: ['Check bodhi and saṃbodhi in Monier-Williams.'] })],
  'wu-awaken': [claim({ id: 'wu-awaken-dunwu', glyph: '頓悟頓修', title: 'Sudden Awakening, Sudden Practice', lang: 'Chinese Chan', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Platform Sutra makes 頓悟 its watchword: 自性自悟，頓悟頓修，亦無漸次 — “one’s own nature awakens itself; awakening is sudden, practice is sudden, and there are no gradual stages.”',
    caveat: 'This is the Yuan edition in the Taishō; the Dunhuang manuscript is shorter. The sudden–gradual opposition is partly the polemic of the later Southern school.',
    dimension: 'practice', period: 'song_yuan',
    cites: [{ source: 'platform-sutra', locator: 'T2008 p. 358c28', checked: ck(TJ, '自性自悟，頓悟頓修，亦無漸次') }],
    gaps: ['Compare the Dunhuang text (T2007).'] })],
  ding: [claim({ id: 'ding-sanxue', glyph: '戒 · 定 · 慧', title: 'The Three Trainings', lang: 'Chinese Buddhist textual usage', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Śūraṅgama Sūtra: 攝心為戒，因戒生定，因定發慧，是則名為三無漏學 — “gathering the mind is discipline; from discipline arises concentration; from concentration, wisdom: these are called the three untainted trainings.”',
    caveat: 'Many scholars hold the Śūraṅgama to be a Chinese composition of the early eighth century; the triad śīla, samādhi, prajñā is far older.',
    dimension: 'practice', period: 'six_dynasties_tang',
    cites: [{ source: 'shurangama', locator: 'T945 p. 131c14', checked: ck(LY, '攝心為戒因戒生定因定發慧是則名為三無漏學') }] })],
  hui: [claim({ id: 'hui-wuzhong-bufan', glyph: '五種不翻', title: 'Why 般若 Was Kept by Sound', lang: 'Sanskrit → Chinese (translation theory)', type: 'CANONICAL_TRANSLATION',
    evidence: 'Xuanzang named five kinds of word to transcribe rather than translate. The fifth is 生善故, “to give rise to the good”: 般若尊重，智慧輕淺 — prajñā is weighty, 智慧 is slight. So 慧 can render prajñā in a list, while the sūtras keep 般若 by its sound.',
    caveat: 'Xuanzang’s rule is reported five centuries later, in the prefatory matter of the Fanyi mingyi ji (1143).',
    dimension: 'translation', mechanism: 'phonetic_loan', period: 'six_dynasties_tang',
    cites: [{ source: 'fanyi-mingyi', locator: 'T2131 p. 1055a14–17', checked: ck(FY, '唐奘法師論五種不翻：一祕密故，如陀羅尼… 五生善故，如般若尊重，智慧輕淺') }],
    gaps: ['Identify the author of the preface (traditionally Zhou Dunyi).'] })],
  'si-thought': [claim({ id: 'si-thought-cetana', glyph: 'चेतना · Cetanā', title: 'Volition, a Universal Factor', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: 'In the Abhidharmakośa 思 renders cetanā, volition. It is one of ten factors present in every moment of mind: 受想思觸欲，慧念與作意，勝解三摩地，遍於一切心 — the same verse holds 慧, 念 and 三摩地, three more stars of Knowing.',
    caveat: 'Classical 思 is thinking or longing; cetanā as volition is a technical sense.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 2 分別根品, p. 19a14', checked: ck(KOSA, '頌曰：受想思觸欲，慧念與作意，勝解三摩地，遍於一切心') },
      { source: 'monier-williams', locator: 'cetanā' }], gaps: ['Check cetanā in Monier-Williams.'] })],

  jin: [claim({ id: 'jin-vajra', glyph: '金剛 · Vajra', title: 'Adamant, Thunderbolt', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: '金剛, “the hardest metal”, renders vajra, the thunderbolt and diamond that cuts and cannot be cut. Kumārajīva titled the Vajracchedikā 金剛般若波羅蜜經.',
    caveat: 'The Five Phases’ 金 and the Buddhist 金剛 share a graph, not a system.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'diamond', locator: 'T235 p. 748c17 (title)', checked: ck(JG, '金剛般若波羅蜜經，姚秦天竺三藏鳩摩羅什譯') },
      { source: 'monier-williams', locator: 'vajra' }], gaps: ['Check vajra in Monier-Williams.'] })],
  mu: [claim({ id: 'mu-yueling', glyph: '盛德在木', title: 'Spring’s Virtue Is in Wood', lang: 'Classical Chinese', type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'The Yueling chapter of the Liji files each season under a phase. At the start of spring the announcement is 盛德在木, “the abundant virtue is in Wood”, and the same month takes the sour taste, scaled creatures and the note jue.',
    caveat: 'A correspondence within a calendrical system; Baracus’s, from general knowledge.',
    dimension: 'symbol', period: 'pre_qin', cites: [{ source: 'liji', locator: '月令, 孟春' }] })],
  shui: [
    claim({ id: 'shui-shangshan', glyph: '上善若水', title: 'The Highest Good Is Like Water', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
      evidence: 'Daodejing 8: 上善若水。水善利萬物而不爭 — “the highest good is like water: water benefits the ten thousand things and does not contend.” The chapter goes on that water is therefore 幾於道, close to the Way.',
      dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'ch. 8' }] }),
    claim({ id: 'shui-ap', glyph: 'आपः · Āpaḥ', title: 'Water, a Great Element', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
      evidence: 'The Abhidharmakośa counts four great elements, 地水火風, and defines them by hardness, wetness, warmth and motion: 堅濕煖動. 水 renders āpaḥ, water, as the element of wetness.',
      caveat: 'Four elements here, not five phases: the Buddhist list has no Metal or Wood.',
      dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
      cites: [{ source: 'abhidharmakosa', locator: 'ch. 1, p. 3a28–b01', checked: ck(KOSA, '大種謂四界，即地水火風，能成持等業，堅濕煖動性') },
        { source: 'monier-williams', locator: 'ap' }], gaps: ['Check ap in Monier-Williams.'] })],
  huo: [claim({ id: 'huo-tejas', glyph: 'तेजस् · Tejas', title: 'Fire, the Element of Warmth', lang: 'Sanskrit → Chinese', type: 'CANONICAL_TRANSLATION',
    evidence: '火 renders tejas, fire, the third of the four great elements 地水火風, whose nature is warmth, 煖.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 1, p. 3a28–b01', checked: ck(KOSA, '大種謂四界，即地水火風，能成持等業，堅濕煖動性') },
      { source: 'monier-williams', locator: 'tejas' }], gaps: ['Check tejas in Monier-Williams.'] })],
  tu: [claim({ id: 'tu-jiase', glyph: '土爰稼穡', title: 'Earth Is Sowing and Reaping', lang: 'Classical Chinese', type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'The Hongfan names each phase by what it does: 水曰潤下，火曰炎上，木曰曲直，金曰從革，土爰稼穡 — water soaks downward, fire flames upward, wood bends and straightens, metal yields and is reshaped, and earth is where sowing and reaping happen.',
    caveat: 'Only Earth takes 爰 rather than 曰; commentators have read the change as setting Earth apart. Baracus’s, from general knowledge.',
    dimension: 'symbol', period: 'pre_qin', cites: [{ source: 'shangshu', locator: '洪範' }] })],
  lei: [claim({ id: 'lei-shuogua', glyph: '雷以動之', title: 'Thunder Sets Things Moving', lang: 'Classical Chinese', type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'The Shuogua gives each trigram its work: 雷以動之，風以散之，雨以潤之，日以烜之，艮以止之 — thunder moves things, wind scatters them, rain moistens, the sun dries, Gen stops them.',
    dimension: 'symbol', period: 'han', cites: [{ source: 'yijing', locator: '說卦, §4' }] })],

  guang: [claim({ id: 'guang-heguang', glyph: '和其光，同其塵', title: 'Soften the Light, Join the Dust', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Daodejing 4 and 56: 挫其銳，解其紛，和其光，同其塵 — “blunt the sharpness, untie the tangles, soften the glare, be one with the dust.” Light here is something to temper, not to maximize; the later idiom 和光同塵 comes from these lines.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'chs. 4, 56' }] })],
  yue: [claim({ id: 'yue-zhiyue', glyph: '以手指月', title: 'The Finger Pointing at the Moon', lang: 'Chinese Buddhist textual usage', type: 'TEXTUAL_CONNECTION',
    evidence: 'The Śūraṅgama Sūtra: 如人以手指月示人，彼人因指當應看月 — “as when someone points at the moon to show it to another, that person should follow the finger and look at the moon.” To take the finger for the moon is to lose both.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'shurangama', locator: 'T945 p. 111a09', checked: ck(LY, '汝等尚以緣心聽法，此法亦緣，非得法性。如人以手指月示人，彼人因指當應看月') }] })],
  ying: [claim({ id: 'ying-jing-buxi', glyph: '景不徙', title: 'The Shadow Does Not Move', lang: 'Classical Chinese (Mohist optics)', type: 'TEXTUAL_CONNECTION',
    evidence: '影 was written 景 in early texts; the 彡 was added later. The Mohist Canon uses 景 for shadow in its optics: 景不徙，說在改為 — “the shadow does not move; the explanation lies in its being remade”, moment by moment.',
    caveat: 'The relation 景 → 影 is the traditional account; check historical forms. The translation follows the usual reading, Baracus’s from general knowledge.',
    dimension: 'form', period: 'pre_qin', cites: [{ source: 'mozi', locator: '經下 (Canon B)' }, { source: 'shuowen', locator: '景' }] })],

  qiu: [claim({ id: 'qiu-fangxin', glyph: '求其放心', title: 'Seeking the Strayed Heart', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius: 仁，人心也；義，人路也 … 人有雞犬放，則知求之；有放心，而不知求。學問之道無他，求其放心而已矣 — people seek their strayed chickens and dogs but not their strayed heart; “the way of learning is nothing else: to seek the strayed heart.”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '6A11', checked: ck(MENG, '告子上 ¶28 in the transcription’s numbering: 仁，人心也；義，人路也…學問之道無他，求其放心而已矣') }] })],
  wen: [claim({ id: 'wen-xiawen', glyph: '不恥下問', title: 'Not Ashamed to Ask Below', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 5.15: Kong Wenzi earned the name 文 because he was 敏而好學，不恥下問 — “quick, fond of learning, and not ashamed to ask those beneath him.”',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '5.15', checked: ck(LUNYU, '公冶长 ¶15: 敏而好学，不耻下问，是以谓之文也') }] })],
  xun: [claim({ id: 'xun-xunniu', glyph: '尋牛', title: 'Searching for the Ox', lang: 'Chinese Chan', type: 'TEXTUAL_CONNECTION',
    evidence: 'The first of Kuoan’s Ten Oxherding Pictures is 尋牛, searching for the ox. The series runs from seeking the ox to forgetting both ox and self, an empty circle, and then returning to the marketplace.',
    caveat: 'The ox is commonly read as one’s own mind or nature, a reading the pictures invite but do not state. Baracus’s, from general knowledge.',
    dimension: 'practice', period: 'song_yuan', cites: [{ source: 'shiniu-tu', locator: '§1 尋牛' }] })],
  tan: [claim({ id: 'tan-lizhu', glyph: '驪龍頷下', title: 'The Pearl Beneath the Black Dragon’s Chin', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Zhuangzi 32 (Lie Yukou): 千金之珠，必在九重之淵而驪龍頷下 — a pearl worth a thousand gold lies in the ninefold deep under the chin of the black dragon. The idiom 探驪得珠, reaching under the dragon for the pearl, comes from this story.',
    caveat: 'In the story the pearl was taken while the dragon slept, and the tale is a warning; the idiom’s praise of a successful search is later.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 32 列御寇' }] })],
  lu: [claim({ id: 'lu-wangyang', glyph: '多歧亡羊', title: 'Too Many Forks, the Sheep Is Lost', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Liezi, Shuofu: a neighbour’s sheep is lost because the road forks and forks again, and the moral drawn is 大道以多歧亡羊，學者以多方喪生 — the great road loses its sheep through many forks, the learner loses their life through many methods.',
    caveat: 'The Liezi’s date is disputed; many place its received text around 300 CE.',
    dimension: 'sense', period: 'six_dynasties_tang', cites: [{ source: 'liezi', locator: '說符' }] })],
  men: [claim({ id: 'men-zhongmiao', glyph: '衆妙之門', title: 'The Gate of All Mysteries', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Daodejing 1 ends: 玄之又玄，衆妙之門 — “dark and darker still: the gate of all mysteries.” The first chapter of the Way closes on a door.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'ch. 1' }] })],

  hua: [claim({ id: 'hua-zaohua', glyph: '造化', title: 'The Great Smith of Change', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Zhuangzi 6 (Dazongshi): 今一以天地為大鑪，以造化為大冶，惡乎往而不可哉 — “take heaven and earth as the great furnace and the maker-of-change as the great smith: where could I go that would not do?”, said by a dying man who will not ask to be recast as anything in particular.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 6 大宗師' }] })],
  bian: [claim({ id: 'bian-qiong', glyph: '窮則變', title: 'At the Limit, Change', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Xici, part two: 易窮則變，變則通，通則久 — “when change reaches its limit it alters; altering, it gets through; getting through, it lasts.” The everyday 變通 on this card comes from this chain.',
    dimension: 'sense', period: 'han', cites: [{ source: 'yijing', locator: '繫辭下, §2' }] })],
  chang: [claim({ id: 'chang-jiushi', glyph: '長生久視', title: 'Long Life, Lasting Sight', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Daodejing 59 ends: 深根固柢，長生久視之道 — “deep roots and a firm base: the way of long life and lasting vision.” 長 here is cháng, length of time; 長 zhǎng, growing up, is the same graph.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'ch. 59' }] })],
  'si-death': [claim({ id: 'si-death-weizhisheng', glyph: '未知生，焉知死', title: 'Not Yet Knowing Life', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 11.12: asked about death, Confucius answers 未知生，焉知死 — “not yet knowing life, how could I know death?” In the same exchange: 未能事人，焉能事鬼, not yet able to serve people, how serve the dead?',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'analects', locator: '11.12', checked: ck(LUNYU, '先进 ¶12: 未能事人，焉能事鬼？…未知生，焉知死？') }] })],
};

// Placeholders the earlier pass left (glyph = the bare character + a dictionary gloss) are replaced.
const REPLACE = {
  ri: claim({ id: 'ri-shuowen', glyph: '日，實也', title: 'The Sun Is the Full', lang: 'Han lexicography', type: 'ETYMOLOGICAL_SINITIC',
    evidence: 'The Shuowen defines by sound: 日，實也。太陽之精不虧 — “日 is 實, the full: the essence of great yang, which never wanes.” Its partner is 月，闕也, “月 is 闕, the wanting.” Sun and moon are glossed by words that sound like them and name their difference.',
    caveat: 'A sound gloss (聲訓) is Han hermeneutics, not historical etymology.',
    dimension: 'sound', period: 'han', cites: [{ source: 'shuowen', locator: '日部 日' }] }),
  yue: claim({ id: 'yue-shuowen', glyph: '月，闕也', title: 'The Moon Is the Wanting', lang: 'Han lexicography', type: 'ETYMOLOGICAL_SINITIC',
    evidence: 'The Shuowen: 月，闕也。大陰之精 — “月 is 闕, the gap: the essence of great yin.” The moon is named for its waning, against 日，實也, the sun that is always full.',
    caveat: 'A sound gloss (聲訓) is Han hermeneutics, not historical etymology.',
    dimension: 'sound', period: 'han', cites: [{ source: 'shuowen', locator: '月部 月' }] }),
  ye: claim({ id: 'ye-yeqi', glyph: '夜氣', title: 'The Night Air', lang: 'Classical Chinese', type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius’s Ox Mountain: cut every day, the hill still puts out shoots from 日夜之所息, what rests by day and night. So a person’s goodness is restored by the night air, 夜氣; if 夜氣不足以存, “the night air is not enough to preserve it”, they are not far from the beasts.',
    dimension: 'sense', period: 'pre_qin',
    cites: [{ source: 'mencius', locator: '6A8', checked: ck(MENG, '告子上 ¶25 in the transcription’s numbering: 牛山之木嘗美矣…是其日夜之所息…夜氣不足以存') }] }),
  cheng: claim({ id: 'cheng-chengzhuhuaikong', glyph: '成住壞空', title: 'Formation, Abiding, Decay, Emptiness', lang: 'Sanskrit → Chinese (Abhidharma cosmology)', type: 'CANONICAL_TRANSLATION',
    evidence: 'The Abhidharmakośa divides a great eon into four ages of twenty intermediate eons each: 成住壞空, formation, abiding, destruction and emptiness, eighty in all. A world completes itself, lasts, comes apart, and lies empty before forming again.',
    dimension: 'cosmos', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 3 分別世品, p. 62c–63b07', checked: ck(KOSA, '如是所說成住壞空，各二十中，積成八十，總此八十…') },
      { source: 'monier-williams', locator: 'vivarta; saṃvarta' }], gaps: ['Check the Sanskrit names of the four ages (vivarta, saṃvarta …) in the Kośabhāṣya and Monier-Williams.'] }),
};

const B = (from, to, label, title, subtitle, o) => claim({ id: `bridge-${from}-${to}`, from, to, label, title, subtitle, ...o });
const BRIDGES = [
  // VI within
  B('yi-intent', 'shi-conscious', '意 · 識', 'One Thing, Three Names', 'Abhidharmakośa ch. 2', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Abhidharmakośa: 心意識體一 — citta, manas and vijñāna are one in substance. 意 and 識 differ in function, not in what they are.',
    dimension: 'sense', period: 'six_dynasties_tang', cites: [{ source: 'abhidharmakosa', locator: 'ch. 2, p. 21c18', checked: ck(KOSA, '頌曰：心意識體一') }] }),
  B('ding', 'hui', '定慧一體', 'Concentration and Wisdom, Not Two', 'Platform Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Platform Sutra: 定慧一體，不是二。定是慧體，慧是定用 — “concentration and wisdom are one body, not two: concentration is the body of wisdom, wisdom the function of concentration.”',
    caveat: '不是二 here is plain Chinese, not the technical advaya of 不二法門; the echo of the Pillars is Rushi’s.',
    dimension: 'practice', period: 'song_yuan', cites: [{ source: 'platform-sutra', locator: 'T2008 p. 352c14', checked: ck(TJ, '定慧一體不是二，定是慧體，慧是定用') }] }),
  B('si-thought', 'nian', '思 · 念', 'Two of the Ten Universal Factors', 'Abhidharmakośa ch. 2', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Volition, 思, and mindfulness, 念, stand in the same verse of factors present in every moment of mind: 受想思觸欲，慧念與作意，勝解三摩地.',
    dimension: 'sense', period: 'six_dynasties_tang', cites: [{ source: 'abhidharmakosa', locator: 'ch. 2, p. 19a14', checked: ck(KOSA, '受想思觸欲，慧念與作意，勝解三摩地，遍於一切心') }] }),
  // VI → III
  B('hui', 'zhou-spell', '五種不翻', 'Two Words Kept by Sound', 'Fanyi mingyi ji, preface', { type: 'CANONICAL_TRANSLATION',
    evidence: 'Xuanzang’s five kinds of untranslated word begin and end with these two stars: first 陀羅尼, kept for secrecy (祕密故), and last 般若, kept because it is weightier than 智慧 (生善故).',
    dimension: 'translation', mechanism: 'phonetic_loan', period: 'six_dynasties_tang',
    cites: [{ source: 'fanyi-mingyi', locator: 'T2131 p. 1055a14–17', checked: ck(FY, '一祕密故，如陀羅尼…五生善故，如般若尊重，智慧輕淺') }] }),
  // VII within
  B('lei', 'shan', '震 · 艮', 'Moving and Stopping', 'Yijing, Shuogua', { type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'Thunder is the trigram 震, mountain the trigram 艮. The Shuogua pairs their work, 雷以動之 … 艮以止之, moving and stopping, and the hexagrams 51 震 ䷲ and 52 艮 ䷳ are each other turned upside down.',
    dimension: 'symbol', period: 'han', cites: [{ source: 'yijing', locator: '說卦 §4; hexagrams 51–52' }] }),
  B('mu', 'huo', '木生火', 'Wood Gives Birth to Fire', 'Chunqiu fanlu', { type: 'TRADITIONAL_CORRESPONDENCE',
    evidence: 'In the generating cycle of the five phases, 木生火，火生土，土生金，金生水，水生木: wood feeds fire, fire leaves earth (ash), earth bears metal, metal gathers water, water grows wood.',
    caveat: 'The parenthetical glosses are the traditional explanations, not the text. Locator from general knowledge.',
    dimension: 'symbol', period: 'han', cites: [{ source: 'chunqiu-fanlu', locator: '五行之義' }] }),
  B('jin', 'lei', '金剛 · 雷', 'One Word, Thunder and Diamond', 'vajra', { type: 'SEMANTIC_CONTRAST',
    evidence: 'Sanskrit vajra is Indra’s thunderbolt and also the diamond. Chinese translators rendered it 金剛, adamant, not 雷: of the word’s two faces, China kept the hardness.',
    dimension: 'translation', period: 'six_dynasties_tang', cites: [{ source: 'monier-williams', locator: 'vajra' }, { source: 'diamond', locator: 'title' }] }),
  // VII → V
  B('shan', 'ren-humane', '仁者樂山', 'The Humane Delight in Mountains', 'Analects 6.23', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 6.23: 知者樂水，仁者樂山。知者動，仁者靜 — “the wise delight in water, the humane in mountains; the wise move, the humane are still.”',
    dimension: 'symbol', period: 'pre_qin', cites: [{ source: 'analects', locator: '6.23', checked: ck(LUNYU, '雍也 ¶23: 知者乐水，仁者乐山。知者动，仁者静') }] }),
  B('shui', 'zhi-wisdom', '知者樂水', 'The Wise Delight in Water', 'Analects 6.23', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 6.23: 知者樂水 … 知者動 … 知者樂 — the wise delight in water, move like it, and are joyful.',
    caveat: 'The Analects writes 知, read zhì in this sense; 智 is the later graph for wisdom as a virtue.',
    dimension: 'symbol', period: 'pre_qin', cites: [{ source: 'analects', locator: '6.23', checked: ck(LUNYU, '雍也 ¶23: 知者乐水…知者动…知者乐') }] }),
  // VIII → others
  B('ri', 'shi-real', '日，實也', 'The Sun Glossed as the Real', 'Shuowen', { type: 'ETYMOLOGICAL_SINITIC',
    evidence: 'The Shuowen glosses 日 by the near-homophone 實: the sun is the full, the solid, the real. Rushi’s own name holds the second of these two graphs.',
    caveat: 'A Han sound gloss, not historical etymology; that it touches 如實 is Rushi’s observation.',
    dimension: 'sound', period: 'han', cites: [{ source: 'shuowen', locator: '日部 日' }] }),
  B('yue', 'fa', '指月', 'The Teaching Is the Finger', 'Śūraṅgama Sūtra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The finger-and-moon passage is about 法: 汝等尚以緣心聽法，此法亦緣，非得法性 — hearing the teaching with a conditioned mind, the teaching too is conditioned, not the nature of things. The teaching points; the moon is what it points at.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'shurangama', locator: 'T945 p. 111a08–09', checked: ck(LY, '緣心聽法此法亦緣非得法性如人以手指月示人') }] }),
  B('ying', 'wei', '有為法', 'All Conditioned Things Are Like a Shadow', 'Diamond Sutra', { type: 'TEXTUAL_CONNECTION',
    evidence: 'The Diamond Sutra’s closing verse: 一切有為法，如夢幻泡影，如露亦如電，應作如是觀 — “all conditioned things are like a dream, an illusion, a bubble, a shadow, like dew and lightning: see them so.” 有為 renders saṃskṛta, the made.',
    dimension: 'sense', period: 'six_dynasties_tang',
    cites: [{ source: 'diamond', locator: 'T235 p. 752b28', checked: ck(JG, '一切有為法，如夢幻泡影，如露亦如電，應作如是觀') }] }),
  B('zhao', 'tian', '照之於天', 'Illumined by Heaven', 'Zhuangzi ch. 2', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Zhuangzi 2: 是以聖人不由，而照之於天 — “so the sage does not go by this or that, but illumines things by Heaven”, letting the natural light show them rather than taking a side.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'zhuangzi', locator: 'ch. 2 齊物論' }] }),
  B('xing', 'de', '眾星共之', 'The Stars Turn Around Virtue', 'Analects 2.1', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 2.1: 為政以德，譬如北辰，居其所而眾星共之 — “govern by virtue, like the pole star: it keeps its place and the many stars turn toward it.”',
    dimension: 'cosmos', period: 'pre_qin', cites: [{ source: 'analects', locator: '2.1', checked: ck(LUNYU, '为政 ¶1: 为政以德，譬如北辰，居其所而众星共之') }] }),
  B('ming-bright', 'wu', '無明', 'Not-Light: Ignorance', 'avidyā', { type: 'CANONICAL_TRANSLATION',
    evidence: '無明 renders avidyā, part for part: a- “not”, vidyā “knowing”, which Chinese takes as light. It is the first of the twelve links: 無明緣行, “ignorance conditions formations.”',
    dimension: 'translation', mechanism: 'calque', period: 'six_dynasties_tang',
    cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 51a05', checked: ck(KOSA, '謂無明緣行，乃至如是純大苦蘊集') }, { source: 'monier-williams', locator: 'avidyā; vidyā' }],
    gaps: ['Check avidyā in Monier-Williams.'] }),
  // IX
  B('xue', 'wen', '學問', 'Learning and Asking', 'Mencius 6A11', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius 6A11 joins them into the word for scholarship: 學問之道無他，求其放心而已矣 — the way of learning-and-asking is only to seek the strayed heart.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'mencius', locator: '6A11', checked: ck(MENG, '學問之道無他，求其放心而已矣') }] }),
  B('xing-walk', 'xue', '行有餘力', 'Practice First, Then Letters', 'Analects 1.6', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 1.6: after filial conduct, care and trust, 行有餘力，則以學文 — “if there is strength left over from conduct, use it to learn letters.” Practice comes before book-learning.',
    dimension: 'practice', period: 'pre_qin', cites: [{ source: 'analects', locator: '1.6', checked: ck(LUNYU, '学而 ¶6: 行有余力，则以学文') }] }),
  B('qiu', 'xin', '求其放心', 'What Is Sought Is the Heart', 'Mencius 6A11', { type: 'TEXTUAL_CONNECTION',
    evidence: 'In Mencius 6A11 the object of seeking is 心: 有放心，而不知求 — people do not know to seek their strayed heart, and learning is only that seeking.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'mencius', locator: '6A11', checked: ck(MENG, '有放心，而不知求。學問之道無他，求其放心而已矣') }] }),
  B('lu', 'yi-right', '義，人路也', 'Rightness Is the Human Road', 'Mencius 6A11', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Mencius 6A11: 仁，人心也；義，人路也。舍其路而弗由 … 哀哉 — “humaneness is the human heart, rightness the human road; to abandon the road and not walk it: how sad.”',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'mencius', locator: '6A11', checked: ck(MENG, '仁，人心也；義，人路也。舍其路而弗由') }] }),
  B('xue', 'ding', '三學', 'The Three Trainings', 'Śūraṅgama Sūtra', { type: 'CANONICAL_TRANSLATION',
    evidence: '學 renders śikṣā, training, in 三學, the three trainings of discipline, concentration and wisdom; the Śūraṅgama calls them 三無漏學. Learning, in this sense, is practice.',
    dimension: 'translation', mechanism: 'semantic_extension', period: 'six_dynasties_tang',
    cites: [{ source: 'shurangama', locator: 'T945 p. 131c14', checked: ck(LY, '因戒生定因定發慧是則名為三無漏學') }, { source: 'monier-williams', locator: 'śikṣā' }],
    gaps: ['Check śikṣā in Monier-Williams.'] }),
  // X
  B('bian', 'hua', '變化', 'Alteration and Transformation', 'Yijing, Xici', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Xici, part one: 變化者，進退之象也 — “alteration and transformation are images of advance and retreat.” Commentators distinguish 變 as change one can see from 化 as change that goes on unseen.',
    caveat: 'The 變 / 化 distinction is commentarial, not stated in this line.',
    dimension: 'sense', period: 'han', cites: [{ source: 'yijing', locator: '繫辭上, §2' }] }),
  B('chang', 'sheng-life', '長生', 'Long Life', 'Daodejing chs. 7, 59', { type: 'TEXTUAL_CONNECTION',
    evidence: '長生 joins the two stars: Daodejing 59’s 長生久視之道 and ch. 7’s 天長地久 … 以其不自生，故能長生 — heaven and earth last because they do not live for themselves.',
    dimension: 'sense', period: 'pre_qin', cites: [{ source: 'daodejing', locator: 'chs. 7, 59' }] }),
  B('cheng', 'kong', '成 … 空', 'The Age of Emptiness Follows', 'Abhidharmakośa ch. 3', { type: 'TEXTUAL_CONNECTION',
    evidence: 'In 成住壞空 the cosmic cycle begins with 成, formation, and ends with 空, the empty age before a world forms again.',
    caveat: 'Here 空 is the empty eon, a cosmological sense, not śūnyatā.',
    dimension: 'cosmos', period: 'six_dynasties_tang', cites: [{ source: 'abhidharmakosa', locator: 'ch. 3, p. 63b07', checked: ck(KOSA, '如是所說成住壞空') }] }),
  B('sheng-life', 'wu', '無生', 'The Unborn', 'anutpāda', { type: 'CANONICAL_TRANSLATION',
    evidence: '無生 renders anutpāda, “non-arising”, part for part. The Lotus Sutra tells of bodhisattvas who attain 無生法忍, the acceptance that dharmas are unborn.',
    dimension: 'translation', mechanism: 'calque', period: 'six_dynasties_tang',
    cites: [{ source: 'lotus', locator: 'T262 p. 44a10', checked: ck(FH, '恒河沙眾生得無生法忍') }, { source: 'monier-williams', locator: 'anutpāda; anutpattika' }],
    gaps: ['Check anutpattika-dharma-kṣānti in Monier-Williams or Edgerton’s BHS dictionary.'] }),
  B('zhong-end', 'de', '慎終追遠', 'Care at the End', 'Analects 1.9', { type: 'TEXTUAL_CONNECTION',
    evidence: 'Analects 1.9: 慎終追遠，民德歸厚矣 — “take care over the end (of parents), remember those long gone, and the people’s virtue will return to its fullness.”',
    dimension: 'practice', period: 'pre_qin', cites: [{ source: 'analects', locator: '1.9', checked: ck(LUNYU, '学而 ¶9: 慎终追远，民德归厚矣') }] }),
];

// apply
const src = rd('sources.json'); for (const [k, v] of Object.entries(SOURCES)) if (!src[k]) src[k] = v; wr('sources.json', src);
for (const [a, sats] of Object.entries(SAT)) {
  const j = rd(`anchors/${a}.json`);
  for (const s of sats) if (!j.satellites.some(x => x.id === s.id)) j.satellites.push(s);
  wr(`anchors/${a}.json`, j);
}
const log = [];
for (const [a, s] of Object.entries(REPLACE)) {
  const j = rd(`anchors/${a}.json`);
  const i = j.satellites.findIndex(x => x.glyph === j.glyph);
  if (i >= 0) { log.push(`${a}: replaced ${j.satellites[i].id} (“${j.satellites[i].title}”) with ${s.id}`); j.satellites[i] = s; }
  else if (!j.satellites.some(x => x.id === s.id)) j.satellites.push(s);
  wr(`anchors/${a}.json`, j);
}
const br = rd('bridges.json');
for (const b of BRIDGES) if (!br.some(x => x.id === b.id)) br.push(b);
wr('bridges.json', br);
console.log(log.join('\n'));
