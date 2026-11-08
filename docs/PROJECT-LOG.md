# Rushi — Project Log and Handoff

Read this first when resuming work, in a new session or after a break. Last updated 2026-11-08 (integrative bridges).

## Where Things Stand

| Area | State |
|---|---|
| v1.0 sky (the Pillars) | Committed and live. Unchanged at the System level: a test checks every star against its v1.0 position |
| Phase 0 — Foundations | Done: JSON data, sources registry, status, per-citation verification, `npm run check`, `npm test` |
| Phase 1 — Deepen the Eight | Under way: readings and components from Unihan 18.0.0 / Mojidata IDS |
| Solar-systems engine | Built 2026-11-04; committed (`548baba`) and live: four levels, one attractor per system, level of detail, routes, travel, arcs between systems, pathfinder |
| Realm II — The Ground | WORKING: 有 空 心 法 一 慈 悲 名 on Aizawa; 16 satellites, 4 bridges within, 17 to other systems |
| Realm III — Words of Power | WORKING: 如 實 真 言 咒 聲 符 印 on Thomas; 20 satellites, 5 bridges within, 8 to other systems |
| Realm IV — Heaven and Change | WORKING: 天 地 人 陰 陽 氣 易 時 on Halvorsen, seen down its axis; 18 satellites, 4 within, 3 to other systems |
| Realm V — The Constant Virtues | WORKING: 德 仁 義 禮 智 信 孝 忠 on Rössler, tilted; 16 satellites, 4 within, 9 to other systems |
| Semantic review (2026-11-04) | Committed (`53ec649`) and live: six hue families, compound readings 無為 不二 無量 at `#/compounds/<id>`, three Taishō citations checked, accessibility fixes. See `docs/SEMANTIC-REVIEW.md` and `docs/CORRECTIONS.md`. (That document calls its branch uncommitted; it was written before Ben committed it.) |
| **2026-11-05 pass** | **Working tree, uncommitted:** ten language connections, MMK 24.18 and five other passages checked, every OPEN QUESTION closed (below) |
| Realms VI–X | WORKING: Knowing (Sprott), Five Phases (Dadras), Light (Chen), Seeking (Arneodo), Becoming (Rabinovich–Fabrikant). Deepened 2026-11-05 evening; see that section |
| Realms XI–XIII | WORKING: Hungry Ghosts (Newton–Leipnik), Future (Lorenz-84), The Fermi Paradox (Burke–Shaw), as the Atlas planned. Built 2026-11-05 night; see that section |
| Soundtrack | **Working tree, uncommitted:** the Tale’s music player, ported. Drop tracks into `src/assets/audio/`; no tracks, no star. See “The Soundtrack” below |
| Ledger | 13 systems · 104 anchors · 359 claims (40 canon, 319 working, 0 open) · 141 of 486 citations checked · 60 known gaps |
| Icons | Maitrism Cosmogram, cropped to its ring, as transparent PNGs (32/48/192/512) plus a 180 px touch icon on the void colour |

### Branches

`main` is the one canonical tree: the old branches, each checked to have no commit outside `main`, were removed on 2026-11-05. The soundtrack is uncommitted on `main`; XI–XIII is `a38012d`, VI–X `0f6abed`. To publish it (Ben runs this):

```bash
cd ~/Root/rushi
git status                                  # src/, scripts/archive/ and docs/ only
git add src scripts docs
git commit -m "Soundtrack: the Tale’s music star, plug-and-play from src/assets/audio"
git push origin main
npm run deploy                              # check + build, then publish
```

### Commands

```bash
npm run dev | build | lint
npm run check -- --verbose          # contract + verification ledger + known gaps
npm test                            # weakest-link rule, pathfinding, routes, Pillars' v1.0 layout
npm run fetch-raw                   # once per machine: pinned reference data → data-raw/
npm run ingest -- readings          # refresh readings/components for all anchors
npm run ingest -- add 空 kong ground # scaffold an anchor into a realm (WORKING); then import it in src/data/index.js
node scripts/fit-attractors.mjs     # measured bounding box of every attractor
```

In development builds, `window.__rushi` is the live scene (read-only use: tests, the console). It is compiled out of production builds.

### Decisions

**Closed 2026-11-05**, on Ben's instruction to close open questions with facts, logic and reason:

