# 如實 Rushi

**Chinese characters mapped as a navigable cosmos of solar systems: the Pillars (道 無 為 愛 不 二 量 司), the Ground (有 空 心 法 一 慈 悲 名) Words of Power (如 實 真 言 咒 聲 符 印), Heaven and Change (天 地 人 陰 陽 氣 易 時) and the Constant Virtues (德 仁 義 禮 智 信 孝 忠).**

Rushi (如實, rúshí, "as it really is", the Chinese rendering of Sanskrit *yathābhūta*) sets characters as stars along numerically integrated strange attractors, one attractor per system: Lorenz for the Pillars, Aizawa for the Ground, Thomas for Words of Power, Halvorsen for Heaven and Change, Rössler for the Constant Virtues. It is seen at four levels, Cosmos → System → Star → Connection. Each star carries a constellation of relationships: script history, Buddhist translation, classical usage, and analogies in Malay, Greek and French. Every line declares what kind of claim it is.

Live: <https://ravenseldon.github.io/Rushi/>

## The epistemic contract

The project's one non-negotiable rule: **a beautiful line is not evidence.** Every relationship has a type, and the type is visible three ways (colour, line pattern, text label):

| Type | Pattern | Meaning |
|---|---|---|
| Attested Translation | solid gold | A documented rendering in translated texts; checkable against the canon |
| Sinitic Etymology & Usage | solid blue | Evidence internal to Chinese: script forms, Old Chinese sound, tone derivation, classical texts |
| Analogy Across Languages | dashed silver | A parallel in another language. Not a translation, not a cognate |
| Original Interpretation | dotted crimson | A proposition made by Rushi itself, never presented as historical fact |

Crimson is reserved for interpretation. It is never used as decoration. Uncertainty lives in each card's `caveat` field and should never be deleted to make a card read more confidently. Each claim also carries a `status` (CANON, WORKING or OPEN QUESTION; unsettled claims draw fainter and carry a "?") and a `verification` ledger saying what its citations have actually been checked against. Scholarly corrections and their reasons are logged in [`docs/CORRECTIONS.md`](docs/CORRECTIONS.md).

## Running it

```bash
npm install
npm run dev              # local development
npm run check            # the data contract + verification ledger (add -- --verbose for every gap)
npm run fetch-raw        # once: pinned reference data (Unihan, IDS) into data-raw/
npm run ingest -- readings   # refresh readings + components from that data
npm test                 # weakest-link rule, pathfinding, routes, the Pillars' v1.0 layout
npm run lint
npm run build            # production build into dist/
npm run deploy           # check + build + publish dist/ to gh-pages (you run this, deliberately)
```

## Structure

```
src/
  data/            ← the knowledge, as JSON (schema: docs/SCHEMA.md)
    realms.json · anchors/*.json · bridges.json · sources.json
    edgeTypes.js · vocab.js · index.js (lookups + validateData)
  scene/           ← the pixels. Imperative three.js, created once.
    attractors.js · layout.js · Galaxy.js · lorenz.js · shaders.js
  components/      ← the interface. React.
  lib/             routing, guarded storage, claims.js (weakest-link rule)
scripts/check-data.js   tests/   docs/
```

## Adding to the cosmos

See [`docs/SCHEMA.md`](docs/SCHEMA.md) for every field. In short:

- **A relationship:** add a claim to an anchor's `satellites` in `src/data/anchors/<id>.json`. Give it a `type`, a `dimension`, at least one `cites` entry pointing into `sources.json`, a `status` (new claims start `WORKING`), and an honest `verification`.
- **A new source:** add one entry to `sources.json`. A dataset must carry a `license`.
- **A bridge:** add it to `bridges.json`.
- **A new character:** `npm run ingest -- add 空 kong <realm>` scaffolds the file and lists it in the realm; import it in `src/data/index.js`, then give it a `key`, its `coords` in that realm's attractor space and the reason in `placement`. (Pillars: Lorenz, x, y ∈ [−20, 20], z ∈ [0, 50], "eyes" at (±8.49, ±8.49, 27). Ground: Aizawa, x, y ∈ [−1.5, 1.5], z ∈ [−0.4, 1.9].)
- **A new solar system:** add a realm to `realms.json` with an attractor from `src/scene/attractors.js`, a `position` in the cosmos and its anchors. The engine needs no other change.

Run `npm run check` after any change. It fails on contract errors and reports the verification ledger.

Deep links follow the data: `#/cosmos`, `#/ground`, `#/pillars/dao`, `#/pillars/dao/dao-marga`, `#/ground/yi/bridge-dao-yi`. Every v1.0 link (`#/dao`, `#/dao/dao-marga`, `#/bu/bridge-bu-er`) still works.

## Performance design

The frame-rate goal is a measured target, not a promise. The live frame time appears under **Lines → Quality**.

- One draw call for ~30k particles. All motion runs in the vertex shader, and the CPU never rewrites positions.
- Level of detail by draw range, never by rebuilding: the visited system draws all its particles; others draw only their first 1,500 (a fair random sample). At the System level and below, other systems are not drawn at all, so a system costs what it would alone. The deep field of distant stars is its own object, centred on the visited system.
- The scene is built once. Selection, filters, motion and quality are cheap state changes, never rebuilds.
- Labels are real `<button>`s. Their positions are written straight to the DOM each frame, with no React re-render per frame.
- The nebula is rendered once into a texture at startup (a GPU bake), not shaded every frame.
- Three tiers (High / Balanced / Eco) cap pixel ratio, particle count and frame rate. **Auto** steps down after two consecutive one-second windows averaging over 24 ms per frame. Phones and very high-DPR screens start on Balanced.
- **Still** mode (and `prefers-reduced-motion`) draws a frame only when something changes, so it does zero GPU work at rest.
- three.js ships in its own chunk, so data and interface updates don't invalidate it for returning visitors.

Measured in headless Chromium with software rendering, the main thread spent about 7 ms per second on script in Drift mode, and 0 draw calls at rest in Still mode. With two systems (2026-11-04, same machine, 40 synchronous renders per view), the Pillars at System and Star level draw the same 30,000 points and the same lines as v1.0, with one extra draw call (the deep field split out), and render within ±4% of v1.0 at 390 px and 1440 px; per-frame CPU updates stay under 0.1 ms. Real-GPU frame times still need checking on a representative laptop and phone.

## Accessibility

Keyboard: `1`–`8` jump to stars in the current system, `←` `→` previous/next star, `[` `]` previous/next system, `Esc` steps back (Connection → Star → System → Cosmos), `?` opens About. Tab is never overridden. Every label is a named button. Line types are distinguishable without colour. `prefers-reduced-motion` is respected, with an in-app override. The page includes a skip link and visible focus rings.

---

A project by [Ben Amuwo](https://benamuwo.com), built with Baracus — Ben's name for Claude, the AI collaborator. Entries Baracus drafted from general knowledge are marked † and stay unverified until checked against a source. 如實 · 道 · 愛 · 不二
