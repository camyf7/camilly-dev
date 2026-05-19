'use client'

import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Premium SVG Illustrations ───────────────────────────────────────────────

const FrontendIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="screen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e1e2e" />
        <stop offset="100%" stopColor="#13131f" />
      </linearGradient>
      <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2a2a3d" />
        <stop offset="100%" stopColor="#1a1a2a" />
      </linearGradient>
      <linearGradient id="lid-edge" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3a3a5c" />
        <stop offset="100%" stopColor="#1a1a2a" />
      </linearGradient>
      <linearGradient id="neon-blue" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <filter id="glow-soft">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="shadow-deep">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000" floodOpacity="0.5" />
      </filter>
    </defs>

    {/* Ambient glow behind laptop */}
    <ellipse cx="140" cy="170" rx="80" ry="14" fill="#6366f1" opacity="0.12" />

    {/* Laptop body (base) */}
    <g filter="url(#shadow-deep)">
      {/* Base trapezoid */}
      <path d="M62 148 L218 148 L224 162 L56 162 Z" fill="url(#body-grad)" />
      {/* Base top surface */}
      <rect x="68" y="140" width="144" height="10" rx="2" fill="#222236" />
      {/* Trackpad */}
      <rect x="116" y="143" width="48" height="5" rx="2.5" fill="#2d2d48" />
    </g>

    {/* Laptop lid */}
    <g filter="url(#shadow-deep)">
      <rect x="68" y="52" width="144" height="90" rx="6" fill="url(#body-grad)" />
      {/* Screen bezel */}
      <rect x="72" y="56" width="136" height="82" rx="4" fill="url(#screen-grad)" />

      {/* Code lines on screen */}
      <g opacity="0.9">
        {/* Line 1 — keyword */}
        <rect x="82" y="65" width="22" height="3.5" rx="1.5" fill="#818cf8" />
        {/* Line 1 — variable */}
        <rect x="108" y="65" width="36" height="3.5" rx="1.5" fill="#94a3b8" />
        {/* Line 1 — operator */}
        <rect x="148" y="65" width="8" height="3.5" rx="1.5" fill="#38bdf8" />
        {/* Line 1 — value */}
        <rect x="160" y="65" width="24" height="3.5" rx="1.5" fill="#34d399" />

        {/* Line 2 — indent + content */}
        <rect x="90" y="74" width="14" height="3.5" rx="1.5" fill="#818cf8" />
        <rect x="108" y="74" width="48" height="3.5" rx="1.5" fill="#94a3b8" />

        {/* Line 3 */}
        <rect x="90" y="83" width="18" height="3.5" rx="1.5" fill="#f472b6" />
        <rect x="112" y="83" width="30" height="3.5" rx="1.5" fill="#94a3b8" opacity="0.6" />

        {/* Line 4 — blank */}
        <rect x="82" y="92" width="8" height="3.5" rx="1.5" fill="#94a3b8" opacity="0.3" />

        {/* Line 5 */}
        <rect x="82" y="101" width="26" height="3.5" rx="1.5" fill="#818cf8" />
        <rect x="112" y="101" width="40" height="3.5" rx="1.5" fill="#94a3b8" opacity="0.5" />

        {/* Line 6 */}
        <rect x="90" y="110" width="56" height="3.5" rx="1.5" fill="#38bdf8" opacity="0.7" />

        {/* Cursor blink */}
        <rect x="150" y="110" width="2" height="3.5" rx="1" fill="#818cf8" opacity="0.9" />

        {/* Line 7 */}
        <rect x="82" y="119" width="16" height="3.5" rx="1.5" fill="#818cf8" opacity="0.5" />
      </g>

      {/* Screen edge highlight */}
      <rect x="72" y="56" width="136" height="1" rx="0.5" fill="#ffffff" opacity="0.04" />
    </g>

    {/* Lid–base hinge line */}
    <rect x="68" y="140" width="144" height="1" fill="#ffffff" opacity="0.04" />

    {/* Subtle neon edge on lid bottom */}
    <line x1="72" y1="137" x2="208" y2="137" stroke="url(#neon-blue)" strokeWidth="0.5" opacity="0.25" />
  </svg>
)

const TypeScriptIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="ts-cube-top" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b4cca" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="ts-cube-left" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="ts-cube-right" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="cube-glow">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="cube-shadow">
        <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#1d4ed8" floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Ambient glow */}
    <ellipse cx="140" cy="164" rx="52" ry="10" fill="#3b82f6" opacity="0.15" />

    {/* Cube — isometric */}
    <g filter="url(#cube-shadow)">
      {/* Top face */}
      <path d="M140 58 L188 84 L140 110 L92 84 Z" fill="url(#ts-cube-top)" />
      {/* Left face */}
      <path d="M92 84 L140 110 L140 152 L92 126 Z" fill="url(#ts-cube-left)" />
      {/* Right face */}
      <path d="M188 84 L188 126 L140 152 L140 110 Z" fill="url(#ts-cube-right)" />
    </g>

    {/* TS text on front-right face */}
    <g transform="skewY(-16) translate(148, 116)">
      <text
        x="0" y="0"
        fontSize="18"
        fontWeight="700"
        fontFamily="monospace"
        fill="white"
        opacity="0.9"
        letterSpacing="-0.5"
      >
        TS
      </text>
    </g>

    {/* Edge highlights */}
    <line x1="140" y1="58" x2="188" y2="84" stroke="white" strokeWidth="0.5" opacity="0.15" />
    <line x1="140" y1="58" x2="92" y2="84" stroke="white" strokeWidth="0.5" opacity="0.08" />

    {/* Small floating geometric accent — top right */}
    <g opacity="0.4">
      <path d="M210 50 L222 56 L210 62 L198 56 Z" fill="none" stroke="#818cf8" strokeWidth="0.75" />
    </g>

    {/* Small dot accent — bottom left */}
    <circle cx="72" cy="130" r="2" fill="#38bdf8" opacity="0.35" />
    <circle cx="80" cy="136" r="1.2" fill="#818cf8" opacity="0.25" />
  </svg>
)

const UIUXIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="panel-bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e1e2e" />
        <stop offset="100%" stopColor="#13131f" />
      </linearGradient>
      <linearGradient id="accent-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <filter id="panel-shadow">
        <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#000" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Ambient glow */}
    <ellipse cx="140" cy="168" rx="70" ry="10" fill="#6366f1" opacity="0.1" />

    {/* Main panel */}
    <g filter="url(#panel-shadow)">
      <rect x="62" y="44" width="156" height="114" rx="10" fill="url(#panel-bg)" />
      {/* Top bar */}
      <rect x="62" y="44" width="156" height="28" rx="10" fill="#1a1a2e" />
      <rect x="62" y="58" width="156" height="14" fill="#1a1a2e" />
      {/* Traffic lights */}
      <circle cx="80" cy="58" r="4" fill="#ff5f57" opacity="0.7" />
      <circle cx="94" cy="58" r="4" fill="#febc2e" opacity="0.7" />
      <circle cx="108" cy="58" r="4" fill="#28c840" opacity="0.7" />
    </g>

    {/* Panel content */}
    {/* Avatar placeholder */}
    <circle cx="88" cy="92" r="12" fill="#2a2a42" />
    <circle cx="88" cy="88" r="5" fill="#3a3a56" />
    <path d="M76 100 Q88 93 100 100" fill="#3a3a56" />

    {/* Name + role lines */}
    <rect x="106" y="85" width="52" height="4" rx="2" fill="#94a3b8" opacity="0.7" />
    <rect x="106" y="94" width="36" height="3" rx="1.5" fill="#94a3b8" opacity="0.35" />

    {/* Divider */}
    <line x1="72" y1="110" x2="208" y2="110" stroke="#ffffff" strokeWidth="0.5" opacity="0.06" />

    {/* Stat bars */}
    <rect x="72" y="118" width="80" height="3" rx="1.5" fill="#1e293b" />
    <rect x="72" y="118" width="52" height="3" rx="1.5" fill="url(#accent-grad)" />

    <rect x="72" y="126" width="80" height="3" rx="1.5" fill="#1e293b" />
    <rect x="72" y="126" width="68" height="3" rx="1.5" fill="#818cf8" opacity="0.6" />

    <rect x="72" y="134" width="80" height="3" rx="1.5" fill="#1e293b" />
    <rect x="72" y="134" width="38" height="3" rx="1.5" fill="#38bdf8" opacity="0.5" />

    {/* CTA button */}
    <rect x="162" y="116" width="38" height="18" rx="9" fill="url(#accent-grad)" opacity="0.9" />
    <rect x="168" y="122" width="26" height="5" rx="2" fill="white" opacity="0.25" />

    {/* Cursor */}
    <g transform="translate(166, 106)" opacity="0.85">
      <path d="M0 0 L0 14 L3.5 10.5 L6 16 L7.5 15.3 L5 9.8 L9.5 9.8 Z"
        fill="#e2e8f0" stroke="#0f172a" strokeWidth="0.5" />
    </g>
  </svg>
)

const PerformanceIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="gauge-bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e1e2e" />
        <stop offset="100%" stopColor="#13131f" />
      </linearGradient>
      <linearGradient id="arc-grad" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="40%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <filter id="needle-glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <filter id="gauge-shadow">
        <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.4" />
      </filter>
      <clipPath id="arc-clip">
        <path d="M60 140 A80 80 0 0 1 220 140 Z" />
      </clipPath>
    </defs>

    {/* Ambient glow */}
    <ellipse cx="140" cy="160" rx="64" ry="10" fill="#38bdf8" opacity="0.1" />

    {/* Outer gauge body */}
    <g filter="url(#gauge-shadow)">
      <path d="M54 148 A90 90 0 0 1 226 148 L214 148 A78 78 0 0 0 66 148 Z"
        fill="url(#gauge-bg)" />
    </g>

    {/* Track arc (inactive) */}
    <path d="M68 142 A72 72 0 0 1 212 142"
      stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" />

    {/* Active arc (high performance — ~75%) */}
    {/* 75% of 180deg = 135deg, start from left (180deg), sweeping right */}
    <path d="M68 142 A72 72 0 0 1 194 96"
      stroke="url(#arc-grad)" strokeWidth="10" strokeLinecap="round" fill="none" />

    {/* Tick marks */}
    {[0, 30, 60, 90, 120, 150, 180].map((deg, i) => {
      const rad = ((180 - deg) * Math.PI) / 180
      const cx = 140 + 72 * Math.cos(rad)
      const cy = 142 - 72 * Math.sin(rad)
      const cx2 = 140 + 80 * Math.cos(rad)
      const cy2 = 142 - 80 * Math.sin(rad)
      return (
        <line key={i} x1={cx} y1={cy} x2={cx2} y2={cy2}
          stroke="#334155" strokeWidth={i === 0 || i === 6 ? 1.5 : 1}
          opacity={0.6} />
      )
    })}

    {/* Needle — pointing at ~75% (≈135deg from left = 45deg from right = pointing upper-right) */}
    <g filter="url(#needle-glow)">
      <line x1="140" y1="142" x2="194" y2="96"
        stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <circle cx="140" cy="142" r="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="140" cy="142" r="2" fill="#38bdf8" />
    </g>

    {/* Speed value */}
    <text x="140" y="130" textAnchor="middle" fontSize="22" fontWeight="700"
      fontFamily="monospace" fill="white" opacity="0.95">98</text>
    <text x="140" y="143" textAnchor="middle" fontSize="8" fontWeight="400"
      fontFamily="monospace" fill="#64748b" letterSpacing="2">SCORE</text>

    {/* Labels */}
    <text x="64" y="158" textAnchor="middle" fontSize="7" fontFamily="monospace"
      fill="#475569">0</text>
    <text x="216" y="158" textAnchor="middle" fontSize="7" fontFamily="monospace"
      fill="#475569">100</text>
  </svg>
)