1. **Maitrādvaita** (`bridge-ai-er`, 愛 → 不二): CANON, as Ben's own Original Interpretation in the wording narrowed on 2026-11-04. An interpretation asserts no historical fact, so nothing remains to verify; its caveat stays. The test that pinned it as OPEN QUESTION now checks that it stays a declared interpretation with its caveat.
2. **量 ↔ 司**: CANON, as Ben's proposition. No classical compound is claimed.
5. *(in part)* **MMK 24.18**: answered from the source (T1564, CBETA XML). The verse reads 我說即是無 (p. 33b11); Piṅgala's commentary restates it as 我說即是空 (p. 33b15); the Taishō note glosses 無＝空 (śūnyatā) and 中道 = madhyamā-pratipad, and labels the verse 第十四偈. `bridge-kong-dao` and `bridge-kong-ming` now record the check (verification: source).
6. Duplicates: folded (2026-11-04).
7. **心's Old Chinese**: *səm. Two reference works agree (Dong Chinese; Wiktionary's B–S basic-vocabulary list); the recalled *s.[r]əm had no support and is withdrawn. Verification: reference, since the B–S 2014 list itself could not be opened.
8. **About page text**: live; Ben's to revise whenever.
9. Systems: all 13 (decided 2026-11-04).
10. **Ids**: pinyin plus a gloss word where homophones collide. Already the convention in `docs/SCHEMA.md`.

**Still Ben's alone.** The project's own rule is that Baracus does not accept Baracus's drafts, and `npm test` enforces it:

3. 愛 → 爱, "Love Without a Heart" (WORKING).
4. The Unihan-sourced readings (WORKING, verified against the database).
5. The WORKING claims of Realms II–V and the ten new language connections. Daodejing ch. 42 (`bridge-dao-yi`, `bridge-yi-er`, `bridge-yin-yang`) is still unopened.
11. Membership of the five new themes, IX–XIII: built as the Atlas drafted them (2026-11-05); changing any member is still Ben’s call.

### Conventions

- **Credit goes to Baracus or Ben M. only, never "Claude".** No attribution lines go into commits unless Baracus asks first and Ben agrees. Ben's work is Ben's intellectual property.
- Baracus is Ben's name for Claude. Entries Baracus drafts from general knowledge are marked † / WORKING / `unchecked`, and claims carry `"drafted": "Baracus"`.
- Claims drafted in the semantic review carry no `drafted` field and stay anonymous, by Ben's decision (2026-11-05).
- Never commit, push or deploy; prepare changes in the working tree.
- Expand without disturbing what came before: new claims, never rewrites of the art (scene, shaders, layout) or the science (attractors).
- A beautiful link is not evidence. New links are welcome when reason can justify them: semantic, symbolic, historically informed, or a documented joke. Each declares its kind.
- Placement of a star on an attractor is a design choice, and its `placement` text says so.

## 2026-11-08 — Integrative Bridges: 76 of 78 Pairs Joined

Of the 78 pairs of systems, 28 had no line between them. 26 bridges now join one pair each, all WORKING, drafted by Baracus (`scripts/archive/2026-11-08-integrative-bridges.mjs`, idempotent). 17 rest on passages checked against an edition: Analects 1.1, 1.14, 5.10, 9.19, 11.12; Mencius 7A3, 7A24; Daxue 在明明德 and 知止而後有定; Ullambana 修孝順者; the Flaming Mouth sutra’s title; the Kośa’s fire calamity and twelve links; the Heart Sutra’s 照見; the Tianwen; the Nirvana Sutra’s 生滅滅已; and the Unihan readings that make 聲 and 生 homophones. The rest (Daodejing 8, Zhuangzi 2 and 6, Xici, Shuogua, Shuowen 灋, 慈氏 as the Buddha to come) are unchecked and say so. One, 艮 · 止 · 定, is a chain through two texts and its caveat says Rushi joined them. **VI–XIII and VII–XIII stay open on purpose:** no passage earns those lines yet. Ledger: 385 claims (40 canon, 345 working), 167 bridges (116 between systems), 158 of 513 citations checked.

## 2026-11-06 (afternoon) — Either Address, One Switch

