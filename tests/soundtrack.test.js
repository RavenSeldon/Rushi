import { test } from 'node:test';
import assert from 'node:assert/strict';
import { orderTracks } from '../src/lib/tracks.js';

const entry = (names) => Object.fromEntries(names.map((n) => [`../assets/audio/${n}`, `/assets/${n}`]));

test('no audio files: no soundtrack', () => {
  assert.deepEqual(orderTracks({}), { tracks: [], skipped: [] });
  assert.deepEqual(orderTracks(entry(['README.md'])).tracks, []);
});

test('tracks play in the Tale’s filename order, with a lettered slot after its number', () => {
  const { tracks } = orderTracks(entry(['05_05-mind_loaded.m4a', '01_01-fission.m4a', '04a_04a-good.m4a', '04_04-lament.m4a']));
  assert.deepEqual(tracks.map((u) => u.split('/').pop()), ['01_01-fission.m4a', '04_04-lament.m4a', '04a_04a-good.m4a', '05_05-mind_loaded.m4a']);
});

test('names with spaces are skipped and reported; other formats and hidden files are ignored', () => {
  const r = orderTracks(entry(['01 bad name.mp3', '02_ok.ogg', '03_song.wav', '.04_hidden.mp3']));
  assert.deepEqual(r.tracks.map((u) => u.split('/').pop()), ['02_ok.ogg']);
  assert.deepEqual(r.skipped, ['01 bad name.mp3']);
});
