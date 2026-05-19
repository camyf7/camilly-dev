'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Floating Browser Card Component (inspired by tamalsen.dev phone) ──────────
function FloatingBrowserCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 150,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), {
    stiffness: 150,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  // Projeto cards que rotacionam
  const projects = [
    {
      name: 'EchoMusic',
      type: 'React · REST API',
      color: '#a855f7',
      accent: '#7c3aed',
      icon: '♪',
      desc: 'Plataforma musical imersiva',
      dots: ['#a855f7', '#7c3aed', '#6d28d9'],
    },
    {
      name: 'Portfólio',
      type: 'Next.js · TypeScript',
      color: '#06b6d4',
      accent: '#0891b2',
      icon: '✦',
      desc: 'Identidade visual própria',
      dots: ['#ef4444', '#f59e0b', '#22c55e'],
    },
    {
      name: 'Mar em Alerta',
      type: 'HTML · CSS3',
      color: '#10b981',
      accent: '#059669',
      icon: '⟡',
      desc: 'Alertas visuais costeiros',
      dots: ['#10b981', '#059669', '#047857'],
    },
  ]

  const [currentProject, setCurrentProject] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject(prev => (prev + 1) % projects.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const project = projects[currentProject]

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      initial={{ opacity: 0, x: 120, rotateY: -20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      transition={{ duration: 1.2, delay: 1, ease: [0.23, 1, 0.32, 1] }}
      className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block hero-parallax cursor-none"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Browser chrome */}
        <div
          style={{
            width: '340px',
            background: 'rgba(10, 10, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.04),
              0 40px 80px rgba(0,0,0,0.6),
              0 0 80px ${project.color}18,
              inset 0 1px 0 rgba(255,255,255,0.06)
            `,
            overflow: 'hidden',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Browser top bar */}
          <div
            style={{
              background: 'rgba(15, 15, 25, 0.9)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              {project.dots.map((dot, i) => (
                <motion.div
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: dot,
                    boxShadow: `0 0 8px ${dot}80`,
                  }}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                />
              ))}
            </div>

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'monospace',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <motion.span
                key={currentProject}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                camilly.dev/{project.name.toLowerCase()}
              </motion.span>
            </div>
          </div>

          {/* Browser content */}
          <div style={{ padding: '20px' }}>
            {/* Header with animated accent */}
            <motion.div
              style={{
                height: '4px',
                borderRadius: '2px',
                background: `linear-gradient(90deg, ${project.color}, ${project.accent})`,
                marginBottom: '16px',
                boxShadow: `0 0 16px ${project.color}60`,
              }}
              key={`bar-${currentProject}`}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />

            {/* Project icon */}
            <motion.div
              key={`icon-${currentProject}`}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${project.color}18`,
                border: `1px solid ${project.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                marginBottom: '14px',
              }}
            >
              {project.icon}
            </motion.div>

            {/* Project title */}
            <motion.div
              key={`title-${currentProject}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '4px',
                  letterSpacing: '-0.02em',
                }}
              >
                {project.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: project.color,
                  fontFamily: 'monospace',
                  marginBottom: '8px',
                }}
              >
                {project.type}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: '1.5',
                }}
              >
                {project.desc}
              </div>
            </motion.div>

            {/* Code snippet */}
            <motion.div
              key={`code-${currentProject}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                marginTop: '16px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '11px',
                lineHeight: '1.7',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{ color: '#6366f1' }}>const</span>{' '}
              <span style={{ color: project.color }}>{project.name.toLowerCase()}</span>{' '}
              <span style={{ color: '#fff' }}>=</span>{' '}
              <span style={{ color: '#94a3b8' }}>{'{'}</span>
              <br />
              <span style={{ paddingLeft: '12px', color: '#94a3b8' }}>
                {'  '}stack:{' '}
                <span style={{ color: '#86efac' }}>
                  &quot;{project.type}&quot;
                </span>
                ,
              </span>
              <br />
              <span style={{ paddingLeft: '12px', color: '#94a3b8' }}>
                {'  '}love:{' '}
                <span style={{ color: '#86efac' }}>&quot;UI/UX&quot;</span>,
              </span>
              <br />
              <span style={{ color: '#94a3b8' }}>{'}'}</span>
            </motion.div>

            {/* Progress dots */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                marginTop: '16px',
                justifyContent: 'center',
              }}
            >
              {projects.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => setCurrentProject(i)}
                  animate={{
                    width: i === currentProject ? '20px' : '6px',
                    background:
                      i === currentProject
                        ? project.color
                        : 'rgba(255,255,255,0.2)',
                  }}
                  transition={{ duration: 0.3 }}
                  className="rounded-full"
                  style={{ height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Reflection shadow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '10%',
            right: '10%',
            height: '40px',
            background: `radial-gradient(ellipse at center, ${project.color}30 0%, transparent 70%)`,
            filter: 'blur(10px)',
            transform: 'scaleY(0.4)',
          }}
        />
      </motion.div>
    </motion.div>
  )
}

// ── Particle System ────────────────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)

    const count = 60
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 270 : 190, // purple or cyan
    }))

    let mouseX = -9999
    let mouseY = -9999
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      particles.forEach(p => {
        // Soft mouse repulsion
        const dx = p.x - mouseX
        const dy = p.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx += (dx / dist) * force * 0.5
          p.vy += (dy / dist) * force * 0.5
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.alpha})`
        ctx.fill()
      })

      // Connect nearby particles
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `hsla(270, 70%, 70%, ${(1 - dist / 100) * 0.08})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}

// ── Magnetic CTA Button ────────────────────────────────────────────────────────
function MagneticButton({
  children,
  href,
  variant = 'primary',
  onClick,
}: {
  children: React.ReactNode
  href: string
  variant?: 'primary' | 'outline'
  onClick?: (e: React.MouseEvent) => void
}) {
  const btnRef = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMove = (e: React.MouseEvent) => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.3)
    y.set((e.clientY - cy) * 0.3)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
  ref={btnRef}
  href={href}
  onClick={onClick}
  onMouseMove={handleMove}
  onMouseLeave={handleLeave}
  style={{
    x: springX,
    y: springY,
    ...(variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)',
          color: '#fff',
        }
      : {}),
  }}
  whileHover={{ scale: 1.06 }}
  whileTap={{ scale: 0.94 }}
  className={
    variant === 'primary'
      ? 'group relative px-8 py-4 rounded-full font-semibold overflow-hidden inline-flex items-center gap-2 text-sm tracking-wide'
      : 'group px-8 py-4 border border-white/10 hover:border-primary/40 rounded-full font-semibold transition-colors inline-flex items-center gap-2 text-sm tracking-wide hover:bg-primary/5 text-foreground'
  }
>
      {variant === 'primary' && (
        <>
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10 flex items-center gap-2">{children}</span>
        </>
      )}
      {variant === 'outline' && children}
    </motion.a>
  )
}

// ── Typewriter Role ────────────────────────────────────────────────────────────
function TypewriterRole() {
  const roles = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'React & Next.js Dev',
    'Animation Lover',
    'Design Systems Nerd',
  ]
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const target = roles[roleIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (typing) {
      if (displayed.length < target.length) {
        timeout = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          60,
        )
      } else {
        timeout = setTimeout(() => setTyping(false), 1800)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          35,
        )
      } else {
        setRoleIdx(i => (i + 1) % roles.length)
        setTyping(true)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayed, typing, roleIdx])

  return (
    <span className="text-primary font-mono">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-5 bg-primary ml-0.5 align-middle"
      />
    </span>
  )
}

// ── Stat Chip ──────────────────────────────────────────────────────────────────
function StatChip({
  label,
  value,
  delay,
}: {
  label: string
  value: string
  delay: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-xl px-5 py-3 border border-white/5"
    >
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </motion.div>
  )
}

// ── Main Hero ──────────────────────────────────────────────────────────────────
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 260])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-parallax', {
        y: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      gsap.to('.hero-fade', {
        y: -130,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Letter animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.5,
      },
    },
  }

  const letterVariants = {
  hidden: {
    opacity: 0,
    y: 100,
    rotateX: -80,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
    },
  },
}

  const firstName = 'Camilly'
  const lastName = 'Ferreira'

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Particle field */}
      <ParticleField />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <motion.div
          className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl hero-parallax"
          style={{
            background:
              'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Secondary orb */}
        <motion.div
          className="absolute bottom-1/4 -right-56 w-[600px] h-[600px] rounded-full hero-parallax"
          style={{
            background:
              'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto hero-fade">

          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 inline-flex"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-xs font-mono tracking-widest uppercase"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <motion.span
                className="w-1.5 h-1.5 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-muted-foreground">disponível para projetos</span>
            </div>
          </motion.div>

          {/* Name */}
          <h1
            ref={titleRef}
            className="mb-6"
            style={{ perspective: '800px' }}
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap overflow-hidden"
            >
              {firstName.split('').map((letter, i) => (
                <motion.span
                  key={`first-${i}`}
                  variants={letterVariants}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter text-foreground inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap overflow-hidden"
            >
              {lastName.split('').map((letter, i) => (
                <motion.span
                  key={`last-${i}`}
                  variants={letterVariants}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[100px] font-black tracking-tighter inline-block"
                  style={{
                    perspective: '1000px',
                    color: '#a855f7',
                  }}
                >
                  {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
              ))}
            </motion.div>
          </h1>

          {/* Typewriter role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mb-6 text-lg md:text-xl font-mono"
          >
            <span className="text-muted-foreground">{'> '}</span>
            <TypewriterRole />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10"
          >
            Construindo interfaces onde cada detalhe visual faz diferença.
            Apaixonada por{' '}
            <span className="text-foreground font-medium">animações</span>,{' '}
            <span className="text-foreground font-medium">design systems</span>{' '}
            e código que vira experiência.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <MagneticButton
              href="#projects"
              variant="primary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Ver Projetos
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </motion.svg>
            </MagneticButton>

            <MagneticButton
              href="#contact"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Entrar em contato
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="flex flex-wrap gap-3"
          >
            <StatChip label="Projetos entregues" value="21+" delay={2.0} />
            <StatChip label="Stack principal" value="React · Next · TS" delay={2.1} />
            <StatChip label="Foco atual" value="Animações & A11y" delay={2.2} />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Browser Card */}
      <FloatingBrowserCard />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}