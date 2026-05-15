<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

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
    scale: 0.9,
    quality: 0.5,
    darkness: 0.7,
  },
)

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const wrapRef = useTemplateRef<HTMLElement>('wrapRef')

// Flips to `true` after the first GL draw so the canvas+grain layers fade in
// from the underlying solid background instead of popping in at full strength.
const ready = ref(false)

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
  // 3 octaves: on the larger feature scale used here the highest-frequency
  // octave reads as faint noise rather than structure, so dropping it saves
  // ~25% shader work for no visible change.
  for (int i = 0; i < 3; i++) {
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

  // Single-stage domain warp -> liquid look. A second warp pass would be
  // smoother but costs another 2 fbm() calls per pixel; on slow speed the
  // visual difference is minimal.
  vec2 q = vec2(
    fbm(uv + vec2(0.0, t)),
    fbm(uv + vec2(5.2, 1.3) - t * 0.8)
  );

  float n = fbm(uv + 4.0 * q);

  // Sin remap creates the chrome bands. Lower multiplier => wider bands,
  // matched to the larger underlying noise so the look stays coherent.
  float band = sin(n * 5.0 + 0.6 * t);

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
let vertexShader: WebGLShader | null = null
let fragmentShader: WebGLShader | null = null
let vertexBuffer: WebGLBuffer | null = null
let raf = 0
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
let resizeObserver: ResizeObserver | null = null
let visibilityHandler: (() => void) | null = null
let focusHandler: (() => void) | null = null
let blurHandler: (() => void) | null = null
let reducedMotionMql: MediaQueryList | null = null
let reducedMotionHandler: ((e: MediaQueryListEvent) => void) | null = null
let reducedMotion = false

// Parallax: pointer drives X+Y, scroll drives an additional Y component.
// Both feed CSS variables on the wrapper; the actual translate is smoothed
// by a CSS transition on the layers, so the JS side only has to publish the
// latest target value (one DOM write per frame, coalesced via rAF).
let parallaxHandler: ((e: PointerEvent) => void) | null = null
let scrollHandler: (() => void) | null = null
let parallaxFrame = 0
let pointerOffsetX = 0
let pointerOffsetY = 0
let scrollOffsetY = 0

const POINTER_PARALLAX_RATIO = 0.08 // ±8% of the viewport per axis
const SCROLL_PARALLAX_RATIO = 0.05  // shift = -scrollY * this
const SCROLL_PARALLAX_CAP = 0.06    // clamp absolute shift to 6% of viewport

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

  vertexShader = compile(gl, gl.VERTEX_SHADER, VERT)
  fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAG)
  if (!vertexShader || !fragmentShader) return false

  program = gl.createProgram()
  if (!program) return false
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[LiquidBackground] link error:', gl.getProgramInfoLog(program))
    return false
  }
  gl.useProgram(program)

  vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
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
  // Cap DPR at 1.0: retina sampling is wasted on a slow noise-based fullscreen
  // background and ~2.25× more pixels to shade gives nothing the eye can see.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.0)
  const q = Math.max(0.3, Math.min(1, props.quality))
  // Size the framebuffer to the *viewport*, not to the canvas's CSS box. The
  // CSS box is oversized to give the parallax translate a buffer; if we used
  // clientWidth/Height the buffer would grow ~1.7× in pixel count for nothing
  // (the eye doesn't gain anything from shading the parallax overflow at full
  // res — CSS upscales the existing texture instead).
  const w = Math.max(1, Math.floor(window.innerWidth * dpr * q))
  const h = Math.max(1, Math.floor(window.innerHeight * dpr * q))
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

  if (uTime) gl.uniform1f(uTime, elapsed)
  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function pauseLoop() {
  if (!raf) return
  cancelAnimationFrame(raf)
  raf = 0
}

function resumeLoop() {
  if (raf || !gl) return
  // Reset the frame clock so we don't push a huge `dt` after a long pause.
  lastFrame = 0
  raf = requestAnimationFrame(frame)
}

