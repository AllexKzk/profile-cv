<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /**
     * Dynamism / global flow speed multiplier.
     * 0 — frozen, 0.5 — calm, 1 — default, 2 — lively, 4 — intense.
     */
    speed?: number
    scale?: number
    quality?: number
    darkness?: number
  }>(),
  {
    speed: 1.0,
    scale: 1.4,
    quality: 0.5,
    darkness: 0.7,
  },
)

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')

const VERT = /* glsl */ `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform float u_scale;
uniform float u_darkness;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  // 4 octaves: drops ~20% of shader cost vs 5; visual difference is negligible
  // for a slow-flowing background.
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 res = u_resolution;
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);
  // Parallax shift in screen-normalised space; ~±6% feels alive without
  // pulling the eye away from the page content.
  uv -= u_mouse * 0.12;
  uv *= u_scale;

  float t = u_time;

  // Single-stage domain warp -> liquid look. A second warp pass would be
  // smoother but costs another 2 fbm() calls per pixel; on slow speed the
  // visual difference is minimal.
  vec2 q = vec2(
    fbm(uv + vec2(0.0, t)),
    fbm(uv + vec2(5.2, 1.3) - t * 0.8)
  );

  float n = fbm(uv + 4.0 * q);

  // Sin remap creates the chrome bands.
  float band = sin(n * 7.5 + 0.6 * t);

  // Sharpen the bands but keep soft edges.
  float v = smoothstep(-0.55, 0.55, band);
  v = pow(v, 0.85);

  // Subtle highlight from the warp gradient.
  float gloss = clamp(0.5 + 0.5 * length(q) - 0.5, 0.0, 1.0);
  v = mix(v, v * 0.85 + 0.15 * gloss, 0.35);

  // Palette: deep ink black -> warm cream highlight, dimmed by u_darkness.
  vec3 ink   = vec3(0.012, 0.012, 0.016);
  vec3 cream = vec3(0.965, 0.935, 0.875);
  // Pull the highlight toward the ink so the bright bands turn into muted metal.
  vec3 hi = mix(cream, ink, clamp(u_darkness * 0.92, 0.0, 1.0));
  vec3 col = mix(ink, hi, v);

  // Soft vignette so the edges fade to black.
  vec2 vUv = gl_FragCoord.xy / res - 0.5;
  float vig = smoothstep(0.95, 0.35, length(vUv));
  col *= mix(0.45, 1.0, vig);

  // Global dimming on top of palette compression.
  col *= mix(1.0, 0.55, clamp(u_darkness, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}
`

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let raf = 0
let start = 0
let elapsed = 0
let lastFrame = 0
let smoothedSpeed = 1.0

// Cap the shader at ~30 FPS. The pattern flows slowly (`speed: 0.6` in usage),
// 30 Hz reads as smooth to the eye while halving GPU work on a 60 Hz display
// and quartering it on 120 Hz.
const TARGET_FRAME_MS = 1000 / 30

let uTime: WebGLUniformLocation | null = null
let uRes: WebGLUniformLocation | null = null
let uScale: WebGLUniformLocation | null = null
let uDarkness: WebGLUniformLocation | null = null
let uMouse: WebGLUniformLocation | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityHandler: (() => void) | null = null
let reducedMotion = false

// Darkness is lerped each frame so theme toggles morph instead of snapping.
let smoothedDarkness = 0

// Mouse parallax: track the latest cursor position and lerp the current value
// every frame so cursor jitter doesn't translate to background jitter.
let mouseTargetX = 0
let mouseTargetY = 0
let mouseCurX = 0
let mouseCurY = 0
let pointerMoveHandler: ((e: PointerEvent) => void) | null = null

function compile(g: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = g.createShader(type)
  if (!sh) return null
  g.shaderSource(sh, src)
  g.compileShader(sh)
  if (!g.getShaderParameter(sh, g.COMPILE_STATUS)) {
    console.error('[LiquidBackground] shader compile error:', g.getShaderInfoLog(sh))
    g.deleteShader(sh)
    return null
  }
  return sh
}

