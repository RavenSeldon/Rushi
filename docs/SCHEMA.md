# Rushi Data Schema (v2.1: solar systems)

Everything Rushi knows lives in `src/data/` as plain JSON, readable without the app. `npm run check` enforces this contract, and `npm test` enforces the weakest-link rule.

```
src/data/
  realms.json        solar systems (realms): name, attractor, place in the cosmos, anchors
  anchors/<id>.json  one file per anchor, including its satellites
  bridges.json       relationships between anchors
  sources.json       the bibliography registry; claims cite it by key
  edgeTypes.js       claim types (how we know) + palette
  vocab.js           dimensions, mechanisms, periods, statuses, verification, tiers
```

## The Three Axes of a Claim

Every satellite and bridge is a **claim**. Each claim sits on three independent axes, plus a ledger:

| Field | Values | Answers |
|---|---|---|
| `dimension` | form · sound · sense · translation · sinosphere · cosmos · symbol · practice · interpretation | What is the connection about? |
| `type` | see `edgeTypes.js` | How do we know it? |
| `status` | `CANON` · `WORKING` · `OPEN_QUESTION` | What is its editorial standing in Rushi? |
| `verification` | `source` · `partial` · `reference` · `unchecked` | How far have its citations actually been checked? |

`status` and `verification` are deliberately separate. *Accepted* and *verified* are different facts, and a project about seeing things as they are should not merge them. In v1.0 the author accepted every claim, but most citations were assigned in the migration and have not yet been opened. The ledger says so.

## Claim Fields

```jsonc
{
  "id": "er-advaya",                 // unique across the dataset
  "glyph": "अद्वय · Advaya",
  "title": "The Dharma-Gate of Non-Duality",
  "lang": "Sanskrit → Chinese (Mahāyāna)",
  "type": "CANONICAL_TRANSLATION",
  "evidence": "…",                    // 2–3 sentences
  "caveat": "…",                      // optional; required for interpretations
  "dimension": "translation",
  "mechanism": "calque",              // optional: calque | phonetic_loan | semantic_extension | independent_parallel
  "period": "six_dynasties_tang",     // optional: when the sense or usage held
  "cites": [
    { "source": "vimalakirti", "locator": "ch. 9 入不二法門品" },
    // a citation that has been opened records when, where, and what it says:
    { "source": "zhuangzi", "locator": "ch. 2 齊物論, §5",
      "checked": { "on": "2026-11-04", "edition": "https://ctext.org/…", "note": "彼是莫得其偶，謂之道樞" } }
  ],
  "status": "CANON",
  "statusNote": "…",                  // required when OPEN_QUESTION
  "verification": "unchecked",
  "gaps": ["…"],                      // optional: evidence still wanted
  "reviewed": "2026-11-04"
}
```

Bridges add `from`, `to`, `label` (drawn at the midpoint) and `subtitle`. A bridge may join anchors in different realms; it is then drawn as a long, faint arc in the cosmos view, and in full only when it is the claim being read.

`drafted` (optional, e.g. `"Baracus"`) records who drafted a claim from general knowledge. `npm test` requires every claim drafted by Baracus to stay `WORKING` until the author accepts it.

## Realm Fields (`realms.json`)

```jsonc
{
  "id": "ground",            // first segment of the URL: #/ground
  "name": "The Ground",
  "numeral": "II",
  "attractor": "aizawa",     // lorenz · aizawa · thomas · halvorsen · rossler · chen · dadras · sprott
  "position": [150, 22, -70],// where the system sits in the cosmos (world units)
  "anchors": ["you", "kong", "xin", "fa", "yi", "ci", "bei", "ming"]
}
```

