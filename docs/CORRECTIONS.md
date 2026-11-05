# Scholarly Corrections Log

A record of every factual change to Rushi's data, the reason for it, and where to check it. Entries are only ever added. This log is the project's provenance.

## 2026-11-04 — Review pass ("如實 architectural & design review")

### Reconstructions (Baxter & Sagart 2014)

| Char | Was | Now | Note |
|---|---|---|---|
| 道 | `*[k.l]ˤuʔ` | `*[kə.l]ˤuʔ` | The preinitial is *kə., not *k. |
| 愛 | `*ˤə[p]-s` | `*[q]ˤə[p]-s` | The initial *[q] was missing |
| 為 | `*ɢʷ(r)aj` | unchanged | wèi's *-s derivation is now discussed in its card rather than given its own form |
| 無, 不, 二, 量, 司 | — | unchanged | `*ma`, `*pə`, `*ni[j]-s`, `*[r]aŋ` / `*[r]aŋ-s`, `*s-lə` confirmed |

Checked against Wiktionary's B–S tables (Wiktionary 愛, 司, 量, 為, 無, 二) and Dong Chinese (道). These are secondary transcriptions of B–S 2014, so a pass against the primary list is still worth doing.

### Factual corrections

- **量 ↔ Pramāṇa source.** The card said Dignāga's *Pramāṇasamuccaya* (集量論) was translated by Xuanzang. It was translated by **Yijing** (now lost). Xuanzang translated the 因明 primers (因明正理門論, 因明入正理論).
- **為 · asaṃskṛta.** The card said translators adopted "為 (saṃskṛta)". The conditioned is **有為**, and 無為 is the unconditioned.
- **二 · Zhuangzi.** 彼 and 是 were glossed the wrong way round. 彼 = "that", 是 = "this".
- **愛 · maitrī.** The card implied 慈愛 is the term for maitrī. Maitrī is normally **慈**, and 愛 renders **tṛṣṇā** (craving) in the twelve links. The card now says plainly that 愛 is not the standard rendering of maitrī.
- **不二 bridge source.** It cited Zhuangzi ch. 2 as a source of the compound. Zhuangzi's 道樞 is an earlier *parallel*, not a source, and the bridge now says so in a note.
- **道 · mārga.** It said 道 rendered "bodhi/dharma" in the Kumārajīva corpus. 道 for mārga (八正道) and for bodhi (得道) predates Kumārajīva, and the claim about dharma (normally 法) was removed.
- **無 · śūnyatā.** It said early Buddhists "mapped śūnyatā onto 無". This was refined: the 格義 practice is named, Lokakṣema's use of 本無 for *tathatā* is noted, and the card states that the standard rendering of śūnyatā is 空.
- **不 · eight negations.** "無遮" was removed as a supposed gloss of prasajya. The card now notes that the prasajya/paryudāsa distinction comes from later commentators (e.g. Bhāviveka).

### Reclassifications

- **量 ↔ 司 "Measured Stewardship"** moved from *Sinitic Etymology* to **Original Interpretation**. No classical compound joins the two, so the pairing is the project's own.
- **Etymology type** was relabelled *Sinitic Etymology & Usage*, because several entries (道法自然, 有無相生, 兼愛, 道樞) cite classical usage rather than graph history.

### Glyph origins: competing readings now stated

- **道:** 首 is usually analysed as phonetic. The "head leading the way" reading is flagged as interpretive.
- **為:** the Shuowen's "female macaque" reading is noted as superseded by the oracle-bone evidence.
- **愛:** 㤅 (心 + phonetic 旡), with 夊 added from Qin. The "figure turning back" reading of 旡 is flagged as interpretive.
- **不:** calyx (majority view) vs. the Shuowen's rising bird.
- **量:** the modern 旦 + 里 split is visual, not etymological. Competing proposals and the Shuowen's analysis are given.
- **司:** "后 reversed" is the Shuowen's explanation, the deeper origin is unknown, and the 司母戊 / 后母戊 debate is noted.
- **二:** Heaven-and-Earth readings are flagged as later and interpretive.

### Analogies made honest

- **Jalan / Aliran:** this is no longer presented as "Malay bifurcates the sense of 道". It is now offered as an analogy, with a note that neither word is a standard rendering of 道.
- **Tiada dua:** the idiom *tiada duanya* means "peerless", and the card now says so.
- **Laku:** the Javanese sense (spiritual discipline) is now separated from the Malay *kelakuan* (conduct).

### Interpretive content

