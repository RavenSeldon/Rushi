// `npm run fetch-raw` — download the pinned reference data that ingestion reads.
// Nothing here ships to visitors; data-raw/ is git-ignored.
//
// Source: @mandel59/mojidata, which bundles the Unicode Han Database (Unihan
// 18.0.0, Unicode License v3) and Mojidata IDS (CC0-1.0) in one SQLite file.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const PKG = '@mandel59/mojidata@1.9.3';
const OUT = new URL('../data-raw/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
if (existsSync(OUT + 'moji.db')) {
  console.log('data-raw/moji.db already present');
  process.exit(0);
}
const tgz = execFileSync('npm', ['pack', PKG, '--silent', '--pack-destination', OUT], { encoding: 'utf8' }).trim().split('\n').pop();
execFileSync('tar', ['xzf', OUT + tgz, '-C', OUT, 'package/dist/moji.db', 'package/licenses', 'package/download.txt']);
renameSync(OUT + 'package/dist/moji.db', OUT + 'moji.db');
rmSync(OUT + tgz);
const sha = createHash('sha256').update(readFileSync(OUT + 'moji.db')).digest('hex');
console.log(`✓ ${PKG} → data-raw/moji.db (sha256 ${sha.slice(0, 16)}…)`);