const ResponsiveIllustration = () => (
  <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="resp-bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e1e2e" />
        <stop offset="100%" stopColor="#13131f" />
      </linearGradient>
      <linearGradient id="resp-accent" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <filter id="resp-shadow">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.45" />
      </filter>
    </defs>

    {/* Ambient glow */}
    <ellipse cx="140" cy="168" rx="70" ry="9" fill="#6366f1" opacity="0.1" />

    {/* Desktop monitor */}
    <g filter="url(#resp-shadow)">
      <rect x="50" y="48" width="112" height="78" rx="6" fill="url(#resp-bg)" />
      <rect x="54" y="52" width="104" height="66" rx="3" fill="#0f0f1a" />
      {/* Monitor stand */}
      <rect x="98" y="126" width="16" height="8" rx="1" fill="#1a1a2e" />
      <rect x="90" y="133" width="32" height="3" rx="1.5" fill="#1a1a2e" />
    </g>

    {/* Desktop screen content */}
    <rect x="60" y="58" width="88" height="6" rx="2" fill="#1e293b" />
    <rect x="60" y="58" width="56" height="6" rx="2" fill="url(#resp-accent)" opacity="0.6" />
    <rect x="60" y="70" width="88" height="4" rx="1.5" fill="#1e293b" />
    <rect x="60" y="78" width="88" height="4" rx="1.5" fill="#1e293b" />
    <rect x="60" y="78" width="44" height="4" rx="1.5" fill="#94a3b8" opacity="0.2" />
    <rect x="60" y="90" width="40" height="12" rx="4" fill="url(#resp-accent)" opacity="0.7" />

    {/* Tablet */}
    <g filter="url(#resp-shadow)">
      <rect x="166" y="62" width="58" height="78" rx="6" fill="url(#resp-bg)" />
      <rect x="170" y="67" width="50" height="62" rx="3" fill="#0f0f1a" />
      <circle cx="195" cy="146" r="3" fill="#1e293b" />
    </g>

    {/* Tablet screen content */}
    <rect x="174" y="73" width="42" height="5" rx="1.5" fill="#1e293b" />
    <rect x="174" y="73" width="26" height="5" rx="1.5" fill="url(#resp-accent)" opacity="0.55" />
    <rect x="174" y="83" width="42" height="4" rx="1.5" fill="#1e293b" />
    <rect x="174" y="91" width="42" height="4" rx="1.5" fill="#1e293b" />
    <rect x="174" y="91" width="20" height="4" rx="1.5" fill="#94a3b8" opacity="0.18" />
    <rect x="174" y="100" width="20" height="10" rx="3.5" fill="url(#resp-accent)" opacity="0.65" />

    {/* Connector line between devices */}
    <path d="M162 100 Q164 100 166 100" stroke="#818cf8" strokeWidth="0.75" opacity="0.3" strokeDasharray="2 2" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────

const showcaseItems = [
  {
    title: 'Frontend',
    description: 'Interfaces modernas com React e Next.js',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    accent: '#818cf8',
    illustration: FrontendIllustration,
  },
  {
    title: 'TypeScript',
    description: 'Código tipado e mais seguro',
    gradient: 'from-blue-600/10 to-blue-400/10',
    accent: '#3b82f6',
    illustration: TypeScriptIllustration,
  },
  {
    title: 'UI/UX',
    description: 'Design focado no usuário',
    gradient: 'from-violet-500/10 to-purple-500/10',
    accent: '#a78bfa',
    illustration: UIUXIllustration,
  },
  {
    title: 'Performance',
    description: 'Aplicações rápidas e otimizadas',
    gradient: 'from-cyan-500/10 to-sky-500/10',
    accent: '#38bdf8',
    illustration: PerformanceIllustration,
  },
  {
    title: 'Responsivo',
    description: 'Perfeito em qualquer dispositivo',
    gradient: 'from-indigo-500/10 to-blue-400/10',
    accent: '#6366f1',
    illustration: ResponsiveIllustration,
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function HorizontalShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  useEffect(() => {
    const container = containerRef.current
    const scrollElement = scrollRef.current
    if (!container || !scrollElement) return

    const totalWidth = scrollElement.scrollWidth - window.innerWidth + 100

    const ctx = gsap.context(() => {
      gsap.to(scrollElement, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="h-screen overflow-hidden relative bg-background"
    >
      {/* Subtle radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.08),transparent)]" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-20 left-6 md:left-12 z-10"
      >
        <span className="text-xs text-primary/60 tracking-[0.2em] uppercase font-mono mb-3 block">
          O que faço
        </span>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Áreas de{' '}
          <span className="bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed] bg-clip-text text-transparent">
            atuação
          </span>
        </h2>
      </motion.div>

      {/* Horizontal Scroll Content */}
      <div
        ref={scrollRef}
        className="flex items-center h-full gap-5 px-6 md:px-12 pt-28"
        style={{ width: 'max-content' }}
      >
        {showcaseItems.map((item, index) => {
          const Illustration = item.illustration
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`
                group relative
                w-[280px] md:w-[360px]
                h-[400px] md:h-[480px]
                rounded-2xl shrink-0
                bg-gradient-to-br ${item.gradient}
                border border-white/[0.05]
                overflow-hidden
                flex flex-col
              `}
              style={{
                background: `linear-gradient(135deg, rgba(15,15,26,0.95) 0%, rgba(20,20,36,0.98) 100%)`,
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px -16px rgba(0,0,0,0.5)`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px opacity-40"
                style={{ background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }}
              />

              {/* Illustration area */}
              <div className="flex-1 flex items-center justify-center px-6 pt-10 pb-2">
                <div className="w-full" style={{ maxHeight: 200 }}>
                  <Illustration />
                </div>
              </div>

              {/* Text area */}
              <div className="px-8 pb-9">
                <div
                  className="w-6 h-px mb-5 opacity-50"
                  style={{ background: item.accent }}
                />
                <h3 className="text-2xl font-semibold tracking-tight text-white/95 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover vignette */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${item.accent}08, transparent)`,
                }}
              />
            </motion.div>
          )
        })}

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-[280px] md:w-[360px] h-[400px] md:h-[480px] rounded-2xl shrink-0 flex flex-col items-center justify-center px-10 relative overflow-hidden"
          style={{
            border: '1px dashed rgba(255,255,255,0.08)',
            background: 'rgba(10,10,18,0.6)',
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute w-48 h-48 rounded-full blur-3xl opacity-[0.07] -top-12 -right-12"
            style={{ background: 'radial-gradient(circle, #818cf8, #38bdf8)' }}
          />

          <div className="relative z-10 text-center">
            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl mb-7 mx-auto flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(56,189,248,0.1))',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z"
                  fill="url(#star-grad)" />
                <defs>
                  <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-white/90 mb-3 tracking-tight">
              Vamos trabalhar juntos?
            </h3>
            <p className="text-sm text-white/35 leading-relaxed mb-8">
              Entre em contato e vamos criar algo incrível
            </p>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white/90"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(56,189,248,0.15))',
                border: '1px solid rgba(129,140,248,0.25)',
              }}
            >
              Iniciar projeto
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <span className="text-[11px] text-white/25 font-mono tracking-widest uppercase">
          Arraste para explorar
        </span>
        <motion.svg
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-4 h-4 text-white/25"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </motion.svg>
      </motion.div>
    </section>
  )
}