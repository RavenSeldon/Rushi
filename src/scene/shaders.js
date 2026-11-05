// ============================================================================
// GLSL. All animation lives on the GPU: the CPU never rewrites positions.
// ============================================================================

export const PARTICLE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uTier;        // fraction of particles kept (0–1)
  uniform float uPointScale;
  uniform float uPixelRatio;
  uniform float uMotion;      // 0 = reduced motion
  uniform float uDim;         // 1 = overview, lower when focused

  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  attribute float aFlow;      // position along the trajectory (0–1); -1 = deep field
  attribute float aKeep;      // random rank for adaptive culling
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    if (aKeep > uTier) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      return;
    }
    vec3 p = position;
    float t = uTime * uMotion;
    p += 0.06 * uMotion * vec3(sin(t * 0.35 + aPhase), cos(t * 0.29 + aPhase * 1.3), sin(t * 0.23 + aPhase * 0.7));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 4.0);

    float twinkle = mix(1.0, 0.86 + 0.14 * sin(t * 1.3 + aPhase * 6.2831), uMotion);
    // A slow pulse of light travelling along the trajectory, in the direction
    // the system actually flows. Barely there; it should be felt, not seen.
    float pulse = 1.0;
    if (aFlow >= 0.0) {
      float w = sin(aFlow * 46.0 - t * 0.55);
      pulse = 1.0 + 0.35 * uMotion * pow(max(w, 0.0), 10.0);
    }

    float dimmable = aFlow >= 0.0 ? uDim : mix(1.0, uDim, 0.5);
    vAlpha = aAlpha * twinkle * pulse * dimmable;
    vColor = aColor;

    float size = aSize * uPointScale * uPixelRatio * (260.0 / dist);
    gl_PointSize = clamp(size, 0.75 * uPixelRatio, 7.0 * uPixelRatio);
    gl_Position = projectionMatrix * mv;
  }
`;

export const PARTICLE_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    if (vAlpha < 0.004) discard;
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv);
    if (d2 > 0.25) discard;
    float core = exp(-d2 * 22.0);
    gl_FragColor = vec4(vColor, vAlpha * core);
  }
`;

// Rendered once, offscreen, into an equirectangular texture that wraps the
// sky. Domain-warped fbm in 3D (direction space) — so there is no seam.
export const NEBULA_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export const NEBULA_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uBlue;
  uniform vec3 uDeep;
  uniform vec3 uGold;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                   mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                   mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }
  void main() {
    float lon = (vUv.x - 0.5) * 6.2831853;
    float lat = (vUv.y - 0.5) * 3.1415926;
    vec3 dir = vec3(cos(lat) * sin(lon), sin(lat), -cos(lat) * cos(lon));

    vec3 q = dir * 2.2;
    vec3 warp = vec3(fbm(q + 1.7), fbm(q + 9.2), fbm(q + 4.4));
    float n = fbm(q + 1.8 * warp);

    // Concentrate the nebula behind the attractor (looking down -z), and in a
    // soft band — space stays mostly black.
    float behind = smoothstep(-0.2, 0.9, -dir.z);
    float band = exp(-pow(dir.y * 1.6 - 0.15, 2.0));
    float mask = mix(0.18, 1.0, behind) * mix(0.35, 1.0, band);

    float cloud = smoothstep(0.42, 0.85, n) * mask;
    float ridge = pow(1.0 - abs(2.0 * fbm(q * 2.1 + warp * 2.0) - 1.0), 7.0) * mask * behind;

    vec3 col = uDeep * cloud * 1.25 + uBlue * pow(cloud, 1.5) * 1.05 + mix(uBlue * 1.6, uGold, 0.4) * ridge * 0.16;
    gl_FragColor = vec4(col, 1.0);
  }
`;
