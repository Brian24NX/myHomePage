import { useEffect, useRef } from 'react'

const COLORS = ['#ff6b9d', '#c44dff', '#4d9fff', '#4dffb8', '#ffd84d']
const MAX_PARTICLES = 60
const MAX_RINGS = 5

export default function CyberCursor() {
  const crosshairRef = useRef(null)
  const bracketRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const crosshair = crosshairRef.current
    const bracket = bracketRef.current
    const canvas = canvasRef.current
    if (!crosshair || !bracket || !canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    const mouse = { x: -100, y: -100 }
    const trail = { x: -100, y: -100 }
    let particleCount = 0
    const pX = new Float32Array(MAX_PARTICLES)
    const pY = new Float32Array(MAX_PARTICLES)
    const pVX = new Float32Array(MAX_PARTICLES)
    const pVY = new Float32Array(MAX_PARTICLES)
    const pLife = new Float32Array(MAX_PARTICLES)
    const pDecay = new Float32Array(MAX_PARTICLES)
    const pSize = new Float32Array(MAX_PARTICLES)
    const pColor = new Uint8Array(MAX_PARTICLES)

    let ringCount = 0
    const rX = new Float32Array(MAX_RINGS)
    const rY = new Float32Array(MAX_RINGS)
    const rRadius = new Float32Array(MAX_RINGS)
    const rLife = new Float32Array(MAX_RINGS)

    let frame = 0
    let rafId
    let prevX = -100, prevY = -100

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Hide default cursor
    document.body.style.cursor = 'none'
    const styleEl = document.createElement('style')
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; }'
    document.head.appendChild(styleEl)

    const addParticle = (x, y) => {
      if (particleCount >= MAX_PARTICLES) return
      const i = particleCount++
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 1.5 + 0.5
      pX[i] = x; pY[i] = y
      pVX[i] = Math.cos(angle) * speed
      pVY[i] = Math.sin(angle) * speed
      pLife[i] = 1
      pDecay[i] = Math.random() * 0.025 + 0.02
      pSize[i] = Math.random() * 2.5 + 1
      pColor[i] = Math.floor(Math.random() * COLORS.length)
    }

    const addRing = (x, y) => {
      if (ringCount >= MAX_RINGS) return
      const i = ringCount++
      rX[i] = x; rY[i] = y; rRadius[i] = 5; rLife[i] = 1
    }

    // DOM crosshair moves instantly via mousemove — no RAF delay
    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      crosshair.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    const onClick = (e) => {
      addRing(e.clientX, e.clientY)
      for (let i = 0; i < 10; i++) addParticle(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('click', onClick, true)

    const loop = () => {
      rafId = requestAnimationFrame(loop)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Trailing bracket follows with delay
      trail.x += (mouse.x - trail.x) * 0.2
      trail.y += (mouse.y - trail.y) * 0.2
      bracket.style.transform = `translate(${trail.x}px, ${trail.y}px) rotate(${frame * 0.6}deg)`

      // Spawn particles based on distance moved
      const dx = mouse.x - prevX
      const dy = mouse.y - prevY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 4) {
        const count = Math.min(Math.floor(dist / 8), 3)
        for (let i = 0; i < count; i++) {
          addParticle(
            mouse.x + (Math.random() - 0.5) * 4,
            mouse.y + (Math.random() - 0.5) * 4
          )
        }
        prevX = mouse.x
        prevY = mouse.y
      }

      // --- Particles ---
      let w = 0
      for (let i = 0; i < particleCount; i++) {
        pX[i] += pVX[i]; pY[i] += pVY[i]
        pLife[i] -= pDecay[i]
        if (pLife[i] <= 0) continue
        if (w !== i) {
          pX[w]=pX[i]; pY[w]=pY[i]; pVX[w]=pVX[i]; pVY[w]=pVY[i]
          pLife[w]=pLife[i]; pDecay[w]=pDecay[i]; pSize[w]=pSize[i]; pColor[w]=pColor[i]
        }
        const life = pLife[w], rad = pSize[w] * life
        ctx.globalAlpha = life * 0.7
        ctx.fillStyle = COLORS[pColor[w]]
        ctx.beginPath()
        ctx.arc(pX[w], pY[w], rad, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = life * 0.15
        ctx.beginPath()
        ctx.arc(pX[w], pY[w], rad * 3, 0, Math.PI * 2)
        ctx.fill()
        w++
      }
      particleCount = w

      // --- Rings ---
      w = 0
      for (let i = 0; i < ringCount; i++) {
        rRadius[i] += 3.5; rLife[i] -= 0.03
        if (rLife[i] <= 0) continue
        if (w !== i) { rX[w]=rX[i]; rY[w]=rY[i]; rRadius[w]=rRadius[i]; rLife[w]=rLife[i] }
        const life = rLife[w]
        ctx.globalAlpha = life * 0.5
        ctx.strokeStyle = '#c44dff'
        ctx.shadowColor = '#c44dff'
        ctx.shadowBlur = 10
        ctx.lineWidth = 2 * life
        ctx.beginPath()
        ctx.arc(rX[w], rY[w], rRadius[w], 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = '#4d9fff'
        ctx.shadowColor = '#4d9fff'
        ctx.lineWidth = 1 * life
        ctx.beginPath()
        ctx.arc(rX[w], rY[w], rRadius[w] * 0.6, 0, Math.PI * 2)
        ctx.stroke()
        w++
      }
      ringCount = w
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    loop()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick, true)
      cancelAnimationFrame(rafId)
      document.body.style.cursor = ''
      styleEl.remove()
    }
  }, [])

  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null
  }

  return (
    <>
      {/* DOM crosshair — GPU composited, moves at native speed */}
      <div
        ref={crosshairRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform',
        }}
      >
        <svg width="40" height="40" viewBox="-20 -20 40 40" style={{ display: 'block', margin: '-20px 0 0 -20px', filter: 'drop-shadow(0 0 4px rgba(77,159,255,0.6))' }}>
          {/* Crosshair lines */}
          <line x1="0" y1="-18" x2="0" y2="-6" stroke="#4d9fff" strokeWidth="1.5" opacity="0.85" />
          <line x1="0" y1="6" x2="0" y2="18" stroke="#4d9fff" strokeWidth="1.5" opacity="0.85" />
          <line x1="-18" y1="0" x2="-6" y2="0" stroke="#4d9fff" strokeWidth="1.5" opacity="0.85" />
          <line x1="6" y1="0" x2="18" y2="0" stroke="#4d9fff" strokeWidth="1.5" opacity="0.85" />
          {/* Center dot */}
          <circle cx="0" cy="0" r="2.5" fill="#ff6b9d" />
          <circle cx="0" cy="0" r="6" fill="#ff6b9d" opacity="0.15" />
        </svg>
      </div>

      {/* Trailing brackets — follows with delay */}
      <div
        ref={bracketRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
        }}
      >
        <svg width="48" height="48" viewBox="-24 -24 48 48" style={{ display: 'block', margin: '-24px 0 0 -24px', filter: 'drop-shadow(0 0 3px rgba(77,255,184,0.4))' }}>
          {/* Outer arcs */}
          <path d="M 0,-22 A 22,22 0 0,1 19.05,-11" fill="none" stroke="#c44dff" strokeWidth="1" opacity="0.3" />
          <path d="M 0,22 A 22,22 0 0,1 -19.05,11" fill="none" stroke="#c44dff" strokeWidth="1" opacity="0.3" />
          {/* Corner brackets */}
          <polyline points="-16,-10 -16,-16 -10,-16" fill="none" stroke="#4dffb8" strokeWidth="1" opacity="0.5" />
          <polyline points="10,-16 16,-16 16,-10" fill="none" stroke="#4dffb8" strokeWidth="1" opacity="0.5" />
          <polyline points="-16,10 -16,16 -10,16" fill="none" stroke="#4dffb8" strokeWidth="1" opacity="0.5" />
          <polyline points="10,16 16,16 16,10" fill="none" stroke="#4dffb8" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      {/* Canvas only for particles & click rings */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99998,
        }}
      />
    </>
  )
}
