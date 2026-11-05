// `npm run check` — the contract, enforced. Fails on any error; reports known
// gaps and the verification ledger so they stay visible rather than forgotten.
import { validateData, ANCHORS, BRIDGES, REALMS } from '../src/data/index.js';

const { errors, warnings, ledger } = validateData();
const sats = ANCHORS.reduce((n, a) => n + a.satellites.length, 0);
const fmt = (o) => Object.entries(o).map(([k, v]) => `${v} ${k.toLowerCase().replace('_', ' ')}`).join(', ');

if (errors.length) {
  console.error(`✗ ${errors.length} error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`✓ contract holds — ${REALMS.length} systems, ${ANCHORS.length} anchors, ${sats} relationships, ${BRIDGES.length} bridges (${ledger.crossRealm || 0} between systems)`);
for (const r of REALMS) console.log(`  ${r.numeral.padEnd(4)} ${r.name.padEnd(16)} ${r.attractor.padEnd(10)} ${r.anchors.map((id) => ANCHORS.find((a) => a.id === id)?.glyph || id).join(' ')}`);
console.log(`  status:       ${fmt(ledger.byStatus)}`);
console.log(`  verification: ${fmt(ledger.byVerification)}  (of ${ledger.claims} claims)`);
console.log(`  citations:    ${ledger.citationsChecked} of ${ledger.citations} checked against an edition of the source`);
console.log(`  known gaps:   ${ledger.gaps}`);
if (warnings.length && process.argv.includes('--verbose')) console.log('\n  ' + warnings.join('\n  '));
else if (warnings.length) console.log(`  ${warnings.length} warning(s) — run with --verbose to list`);
