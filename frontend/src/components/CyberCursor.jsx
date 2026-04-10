import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 6

export default function CyberCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRefs = useRef([])
  const ripplesRef = useRef(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const dot = dotRef.current
    const ring = ringRef.current
    const trails = trailRefs.current
    const ripplesContainer = ripplesRef.current
    if (!dot || !ring || !ripplesContainer) return

    // Hide default cursor
    document.body.style.cursor = 'none'
    const styleEl = document.createElement('style')
    styleEl.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `
    document.head.appendChild(styleEl)

    let hovering = false

    const onMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY

      // Core dot — instant, no transition
      dot.style.transform = `translate(${x}px, ${y}px)`

      // Ring — instant position but smooth scale via CSS transition
      ring.style.transform = `translate(${x}px, ${y}px) scale(${hovering ? 1.8 : 1})`

      // Trail dots — each has increasing CSS transition delay
      for (let i = 0; i < trails.length; i++) {
        trails[i].style.transform = `translate(${x}px, ${y}px)`
      }
    }

    const onMouseOver = (e) => {
      const t = e.target
      if (t.matches && t.matches('a, button, [role="button"], input, textarea, select, label, [data-clickable]')) {
        hovering = true
        ring.style.transform = ring.style.transform.replace(/scale\([^)]+\)/, 'scale(1.8)')
        ring.style.borderColor = '#ff6b9d'
        ring.style.boxShadow = '0 0 15px rgba(255,107,157,0.4), inset 0 0 15px rgba(255,107,157,0.1)'
        dot.style.opacity = '0.3'
        dot.style.transform = dot.style.transform // keep position
      }
    }

    const onMouseOut = (e) => {
      const t = e.target
      if (t.matches && t.matches('a, button, [role="button"], input, textarea, select, label, [data-clickable]')) {
        hovering = false
        ring.style.borderColor = 'rgba(77,159,255,0.5)'
        ring.style.boxShadow = '0 0 10px rgba(77,159,255,0.3), inset 0 0 10px rgba(77,159,255,0.05)'
        dot.style.opacity = '1'
      }
    }

    const onClick = (e) => {
      // Spawn a CSS-animated ripple
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 40px; height: 40px;
        margin: -20px 0 0 -20px;
        border-radius: 50%;
        border: 2px solid #c44dff;
        box-shadow: 0 0 12px rgba(196,77,255,0.5);
        pointer-events: none;
        transform: translate(${e.clientX}px, ${e.clientY}px) scale(0);
        animation: cyber-ripple 0.6s ease-out forwards;
        z-index: 99999;
      `
      ripplesContainer.appendChild(ripple)
      setTimeout(() => ripple.remove(), 650)
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
      document.body.style.cursor = ''
      styleEl.remove()
    }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      <style>{`
        @keyframes cyber-ripple {
          0% { transform: translate(var(--x), var(--y)) scale(0); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(3); opacity: 0; }
        }
        @keyframes cyber-ripple {
          to { transform: scale(3); opacity: 0; }
        }
        @keyframes cursor-pulse {
          0%, 100% { box-shadow: 0 0 6px rgba(255,107,157,0.8), 0 0 20px rgba(255,107,157,0.3); }
          50% { box-shadow: 0 0 10px rgba(255,107,157,1), 0 0 30px rgba(255,107,157,0.5); }
        }
      `}</style>

      {/* Trail dots — CSS transition creates the trailing effect */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${4 - i * 0.4}px`,
            height: `${4 - i * 0.4}px`,
            marginLeft: `${-(4 - i * 0.4) / 2}px`,
            marginTop: `${-(4 - i * 0.4) / 2}px`,
            borderRadius: '50%',
            backgroundColor: TRAIL_COUNT - i <= 2 ? '#4dffb8' : i <= 1 ? '#c44dff' : '#4d9fff',
            opacity: 0.6 - i * 0.08,
            pointerEvents: 'none',
            zIndex: 100000 - i,
            willChange: 'transform',
            transition: `transform ${0.08 + i * 0.04}s ease-out`,
          }}
        />
      ))}

      {/* Outer ring — smooth scale on hover */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          marginLeft: '-18px',
          marginTop: '-18px',
          borderRadius: '50%',
          border: '1.5px solid rgba(77,159,255,0.5)',
          boxShadow: '0 0 10px rgba(77,159,255,0.3), inset 0 0 10px rgba(77,159,255,0.05)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          transition: 'transform 0.12s ease-out, border-color 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Core dot — instant, no transition */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          borderRadius: '50%',
          backgroundColor: '#ff6b9d',
          pointerEvents: 'none',
          zIndex: 100001,
          willChange: 'transform',
          animation: 'cursor-pulse 2s ease-in-out infinite',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Ripple container */}
      <div ref={ripplesRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99998 }} />
    </>
  )
}
