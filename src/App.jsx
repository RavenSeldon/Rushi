import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Settings,
  X,
  Sparkles,
  Check
} from 'lucide-react';

// ============================================================================
// 1. DISCIPLINED VISUAL PALETTE & EPISTEMIC TAXONOMY
// ============================================================================
const PALETTE = {
  VOID: '#05060B',
  NEBULA: '#183D79',
  NEBULA_DEEP: '#0A1936',
  GOLD: '#E4AE60',
  CRIMSON: '#A52F45',
  STARLIGHT: '#EAF2FF',
  SINITIC_BLUE: '#6BA4FF',
  LEXICAL_TEAL: '#5CE1E6',
};

const EDGE_TYPES = {
  CANONICAL_TRANSLATION: {
    id: 'CANONICAL_TRANSLATION',
    label: 'Canonical Translation',
    shortLabel: 'Canonical',
    color: PALETTE.GOLD,
    hex: 0xE4AE60,
    dashed: false,
    description: 'Documented historical & textual correspondence across classical canons (e.g., Sanskrit–Chinese Buddhist translations).'
  },
  ETYMOLOGICAL_SINITIC: {
    id: 'ETYMOLOGICAL_SINITIC',
    label: 'Sinitic Etymology & Polysemy',
    shortLabel: 'Etymology',
    color: PALETTE.SINITIC_BLUE,
    hex: 0x6BA4FF,
    dashed: false,
    description: 'Palaeographic radical structure, Old/Middle Chinese phonology, or internal tonal-semantic derivation.'
  },
  CROSS_LINGUISTIC_LEXICAL: {
    id: 'CROSS_LINGUISTIC_LEXICAL',
    label: 'Lexical & Philosophical Resonance',
    shortLabel: 'Resonance',
    color: PALETTE.LEXICAL_TEAL,
    hex: 0x5CE1E6,
    dashed: true,
    description: 'Pragmatic or philosophical parallels across Austronesian (Bahasa Melayu), Sanskrit, and European languages.'
  },
  INTERPRETIVE_SYNTHESIS: {
    id: 'INTERPRETIVE_SYNTHESIS',
    label: 'Constructive Synthesis',
    shortLabel: 'Constructive',
    color: PALETTE.CRIMSON,
    hex: 0xA52F45,
    dashed: true,
    description: 'Original philosophical proposition—explicitly distinguished from settled historical philology.'
  }
};

const QUALITY_TIERS = {
  HIGH: { id: 'HIGH', label: 'High', maxPixelRatio: 2.0, particleRatio: 1.0, pointScale: 1.0 },
  BALANCED: { id: 'BALANCED', label: 'Balanced', maxPixelRatio: 1.35, particleRatio: 0.7, pointScale: 0.9 },
  ECO: { id: 'ECO', label: 'Eco', maxPixelRatio: 1.0, particleRatio: 0.45, pointScale: 0.75 }
};

// ============================================================================
// 2. RK4 NUMERICAL LORENZ ATTRACTOR GENERATOR (WHISPER-DELICATE RIBBON)
// ============================================================================
function generateLorenzManifold(steps = 4200, dt = 0.0046) {
  const sigma = 10.0;
  const rho = 28.0;
  const beta = 8.0 / 3.0;

  let x = 0.1;
  let y = 0.0;
  let z = 0.0;

  const deriv = (px, py, pz) => ({
    dx: sigma * (py - px),
    dy: px * (rho - pz) - py,
    dz: px * py - beta * pz
  });

  // Settle onto the attractor manifold
  for (let i = 0; i < 350; i++) {
    const k1 = deriv(x, y, z);
    const k2 = deriv(x + 0.5 * dt * k1.dx, y + 0.5 * dt * k1.dy, z + 0.5 * dt * k1.dz);
    const k3 = deriv(x + 0.5 * dt * k2.dx, y + 0.5 * dt * k2.dy, z + 0.5 * dt * k2.dz);
    const k4 = deriv(x + dt * k3.dx, y + dt * k3.dy, z + dt * k3.dz);
    x += (dt / 6.0) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
    y += (dt / 6.0) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
    z += (dt / 6.0) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz);
  }

  const spinePoints = [];
  for (let i = 0; i < steps; i++) {
    const k1 = deriv(x, y, z);
    const k2 = deriv(x + 0.5 * dt * k1.dx, y + 0.5 * dt * k1.dy, z + 0.5 * dt * k1.dz);
    const k3 = deriv(x + 0.5 * dt * k2.dx, y + 0.5 * dt * k2.dy, z + 0.5 * dt * k2.dz);
    const k4 = deriv(x + dt * k3.dx, y + dt * k3.dy, z + dt * k3.dz);

    x += (dt / 6.0) * (k1.dx + 2 * k2.dx + 2 * k3.dx + k4.dx);
    y += (dt / 6.0) * (k1.dy + 2 * k2.dy + 2 * k3.dy + k4.dy);
    z += (dt / 6.0) * (k1.dz + 2 * k2.dz + 2 * k3.dz + k4.dz);

    const cz = z - 25.0;
    const wx = x * 1.55 + Math.sin(cz * 0.07) * 2.5;
    const wy = y * 0.92 + Math.cos(x * 0.05) * 2.0;
    const wz = cz * 1.1;

    spinePoints.push(new THREE.Vector3(wx, wy, wz));
  }

  return spinePoints;
}

