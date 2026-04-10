import { useEffect, useRef } from 'react'

const COLORS = ['#ff6b9d', '#c44dff', '#4d9fff', '#4dffb8', '#ffd84d']
const MAX_PARTICLES = 80
const MAX_RINGS = 5

export default function CyberCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    // State
    const mouse = { x: -100, y: -100 }
    const cursor = { x: -100, y: -100 }
    let particleCount = 0
    const particlesX = new Float32Array(MAX_PARTICLES)
    const particlesY = new Float32Array(MAX_PARTICLES)
    const particlesVX = new Float32Array(MAX_PARTICLES)
    const particlesVY = new Float32Array(MAX_PARTICLES)
    const particlesLife = new Float32Array(MAX_PARTICLES)
    const particlesDecay = new Float32Array(MAX_PARTICLES)
    const particlesSize = new Float32Array(MAX_PARTICLES)
    const particlesColor = new Uint8Array(MAX_PARTICLES)

    let ringCount = 0
    const ringsX = new Float32Array(MAX_RINGS)
    const ringsY = new Float32Array(MAX_RINGS)
    const ringsRadius = new Float32Array(MAX_RINGS)
    const ringsLife = new Float32Array(MAX_RINGS)

    let frame = 0
    let rafId
    let spawnAccum = 0

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
      particlesX[i] = x
      particlesY[i] = y
      particlesVX[i] = Math.cos(angle) * speed
      particlesVY[i] = Math.sin(angle) * speed
      particlesLife[i] = 1
      particlesDecay[i] = Math.random() * 0.025 + 0.02
      particlesSize[i] = Math.random() * 2.5 + 1
      particlesColor[i] = Math.floor(Math.random() * COLORS.length)
    }

    const addRing = (x, y) => {
      if (ringCount >= MAX_RINGS) return
      const i = ringCount++
      ringsX[i] = x
      ringsY[i] = y
      ringsRadius[i] = 5
      ringsLife[i] = 1
    }

    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const onClick = (e) => {
      addRing(e.clientX, e.clientY)
      for (let i = 0; i < 10; i++) addParticle(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('click', onClick, true)

    const draw = () => {
      rafId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Cursor follows mouse directly — no lag
      cursor.x += (mouse.x - cursor.x) * 0.45
      cursor.y += (mouse.y - cursor.y) * 0.45

      // Spawn particles based on movement distance (not every mousemove)
      const dx = mouse.x - cursor.x
      const dy = mouse.y - cursor.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      spawnAccum += dist * 0.15
      while (spawnAccum >= 1 && particleCount < MAX_PARTICLES) {
        addParticle(
          cursor.x + (Math.random() - 0.5) * 4,
          cursor.y + (Math.random() - 0.5) * 4
        )
        spawnAccum--
      }
      spawnAccum = Math.min(spawnAccum, 3)

      // --- Particles (no shadowBlur — use additive style instead) ---
      let writeIdx = 0
      for (let i = 0; i < particleCount; i++) {
        particlesX[i] += particlesVX[i]
        particlesY[i] += particlesVY[i]
        particlesLife[i] -= particlesDecay[i]
        if (particlesLife[i] <= 0) continue
        // Compact: copy live particle to writeIdx
        if (writeIdx !== i) {
          particlesX[writeIdx] = particlesX[i]
          particlesY[writeIdx] = particlesY[i]
          particlesVX[writeIdx] = particlesVX[i]
          particlesVY[writeIdx] = particlesVY[i]
          particlesLife[writeIdx] = particlesLife[i]
          particlesDecay[writeIdx] = particlesDecay[i]
          particlesSize[writeIdx] = particlesSize[i]
          particlesColor[writeIdx] = particlesColor[i]
        }
        const life = particlesLife[writeIdx]
        const radius = particlesSize[writeIdx] * life
        ctx.globalAlpha = life * 0.7
        ctx.fillStyle = COLORS[particlesColor[writeIdx]]
        ctx.beginPath()
        ctx.arc(particlesX[writeIdx], particlesY[writeIdx], radius, 0, Math.PI * 2)
        ctx.fill()
        // Soft glow — just a larger, transparent circle (way cheaper than shadowBlur)
        ctx.globalAlpha = life * 0.15
        ctx.beginPath()
        ctx.arc(particlesX[writeIdx], particlesY[writeIdx], radius * 3, 0, Math.PI * 2)
        ctx.fill()
        writeIdx++
      }
      particleCount = writeIdx

      // --- Click rings (minimal shadowBlur, only on rings) ---
      writeIdx = 0
      for (let i = 0; i < ringCount; i++) {
        ringsRadius[i] += 3.5
        ringsLife[i] -= 0.03
        if (ringsLife[i] <= 0) continue
        if (writeIdx !== i) {
          ringsX[writeIdx] = ringsX[i]
          ringsY[writeIdx] = ringsY[i]
          ringsRadius[writeIdx] = ringsRadius[i]
          ringsLife[writeIdx] = ringsLife[i]
        }
        const life = ringsLife[writeIdx]
        ctx.globalAlpha = life * 0.5
        ctx.strokeStyle = '#c44dff'
        ctx.shadowColor = '#c44dff'
        ctx.shadowBlur = 10
        ctx.lineWidth = 2 * life
        ctx.beginPath()
        ctx.arc(ringsX[writeIdx], ringsY[writeIdx], ringsRadius[writeIdx], 0, Math.PI * 2)
        ctx.stroke()
        ctx.strokeStyle = '#4d9fff'
        ctx.shadowColor = '#4d9fff'
        ctx.lineWidth = 1 * life
        ctx.beginPath()
        ctx.arc(ringsX[writeIdx], ringsY[writeIdx], ringsRadius[writeIdx] * 0.6, 0, Math.PI * 2)
        ctx.stroke()
        writeIdx++
      }
      ringCount = writeIdx
      ctx.shadowBlur = 0

      // --- Crosshair ---
      const cx = cursor.x
      const cy = cursor.y
      const size = 18
      const gap = 6
      const rot = frame * 0.02

      ctx.save()
      ctx.translate(cx, cy)

      // Outer arcs
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = '#c44dff'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, size + 4, rot, rot + Math.PI * 1.2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, size + 4, rot + Math.PI, rot + Math.PI * 2.2)
      ctx.stroke()

      // Crosshair lines
      ctx.globalAlpha = 0.85
      ctx.strokeStyle = '#4d9fff'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, -size); ctx.lineTo(0, -gap)
      ctx.moveTo(0, gap); ctx.lineTo(0, size)
      ctx.moveTo(-size, 0); ctx.lineTo(-gap, 0)
      ctx.moveTo(gap, 0); ctx.lineTo(size, 0)
      ctx.stroke()

      // Center dot with cheap glow
      ctx.globalAlpha = 1
      ctx.fillStyle = '#ff6b9d'
      ctx.beginPath()
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 0.2
      ctx.beginPath()
      ctx.arc(0, 0, 8, 0, Math.PI * 2)
      ctx.fill()

      // Corner brackets
      ctx.globalAlpha = 0.5
      ctx.strokeStyle = '#4dffb8'
      ctx.lineWidth = 1
      const b = 6
      const o = size - 2
      ctx.rotate(rot * 0.5)
      ctx.beginPath()
      ctx.moveTo(-o, -o + b); ctx.lineTo(-o, -o); ctx.lineTo(-o + b, -o)
      ctx.moveTo(o - b, -o); ctx.lineTo(o, -o); ctx.lineTo(o, -o + b)
      ctx.moveTo(-o, o - b); ctx.lineTo(-o, o); ctx.lineTo(-o + b, o)
      ctx.moveTo(o - b, o); ctx.lineTo(o, o); ctx.lineTo(o, o - b)
      ctx.stroke()

      ctx.restore()
      ctx.globalAlpha = 1
    }

    draw()

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
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  )
}