- **Maitrādvaita** (satellite and bridge) is framed as a proposition "offered for reflection", with a note on its proximity to, and difference from, the Mahāyāna pairing of prajñā and karuṇā.
- The **visual design** follows the same rule: crimson is reserved for interpretation and no longer decorates the attractor's spine.

## 2026-11-04 — Phase 0: provenance

### Two claim types corrected

| Claim | Was | Now | Why |
|---|---|---|---|
| 趙州無 (wu-mu) | Attested Translation | Sinitic Etymology & Usage | It is a use of 無 within Chinese Buddhism, and its own caveat said it was not a translation |
| Non-agir (wei-nonagir) | Analogy | Attested Translation (calque) | *Non-agir* is an attested French rendering of 無為, copied part for part (non + agir = 無 + 為) |

### Status assigned

- **39 claims are CANON**, as accepted by the author on 2026-11-04.
- **3 are OPEN QUESTION:** the Maitrādvaita satellite and bridge, whose wording awaits Ben's decision, and 量 ↔ 司, which awaits Ben's confirmation as his own proposition. They draw fainter and carry a "?" until decided.

### The honest ledger

The migration gave every claim structured citations. Only 4 of the 42 claims have been checked at all, and those against other reference works (verification `reference`), not against their cited sources. The other 38 are `unchecked`, meaning a citation was assigned but not yet opened. Five known evidence gaps are listed in the data. Run `npm run check -- --verbose` to see them.

### Sinosphere readings added as WORKING

Cantonese, Japanese, Korean and Vietnamese readings and Simplified forms were added for all eight anchors by Baracus from general knowledge, attributed to Unihan but not yet checked against it.

### A structural finding

`npm test` shows that the Pillars form two islands joined by no bridge: 不 二 愛 have no path to 道 無 為 量 司. Phase 2's documented bridges (一 via Daodejing ch. 42) would be the first true link between them.

## 2026-11-04 — Phase 1 begins: opening the sources

### Readings checked against Unihan 18.0.0

The readings are now copied from the database through `npm run ingest`, not typed by hand. Where Unihan differs from what Baracus had written:

| Char | Field | Baracus had | Unihan 18.0.0 |
|---|---|---|---|
| 為 | Mandarin | wéi, wèi | wèi (wéi kept as an unverified extra) |
| 為 | Cantonese | wai4, wai6 | wai4 (wai6 kept as an extra) |
| 二 | Vietnamese | nhị | nhì (nhị kept as an extra: the literary Sino-Vietnamese reading) |
| 不 | Japanese | fu, bu | fu, bu, futsu, hi |
| all | Middle Chinese | — | Guangyun fanqie added (不 includes 方久切, confirming the rising-tone fǒu) |

Unihan lists no Vietnamese reading for 為, 愛 or 量, and no Hangul for 為. Baracus's values for these are kept, marked † and unverified.

### Citations opened

These citations have been checked against a public edition; the date, URL and the passage found are recorded with each one:

| Citation | Passage found | Edition |
|---|---|---|
| Daodejing ch. 1 | 道可道，非常道 · 無名天地之始 | course edition (Univ. Würzburg), simplified script |
| Daodejing ch. 11 | 當其無，有器之用 | YellowBridge |
| Daodejing ch. 25 | 道法自然 | course edition (Würzburg) |
| Daodejing ch. 37 | 道常無為而無不為 | course edition (Würzburg) |
| Zhuangzi ch. 2 §5 | 彼是莫得其偶，謂之道樞 | ctext.org |
| Mencius 3B9 | 墨氏兼愛，是無父也 | ctext.org |
| Analects 12.22 | 樊遲問仁。子曰：「愛人。」 | ctext.org (supports the 2026-11-04 review note on 愛) |

Daodejing chs. 2, 8, 40 and 48 could not be reached in a reliable edition during this session, so they remain unchecked.

### Added (WORKING, awaiting the author)

- **愛 → 爱, "Love Without a Heart":** 夏進興's couplet joking about simplified characters (麵無麥、愛無心…), checked at its source, with a caveat that it is a joke, not an etymology.

### Structural finding

Mojidata IDS confirms that 心 (heart) is a component of 愛, and of the Realm II candidates 慈 (兹 + 心) and 悲 (非 + 心). That is a documented Graphic Structure constellation waiting for Realm II. In 悲, 非 is phonetic, so reading it as "not-heart" would be folk etymology.

## 2026-11-04 — Many solar systems; Realm II, The Ground

### Engine (no change to any claim)