function syncParallax() {
  parallaxFrame = 0
  const wrap = wrapRef.value
  if (!wrap) return
  wrap.style.setProperty('--parallax-x', `${pointerOffsetX}px`)
  wrap.style.setProperty('--parallax-y', `${pointerOffsetY + scrollOffsetY}px`)
}

function queueParallaxSync() {
  if (!parallaxFrame) parallaxFrame = requestAnimationFrame(syncParallax)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  smoothedSpeed = Math.max(0, props.speed)

  reducedMotionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = reducedMotionMql.matches
  reducedMotionHandler = (e) => (reducedMotion = e.matches)
  reducedMotionMql.addEventListener?.('change', reducedMotionHandler)

  if (!setupGL(canvas)) return

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)

  // Pause the loop whenever the tab is hidden or our window loses focus —
  // both stop the shader from chewing GPU time while the user is elsewhere.
  visibilityHandler = () => {
    if (document.hidden) pauseLoop()
    else resumeLoop()
  }
  blurHandler = pauseLoop
  focusHandler = resumeLoop
  document.addEventListener('visibilitychange', visibilityHandler)
  window.addEventListener('blur', blurHandler)
  window.addEventListener('focus', focusHandler)

  // Pointer parallax: mouse-only (touch/pen ignored — phone scrolling
  // shouldn't shove the background around). pointermove events are coalesced
  // into one CSS-variable write per animation frame; the CSS transition on
  // the layers smooths the actual motion, so there's no per-frame JS or GL
  // work tied to the cursor.
  parallaxHandler = (e: PointerEvent) => {
    if (reducedMotion || e.pointerType !== 'mouse') return
    const w = window.innerWidth
    const h = window.innerHeight
    // Centre-origin -1..1, scaled to POINTER_PARALLAX_RATIO of the viewport.
    pointerOffsetX = ((e.clientX / w) - 0.5) * 2 * (w * POINTER_PARALLAX_RATIO)
    pointerOffsetY = ((e.clientY / h) - 0.5) * 2 * (h * POINTER_PARALLAX_RATIO)
    queueParallaxSync()
  }
  window.addEventListener('pointermove', parallaxHandler, { passive: true })

  // Scroll parallax: drift the layers upward as the page scrolls down so the
  // background reads as a slower, deeper plane behind the content. Clamped
  // so very long pages can't push the layers out of the oversize buffer.
  scrollHandler = () => {
    if (reducedMotion) {
      if (scrollOffsetY !== 0) {
        scrollOffsetY = 0
        queueParallaxSync()
      }
      return
    }
    const maxAbs = window.innerHeight * SCROLL_PARALLAX_CAP
    const target = -window.scrollY * SCROLL_PARALLAX_RATIO
    scrollOffsetY = Math.max(-maxAbs, Math.min(maxAbs, target))
    queueParallaxSync()
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  // Initial sync in case the page was reloaded mid-scroll.
  scrollHandler()

  raf = requestAnimationFrame(frame)
  // Schedule the reveal one frame after the first draw is queued so the
  // opacity transition starts with actual shader pixels behind it, not an
  // empty buffer that would briefly fade in as black.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ready.value = true
    })
  })
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

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  raf = 0

  resizeObserver?.disconnect()
  resizeObserver = null

  if (visibilityHandler) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = null
  }
  if (blurHandler) {
    window.removeEventListener('blur', blurHandler)
    blurHandler = null
  }
  if (focusHandler) {
    window.removeEventListener('focus', focusHandler)
    focusHandler = null
  }
  if (parallaxHandler) {
    window.removeEventListener('pointermove', parallaxHandler)
    parallaxHandler = null
  }
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    scrollHandler = null
  }
  if (parallaxFrame) {
    cancelAnimationFrame(parallaxFrame)
    parallaxFrame = 0
  }
  if (reducedMotionMql && reducedMotionHandler) {
    reducedMotionMql.removeEventListener?.('change', reducedMotionHandler)
  }
  reducedMotionMql = null
  reducedMotionHandler = null

  // Free GL objects explicitly so we don't leave them dangling for the GC to
  // reach when the canvas element disappears.
  if (gl) {
    if (vertexShader) gl.deleteShader(vertexShader)
    if (fragmentShader) gl.deleteShader(fragmentShader)
    if (vertexBuffer) gl.deleteBuffer(vertexBuffer)
    if (program) gl.deleteProgram(program)
    // Force the driver to release framebuffer / VRAM immediately instead of
    // waiting on the canvas element to be GC'd by the renderer process.
    const lose = gl.getExtension('WEBGL_lose_context')
    lose?.loseContext()
  }
  vertexShader = null
  fragmentShader = null
  vertexBuffer = null
  program = null
  gl = null
})
</script>