// ============================================================================
// 3. COMPLETE SCHOLARLY DATA MODEL (ALL 8 ANCHORS FULLY POPULATED)
// ============================================================================
const ANCHOR_DEFINITIONS = [
  {
    id: 'dao',
    keyNum: '1',
    glyph: '道',
    pinyin: 'dào',
    oldChinese: '*[k.l]ˤuʔ (Baxter–Sagart)',
    coreGloss: 'The Way · Generative Course · Method · To Speak',
    spineIndex: 480,
    offset: [-2.0, 3.5, 2.0],
    radicals: '辶 (chuò, stepping/path) + 首 (shǒu, head/foremost)',
    summary:
      'Originally a thoroughfare or leading by the head; expanded in classical Chinese thought into the unnameable, self-unfolding course of the cosmos and the lived path of cultivation.',
    satellites: [
      {
        id: 'dao-rad',
        glyph: '辶 + 首',
        title: 'Palaeographic Structure',
        lang: 'Bronze Script (金文)',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Shuowen Jiezi (說文解字) & Western Zhou Bronzes',
        evidence:
          'Depicts a head (首) inside a crossroads/movement radical (行/辶). Literally "to orient and lead the way forward," uniting conscious orientation with kinetic pathmaking.'
      },
      {
        id: 'dao-marga',
        glyph: 'मार्ग / Mārga',
        title: 'Mārga & Dharma',
        lang: 'Sanskrit',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Early Chinese Āgamas & Kumārajīva Corpus',
        evidence:
          'Rendered Sanskrit mārga ("path," as in 八正道 Āryāṣṭāṅgamārga) and early translations of bodhi/dharma. While Daoist 道 is immanent and spontaneous, Buddhist mārga emphasizes liberating praxis.'
      },
      {
        id: 'dao-ziran',
        glyph: '自然 (Zìrán)',
        title: 'Self-So Spontaneity',
        lang: 'Classical Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Daodejing Ch. 25 (道法自然)',
        evidence:
          '"Dao models itself on what is self-so (自然)." Clarifies that 道 is not an external teleological deity, but the intrinsic, unforced unfolding of phenomena.'
      },
      {
        id: 'dao-jalan',
        glyph: 'Jalan / Aliran',
        title: 'Path vs. Fluid Current',
        lang: 'Bahasa Melayu',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Nusantara Lexicography',
        evidence:
          'Malay bifurcates the sense of 道: "Jalan" captures the lived ethical path (jalan hidup), while "Aliran" (stream/current) captures the water-like cosmological flow.'
      },
      {
        id: 'dao-logos',
        glyph: 'Λόγος / La Voie',
        title: 'Way & Utterance',
        lang: 'Greek · French',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Daodejing Ch. 1 (道可道，非常道)',
        evidence:
          'Classical 道 means both "Way" (noun) and "to articulate" (verb). Mirrors Greek Logos (cosmic order + speech), though Laozi foregrounds what exceeds discursive naming.'
      }
    ]
  },
  {
    id: 'wu',
    keyNum: '2',
    glyph: '無',
    pinyin: 'wú',
    oldChinese: '*ma (Baxter–Sagart)',
    coreGloss: 'Non-Presence · Generative Void · Indeterminacy · Without',
    spineIndex: 1020,
    offset: [2.5, -3.5, 1.5],
    radicals: '林 (forest/plumes) + 亡 / 灬 (reduced from 舞 dancer)',
    summary:
      'In Shang and Zhou palaeography, identical to 舞 (ritual dancer holding plumes), borrowed phonetically for "not having" and elevated in philosophy to generative indeterminacy.',
    satellites: [
      {
        id: 'wu-dancer',
        glyph: '舞 → 無',
        title: 'Plumed Ritual Dancer',
        lang: 'Oracle Bone & Bronze Script',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Shang Oracle Bone Inscriptions (甲骨文)',
        evidence:
          'Early graphs depict a figure holding lush feathers or branches in both hands (ancestor of 舞, dance)—attesting that 無 originated in kinetic ritual presence before signifying boundless non-presence.'
      },
      {
        id: 'wu-you',
        glyph: '有無相生',
        title: 'Mutual Arising of Being & Non-Being',
        lang: 'Classical Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Daodejing Ch. 2 & Ch. 40 (天下萬物生於有，有生於無)',
        evidence:
          'Rather than nihilistic nothingness, 無 is the uncarved, indeterminate matrix from which determinate forms (有 yǒu) continually arise and into which they return.'
      },
      {
        id: 'wu-sunyata',
        glyph: 'शून्यता / Śūnyatā',
        title: 'Benwu (本無) vs. Śūnyatā',
        lang: 'Sanskrit → Chinese',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Sengzhao (僧肇), Bu Zhen Kong Lun (不真空論)',
        evidence:
          'Early Chinese Buddhists mapped śūnyatā onto Daoist 無, before Sengzhao and Kumārajīva demonstrated that Madhyamaka emptiness (空) transcends the binary of both 有 (naive existence) and 無 (non-existence).'
      },
      {
        id: 'wu-tiada',
        glyph: 'Tiada / Néant',
        title: 'Absence vs. Open Clearing',
        lang: 'Bahasa Melayu · French',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Comparative Ontology',
        evidence:
          'Contrasts everyday privative negation (Malay tiada, French sans) with the pregnant emptiness of an empty vessel or room whose utility lies precisely in its unoccupied space (Daodejing Ch. 11).'
      },
      {
        id: 'wu-mu',
        glyph: '趙州無 (Mu)',
        title: 'Zhaozhou’s Apophatic Gate',
        lang: 'Sino-Japanese Chan / Zen',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Wumenguan Case 1 (無門關 · 趙州狗子)',
        evidence:
          'Asked whether a dog has Buddha-nature, Zhaozhou answered "無" (Wú / Jp. Mu)—wielded not as a factual "no," but as a razor severing conceptual calculation.'
      }
    ]
  },
  {
    id: 'wei',
    keyNum: '3',
    glyph: '為',
    pinyin: 'wéi / wèi',
    oldChinese: '*ɢʷ(r)aj (Baxter–Sagart)',
    coreGloss: 'To Act · To Do · To Fashion · For the Sake Of',
    spineIndex: 1580,
    offset: [-3.0, 3.0, -2.0],
    radicals: '爫 (hand/claw) + 象 (elephant)',
    summary:
      'Depicts a hand guiding an elephant: purposeful agency, exertion, or contrivance. Paired with 無 to form 無為 (wúwéi)—responsive, non-coercive efficacy.',
    satellites: [
      {
        id: 'wei-elephant',
        glyph: '爪 + 象',
        title: 'Hand Guiding an Elephant',
        lang: 'Oracle Bone Script (甲骨文)',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Luo Zhenyu (羅振玉) Palaeographic Analysis',
        evidence:
          'An upper hand (爪) leading the trunk of an elephant (象): a vivid ancient image of directed human effort, training, and deliberate intervention.'
      },
      {
        id: 'wei-tonal',
        glyph: 'wéi ↔ wèi',
        title: 'Action (wéi) vs. Purpose (wèi)',
        lang: 'Middle & Modern Mandarin',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Classical Sinitic Tonal Morphology',
        evidence:
          'Level tone wéi (2nd tone) means "to do, act, become"; departing tone wèi (4th tone, < OC *-s) means "for the sake of, on behalf of"—distinguishing unselfconscious action from ulterior motive.'
      },
      {
        id: 'wei-asamskrta',
        glyph: 'असंस्कृत / Asaṃskṛta',
        title: 'Asaṃskṛta-dharma (無為法)',
        lang: 'Sanskrit',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Abhidharmakośa & Yogācāra Canon',
        evidence:
          'Buddhist translators adopted為 (saṃskṛta, conditioned/fabricated) and 無為 (asaṃskṛta, unconditioned) to distinguish karmically constructed phenomena from nirvāṇa and thusness.'
      },
      {
        id: 'wei-nonagir',
        glyph: 'Non-agir',
        title: 'Efficacious Non-Coercion',
        lang: 'French Sinology',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'François Jullien, Traité de l’efficacité',
        evidence:
          'Rendered in French philosophy as "non-agir": not inert passivity, but aligning with the propensity of things (勢 shì) so nothing is forced yet nothing remains undone (無為而無不為).'
      },
      {
        id: 'wei-daya',
        glyph: 'Tindakan / Laku',
        title: 'Embodied Conduct',
        lang: 'Bahasa Melayu',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Austronesian Ethical Register',
        evidence:
          'Maps onto Malay "perbuatan / tindakan" (deliberate deed) and "laku" (manner of bearing oneself in flow).'
      }
    ]
  },
  {
    id: 'ai',
    keyNum: '4',
    glyph: '愛',
    pinyin: 'ài',
    oldChinese: '*ˤə[p]-s (Baxter–Sagart)',
    coreGloss: 'Love · Benevolent Regard · Cherishing · Maitrī',
    spineIndex: 2150,
    offset: [0.0, 4.5, 1.5],
    radicals: '爫 + 冖 + 心 (heart-mind at center) + 夂 (walking feet)',
    summary:
      'A heart-mind (心) cradled inside an attentive posture looking back (旡) and moving feet (夂). Bridges classical care, Buddhist Maitrī vs. Tṛṣṇā, and constructive non-dual synthesis.',
    satellites: [
      {
        id: 'ai-etym',
        glyph: '旡 + 心 + 夂',
        title: 'Heart-Mind Looking Back in Regard',
        lang: 'Seal Script (小篆)',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Shuowen Jiezi (說文解字)',
        evidence:
          'Originally written 㤅 (heart 心 beneath 旡, a figure turning its head in deep feeling), later augmented with walking feet (夂) to signify lingering, reluctant-to-part devotion and cherishing.'
      },
      {
        id: 'ai-maitri',
        glyph: 'मैत्री / Maitrī ≠ Karuṇā',
        title: 'Maitrī (Loving-Kindness) vs. Tṛṣṇā',
        lang: 'Sanskrit',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Catvāri Apramāṇāni (四無量心) & Āgamas',
        evidence:
          'Epistemic precision: In the 12 nidānas, 愛 translates tṛṣṇā (grasping thirst); in the Four Immeasurables, selfless love is Maitrī (慈愛, wishing beings joy), distinct from Karuṇā (悲, wishing freedom from suffering).'
      },
      {
        id: 'ai-jianai',
        glyph: '兼愛 / 仁愛',
        title: 'Impartial Care & Humane Benevolence',
        lang: 'Classical Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Mozi (墨子 · 兼愛) & Mencius',
        evidence:
          'Anchors the classical debate between Mohist 兼愛 (universal, non-graduated care for all equally) and Confucian 仁愛 (humane love radiating outward from familial roots).'
      },
      {
        id: 'ai-kasih',
        glyph: 'Kasih / Agapè',
        title: 'Benevolent Care vs. Possessive Passion',
        lang: 'Bahasa Melayu · Greek',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Comparative Lexicography',
        evidence:
          'Malay distinguishes "Kasih / Sayang" (tender, protective care) from "Berahi" (passionate attachment), paralleling Greek Agapè/Philia versus possessive Eros.'
      },
      {
        id: 'ai-maitradvaita',
        glyph: '慈愛 ↔ 不二',
        title: 'Maitrādvaita (Constructive Proposition)',
        lang: 'Interpretive Philosophy',
        edgeType: 'INTERPRETIVE_SYNTHESIS',
        source: 'Original Philosophical Synthesis (Distinguished from Canon)',
        evidence:
          'Constructive proposition: When the boundary between self and other dissolves (不二 / Advaya), the natural experiential resonance is unconditional loving-kindness (愛 / Maitrī).'
      }
    ]
  },
  {
    id: 'bu',
    keyNum: '5',
    glyph: '不',
    pinyin: 'bù / fǒu',
    oldChinese: '*pə (Baxter–Sagart)',
    coreGloss: 'Not · Non- · Apophatic Negation · Unceasing',
    spineIndex: 2680,
    offset: [-3.5, -2.5, 2.0],
    radicals: '一 (sky/horizon line) + 爪/木 (soaring bird or calyx)',
    summary:
      'Foundational particle of declarative and apophatic negation in Sinitic languages. Paired directly with 二 to form the non-dual nexus 不二 (Bù’èr).',
    satellites: [
      {
        id: 'bu-oracle',
        glyph: 'Oracle Bone 不',
        title: 'Bird Ascending to the Sky Line',
        lang: 'Oracle Bone Script (甲骨文)',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Shuowen Jiezi & Paleographic Consensus',
        evidence:
          'Depicts either the calyx of a flower or a bird flying straight up toward the sky line (一) and not descending—borrowed phonetically in antiquity for the negative particle "not."'
      },
      {
        id: 'bu-prasajya',
        glyph: 'अ- / Prasajya',
        title: 'Non-Affirming Negation (無遮)',
        lang: 'Sanskrit (Madhyamaka)',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Nāgārjuna’s Mūlamadhyamakakārikā (中論 Eight Negations)',
        evidence:
          'Translates Sanskrit privative a-/an- (as in 八不: 不生不滅, neither arising nor ceasing). Functions as prasajya-pratiṣedha: clearing away false reification without positing an opposite dogma.'
      },
      {
        id: 'bu-fou',
        glyph: 'bù ↔ fǒu',
        title: 'Phonological Split & Tone Sandhi',
        lang: 'Middle & Modern Mandarin',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Guangyun (廣韻) & Mandarin Phonology',
        evidence:
          'Retains dual readings: bù (clitic negation undergoing 4th→2nd tone sandhi before another 4th tone, as in 不二 bú èr) and fǒu (standalone inquiry/denial, "or not").'
      },
      {
        id: 'bu-tidak',
        glyph: 'Tidak / Bukan',
        title: 'Predicate vs. Nominal Negation',
        lang: 'Bahasa Melayu',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Austronesian Morphosyntax',
        evidence:
          'Malay divides Chinese 不/非 into "Tidak" (negating verbs/adjectives) and "Bukan" (negating nouns or propositions)—sharpening logical analysis.'
      }
    ]
  },
  {
    id: 'er',
    keyNum: '6',
    glyph: '二',
    pinyin: 'èr',
    oldChinese: '*ni[j]-s (Baxter–Sagart)',
    coreGloss: 'Two · Polarity · Bifurcation · Advaya (in 不二)',
    spineIndex: 2940,
    offset: [3.5, 2.0, -1.5],
    radicals: '二 (two parallel horizontal strokes)',
    summary:
      'Simple ideogram of two parallel cords or strokes signifying Heaven and Earth, correlation, and binary division. In 不二 (not-two), it points beyond subject–object bifurcation.',
    satellites: [
      {
        id: 'er-advaya',
        glyph: 'अद्वय / Advaya',
        title: 'Advaya (The Non-Dual Dharma Gate)',
        lang: 'Sanskrit (Mahāyāna)',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Vimalakīrti Nirdeśa Sūtra Ch. 9 (入不二法門品)',
        evidence:
          'Documented canonical translation of Sanskrit advaya ("not-two"; free from extremes of purity/defilement, self/other). Culminates in Vimalakīrti’s thunderous silence when words themselves are seen as dualistic.'
      },
      {
        id: 'er-advaita',
        glyph: 'Advaya ≠ Advaita',
        title: 'Relational Emptiness vs. Monism',
        lang: 'Sanskrit Epistemology',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Comparative Indo-Tibetan & Sinitic Philosophy',
        evidence:
          'Crucial distinction: Vedāntic Advaita posits a single absolute substance (Brahman), whereas Buddhist Advaya (不二) rejects binary extremes through dependent co-arising (緣起) without positing a monistic substratum.'
      },
      {
        id: 'er-qiwu',
        glyph: '道樞 / 齊物',
        title: 'The Pivot of Dao Beyond "This" & "That"',
        lang: 'Classical Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Zhuangzi Ch. 2 (齊物論)',
        evidence:
          '"Where neither \'this\' (彼) nor \'that\' (是) finds its opposite is called the Pivot of the Way (道樞)." Indigenous Sinitic critique of binary disputation prior to Buddhist arrival.'
      },
      {
        id: 'er-tiadadua',
        glyph: 'Tiada Dua / Non-dualité',
        title: 'Beyond Subject–Object Split',
        lang: 'Bahasa Melayu · French',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Phenomenology & Comparative Mysticism',
        evidence:
          'Malay "tiada dua" (without second) and French "non-dualité" bridge classical Asian apophatic insight with contemporary critiques of Cartesian subject–object bifurcation.'
      }
    ]
  },
  {
    id: 'liang',
    keyNum: '7',
    glyph: '量',
    pinyin: 'liáng (v.) / liàng (n.)',
    oldChinese: '*[r]aŋ / *[r]aŋ-s',
    coreGloss: 'To Measure (liáng) · Capacity / Magnitude / Pramāṇa (liàng)',
    spineIndex: 3520,
    offset: [-2.5, -3.0, -1.5],
    radicals: '旦 (daybreak sun) + 里 (measured league/village)',
    summary:
      'Preserves a classic Old Chinese morphology split: level tone liáng (verb: to measure, weigh, deliberate) versus departing tone liàng (noun: capacity, magnanimity, or epistemic Pramāṇa).',
    satellites: [
      {
        id: 'liang-tonal',
        glyph: 'liáng ↔ liàng',
        title: 'Qùshēng Tonal-Semantic Derivation',
        lang: 'Old & Modern Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Moe Dictionary (教育部重編國語辭典) & OC Morphology',
        evidence:
          'liáng (2nd tone, < *raŋ) = active process of measuring or deliberating (測量, 思量); liàng (4th tone, < *raŋ-s) = resulting quantity, moral capacity (器量), or immeasurability (無量).'
      },
      {
        id: 'liang-pramana',
        glyph: 'प्रमाण / Pramāṇa',
        title: 'Pramāṇa (Valid Epistemic Cognition)',
        lang: 'Sanskrit (Hetuvidyā 因明)',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Dignāga’s Pramāṇasamuccaya (集量論) tr. Xuanzang',
        evidence:
          'In Buddhist logic and epistemology, 量 renders Sanskrit pramāṇa—the standard of valid cognition, encompassing direct non-conceptual perception (現量 pratyakṣa) and sound inference (比量 anumāna).'
      },
      {
        id: 'liang-wuliang',
        glyph: '無量 / Apramāṇa',
        title: 'The Four Immeasurables (四無量心)',
        lang: 'Sanskrit → Chinese',
        edgeType: 'CANONICAL_TRANSLATION',
        source: 'Āgamas & Mahāyāna Sūtras',
        evidence:
          'Combined with 無, 量 forms 無量 (apramāṇa / amitā): boundless, unquantifiable scope—used both for the Four Immeasurable Minds (慈悲喜捨) and Amitābha/Amitāyus (無量光/無量壽).'
      },
      {
        id: 'liang-ukuran',
        glyph: 'Ukuran / Mesure',
        title: 'Proportion, Calibration & Moderation',
        lang: 'Bahasa Melayu · French',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Comparative Epistemology',
        evidence:
          'Parallels Malay "ukuran / sukatan" and French "mesure" (both quantitative measurement and ethical/cognitive temperance).'
      }
    ]
  },
  {
    id: 'si',
    keyNum: '8',
    glyph: '司',
    pinyin: 'sī',
    oldChinese: '*s-lə (Baxter–Sagart)',
    coreGloss: 'Stewardship · To Preside Over · Attentive Direction',
    spineIndex: 3980,
    offset: [3.0, 2.5, 1.5],
    radicals: '𠃌 (enclosing posture) + 一 + 口 (directive speech)',
    summary:
      'In Shang oracle bones, the chiral mirror-twin of 后 (sovereign): to attend to, steward, or preside over a domain with clarity and measured care.',
    satellites: [
      {
        id: 'si-hou',
        glyph: '司 ⇄ 后',
        title: 'Chiral Mirror Graph of 后',
        lang: 'Oracle Bone Script (甲骨文)',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Shang Oracle Bone Inscriptions & Shuowen Jiezi',
        evidence:
          'In Shang palaeography, 司 and 后 were mirror-image graphs of a figure bending over a mouth radical (口), later specializing into administrative stewardship (司, as in 司馬/司空) versus sovereign (后).'
      },
      {
        id: 'si-siming',
        glyph: '司命 / 有司',
        title: 'Custodianship of Office & Life',
        lang: 'Classical Chinese',
        edgeType: 'ETYMOLOGICAL_SINITIC',
        source: 'Chuci (楚辭 · 九歌) & Analects (論語)',
        evidence:
          'Denotes accountable responsibility over a specific trust or craft (有司), where excellence lies in fulfilling one’s stewardship without overreaching.'
      },
      {
        id: 'si-kelola',
        glyph: 'Kelola / Urus',
        title: 'Attentive Stewardship',
        lang: 'Bahasa Melayu',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Austronesian Administrative & Ethical Lexicon',
        evidence:
          'Corresponds to Malay "mengelola / mengurus" (to tend, care for, and coordinate a domain responsibly).'
      },
      {
        id: 'si-presider',
        glyph: 'Présider / Κυβερνάω',
        title: 'Cybernetic Steering vs. Coercion',
        lang: 'French · Greek',
        edgeType: 'CROSS_LINGUISTIC_LEXICAL',
        source: 'Comparative Political Philosophy',
        evidence:
          'Resonates with Greek kybernaō (to steer a vessel responsively) and French présider: when paired with 量 and 無為, governance becomes responsive calibration rather than domination.'
      }
    ]
  }
];

