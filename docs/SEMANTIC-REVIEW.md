# Semantic review — 2026-11-04

Baseline: `ce2916e6855b6a4e27f52ea4631b5fc4417bbb97`, branch `solar-systems`. The original working tree was clean. Development and testing used an isolated local copy; the reviewed changes are applied to an uncommitted `codex/semantic-review` branch in `~/Root/rushi`. No commit, push or deployment was requested or performed.

## Scope

The earlier review described eight anchors. The current repository already contains five systems, forty anchors, and many of the recommended corrections and links. This pass builds on that work rather than recreating it.

- Six relation hue families: gold translation, blue etymology/structure, violet textual/traditional, coral contrast, silver analogy, crimson original interpretation. Specific structural and correspondence types remain intact and filterable.
- Three first-class compound readings, with semantic graph membership and pathfinding: 無為, 不二, 無量. They reuse existing visual bridges and shared source records; no new celestial anchors, attractors, particles, or persistent labels.
- Correct 愛→不二 Maitrādvaita relation; preserved original editorial status and deep links. No equation of ordinary 二, Buddhist advaya, and Advaita Vedānta.
- Two curated cross-links, two additional compound senses, and upgrades to existing perception/inference and non-duality cards. The duplicated Maitrādvaita and Three Treasures satellites are folded into shared relations.
- Source labels and links corrected; explicit gaps retained. New claims start WORKING. The ledger is deliberately not “all verified”.
- Mobile controls have accessible names; the skip link preserves the current route; native select key handling is respected; the About modal contains keyboard focus; reading changes move focus to the reading region.

## Checks

- Baseline: 13 tests, data contract and lint passed. Build succeeded in the isolated copy after the original folder's write restriction prevented Vite's temporary-file creation.
- Revised: 19 unit/regression tests, data contract, lint and production build. Coverage includes compound route round-trips, malformed route fallback, legacy Maitrādvaita URLs, compound validation, six hues with 4.5:1 text contrast on the base background, safe citation URLs, and evidence-aware chain strength.
- Fresh `npm ci` in a temporary folder and production build succeeded with the unchanged manifest and lockfile. `npm ls --depth=0` found the required React, Three.js, Lucide, Tailwind and Vite packages. `npm audit` reported zero known vulnerabilities on the review date. No runtime or development dependency was added.
- Browser checks use headless Chromium with software WebGL, at 1440×1000 and 390×844. Six compound views were checked with axe-core WCAG 2 A/AA and 2.1 AA rules, excluding the canvas. No violations were reported. Legacy navigation, compound navigation, Escape/back, skip-link behavior, path strength and modal focus cycling were exercised. This is not a claim of comprehensive accessibility certification or real-device performance.

### Performance observations

Frozen production builds, headless Chromium with software WebGL; these timings describe this test environment only.

| View | Baseline median | Revised median |
|---|---:|---:|
| 1440 px, Pillars system | 50.0 ms | 50.0 ms |
| 1440 px, 愛 reading | 50.0 ms | 50.0 ms |
| 390 px, Pillars system | 33.3 ms | 33.3 ms |
| 390 px, 愛 reading | 33.2 ms | 33.3 ms |

Still mode made **zero WebGL draw calls** during each 700 ms idle observation, in both versions. Script time over approximately 1.5-second moving samples was 21–44 ms baseline and 21–38 ms revised. One initial mobile p95 sample rose from 33.4 to 50.0 ms; a targeted follow-up alternated the versions at fixed Balanced quality, three runs each, with 3-second samples. All six measured approximately **16.7 ms median / 33.4 ms p95**. The outlier did not repeat. No general real-device frame-rate promise follows from this small software-rendered sample.

The application JavaScript grew from 253.00 to 263.80 kB (gzip 78.77 to 82.02 kB), reflecting the semantic data and compound interface. The Three.js and vendor chunks are unchanged. Particle generation, attractor equations and the scene renderer are unchanged. All forty anchor positions retain their established architecture and the Pillars layout regression passes.

Final data ledger: 148 claims; 38 CANON, 108 WORKING, 2 OPEN QUESTION. Citation checks: 39 of 227, with 22 explicitly recorded gaps. This pass improves the ledger without treating inherited unverified material as newly verified.

## Deferred recommendations

- No extra North Star: 如 and 實 already have their own system and an existing 如實 bridge. A second meta-node would duplicate them. The proposed ethics/stewardship route remains an original interpretation requiring editorial choice.
- Additional authored discovery itineraries are deferred; the existing shortest-path tool now supports compounds and warns about composition, comparison, interpretation and incomplete verification.
- Catuṣkoṭi, two truths, 勢, extra negators, and expanded cybernetics remain candidates for a separately sourced pass. They need more than decorative nodes or unspecific citations.
- Direct 道–愛, 道–二 and 愛–量 shortcuts are not added: 慈, 一, 陰/陽 and existing 四無量 links preserve the actual intervening concepts more accurately.
- The remaining inherited source gaps, contested palaeography, and specialist advaya/advaita comparison remain open in the ledger. Real laptop/phone GPU measurements, screen-reader listening tests, and a broader multilingual typography audit remain useful follow-ups.
- The static `docs/cosmos-atlas.html` is an existing historical design artifact, not a generated live view of the semantic graph; it is not silently rewritten in this pass.
