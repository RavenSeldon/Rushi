// Which files in src/assets/audio/ become the soundtrack, and in what order.
// Kept free of browser and bundler APIs so `npm test` can run it in Node.
//
// The rules are the Tale's (SchroCivWeb, scripts/build.mjs): .mp3/.m4a/.aac/.ogg
// only; names use letters, digits, dot, dash and underscore; play order is
// filename order, compared the way the Tale compares it (locale-aware, so
// `04a_…` follows `04_…`). Anything else is skipped and reported.
export const AUDIO_EXT = /\.(mp3|m4a|aac|ogg)$/i;
export const AUDIO_OK = /^[A-Za-z0-9._-]+\.(mp3|m4a|aac|ogg)$/i;

const base = (p) => p.split('/').pop();

/** entries: { [path]: url } → { tracks: url[], skipped: filename[] } */
export function orderTracks(entries) {
  const files = Object.keys(entries).filter((p) => !base(p).startsWith('.') && AUDIO_EXT.test(p));
  const skipped = files.filter((p) => !AUDIO_OK.test(base(p))).map(base);
  const tracks = files
    .filter((p) => AUDIO_OK.test(base(p)))
    .sort((a, b) => base(a).localeCompare(base(b), 'en'))
    .map((p) => entries[p]);
  return { tracks, skipped };
}
