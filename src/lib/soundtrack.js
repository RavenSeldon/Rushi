// Rushi's soundtrack: the Tale's player (SchroCivWeb, src/app.js), ported.
//
// Drop .mp3/.m4a/.aac/.ogg files into src/assets/audio/ and the next build plays
// them, in filename order, as one looping playlist. No files, no player: the
// star is not rendered at all.
//
// One <audio> element lives outside React, so it is created once and survives
// every route change: travelling between stars and systems never interrupts the
// music. An <audio> element is not paused when the tab is hidden, so the music
// carries on behind other tabs and windows until it is paused here.
import { orderTracks } from './tracks.js';

const FOUND = import.meta.glob('../assets/audio/*.{mp3,m4a,aac,ogg,MP3,M4A,AAC,OGG}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const { tracks: TRACKS, skipped } = orderTracks(FOUND);
if (skipped.length) console.warn('Soundtrack: skipped ' + skipped.join(', ') + ' — use only letters, digits, dot, dash, underscore.');

export const HAS_SOUNDTRACK = TRACKS.length > 0;

const KEY = 'rushi-audio';
const REST = 3000; // after the last track, the first returns three seconds later
const GRACE = 600000; // a closed tab's place is held for ten minutes
const VOLUME = 0.4; // background bed, not foreground; adjust to taste

const listeners = new Set();
let wantPlaying = false;
let el = null;

function setup() {
  if (el || !HAS_SOUNDTRACK || typeof document === 'undefined') return el;
  el = document.createElement('audio');
  el.hidden = true;
  document.body.appendChild(el);

  // Two tiers of memory. sessionStorage is the same-tab record: a reload resumes
  // exactly, intent included. localStorage is the wider one: close the tab, come
  // back within GRACE, and the place is still held. Only the position crosses
  // that gap, never the intent: a fresh document carries no user gesture, so the
  // browser would refuse to play anyway. The star waits to be pressed.
  const readSession = () => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const readLocal = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return v && Number.isFinite(v.ts) && Date.now() - v.ts <= GRACE ? { i: v.i, t: v.t } : {};
    } catch { return {}; }
  };
  const inTab = readSession();
  const prior = Number.isInteger(inTab.i) ? inTab : readLocal();
  let index = Number.isInteger(prior.i) && TRACKS[prior.i] ? prior.i : 0;
  let restTimer = null;

  const save = () => {
    const at = { i: index, t: el.currentTime };
    try { sessionStorage.setItem(KEY, JSON.stringify({ ...at, playing: wantPlaying })); } catch { /* private mode */ }
    try { localStorage.setItem(KEY, JSON.stringify({ ...at, ts: Date.now() })); } catch { /* private mode */ }
  };
  const reflect = () => listeners.forEach((fn) => fn(wantPlaying));
  // Light the star on intent, but drop it again if the browser refuses to play,
  // so the control never claims sound that is not happening.
  const start = () => { wantPlaying = true; reflect(); return el.play().then(reflect, () => { wantPlaying = false; reflect(); }); };
  const stop = () => { wantPlaying = false; clearTimeout(restTimer); el.pause(); reflect(); };

  el.volume = VOLUME;
  el.loop = false; // the ended handler owns looping, so it can rest
  const resuming = !!prior.playing;
  const seek = prior.t > 0 ? prior.t : 0;
  // A visitor who never presses play pays nothing; one returning to a held place
  // pays for metadata only, so the position is set before they press.
  el.preload = resuming ? 'auto' : seek ? 'metadata' : 'none';
  el.src = TRACKS[index];
  const seekThen = (after) => el.addEventListener('loadedmetadata', () => {
    if (seek && seek < el.duration) el.currentTime = seek;
    if (after) after();
  }, { once: true });

  el.addEventListener('ended', () => {
    const wrapped = index + 1 >= TRACKS.length;
    index = (index + 1) % TRACKS.length;
    el.src = TRACKS[index];
    save();
    if (wrapped) restTimer = setTimeout(() => { if (wantPlaying) el.play().then(reflect, reflect); }, REST);
    else el.play().then(reflect, reflect);
  });
  addEventListener('pagehide', save);
  setInterval(save, 4000);
  if (resuming) {
    if (seek) seekThen(start);
    else start();
  } else if (seek) seekThen();

  toggle = () => {
    if (wantPlaying) stop();
    else start();
    save();
  };
  return el;
}

let toggle = () => {};

/** Press the star. */
export function toggleSoundtrack() { setup(); toggle(); }

/** Subscribe to the reader's intent (true = music on). Returns an unsubscribe. */
export function onSoundtrack(fn) {
  setup();
  listeners.add(fn);
  fn(wantPlaying);
  return () => listeners.delete(fn);
}