// Primary Inter-Anchor Bridges visible in Overview & Focus
const INTER_ANCHOR_BRIDGES = [
  {
    id: 'bridge-wu-wei',
    from: 'wu',
    to: 'wei',
    title: '無為 (Wúwéi — Effortless Action)',
    subtitle: 'Foundational Daoist & Buddhist Compound',
    edgeType: 'ETYMOLOGICAL_SINITIC',
    source: 'Daodejing Ch. 37 & Abhidharma (無為法 Asaṃskṛta)',
    evidence:
      'Joins 無 (indeterminate non-presence) with 為 (deliberate action) to express responsive, non-coercive efficacy in Daoism, and unconditioned phenomena (asaṃskṛta) in Chinese Buddhist translation.'
  },
  {
    id: 'bridge-bu-er',
    from: 'bu',
    to: 'er',
    title: '不二 (Bù’èr — Advaya / Non-Duality)',
    subtitle: 'Canonical Compound & Non-Dual Bridge',
    edgeType: 'CANONICAL_TRANSLATION',
    source: 'Vimalakīrti Nirdeśa Sūtra Ch. 9 & Zhuangzi Ch. 2',
    evidence:
      'The synthesis of 不 (negation) and 二 (duality) creates 不二: transcending oppositional bifurcation. Documented canonical match for Sanskrit Advaya (अद्वय).'
  },
  {
    id: 'bridge-ai-er',
    from: 'ai',
    to: 'er',
    title: '愛 ↔ 不二 (Maitrādvaita Proposition)',
    subtitle: 'Constructive Philosophical Synthesis',
    edgeType: 'INTERPRETIVE_SYNTHESIS',
    source: 'Original Philosophical Proposition (Distinguished from Canon)',
    evidence:
      'Constructive synthesis: Universal loving-kindness (愛 / Maitrī) is the lived affective expression of non-duality (不二 / Advaya). Rendered in dashed crimson to distinguish original philosophy from historical philology.'
  },
  {
    id: 'bridge-liang-si',
    from: 'liang',
    to: 'si',
    title: '量 ↔ 司 (Measured Stewardship)',
    subtitle: 'Epistemic Calibration & Governance',
    edgeType: 'ETYMOLOGICAL_SINITIC',
    source: 'Classical Lexicon & Pramāṇa Epistemology',
    evidence:
      'Pairs epistemic measure and capacity (量) with attentive stewardship (司): clear direction grounded in valid cognition rather than arbitrary force.'
  },
  {
    id: 'bridge-dao-wu',
    from: 'dao',
    to: 'wu',
    title: '道 ↔ 無 (The Unnameable Matrix)',
    subtitle: 'Cosmological Foundation',
    edgeType: 'ETYMOLOGICAL_SINITIC',
    source: 'Daodejing Ch. 1 & Ch. 40 (天下萬物生於有，有生於無)',
    evidence:
      'Links the generative course (道) with indeterminate non-presence (無) as the inexhaustible source of myriad forms.'
  },
  {
    id: 'bridge-wu-liang',
    from: 'wu',
    to: 'liang',
    title: '無量 (Wúliàng — Apramāṇa / Immeasurable)',
    subtitle: 'Canonical Compound (Four Immeasurables)',
    edgeType: 'CANONICAL_TRANSLATION',
    source: 'Catvāri Apramāṇāni (四無量心)',
    evidence:
      'Combining 無 and 量 yields 無量 (Sanskrit apramāṇa), the boundless scope of the Four Immeasurable Minds (Maitrī, Karuṇā, Muditā, Upekṣā).'
  }
];