- Realms gained `name`, `numeral`, `attractor` and `position`. The Pillars sit at the origin on the Lorenz attractor; The Ground at (150, 22, −70) on the Aizawa attractor.
- The Pillars were checked to be unchanged: a test asserts every Pillars star is at exactly its v1.0 position, and still frames at 390 px and 1440 px show a pixel-identical sky (only the anti-aliasing of HTML label text differs).
- `ingest add` now takes a realm and writes `coords` instead of `lorenz`.

### A test changed because the finding changed

`npm test` asserted that the Pillars are two islands (`findChain('dao', 'bu')` is null). The 一 bridges join them, so the test now asserts the new chain, 道 → 一 → 二 → 不 (`bridge-dao-yi`, `bridge-yi-er`, `bridge-bu-er`), which is *documented* by the weakest-link rule and flagged as including unsettled claims.

### Realm II added as WORKING (drafted by Baracus, awaiting the author)

- 8 anchors (有 空 心 法 一 慈 悲 名), 18 satellites and 13 bridges, 9 of them into the Pillars. Every claim is WORKING and records `"drafted": "Baracus"`.
- Every citation points to a registered source. One source was registered: **xinjing**, the Heart Sutra, tr. Xuanzang, T251 (649 CE).
- Readings and components come from Unihan 18.0.0 and Mojidata IDS through `ingest`.

### Citations opened this session

| Citation | Passage found | Edition |
|---|---|---|
| Daodejing ch. 1 | 道可道非常道 · 名可名非常名 | Project Gutenberg #49965 (Linnell 2015, Wang Bi text) |
| Daodejing ch. 2 | 故有無相生 | Project Gutenberg #49965 |
| Unihan kFanqie 空 | 苦紅 苦貢 | Unihan 18.0.0 (data-raw/moji.db) |
| Unihan kDefinition 心 | … 5th lunar mansion, determinative star α Scorpii (Antares) | Unihan 18.0.0 |
| Mojidata IDS 愛, 𢖻 | ⿳爫冖𢖻 · ⿱心夊 | Mojidata IDS (data-raw/moji.db) |
| Mojidata IDS 慈 | ⿱兹心 | Mojidata IDS |
| Mojidata IDS 悲 | ⿱非心 | Mojidata IDS |

`bridge-fa-dao` reuses the existing ch. 25 check (道法自然, Würzburg edition) made for `dao-ziran`: same passage, same edition, said so in its caveat.

**Not reached:** Daodejing chs. 39, 40, 42 and 67. ctext.org refused automated access, and the only other copy of ch. 42 found was a hobby site with an AI translation, which was not counted as an edition. The 道生一 and 一生二 bridges are therefore `unchecked`.

### Old Chinese forms

- 一 *ʔi[t] and 名 *C.meŋ match Wiktionary's B–S basic-vocabulary list (v1.1, Sagart & Ma 2020), so they are `reference`, not checked against B–S 2014 itself.
- **心: a discrepancy.** Baracus recalled *s.[r]əm (B–S 2014); the v1.1 list gives *səm. It is `unchecked`, with a note, until the primary list is opened.
- 有 *[ɢ]ʷəʔ, 空 *kʰˤoŋ, 法 *[p]ap, 慈 *[dz]ə, 悲 *prəj are Baracus's, from general knowledge, `unchecked`, and now marked † on their cards.

### Flagged for checking before acceptance

- **MMK 24.18 (T1564).** Baracus recalls that the Taishō text reads 我說即是無, while the familiar 我說即是空 is the form quoted in the Tiantai tradition. This bears on `bridge-kong-dao` and `bridge-kong-ming`, and both carry it as a gap.
- Two Abhidharmakośa locators (心意識體一; 大悲) are recollections.

### Interface text

- About: the opening line and first paragraph now describe systems; a section "More than one sky" gives the Aizawa equations, with its worked example checked numerically; the key list adds `[` `]` and Esc to the cosmos. Drafted by Baracus, for the author to revise.

## 2026-11-04 — Folded satellites (Ben's decision)

Two satellites repeated bridges added with Realm II. Per Ben's instruction ("no unnecessary repetitions"), each was folded into its bridge, and its old id kept as an alias so links still resolve (`FOLDED` in `src/data/index.js`, tested):

| Satellite (was CANON) | Now | Standing |
|---|---|---|
| `wu-you` 有無相生 (無) | `bridge-you-wu` | CANON: the bridge now carries the accepted wording verbatim |
| `dao-ziran` 道法自然 (道) | `bridge-fa-dao` | WORKING: the accepted wording plus Baracus's sentence on 法 as the verb of the chain; its caveat says which is which |

