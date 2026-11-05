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
    label: 'Sinitic Etymology',
    shortLabel: 'Etymology',
    color: PALETTE.sinitic,
    textColor: '#8FBBFF',
    pattern: 'solid',
    question: 'What does the history of the graph and its sounds show?',
    description:
      'Evidence internal to Chinese: the shapes of early script, reconstructed Old Chinese sound, and tone-derived word pairs. Some origins remain debated, and the card says so.',
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

// Existing specialist types retain their IDs and text labels while sharing
// the blue history/form and violet text/tradition colour families.
EDGE_TYPES.GRAPHIC_STRUCTURE = {
  id: 'GRAPHIC_STRUCTURE',
  label: 'Graphic Structure',
  shortLabel: 'Structure',
  color: PALETTE.sinitic,
  textColor: '#8FBBFF',
  pattern: 'solid',
  question: 'Does one character contain another?',
  description:
    'A visible component or compound-membership relationship. This describes composition, not the historical origin or philosophical meaning of the whole.',
};
EDGE_TYPES.TRADITIONAL_CORRESPONDENCE = {
  id: 'TRADITIONAL_CORRESPONDENCE',
  label: 'Traditional Correspondence',
  shortLabel: 'Correspondence',
  color: '#B7A4E8',
  textColor: '#C9BAF0',
  pattern: 'dashed',
  question: 'What does a symbolic system itself hold?',
  description:
    'What a tradition asserts within its own system, cited to its own texts — reported, never endorsed as a claim about the cosmos.',
};

EDGE_TYPES.TEXTUAL_CONNECTION = {
  id: 'TEXTUAL_CONNECTION', label: 'Textual Connection', shortLabel: 'Textual',
  color: '#B7A4E8', textColor: '#C9BAF0', pattern: 'solid',
  question: 'Which passage connects these ideas?',
  description: 'A connection made in a named text. Co-occurrence or argument is not evidence of common word origin or equivalence.',
};
EDGE_TYPES.SEMANTIC_CONTRAST = {
  id: 'SEMANTIC_CONTRAST', label: 'Semantic Contrast', shortLabel: 'Contrast',
  color: '#F39C85', textColor: '#F5AF9D', pattern: 'dashed',
  question: 'What difference does this context preserve?',
  description: 'A contextual distinction in meaning or use. Read the examples and limits; a contrast is not a claim that the terms are always opposites.',
};

// Six main hues. Existing structure and correspondence types remain explicit
// subtypes of the blue form/history and violet text/tradition families.
export const EDGE_TYPE_ORDER = [
  'CANONICAL_TRANSLATION',
  'ETYMOLOGICAL_SINITIC',
  'TEXTUAL_CONNECTION',
  'SEMANTIC_CONTRAST',
  'CROSS_LINGUISTIC_LEXICAL',
  'INTERPRETIVE_SYNTHESIS',
];

export const EDGE_DETAIL_ORDER = [...EDGE_TYPE_ORDER, 'GRAPHIC_STRUCTURE', 'TRADITIONAL_CORRESPONDENCE'];
