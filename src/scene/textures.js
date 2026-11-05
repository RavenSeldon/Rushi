import { CanvasTexture } from 'three';

// JWST's hexagonal mirror and its three-strut secondary support produce six
// long diffraction spikes (vertical and ±60° from it) plus two short
// horizontal ones from the vertical strut. We draw the same geometry.
export function createSpikeTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;

  const halo = ctx.createRadialGradient(c, c, 0, c, c, c * 0.62);
  halo.addColorStop(0, 'rgba(255,255,255,0.9)');
  halo.addColorStop(0.08, 'rgba(234,242,255,0.55)');
  halo.addColorStop(0.25, 'rgba(160,190,255,0.12)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, size, size);

  const spike = (angle, len, width, alpha) => {
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(-len, 0, len, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.42, `rgba(234,242,255,${alpha * 0.35})`);
    g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    g.addColorStop(0.58, `rgba(234,242,255,${alpha * 0.35})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-len, 0);
    ctx.lineTo(0, -width / 2);
    ctx.lineTo(len, 0);
    ctx.lineTo(0, width / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  const L = c * 0.98;
  spike(Math.PI / 2, L, size * 0.018, 0.95); // vertical
  spike(Math.PI / 6, L, size * 0.018, 0.95); // ±60° from vertical
  spike((5 * Math.PI) / 6, L, size * 0.018, 0.95);
  spike(0, L * 0.45, size * 0.011, 0.55); // short horizontal pair

  const core = ctx.createRadialGradient(c, c, 0, c, c, size * 0.05);
  core.addColorStop(0, 'rgba(255,255,255,1)');
  core.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);

  return new CanvasTexture(canvas);
}

export function createHaloTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}