// ============================================================================
// 4. PROCEDURAL TEXTURES (HIERARCHICAL LIGHTING)
// ============================================================================
function createJWSTFlareTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128;
  const cy = 128;

  const halo = ctx.createRadialGradient(cx, cy, 1, cx, cy, 110);
  halo.addColorStop(0, 'rgba(234, 242, 255, 0.95)');
  halo.addColorStop(0.12, 'rgba(228, 174, 96, 0.65)');
  halo.addColorStop(0.32, 'rgba(24, 61, 121, 0.22)');
  halo.addColorStop(1, 'rgba(5, 6, 11, 0.0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 256, 256);

  const angles = [0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI / 2];
  angles.forEach((angle, idx) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const len = idx === 3 ? 65 : 115;
    const width = idx === 3 ? 1.1 : 1.8;
    const grad = ctx.createLinearGradient(-len, 0, len, 0);
    grad.addColorStop(0, 'rgba(234, 242, 255, 0.0)');
    grad.addColorStop(0.38, 'rgba(228, 174, 96, 0.35)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.62, 'rgba(228, 174, 96, 0.35)');
    grad.addColorStop(1, 'rgba(234, 242, 255, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(-len, -width / 2, len * 2, width);
    ctx.restore();
  });

  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
  core.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  core.addColorStop(0.5, 'rgba(234, 242, 255, 0.85)');
  core.addColorStop(1, 'rgba(234, 242, 255, 0.0)');
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createSoftHaloTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 1, 64, 64, 56);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.25, 'rgba(234, 242, 255, 0.6)');
  grad.addColorStop(0.55, 'rgba(107, 164, 255, 0.14)');
  grad.addColorStop(1, 'rgba(5, 6, 11, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ============================================================================
// 5. WHISPER-DELICATE GLSL SHADERS (DIMMABLE ON FOCUS FOR CLARITY)
// ============================================================================
const PARTICLE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uQualityRatio;
  uniform float uPointScale;
  uniform float uReducedMotion;
  uniform float uDimFactor;

  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  attribute vec3 aColor;
  attribute float aTierThreshold;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;

    if (aTierThreshold > uQualityRatio) {
      vAlpha = 0.0;
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      return;
    }

    vec3 pos = position;
    if (uReducedMotion < 0.5) {
      pos.x += sin(uTime * 0.35 + aPhase) * 0.12;
      pos.y += cos(uTime * 0.28 + aPhase * 1.2) * 0.10;
      pos.z += sin(uTime * 0.25 + aPhase * 0.8) * 0.12;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float dist = max(-mvPosition.z, 5.0);

    float twinkle = uReducedMotion < 0.5
      ? (0.88 + 0.12 * sin(uTime * 1.2 + aPhase * 3.14))
      : 1.0;

    vAlpha = aAlpha * twinkle * uDimFactor;

    float computedSize = aSize * uPointScale * (145.0 / dist);
    gl_PointSize = clamp(computedSize, 0.8, 6.5);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (vAlpha <= 0.008) discard;

    vec2 uv = gl_PointCoord - vec2(0.5);
    float distSq = dot(uv, uv);
    if (distSq > 0.25) discard;

    float falloff = exp(-distSq * 16.0);
    gl_FragColor = vec4(vColor, vAlpha * falloff);
  }
`;

// ============================================================================
// 6. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [navState, setNavState] = useState('OVERVIEW');
  const [selectedAnchorId, setSelectedAnchorId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Epistemic Filters (tucked into optional quiet popover or inline toggle)
  const [activeFilters, setActiveFilters] = useState({
    CANONICAL_TRANSLATION: true,
    ETYMOLOGICAL_SINITIC: true,
    CROSS_LINGUISTIC_LEXICAL: true,
    INTERPRETIVE_SYNTHESIS: true
  });

  // Quiet background adaptive settings
  const [qualityTier, setQualityTier] = useState('HIGH');
  const [autoQuality, setAutoQuality] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [telemetry, setTelemetry] = useState({ fps: 60, frameMs: 8.2 });

  // Projected 2D coordinates for zero-overlap HTML typography
  const [projectedNodes, setProjectedNodes] = useState({ anchors: [], satellites: [] });

  // Three.js Refs
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const shaderMatRef = useRef(null);
  const spineLinesRef = useRef([]);
  const anchorSpritesRef = useRef({});
  const landmarkSpritesRef = useRef([]);
  const graphDataRef = useRef(null);
  const interactiveMeshesRef = useRef([]);
  const edgeLinesRef = useRef([]);

  // Camera State Machine Ref
  const camControlRef = useRef({
    state: 'OVERVIEW',
    posCurrent: new THREE.Vector3(0, 11, 78),
    lookCurrent: new THREE.Vector3(0, 0, 0),
    posStart: new THREE.Vector3(0, 11, 78),
    lookStart: new THREE.Vector3(0, 0, 0),
    posTarget: new THREE.Vector3(0, 11, 78),
    lookTarget: new THREE.Vector3(0, 0, 0),
    transitionStartTime: 0,
    transitionDuration: 1050,
    postTransitionState: 'OVERVIEW',
    sphericalAngle: { theta: 0.05, phi: 1.42, radius: 78 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    pointerMoved: false,
    currentDimFactor: 1.0
  });

  // Respect system prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) setReducedMotion(true);
      const handler = (e) => setReducedMotion(e.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, []);

  // Build spatial coordinates with non-overlapping orbital planes perpendicular to the camera
  const spatialGraph = useMemo(() => {
    const spine = generateLorenzManifold(4200, 0.0046);

    const anchors = ANCHOR_DEFINITIONS.map((def) => {
      const basePt = spine[Math.min(def.spineIndex, spine.length - 1)];
      const pos = new THREE.Vector3(
        basePt.x + def.offset[0],
        basePt.y + def.offset[1],
        basePt.z + def.offset[2]
      );

      // Compute the exact camera offset direction used in FOCUS mode
      const radialDir = pos.clone().normalize();
      if (radialDir.lengthSq() < 0.01) radialDir.set(0, 0, 1);
      const camOffset = new THREE.Vector3(
        radialDir.x * 7.5,
        2.5,
        20.0 + Math.abs(radialDir.z) * 2.5
      );
      const viewDir = camOffset.clone().normalize();

      // Orthonormal basis (right, up) perpendicular to the camera sightline so labels NEVER overlap
      const worldUp = new THREE.Vector3(0, 1, 0);
      const basisRight = new THREE.Vector3().crossVectors(worldUp, viewDir).normalize();
      const basisUp = new THREE.Vector3().crossVectors(viewDir, basisRight).normalize();

      const count = def.satellites.length;
      const orbitRadius = 6.6;

      const satellites = def.satellites.map((sat, idx) => {
        // Distribute evenly in a clean clock-face arc around the anchor
        const angle = (idx / count) * Math.PI * 2 - Math.PI / 2;
        const satPos = pos
          .clone()
          .addScaledVector(basisRight, Math.cos(angle) * orbitRadius * 1.12)
          .addScaledVector(basisUp, Math.sin(angle) * orbitRadius * 0.88);

        return {
          ...sat,
          parentId: def.id,
          parentGlyph: def.glyph,
          position: satPos,
          orbitAngle: angle
        };
      });

      return {
        ...def,
        position: pos,
        camOffset,
        basisRight,
        basisUp,
        satellites
      };
    });

    const anchorMap = Object.fromEntries(anchors.map((a) => [a.id, a]));

    const bridges = INTER_ANCHOR_BRIDGES.map((b) => {
      const fromAnchor = anchorMap[b.from];
      const toAnchor = anchorMap[b.to];
      return {
        ...b,
        isBridge: true,
        fromGlyph: fromAnchor.glyph,
        toGlyph: toAnchor.glyph,
        fromPos: fromAnchor.position,
        toPos: toAnchor.position
      };
    });

    return { spine, anchors, anchorMap, bridges };
  }, []);

  useEffect(() => {
    graphDataRef.current = {
      ...spatialGraph,
      selectedAnchorId,
      selectedEdge,
      activeFilters,
      reducedMotion,
      qualityTier
    };
  }, [spatialGraph, selectedAnchorId, selectedEdge, activeFilters, reducedMotion, qualityTier]);

  // Smooth Camera Transition Helper
  const flyCameraTo = useCallback(
    (targetPos, targetLook, targetStateAfter) => {
      const ctrl = camControlRef.current;
      if (reducedMotion) {
        ctrl.posCurrent.copy(targetPos);
        ctrl.lookCurrent.copy(targetLook);
        ctrl.posTarget.copy(targetPos);
        ctrl.lookTarget.copy(targetLook);
        ctrl.state = targetStateAfter;
        setNavState(targetStateAfter);
        return;
      }

      ctrl.posStart.copy(ctrl.posCurrent);
      ctrl.lookStart.copy(ctrl.lookCurrent);
      ctrl.posTarget.copy(targetPos);
      ctrl.lookTarget.copy(targetLook);
      ctrl.transitionStartTime = performance.now();
      ctrl.transitionDuration = 1000;
      ctrl.state = 'TRANSITION';
      ctrl.postTransitionState = targetStateAfter;
      setNavState('TRANSITION');
    },
    [reducedMotion]
  );

  // Reset to Galaxy Overview
  const handleResetOverview = useCallback(() => {
    setSelectedAnchorId(null);
    setSelectedEdge(null);
    const targetPos = new THREE.Vector3(0, 11, 78);
    const targetLook = new THREE.Vector3(0, 0, 0);
    camControlRef.current.sphericalAngle = { theta: 0.05, phi: 1.42, radius: 78 };
    flyCameraTo(targetPos, targetLook, 'OVERVIEW');
  }, [flyCameraTo]);

  // Focus on an Anchor Star (Frames constellation on left-center so right reading sheet never overlaps)
  const handleSelectAnchor = useCallback(
    (anchorId) => {
      const anchor = spatialGraph.anchorMap[anchorId];
      if (!anchor) return;
      setSelectedAnchorId(anchorId);
      setSelectedEdge(null);

      const targetPos = anchor.position.clone().add(anchor.camOffset);
      // Shift lookAt target along basisRight so the constellation sits cleanly in the left 62% of the viewport
      const targetLook = anchor.position
        .clone()
        .addScaledVector(anchor.basisRight, 3.3);

      flyCameraTo(targetPos, targetLook, 'FOCUS');
    },
    [spatialGraph, flyCameraTo]
  );

  // Isolate a single Dyadic Connection (Anchor ↔ Satellite or Anchor ↔ Anchor)
  const handleSelectEdge = useCallback(
    (edgeObj) => {
      setSelectedEdge(edgeObj);
      if (edgeObj.parentId) {
        setSelectedAnchorId(edgeObj.parentId);
      } else if (edgeObj.from && !selectedAnchorId) {
        setSelectedAnchorId(edgeObj.from);
      }

      // If it's a local satellite edge, keep the clean orbital plane framing and gently tighten focus
      if (!edgeObj.isBridge && edgeObj.parentId) {
        const anchor = spatialGraph.anchorMap[edgeObj.parentId];
        const mid = new THREE.Vector3().addVectors(edgeObj.fromPos, edgeObj.toPos).multiplyScalar(0.5);
        const targetPos = mid.clone().addScaledVector(anchor.camOffset.clone().normalize(), 16.5);
        const targetLook = mid.clone().addScaledVector(anchor.basisRight, 2.4);
        flyCameraTo(targetPos, targetLook, 'CONNECTION');
        return;
      }

      // Inter-Anchor Bridge framing
      const p1 = edgeObj.fromPos;
      const p2 = edgeObj.toPos;
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const span = p1.distanceTo(p2);

      const edgeDir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      let perp = new THREE.Vector3().crossVectors(edgeDir, up).normalize();
      if (perp.z < 0) perp.negate();
      if (perp.lengthSq() < 0.1) perp.set(0, 0.2, 1).normalize();

      const dist = Math.max(15.0, span * 1.15);
      const targetPos = mid.clone().addScaledVector(perp, dist).add(new THREE.Vector3(0, 2.0, 4.0));
      const targetLook = mid.clone().add(new THREE.Vector3(3.2, 0, 0));

      flyCameraTo(targetPos, targetLook, 'CONNECTION');
    },
    [spatialGraph, selectedAnchorId, flyCameraTo]
  );

  // Step Back One Level (Esc / Backspace)
  const handleStepBack = useCallback(() => {
    if (selectedEdge) {
      if (selectedAnchorId) {
        handleSelectAnchor(selectedAnchorId);
      } else {
        handleResetOverview();
      }
    } else if (selectedAnchorId) {
      handleResetOverview();
    } else if (navState === 'FREE_ORBIT') {
      handleResetOverview();
    }
  }, [selectedEdge, selectedAnchorId, navState, handleSelectAnchor, handleResetOverview]);

  // Keyboard Shortcuts (1–8 to select/toggle anchors, Esc to step back)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1;
        const anchor = spatialGraph.anchors[idx];
        if (anchor) {
          if (selectedAnchorId === anchor.id && !selectedEdge) {
            handleResetOverview();
          } else {
            handleSelectAnchor(anchor.id);
          }
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        if (showSettingsPopover) {
          setShowSettingsPopover(false);
        } else {
          handleStepBack();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [spatialGraph, selectedAnchorId, selectedEdge, showSettingsPopover, handleSelectAnchor, handleResetOverview, handleStepBack]);

  // Update Shader Quality & Motion Uniforms
  useEffect(() => {
    const tierCfg = QUALITY_TIERS[qualityTier];
    if (rendererRef.current) {
      const pr = Math.min(window.devicePixelRatio || 1, tierCfg.maxPixelRatio);
      rendererRef.current.setPixelRatio(pr);
    }
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uQualityRatio.value = tierCfg.particleRatio;
      shaderMatRef.current.uniforms.uPointScale.value = tierCfg.pointScale;
      shaderMatRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1.0 : 0.0;
    }
  }, [qualityTier, reducedMotion]);

  // ============================================================================
  // 7. THREE.JS SCENE INITIALIZATION & CONTEMPLATIVE RENDER LOOP
  // ============================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.VOID);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 450);
    camera.position.copy(camControlRef.current.posCurrent);
    camera.lookAt(camControlRef.current.lookCurrent);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, QUALITY_TIERS.HIGH.maxPixelRatio));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const jwstFlareTex = createJWSTFlareTexture();
    const softHaloTex = createSoftHaloTexture();

    // 1. Whisper-Delicate Lorenz Attractor Ribbon (~4,500 fine sub-pixel dust points)
    const TOTAL_PARTICLES = 4500;
    const positions = new Float32Array(TOTAL_PARTICLES * 3);
    const colors = new Float32Array(TOTAL_PARTICLES * 3);
    const sizes = new Float32Array(TOTAL_PARTICLES);
    const alphas = new Float32Array(TOTAL_PARTICLES);
    const phases = new Float32Array(TOTAL_PARTICLES);
    const tierThresholds = new Float32Array(TOTAL_PARTICLES);

    const cVoidBlue = new THREE.Color(PALETTE.NEBULA);
    const cDeepBlue = new THREE.Color(PALETTE.NEBULA_DEEP);
    const cGold = new THREE.Color(PALETTE.GOLD);
    const cCrimson = new THREE.Color(PALETTE.CRIMSON);
    const cStarlight = new THREE.Color(PALETTE.STARLIGHT);

    const spine = spatialGraph.spine;
    const spineLen = spine.length;

    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const i3 = i * 3;
      const isDeepField = i > TOTAL_PARTICLES * 0.88;

      if (!isDeepField) {
        const sIdx = Math.floor((i / (TOTAL_PARTICLES * 0.88)) * (spineLen - 1));
        const pt = spine[sIdx];
        // Tighter, more sculpted ribbon dispersion so negative space dominates
        const r1 = (Math.random() + Math.random() - 1.0) * 2.3;
        const r2 = (Math.random() + Math.random() - 1.0) * 2.0;
        const r3 = (Math.random() + Math.random() - 1.0) * 2.3;

        positions[i3] = pt.x + r1;
        positions[i3 + 1] = pt.y + r2;
        positions[i3 + 2] = pt.z + r3;

        const distFromSpine = Math.sqrt(r1 * r1 + r2 * r2 + r3 * r3);
        const col = new THREE.Color();
        if (distFromSpine < 0.75) {
          col.lerpColors(cGold, cStarlight, Math.random() * 0.5);
          alphas[i] = 0.22 + Math.random() * 0.14;
          sizes[i] = 0.75 + Math.random() * 0.65;
        } else if (Math.random() < 0.1) {
          col.lerpColors(cCrimson, cGold, Math.random() * 0.4);
          alphas[i] = 0.18 + Math.random() * 0.12;
          sizes[i] = 0.7 + Math.random() * 0.55;
        } else {
          col.lerpColors(cVoidBlue, cDeepBlue, Math.random());
          alphas[i] = 0.14 + Math.random() * 0.16;
          sizes[i] = 0.65 + Math.random() * 0.65;
        }

        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
      } else {
        // Subtle distant starfield
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const rad = 65 + Math.random() * 85;
        positions[i3] = rad * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = rad * Math.sin(phi) * Math.sin(theta) * 0.75;
        positions[i3 + 2] = rad * Math.cos(phi);

        const col = Math.random() > 0.35 ? cStarlight : cVoidBlue;
        colors[i3] = col.r;
        colors[i3 + 1] = col.g;
        colors[i3 + 2] = col.b;
        alphas[i] = 0.12 + Math.random() * 0.2;
        sizes[i] = 0.6 + Math.random() * 0.65;
      }

      phases[i] = Math.random() * Math.PI * 2;
      tierThresholds[i] = Math.random();
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    particleGeo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    particleGeo.setAttribute('aTierThreshold', new THREE.BufferAttribute(tierThresholds, 1));

    const particleShaderMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX_SHADER,
      fragmentShader: PARTICLE_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uQualityRatio: { value: 1.0 },
        uPointScale: { value: 1.0 },
        uReducedMotion: { value: 0.0 },
        uDimFactor: { value: 1.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    shaderMatRef.current = particleShaderMat;
    scene.add(new THREE.Points(particleGeo, particleShaderMat));

    // 2. Crisp Mathematical Lorenz Attractor Curves (Crimson #A52F45 & Gold #E4AE60)
    const crimsonSpinePts = [];
    const goldHarmonicPts = [];
    for (let i = 0; i < spine.length; i += 3) {
      const p = spine[i];
      crimsonSpinePts.push(p);
      goldHarmonicPts.push(
        new THREE.Vector3(
          p.x * 0.97 + Math.sin(i * 0.015) * 0.55,
          p.y * 0.97 + Math.cos(i * 0.015) * 0.55,
          p.z
        )
      );
    }

    const crimsonSpineMat = new THREE.LineBasicMaterial({
      color: 0xA52F45,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending
    });
    const crimsonLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(crimsonSpinePts),
      crimsonSpineMat
    );
    scene.add(crimsonLine);

    const goldSpineMat = new THREE.LineBasicMaterial({
      color: 0xE4AE60,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending
    });
    const goldLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(goldHarmonicPts),
      goldSpineMat
    );
    scene.add(goldLine);
    spineLinesRef.current = [
      { mat: crimsonSpineMat, baseOpacity: 0.34 },
      { mat: goldSpineMat, baseOpacity: 0.14 }
    ];

    // 3. 8 Subtle Deep-Field Landmark Stars
    const landmarks = [];
    for (let i = 0; i < 8; i++) {
      const sIdx = Math.floor(((i + 0.5) / 8) * (spine.length - 1));
      const base = spine[sIdx];
      const spriteMat = new THREE.SpriteMaterial({
        map: jwstFlareTex,
        color: i % 2 === 0 ? 0xE4AE60 : 0xEAF2FF,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(
        base.x + Math.sin(i * 11) * 20,
        base.y + Math.cos(i * 7) * 15,
        base.z + Math.sin(i * 5) * 18
      );
      sprite.scale.set(2.8, 2.8, 1);
      scene.add(sprite);
      landmarks.push(spriteMat);
    }
    landmarkSpritesRef.current = landmarks;

    // 4. Build 8 Anchor Stars, Orbital Satellites & Semantic Filaments
    const interactiveMeshes = [];
    const edgeVisuals = [];
    const anchorSprites = {};

    const hitSphereGeo = new THREE.SphereGeometry(2.6, 12, 12);
    const satHitSphereGeo = new THREE.SphereGeometry(1.5, 10, 10);
    const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

    spatialGraph.anchors.forEach((anchor) => {
      const flareMat = new THREE.SpriteMaterial({
        map: jwstFlareTex,
        color: 0xEAF2FF,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const flareSprite = new THREE.Sprite(flareMat);
      flareSprite.position.copy(anchor.position);
      flareSprite.scale.set(6.8, 6.8, 1);
      scene.add(flareSprite);
      anchorSprites[anchor.id] = flareSprite;

      const hitMesh = new THREE.Mesh(hitSphereGeo, invisibleMat);
      hitMesh.position.copy(anchor.position);
      hitMesh.userData = { type: 'ANCHOR', anchorId: anchor.id };
      scene.add(hitMesh);
      interactiveMeshes.push(hitMesh);

      anchor.satellites.forEach((sat) => {
        const edgeMeta = EDGE_TYPES[sat.edgeType];

        const satMat = new THREE.SpriteMaterial({
          map: softHaloTex,
          color: edgeMeta.hex,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });
        const satSprite = new THREE.Sprite(satMat);
        satSprite.position.copy(sat.position);
        satSprite.scale.set(1.9, 1.9, 1);
        satSprite.visible = false;
        scene.add(satSprite);

        const satHit = new THREE.Mesh(satHitSphereGeo, invisibleMat);
        satHit.position.copy(sat.position);
        const edgePayload = {
          id: sat.id,
          isBridge: false,
          parentId: anchor.id,
          fromGlyph: anchor.glyph,
          toGlyph: sat.glyph,
          title: sat.title,
          lang: sat.lang,
          edgeType: sat.edgeType,
          source: sat.source,
          evidence: sat.evidence,
          fromPos: anchor.position,
          toPos: sat.position
        };
        satHit.userData = { type: 'SATELLITE', edge: edgePayload, parentId: anchor.id };
        scene.add(satHit);
        interactiveMeshes.push(satHit);

        // Gentle arc in the orbital plane
        const mid = new THREE.Vector3().addVectors(anchor.position, sat.position).multiplyScalar(0.5);
        mid.addScaledVector(anchor.basisUp, 0.45);
        const curve = new THREE.QuadraticBezierCurve3(anchor.position, mid, sat.position);
        const pts = curve.getPoints(28);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);

        const lineMat = edgeMeta.dashed
          ? new THREE.LineDashedMaterial({
            color: edgeMeta.hex,
            dashSize: 0.45,
            gapSize: 0.28,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
          })
          : new THREE.LineBasicMaterial({
            color: edgeMeta.hex,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending
          });

        const line = new THREE.Line(lineGeo, lineMat);
        if (edgeMeta.dashed) line.computeLineDistances();
        line.visible = false;
        scene.add(line);

        edgeVisuals.push({
          line,
          satSprite,
          edgePayload,
          isBridge: false,
          parentId: anchor.id,
          edgeType: sat.edgeType
        });
      });
    });

    anchorSpritesRef.current = anchorSprites;

    // 5. Primary Inter-Anchor Bridges
    spatialGraph.bridges.forEach((bridge) => {
      const edgeMeta = EDGE_TYPES[bridge.edgeType];
      const mid = new THREE.Vector3().addVectors(bridge.fromPos, bridge.toPos).multiplyScalar(0.5);
      const span = bridge.fromPos.distanceTo(bridge.toPos);
      mid.y += Math.min(5.5, span * 0.18);

      const curve = new THREE.QuadraticBezierCurve3(bridge.fromPos, mid, bridge.toPos);
      const pts = curve.getPoints(42);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);

      const lineMat = edgeMeta.dashed
        ? new THREE.LineDashedMaterial({
          color: edgeMeta.hex,
          dashSize: 0.85,
          gapSize: 0.42,
          transparent: true,
          opacity: 0.52,
          blending: THREE.AdditiveBlending
        })
        : new THREE.LineBasicMaterial({
          color: edgeMeta.hex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });

      const line = new THREE.Line(lineGeo, lineMat);
      if (edgeMeta.dashed) line.computeLineDistances();
      scene.add(line);

      const midPoint = curve.getPoint(0.5);
      const bridgeHit = new THREE.Mesh(satHitSphereGeo, invisibleMat);
      bridgeHit.position.copy(midPoint);
      bridgeHit.userData = { type: 'BRIDGE', edge: bridge };
      scene.add(bridgeHit);
      interactiveMeshes.push(bridgeHit);

      edgeVisuals.push({
        line,
        edgePayload: bridge,
        isBridge: true,
        fromId: bridge.from,
        toId: bridge.to,
        edgeType: bridge.edgeType
      });
    });

    interactiveMeshesRef.current = interactiveMeshes;
    edgeLinesRef.current = edgeVisuals;

    // ========================================================================
    // 8. POINTER / ORBIT / RAYCASTING INTERACTION
    // ========================================================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const domElem = renderer.domElement;

    const getNormalizedPointer = (clientX, clientY) => {
      const rect = domElem.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e) => {
      camControlRef.current.isDragging = true;
      camControlRef.current.pointerMoved = false;
      camControlRef.current.dragStart = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const ctrl = camControlRef.current;

      if (ctrl.isDragging) {
        const dx = e.clientX - ctrl.dragStart.x;
        const dy = e.clientY - ctrl.dragStart.y;
        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          ctrl.pointerMoved = true;
          if (ctrl.state !== 'FREE_ORBIT') {
            ctrl.state = 'FREE_ORBIT';
            setNavState('FREE_ORBIT');
          }
          const offset = ctrl.posCurrent.clone().sub(ctrl.lookCurrent);
          const spherical = new THREE.Spherical().setFromVector3(offset);
          spherical.theta -= dx * 0.005;
          spherical.phi = Math.max(0.22, Math.min(Math.PI - 0.22, spherical.phi - dy * 0.005));
          offset.setFromSpherical(spherical);
          ctrl.posCurrent.copy(ctrl.lookCurrent).add(offset);
          ctrl.dragStart = { x: e.clientX, y: e.clientY };
        }
        return;
      }

      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveMeshesRef.current, false);
      const gd = graphDataRef.current;

      const validHit = hits.find((h) => {
        const ud = h.object.userData;
        if (ud.type === 'ANCHOR') return true;
        if (ud.type === 'BRIDGE') return gd.activeFilters[ud.edge.edgeType];
        if (ud.type === 'SATELLITE') {
          return gd.selectedAnchorId === ud.parentId && gd.activeFilters[ud.edge.edgeType];
        }
        return false;
      });

      domElem.style.cursor = validHit ? 'pointer' : 'grab';
    };

    const onPointerUp = (e) => {
      const ctrl = camControlRef.current;
      const wasClick = !ctrl.pointerMoved;
      ctrl.isDragging = false;
      if (!wasClick) return;

      getNormalizedPointer(e.clientX, e.clientY);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactiveMeshesRef.current, false);
      const gd = graphDataRef.current;

      const validHit = hits.find((h) => {
        const ud = h.object.userData;
        if (ud.type === 'ANCHOR') return true;
        if (ud.type === 'BRIDGE') return gd.activeFilters[ud.edge.edgeType];
        if (ud.type === 'SATELLITE') {
          return gd.selectedAnchorId === ud.parentId && gd.activeFilters[ud.edge.edgeType];
        }
        return false;
      });

      if (validHit) {
        const ud = validHit.object.userData;
        if (ud.type === 'ANCHOR') {
          handleSelectAnchor(ud.anchorId);
        } else if (ud.type === 'SATELLITE' || ud.type === 'BRIDGE') {
          handleSelectEdge(ud.edge);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      const ctrl = camControlRef.current;
      if (ctrl.state !== 'FREE_ORBIT') {
        ctrl.state = 'FREE_ORBIT';
        setNavState('FREE_ORBIT');
      }
      const dir = ctrl.posCurrent.clone().sub(ctrl.lookCurrent);
      const nextLen = Math.max(10.0, Math.min(130.0, dir.length() + e.deltaY * 0.04));
      dir.normalize().multiplyScalar(nextLen);
      ctrl.posCurrent.copy(ctrl.lookCurrent).add(dir);
    };

    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ========================================================================
    // 9. ANIMATION & SILENT ADAPTIVE PERFORMANCE LOOP
    // ========================================================================
    let animFrameId;
    let lastTime = performance.now();
    const frameTimes = [];
    let lastTelemetryCheck = performance.now();
    let lastOverlayProjection = 0;

    const animate = (now) => {
      animFrameId = requestAnimationFrame(animate);

      const dtMs = now - lastTime;
      lastTime = now;

      frameTimes.push(dtMs);
      if (frameTimes.length > 45) frameTimes.shift();

      if (now - lastTelemetryCheck > 700) {
        lastTelemetryCheck = now;
        const avgMs = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const fps = Math.min(120, Math.round(1000 / Math.max(avgMs, 1)));
        setTelemetry({ fps, frameMs: Number(avgMs.toFixed(1)) });

        if (avgMs > 22.0 && frameTimes.length >= 40) {
          setQualityTier((prev) => {
            if (!autoQuality) return prev;
            if (prev === 'HIGH') return 'BALANCED';
            if (prev === 'BALANCED') return 'ECO';
            return prev;
          });
        }
      }

      particleShaderMat.uniforms.uTime.value = now * 0.001;

      const ctrl = camControlRef.current;
      const gd = graphDataRef.current;

      // Smoothly dim the background attractor by 75% when focused on a character or connection
      const targetDim = gd.selectedAnchorId || gd.selectedEdge ? 0.25 : 1.0;
      ctrl.currentDimFactor += (targetDim - ctrl.currentDimFactor) * 0.08;
      particleShaderMat.uniforms.uDimFactor.value = ctrl.currentDimFactor;

      spineLinesRef.current.forEach((s) => {
        s.mat.opacity = s.baseOpacity * ctrl.currentDimFactor;
      });
      landmarkSpritesRef.current.forEach((lm) => {
        lm.opacity = 0.35 * ctrl.currentDimFactor;
      });

      // Dim non-selected anchor flares by 75% during FOCUS / CONNECTION
      Object.entries(anchorSpritesRef.current).forEach(([id, sprite]) => {
        const isFocused =
          !gd.selectedAnchorId ||
          gd.selectedAnchorId === id ||
          (gd.selectedEdge &&
            gd.selectedEdge.isBridge &&
            (gd.selectedEdge.from === id || gd.selectedEdge.to === id));
        const targetOp = isFocused ? 0.95 : 0.2;
        sprite.material.opacity += (targetOp - sprite.material.opacity) * 0.1;
      });

      // Camera State Machine Interpolation
      if (ctrl.state === 'TRANSITION') {
        const elapsed = now - ctrl.transitionStartTime;
        const rawT = Math.min(1.0, elapsed / ctrl.transitionDuration);
        const easeT = 1.0 - Math.pow(1.0 - rawT, 3);
        ctrl.posCurrent.lerpVectors(ctrl.posStart, ctrl.posTarget, easeT);
        ctrl.lookCurrent.lerpVectors(ctrl.lookStart, ctrl.lookTarget, easeT);

        if (rawT >= 1.0) {
          ctrl.state = ctrl.postTransitionState;
          setNavState(ctrl.postTransitionState);
        }
      } else if (ctrl.state === 'OVERVIEW' && !gd.reducedMotion) {
        ctrl.sphericalAngle.theta += 0.00038;
        const r = ctrl.sphericalAngle.radius;
        ctrl.posCurrent.x = r * Math.sin(ctrl.sphericalAngle.phi) * Math.sin(ctrl.sphericalAngle.theta);
        ctrl.posCurrent.y = r * Math.cos(ctrl.sphericalAngle.phi);
        ctrl.posCurrent.z = r * Math.sin(ctrl.sphericalAngle.phi) * Math.cos(ctrl.sphericalAngle.theta);
      }

      camera.position.copy(ctrl.posCurrent);
      camera.lookAt(ctrl.lookCurrent);

      // Update Filaments & Satellites for Focus vs. Dyadic Connection Isolation
      edgeLinesRef.current.forEach((ev) => {
        const filterOn = gd.activeFilters[ev.edgeType];
        const isSelectedEdge = gd.selectedEdge && gd.selectedEdge.id === ev.edgePayload.id;

        if (!filterOn) {
          ev.line.visible = false;
          if (ev.satSprite) ev.satSprite.visible = false;
          return;
        }

        if (ev.isBridge) {
          ev.line.visible = true;
          if (gd.selectedEdge) {
            ev.line.material.opacity = isSelectedEdge ? 0.98 : 0.05;
          } else if (gd.selectedAnchorId) {
            const isConnectedToFocus =
              ev.fromId === gd.selectedAnchorId || ev.toId === gd.selectedAnchorId;
            ev.line.material.opacity = isConnectedToFocus ? 0.65 : 0.06;
          } else {
            ev.line.material.opacity = 0.48;
          }
        } else {
          // Local orbital satellite: ONLY visible when its parent anchor is focused
          const isParentFocused = gd.selectedAnchorId === ev.parentId;
          ev.line.visible = isParentFocused;
          if (ev.satSprite) ev.satSprite.visible = isParentFocused;

          if (isParentFocused) {
            if (gd.selectedEdge) {
              // In CONNECTION state, isolate the active dyadic link and dim sibling satellites
              ev.line.material.opacity = isSelectedEdge ? 0.98 : 0.12;
              if (ev.satSprite) ev.satSprite.material.opacity = isSelectedEdge ? 1.0 : 0.2;
            } else {
              ev.line.material.opacity = 0.72;
              if (ev.satSprite) ev.satSprite.material.opacity = 0.88;
            }
          }
        }
      });

      renderer.render(scene, camera);

      // Project 3D coordinates to 2D screen space for crisp HTML typography
      if (now - lastOverlayProjection > 25) {
        lastOverlayProjection = now;
        const rect = domElem.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;

        const projAnchors = gd.anchors.map((a) => {
          const v = a.position.clone().project(camera);
          return {
            id: a.id,
            keyNum: a.keyNum,
            glyph: a.glyph,
            pinyin: a.pinyin.split(' ')[0],
            x: (v.x * 0.5 + 0.5) * w,
            y: (-v.y * 0.5 + 0.5) * h,
            visible: v.z < 1.0 && v.z > -1.0
          };
        });

        const projSatellites = [];
        if (gd.selectedAnchorId) {
          const activeAnchor = gd.anchorMap[gd.selectedAnchorId];
          if (activeAnchor) {
            activeAnchor.satellites.forEach((sat) => {
              if (!gd.activeFilters[sat.edgeType]) return;
              const v = sat.position.clone().project(camera);
              if (v.z < 1.0 && v.z > -1.0) {
                projSatellites.push({
                  id: sat.id,
                  parentId: activeAnchor.id,
                  glyph: sat.glyph,
                  title: sat.title,
                  lang: sat.lang,
                  edgeType: sat.edgeType,
                  x: (v.x * 0.5 + 0.5) * w,
                  y: (-v.y * 0.5 + 0.5) * h,
                  edgePayload: {
                    ...sat,
                    isBridge: false,
                    parentId: activeAnchor.id,
                    fromGlyph: activeAnchor.glyph,
                    toGlyph: sat.glyph,
                    fromPos: activeAnchor.position,
                    toPos: sat.position
                  }
                });
              }
            });
          }
        }

        setProjectedNodes({ anchors: projAnchors, satellites: projSatellites });
      }
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [spatialGraph, handleSelectAnchor, handleSelectEdge, autoQuality]);

  // Derived objects for Editorial Sheet
  const focusedAnchor = selectedAnchorId ? spatialGraph.anchorMap[selectedAnchorId] : null;
  const relatedBridges = useMemo(() => {
    if (!selectedAnchorId) return [];
    return spatialGraph.bridges.filter(
      (b) => b.from === selectedAnchorId || b.to === selectedAnchorId
    );
  }, [spatialGraph, selectedAnchorId]);

  const toggleFilter = (typeId) => {
    setActiveFilters((prev) => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none font-sans"
      style={{ backgroundColor: PALETTE.VOID, color: PALETTE.STARLIGHT }}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* ====================================================================
          1. CRYSTAL-CLEAR 2D FLOATING NODE TYPOGRAPHY (ZERO OVERLAP)
          ==================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 8 Primary Anchor Stars */}
        {projectedNodes.anchors.map((node) => {
          if (!node.visible) return null;
          const isSelected = selectedAnchorId === node.id;
          const isBridgePartner =
            selectedEdge &&
            selectedEdge.isBridge &&
            (selectedEdge.from === node.id || selectedEdge.to === node.id);
          const dimmed = (selectedAnchorId || selectedEdge) && !isSelected && !isBridgePartner;

          return (
            <button
              key={node.id}
              onClick={() => handleSelectAnchor(node.id)}
              style={{
                transform: `translate3d(${node.x}px, ${node.y}px, 0) translate(-50%, -50%)`
              }}
              className={`pointer-events-auto absolute group transition-all duration-500 focus:outline-none rounded-full p-2 ${dimmed ? 'opacity-20 hover:opacity-75 scale-90' : 'opacity-100'
                }`}
              aria-label={`Explore ${node.glyph} (${node.pinyin})`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-300 ${isSelected
                      ? 'w-14 h-14 bg-[#05060B]/80 border border-amber-400/70 shadow-[0_0_30px_rgba(228,174,96,0.35)]'
                      : 'w-11 h-11 bg-[#05060B]/60 border border-white/15 group-hover:border-amber-300/60 group-hover:scale-110'
                    }`}
                >
                  <span
                    className={`font-serif tracking-tight ${isSelected ? 'text-2xl text-amber-200' : 'text-xl text-slate-100'
                      }`}
                  >
                    {node.glyph}
                  </span>
                </div>
                <span
                  className={`mt-1.5 text-[11px] tracking-widest uppercase font-mono transition-colors ${isSelected ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                >
                  {node.pinyin}
                </span>
              </div>
            </button>
          );
        })}

        {/* Curated Orbital Satellites (ONLY visible in FOCUS / CONNECTION) */}
        {projectedNodes.satellites.map((sat) => {
          const edgeMeta = EDGE_TYPES[sat.edgeType];
          const isSelectedSat = selectedEdge && selectedEdge.id === sat.id;
          const isDimmedSibling = selectedEdge && !isSelectedSat;

          return (
            <button
              key={sat.id}
              onClick={() =>
                isSelectedSat && focusedAnchor
                  ? handleSelectAnchor(focusedAnchor.id)
                  : handleSelectEdge(sat.edgePayload)
              }
              style={{
                transform: `translate3d(${sat.x}px, ${sat.y}px, 0) translate(-50%, -50%)`
              }}
              className={`pointer-events-auto absolute text-left transition-all duration-300 focus:outline-none rounded-xl px-3 py-1.5 backdrop-blur-md border ${isSelectedSat
                  ? 'bg-[#05060B]/95 border-amber-400/80 shadow-[0_0_24px_rgba(228,174,96,0.28)] scale-105 z-20'
                  : isDimmedSibling
                    ? 'opacity-25 hover:opacity-80 bg-[#05060B]/70 border-white/10 z-10'
                    : 'bg-[#05060B]/80 border-white/15 hover:border-white/40 z-10'
                }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: edgeMeta.color }}
                />
                <span className="text-xs font-serif font-medium text-slate-100 whitespace-nowrap">
                  {sat.glyph}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                {sat.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          2. WHISPER-QUIET TOP HEADER (MINIMAL BREADCRUMB & SETTINGS POPOVER)
          ==================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 pointer-events-none">
        {/* Top-Left Minimal Identity & Breadcrumb */}
        <nav
          aria-label="Semantic Breadcrumb"
          className="flex items-center gap-2.5 pointer-events-auto text-xs tracking-wide"
        >
          <button
            onClick={handleResetOverview}
            className="flex items-center gap-2 text-slate-200 hover:text-amber-300 transition focus:outline-none"
          >
            <span className="font-serif text-base text-amber-300/90">如實</span>
            <span className="text-slate-500">·</span>
            <span className={!focusedAnchor ? 'text-slate-100 font-medium' : 'text-slate-400'}>
              Galaxy
            </span>
          </button>

          {focusedAnchor && (
            <>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => handleSelectAnchor(focusedAnchor.id)}
                className={`flex items-center gap-1.5 transition focus:outline-none ${!selectedEdge ? 'text-amber-200 font-medium' : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <span className="font-serif text-sm">{focusedAnchor.glyph}</span>
                <span className="font-mono text-[11px]">{focusedAnchor.pinyin.split(' ')[0]}</span>
              </button>
            </>
          )}

          {selectedEdge && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-amber-200 font-medium truncate max-w-[180px]">
                {selectedEdge.toGlyph}
              </span>
            </>
          )}
        </nav>

        {/* Top-Right Single Subtle Settings Icon */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setShowSettingsPopover((v) => !v)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-white/5 transition focus:outline-none"
            title="Epistemic Filters & Performance Settings"
            aria-label="Settings and Epistemic Filters"
          >
            <Settings className="w-4 h-4" />
          </button>

          {showSettingsPopover && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#080A12]/95 border border-white/10 backdrop-blur-xl p-4 shadow-2xl space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  Epistemic Filters
                </span>
                <button
                  onClick={() => setShowSettingsPopover(false)}
                  className="text-slate-500 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {Object.values(EDGE_TYPES).map((et) => {
                  const active = activeFilters[et.id];
                  return (
                    <button
                      key={et.id}
                      onClick={() => toggleFilter(et.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: active ? et.color : '#334155' }}
                        />
                        <span className={active ? 'text-slate-200' : 'text-slate-500 line-through'}>
                          {et.label}
                        </span>
                      </div>
                      {active && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Motion</span>
                  <button
                    onClick={() => setReducedMotion((v) => !v)}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-[10px]"
                  >
                    {reducedMotion ? 'Static (Reduced)' : 'Orbital Drift'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Render Tier ({telemetry.fps} FPS)</span>
                  <div className="flex gap-1">
                    {Object.keys(QUALITY_TIERS).map((tk) => (
                      <button
                        key={tk}
                        onClick={() => {
                          setAutoQuality(false);
                          setQualityTier(tk);
                        }}
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${qualityTier === tk
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                            : 'text-slate-500 hover:text-slate-300'
                          }`}
                      >
                        {tk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ====================================================================
          3. SERENE EDITORIAL READING SHEET (ONLY IN FOCUS OR CONNECTION)
          ==================================================================== */}
      {(focusedAnchor || selectedEdge) && (
        <aside
          aria-label="Editorial Semantic Reading Sheet"
          className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] z-20 bg-[#05060B]/88 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-hidden transition-all duration-500"
        >
          {/* Editorial Top Action Bar */}
          <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-white/5">
            <button
              onClick={handleStepBack}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 transition focus:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{selectedEdge ? 'All Constellations' : 'Galaxy Overview'}</span>
            </button>

            <button
              onClick={handleResetOverview}
              className="text-slate-500 hover:text-slate-200 transition p-1"
              title="Close Reading Sheet (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Editorial Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
            {focusedAnchor && (
              <>
                {/* Large Calligraphic Character Header */}
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3.5">
                      <h1 className="text-5xl font-serif text-amber-100 tracking-tight">
                        {focusedAnchor.glyph}
                      </h1>
                      <div>
                        <div className="text-lg font-medium text-slate-100">
                          {focusedAnchor.pinyin}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          {focusedAnchor.oldChinese}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-medium tracking-wide text-amber-300/90">
                      {focusedAnchor.coreGloss}
                    </p>
                  </div>
                </div>

                {/* Radical Decomposition & Contemplative Summary */}
                <div className="space-y-2.5 border-t border-b border-white/10 py-4">
                  <div className="text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500 uppercase tracking-wider mr-2">Structure</span>
                    {focusedAnchor.radicals}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {focusedAnchor.summary}
                  </p>
                </div>
              </>
            )}

            {/* INLINE EPISTEMIC CARD (WHEN A SATELLITE OR BRIDGE IS SELECTED) */}
            {selectedEdge && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-400/30 space-y-3.5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: EDGE_TYPES[selectedEdge.edgeType].color }}
                    />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                      {EDGE_TYPES[selectedEdge.edgeType].label}
                    </span>
                  </div>
                  {selectedEdge.lang && (
                    <span className="text-[11px] font-mono text-slate-400">
                      {selectedEdge.lang}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-xl font-serif text-white">
                      {selectedEdge.fromGlyph}{' '}
                      <span className="text-slate-500 mx-1">↔</span> {selectedEdge.toGlyph}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5 font-medium">
                      {selectedEdge.title}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-light">
                  {selectedEdge.evidence}
                </p>

                <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  <span className="truncate">{selectedEdge.source}</span>
                </div>
              </div>
            )}

            {/* CURATED POLYLINGUAL SATELLITES (GROUPED CLEANLY) */}
            {focusedAnchor && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                    Constellation Resonances
                  </h2>
                  {selectedEdge && (
                    <button
                      onClick={() => handleSelectAnchor(focusedAnchor.id)}
                      className="text-[11px] text-amber-300/90 hover:text-amber-200"
                    >
                      Show all
                    </button>
                  )}
                </div>

                <div className="divide-y divide-white/5 border-t border-b border-white/5">
                  {focusedAnchor.satellites.map((sat) => {
                    const edgeMeta = EDGE_TYPES[sat.edgeType];
                    const isSelected = selectedEdge && selectedEdge.id === sat.id;

                    return (
                      <button
                        key={sat.id}
                        onClick={() =>
                          isSelected
                            ? handleSelectAnchor(focusedAnchor.id)
                            : handleSelectEdge({
                              ...sat,
                              isBridge: false,
                              parentId: focusedAnchor.id,
                              fromGlyph: focusedAnchor.glyph,
                              toGlyph: sat.glyph,
                              fromPos: focusedAnchor.position,
                              toPos: sat.position
                            })
                        }
                        className={`w-full py-3.5 px-2 text-left transition flex items-start justify-between gap-3 group ${isSelected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                          }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: edgeMeta.color }}
                            />
                            <span className="font-serif text-sm text-slate-100 group-hover:text-amber-200 transition">
                              {sat.glyph}
                            </span>
                            <span className="text-xs text-slate-400">· {sat.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 pl-3.5">
                            {edgeMeta.shortLabel} · {sat.lang}
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-amber-300 rotate-90' : 'text-slate-600 group-hover:text-slate-300'
                            }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRIMARY INTER-ANCHOR BRIDGES */}
            {relatedBridges.length > 0 && (
              <div className="space-y-2.5 pb-8">
                <h2 className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                  Inter-Anchor Bridges
                </h2>
                <div className="space-y-1.5">
                  {relatedBridges.map((bridge) => {
                    const edgeMeta = EDGE_TYPES[bridge.edgeType];
                    const isSelected = selectedEdge && selectedEdge.id === bridge.id;
                    const partnerId = bridge.from === selectedAnchorId ? bridge.to : bridge.from;
                    const partner = spatialGraph.anchorMap[partnerId];

                    return (
                      <div
                        key={bridge.id}
                        className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${isSelected
                            ? 'bg-white/[0.05] border-amber-400/50'
                            : 'bg-white/[0.015] border-white/5 hover:border-white/15'
                          }`}
                      >
                        <button
                          onClick={() => handleSelectEdge(bridge)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: edgeMeta.color }}
                            />
                            <span className="text-xs font-medium text-slate-200">
                              {bridge.title}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 pl-3.5 mt-0.5">
                            {bridge.subtitle}
                          </div>
                        </button>

                        {partner && (
                          <button
                            onClick={() => handleSelectAnchor(partner.id)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-serif text-amber-200/90 shrink-0"
                            title={`Glide to ${partner.glyph}`}
                          >
                            → {partner.glyph}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ====================================================================
          4. MINIMAL FLOATING BOTTOM NAVIGATION DOCK (道 · 無 · 為 · 愛 · 不 · 二 · 量 · 司)
          ==================================================================== */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="flex items-center gap-1 sm:gap-1.5 px-3 py-2 rounded-full bg-[#080A12]/85 border border-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          {spatialGraph.anchors.map((a, idx) => {
            const active = selectedAnchorId === a.id;
            return (
              <React.Fragment key={a.id}>
                <button
                  onClick={() =>
                    active && !selectedEdge ? handleResetOverview() : handleSelectAnchor(a.id)
                  }
                  className={`relative px-3 py-1.5 rounded-full transition-all duration-300 focus:outline-none ${active
                      ? 'bg-amber-400/15 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(228,174,96,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  title={`${a.glyph} (${a.pinyin}) — Press ${a.keyNum}`}
                >
                  <span className="font-serif text-base sm:text-lg">{a.glyph}</span>
                </button>
                {idx < spatialGraph.anchors.length - 1 && (
                  <span className="text-slate-700 text-xs select-none hidden sm:inline">·</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </footer>
    </div>
  );
}