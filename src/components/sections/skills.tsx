'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ────────────────────────────────────────────────────────────────
const skillCategories = [
  {
    id: 'frontend',
    tag: '01',
    title: 'Frontend',
    desc: '// interfaces modernas e responsivas',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    accent: '#a855f7',
    accentRgb: '168,85,247',
    skills: [
      { name: 'React',          level: 90 },
      { name: 'Next.js',        level: 82 },
      { name: 'TypeScript',     level: 85 },
      { name: 'JavaScript',     level: 90 },
      { name: 'Tailwind CSS',   level: 95 },
      { name: 'HTML5 / CSS3',   level: 96 },
      { name: 'Framer Motion',  level: 78 },
    ],
  },
  {
    id: 'uiux',
    tag: '02',
    title: 'UI / UX',
    desc: '// design de experiências',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    accent: '#fb923c',
    accentRgb: '251,146,60',
    skills: [
      { name: 'Figma',              level: 82 },
      { name: 'Responsive Design',  level: 92 },
      { name: 'Design Systems',     level: 76 },
      { name: 'Acessibilidade',     level: 80 },
      { name: 'Wireframing',        level: 75 },
      { name: 'Prototipagem',       level: 72 },
    ],
  },
  {
    id: 'backend',
    tag: '03',
    title: 'Backend & APIs',
    desc: '// lógica de servidor',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    accent: '#06b6d4',
    accentRgb: '6,182,212',
    skills: [
      { name: 'REST APIs', level: 78 },
      { name: 'Node.js',   level: 70 },
      { name: 'Express',   level: 65 },
      { name: 'Firebase',  level: 72 },
    ],
  },
  {
    id: 'tools',
    tag: '04',
    title: 'Ferramentas',
    desc: '// workflow & produtividade',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    accent: '#4ade80',
    accentRgb: '74,222,128',
    skills: [
      { name: 'Git / GitHub', level: 88 },
      { name: 'VS Code',      level: 96 },
      { name: 'Vite',         level: 82 },
      { name: 'Postman',      level: 70 },
    ],
  },
]

const MARQUEE_TECHS = [
  'React', 'Next.js', 'TypeScript', 'Tailwind CSS',
  'Figma', 'Node.js', 'Git', 'Firebase',
  'Framer Motion', 'REST APIs', 'Vite', 'VS Code',
  'Acessibilidade', 'Design Systems',
]

const CODE_SNIPPET = `const camilly = {
  role      : "Front-end Developer",
  focus     : ["React", "Next.js", "UI/UX"],
  currently : "Design Systems & Animações",
  belief    : "código bonito → experiências memoráveis",
}`