Back on `https://ravenseldon.github.io/Rushi/`, with maitrism.com one command away. `RUSHI_SITE` in `vite.config.js` (`github`, the default, or `domain`) sets the base path, the absolute links in `index.html` (written as `__RUSHI_URL__`), and the generated `sitemap.xml`, `robots.txt` (domain only, since robots files count only at a host root) and `CNAME` (domain only). `public/CNAME`, `public/sitemap.xml` and `public/robots.txt` are gone; the build writes them. `npm run deploy` publishes to github.io; `npm run deploy:domain` publishes to maitrism.com. The domain build is byte-identical to the one live there before. An unknown `RUSHI_SITE` stops the build.

## 2026-11-06 — Search: Maitrism and Maitreya

maitrism.com went live after a slow GitHub Pages queue (the domain commit `d35ff6f` stands). For search: `public/sitemap.xml` (one URL, because `#/` routes are one page to search engines), `public/robots.txt`, a canonical link, `og:site_name` and WebSite JSON-LD naming the site Maitrism (alternate names Rushi, 如實 Rushi). The page title (in `index.html` and the home view’s title in `App.jsx`) and the description now say Maitrism; the About panel names all thirteen systems and adds one paragraph in Ben’s settled formulation, “Maitrism is the practice of Maitrādvaita”, consistent with the CANON relation 愛 ↔ 不二, and notes that Maitreya takes his name from maitrī (慈, 慈氏), as the 慈 card already documents. Next lever, after the hackathon: a real URL per star so each can be indexed.

## 2026-11-06 — maitrism.com (prepared, not deployed)

Rushi moves from `https://ravenseldon.github.io/Rushi/` to `https://maitrism.com`. In the working tree: `vite.config.js` `base` is now `/` (was `/Rushi/`); `public/CNAME` holds `maitrism.com`, so every `npm run deploy` keeps the domain (the gh-pages branch had no CNAME, so a domain typed into Settings → Pages was wiped by the next deploy); the Open Graph URLs in `index.html` point at maitrism.com. **Deploy only after the DNS records resolve**: with `base: '/'`, the old github.io/Rushi address cannot load the assets until GitHub redirects it to the working domain. DNS (Porkbun): delete the `pixie.porkbun.com` parking records; four A records 185.199.108–111.153; four AAAA 2606:50c0:8000–8003::153; `www` CNAME `RavenSeldon.github.io`; the `_github-pages-challenge-RavenSeldon` TXT record from GitHub’s domain verification. Undo: revert the domain commit, redeploy, clear Settings → Pages → Custom domain.

## 2026-11-05 (late) — The Soundtrack

The Tale’s music player (SchroCivWeb `src/app.js` and `scripts/build.mjs`, read, not changed), ported to Rushi:

- **Plug and play:** drop `.mp3`, `.m4a`, `.aac` or `.ogg` files into `src/assets/audio/`; Vite’s `import.meta.glob` finds them at build time. Filename order, the Tale’s naming rule and sort (`04a_` after `04_`). No tracks, no star. `src/assets/audio/README.md` has the Tale’s ffmpeg conversion, pointed at Rushi.
- **Behaviour, as the Tale’s:** one `<audio>` element outside React, so the music runs unbroken across every route; it plays on behind other tabs; looping playlist with a 3 s rest after the last track; volume 40%; position held per tab and for ten minutes across tabs, never autoplaying.
- **Placement:** the Tale’s star, in the header beside Paths, because Rushi’s dock and card panel occupy the bottom and right edges. It turns slowly while playing, and stops turning in Still mode or under reduced motion.
- **Files:** `src/lib/tracks.js` (ordering, tested), `src/lib/soundtrack.js` (player), `src/components/MusicToggle.jsx`, two lines in `App.jsx`, four in `index.css`, `tests/soundtrack.test.js`.
- **Measured:** `npm test` 22 / 22, lint 0 / 0, build passes. In headless Chromium with two 2 s test tones, all of the following passed: no star with an empty folder; one star, not autoplaying; plays on press; one element survives travel between systems; keeps playing behind another tab; advances; rests, then loops; pauses; reload holds the place without autoplay. The test tones were never put in Ben’s folder.
- **Differs from the Tale’s README, as the Tale’s code does:** the README says one file “loops gaplessly”, but its code rests 3 s after every wrap, one file included. Rushi follows the code; set `REST` to `0` in `src/lib/soundtrack.js` for no pause.

## 2026-11-05 (night) — Realms XI–XIII: Thirteen Systems, as the Atlas Planned

