# Rushi — Project Log and Handoff

Read this first when resuming work, in a new session or after a break. Last updated 2026-11-04 (evening: solar systems + Realm II).

## Where Things Stand

| Area | State |
|---|---|
| v1.0 sky (the Pillars) | Shipped to the working tree; **not committed or deployed** (Ben does both). Unchanged at the System level (pixel-checked) |
| Phase 0 — Foundations | Done: JSON data, sources registry, status, per-citation verification, `npm run check`, `npm test` |
| Phase 1 — Deepen the Eight | Under way: readings and components from Unihan 18.0.0 / Mojidata IDS |
| **Solar-systems engine** | **Built 2026-11-04** (working tree): four levels, one attractor per system, level of detail, routes, travel, arcs between systems, pathfinder |
| **Realm II — The Ground** | **Drafted 2026-11-04**, all WORKING: 有 空 心 法 一 慈 悲 名 on the Aizawa attractor; 18 satellites, 13 bridges (9 into the Pillars) |
| Ledger | 2 systems · 16 anchors · 72 claims (38 canon, 3 open, 31 working) · 16 of 122 citations opened · 14 known gaps |
| Icons | Maitrism Cosmogram, cropped to its ring, as transparent PNGs (32/48/192/512) plus a 180 px touch icon on the void colour |

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

### Decisions Waiting on Ben

1. The Maitrādvaita wording (bridge and satellite are OPEN QUESTION).
2. Whether 量 ↔ 司 stays as Ben's proposition (OPEN QUESTION).
3. Accept or drop 愛 → 爱, "Love Without a Heart" (WORKING).
4. Accept the Unihan-sourced readings (WORKING, verified against the database).
5. **Accept, revise or drop Realm II's 31 claims** (all WORKING, drafted by Baracus). Open these first: `bridge-dao-yi` and `bridge-yi-er` (ch. 42, still unchecked), `bridge-kong-dao` and `bridge-kong-ming` (MMK 24.18: does the Taishō read 無 or 空?).
6. ~~Duplicates~~ **Decided 2026-11-04: folded.** `wu-you` → `bridge-you-wu` (CANON), `dao-ziran` → `bridge-fa-dao` (WORKING: one added sentence). Old links redirect.
7. 心's Old Chinese: *s.[r]əm (B–S 2014, as recalled) or *səm (B–S v1.1 list)?
8. The About page's new text (opening line, first paragraph, "More than one sky"): it is Baracus's draft for you to make your own.
9. ~~Which systems come next~~ **Decided 2026-11-04:** all of III–VIII, plus five new themes (below). **Ben: keep all 13 systems.** For now, only the Ground is published, for visual testing. Still open: the membership of the five new systems.
10. Future anchor ids: homophones will collide (明 vs 名 míng; 意 / 義 / 易 yì; 信 vs 心 xīn). Proposal: pinyin plus a gloss word, e.g. `ming-bright`, `yi-intent`.

### Conventions

- Baracus is Ben's name for Claude. Entries Baracus drafts from general knowledge are marked † / WORKING / `unchecked`, and claims carry `"drafted": "Baracus"`.
- Never commit, push or deploy; prepare changes in the working tree.
- A beautiful link is not evidence. New links are welcome when reason can justify them: semantic, symbolic, historically informed, or a documented joke. Each declares its kind.
- Placement of a star on an attractor is a design choice, and its `placement` text says so.

## The Solar Systems (built 2026-11-04)

### The Scale Model: Four Zoom Levels

| Level | You see | Labels shown | Route |
|---|---|---|---|
| **Cosmos** | Every system as its own small galaxy, each a different real attractor, with faint threads for bridges between systems | One name per system | `#/cosmos` |
| **System** | One attractor and its ~8 stars | The 8 anchors + bridge labels within the system | `#/<realm>` |
| **Star** | One constellation | Its satellites | `#/<realm>/<anchor>` |
| **Connection** | One claim and its evidence | — | `#/<realm>/<anchor>/<edge>` |

Old links still resolve: `#/` → the Pillars, `#/dao`, `#/dao/dao-marga`.

### How It Was Built

1. **Realms and attractors.** `realms.json` gives each system an `attractor`, a `position`, a `name` and a `numeral`. `src/scene/attractors.js` holds eight attractors (Lorenz, Aizawa, Thomas, Halvorsen, Rössler, Chen, Dadras, Sprott) with the parameters in common use. Their citations are Baracus's, from general knowledge, and unchecked. The fit to screen was measured, not guessed.
2. **Level of detail.** The visited system draws all 25,200 of its particles; others draw a 1,500-particle prefix (random order, so a fair sample). Below the Cosmos level, other systems are not drawn at all, unless they hold the far end of the bridge being read.
3. **Travel.** The dock has ◎ (Cosmos) and ‹ › (`[` `]`); flights between systems rise through a view of both and descend, handing full density to the destination at the top of the arc (3 s; instant in Still mode). Esc steps out: Connection → Star → System → Cosmos.
4. **Bridges between systems** are long faint arcs in the cosmos; they are drawn in full only when they are the claim being read.
5. **Pathfinder** ("Paths" in the header): the shortest chain between any two stars in any systems, with its strength by the weakest-link rule and every kind of claim it passes through.

