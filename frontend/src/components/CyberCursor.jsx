import { useEffect, useRef, useCallback } from 'react'

export default function CyberCursor() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const smoothMouse = useRef({ x: -100, y: -100 })
  const particles = useRef([])
  const rings = useRef([])
  const rafId = useRef(null)
  const isTouchDevice = useRef(false)

  const COLORS = ['#ff6b9d', '#c44dff', '#4d9fff', '#4dffb8', '#ffd84d']

  const spawnParticle = useCallback((x, y) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 1.5 + 0.5
    particles.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: Math.random() * 0.02 + 0.015,
      size: Math.random() * 2.5 + 1,
      color,
    })
  }, [])

  const spawnRing = useCallback((x, y) => {
    rings.current.push({ x, y, radius: 5, life: 1, decay: 0.03 })
  }, [])

  useEffect(() => {
    // Detect touch device
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice.current) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

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

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      // Spawn trail particles
      for (let i = 0; i < 2; i++) {
        spawnParticle(e.clientX, e.clientY)
      }
    }

    const onClick = (e) => {
      spawnRing(e.clientX, e.clientY)
      for (let i = 0; i < 12; i++) {
        spawnParticle(e.clientX, e.clientY)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('click', onClick, true)

    let frame = 0

    const draw = () => {
      rafId.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      // Smooth follow
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.15
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.15

      const sx = smoothMouse.current.x
      const sy = smoothMouse.current.y

      // --- Draw particles ---
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) {
          particles.current.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.life * 0.6
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // --- Draw click rings ---
      for (let i = rings.current.length - 1; i >= 0; i--) {
        const r = rings.current[i]
        r.radius += 3
        r.life -= r.decay
        if (r.life <= 0) {
          rings.current.splice(i, 1)
          continue
        }
        ctx.globalAlpha = r.life * 0.5
        ctx.strokeStyle = '#c44dff'
        ctx.shadowColor = '#c44dff'
        ctx.shadowBlur = 15
        ctx.lineWidth = 2 * r.life
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Inner ring
        ctx.strokeStyle = '#4d9fff'
        ctx.shadowColor = '#4d9fff'
        ctx.lineWidth = 1 * r.life
        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.shadowBlur = 0

      // --- Draw crosshair cursor ---
      const size = 18
      const gap = 6
      const rotation = frame * 0.02

      ctx.save()
      ctx.translate(sx, sy)

      // Outer rotating ring
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = '#c44dff'
      ctx.shadowColor = '#c44dff'
      ctx.shadowBlur = 12
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(0, 0, size + 4, rotation, rotation + Math.PI * 1.2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(0, 0, size + 4, rotation + Math.PI, rotation + Math.PI * 2.2)
      ctx.stroke()

      // Crosshair lines
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = '#4d9fff'
      ctx.shadowColor = '#4d9fff'
      ctx.shadowBlur = 10
      ctx.lineWidth = 1.5

      // Top
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.lineTo(0, -gap)
      ctx.stroke()
      // Bottom
      ctx.beginPath()
      ctx.moveTo(0, gap)
      ctx.lineTo(0, size)
      ctx.stroke()
      // Left
      ctx.beginPath()
      ctx.moveTo(-size, 0)
      ctx.lineTo(-gap, 0)
      ctx.stroke()
      // Right
      ctx.beginPath()
      ctx.moveTo(gap, 0)
      ctx.lineTo(size, 0)
      ctx.stroke()

      // Center dot
      ctx.globalAlpha = 1
      ctx.fillStyle = '#ff6b9d'
      ctx.shadowColor = '#ff6b9d'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Corner brackets (rotating)
      ctx.globalAlpha = 0.5
      ctx.strokeStyle = '#4dffb8'
      ctx.shadowColor = '#4dffb8'
      ctx.shadowBlur = 8
      ctx.lineWidth = 1
      const bSize = 6
      const bOffset = size - 2

      ctx.rotate(rotation * 0.5)
      // Top-left bracket
      ctx.beginPath()
      ctx.moveTo(-bOffset, -bOffset + bSize)
      ctx.lineTo(-bOffset, -bOffset)
      ctx.lineTo(-bOffset + bSize, -bOffset)
      ctx.stroke()
      // Top-right bracket
      ctx.beginPath()
      ctx.moveTo(bOffset - bSize, -bOffset)
      ctx.lineTo(bOffset, -bOffset)
      ctx.lineTo(bOffset, -bOffset + bSize)
      ctx.stroke()
      // Bottom-left bracket
      ctx.beginPath()
      ctx.moveTo(-bOffset, bOffset - bSize)
      ctx.lineTo(-bOffset, bOffset)
      ctx.lineTo(-bOffset + bSize, bOffset)
      ctx.stroke()
      // Bottom-right bracket
      ctx.beginPath()
      ctx.moveTo(bOffset - bSize, bOffset)
      ctx.lineTo(bOffset, bOffset)
      ctx.lineTo(bOffset, bOffset - bSize)
      ctx.stroke()

      ctx.restore()
      ctx.globalAlpha = 1
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onClick, true)
      cancelAnimationFrame(rafId.current)
      document.body.style.cursor = ''
      styleEl.remove()
    }
  }, [spawnParticle, spawnRing])

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