All WORKING, drafted by Baracus. The script is `scripts/archive/2026-11-05-xi-xiii.mjs`; it is idempotent, so a re-run changes nothing.

### What Was Built

The members, attractors and sixteen planned bridges follow `docs/cosmos-atlas.html` exactly. The equations use the parameters in common use; the citations are Baracus's, from general knowledge.

| # | System | Attractor | Stars | Satellites | Within | To other systems |
|---|---|---|---|---|---|---|
| XI | Hungry Ghosts | Newton–Leipnik (a = 0.4, b = 0.175; one of its two coexisting attractors) | 餓 鬼 魂 魄 貪 渴 施 食 | 11 | 4 | 13 |
| XII | Future | Lorenz-84 (a = 0.25, b = 4, F = 8, G = 1; seen along x) | 未 來 將 後 望 夢 命 劫 | 11 | 4 | 14 |
| XIII | The Fermi Paradox | Burke–Shaw (s = 10, v = 4.272) | 宇 宙 寂 孤 遠 他 誰 聽 | 13 | 3 | 13 |

Counts to other systems include the bridges among XI, XII and XIII themselves. In all: 24 anchors, 35 satellites, 45 bridges, 8 new sources (`ullambana` T685, `yankou` T1313, `nirvana` T374, `zuozhuan`, `huainanzi`, `shizi`, `shishuo`, `jones-1985`).

- **Readings and structure** for the 24 anchors from `npm run ingest -- readings`; every I–X file was byte-identical afterwards. Old Chinese is left as "not yet researched".
- **Placement:** farthest-point sampling on each integrated trajectory, with a few stars placed for meaning, each placement text saying so. 魂 sits highest and 魄 lowest (Liji: 魂氣歸于天，形魄歸于地). 寂 sits at the centre of the Burke–Shaw crossing, 遠 farthest out and 孤 most isolated.
- **Positions in the cosmos** came from a search that replicates the camera's own framing rule (`_cosmosDir`). At 390 px and 1440 px the cosmos keeps its straight-on bearing, and no new system's name overlaps another's. XII sits highest, XI low, and XIII farthest away, about 700 units out. The first placement, before the search, had laid XIII's name over IV's and XI's over VI's.
- **The Atlas's four "Rushi" bridges** (聽 · 聲, 遠 · 光, 孤 · 一, 他 · 二) and the Fermi satellite (`shei-fermi`) are Original Interpretations. They are dotted crimson, carry a caveat and cite `rushi`.
- **施 · 悲:** the Atlas reads feeding the hungry ghosts as compassion. The opened source, the Ullambana Sutra p. 779b02, has 目連悲哀, which is grief, not karuṇā. The bridge says so and names the gap.

### Citations Opened (2026-11-05, night)

55 more checked (86 → 141 of 486). CBETA XML: T685 (Ullambana), T1313 (Flaming Mouth), T374 (寂滅為樂, 渴愛之病), T475 (渴愛, 空寂), T262 (貪愛, 無量劫, 無生法忍), T235 (如來, 布施, 如夢幻泡影), T1558 (五趣, 三不善根, 四食, 三世實有, 成劫). The chinese-poetry transcriptions, which are not critical editions and are simplified in the Analects, Chuci and Shijing: the Analects, Mencius, Zhongyong, Chuci (招魂, 天問, 遠遊, 大司命, 山鬼) and Shijing (河廣, 鶴鳴, 斯干). The Daodejing, Zhuangzi, Zuozhuan, Huainanzi, Shuowen and Liji passages remain unchecked; ctext is unreachable from this workspace.

### Also Done

- **Form lines made readable.** The 40 VI–X anchors that showed raw IDS (`IDS ⿰…`) now read like the canon ("戊 + 𠃌 (visible components)"), with the full IDS kept in the note. Hand-written forms from the earlier pass were kept, except three placeholders the IDS now settles (變, 風, 學).
- Rare components (𢛳, 𠆢, 𡈼 …) box in headless Chromium's fonts, as the canon's 德 and 愛 do; check them on a real device.

### Acceptance, as Measured

