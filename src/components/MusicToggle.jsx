import { useEffect, useState } from 'react';
import { HAS_SOUNDTRACK, onSoundtrack, toggleSoundtrack } from '../lib/soundtrack.js';

// The Tale's star, in Rushi's header: dim at rest, gold and slowly turning while
// the music plays. Not rendered at all when src/assets/audio/ has no tracks.
export default function MusicToggle({ still }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => (HAS_SOUNDTRACK ? onSoundtrack(setPlaying) : undefined), []);
  if (!HAS_SOUNDTRACK) return null;
  return (
    <button
      type="button"
      onClick={toggleSoundtrack}
      aria-pressed={playing}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title="Background music"
      className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/5 ${playing ? 'text-gold' : 'text-slate-300 hover:text-starlight'}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className={`h-[18px] w-[18px] ${playing && !still ? 'rushi-music-turn' : ''}`}
        fill="none"
      >
        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M12 3V21" />
          <path d="M3 12H21" />
          <path d="M5.6 5.6 18.4 18.4" />
          <path d="M18.4 5.6 5.6 18.4" />
        </g>
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </svg>
    </button>
  );
}
