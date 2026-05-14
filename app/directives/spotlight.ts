import type { ObjectDirective } from 'vue'

interface SpotlightHTMLElement extends HTMLElement {
  __spot_move?: (e: PointerEvent) => void
  __spot_enter?: () => void
  __spot_leave?: () => void
  __spot_ro?: ResizeObserver
  __spot_raf?: number
}

// Spotlight radius scales with the element's diagonal so a small badge gets a
// small glow and a wide card gets a wider one, without manual per-target tuning.
// CSS applies calc(... * var(--spot-scale, 1)) so you can enlarge the glow per
// host without overriding these inline --spot-rx / --spot-ry values.
function updateRadius(el: SpotlightHTMLElement) {
  const w = el.clientWidth
  const h = el.clientHeight
  const diag = Math.hypot(w, h)
  // Tuned so:
  //   badge (~90x26) -> ~42px / 36px (compact dot)
  //   button row (~300x40) -> ~135px / 115px
  //   card (~640x200) -> capped at 280 / 220 (matches previous look)
  const rx = Math.min(280, diag * 0.45)
  const ry = Math.min(220, diag * 0.38)
  el.style.setProperty('--spot-rx', `${rx}px`)
  el.style.setProperty('--spot-ry', `${ry}px`)
}

// If the host clips its overflow (e.g. .uni card hides its brand image), the
// pseudo can't extend past the padding-box, so collapse the inset to 0 to
// avoid the ring being visually clipped.
function updateInset(el: SpotlightHTMLElement) {
  const cs = getComputedStyle(el)
  const clipped =
    cs.overflowX !== 'visible' || cs.overflowY !== 'visible'
  if (clipped) el.style.setProperty('--spot-inset', '0px')
  else el.style.removeProperty('--spot-inset')
}

export const spotlight: ObjectDirective<SpotlightHTMLElement> = {
  mounted(el) {
    if (window.matchMedia('(hover: none)').matches) return

    el.classList.add('spotlight')

    let pendingX = 0
    let pendingY = 0

    const flush = () => {
      el.__spot_raf = 0
      el.style.setProperty('--spot-x', `${pendingX}px`)
      el.style.setProperty('--spot-y', `${pendingY}px`)
    }

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      pendingX = e.clientX - rect.left
      pendingY = e.clientY - rect.top
      if (!el.__spot_raf) el.__spot_raf = requestAnimationFrame(flush)
    }
    const onEnter = () => el.classList.add('spotlight--on')
    const onLeave = () => el.classList.remove('spotlight--on')

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointercancel', onLeave)

    updateRadius(el)
    updateInset(el)
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateRadius(el)
        updateInset(el)
      })
      ro.observe(el)
      el.__spot_ro = ro
    }

    el.__spot_move = onMove
    el.__spot_enter = onEnter
    el.__spot_leave = onLeave
  },
  unmounted(el) {
    if (el.__spot_raf) cancelAnimationFrame(el.__spot_raf)
    if (el.__spot_move) el.removeEventListener('pointermove', el.__spot_move)
    if (el.__spot_enter) el.removeEventListener('pointerenter', el.__spot_enter)
    if (el.__spot_leave) {
      el.removeEventListener('pointerleave', el.__spot_leave)
      el.removeEventListener('pointercancel', el.__spot_leave)
    }
    el.__spot_ro?.disconnect()
    el.__spot_move = undefined
    el.__spot_enter = undefined
    el.__spot_leave = undefined
    el.__spot_ro = undefined
    el.__spot_raf = undefined
  },
}