- `npm run check` passes: 13 systems, 104 anchors, 359 claims (40 canon, 319 working), 141 bridges (90 between systems), 60 named gaps.
- `npm test` 19 / 19; `npm run lint` 0 / 0; `npm run build` passes, in a clean Linux copy. The CSS, vendor and three.js chunks are byte-identical to before.
- Viewed in headless Chromium: the cosmos at 390 and 1440 px, all three systems, a star card and a bridge card, with no page errors. Not yet seen on a real GPU or phone.
- Backup of the state before this pass: `.rushi-pre-xi-xiii-backup.tgz` (git-ignored).

### Still Ben's Alone

Acceptance of every WORKING claim in XI–XIII, above all the five Original Interpretations; Old Chinese forms; and whether to promote the Atlas's XI–XIII from "draft" to "built" in `docs/cosmos-atlas.html`.

## 2026-11-05 (evening) — Realms VI–X Deepened

### What Was Already There

An earlier pass, not recorded in this log, had already built Realms VI–X in the working tree. It added five systems, two new attractors (Arneodo for IX, Rabinovich–Fabrikant for X), 40 anchors with one or two satellites each, and 20 bridges. Its claims carry no `drafted` field. This pass keeps all of that work, except the four placeholder cards listed in `docs/CORRECTIONS.md`.

### What This Pass Added (all WORKING, drafted by Baracus)

- **Readings and structure** for all 40 new anchors from `npm run ingest -- readings` (Unihan 18.0.0 / Mojidata IDS). Every file in I–V is byte-identical to before. Form boxes that said "pending IDS verification" now show the IDS from the database.
- **29 satellites** (4 of them replacing placeholders) and **25 bridges**, 10 within systems and 15 between them.
- **35 more citations checked against an edition** (51 → 86 of 390 overall), from CBETA XML and, for the Analects and Mencius, the chinese-poetry digital transcription. That transcription is not a critical edition, and its Analects copy is in simplified characters. Each check records what it says.
- **New sources:** `chengweishi` (T1585), `platform-sutra` (T2008), `shurangama` (T945), `fanyi-mingyi` (T2131), `diamond` (T235), `chunqiu-fanlu`, `liezi`, `shiniu-tu`.

