'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const journeyData = {
  education: [
    {
      year: '2024 — 2026',
      title: 'Técnico em Informática para Internet',
      institution: 'Instituto Federal de São Paulo',
      shortcode: 'IFSP',
      status: 'Cursando',
      description:
        'Exploração avançada de arquitetura de software, desenvolvimento web e tecnologias emergentes que fundamentam a engenharia de sistemas modernos.',
      technologies: ['React', 'Node.js', 'Banco de Dados', 'DevOps'],
      accent: '#a855f7',
      accentRgb: '168,85,247',
      index: '01',
    },
    {
      year: '2020 — 2025',
      title: 'Ensino Médio',
      institution: 'Colégio Adventista de Caraguatatuba',
      shortcode: 'CAC',
      status: 'Concluído',
      description:
        'Base sólida em ciências exatas, desenvolvimento do pensamento analítico e fundamentos da lógica computacional.',
      technologies: ['Matemática', 'Física', 'Lógica', 'Computação'],
      accent: '#818cf8',
      accentRgb: '129,140,248',
      index: '02',
    },
  ],
  certifications: [
    {
      year: '2025',
      title: 'Hackathon Inova Caragua',
      institution: 'IFSP & Secretaria de Turismo',
      shortcode: 'Turismo',
      description:
        '72 horas de imersão tecnológica para construir soluções inovadoras no setor público e turístico regional.',
      technologies: ['Inovação', 'Impacto Social', 'Prototipagem Rápida'],
      accent: '#ec4899',
      accentRgb: '236,72,153',
      index: '03',
    },
  ],
}

// ─── TimelineNode ──────────────────────────────────────────────────────────────
function TimelineNode({
  progress,
  index,
  accent,
  accentRgb,
}: {
  progress: any
  index: number
  accent: string
  accentRgb: string
}) {
  const scale = useTransform(progress, [0.1 + index * 0.05, 0.2 + index * 0.05], [0, 1])
  const glowScale = useTransform(progress, [0.1 + index * 0.05, 0.2 + index * 0.05], [0.5, 1.5])

  return (
    <div className="absolute -left-[13px] top-[24px] z-20">
      <motion.div
        className="absolute w-[3px] h-[3px] rounded-full"
        style={{
          backgroundColor: accent,
          boxShadow: `0 0 16px ${accent}`,
          scale,
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 10,
          height: 10,
          left: -3.5,
          top: -3.5,
          backgroundColor: `rgba(${accentRgb}, 0.15)`,
          scale: glowScale,
        }}
      />
    </div>
  )
}

// ─── JourneyCard ───────────────────────────────────────────────────────────────
function JourneyCard({
  item,
  type,
  index,
  progress,
}: {
  item: any
  type: string
  index: number
  progress: any
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const yOffset = useTransform(scrollYProgress, [0, 1], [40, -40])
  const springY = useSpring(yOffset, { stiffness: 60, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.12,
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
  }, [index])

  return (
    <motion.div
      ref={ref}
      style={{ y: springY }}
      className="relative mb-10 last:mb-0"
    >
      <TimelineNode progress={progress} index={index} accent={item.accent} accentRgb={item.accentRgb} />

      <div className="pl-8">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          className="relative group cursor-pointer rounded-2xl overflow-hidden"
          whileHover={{ y: -3 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `radial-gradient(ellipse at 60% 40%, rgba(${item.accentRgb},0.08) 0%, rgba(7,6,26,0.95) 65%)`,
              border: `1px solid rgba(${item.accentRgb},0.1)`,
            }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              backgroundImage: `radial-gradient(rgba(${item.accentRgb},0.05) 1px, transparent 1px)`,
              backgroundSize: '22px 22px',
            }}
          />

          {/* Content */}
          <div className="relative p-6 z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs tracking-widest uppercase font-mono"
                    style={{ color: item.accent }}
                  >
                    {item.year}
                  </span>
                  <div
                    className="w-8 h-px"
                    style={{ background: `rgba(${item.accentRgb},0.3)` }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: `rgba(${item.accentRgb},0.45)` }}
                  >
                    {item.index}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold tracking-tight mb-1"
                  style={{ color: '#e6edf3' }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-sm font-mono tracking-wider"
                  style={{ color: `rgba(${item.accentRgb},0.6)` }}
                >
                  {item.institution}
                </p>
              </div>

              {item.status && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase"
                  style={{
                    background: `rgba(${item.accentRgb},0.1)`,
                    border: `1px solid rgba(${item.accentRgb},0.2)`,
                    color: item.accent,
                  }}
                >
                  {item.status}
                </span>
              )}
            </div>

            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: 'rgba(200,200,220,0.6)' }}
            >
              {item.description}
            </p>

            {item.technologies && (
              <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: `rgba(${item.accentRgb},0.08)` }}>
                {item.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono tracking-wide px-2 py-0.5 rounded"
                    style={{
                      background: `rgba(${item.accentRgb},0.07)`,
                      border: `1px solid rgba(${item.accentRgb},0.12)`,
                      color: `rgba(${item.accentRgb},0.7)`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hover spotlight */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(380px circle at ${mouse.x}% ${mouse.y}%, rgba(${item.accentRgb},0.08), transparent 55%)`,
            }}
          />

          {/* Top accent line */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0, scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl origin-left"
            style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
          />

          {/* Bottom glow line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px origin-right"
            initial={{ scaleX: 0 }}
            animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── ContinuousLearningCard ────────────────────────────────────────────────────
function ContinuousLearningCard({ progress }: { progress: any }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [isHovered, setIsHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 50 })
  const accent = '#34d399'
  const accentRgb = '52,211,153'

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          delay: 0.4,
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
    <motion.div ref={ref} className="mt-10">
      <div
        className="relative group rounded-2xl overflow-hidden cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, rgba(${accentRgb},0.06) 0%, rgba(7,6,26,0.95) 65%)`,
            border: `1px solid rgba(${accentRgb},0.1)`,
          }}
        />

        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundImage: `radial-gradient(rgba(${accentRgb},0.04) 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative p-6 z-10">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: accent }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span
              className="text-[10px] tracking-[0.2em] uppercase font-mono"
              style={{ color: `rgba(${accentRgb},0.7)` }}
            >
              Em constante evolução
            </span>
          </div>

          <h4 className="text-base font-medium mb-2" style={{ color: '#e6edf3' }}>
            Sempre em aprendizado contínuo
          </h4>

          <p className="text-sm leading-relaxed" style={{ color: 'rgba(200,200,220,0.5)' }}>
            Expandindo ativamente meu conhecimento através de cursos especializados,
            certificações técnicas e projetos práticos que desafiam minha criatividade
            e capacidade técnica.
          </p>

          <div className="mt-4 pt-3 border-t flex gap-4 text-[10px] font-mono" style={{ borderColor: `rgba(${accentRgb},0.08)` }}>
            <span style={{ color: `rgba(${accentRgb},0.5)` }}>+12 Cursos</span>
            <span style={{ color: `rgba(${accentRgb},0.5)` }}>5 Certificações</span>
            <span style={{ color: `rgba(${accentRgb},0.5)` }}>20+ Projetos</span>
          </div>
        </div>

        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(380px circle at ${mouse.x}% ${mouse.y}%, rgba(${accentRgb},0.06), transparent 55%)`,
          }}
        />
      </div>
    </motion.div>
  )
}

