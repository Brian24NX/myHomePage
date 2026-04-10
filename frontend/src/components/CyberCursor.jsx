import { useEffect, useRef } from 'react'

// Neon crosshair cursor as inline SVG data URI — rendered by the OS, zero lag
const CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="3" fill="%23ff6b9d"/><circle cx="16" cy="16" r="5" fill="%23ff6b9d" opacity="0.2"/><line x1="16" y1="2" x2="16" y2="11" stroke="%234d9fff" stroke-width="1.5" opacity="0.85"/><line x1="16" y1="21" x2="16" y2="30" stroke="%234d9fff" stroke-width="1.5" opacity="0.85"/><line x1="2" y1="16" x2="11" y2="16" stroke="%234d9fff" stroke-width="1.5" opacity="0.85"/><line x1="21" y1="16" x2="30" y2="16" stroke="%234d9fff" stroke-width="1.5" opacity="0.85"/><path d="M 6,6 L 6,11" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 6,6 L 11,6" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 26,6 L 26,11" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 26,6 L 21,6" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 6,26 L 6,21" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 6,26 L 11,26" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 26,26 L 26,21" stroke="%234dffb8" stroke-width="1" opacity="0.5"/><path d="M 26,26 L 21,26" stroke="%234dffb8" stroke-width="1" opacity="0.5"/></svg>`

const CURSOR_URL = `url("data:image/svg+xml,${CURSOR_SVG}") 16 16, crosshair`

const TRAIL_COUNT = 5

export default function CyberCursor() {
  const trailRefs = useRef([])
  const ringRef = useRef(null)
  const ripplesRef = useRef(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const ring = ringRef.current
    const trails = trailRefs.current
    const ripplesContainer = ripplesRef.current
    if (!ring || !ripplesContainer) return

    // Set custom cursor image globally — OS-level, zero lag
    const styleEl = document.createElement('style')
    styleEl.textContent = `
      *, *::before, *::after { cursor: ${CURSOR_URL} !important; }
    `
    document.head.appendChild(styleEl)

    let hovering = false

    const onMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      // Ring follows with slight delay
      ring.style.transform = `translate(${x}px, ${y}px) scale(${hovering ? 1.6 : 1})`

      // Trail dots
      for (let i = 0; i < trails.length; i++) {
        if (trails[i]) trails[i].style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const onMouseOver = (e) => {
      const t = e.target
      if (t.matches && t.matches('a, button, [role="button"], input, textarea, select, label, [data-clickable]')) {
        hovering = true
        ring.style.borderColor = '#ff6b9d'
        ring.style.boxShadow = '0 0 15px rgba(255,107,157,0.4), inset 0 0 15px rgba(255,107,157,0.1)'
      }
    }

    const onMouseOut = (e) => {
      const t = e.target
      if (t.matches && t.matches('a, button, [role="button"], input, textarea, select, label, [data-clickable]')) {
        hovering = false
        ring.style.borderColor = 'rgba(196,77,255,0.35)'
        ring.style.boxShadow = '0 0 10px rgba(196,77,255,0.2), inset 0 0 10px rgba(196,77,255,0.05)'
      }
    }

    const onClick = (e) => {
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 40px; height: 40px;
        margin: -20px 0 0 -20px;
        border-radius: 50%;
        border: 1.5px solid #c44dff;
        box-shadow: 0 0 12px rgba(196,77,255,0.5);
        pointer-events: none;
        transform: translate(${e.clientX}px, ${e.clientY}px) scale(1);
        opacity: 1;
        z-index: 99999;
      `
      ripplesContainer.appendChild(ripple)
      // Force reflow then animate
      ripple.offsetWidth
      ripple.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out'
      ripple.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(2.5)`
      ripple.style.opacity = '0'
      setTimeout(() => ripple.remove(), 550)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseout', onMouseOut, { passive: true })
    window.addEventListener('click', onClick, true)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('click', onClick, true)
      styleEl.remove()
    }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      {/* Trail dots — CSS transitions create comet tail */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${3 - i * 0.3}px`,
            height: `${3 - i * 0.3}px`,
            marginLeft: `${-(3 - i * 0.3) / 2}px`,
            marginTop: `${-(3 - i * 0.3) / 2}px`,
            borderRadius: '50%',
            backgroundColor: i <= 1 ? '#c44dff' : i <= 3 ? '#4d9fff' : '#4dffb8',
            opacity: 0.5 - i * 0.08,
            pointerEvents: 'none',
            zIndex: 99998 - i,
            willChange: 'transform',
            transition: `transform ${0.1 + i * 0.05}s ease-out`,
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          borderRadius: '50%',
          border: '1px solid rgba(196,77,255,0.35)',
          boxShadow: '0 0 10px rgba(196,77,255,0.2), inset 0 0 10px rgba(196,77,255,0.05)',
          pointerEvents: 'none',
          zIndex: 99997,
          willChange: 'transform',
          transition: 'transform 0.15s ease-out, border-color 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Ripple container */}
      <div ref={ripplesRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99996 }} />
    </>
  )
}