<template>
  <div
    ref="wrapRef"
    class="liquid-bg"
    :class="{ 'liquid-bg--ready': ready }"
    aria-hidden="true"
  >
    <canvas ref="canvasRef" class="liquid-bg__canvas" />
    <div class="liquid-bg__grain" />
  </div>
</template>

<style scoped>
@reference "@/assets/css/tailwind.css";

.liquid-bg {
  /* `inset-0` already stretches the fixed element to the viewport edges;
     explicit `w-screen`/`h-screen` resolve to `100vw`/`100vh`, which is
     wider than the html area when a vertical scrollbar is present and would
     trigger a phantom horizontal scrollbar. */
  @apply pointer-events-none fixed inset-0 -z-10 bg-neutral-950;
}

/* Both layers are oversized by 15% on every side so the parallax translate
   (pointer ±8% + scroll ±6% = ±14% max on Y, ±8% on X) never exposes the
   wrapper bg at the edges. The WebGL framebuffer is sized to the viewport,
   not to this oversized box, so the extra display area is just a CSS upscale
   of the already-rendered shader — no extra GPU pixel work. Transform is
   driven by CSS variables published from JS and smoothed by the compositor
   via a transition — no per-frame JS or GL touches the parallax at all. */
.liquid-bg__canvas,
.liquid-bg__grain {
  position: absolute;
  top: -15%;
  left: -15%;
  width: 130%;
  height: 130%;
  display: block;
  transform: translate3d(var(--parallax-x, 0px), var(--parallax-y, 0px), 0);
  will-change: transform;
}

/* Both layers start invisible so the underlying `bg-neutral-950` shows
   through, then ease to their target opacities once the first frame has been
   painted. Two separate transitions with a small grain delay so the grain
   settles in just after the shader becomes recognisable. */
.liquid-bg__canvas {
  opacity: 0;
  transition:
    opacity 1600ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Static SVG fractal-noise tile, rendered once and tiled by the compositor.
   Lives at full CSS resolution regardless of the WebGL framebuffer quality,
   so the grain stays fine instead of inheriting the canvas pixel size.

   Colour matrix outputs WHITE pixels with alpha derived from input luminance
   (and biased so mid-tones drop to transparent). With pure-white pixels and
   normal alpha compositing the result is mathematically identical to a
   `mix-blend-mode: screen` overlay, but we skip the extra compositor pass
   that the blend mode would force on every canvas repaint. */
.liquid-bg__grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.45 0.45 0.45 0 -0.18'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 200px 200px;
  opacity: 0;
  transition:
    opacity 1800ms cubic-bezier(0.22, 1, 0.36, 1) 250ms,
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.liquid-bg--ready .liquid-bg__canvas {
  opacity: 1;
}

.liquid-bg--ready .liquid-bg__grain {
  opacity: 0.08;
}

/* Reduced-motion users skip both the fade-in and the parallax tween — layers
   start at their final opacity and the JS handler bails before publishing
   any non-zero translation. */
@media (prefers-reduced-motion: reduce) {
  .liquid-bg__canvas {
    opacity: 1;
    transition: none;
  }
  .liquid-bg__grain {
    opacity: 0.08;
    transition: none;
  }
}
</style>
