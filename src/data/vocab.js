// ============================================================================
// Controlled vocabulary for Schema v2. Every claim in Rushi sits on three
// independent axes (see docs/ROADMAP — "The Hyperdimensional Model"):
//   dimension  what the connection is about
//   type       how we know it            (EDGE_TYPES, edgeTypes.js)
//   status     editorial standing in Rushi
// plus a verification ledger saying what each citation has been checked against.
// ============================================================================

export const DIMENSIONS = {
  form: 'Form — the shape of the graph',
  sound: 'Sound — reconstruction, tone, phonetic series',
  sense: 'Sense — meanings and their history',
  translation: 'Translation — rendering between languages',
  sinosphere: 'Sinosphere — readings across Chinese, Japanese, Korean, Vietnamese',
  cosmos: 'Cosmos — cosmogony and the sky',
  symbol: 'Symbol — correspondences within a symbolic system',
  practice: 'Practice — words used in ritual or recitation (reported, never prescribed)',
  interpretation: 'Interpretation — propositions made by Rushi',
};

// How a word crossed a language border (Translation and Analogy edges).
export const MECHANISMS = {
  calque: 'Calque — copied part for part (不二 ← a-dvaya)',
  phonetic_loan: 'Sound loan — borrowed for its sound (陀羅尼 ← dhāraṇī)',
  semantic_extension: 'Semantic extension — an existing word took on a new sense',
  independent_parallel: 'Independent parallel — no contact; a resemblance',
};

// When a sense or usage held (Sense, Etymology, Usage edges).
export const PERIODS = {
  shang_zhou: 'Shang–Western Zhou (oracle bones, bronzes)',
  pre_qin: 'Pre-Qin (Warring States texts)',
  han: 'Han',
  six_dynasties_tang: 'Six Dynasties–Tang (early Buddhist translation)',
  song_yuan: 'Song–Yuan',
  modern: 'Modern',
};

export const STATUSES = {
  CANON: 'Accepted into Rushi by its author.',
  WORKING: 'Drafted; not yet accepted.',
  OPEN_QUESTION: 'Contested, or awaiting the author’s decision.',
};

// What a claim's citations have actually been checked against. Kept apart
// from status on purpose: being accepted and being verified are different facts.
export const VERIFICATION = {
  source: 'Checked against the cited source itself.',
  partial: 'Some citations checked against their sources; others not yet.',
  reference: 'Checked against other reference works, not yet the cited source.',
  unchecked: 'Citation assigned, not yet opened.',
};

// Claim types are kinds, not points on one scale. The weakest-link rule needs
// an explicit order, written down before any code relies on it.
export const CLAIM_TIERS = {
  documented: { rank: 3, label: 'Documented' },
  comparative: { rank: 2, label: 'Comparative' },
  proposed: { rank: 1, label: 'Proposed' },
};

export const TYPE_TIER = {
  CANONICAL_TRANSLATION: 'documented',
  ETYMOLOGICAL_SINITIC: 'documented',
  GRAPHIC_STRUCTURE: 'documented',
  TEXTUAL_CONNECTION: 'documented',
  SEMANTIC_CONTRAST: 'comparative',
  TRADITIONAL_CORRESPONDENCE: 'documented',
  CROSS_LINGUISTIC_LEXICAL: 'comparative',
  INTERPRETIVE_SYNTHESIS: 'proposed',
};

// The attractors a realm may be drawn from (src/scene/attractors.js holds the
// equations). Kept here so `npm run check` needs no scene code.
export const ATTRACTOR_IDS = ['lorenz', 'aizawa', 'thomas', 'halvorsen', 'rossler', 'chen', 'dadras', 'sprott', 'arneodo', 'rabinovich'];
