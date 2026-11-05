// Per-viewer conveniences only (intro seen, display preferences).
// Storage can be unavailable (private mode, blocked site data): every access
// is guarded, and the app behaves correctly with none of it.
const PREFIX = 'rushi:';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fine */
  }
}
