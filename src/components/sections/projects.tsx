'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Project {
  id: number
  index: string
  title: string
  shortDesc: string
  longDesc: string
  tags: string[]
  accent: string
  accentRgb: string
  github: string
  demo: string
  featured: boolean
  year: string
  role: string
  // mock screen lines for the fake code preview
  codeLines: { indent: number; width: number; color: string }[][]
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const CODE_COLORS = {
  purple: '#a855f7',
  pink:   '#ec4899',
  blue:   '#818cf8',
  cyan:   '#06b6d4',
  green:  '#34d399',
  orange: '#fb923c',
}

const projects: Project[] = [
  {
    id: 1,
    index: '01',
    title: 'Sol e Neve',
    shortDesc: 'Identidade digital para sorveteria artesanal',
    longDesc:
      'Uma experiência web imersiva que captura a essência de uma sorveteria artesanal em Caraguatatuba. Animações suaves, galeria de sabores interativa e história da marca mineira no litoral paulista — tudo em Next.js + TypeScript.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    accent: '#06b6d4',
    accentRgb: '6,182,212',
    github: 'https://github.com/camyf7',
    demo: 'https://soleneve.netlify.app/',
    featured: true,
    year: '2026',
    role: 'Front-end Developer',
    codeLines: [
      [
        { indent: 0,  width: 62, color: CODE_COLORS.purple },
        { indent: 14, width: 44, color: CODE_COLORS.blue },
        { indent: 28, width: 78, color: CODE_COLORS.cyan },
      ],
      [
        { indent: 0,  width: 38, color: CODE_COLORS.pink },
        { indent: 14, width: 56, color: CODE_COLORS.purple },
        { indent: 28, width: 42, color: CODE_COLORS.blue },
        { indent: 14, width: 88, color: CODE_COLORS.cyan },
      ],
      [
        { indent: 0,  width: 28, color: CODE_COLORS.green },
        { indent: 14, width: 64, color: CODE_COLORS.orange },
        { indent: 28, width: 48, color: CODE_COLORS.purple },
      ],
    ],
  },
  {
    id: 2,
    index: '02',
    title: 'EchoMusic',
    shortDesc: 'Rede social para amantes de música',
    longDesc:
      'Plataforma social com comunidades temáticas, chat em tempo real usando Firebase, sistema completo de autenticação e CRUD. Interface responsiva e imersiva inspirada em players modernos.',
    tags: ['JavaScript', 'CSS', 'Firebase'],
    accent: '#a855f7',
    accentRgb: '168,85,247',
    github: 'https://github.com/camyf7',
    demo: 'https://camyf7.github.io/echomusic/',
    featured: true,
    year: '2025',
    role: 'Full-stack Developer',
    codeLines: [
      [
        { indent: 0,  width: 74, color: CODE_COLORS.purple },
        { indent: 14, width: 52, color: CODE_COLORS.pink },
        { indent: 28, width: 86, color: CODE_COLORS.blue },
      ],
      [
        { indent: 0,  width: 44, color: CODE_COLORS.cyan },
        { indent: 14, width: 68, color: CODE_COLORS.purple },
        { indent: 28, width: 38, color: CODE_COLORS.pink },
        { indent: 14, width: 76, color: CODE_COLORS.blue },
      ],
      [
        { indent: 0,  width: 56, color: CODE_COLORS.green },
        { indent: 14, width: 42, color: CODE_COLORS.purple },
        { indent: 28, width: 64, color: CODE_COLORS.cyan },
      ],
    ],
  },
  {
    id: 3,
    index: '03',
    title: 'Mar em Alerta',
    shortDesc: 'Monitoramento costeiro comunitário',
    longDesc:
      'Sistema de alertas visuais para eventos costeiros em Caraguatatuba. Interface informativa com foco em clareza, responsividade e acessibilidade — para informar e proteger a comunidade local sobre riscos do mar.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    accent: '#34d399',
    accentRgb: '52,211,153',
    github: 'https://github.com/camyf7',
    demo: 'https://camyf7.github.io/mar-em-alerta/',
    featured: false,
    year: '2025',
    role: 'Front-end Developer',
    codeLines: [
      [
        { indent: 0,  width: 58, color: CODE_COLORS.green },
        { indent: 14, width: 72, color: CODE_COLORS.cyan },
        { indent: 28, width: 46, color: CODE_COLORS.blue },
      ],
      [
        { indent: 0,  width: 34, color: CODE_COLORS.purple },
        { indent: 14, width: 84, color: CODE_COLORS.green },
        { indent: 28, width: 54, color: CODE_COLORS.cyan },
        { indent: 14, width: 40, color: CODE_COLORS.orange },
      ],
      [
        { indent: 0,  width: 66, color: CODE_COLORS.blue },
        { indent: 14, width: 48, color: CODE_COLORS.green },
        { indent: 28, width: 80, color: CODE_COLORS.purple },
      ],
    ],
  },
  {
    id: 4,
    index: '04',
    title: 'Kay Nunes Beauty',
    shortDesc: 'Site multilingue para salão de beleza',
    longDesc:
      'Website com agendamento online, galeria de trabalhos e suporte a múltiplos idiomas (PT/EN/AL). Interface elegante que reflete a identidade visual do salão especializado em tranças afro e nail art.',
    tags: ['JavaScript', 'HTML', 'CSS'],
    accent: '#ec4899',
    accentRgb: '236,72,153',
    github: 'https://github.com/camyf7',
    demo: 'https://kaynunes.netlify.app/',
    featured: false,
    year: '2026',
    role: 'Front-end Developer',
    codeLines: [
      [
        { indent: 0,  width: 80, color: CODE_COLORS.pink },
        { indent: 14, width: 46, color: CODE_COLORS.purple },
        { indent: 28, width: 68, color: CODE_COLORS.blue },
      ],
      [
        { indent: 0,  width: 52, color: CODE_COLORS.orange },
        { indent: 14, width: 76, color: CODE_COLORS.pink },
        { indent: 28, width: 36, color: CODE_COLORS.purple },
        { indent: 14, width: 60, color: CODE_COLORS.cyan },
      ],
      [
        { indent: 0,  width: 42, color: CODE_COLORS.blue },
        { indent: 14, width: 88, color: CODE_COLORS.pink },
        { indent: 28, width: 54, color: CODE_COLORS.green },
      ],
    ],
  },
]