function setupGL(canvas: HTMLCanvasElement): boolean {
  gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    powerPreference: 'low-power',
  })
  if (!gl) return false

  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return false

  program = gl.createProgram()
  if (!program) return false
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[LiquidBackground] link error:', gl.getProgramInfoLog(program))
    return false
  }
  gl.useProgram(program)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )
  const loc = gl.getAttribLocation(program, 'a_pos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  uTime = gl.getUniformLocation(program, 'u_time')
  uRes = gl.getUniformLocation(program, 'u_resolution')
  uScale = gl.getUniformLocation(program, 'u_scale')
  uDarkness = gl.getUniformLocation(program, 'u_darkness')
  uMouse = gl.getUniformLocation(program, 'u_mouse')
  smoothedDarkness = props.darkness
  gl.uniform1f(uScale, props.scale)
  gl.uniform1f(uDarkness, smoothedDarkness)
  gl.uniform2f(uMouse, 0, 0)

  return true
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !gl) return
  // Cap DPR at 1.0: retina sampling is wasted on a slow noise-based fullscreen
  // background and ~2.25× more pixels to shade gives nothing the eye can see.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.0)
  const q = Math.max(0.3, Math.min(1, props.quality))
  const w = Math.max(1, Math.floor(canvas.clientWidth * dpr * q))
  const h = Math.max(1, Math.floor(canvas.clientHeight * dpr * q))
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, w, h)
    if (uRes) gl.uniform2f(uRes, w, h)
  }
}

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  if (!gl) return
  if (!start) start = now
  // Skip frames until ~33 ms have passed since the last actual draw; rAF keeps
  // running so we still re-sync after a missed deadline.
  if (lastFrame && now - lastFrame < TARGET_FRAME_MS) return
  const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0
  lastFrame = now

  // Ease toward the target speed so prop changes don't jump (~250ms).
  const target = reducedMotion ? 0 : Math.max(0, props.speed)
  smoothedSpeed += (target - smoothedSpeed) * Math.min(1, dt * 4)

  // 0.8 keeps `speed = 1` visually equivalent to the previous default flow.
  elapsed += dt * smoothedSpeed * 0.8

  // Parallax lerp (~250ms). Snaps to centre under prefers-reduced-motion so
  // the background goes still even if the user wiggles the cursor.
  const mtx = reducedMotion ? 0 : mouseTargetX
  const mty = reducedMotion ? 0 : mouseTargetY
  const mEase = Math.min(1, dt * 4)
  mouseCurX += (mtx - mouseCurX) * mEase
  mouseCurY += (mty - mouseCurY) * mEase

  // Tween darkness toward the prop value (~700ms full transition) so theme
  // toggles morph the palette instead of snapping.
  const dDark = props.darkness - smoothedDarkness
  if (Math.abs(dDark) > 1e-4) {
    smoothedDarkness += dDark * Math.min(1, dt * 3)
    if (uDarkness) gl.uniform1f(uDarkness, smoothedDarkness)
  }

  if (uTime) gl.uniform1f(uTime, elapsed)
  if (uMouse) gl.uniform2f(uMouse, mouseCurX, mouseCurY)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  smoothedSpeed = Math.max(0, props.speed)

  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = mql.matches
  mql.addEventListener?.('change', (e) => (reducedMotion = e.matches))

  if (!setupGL(canvas)) return

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  visibilityHandler = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf)
      raf = 0
    } else if (!raf) {
      lastFrame = 0
      raf = requestAnimationFrame(frame)
    }
  }
  document.addEventListener('visibilitychange', visibilityHandler)

  // Only react to actual mouse pointers; touch/pen wouldn't make sense here
  // (scrolling on mobile shouldn't shove the background around).
  pointerMoveHandler = (e: PointerEvent) => {
    if (reducedMotion || e.pointerType !== 'mouse') return
    mouseTargetX = (e.clientX / window.innerWidth) * 2 - 1
    // Y is flipped: gl_FragCoord has origin at the bottom-left.
    mouseTargetY = 1 - (e.clientY / window.innerHeight) * 2
  }
  window.addEventListener('pointermove', pointerMoveHandler, { passive: true })

  raf = requestAnimationFrame(frame)
})

watch(
  () => props.scale,
  (v) => {
    if (gl && uScale) gl.uniform1f(uScale, v)
  },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  raf = 0
  resizeObserver?.disconnect()
  resizeObserver = null
  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  if (pointerMoveHandler) {
    window.removeEventListener('pointermove', pointerMoveHandler)
    pointerMoveHandler = null
  }
  if (gl && program) {
    gl.deleteProgram(program)
  }
  gl = null
  program = null
})
</script>

<template>
  <div class="liquid-bg" aria-hidden="true">
    <canvas ref="canvasRef" class="liquid-bg__canvas" />
    <div class="liquid-bg__grain" />
  </div>
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";

.liquid-bg {
  @apply pointer-events-none fixed inset-0 -z-10 h-screen w-screen bg-neutral-950;
}

.liquid-bg__canvas,
.liquid-bg__grain {
  @apply absolute inset-0 h-full w-full;
  display: block;
}

/* Static SVG fractal-noise tile, rendered once and tiled by the compositor.
   Lives at full CSS resolution regardless of the WebGL framebuffer quality,
   so the grain stays fine instead of inheriting the canvas pixel size.

   Colour matrix outputs WHITE pixels with alpha derived from input luminance
   (and biased so mid-tones drop to transparent). On a near-black canvas this
   reads as bright specks instead of an invisible black-on-black veil; the
   `screen` blend brightens dark areas without nuking the highlights. */
.liquid-bg__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.45 0.45 0.45 0 -0.18'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 300px 300px;
  opacity: 0.08;
  mix-blend-mode: screen;
}
</style>
