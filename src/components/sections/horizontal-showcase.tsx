'use client'

import { useRef, useEffect, useState, useCallback, memo } from 'react'
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShowcaseItem {
  title: string
  description: string
  accent: string
  secondary: string
  Icon3D: React.FC<Icon3DProps>
}

interface Icon3DProps {
  accent: string
  secondary: string
  isActive?: boolean
}

// ─── 3D Animated Icons ────────────────────────────────────────────────────────

// Monitor / Frontend — isometric screen with animated cursor + code lines
const FrontendIcon3D = memo(({ accent, secondary, isActive }: Icon3DProps) => {
  return (
    <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="fe-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="fe-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="fe-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.55" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="fe-screen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d0d1a" />
          <stop offset="100%" stopColor="#080812" />
        </linearGradient>
        <filter id="fe-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="fe-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={accent} floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="60" cy="93" rx="36" ry="5" fill={accent} opacity="0.1" />

      {/* Isometric monitor body */}
      <g filter="url(#fe-shadow)">
        {/* Top face */}
        <path d="M60 18 L92 34 L92 70 L60 54 Z" fill="url(#fe-right)" />
        <path d="M28 34 L60 18 L60 54 L28 70 Z" fill="url(#fe-left)" />
        {/* Screen (front face) */}
        <path d="M28 70 L60 54 L92 70 L92 88 L60 78 L28 88 Z" fill="#0a0a16" />
        {/* Top edge */}
        <path d="M28 34 L60 18 L92 34 L60 50 Z" fill="url(#fe-top)" />
      </g>

      {/* Screen content on top face */}
      <g>
        {/* Code line 1 */}
        <motion.rect
          x="36" y="38" rx="1" ry="1" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 14 : 10 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          fill={accent} opacity="0.9"
        />
        <motion.rect
          x="52" y="38" rx="1" ry="1" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 18 : 14 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          fill="white" opacity="0.3"
        />
        {/* Code line 2 */}
        <motion.rect
          x="40" y="43" rx="1" ry="1" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 10 : 8 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          fill={secondary} opacity="0.85"
        />
        <motion.rect
          x="52" y="43" rx="1" ry="1" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 22 : 16 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          fill="white" opacity="0.2"
        />
        {/* Code line 3 */}
        <motion.rect
          x="36" y="48" rx="1" ry="1" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 8 : 6 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          fill={accent} opacity="0.7"
        />
        {/* Cursor blink */}
        <motion.rect
          x={isActive ? 46 : 44} y="48" width="1.5" height="2.5" rx="0.5"
          fill="white"
          animate={{ opacity: [1, 1, 0, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.49, 0.5, 0.99, 1] }}
        />
      </g>

      {/* Floating orbs */}
      <motion.circle
        cx="98" cy="26" r="3.5"
        fill={accent} opacity="0.6"
        animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        filter="url(#fe-glow)"
      />
      <motion.circle
        cx="22" cy="46" r="2"
        fill={secondary} opacity="0.45"
        animate={{ y: [0, 4, 0], opacity: [0.45, 0.8, 0.45] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
    </svg>
  )
})
FrontendIcon3D.displayName = 'FrontendIcon3D'

// TypeScript — 3D cube with TS logo on faces
const TypeScriptIcon3D = memo(({ accent, secondary, isActive }: Icon3DProps) => {
  return (
    <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="ts3-top" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="ts3-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="ts3-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.55" />
          <stop offset="100%" stopColor={secondary} stopOpacity="0.8" />
        </linearGradient>
        <filter id="ts-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="ts-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor={accent} floodOpacity="0.3" />
        </filter>
      </defs>

      <ellipse cx="60" cy="90" rx="30" ry="5" fill={accent} opacity="0.12" />

      <motion.g
        filter="url(#ts-shadow)"
        animate={isActive ? { rotateY: [0, 15, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 55px' }}
      >
        {/* Top face */}
        <path d="M60 20 L88 36 L60 52 L32 36 Z" fill="url(#ts3-top)" />
        {/* Left face */}
        <path d="M32 36 L60 52 L60 82 L32 66 Z" fill="url(#ts3-left)" />
        {/* Right face */}
        <path d="M88 36 L88 66 L60 82 L60 52 Z" fill="url(#ts3-right)" />
      </motion.g>

      {/* TS text on right face */}
      <g transform="translate(62, 56) skewY(-18) scale(0.9)">
        <text
          x="0" y="0"
          fontSize="14" fontWeight="800" fontFamily="monospace"
          fill="white" opacity="0.92"
          letterSpacing="-0.5"
        >TS</text>
      </g>

      {/* Edge highlights */}
      <path d="M60 20 L88 36" stroke="white" strokeWidth="0.6" opacity="0.25" />
      <path d="M60 20 L32 36" stroke="white" strokeWidth="0.6" opacity="0.12" />
      <path d="M60 52 L60 82" stroke="white" strokeWidth="0.5" opacity="0.15" />

      {/* Floating mini cubes */}
      <motion.g
        animate={{ y: [0, -5, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M100 28 L108 32 L100 36 L92 32 Z" fill={accent} opacity="0.5" />
        <path d="M92 32 L100 36 L100 42 L92 38 Z" fill={accent} opacity="0.3" />
        <path d="M108 32 L108 38 L100 42 L100 36 Z" fill={secondary} opacity="0.4" />
      </motion.g>

      <motion.circle
        cx="18" cy="58" r="2.5" fill={secondary} opacity="0.4"
        animate={{ y: [0, 5, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        filter="url(#ts-glow)"
      />
    </svg>
  )
})
TypeScriptIcon3D.displayName = 'TypeScriptIcon3D'

// UI/UX — floating panel with 3D layers
const UIUXIcon3D = memo(({ accent, secondary, isActive }: Icon3DProps) => {
  return (
    <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="ux-panel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14142a" />
          <stop offset="100%" stopColor="#0a0a1a" />
        </linearGradient>
        <filter id="ux-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={accent} floodOpacity="0.3" />
        </filter>
        <filter id="ux-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <ellipse cx="60" cy="91" rx="32" ry="5" fill={accent} opacity="0.1" />

      {/* Back panel — shadow layer */}
      <motion.g
        animate={isActive ? { y: [0, -2, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        <rect x="38" y="42" width="44" height="34" rx="5" fill="#0a0a18" opacity="0.7"
          style={{ filter: `drop-shadow(0 4px 12px ${accent}30)` }} />
      </motion.g>

      {/* Mid panel */}
      <motion.g
        animate={isActive ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      >
        <rect x="32" y="35" width="52" height="38" rx="6" fill="#10102a"
          style={{ filter: `drop-shadow(0 6px 14px ${accent}25)` }} />
        {/* Header bar */}
        <rect x="32" y="35" width="52" height="10" rx="6" fill={accent} opacity="0.18" />
        <rect x="32" y="41" width="52" height="4" fill={accent} opacity="0.1" />
        {/* Traffic lights */}
        <circle cx="40" cy="40" r="2" fill="#ff5f57" opacity="0.7" />
        <circle cx="47" cy="40" r="2" fill="#febc2e" opacity="0.7" />
        <circle cx="54" cy="40" r="2" fill="#28c840" opacity="0.7" />
      </motion.g>

      {/* Front panel — main card */}
      <motion.g
        filter="url(#ux-shadow)"
        animate={isActive ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="26" y="26" width="56" height="42" rx="7" fill="url(#ux-panel)"
          stroke={accent} strokeWidth="0.8" strokeOpacity="0.3" />
        {/* Title bar */}
        <rect x="26" y="26" width="56" height="11" rx="7" fill={accent} opacity="0.12" />
        <rect x="26" y="33" width="56" height="4" fill={accent} opacity="0.06" />
        {/* Controls */}
        <circle cx="34" cy="31.5" r="2.2" fill="#ff5f57" opacity="0.75" />
        <circle cx="41.5" cy="31.5" r="2.2" fill="#febc2e" opacity="0.75" />
        <circle cx="49" cy="31.5" r="2.2" fill="#28c840" opacity="0.75" />

        {/* Avatar placeholder */}
        <circle cx="38" cy="47" r="7" fill={accent} opacity="0.15" />
        <circle cx="38" cy="44.5" r="3" fill={accent} opacity="0.4" />
        <path d="M31 53 Q38 49 45 53" fill={accent} opacity="0.3" />

        {/* Name + bars */}
        <rect x="49" y="42" width="24" height="3" rx="1.5" fill="white" opacity="0.5" />
        <rect x="49" y="48" width="16" height="2.5" rx="1.2" fill="white" opacity="0.25" />

        {/* Progress bars */}
        <rect x="32" y="59" width="36" height="2.5" rx="1.2" fill="white" opacity="0.08" />
        <motion.rect
          x="32" y="59" rx="1.2" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 26 : 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          fill={accent} opacity="0.8"
        />
        <rect x="32" y="64" width="36" height="2.5" rx="1.2" fill="white" opacity="0.08" />
        <motion.rect
          x="32" y="64" rx="1.2" height="2.5"
          initial={{ width: 0 }}
          animate={{ width: isActive ? 32 : 24 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          fill={secondary} opacity="0.7"
        />
      </motion.g>

      {/* Floating cursor */}
      <motion.g
        filter="url(#ux-glow)"
        animate={{
          x: isActive ? [0, 8, 4, 12, 0] : [0, 4, 0],
          y: isActive ? [0, -3, 6, 2, 0] : [0, 3, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M72 22 L72 34 L75 30 L78 36 L79.5 35.2 L76.5 29.2 L80 29.2 Z"
          fill="white" opacity="0.85" stroke={accent} strokeWidth="0.5" />
      </motion.g>
    </svg>
  )
})
UIUXIcon3D.displayName = 'UIUXIcon3D'

// Performance — 3D gauge speedometer
const PerformanceIcon3D = memo(({ accent, secondary, isActive }: Icon3DProps) => {
  const needleAngle = isActive ? -35 : -60
  return (
    <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="perf-arc" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="35%" stopColor={accent} />
          <stop offset="100%" stopColor={secondary} />
        </linearGradient>
        <linearGradient id="perf-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#14142a" />
          <stop offset="100%" stopColor="#0a0a18" />
        </linearGradient>
        <filter id="perf-needle">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="perf-shadow">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor={accent} floodOpacity="0.28" />
        </filter>
        <filter id="perf-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <ellipse cx="60" cy="88" rx="30" ry="5" fill={secondary} opacity="0.12" />

      {/* 3D base disc */}
      <ellipse cx="60" cy="74" rx="34" ry="8" fill={accent} opacity="0.08" />
      <path d="M26 66 Q26 74 60 78 Q94 74 94 66 L94 70 Q94 78 60 82 Q26 78 26 70 Z"
        fill="#08080f" opacity="0.6" />

      <g filter="url(#perf-shadow)">
        {/* Gauge body — semi-circle */}
        <path d="M22 68 A38 38 0 0 1 98 68 L90 68 A30 30 0 0 0 30 68 Z"
          fill="url(#perf-body)" />

        {/* Track background */}
        <path d="M28 66 A32 32 0 0 1 92 66" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Active arc */}
        <motion.path
          d="M28 66 A32 32 0 0 1 92 66"
          stroke="url(#perf-arc)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0.4 }}
          animate={{ pathLength: isActive ? 0.82 : 0.58 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Tick marks */}
        {[0, 36, 72, 108, 144, 180].map((deg, i) => {
          const rad = ((180 - deg) * Math.PI) / 180
          const r1 = 24, r2 = 30
          const cx = 60, cy = 66
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(rad)} y1={cy - r1 * Math.sin(rad)}
              x2={cx + r2 * Math.cos(rad)} y2={cy - r2 * Math.sin(rad)}
              stroke="#334155" strokeWidth={i === 0 || i === 5 ? 1.5 : 0.8}
              opacity="0.7"
            />
          )
        })}
      </g>

      {/* Score */}
      <motion.text
        x="60" y="58"
        textAnchor="middle"
        fontSize="20" fontWeight="800" fontFamily="monospace"
        fill="white" opacity="0.95"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isActive ? '98' : '87'}
      </motion.text>
      <text x="60" y="67" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#475569" letterSpacing="2">SCORE</text>

      {/* Needle */}
      <motion.g
        filter="url(#perf-needle)"
        animate={{ rotate: needleAngle }}
        initial={{ rotate: -80 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: '60px 66px' }}
      >
        <line x1="60" y1="66" x2="60" y2="38" stroke={secondary} strokeWidth="2" strokeLinecap="round" />
        <line x1="60" y1="66" x2="60" y2="72" stroke={secondary} strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      </motion.g>

      {/* Center cap */}
      <circle cx="60" cy="66" r="4.5" fill="#0a0a18" stroke={accent} strokeWidth="1.5" />
      <circle cx="60" cy="66" r="2" fill={secondary} filter="url(#perf-glow)" />

      {/* Floating particles */}
      <motion.circle cx="100" cy="38" r="2.5" fill={secondary} opacity="0.5"
        animate={{ y: [0, -4, 0], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        filter="url(#perf-glow)"
      />
      <motion.circle cx="20" cy="50" r="1.8" fill={accent} opacity="0.4"
        animate={{ y: [0, 4, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.3, repeat: Infinity, delay: 0.7 }}
      />
    </svg>
  )
})
PerformanceIcon3D.displayName = 'PerformanceIcon3D'

// Responsive — stacked device cards in 3D
const ResponsiveIcon3D = memo(({ accent, secondary, isActive }: Icon3DProps) => {
  return (
    <svg viewBox="0 0 120 100" fill="none" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="resp3-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14142a" />
          <stop offset="100%" stopColor="#0a0a18" />
        </linearGradient>
        <filter id="resp-shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor={accent} floodOpacity="0.25" />
        </filter>
        <filter id="resp-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <ellipse cx="60" cy="90" rx="34" ry="5" fill={accent} opacity="0.1" />

      {/* Desktop monitor — back */}
      <motion.g
        filter="url(#resp-shadow)"
        animate={isActive ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <rect x="24" y="28" width="58" height="40" rx="5" fill="url(#resp3-bg)"
          stroke={accent} strokeWidth="0.7" strokeOpacity="0.3" />
        <rect x="28" y="32" width="50" height="28" rx="2" fill="#080812" />
        <rect x="46" y="68" width="14" height="5" rx="1" fill="#0f0f1f" />
        <rect x="40" y="72" width="26" height="2.5" rx="1.2" fill="#0f0f1f" />
        {/* Screen bars */}
        <rect x="32" y="36" width="38" height="3" rx="1.2" fill={accent} opacity="0.5" />
        <rect x="32" y="42" width="26" height="2.5" rx="1" fill="white" opacity="0.12" />
        <rect x="32" y="47" width="32" height="2.5" rx="1" fill={secondary} opacity="0.3" />
        <rect x="32" y="52" width="20" height="2.5" rx="1" fill="white" opacity="0.1" />
      </motion.g>

      {/* Phone — front right */}
      <motion.g
        filter="url(#resp-shadow)"
        animate={isActive ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="74" y="34" width="26" height="44" rx="5" fill="url(#resp3-bg)"
          stroke={secondary} strokeWidth="0.8" strokeOpacity="0.45" />
        <rect x="77" y="39" width="20" height="30" rx="2" fill="#080812" />
        <circle cx="87" cy="82" r="2.5" fill="#111125" />
        {/* Phone screen */}
        <rect x="80" y="43" width="14" height="3" rx="1.2" fill={secondary} opacity="0.7" />
        <rect x="80" y="49" width="10" height="2" rx="1" fill="white" opacity="0.2" />
        <rect x="80" y="54" width="12" height="2" rx="1" fill={accent} opacity="0.35" />
        <rect x="80" y="60" width="8" height="6" rx="2" fill={secondary} opacity="0.5" />
      </motion.g>

      {/* Connecting line */}
      <motion.path
        d="M72 56 Q73 56 74 55"
        stroke={accent} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />

      {/* Floating breakpoint badge */}
      <motion.g
        filter="url(#resp-glow)"
        animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <rect x="18" y="20" width="20" height="10" rx="3" fill={accent} opacity="0.2"
          stroke={accent} strokeWidth="0.7" strokeOpacity="0.5" />
        <text x="28" y="27.5" textAnchor="middle" fontSize="5.5" fontFamily="monospace"
          fill={accent} opacity="0.9">md</text>
      </motion.g>
    </svg>
  )
})
ResponsiveIcon3D.displayName = 'ResponsiveIcon3D'

// ─── Data ────────────────────────────────────────────────────────────────────

const showcaseItems: ShowcaseItem[] = [
  {
    title: 'Frontend',
    description: 'Interfaces modernas com React e Next.js',
    accent: '#818cf8',
    secondary: '#38bdf8',
    Icon3D: FrontendIcon3D,
  },
  {
    title: 'TypeScript',
    description: 'Código tipado, robusto e escalável',
    accent: '#3b82f6',
    secondary: '#6366f1',
    Icon3D: TypeScriptIcon3D,
  },
  {
    title: 'UI/UX',
    description: 'Design focado na experiência do usuário',
    accent: '#a78bfa',
    secondary: '#f472b6',
    Icon3D: UIUXIcon3D,
  },
  {
    title: 'Performance',
    description: 'Aplicações rápidas e altamente otimizadas',
    accent: '#38bdf8',
    secondary: '#34d399',
    Icon3D: PerformanceIcon3D,
  },
  {
    title: 'Responsivo',
    description: 'Perfeito em qualquer dispositivo ou tela',
    accent: '#6366f1',
    secondary: '#818cf8',
    Icon3D: ResponsiveIcon3D,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ─── Mobile Card with Swipe + Tilt ───────────────────────────────────────────

function MobileCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const [pressed, setPressed] = useState(false)
  const [active, setActive] = useState(false)

  // Touch tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 28 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 28 })
  const shine = useTransform(
    [mx, my] as any,
    ([lx, ly]: number[]) =>
      `radial-gradient(ellipse at ${(lx + 0.5) * 100}% ${(ly + 0.5) * 100}%, ${item.accent}22 0%, transparent 65%)`
  )

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const t = e.touches[0]
    mx.set((t.clientX - r.left) / r.width - 0.5)
    my.set((t.clientY - r.top) / r.height - 0.5)
  }, [mx, my])

  const onTouchStart = useCallback(() => {
    setPressed(true)
    setActive(true)
  }, [])

  const onTouchEnd = useCallback(() => {
    setPressed(false)
    mx.set(0); my.set(0)
    setTimeout(() => setActive(false), 600)
  }, [mx, my])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900, zIndex: pressed ? 10 : 1 }}
    >
      <motion.div
        ref={ref}
        className="relative rounded-2xl overflow-hidden select-none"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(10,10,22,0.88)',
          border: `1px solid ${pressed ? item.accent + '55' : item.accent + '22'}`,
          boxShadow: pressed
            ? `0 20px 50px rgba(0,0,0,0.5), 0 0 40px ${item.accent}22`
            : '0 8px 32px rgba(0,0,0,0.35)',
          transition: 'border-color 0.25s, box-shadow 0.25s',
        }}
        onTouchMove={onTouchMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        whileTap={{ scale: 0.975 }}
      >
        {/* Top bar accent */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, transparent, ${item.accent}80 35%, ${item.accent} 50%, ${item.accent}80 65%, transparent)` }} />

        {/* Mouse-follow shine */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: shine }} />

        <div className="flex items-center gap-4 p-5">
          {/* 3D Icon */}
          <motion.div
            className="w-20 h-16 shrink-0"
            animate={active ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <item.Icon3D accent={item.accent} secondary={item.secondary} isActive={active} />
          </motion.div>

          <div className="flex-1 min-w-0">
            {/* Step label */}
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-4 h-px" style={{ background: item.accent }} />
              <span className="text-[10px] font-mono tracking-widest uppercase"
                style={{ color: item.accent, opacity: 0.8 }}>
                0{index + 1}
              </span>
            </div>
            <h3 className="text-[15px] font-bold tracking-tight mb-1" style={{ color: '#E8E4F8' }}>
              {item.title}
            </h3>
            <p className="text-[12px] leading-relaxed" style={{ color: '#6B6988' }}>
              {item.description}
            </p>
          </div>

          {/* Arrow indicator */}
          <motion.div
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: item.accent + '18', border: `1px solid ${item.accent}30` }}
            animate={active ? { scale: 1.2, background: item.accent + '35' } : {}}
            transition={{ duration: 0.25 }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6H9.5M6.5 3.5L9.5 6L6.5 8.5"
                stroke={item.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* Active ripple overlay */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ background: `radial-gradient(ellipse at 50% 50%, ${item.accent}30, transparent 70%)` }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

// ─── Mobile Showcase ─────────────────────────────────────────────────────────

function MobileShowcase() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, amount: 0.3 })

  return (
    <section className="relative py-16 px-4 overflow-hidden" style={{ background: '#050311' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 right-0 h-1/2 opacity-60"
          style={{ background: 'radial-gradient(ellipse 120% 50% at 50% 0%, rgba(99,102,241,0.07), transparent)' }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
      </div>

      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative mb-8"
      >
        <span className="block text-xs font-mono tracking-[0.22em] uppercase mb-2"
          style={{ color: 'rgba(139,92,246,0.7)' }}>
          O que faço
        </span>
        <h2 className="text-2xl font-black tracking-tight leading-tight">
          <span style={{ color: '#E8E4F8' }}>Áreas de </span>
          <span style={{
            background: 'linear-gradient(90deg, #818cf8, #a78bfa, #e879f9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>atuação</span>
        </h2>
        <p className="text-[13px] mt-2" style={{ color: '#5A5870' }}>
          Toque nos cards para explorar
        </p>
      </motion.div>

      {/* Cards */}
      <div className="relative flex flex-col gap-3">
        {showcaseItems.map((item, i) => (
          <MobileCard key={item.title} item={item} index={i} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-6 p-5 rounded-2xl text-center overflow-hidden"
        style={{ border: '1px dashed rgba(139,92,246,0.18)', background: 'rgba(8,6,20,0.7)' }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)' }} />
        </div>
        <div className="relative">
          <h3 className="text-base font-bold mb-1" style={{ color: '#E8E4F8' }}>Vamos trabalhar juntos?</h3>
          <p className="text-[12px] mb-4" style={{ color: '#4A4866' }}>
            Entre em contato e criamos algo incrível
          </p>
          <motion.a
            href="#contact"
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.18))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: '#C4B5FD',
            }}
          >
            Iniciar projeto
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Desktop Card ─────────────────────────────────────────────────────────────

function DesktopCard({ item, index, isInView }: { item: ShowcaseItem; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 320, damping: 30 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 320, damping: 30 })
  const shine = useTransform(
    [mx, my] as any,
    ([lx, ly]: number[]) =>
      `radial-gradient(ellipse at ${(lx + 0.5) * 100}% ${(ly + 0.5) * 100}%, ${item.accent}1a 0%, transparent 60%)`
  )

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }, [mx, my])

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0)
    setHovered(false)
  }, [mx, my])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.94 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={cardRef}
        className="group relative w-[340px] h-[460px] rounded-2xl shrink-0 flex flex-col overflow-hidden cursor-default"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          background: 'rgba(8,8,20,0.9)',
          border: `1px solid ${hovered ? item.accent + '45' : item.accent + '1a'}`,
          boxShadow: hovered
            ? `0 24px 60px rgba(0,0,0,0.55), 0 0 60px ${item.accent}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
          transition: 'border-color 0.3s, box-shadow 0.35s',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        whileHover={{ z: 22 }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${item.accent}60 25%, ${item.accent} 50%, ${item.accent}60 75%, transparent)`,
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 0.3s',
          }} />

        {/* Glass shine */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />

        {/* Mouse-follow shine */}
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: shine }} />

        {/* Ghost number */}
        <div className="absolute -top-2 -right-1 select-none pointer-events-none font-black"
          aria-hidden
          style={{
            fontSize: 88, lineHeight: 1, letterSpacing: '-0.06em',
            color: item.accent, opacity: hovered ? 0.1 : 0.05, transition: 'opacity 0.3s',
          }}>
          0{index + 1}
        </div>

        {/* Icon */}
        <div className="flex-1 flex items-center justify-center px-8 pt-10 pb-2">
          <motion.div
            className="w-full"
            style={{ maxHeight: 180 }}
            animate={hovered ? { scale: 1.06, y: -4 } : { scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <item.Icon3D accent={item.accent} secondary={item.secondary} isActive={hovered} />
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-7 pb-8">
          <div className="h-px mb-5"
            style={{ background: `linear-gradient(90deg, ${item.accent}60, ${item.accent}15 70%, transparent)` }} />

          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px opacity-60" style={{ background: item.accent }} />
            <span className="text-[10px] font-mono tracking-[0.18em] uppercase"
              style={{ color: item.accent, opacity: 0.8 }}>0{index + 1}</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: '#F0ECFF' }}>
            {item.title}
          </h3>
          <p className="text-[13px] leading-relaxed" style={{ color: '#5A5870' }}>
            {item.description}
          </p>
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 25%, ${item.accent}0d, transparent)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s',
          }} />
      </motion.div>
    </motion.div>
  )
}

// ─── Desktop Showcase ─────────────────────────────────────────────────────────

function DesktopShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })

  useEffect(() => {
    const container = containerRef.current
    const scrollEl = scrollRef.current
    if (!container || !scrollEl) return

    const totalWidth = scrollEl.scrollWidth - window.innerWidth + 120
    const ctx = gsap.context(() => {
      gsap.to(scrollEl, {
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
      className="h-screen overflow-hidden relative"
      style={{ background: '#050311' }}
      aria-label="Áreas de atuação"
    >
      {/* Ambient */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07), transparent)',
        }} />
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: '40%', height: '60%',
          background: 'radial-gradient(ellipse at center, rgba(109,40,217,0.04), transparent)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="absolute top-20 left-12 z-10"
      >
        <span className="block text-xs font-mono tracking-[0.22em] uppercase mb-2"
          style={{ color: 'rgba(139,92,246,0.65)' }}>
          O que faço
        </span>
        <h2 className="text-4xl font-black tracking-tight">
          <span style={{ color: '#E8E4F8' }}>Áreas de </span>
          <span style={{
            background: 'linear-gradient(90deg, #7C3AED, #A855F7, #E879F9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>atuação</span>
        </h2>
      </motion.div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        className="flex items-center h-full gap-5 pl-12 pr-24 pt-28"
        style={{ width: 'max-content' }}
      >
        {showcaseItems.map((item, i) => (
          <DesktopCard key={item.title} item={item} index={i} isInView={isInView} />
        ))}

        {/* CTA card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-[300px] h-[460px] rounded-2xl shrink-0 flex flex-col items-center justify-center px-8 relative overflow-hidden"
          style={{ border: '1px dashed rgba(139,92,246,0.15)', background: 'rgba(8,6,20,0.6)' }}
        >
          <div aria-hidden className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)' }} />

          <div className="relative z-10 text-center">
            <motion.div
              className="w-12 h-12 rounded-xl mb-7 mx-auto flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(168,85,247,0.12))',
                border: '1px solid rgba(139,92,246,0.28)',
              }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <defs>
                  <linearGradient id="star-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#e879f9" />
                  </linearGradient>
                </defs>
                <path d="M10 2L12.5 7.5L18 10L12.5 12.5L10 18L7.5 12.5L2 10L7.5 7.5L10 2Z" fill="url(#star-g)" />
              </svg>
            </motion.div>

            <h3 className="text-lg font-bold mb-2 tracking-tight" style={{ color: '#E8E4F8' }}>
              Vamos trabalhar juntos?
            </h3>
            <p className="text-[13px] leading-relaxed mb-8" style={{ color: '#4A4866' }}>
              Entre em contato e vamos criar algo incrível
            </p>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.18))',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#C4B5FD',
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

      {/* Drag hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3"
        aria-hidden
      >
        <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Arraste para explorar
        </span>
        <motion.svg
          animate={{ x: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </motion.svg>
      </motion.div>
    </section>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function HorizontalShowcase() {
  const isMobile = useIsMobile()

  if (isMobile === null) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: '#050311' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: 'rgba(139,92,246,0.25)', borderTopColor: '#8B5CF6' }} />
      </div>
    )
  }

  return isMobile ? <MobileShowcase /> : <DesktopShowcase />
}

export default HorizontalShowcase