### Acceptance, as Measured (2026-11-04)

- **Pillars unchanged at the System level:** a test checks every star against its v1.0 position, and still frames show a pixel-identical sky at 390 px and 1440 px. The only differences are HTML label anti-aliasing, the new breadcrumb and the dock.
- **Labels legible at 390 px and 1440 px:** checked by screenshot for the cosmos, both systems, a star, and connections within and between systems. The Ground has 12 labels at the System level; the Pillars keep their 14 from v1.0.
- **Frame time:** 40 synchronous renders per view, software rendering, same machine. The Pillars draw the same 30,000 points and lines as v1.0 with one extra draw call, within ±4% of v1.0's render time; CPU updates stay under 0.1 ms. Not yet measured on a real GPU.
- `npm run check` passes; `npm test` 13 / 13; `npm run lint` clean; `npm run build` passes, and the three.js chunk hash is unchanged.
- **Every old link works:** the test suite resolves every v1.0 anchor, satellite and bridge link.

### Next

- Ben's decisions above, especially which systems come next.
- Open the unchecked citations: Daodejing chs. 39, 40, 42, 67; T1564 24.18; Abhidharmakośa ch. 2 / 7 / 8 locators; the B–S forms.
- Real-GPU frame time on a laptop and a phone, with 3+ systems.
- At 390 px the cosmos view is small when systems spread horizontally; with more systems, consider positions that also spread vertically.

### Content: Candidate Systems

Each anchor belongs to exactly one system. II is built; the rest are proposals for Ben to choose from, with the strongest evidence first. Attractors still unused: Thomas, Halvorsen, Rössler, Chen, Dadras, Sprott.

| # | Working name | Anchors | Why it is earned |
|---|---|---|---|
| II | The Ground ✓ | 有 空 心 法 一 慈 悲 名 | **Built 2026-11-04 (WORKING).** Bridges into the Pillars: 道生一, 一生二, 有無相生, 名可名, 道法自然, 四無量心, 慈 · 愛, 心 · 愛, 中道 |
| III | Words of Power | 如 實 真 言 咒 聲 符 印 | 如實 is Rushi's own name; 真言 = mantra; 咒 (dhāraṇī and spells, with 陀羅尼 told on its card); 聲 (sound); Daoist 符; 印 (mudrā, seal) |
| IV | Heaven and Change | 天 地 人 陰 陽 氣 易 時 | The Yijing and correlative cosmology; links to the Book of Changes realm (Phase 4) |
| V | The Constant Virtues | 德 仁 義 禮 智 信 孝 忠 | 道德經's other half (德); 仁 already appears in 愛's card |
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
| XI | Hungry Ghosts | 餓 鬼 魂 魄 貪 渴 施 食 | 餓鬼 = preta (translation); 盂蘭盆 Ullambana (sound loan) and 目連救母; 魂 / 魄 souls; 貪 (rāga, one of the three poisons); 施 (dāna, 施餓鬼 feeding the ghosts); craving links back to 愛 (tṛṣṇā) | documented |
| XII | Future | 未 來 將 後 望 夢 命 劫 | 未來 (anāgata) and the 三世 past, present, future; 劫 kalpa (sound loan); 命 fate; 夢 (Zhuangzi); Maitreya the future Buddha (慈氏, in II) | mostly documented |
| XIII | The Fermi Paradox | 宇 宙 寂 孤 遠 他 誰 聽 | 宇宙: 「四方上下曰宇，往古來今曰宙」 (space and time; trace to its source); 寂 silence (寂滅 nirvāṇa); the paradox itself is modern, so its links to these characters are Analogy or Interpretation, declared | mostly proposed |

**Compression option** if 13 feels like too many: merge Becoming into IV (Heaven and Change, already about change) and Future into XI or XII. That gives 11 systems, needing three new attractors, not five.

**Ids:** these sets bring many homophones (意 / 義 / 易 / 一 yì / yī; 明 / 名 míng; 信 / 心 xìn / xīn; 時 / 實 / 識 shí / shì; 思 / 司 / 死 sī / sǐ). Proposal: from III on, use pinyin plus a gloss word for any id that collides (`ming-bright`, `yi-change`, `shi-time`).

**Suggested order:** III Words of Power first (如實 is Rushi's own name, and it shares 實 with II's 名者實之賓), then IV and VI, which have the strongest documented bridges into I and II, then the rest. At the log's own estimate of a session per one or two systems, 11 systems is about 6–9 sessions of drafting, plus Ben's acceptance and the opening of citations, which continue for as long as the project lives.

### Honest Effort Estimate

- **Engineering (once):** done, in one session (2026-11-04).
- **Content (per system):** `npm run ingest` fills readings and structure in seconds. Drafting about 40 claims with citations takes about a session per one or two systems, entering as WORKING. Ben's acceptance and opening the citations (verification) continue for as long as the project lives. That is by design, not a backlog to be ashamed of.
