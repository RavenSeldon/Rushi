import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ANCHORS, BRIDGES, SOURCES, validateData } from './data/index.js';

if (import.meta.env.DEV) {
  const { errors } = validateData();
  if (errors.length) console.error('Rushi data errors:\n' + errors.join('\n'));
}

// Load only the CJK glyphs Rushi actually uses (a few KB instead of megabytes).
(() => {
  const text = JSON.stringify([ANCHORS, BRIDGES, SOURCES]) + '如實道無為愛不二量司';
  const chars = [...new Set([...text].filter((c) => /[⺀-鿿豈-﫿\u{20000}-\u{2FA1F}]/u.test(c)))].join('');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600&display=swap&text=${encodeURIComponent(chars)}`;
  document.head.appendChild(link);
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
