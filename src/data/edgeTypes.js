// ============================================================================
// Epistemic taxonomy — every line in the galaxy is a claim, and every claim
// declares what kind of claim it is. Ids are stable; labels may evolve.
// Colour is never the only carrier of meaning: each type also has a distinct
// line pattern (solid / dashed / dotted) and a text label wherever it appears.
// ============================================================================

export const PALETTE = {
  void: '#05060B',
  nebula: '#183D79',
  nebulaDeep: '#0A1936',
  gold: '#E4AE60',
  crimson: '#A52F45',
  crimsonText: '#E07A8E', // lighter tint of crimson for text contrast on void
  starlight: '#EAF2FF',
  sinitic: '#6BA4FF',
  moonlight: '#A9B8D6',
};

export const EDGE_TYPES = {
  CANONICAL_TRANSLATION: {
    id: 'CANONICAL_TRANSLATION',
    label: 'Attested Translation',
    shortLabel: 'Translation',
    color: PALETTE.gold,
    textColor: PALETTE.gold,
    pattern: 'solid',
    question: 'Did translators actually use this word for that one?',
    description:
      'A documented rendering in translated texts — for example, how Chinese Buddhist translators rendered a Sanskrit term. Checkable against the canon.',
  },
  ETYMOLOGICAL_SINITIC: {
    id: 'ETYMOLOGICAL_SINITIC',
    label: 'Sinitic Etymology & Usage',
    shortLabel: 'Etymology',
    color: PALETTE.sinitic,
    textColor: '#8FBBFF',
    pattern: 'solid',
    question: 'What does the history of the graph, its sounds and its classical uses show?',
    description:
      'Evidence internal to Chinese: the shapes of early script, reconstructed Old Chinese sound, tone-derived word pairs, and classical texts. Some origins remain debated, and the card says so.',
  },
  CROSS_LINGUISTIC_LEXICAL: {
    id: 'CROSS_LINGUISTIC_LEXICAL',
    label: 'Analogy Across Languages',
    shortLabel: 'Analogy',
    color: PALETTE.moonlight,
    textColor: '#C3CFE6',
    pattern: 'dashed',
    question: 'Where do other languages carve the same idea in a similar way?',
    description:
      'A parallel in Malay, Greek, French or elsewhere. Not a translation and not a shared ancestry — a resemblance offered to sharpen understanding.',
  },
  INTERPRETIVE_SYNTHESIS: {
    id: 'INTERPRETIVE_SYNTHESIS',
    label: 'Original Interpretation',
    shortLabel: 'Interpretation',
    color: PALETTE.crimson,
    textColor: PALETTE.crimsonText,
    pattern: 'dotted',
    question: 'What does this project propose?',
    description:
      'A proposition made by Rushi itself, offered for reflection. It is not presented as historical fact or settled doctrine.',
  },
};

// Defined now, used from Phase 1 (Graphic Structure) and Phase 4 (Traditional
// Correspondence). Not listed in EDGE_TYPE_ORDER until the data contains them,
// so the key never shows a type with nothing behind it.
EDGE_TYPES.GRAPHIC_STRUCTURE = {
  id: 'GRAPHIC_STRUCTURE',
  label: 'Graphic Structure',
  shortLabel: 'Structure',
  color: '#D9E2F2',
  textColor: '#D9E2F2',
  pattern: 'solid',
  question: 'Does one character contain another?',
  description:
    'A component relationship derived from character-decomposition data, not written by hand: 愛 contains 心.',
};
EDGE_TYPES.TRADITIONAL_CORRESPONDENCE = {
  id: 'TRADITIONAL_CORRESPONDENCE',
  label: 'Traditional Correspondence',
  shortLabel: 'Correspondence',
  color: '#B7A4E8',
  textColor: '#C9BAF0',
  pattern: 'dashdot',
  question: 'What does a symbolic system itself hold?',
  description:
    'What a tradition asserts within its own system, cited to its own texts — reported, never endorsed as a claim about the cosmos.',
};

export const EDGE_TYPE_ORDER = [
  'CANONICAL_TRANSLATION',
  'ETYMOLOGICAL_SINITIC',
  'CROSS_LINGUISTIC_LEXICAL',
  'INTERPRETIVE_SYNTHESIS',
];