The ch. 25 check (Würzburg edition) moved with `dao-ziran`. `wu-sunyata` (本無 → 空) is not a repetition and stays a satellite.

## 2026-11-04 — Realm III, Words of Power (WORKING, drafted by Baracus)

- **8 anchors** on the Thomas attractor: 如 實 真 言 咒 聲 符 印. 如 sits at the origin and 實 at x = y = z ≈ 2.576. Both are fixed points on the axis about which the system's x → y → z symmetry turns it, so 如實 runs along the axis. A third fixed point on that axis (≈ −2.576) is far from this attractor; checked numerically (closest approach 5.05, against 0.38 for the positive one).
- **Ids** take a gloss word where a planned homophone would collide: `shi-real`, `sheng-sound`, `yin-seal`, `zhou-spell`.
- **20 satellites and 12 bridges**, 7 of the bridges into I and II. All are WORKING. Languages used: Sanskrit, Greek (ἀλήθεια, λόγος), Japanese (shingon), Vietnamese (bùa).
- **Two satellites folded** into new bridges (Ben's rule: no repetition): `ming-shi` → `bridge-ming-shi` (名 · 實), and `ming-zhengming` → `bridge-ming-yan` (名 · 言). Old links redirect.
- **Sources registered:** `xiyuji` (大唐西域記, T2087) and `cuv` (Chinese Union Version, 1919).
- **Checked against the database this session:** IDS for 實 and 聲; Unihan kJapaneseOn for 真 (SHIN) and 言 (GEN, GON); kVietnamese for 符 (bùa).
- **Flagged:** whether Morrison (1823) used 言 for λόγος; 咒 as a later form of 祝; 印 = 抑; when 真如 became standard; a Daoist source for 符籙. The Old Chinese forms are all † unchecked, and 咒's is a guess by way of 祝.

### Engine

- Camera far plane raised from 1,200 to 6,000 so the cosmos fits on narrow phones. Nothing writes depth, so the Pillars' System view stays bit-identical (re-checked).
- The cosmos view now picks the bearing that frames the systems most closely.
- Bridge labels in later realms keep clear of the stars' name boxes. The first realm keeps v1.0's rule.

### A visible change to the Pillars, from the earlier fold

道's Star view now has four satellites, not five, since 道法自然 became `bridge-fa-dao`. The ring is re-spaced; nothing else in the Pillars moved.

## 2026-11-04 — Realms IV and V (WORKING, drafted by Baracus)

### IV — Heaven and Change, on the Halvorsen attractor

天 地 人 陰 陽 氣 易 時, seen down the axis x = y = z, where the attractor has three lobes. 天 地 人 take one each (the Three Powers, 三才). 氣 sits at the origin, a fixed point of the system. There are 14 satellites and 7 bridges, 3 of the bridges into other systems: 一陰一陽之謂道 (陽 ↔ 道), 一 in 天 (天 ↔ 一) and 仁者人也 (人 ↔ 仁).

### V — The Constant Virtues, on the Rössler attractor (tilted view)

德 仁 義 禮 智 信 孝 忠. 仁 sits on the fixed point at the centre of the spiral disk, and 德 at the summit of the fold (the Shuowen: 德，升也). There are 12 satellites and 12 bridges, 8 of the bridges into other systems: 道生之德畜之, 愛人, 仁之端, 二 in 仁, 言 in 信, 父慈子孝, 心 in 忠, 忠恕.

### Folds and reuse

- `xin-mencius` (惻隱之心) was folded into `bridge-ren-xin`; the old link redirects.
- `bridge-ren-ai` reuses the Analects 12.22 check logged earlier today (ctext.org), and says so in its caveat.

### Sources registered

`yijing` (with Xici and Shuogua), `liji`, `binh-ngo` (Nguyễn Trãi, 1428).

### Checked against the database this session

Mojidata IDS for 天 陽 氣 易 時 仁 禮 智 信 孝 忠; Unihan kJapaneseOn for 陰 and 陽; kVietnamese for 仁 and 義.

### Flagged

- Daodejing ch. 42 (負陰抱陽) is still unopened, like 道生一.
- The 五常 attribution (Dong Zhongshu) needs a Han source.
- The Bình Ngô đại cáo line and the onmyōdō sound-linking are Baracus's, from general knowledge.
- Every Old Chinese form is † unchecked.

### Engine

- Attractors may carry a viewing basis.
- The cosmos bearing now also avoids overlapping system names on narrow screens.
- The Pillars are unaffected (re-checked).