// ─── SkillBar ─────────────────────────────────────────────────────────────────
function SkillBar({
  name,
  level,
  accent,
  accentRgb,
  delay,
}: {
  name: string
  level: number
  accent: string
  accentRgb: string
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-foreground/80">{name}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: delay + 0.6 }}
          className="text-xs font-mono"
          style={{ color: accent }}
        >
          {level}%
        </motion.span>
      </div>

      {/* Track */}
      <div
        className="h-[3px] rounded-full overflow-visible relative"
        style={{ background: `rgba(${accentRgb},0.08)` }}
      >
        {/* Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.3, delay, ease: [0.23, 1, 0.32, 1] }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, rgba(${accentRgb},0.4), ${accent})` }}
        >
          {/* Dot tip */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.9 }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full border-2"
            style={{
              background: accent,
              borderColor: 'var(--background, #0d1117)',
              transform: 'translate(50%, -50%)',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

// ─── SkillCard ────────────────────────────────────────────────────────────────
function SkillCard({
  category,
  index,
}: {
  category: (typeof skillCategories)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [isHovered, setIsHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? (mouse.x - 50) / 12 : 0,
          rotateX: isHovered ? -(mouse.y - 50) / 12 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative rounded-2xl p-6 md:p-7 h-full overflow-hidden"
        style={{
          background: 'rgba(14,12,30,0.85)',
          border: `1px solid rgba(${category.accentRgb},0.12)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Spotlight */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(500px circle at ${mouse.x}% ${mouse.y}%, rgba(${category.accentRgb},0.07), transparent 40%)`,
          }}
        />

        {/* Top accent line */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, transparent, ${category.accent}, transparent)`,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            {/* Icon */}
            <motion.div
              animate={{
                rotate: isHovered ? -8 : 0,
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{
                background: `rgba(${category.accentRgb},0.1)`,
                border: `1px solid rgba(${category.accentRgb},0.2)`,
                color: category.accent,
              }}
            >
              {category.icon}
            </motion.div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {category.title}
            </h3>
            <p className="text-xs font-mono mt-0.5" style={{ color: `rgba(${category.accentRgb},0.6)` }}>
              {category.desc}
            </p>
          </div>

          {/* Count badge */}
          <div
            className="font-mono text-xs px-2 py-1 rounded-md mt-1"
            style={{
              background: `rgba(${category.accentRgb},0.06)`,
              border: `1px solid rgba(${category.accentRgb},0.12)`,
              color: `rgba(${category.accentRgb},0.5)`,
            }}
          >
            {String(category.skills.length).padStart(2, '0')}
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 relative z-10">
          {category.skills.map((skill, i) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              accent={category.accent}
              accentRgb={category.accentRgb}
              delay={0.18 + i * 0.07}
            />
          ))}
        </div>

        {/* Glow behind card */}
        <motion.div
          animate={{ opacity: isHovered ? 0.12 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-2xl -z-10 blur-2xl"
          style={{ background: category.accent }}
        />
      </motion.div>
    </motion.div>
  )
}

// ─── CodeSnippet ──────────────────────────────────────────────────────────────
function CodeSnippet() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const lines = CODE_SNIPPET.split('\n')

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="rounded-xl overflow-hidden mb-12 sm:mb-16"
      style={{
        background: 'rgba(7,6,26,0.9)',
        border: '1px solid rgba(168,85,247,0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Tab bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(168,85,247,0.1)', background: 'rgba(0,0,0,0.3)' }}
      >
        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
          <div key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-2 text-[10px] font-mono" style={{ color: 'rgba(168,85,247,0.45)' }}>
          camilly.ts
        </span>
      </div>

      {/* Code */}
      <div className="px-5 py-4 font-mono text-xs sm:text-sm leading-7 overflow-x-auto">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
            className="whitespace-pre"
          >
            {colorize(line)}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Minimal syntax colorizer — same vibe as the terminal in AboutSection
function colorize(line: string) {
  if (line.startsWith('const')) {
    return (
      <>
        <span style={{ color: '#818cf8' }}>const </span>
        <span style={{ color: '#e2e8f0' }}>camilly</span>
        <span style={{ color: 'rgba(200,180,255,0.4)' }}> {'='} {'{'}</span>
      </>
    )
  }
  if (line === '}') {
    return <span style={{ color: 'rgba(200,180,255,0.4)' }}>{'}'}</span>
  }
  if (line === '') return <br />

  // key : value lines
  const match = line.match(/^(\s+)(\w+)\s*(:)\s*(.+)$/)
  if (match) {
    const [, indent, key, colon, val] = match
    const isArray = val.startsWith('[')
    const isString = val.startsWith('"') || val.includes('"')
    return (
      <>
        <span>{indent}</span>
        <span style={{ color: '#a855f7' }}>{key}</span>
        <span style={{ color: 'rgba(200,180,255,0.35)' }}>{colon} </span>
        {isArray ? (
          <span style={{ color: '#fb923c' }}>{val}</span>
        ) : isString ? (
          <span style={{ color: '#34d399' }}>{val}</span>
        ) : (
          <span style={{ color: '#e2e8f0' }}>{val}</span>
        )}
      </>
    )
  }

  return <span style={{ color: 'rgba(200,200,220,0.6)' }}>{line}</span>
}

// ─── SkillsSection ────────────────────────────────────────────────────────────
export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.08 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])

  // GSAP stagger — mirrors the pattern from AboutSection
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.skills-card-item',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.13,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="skills"
      className="py-16 sm:py-24 md:py-32 lg:py-48 relative overflow-hidden"
    >
      {/* ── Background orbs — same as AboutSection ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[300px] sm:w-[450px] md:w-[650px] h-[300px] sm:h-[450px] md:h-[650px] rounded-full blur-3xl"
          style={{ background: 'rgba(168,85,247,0.05)', y: bgY }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[250px] sm:w-[350px] md:w-[450px] h-[250px] sm:h-[350px] md:h-[450px] rounded-full blur-3xl"
          style={{ background: 'rgba(6,182,212,0.04)' }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Dot grid — same pattern as the Notebook card in AboutSection */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(168,85,247,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section Header — same structure as AboutSection ── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-primary tracking-widest uppercase font-mono mb-3 sm:mb-4 block"
          >
            02 / Habilidades
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
          >
            Minha{' '}
            <span className="text-gradient">stack</span>{' '}
            de tecnologias
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed"
          >
            Ferramentas e tecnologias que utilizo para transformar ideias em experiências
            digitais excepcionais.
          </motion.p>
        </motion.div>

        {/* ── Code Snippet ── */}
        <CodeSnippet />

        {/* ── Skills Grid ── */}
        <div className="grid sm:grid-cols-2 gap-5 lg:gap-6">
          {skillCategories.map((category, index) => (
            <div key={category.id} className="skills-card-item">
              <SkillCard category={category} index={index} />
            </div>
          ))}
        </div>

        

        
      </div>
    </section>
  )
}