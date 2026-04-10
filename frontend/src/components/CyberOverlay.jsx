import { useEffect, useRef, useState } from 'react'
import './CyberOverlay.css'

// Fake data streams for the side tickers
const DATA_LINES = [
  'SYS.CORE::ONLINE',
  'MEM: 94.2% ALLOC',
  'NET.PING: 12ms',
  'ENCRYPT: AES-256',
  'UPLINK: STABLE',
  'NODE: 7/7 ACTIVE',
  'THREAT.LVL: NONE',
  'FIREWALL: ACTIVE',
  'PROXY: ROTATING',
  'LATENCY: 0.03ms',
  'PACKETS: 1.2M/s',
  'CPU.TEMP: 42\u00b0C',
  'BANDWIDTH: 10Gb',
  'AUTH: VERIFIED',
  'SHELL: /bin/zsh',
  'PID: 31337',
  'SIGNAL: 99.7%',
  'CACHE.HIT: 98.1%',
  'QUEUE: 0 PENDING',
  'DISK.IO: 2.4GB/s',
]

function HexGrid() {
  // Generate hexagon positions for SVG pattern
  const hexagons = []
  for (let row = 0; row < 30; row++) {
    for (let col = 0; col < 3; col++) {
      const x = col * 28 + (row % 2) * 14
      const y = row * 24
      const opacity = Math.random() * 0.12 + 0.02
      const delay = Math.random() * 8
      hexagons.push({ x, y, opacity, delay, key: `${row}-${col}` })
    }
  }

  return (
    <svg className="cyber-hex-grid" viewBox="0 0 84 720" preserveAspectRatio="none">
      {hexagons.map(({ x, y, opacity, delay, key }) => (
        <polygon
          key={key}
          points={hexPoints(x, y, 10)}
          fill="none"
          stroke="var(--purple)"
          strokeWidth="0.5"
          opacity={opacity}
          style={{ animationDelay: `${delay}s` }}
          className="hex-cell"
        />
      ))}
    </svg>
  )
}

function hexPoints(cx, cy, r) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

function DataTicker({ side }) {
  const lines = side === 'left' ? DATA_LINES.slice(0, 10) : DATA_LINES.slice(10, 20)

  return (
    <div className={`cyber-ticker cyber-ticker-${side}`}>
      <div className="cyber-ticker-scroll">
        {lines.concat(lines).map((line, i) => (
          <div key={i} className="cyber-ticker-line">
            <span className="ticker-marker">&gt;</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}

function SideRail({ side }) {
  return (
    <div className={`cyber-rail cyber-rail-${side}`}>
      <div className="rail-line" />
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="rail-node"
          style={{
            top: `${8 + i * 12}%`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}

function CornerBrackets() {
  return (
    <>
      <div className="cyber-corner cyber-corner-tl" />
      <div className="cyber-corner cyber-corner-tr" />
      <div className="cyber-corner cyber-corner-bl" />
      <div className="cyber-corner cyber-corner-br" />
    </>
  )
}

export default function CyberOverlay() {
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        rafRef.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Add corner brackets to sections via DOM after mount
  useEffect(() => {
    const sections = document.querySelectorAll('.section')
    sections.forEach((section) => {
      if (!section.querySelector('.cyber-frame')) {
        section.style.position = 'relative'
        const frame = document.createElement('div')
        frame.className = 'cyber-frame'
        frame.innerHTML = `
          <div class="cyber-frame-corner cyber-frame-tl"></div>
          <div class="cyber-frame-corner cyber-frame-tr"></div>
          <div class="cyber-frame-corner cyber-frame-bl"></div>
          <div class="cyber-frame-corner cyber-frame-br"></div>
          <div class="cyber-frame-line cyber-frame-line-top"></div>
          <div class="cyber-frame-line cyber-frame-line-bottom"></div>
        `
        section.appendChild(frame)
      }
    })
  }, [])

  return (
    <div className="cyber-overlay" aria-hidden="true">
      {/* Scan lines */}
      <div className="cyber-scanlines" />

      {/* Background grid */}
      <div className="cyber-grid-bg" />

      {/* Side rails */}
      <SideRail side="left" />
      <SideRail side="right" />

      {/* Hex grids on margins */}
      <div className="cyber-hex-left">
        <HexGrid />
      </div>
      <div className="cyber-hex-right">
        <HexGrid />
      </div>

      {/* Data tickers */}
      <DataTicker side="left" />
      <DataTicker side="right" />

      {/* Floating status indicators */}
      <div className="cyber-status-bar cyber-status-top">
        <span className="cyber-status-item">
          <span className="status-led" /> SYS.ONLINE
        </span>
        <span className="cyber-status-item">
          SCROLL: {String(Math.round(scrollY)).padStart(5, '0')}px
        </span>
        <span className="cyber-status-item">
          RES: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : ''}
        </span>
      </div>

      {/* Vertical text labels */}
      <div className="cyber-vertical-text cyber-vertical-left">INTERFACE.v2.077</div>
      <div className="cyber-vertical-text cyber-vertical-right">SEC.CLEARANCE::MAX</div>
    </div>
  )
}