| # | System | Satellites | Within | To other systems | Highlights |
|---|---|---|---|---|---|
| VI | Knowing | 19 | 4 | 6 | 定慧一體，不是二 (Platform Sutra, checked); 五種不翻 links 慧 (般若) to 咒 (陀羅尼); 思 and 念 in the Kośa's ten universal factors; 阿賴耶識 |
| VII | Five Phases | 16 | 6 | 3 | 知者樂水，仁者樂山 → 智 and 仁; 震 · 艮 move and stop; 金剛 vajra, thunder and diamond; 水 and 火 as Kośa great elements |
| VIII | Light | 12 | 1 | 9 | 日，實也 → 實 (Rushi's own name); 無明 → 無 (calque of avidyā); 指月 → 法; 有為法如夢幻泡影 → 為; 北辰 → 德 |
| IX | Seeking | 15 | 2 | 7 | 學問之道…求其放心 → 心; 義，人路也 → 義; 三學 → 定; 尋牛; 多歧亡羊 |
| X | Becoming | 14 | 4 | 5 | 成住壞空 → 空; 無生 → 無; 慎終追遠 → 德; 窮則變 |

The content script is archived as `scripts/archive/2026-11-05-deepen-vi-x.mjs`; it is idempotent, so a re-run changes nothing.

### Acceptance, as Measured

- `npm run check` passes: 10 systems, 80 anchors, 279 claims (40 canon, 239 working), 96 bridges (56 between systems), 45 named gaps.
- `npm test` 19 / 19; `npm run lint` 0 warnings, 0 errors; `npm run build` passes. All four ran in a clean Linux copy with a fresh `npm ci`.
- The CSS, vendor and three.js chunks are byte-identical to the previous build; only the app's data chunk changed.
- Viewed in headless Chromium at 390 px (VIII 光, VI 定) and 1440 px (the 定慧一體 bridge, Realm X), with no page errors. Not yet seen on a real GPU or phone.
- The state before this pass is backed up in `.rushi-pre-vi-x-backup.tgz` (git-ignored).

### Housekeeping for Ben

- `data-raw/` holds `moji.db` and `package/` (licenses and `download.txt`), both needed by `npm run ingest`. Only the downloaded `.tgz` is a leftover; see CORRECTIONS for the night `package/` was wrongly removed and restored.
- Still Ben's alone: acceptance of every WORKING claim in VI–X, and the Old Chinese forms for these 40 anchors (left as "not yet researched"; Baracus did not guess them).

### Next

- Realm VIII has one bridge within the system; it earns its place through links outward. A documented within-system link (for example 日 · 月 · 明 and the Shuowen's 朙, from 囧 and 月) needs a palaeographic source first.
- Open Daodejing chs. 1, 4, 8, 56, 59 and Zhuangzi chs. 2, 6, 32 in an edition (ctext was unreachable again from this workspace), and the Monier-Williams entries the new claims name.
- XI–XIII (Hungry Ghosts, Future, Fermi Paradox) still need membership decisions and three more attractors.

## 2026-11-05 — Languages, Closed Questions, One Branch

### Ten Language Connections (all WORKING, drafted by Baracus)

Satellites only: no star, attractor or renderer changed, and none touches the Pillars.

| Star | Id | Languages | Kind | Connection |
|---|---|---|---|---|
| 仁 | `ren-humane-manusia` | Malay · Latin | Analogy | perikemanusiaan ← manusia, humanitas ← homo: humaneness named after the human, as 仁 contains 人 (Mencius 7B16) |
| 人 | `ren-person-manusya` | Sanskrit → Chinese · Malay | Translation | 人 renders manuṣya, fourth of the five destinies; Malay manusia is a loan from the same word |
| 天 | `tian-deva` | Sanskrit → Chinese | Translation | 天 renders deva, the gods within saṃsāra, not the Heaven of 天命 |
| 一 | `yi-ekayana` | Sanskrit → Chinese | Translation | 一乘, the One Vehicle: 唯有一乘法，無二亦無三; that 無二 is not advaya |
| 地 | `di-prthivi` | Sanskrit → Chinese | Translation | 地 as pṛthivī, first of the four great elements 地水火風; not the five phases' 土 |
| 時 | `shi-time-kairos` | Greek | Analogy | καιρός vs χρόνος: Confucius, 聖之時者, is timely, not merely timed |
| 智 | `zhi-wisdom-jnana` | Sanskrit → Chinese | Translation | 智 renders jñāna (Kośa ch. 7 分別智品); prajñā is usually 慧 or 般若 |
| 信 | `xin-trust-sraddha` | Sanskrit → Chinese | Translation | 信 renders śraddhā, first of the five faculties; the second, 勤, is vīrya |
| 孝 | `xiao-pietas` | Latin · English | Analogy | "filial piety" borrows pietas: care for those who came before as a virtue |
| 空 | `kong-zero` | Sanskrit · Arabic · French | Analogy | śūnya also named zero; Arabic ṣifr rendered it, giving zéro and chiffre |

New sources: `lewis-short` (A Latin Dictionary, 1879) and `lotus` (妙法蓮華經, T262).

### Passages Opened (CBETA XML, 2026-11-05)

| Claim | Locator | What it says |
|---|---|---|
| `bridge-kong-dao`, `bridge-kong-ming` | T1564, p. 33b11–15 | Verse 我說即是無; commentary 我說即是空 |
| `xin-citta` | T1558 ch. 2, p. 21c18; T251 title | 心意識體一; 般若波羅蜜多心經 |
| `bei-karuna` | T1558 ch. 7, p. 140a29 and 141a11–14 | 大悲 among the eighteen unique qualities; great compassion vs compassion |
| `ren-person-manusya`, `tian-deva` | T1558 ch. 3, p. 42a18–19 | 地獄、傍生、鬼及人、天是名五趣 |
| `yi-ekayana` | T262 ch. 2, p. 8a17–18 | 唯有一乘法，無二亦無三 |
| `di-prthivi` | T1558 ch. 1, p. 3a28–29 | 大種謂四界，即地水火風 |
| `zhi-wisdom-jnana` | T1558 ch. 7 (title) | 分別智品 |
| `xin-trust-sraddha` | T1558 ch. 2, p. 13a22–23 | 信根、勤根、念根、定根、慧根 |

Each check covers the Chinese only; the Sanskrit correspondences stay open as named gaps.

### Acceptance, as Measured (2026-11-05)

- `npm run check` passes; `npm test` 19 / 19; `npm run lint` 0 warnings, 0 errors; `npm run build` passes. All four ran in a clean copy with a fresh `npm ci`.
- The CSS, vendor and three.js chunks are byte-identical to the live build (same hashes); only the app's data chunk changed.
- A backup of the working tree before this pass is in `.rushi-pre-languages-backup.tgz` (git-ignored).
- The new satellites have not yet been viewed in a browser.

## The Solar Systems (built 2026-11-04)

### The Scale Model: Four Zoom Levels

| Level | You see | Labels shown | Route |
|---|---|---|---|
| **Cosmos** | Every system as its own small galaxy, each a different real attractor, with faint threads for bridges between systems | One name per system | `#/cosmos` |
| **System** | One attractor and its ~8 stars | The 8 anchors + bridge labels within the system | `#/<realm>` |
| **Star** | One constellation | Its satellites | `#/<realm>/<anchor>` |
| **Connection** | One claim and its evidence | — | `#/<realm>/<anchor>/<edge>` |

Old links still resolve: `#/` → the Pillars, `#/dao`, `#/dao/dao-marga`. Compound readings: `#/compounds/<id>`.

### How It Was Built

1. **Realms and attractors.** `realms.json` gives each system an `attractor`, a `position`, a `name` and a `numeral`. `src/scene/attractors.js` holds eight attractors (Lorenz, Aizawa, Thomas, Halvorsen, Rössler, Chen, Dadras, Sprott) with the parameters in common use. Their citations are Baracus's, from general knowledge, and unchecked. The fit to screen was measured, not guessed.
2. **Level of detail.** The visited system draws all 25,200 of its particles; others draw a 1,500-particle prefix (random order, so a fair sample). Below the Cosmos level, other systems are not drawn at all, unless they hold the far end of the bridge being read.
3. **Travel.** The dock has ◎ (Cosmos) and ‹ › (`[` `]`); flights between systems rise through a view of both and descend, handing full density to the destination at the top of the arc (3 s; instant in Still mode). Esc steps out: Connection → Star → System → Cosmos.
4. **Bridges between systems** are long faint arcs in the cosmos; they are drawn in full only when they are the claim being read.
5. **Pathfinder** ("Paths" in the header): the shortest chain between any two stars in any systems, with its strength by the weakest-link rule and every kind of claim it passes through.

### Acceptance, as Measured (2026-11-04)

- **Pillars unchanged at the System level:** a test checks every star against its v1.0 position, and still frames show a pixel-identical sky at 390 px and 1440 px. The only differences are HTML label anti-aliasing, the new breadcrumb and the dock.
- **Labels legible at 390 px and 1440 px:** checked by screenshot for the cosmos, both systems, a star, and connections within and between systems.
- **Frame time:** 40 synchronous renders per view, software rendering, same machine. The Pillars draw the same 30,000 points and lines as v1.0 with one extra draw call, within ±4% of v1.0's render time; CPU updates stay under 0.1 ms. Not yet measured on a real GPU.
- **Every old link works:** the test suite resolves every v1.0 anchor, satellite and bridge link.

### Next

- Commit and fast-forward `main` (commands above), then deploy.
- Realm VI, Knowing (Sprott), then VII Five Phases (Dadras) and VIII Light (Chen).
- Open Daodejing chs. 39, 40, 42 in an edition (ctext was unreachable on 2026-11-05), and the Monier-Williams entries the new claims name.
- At 800 px wide, the breadcrumb (`Rushi / II / 空 kōng`) runs into the Paths button in the header.
- Real-GPU frame time on a laptop and a phone, with 3+ systems.
- At 390 px the cosmos view is small when systems spread horizontally; with more systems, consider positions that also spread vertically.

### Content: Candidate Systems

Each anchor belongs to exactly one system. II–V are built; VI–VIII are next.

| # | Working name | Anchors | Why it is earned |
|---|---|---|---|
| II | The Ground ✓ | 有 空 心 法 一 慈 悲 名 | Bridges into the Pillars: 道生一, 一生二, 有無相生, 名可名, 道法自然, 四無量心, 慈 · 愛, 心 · 愛, 中道 |
| III | Words of Power ✓ | 如 實 真 言 咒 聲 符 印 | 如實 is Rushi's own name; 真言 = mantra; 咒 (dhāraṇī and spells, with 陀羅尼 told on its card); 聲 (sound); Daoist 符; 印 (mudrā, seal) |
| IV | Heaven and Change ✓ | 天 地 人 陰 陽 氣 易 時 | The Yijing and correlative cosmology; links to the Book of Changes realm (Phase 4) |
| V | The Constant Virtues ✓ | 德 仁 義 禮 智 信 孝 忠 | 道德經's other half (德); 仁 already appears in 愛's card |
| VI | Knowing | 意 識 念 覺 悟 定 慧 思 | Buddhist epistemology; links to 量 (pramāṇa) |
| VII | The Five Phases and More | 金 木 水 火 土 風 雷 山 | Traditional Correspondence; trigram images |
| VIII | Light | 光 明 日 月 星 夜 影 照 | 無量光; the visual language of Rushi itself |

### Ben's Decision (2026-11-04, evening)

**Include all six candidates, III–VIII, and add five new themes: Seeking, Becoming, Hungry Ghosts, Future, the Fermi Paradox** ("at least 3–5 more sections, or compress into one"). That makes 13 systems and about 104 anchors, beyond this log's original 10 / 80.

The engine needs only small changes for 13. The cosmos view would draw about 25k + 12 × 1.5k ≈ 43k points, still one draw call per system. But each system has its own attractor, so **five more attractors** are needed. Candidates, all three-variable systems with published parameters: Arneodo, Rabinovich–Fabrikant, Newton–Leipnik, Lorenz-84, Burke–Shaw, Four-Wing. Real-GPU frame time with 13 systems must be measured before calling it done.

#### Draft membership for the five new themes (Baracus's proposals, for Ben to choose from)

Every character below appears in no other system. "Kind" says what most of the claims would be. Themes that are modern ideas will lean on Analogy and Interpretation, and their crimson lines must say so.

| # | Theme | Draft anchors | What earns them | Kind |
|---|---|---|---|---|
| IX | Seeking | 求 問 尋 學 探 行 路 門 | 求道 seeking the Way; 學 in Analects 1.1; 行 (practice, and the saṃskāra sense); 門 as dharma-gate (不二法門, 無門關 in the Wumenguan, already a source) | documented |
| X | Becoming | 生 化 成 變 長 始 終 死 | 生 / 死 (jāti, maraṇa in the twelve links); 化 (Zhuangzi's butterfly, 物化); 始 / 終; joins 道生一 (生) and 易 in IV | documented |
| XI | Hungry Ghosts | 餓 鬼 魂 魄 貪 渴 施 食 | 餓鬼 = preta (translation); 盂蘭盆 Ullambana (sound loan) and 目連救母; 魂 / 魄 souls; 貪 (rāga, one of the three poisons); 施 (dāna, 施餓鬼 feeding the ghosts); craving links back to 愛 (tṛṣṇā). The Kośa's five destinies (checked 2026-11-05, now on 人 and 天's cards) already name 鬼 | documented |
| XII | Future | 未 來 將 後 望 夢 命 劫 | 未來 (anāgata) and the 三世 past, present, future; 劫 kalpa (sound loan); 命 fate; 夢 (Zhuangzi); Maitreya the future Buddha (慈氏, in II) | mostly documented |
| XIII | The Fermi Paradox | 宇 宙 寂 孤 遠 他 誰 聽 | 宇宙: 「四方上下曰宇，往古來今曰宙」 (space and time; trace to its source); 寂 silence (寂滅 nirvāṇa); the paradox itself is modern, so its links to these characters are Analogy or Interpretation, declared | mostly proposed |

**Compression option** if 13 feels like too many: merge Becoming into IV (Heaven and Change, already about change) and Future into XI or XII. That gives 11 systems, needing three new attractors, not five.

**Ids:** these sets bring many homophones (意 / 義 / 易 / 一 yì / yī; 明 / 名 míng; 信 / 心 xìn / xīn; 時 / 實 / 識 shí / shì; 思 / 司 / 死 sī / sǐ). Convention: pinyin plus a gloss word for any id that collides (`ming-bright`, `yi-change`, `shi-time`).

### Honest Effort Estimate

- **Engineering (once):** done, in one session (2026-11-04).
- **Content (per system):** `npm run ingest` fills readings and structure in seconds. Drafting about 40 claims with citations takes about a session per one or two systems, entering as WORKING. Ben's acceptance and opening the citations (verification) continue for as long as the project lives. That is by design, not a backlog to be ashamed of.
