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
    /**
     * Adds a transient speed boost driven by scroll velocity that decays
     * back to the base `speed` ~300ms after the user stops scrolling.
     * 0 — disabled, 1 — subtle, 2 — pronounced.
     */
    scrollResponse?: number
  }>(),
  {
    speed: 1.0,
    scale: 1.4,
    quality: 0.7,
    darkness: 0.7,
    scrollResponse: 1.0,
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
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 res = u_resolution;
  vec2 uv = (gl_FragCoord.xy - 0.5 * res) / min(res.x, res.y);
  uv *= u_scale;

  float t = u_time;

  // Two-stage domain warp -> liquid look.
  vec2 q = vec2(
    fbm(uv + vec2(0.0, t)),
    fbm(uv + vec2(5.2, 1.3) - t * 0.8)
  );

  vec2 r = vec2(
    fbm(uv + 3.5 * q + vec2(1.7, 9.2) + 0.15 * t),
    fbm(uv + 3.5 * q + vec2(8.3, 2.8) - 0.13 * t)
  );

  float n = fbm(uv + 4.0 * r);

  // Sin remap creates the chrome bands.
  float band = sin(n * 7.5 + 0.6 * t);

  // Sharpen the bands but keep soft edges.
  float v = smoothstep(-0.55, 0.55, band);
  v = pow(v, 0.85);

  // Subtle highlight from the warp gradient.
  float gloss = clamp(0.5 + 0.5 * length(r) - 0.5, 0.0, 1.0);
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

  // Tiny film grain to break banding.
  float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.025;
  col += grain;

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

// Scroll-driven transient speed boost.
let scrollBoost = 0
let scrollLastY = 0
let scrollLastT = 0
let scrollHandler: (() => void) | null = null
let uTime: WebGLUniformLocation | null = null
let uRes: WebGLUniformLocation | null = null
let uScale: WebGLUniformLocation | null = null
let uDarkness: WebGLUniformLocation | null = null
let resizeObserver: ResizeObserver | null = null
let visibilityHandler: (() => void) | null = null
let reducedMotion = false

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
  gl.uniform1f(uScale, props.scale)
  gl.uniform1f(uDarkness, props.darkness)

  return true
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas || !gl) return
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
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
  const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0
  lastFrame = now

  // Decay scroll boost (half-life ~230ms) so the page calms down after scroll stops.
  if (scrollBoost > 0) {
    scrollBoost *= Math.exp(-3 * dt)
    if (scrollBoost < 0.005) scrollBoost = 0
  }

  // Ease toward the target speed so prop / boost changes don't jump (~250ms).
  const base = reducedMotion ? 0 : Math.max(0, props.speed)
  const target = base + scrollBoost
  smoothedSpeed += (target - smoothedSpeed) * Math.min(1, dt * 4)

  // 0.8 keeps `speed = 1` visually equivalent to the previous default flow.
  elapsed += dt * smoothedSpeed * 0.8

  if (uTime) gl.uniform1f(uTime, elapsed)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function onScroll() {
  if (reducedMotion || props.scrollResponse <= 0) return
  const now = performance.now()
  const y = window.scrollY || window.pageYOffset || 0
  const dt = scrollLastT ? Math.max(1, now - scrollLastT) : 16
  const dy = y - scrollLastY
  scrollLastY = y
  scrollLastT = now

  // px/sec velocity, normalised: ~1800 px/s = peak.
  const vps = (Math.abs(dy) / dt) * 1000
  const norm = Math.min(1, vps / 1800)

  // Up to +2.0 to base speed at full scroll, scaled by user-supplied response.
  const target = norm * 2.0 * Math.max(0, props.scrollResponse)
  if (target > scrollBoost) scrollBoost = target
}

function attachScrollListener() {
  if (scrollHandler || props.scrollResponse <= 0) return
  scrollLastY = window.scrollY || window.pageYOffset || 0
  scrollLastT = performance.now()
  scrollHandler = onScroll
  window.addEventListener('scroll', scrollHandler, { passive: true })
}

function detachScrollListener() {
  if (!scrollHandler) return
  window.removeEventListener('scroll', scrollHandler)
  scrollHandler = null
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

  attachScrollListener()

  raf = requestAnimationFrame(frame)
})

watch(
  () => props.darkness,
  (v) => {
    if (gl && uDarkness) gl.uniform1f(uDarkness, v)
  },
)

watch(
  () => props.scale,
  (v) => {
    if (gl && uScale) gl.uniform1f(uScale, v)
  },
)

watch(
  () => props.scrollResponse,
  (v) => {
    if (v > 0) attachScrollListener()
    else detachScrollListener()
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
  detachScrollListener()
  if (gl && program) {
    gl.deleteProgram(program)
  }
  gl = null
  program = null
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="liquid-bg"
    aria-hidden="true"
  />
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";

.liquid-bg {
  @apply pointer-events-none fixed inset-0 -z-10 h-screen w-screen bg-neutral-950;
  display: block;
}
</style>