// ─── ColumnHeader ──────────────────────────────────────────────────────────────
function ColumnHeader({
  label,
  accent,
  isInView,
}: {
  label: string
  accent: string
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <span className="text-xs tracking-[0.2em] uppercase font-mono" style={{ color: `rgba(${accent},0.5)` }}>
        {label}
      </span>
      <div className="w-16 h-px mt-2" style={{ background: `rgba(${accent},0.2)` }} />
    </motion.div>
  )
}

// ─── JourneySection ────────────────────────────────────────────────────────────
export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.06 })

  const leftProgress = useSpring(
    useScroll({ target: leftColRef, offset: ['start 0.8', 'end 0.2'] }).scrollYProgress,
    { stiffness: 100, damping: 30, restDelta: 0.001 }
  )

  const rightProgress = useSpring(
    useScroll({ target: rightColRef, offset: ['start 0.8', 'end 0.2'] }).scrollYProgress,
    { stiffness: 100, damping: 30, restDelta: 0.001 }
  )

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.journey-header-item',
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
      id="journey"
      className="py-16 sm:py-24 md:py-32 lg:py-48 relative overflow-hidden"
    >
      {/* ── Background orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[550px] md:w-[800px] h-[300px] sm:h-[550px] md:h-[800px] rounded-full blur-3xl"
          style={{ background: 'rgba(168,85,247,0.04)', y: bgY }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.38, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[250px] sm:w-[400px] md:w-[520px] h-[250px] sm:h-[400px] md:h-[520px] rounded-full blur-3xl"
          style={{ background: 'rgba(236,72,153,0.04)' }}
          animate={{ x: [0, -40, 0], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-0 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] rounded-full blur-3xl"
          style={{ background: 'rgba(129,140,248,0.04)' }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
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
        <div className="mb-20 sm:mb-24 md:mb-32">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="journey-header-item text-xs sm:text-sm text-primary tracking-widest uppercase font-mono mb-3 sm:mb-4 block"
          >
            04 / Jornada
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="journey-header-item text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6"
          >
            Minha{' '}
            <span className="text-gradient">
              trajetória
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="journey-header-item text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            Uma curadoria visual da minha formação acadêmica e conquistas que
            moldaram minha perspectiva na engenharia de software moderna.
          </motion.p>
        </div>

        {/* ── Timeline Grid ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-24">
          {/* Left: Education */}
          <div ref={leftColRef}>
            <ColumnHeader label="Formação Acadêmica" accent="168,85,247" isInView={isInView} />
            <div className="relative">
              {/* Timeline line background */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/20 via-purple-500/10 to-transparent" />
              {/* Animated timeline fill */}
              <motion.div
                className="absolute left-0 top-0 w-px bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600"
                style={{ scaleY: leftProgress, transformOrigin: 'top' }}
              />

              {journeyData.education.map((item, index) => (
                <JourneyCard
                  key={item.title}
                  item={item}
                  type="education"
                  index={index}
                  progress={leftProgress}
                />
              ))}
            </div>
          </div>

          {/* Right: Certifications & Learning */}
          <div ref={rightColRef}>
            <ColumnHeader label="Certificações & Conquistas" accent="236,72,153" isInView={isInView} />
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/20 via-purple-500/10 to-transparent" />
              <motion.div
                className="absolute left-0 top-0 w-px bg-gradient-to-b from-purple-400 via-purple-500 to-purple-600"
                style={{ scaleY: rightProgress, transformOrigin: 'top' }}
              />

              {journeyData.certifications.map((item, index) => (
                <JourneyCard
                  key={item.title}
                  item={item}
                  type="certification"
                  index={index}
                  progress={rightProgress}
                />
              ))}

              <ContinuousLearningCard progress={rightProgress} />
            </div>
          </div>
        </div>

        {/* ── Bottom decorative line ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="mt-24 sm:mt-28 md:mt-32 h-px origin-left"
          style={{
            background: 'linear-gradient(90deg, rgba(168,85,247,0.3), rgba(168,85,247,0.08), transparent)',
          }}
        />
      </div>
    </section>
  )
}