// ─── MockScreen ────────────────────────────────────────────────────────────────
function MockScreen({
  project,
  isHovered,
}: {
  project: Project
  isHovered: boolean
}) {
  return (
    <motion.div
      animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.02 : 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="w-[88%] aspect-video rounded-xl overflow-hidden shadow-2xl"
      style={{
        background: 'rgba(7,6,26,0.95)',
        border: `1px solid rgba(${project.accentRgb},0.18)`,
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: `rgba(${project.accentRgb},0.1)`, background: 'rgba(0,0,0,0.4)' }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
        ))}
        <div className="flex-1 mx-3">
          <div
            className="h-[14px] rounded-full max-w-[140px]"
            style={{ background: `rgba(${project.accentRgb},0.08)` }}
          />
        </div>
        <div
          className="text-[8px] font-mono"
          style={{ color: `rgba(${project.accentRgb},0.35)` }}
        >
          {project.demo.replace('https://', '').split('/')[0]}
        </div>
      </div>

      {/* Code lines */}
      <div className="p-4 space-y-2.5">
        {project.codeLines.map((group, gi) => (
          <div key={gi} className="space-y-1.5">
            {group.map((line, li) => (
              <motion.div
                key={li}
                animate={{ width: isHovered ? `${line.width + 4}%` : `${line.width}%` }}
                transition={{ duration: 0.5, delay: li * 0.04, ease: [0.23, 1, 0.32, 1] }}
                className="h-[6px] rounded-full"
                style={{
                  marginLeft: `${line.indent}px`,
                  background: line.color,
                  opacity: 0.75,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[18px] flex items-center px-3 gap-3"
        style={{
          background: `rgba(${project.accentRgb},0.06)`,
          borderTop: `1px solid rgba(${project.accentRgb},0.08)`,
        }}
      >
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[5px] h-[5px] rounded-full flex-shrink-0"
          style={{ background: '#4ade80' }}
        />
        <span className="text-[7px] font-mono" style={{ color: `rgba(${project.accentRgb},0.4)` }}>
          {project.role}
        </span>
        <span className="text-[7px] font-mono ml-auto" style={{ color: `rgba(${project.accentRgb},0.25)` }}>
          {project.year}
        </span>
      </div>
    </motion.div>
  )
}

// ─── ProjectCard ───────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [isHovered, setIsHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const isEven = index % 2 === 0

  // Scroll parallax per card
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yA = useTransform(scrollYProgress, [0, 1], [80, -80])
  const yB = useTransform(scrollYProgress, [0, 1], [40, -40])
  const springYA = useSpring(yA, { stiffness: 60, damping: 20 })
  const springYB = useSpring(yB, { stiffness: 60, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  // GSAP per-card entrance
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <motion.article
      ref={ref}
      className={`grid lg:grid-cols-2 gap-10 lg:gap-20 xl:gap-28 items-center relative`}
    >
      {/* ── Giant index number (background) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.1 }}
        className="absolute pointer-events-none select-none font-bold font-mono"
        style={{
          fontSize: 'clamp(120px, 20vw, 220px)',
          lineHeight: 1,
          color: `rgba(${project.accentRgb},0.035)`,
          top: '50%',
          left: isEven ? '-2%' : 'auto',
          right: isEven ? 'auto' : '-2%',
          transform: 'translateY(-50%)',
          zIndex: 0,
          letterSpacing: '-0.06em',
        }}
      >
        {project.index}
      </motion.div>

      {/* ── Visual panel ── */}
      <motion.div
        style={{ y: isEven ? springYA : springYB }}
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${
          !isEven ? 'lg:order-2' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Base gradient */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, rgba(${project.accentRgb},0.12) 0%, rgba(7,6,26,0.95) 65%)`,
            border: `1px solid rgba(${project.accentRgb},0.1)`,
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `radial-gradient(rgba(${project.accentRgb},0.08) 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
          }}
        />

        {/* 3D tilt wrapper */}
        <motion.div
          animate={{
            rotateY: isHovered ? (mouse.x - 50) / 10 : 0,
            rotateX: isHovered ? -(mouse.y - 50) / 10 : 0,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <MockScreen project={project} isHovered={isHovered} />
        </motion.div>

        {/* Cursor spotlight */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(380px circle at ${mouse.x}% ${mouse.y}%, rgba(${project.accentRgb},0.1), transparent 55%)`,
          }}
        />

        {/* Top accent line */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl origin-left"
          style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
        />

        {/* Hover CTA overlay */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 18 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute bottom-5 left-5 right-5 flex gap-3 z-10"
        >
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3 flex items-center justify-center gap-2 rounded-full text-sm font-mono font-medium backdrop-blur-md transition-colors"
            style={{
              background: 'rgba(10,8,24,0.82)',
              border: `1px solid rgba(${project.accentRgb},0.22)`,
              color: `rgba(${project.accentRgb},0.9)`,
            }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </motion.a>
          <motion.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3 flex items-center justify-center gap-2 rounded-full text-sm font-mono font-medium transition-colors"
            style={{
              background: project.accent,
              color: '#0a0818',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Demo
          </motion.a>
        </motion.div>

        {/* Glow behind */}
        <motion.div
          animate={{ opacity: isHovered ? 0.18 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 -z-10 blur-2xl rounded-2xl"
          style={{ background: project.accent }}
        />
      </motion.div>

      {/* ── Text panel ── */}
      <motion.div
        style={{ y: isEven ? springYB : springYA }}
        className={`relative z-10 space-y-6 ${!isEven ? 'lg:order-1' : ''}`}
      >
        {/* Project index label */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -24 : 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <span
            className="text-xs tracking-widest uppercase font-mono"
            style={{ color: project.accent }}
          >
            Projeto {project.index}
          </span>
          <div
            className="h-[1px] w-10"
            style={{ background: `rgba(${project.accentRgb},0.3)` }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: `rgba(${project.accentRgb},0.45)` }}
          >
            {project.year}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: 'var(--foreground, #e6edf3)' }}
        >
          {project.title}
        </motion.h3>

        {/* Short desc */}
        <motion.p
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.3 }}
          className="text-sm font-mono tracking-wider"
          style={{ color: `rgba(${project.accentRgb},0.6)` }}
        >
          {project.shortDesc}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="origin-left h-[1px]"
          style={{ background: `rgba(${project.accentRgb},0.12)` }}
        />

        {/* Long desc */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.4 }}
          className="text-base leading-relaxed"
          style={{ color: 'rgba(200,200,220,0.6)' }}
        >
          {project.longDesc}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.48 }}
          className="flex flex-wrap gap-2"
        >
          {project.tags.map((tag, ti) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + ti * 0.07 }}
              whileHover={{ scale: 1.06, y: -2 }}
              className="px-3.5 py-1.5 text-xs font-mono rounded-full transition-colors"
              style={{
                background: `rgba(${project.accentRgb},0.07)`,
                border: `1px solid rgba(${project.accentRgb},0.18)`,
                color: project.accent,
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Role badge — mirrors IFSP badge from AboutSection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5"
          style={{
            background: 'rgba(14,12,30,0.85)',
            border: `1px solid rgba(${project.accentRgb},0.12)`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(${project.accentRgb},0.1)` }}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
              style={{ color: project.accent }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-[10px]" style={{ color: 'rgba(200,200,220,0.35)' }}>papel</p>
            <p className="text-xs font-medium" style={{ color: 'rgba(200,200,220,0.75)' }}>
              {project.role}
            </p>
          </div>
          <div
            className="ml-3 pl-3 border-l"
            style={{ borderColor: `rgba(${project.accentRgb},0.1)` }}
          >
            <p className="text-[10px]" style={{ color: 'rgba(200,200,220,0.35)' }}>ano</p>
            <p className="text-xs font-mono font-medium" style={{ color: project.accent }}>{project.year}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  )
}

// ─── ProjectsSection ───────────────────────────────────────────────────────────
export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.06 })
  const [filter, setFilter] = useState<'all' | 'featured'>('all')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  const filteredProjects = filter === 'featured'
    ? projects.filter((p) => p.featured)
    : projects

  // GSAP header entrance — same pattern as AboutSection / SkillsSection
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.projects-header-item',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      className="py-16 sm:py-24 md:py-32 lg:py-48 relative overflow-hidden"
    >
      {/* ── Background — same orb pattern as About & Skills ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[550px] md:w-[800px] h-[300px] sm:h-[550px] md:h-[800px] rounded-full blur-3xl"
          style={{ background: 'rgba(6,182,212,0.04)', y: bgY }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.38, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[250px] sm:w-[400px] md:w-[520px] h-[250px] sm:h-[400px] md:h-[520px] rounded-full blur-3xl"
          style={{ background: 'rgba(168,85,247,0.04)' }}
          animate={{ x: [0, -40, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(168,85,247,0.05) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20 sm:mb-24 md:mb-32">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="projects-header-item text-xs sm:text-sm text-primary tracking-widest uppercase font-mono mb-3 sm:mb-4 block"
            >
              03 / Projetos
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="projects-header-item text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
            >
              Trabalhos{' '}
              <span className="text-gradient">selecionados</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="projects-header-item text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Uma seleção de projetos que demonstram minha paixão por criar
              experiências web excepcionais — onde cada detalhe visual faz diferença.
            </motion.p>
          </div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="flex gap-2 flex-shrink-0"
          >
            {(['all', 'featured'] as const).map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative px-5 py-2.5 rounded-full text-sm font-mono font-medium transition-all overflow-hidden"
                style={
                  filter === f
                    ? { background: 'rgba(168,85,247,0.18)', border: '1px solid rgba(168,85,247,0.35)', color: '#a855f7' }
                    : { background: 'rgba(14,12,30,0.7)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(200,200,220,0.45)' }
                }
              >
                {filter === f && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(168,85,247,0.08)' }}
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{f === 'all' ? 'Todos' : 'Destaques'}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* ── Projects list ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
            className="space-y-32 sm:space-y-40 md:space-y-56"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── View all CTA — same pattern as AboutSection education badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.9 }}
          className="text-center mt-24 sm:mt-28 md:mt-32"
        >
          <motion.a
            href="https://github.com/camyf7"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full font-mono font-medium text-sm transition-all"
            style={{
              background: 'rgba(14,12,30,0.85)',
              border: '1px solid rgba(168,85,247,0.18)',
              color: 'rgba(200,200,220,0.7)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(168,85,247,0.45)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#a855f7'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(168,85,247,0.18)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(200,200,220,0.7)'
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Ver todos os 21 repositórios no GitHub
            <motion.svg
              className="w-4 h-4"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}