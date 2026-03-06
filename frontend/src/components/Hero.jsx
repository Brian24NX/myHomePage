import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiChevronDown } from 'react-icons/fi'

const roles = [
  'Software Engineer',
  'Full-Stack Developer',
  'Problem Solver',
  'Open Source Enthusiast',
]

function useTypewriter(words, typeSpeed = 80, deleteSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const tick = useCallback(() => {
    const currentWord = words[wordIndex]
    if (!isDeleting) {
      setText(currentWord.substring(0, text.length + 1))
      if (text.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), pauseTime)
        return
      }
    } else {
      setText(currentWord.substring(0, text.length - 1))
      if (text.length === 0) {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
        return
      }
    }
  }, [text, wordIndex, isDeleting, words, pauseTime])

  useEffect(() => {
    const speed = isDeleting ? deleteSpeed : typeSpeed
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting, typeSpeed, deleteSpeed])

  return text
}

// Canvas-based constellation particle network
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()

    const PARTICLE_COUNT = 80
    const CONNECTION_DIST = 150
    const MOUSE_DIST = 200

    if (particlesRef.current.length === 0) {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particlesRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
        })
      }
    }

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    canvas.addEventListener('mousemove', handleMouse)
    canvas.addEventListener('mouseleave', handleLeave)
    window.addEventListener('resize', resize)

    let animId
    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update and draw particles
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST && dist > 0) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Dampen velocity
        p.vx *= 0.999
        p.vy *= 0.999

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(196, 77, 255, ${0.3 + p.size * 0.15})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(196, 77, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Mouse connections
      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_DIST) {
          const opacity = (1 - dist / MOUSE_DIST) * 0.3
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(77, 159, 255, ${opacity})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('mouseleave', handleLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

// Floating code terminal
function FloatingTerminal() {
  const lines = [
    { type: 'comment', text: '// Building something amazing' },
    { type: 'keyword', text: 'const ', after: 'developer', afterType: 'variable', rest: ' = {' },
    { type: 'property', text: '  name: ', value: "'Brian'" },
    { type: 'property', text: '  stack: ', value: "['React', 'Java', 'AWS']" },
    { type: 'property', text: '  passion: ', value: "'Clean Code'" },
    { type: 'plain', text: '}' },
    { type: 'empty', text: '' },
    { type: 'keyword', text: 'developer', afterType: 'method', after: '.build', rest: '(' },
    { type: 'string', text: "  'incredible things'" },
    { type: 'plain', text: ')' },
  ]

  return (
    <motion.div
      className="floating-terminal"
      initial={{ opacity: 0, y: 40, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
    >
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="terminal-title">main.js</span>
      </div>
      <div className="terminal-body">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="terminal-line"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 + i * 0.1, duration: 0.3 }}
          >
            <span className="line-number">{i + 1}</span>
            {line.type === 'comment' && <span className="code-comment">{line.text}</span>}
            {line.type === 'keyword' && (
              <>
                <span className="code-keyword">{line.text}</span>
                {line.after && <span className={`code-${line.afterType}`}>{line.after}</span>}
                {line.rest && <span className="code-plain">{line.rest}</span>}
              </>
            )}
            {line.type === 'property' && (
              <>
                <span className="code-property">{line.text}</span>
                <span className="code-string">{line.value}</span>
                <span className="code-plain">,</span>
              </>
            )}
            {line.type === 'string' && <span className="code-string">{line.text}</span>}
            {line.type === 'plain' && <span className="code-plain">{line.text}</span>}
            {line.type === 'empty' && <span>&nbsp;</span>}
          </motion.div>
        ))}
        <motion.div
          className="terminal-cursor-line"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <span className="line-number">{lines.length + 1}</span>
          <span className="terminal-block-cursor" />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Staggered letter animation
const nameLetters = 'Brian'.split('')

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
}

function Hero() {
  const typewriterText = useTypewriter(roles)
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      })
    }
    const el = heroRef.current
    if (el) el.addEventListener('mousemove', handleMouse)
    return () => { if (el) el.removeEventListener('mousemove', handleMouse) }
  }, [])

  return (
    <section
      className="hero"
      ref={heroRef}
      style={{
        '--mx': mousePos.x,
        '--my': mousePos.y,
      }}
    >
      <ParticleCanvas />

      {/* Grid overlay */}
      <div className="hero-grid-overlay" />

      {/* Gradient orbs that follow mouse subtly */}
      <div className="hero-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      {/* Mouse spotlight */}
      <div className="hero-spotlight" />

      {/* Animated accent lines */}
      <div className="hero-lines">
        <div className="accent-line accent-line-1" />
        <div className="accent-line accent-line-2" />
      </div>

      <div className="hero-main">
        <div className="hero-content">
          {/* Status badge */}
          <motion.div
            className="hero-status"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="status-dot" />
            Available for opportunities
          </motion.div>

          <motion.p
            className="hero-greeting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Hey there, I'm
          </motion.p>

          {/* Staggered letter animation for name */}
          <h1 className="hero-name">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                className="hero-letter"
                custom={i}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              className="hero-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4, type: 'spring' }}
            >
              .
            </motion.span>
          </h1>

          <motion.div
            className="hero-role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="role-bracket">&lt;</span>
            <span className="typewriter">{typewriterText}</span>
            <span className="cursor">|</span>
            <span className="role-bracket">/&gt;</span>
          </motion.div>

          <motion.p
            className="hero-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            I craft beautiful, high-performance web experiences with modern
            technologies and clean architecture.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <a href="#projects" className="hero-cta hero-cta-primary">
              <span>View My Work</span>
              <span className="cta-arrow">→</span>
            </a>
            <a href="#contact" className="hero-cta hero-cta-outline">
              Get In Touch
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <a href="https://github.com/Brian24NX" target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <FiGithub />
            </a>
            <a href="https://www.linkedin.com/in/brian-zhou-b869251a8/" target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <FiLinkedin />
            </a>
            <a href="mailto:nanxiangzhou@gmail.com" className="hero-social-link">
              <FiMail />
            </a>
          </motion.div>
        </div>

        {/* Floating terminal */}
        <FloatingTerminal />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <span className="scroll-text">scroll</span>
        <FiChevronDown className="scroll-chevron" />
      </motion.div>
    </section>
  )
}

export default Hero