- The first realm (the Pillars) sits at the origin, so its sky is exactly v1.0's.
- Every anchor belongs to exactly one realm. Anchor ids are unique across all realms, and no realm id may equal an anchor id or `cosmos`.
- Where a pinyin id would collide with a homophone in a planned system, the id adds a gloss word: `shi-real` (實; 時 and 識 are planned), `sheng-sound` (聲; 生), `yin-seal` (印; 陰), `zhou-spell` (咒; 宙), and in IV–V `ren-person` / `ren-humane`, `yin-shade`, `yi-change`, `yi-right`, `shi-time`, `li-rite`, `zhi-wisdom`, `xin-trust`. Satellite ids take the full anchor id as prefix where a bare pinyin prefix is taken.
- An attractor's `map` may carry a `basis` (right, up, toward the viewer) to view it along a chosen direction: Halvorsen is seen down x = y = z, Rössler is tilted.
- The equations, parameters and screen fit of each attractor live in `src/scene/attractors.js`; `node scripts/fit-attractors.mjs` prints the measured bounding boxes the fit constants came from.

## Anchor Fields

`id`, `key`, `glyph`, `simplified` (only when it differs), `pinyin`, `gloss`, `form`, `formNote`, `summary`, `coords` `[x, y, z]`, `placement`, plus:

- `key`: `"1"`–`"8"`, unique within its realm; the number keys select stars in the system being visited.
- `coords`: the star's position in its realm's attractor space (for Aizawa, x, y ∈ [−1.5, 1.5] and z ∈ [−0.4, 1.9]; its axis equilibria sit at z ≈ 1.943, −0.838, −1.105). The Pillars predate realms and keep the field name `lorenz`.
- `glossUnihan`: Unihan's kDefinition, copied by `ingest add` for reference.
- `oc`: `{ form, source, verification, note? }`, the Old Chinese reconstruction. A `note` says what the form was checked against, or why not. An `unchecked` form is marked † on its card.
- `readings`: `{ source, version, status, verification, cmn, yue, ja, ko, vi, fanqie, extra?, extraNote? }`. These are filled by `npm run ingest -- readings` from Unihan. `extra` holds readings Unihan does not list, which are never presented as verified.
- `structure`: `{ ids, parts, components, source }`, filled from Mojidata IDS. `parts` holds the common components a reader can see (愛 → 爫 冖 心 夊).

## Ingestion

```bash
npm run fetch-raw                 # once: pinned @mandel59/mojidata → data-raw/ (git-ignored; Unihan 18.0.0 + CC0 IDS)
npm run ingest -- readings        # refresh readings + structure for every anchor
npm run ingest -- add 空 kong ground   # scaffold a new anchor in realm "ground" (WORKING, empty satellites)
```

## Rules the Checker Enforces

- A claim's `verification` must agree with its citations. If all of them record a `checked`, it is `source`; if some do, it is `partial`. A checked citation must record its date and edition.

- Every claim cites at least one registered source. Every dataset source carries a licence.
- Every value comes from the controlled vocabulary.
- An Original Interpretation carries a caveat and lives on the `interpretation` dimension. Only interpretations may live there.
- An `OPEN_QUESTION` says what is open.
- An Analogy whose mechanism is not `independent_parallel` is flagged, because it may really be a translation.
- Known `gaps` and unused sources are reported as warnings, so they stay visible.
- Realms name a known attractor and a position; every anchor is in exactly one realm, with a key unique in that realm and coords in that realm's space; ids never collide; every anchor file is imported in `src/data/index.js`.

## Routes

`#/cosmos` · `#/<realm>` · `#/<realm>/<anchor>` · `#/<realm>/<anchor>/<edge>`. Links from v1.0 still resolve: `#/` is the Pillars, `#/dao` and `#/dao/dao-marga` find their realm from the anchor. A realm segment that disagrees with its anchor is corrected, not rejected. `tests/cosmos.test.js` checks every v1.0 link.

## The Weakest-Link Rule (`src/lib/claims.js`)

Claim types are ranked in three tiers: **documented** (Translation, Etymology & Usage, Graphic Structure, Traditional Correspondence) > **comparative** (Analogy) > **proposed** (Interpretation). A chain takes the lowest tier it contains and lists every kind it passed through. `npm test` checks this for every combination of three types.
