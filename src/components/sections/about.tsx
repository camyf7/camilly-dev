'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────

interface KeyDef  { label: string; flex: number }
interface ChipDef { label: string; color: string; side: 'left' | 'right'; yPct: number }
interface StatDef { value: number; suffix: string; label: string }

type Phase = 'boot' | 'ask-name' | 'ready'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATS: StatDef[] = [
  { value: 18,  suffix: '',  label: 'Anos' },
  { value: 2,   suffix: '+', label: 'Anos de experiência' },
  { value: 21,  suffix: '+', label: 'Projetos no GitHub' },
  { value: 100, suffix: '+', label: 'Commits' },
]

const CODE_PALETTE = [
  '#a855f7', '#ec4899', '#818cf8', '#06b6d4',
  '#7c3aed', '#f472b6', '#34d399', '#fb923c',
] as const

// [indent, initialWidth, color]
const CODE_LINES: [number, number, string][] = [
  [0, 62, '#a855f7'],  [14, 74, '#ec4899'], [14, 46, '#818cf8'],
  [28, 88, '#06b6d4'], [28, 56, '#7c3aed'], [14, 38, '#f472b6'],
  [0, 26, '#a855f7'],  [0, 68, '#818cf8'],  [14, 82, '#06b6d4'],
  [14, 54, '#a855f7'], [28, 44, '#7c3aed'], [28, 72, '#ec4899'],
  [14, 92, '#06b6d4'], [0, 42, '#818cf8'],  [0, 60, '#a855f7'],
  [14, 34, '#34d399'],
]

const KEY_ROWS: KeyDef[][] = [
  [
    { label: '`', flex: 7 }, { label: '1', flex: 7 }, { label: '2', flex: 7 },
    { label: '3', flex: 7 }, { label: '4', flex: 7 }, { label: '5', flex: 7 },
    { label: '6', flex: 7 }, { label: '7', flex: 7 }, { label: '8', flex: 7 },
    { label: '9', flex: 7 }, { label: '0', flex: 7 }, { label: '-', flex: 7 },
    { label: '=', flex: 7 }, { label: '⌫', flex: 11 },
  ],
  [
    { label: '⇥', flex: 11 }, { label: 'Q', flex: 7 }, { label: 'W', flex: 7 },
    { label: 'E', flex: 7 },  { label: 'R', flex: 7 }, { label: 'T', flex: 7 },
    { label: 'Y', flex: 7 },  { label: 'U', flex: 7 }, { label: 'I', flex: 7 },
    { label: 'O', flex: 7 },  { label: 'P', flex: 7 }, { label: '[', flex: 7 },
    { label: ']', flex: 7 },  { label: '\\', flex: 9 },
  ],
  [
    { label: '⇪', flex: 12 }, { label: 'A', flex: 7 }, { label: 'S', flex: 7 },
    { label: 'D', flex: 7 },  { label: 'F', flex: 7 }, { label: 'G', flex: 7 },
    { label: 'H', flex: 7 },  { label: 'J', flex: 7 }, { label: 'K', flex: 7 },
    { label: 'L', flex: 7 },  { label: ';', flex: 7 }, { label: "'", flex: 7 },
    { label: '↵', flex: 12 },
  ],
  [
    { label: '⇧', flex: 16 }, { label: 'Z', flex: 7 }, { label: 'X', flex: 7 },
    { label: 'C', flex: 7 },  { label: 'V', flex: 7 }, { label: 'B', flex: 7 },
    { label: 'N', flex: 7 },  { label: 'M', flex: 7 }, { label: ',', flex: 7 },
    { label: '.', flex: 7 },  { label: '/', flex: 7 },  { label: '⇧', flex: 16 },
  ],
  [
    { label: 'fn', flex: 9 },   { label: 'ctrl', flex: 9 }, { label: '⌥', flex: 9 },
    { label: '⌘', flex: 11 },  { label: '', flex: 34 },    { label: '⌘', flex: 11 },
    { label: '⌥', flex: 9 },   { label: '◁', flex: 7 },   { label: '▽', flex: 7 },
    { label: '▷', flex: 7 },
  ],
]

const CHIPS: ChipDef[] = [
  { label: 'React',      color: '#61DAFB', side: 'left',  yPct: 16 },
  { label: 'Next.js',    color: '#ffffff', side: 'right', yPct: 13 },
  { label: 'TypeScript', color: '#3178C6', side: 'left',  yPct: 57 },
  { label: 'Tailwind',   color: '#38BDF8', side: 'right', yPct: 55 },
  { label: 'Framer',     color: '#a855f7', side: 'right', yPct: 34 },
]

const BOOT_SEQUENCE = [
  'Linux 6.8.0 — IFSP/camilly',
  'Carregando módulos...',
  '[  OK  ] React 18.3 iniciado',
  '[  OK  ] TypeScript 5.4 iniciado',
  '[  OK  ] Tailwind CSS 3.4 ativo',
]

const TYPING_PHRASES = [
  "const camilly = () => <Portfolio />",
  "npm run dev -- --turbo",
  "git commit -m 'feat: amazing ui'",
  "tailwind.config.ts ✓",
  "framer-motion animate={{ opacity: 1 }}",
  "export default function AboutSection()",
  "useState<string>('✨')",
  "useEffect(() => build(), [])",
  "import { motion } from 'framer-motion'",
  "yarn add @types/react",
]

const TERMINAL_CMDS = [
  '$ npm run build — 842ms ✓',
  '$ tsc --noEmit — 0 errors ✓',
  '$ eslint . — no issues ✓',
  '$ git status — clean ✓',
  '$ vitest run — 12 passed ✓',
]

// Laptop canvas dimensions (unscaled) — used only inside the 3D scene
const LAPTOP_W   = 440
const LID_H      = 270
const BASE_H     = 150
const TOTAL_H    = 420 // LID_H + BASE_H - hinge overlap

// ─── Utility ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Returns a scale factor so the 440-wide laptop fits within the viewport.
 * We compute based on the available container width (with padding), not raw
 * window.innerWidth, to stay accurate in any layout.
 */
function useLaptopScale(containerRef: React.RefObject<HTMLDivElement | null>): number {
  // SSR CONTRACT: useState must start with the same value on server and client.
  // Using window.innerWidth in the initialiser causes a hydration mismatch because
  // the server always renders scale=1 (no window). We always start with 1, which
  // matches the server, then ResizeObserver corrects it client-side after mount.
  // overflow:hidden on the scene container clips any momentary full-size flash.
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setScale(clamp((entry.contentRect.width - 32) / LAPTOP_W, 0.38, 1))
    })
    // observe fires synchronously on the first frame, so the flash is ≤1 paint
    observer.observe(el)
    return () => observer.disconnect()
  }, [containerRef])

  return scale
}

/**
 * Pointer-Events based drag hook.
 * Uses setPointerCapture so drag continues even when cursor leaves the element.
 * touch-action: none on the container (CSS) prevents scroll conflicts —
 * no preventDefault() needed, no passive-listener warnings.
 */
function useDrag(onTransform: (rx: number, ry: number) => void) {
  const rotX   = useRef(16)
  const rotY   = useRef(-8)
  const active = useRef(false)
  const last   = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    active.current = true
    last.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current) return
    rotY.current += (e.clientX - last.current.x) * 0.55
    rotX.current  = clamp(
      rotX.current - (e.clientY - last.current.y) * 0.45,
      -32, 38,
    )
    last.current = { x: e.clientX, y: e.clientY }
    onTransform(rotX.current, rotY.current)
  }, [onTransform])

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    active.current = false
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp, rotX, rotY }
}

// ─── KeyCap ───────────────────────────────────────────────────────────────────

interface KeyCapProps {
  label:   string
  flex:    number
  scale:   number
  active:  boolean
  onPress: (label: string) => void
}

function KeyCap({ label, flex, scale, active, onPress }: KeyCapProps) {
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (label) onPress(label)
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        flex,
        height: '100%',
        borderRadius: 2,
        background: active
          ? 'rgba(168,85,247,0.62)'
          : label === ''
          ? 'rgba(168,85,247,0.06)'
          : 'rgba(168,85,247,0.13)',
        border: '0.5px solid rgba(168,85,247,0.1)',
        cursor: label ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.max(3, 5 * scale),
        color: 'rgba(200,180,255,0.45)',
        fontFamily: 'monospace',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        transform: active ? 'scaleY(0.72)' : 'scaleY(1)',
        boxShadow: active ? '0 0 7px rgba(168,85,247,0.5)' : 'none',
        transition: 'background 0.06s, transform 0.06s, box-shadow 0.06s',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {label}
    </div>
  )
}

// ─── Terminal ─────────────────────────────────────────────────────────────────

interface TerminalProps {
  lines:       string[]
  phase:       Phase
  promptInput: string
  userName:    string
}

function Terminal({ lines, phase, promptInput, userName }: TerminalProps) {
  const lineColor = (text: string): string => {
    if (text.startsWith('[  OK  ]'))                       return '#4ade80'
    if (text.startsWith('root@') || text.startsWith('Olá')) return '#a855f7'
    if (text.startsWith('$'))                              return '#06b6d4'
    if (text.startsWith('>'))                              return '#fb923c'
    return 'rgba(200,200,220,0.7)'
  }

  const Cursor = () => (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.85, repeat: Infinity }}
      style={{
        display: 'inline-block',
        width: 5, height: 10,
        background: '#a855f7',
        borderRadius: 1,
        verticalAlign: 'middle',
      }}
    />
  )

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.72)',
        borderTop: phase === 'ready' ? '1px solid rgba(120,80,240,0.16)' : 'none',
        padding: '6px 10px',
        flex: phase !== 'ready' ? 1 : 'none',
        height: phase === 'ready' ? 82 : 'auto',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: 9,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flexShrink: 0,
      }}
    >
      {lines.slice(-8).map((line, i) => (
        <div
          key={i}
          style={{
            color: lineColor(line ?? ''),
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            fontSize: 9,
          }}
        >
          {line ?? ''}
        </div>
      ))}

      {phase === 'ask-name' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
          <span style={{ color: '#a855f7', fontSize: 9 }}>{'> '}</span>
          <span style={{ color: '#e2e8f0', fontSize: 9 }}>{promptInput}</span>
          <Cursor />
        </div>
      )}

      {phase === 'ready' && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <span style={{ color: '#a855f7', fontFamily: 'monospace', fontSize: 9 }}>
            {`${userName}@camilly:~$ `}
          </span>
          <span style={{ marginLeft: 2 }}><Cursor /></span>
        </div>
      )}
    </div>
  )
}

// ─── CodeEditor ───────────────────────────────────────────────────────────────

interface CodeEditorProps {
  codeWidths: number[]
  codeColors: string[]
}

function CodeEditor({ codeWidths, codeColors }: CodeEditorProps) {
  return (
    <div style={{ flex: 1, padding: '6px 8px', overflow: 'hidden' }}>
      {CODE_LINES.map(([indent], i) => (
        <div
          key={i}
          style={{
            height: 9,
            borderRadius: 2,
            marginBottom: 3,
            marginLeft: indent,
            width: codeWidths[i],
            background: codeColors[i],
            opacity: 0.82,
            transition: 'width 0.28s cubic-bezier(0.23,1,0.32,1), background 0.28s',
          }}
        />
      ))}
    </div>
  )
}

// ─── LaptopBase ───────────────────────────────────────────────────────────────

interface LaptopBaseProps {
  scale:      number
  pressedKey: string | null
  onKeyPress: (label: string) => void
  face:       'front' | 'back'
}

function LaptopBase({ scale, pressedKey, onKeyPress, face }: LaptopBaseProps) {
  const isFront = face === 'front'

  const tokens = {
    keyboardBg:     isFront ? 'linear-gradient(180deg,#1c1930 0%,#131228 100%)' : 'linear-gradient(180deg,#0e0c1e 0%,#0a0818 100%)',
    bodyBg:         isFront ? 'linear-gradient(180deg,#131228 0%,#0d0b1a 100%)' : 'linear-gradient(180deg,#0a0818 0%,#080617 100%)',
    border:         isFront ? 'rgba(140,100,255,0.13)' : 'rgba(100,80,200,0.1)',
    vent:           isFront ? 'rgba(100,80,200,0.14)'  : 'rgba(100,80,200,0.08)',
    trackpadBg:     isFront ? 'rgba(255,255,255,0.025)': 'rgba(255,255,255,0.012)',
    trackpadBorder: isFront ? 'rgba(168,85,247,0.1)'   : 'rgba(168,85,247,0.06)',
  }

  return (
    <div
      style={{
        width: LAPTOP_W,
        height: BASE_H,
        position: 'absolute',
        bottom: 0,
        left: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        ...(face === 'back' && { transform: 'rotateY(180deg)' }),
      }}
    >
      {/* Keyboard housing */}
      <div
        style={{
          width: LAPTOP_W,
          height: 34,
          background: tokens.keyboardBg,
          border: `1px solid ${tokens.border}`,
          borderBottom: 'none',
          borderRadius: '3px 3px 0 0',
          padding: isFront ? '3px 14px 0' : undefined,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
        }}
      >
        {isFront && KEY_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 2, height: 11 }}>
            {row.map((key, ki) => (
              <KeyCap
                key={`${ri}-${ki}`}
                label={key.label}
                flex={key.flex}
                scale={scale}
                active={pressedKey === key.label && key.label !== ''}
                onPress={onKeyPress}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Base body */}
      <div
        style={{
          width: LAPTOP_W,
          height: 116,
          background: tokens.bodyBg,
          border: `1px solid ${tokens.border}`,
          borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          position: 'relative',
        }}
      >
        {/* Vents */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
        }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{ width: 22, height: 3, borderRadius: 1.5, background: tokens.vent }}
            />
          ))}
        </div>

        {/* Trackpad */}
        <div
          onPointerDown={isFront ? (e) => { e.stopPropagation(); onKeyPress('↵') } : undefined}
          style={{
            width: 120,
            height: 70,
            borderRadius: 6,
            background: tokens.trackpadBg,
            border: `0.5px solid ${tokens.trackpadBorder}`,
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: isFront ? 'pointer' : 'default',
            touchAction: isFront ? 'none' : 'auto',
          }}
        />

        {isFront && (
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 9,
            color: 'rgba(168,85,247,0.28)',
            letterSpacing: 4,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}>
            CAMILLY
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Notebook3D ───────────────────────────────────────────────────────────────
// The notebook lives inside a responsive container (provided by the parent).
// It uses ResizeObserver to derive the scale factor — no window.innerWidth
// polling, no fixed breakpoints, no negative margins.
//
// Layout contract:
//   <NotebookWrapper>          ← the parent provides a measured ref
//     <Notebook3D ref={…} />   ← fills that space, clips nothing
//   </NotebookWrapper>

interface Notebook3DProps {
  /** The measured container — used by the ResizeObserver to compute scale */
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function Notebook3D({ containerRef }: Notebook3DProps) {
  const laptopRef      = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)
  const scale          = useLaptopScale(containerRef)

  // ── UI state ────────────────────────────────────────────────────────────
  const [pressedKey,   setPressedKey]   = useState<string | null>(null)
  const [termLines,    setTermLines]    = useState<string[]>([])
  const [promptInput,  setPromptInput]  = useState('')
  const [phase,        setPhase]        = useState<Phase>('boot')
  const [userName,     setUserName]     = useState('')
  const [typedDisplay, setTypedDisplay] = useState('código bonito → experiências memoráveis')
  const [codeWidths,   setCodeWidths]   = useState(() => CODE_LINES.map(([, w]) => w))
  const [codeColors,   setCodeColors]   = useState(() => CODE_LINES.map(([,, c]) => c))

  // Stable refs — avoid stale closures in event-listener callbacks
  const phaseRef   = useRef<Phase>('boot')
  const promptRef  = useRef('')
  const isTyping   = useRef(false)
  const phraseIdx  = useRef(0)

  useEffect(() => { phaseRef.current  = phase },       [phase])
  useEffect(() => { promptRef.current = promptInput }, [promptInput])

  // ── Drag ────────────────────────────────────────────────────────────────
  const applyTransform = useCallback((rx: number, ry: number) => {
    if (laptopRef.current) {
      laptopRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }, [])

  const drag = useDrag(applyTransform)

  // ── Boot sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    let i = 0
    const step = () => {
      if (i < BOOT_SEQUENCE.length) {
        setTermLines(prev => [...prev, BOOT_SEQUENCE[i++]])
        setTimeout(step, 400)
      } else {
        setTimeout(() => {
          setPhase('ask-name')
          setTermLines(prev => [...prev, '', 'root@camilly:~$ Qual é o seu nome?'])
        }, 300)
      }
    }
    const id = setTimeout(step, 500)
    return () => clearTimeout(id)
  }, [])

  // ── Typing animation ─────────────────────────────────────────────────────
  const startTyping = useCallback(() => {
    if (isTyping.current) return
    isTyping.current = true
    const phrase = TYPING_PHRASES[phraseIdx.current++ % TYPING_PHRASES.length]
    let i = 0
    const tick = () => {
      setTypedDisplay(phrase.slice(0, ++i))
      if (i < phrase.length) setTimeout(tick, 46 + Math.random() * 34)
      else isTyping.current = false
    }
    tick()
  }, [])

  // ── Name submit ──────────────────────────────────────────────────────────
  const handleNameSubmit = useCallback(() => {
    const name = promptRef.current.trim() || 'visitante'
    setUserName(name)
    setPromptInput('')
    promptRef.current = ''
    setPhase('ready')
    setTermLines(prev => [
      ...prev,
      `> ${name}`, '',
      `Olá, ${name}! Bem-vindo ao portfólio.`,
      'Iniciando ambiente de desenvolvimento...',
      '[  OK  ] Todos os sistemas prontos.',
    ])
  }, [])

  // ── Key action ───────────────────────────────────────────────────────────
  const handleKeyAction = useCallback((label: string) => {
    setPressedKey(label)
    setTimeout(() => setPressedKey(prev => (prev === label ? null : prev)), 150)

    if (phaseRef.current === 'ask-name') {
      if (label === '↵') { handleNameSubmit(); return }
      if (label === '⌫') {
        setPromptInput(prev => {
          const next = prev.slice(0, -1)
          promptRef.current = next
          return next
        })
        return
      }
      if (label.length === 1 && label.trim()) {
        setPromptInput(prev => {
          const next = prev + label
          promptRef.current = next
          return next
        })
      }
      return
    }

    if (phaseRef.current !== 'ready') return

    const idx = Math.floor(Math.random() * CODE_LINES.length)
    setCodeWidths(prev => {
      const n = [...prev]
      n[idx] = 16 + Math.random() * 80
      return n
    })
    setCodeColors(prev => {
      const n = [...prev]
      n[idx] = CODE_PALETTE[Math.floor(Math.random() * CODE_PALETTE.length)]
      return n
    })
    startTyping()
    setTermLines(prev => [
      ...prev.slice(-6),
      TERMINAL_CMDS[Math.floor(Math.random() * TERMINAL_CMDS.length)],
    ])
  }, [handleNameSubmit, startTyping])

  // ── Physical keyboard ────────────────────────────────────────────────────
  useEffect(() => {
    const ALL_LABELS = KEY_ROWS.flat().map(k => k.label).filter(Boolean)

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === mobileInputRef.current) return

      if (phaseRef.current === 'ask-name') {
        if (e.key === 'Enter')     { handleNameSubmit(); return }
        if (e.key === 'Backspace') { handleKeyAction('⌫'); return }
        if (e.key.length === 1)      handleKeyAction(e.key.toUpperCase())
        return
      }

      handleKeyAction(ALL_LABELS[Math.floor(Math.random() * ALL_LABELS.length)])
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNameSubmit, handleKeyAction])

  // ── Derived dimensions ───────────────────────────────────────────────────
  // The scaled width/height tell the *outer* wrapper how much space to reserve,
  // so the rest of the layout doesn't collapse or overflow.
  const scaledW = LAPTOP_W   * scale
  const scaledH = TOTAL_H    * scale

  // Show decorative chips only when there's enough horizontal room
  const showChips = scale >= 0.85

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* ── 3D scene ─────────────────────────────────────────────────────── */}
      {/*
        Key design decisions:
        1. The outer div is exactly scaledW × scaledH — this is the real DOM
           footprint. No negative margins, no overflow hack.
        2. Inside that, we render the unscaled (440×420) laptop and apply
           transform: scale(scale) with transformOrigin 'top center'.
           The scaling shrinks the visual but the parent already reserved the
           correct scaled space, so nothing collapses.
        3. perspective lives on a *separate* ancestor (not the drag container)
           to prevent it from being inherited by scroll/layout ancestors.
        4. touch-action: none on the drag container replaces all preventDefault
           calls and eliminates passive-listener warnings.
      */}
      <div
        style={{
          position: 'relative',
          width: scaledW,
          height: scaledH,
        }}
      >
        {/* Floating tech chips — absolutely positioned relative to the scene */}
        {showChips && CHIPS.map((chip, i) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.18, duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'absolute',
              [chip.side === 'left' ? 'left' : 'right']: -14,
              top: `${chip.yPct}%`,
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                whiteSpace: 'nowrap',
                background: 'rgba(8,6,20,0.9)',
                border: `1px solid ${chip.color}25`,
                borderRadius: 8,
                padding: '4px 10px',
                fontSize: 10,
                fontFamily: 'monospace',
                color: chip.color,
              }}
            >
              {chip.label}
            </motion.div>
          </motion.div>
        ))}

        {/* Perspective container — isolated from drag/layout ancestors */}
        <div style={{ width: '100%', height: '100%', perspective: 1000, overflow: 'hidden' }}>
          {/* Drag surface — touch-action: none prevents scroll without preventDefault */}
          <div
            style={{
              width: '100%',
              height: '100%',
              touchAction: 'none',
              cursor: 'grab',
              position: 'relative',
            }}
            onPointerDown={drag.onPointerDown}
            onPointerMove={drag.onPointerMove}
            onPointerUp={drag.onPointerUp}
            onPointerCancel={drag.onPointerUp}
          >
            {/*
              The unscaled laptop is 440px wide but the container is scaledW
              (e.g. 320px on mobile). We position it absolutely at left:50%
              and pull it back by half its unscaled width, then apply the
              CSS scale. This makes any overflow perfectly symmetric on both
              sides — the overflow:hidden on the parent clips it cleanly
              without any horizontal scroll.
            */}
            <div
              style={{
                width: LAPTOP_W,
                height: TOTAL_H,
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: 'top center',
              }}
            >
              {/* Rotatable laptop shell */}
              <div
                ref={laptopRef}
                style={{
                  width: LAPTOP_W,
                  height: TOTAL_H,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${drag.rotX.current}deg) rotateY(${drag.rotY.current}deg)`,
                }}
              >
                {/* ── Lid ── */}
                <div
                  style={{
                    width: LAPTOP_W,
                    height: LID_H,
                    position: 'absolute',
                    bottom: 140,
                    left: 0,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'bottom center',
                    transform: 'rotateX(-26deg)',
                  }}
                >
                  {/* Front face — screen */}
                  <div
                    style={{
                      width: LAPTOP_W,
                      height: LID_H,
                      background: 'linear-gradient(155deg,#1e1b32 0%,#0e0c1e 55%,#14112a 100%)',
                      borderRadius: '14px 14px 3px 3px',
                      border: '1px solid rgba(140,100,255,0.16)',
                      position: 'absolute',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Webcam dot */}
                    <div
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#111', border: '1px solid #2a2a2a',
                        position: 'absolute', top: 7, left: '50%', transform: 'translateX(-50%)',
                      }}
                    >
                      <div style={{
                        width: 2, height: 2, borderRadius: '50%', background: '#ff3b30',
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                      }} />
                    </div>

                    {/* Screen */}
                    <div
                      style={{
                        position: 'absolute', top: 14, left: 22,
                        width: 396, height: 242,
                        background: '#07061a', borderRadius: 5,
                        border: '1px solid rgba(120,80,240,0.2)',
                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                      }}
                    >
                      {/* Title bar */}
                      <div
                        style={{
                          height: 24, background: 'rgba(0,0,0,0.45)',
                          display: 'flex', alignItems: 'center',
                          padding: '0 10px', gap: 5,
                          borderBottom: '1px solid rgba(120,80,240,0.13)', flexShrink: 0,
                        }}
                      >
                        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                          <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                        ))}
                        <span style={{
                          fontSize: 9, color: 'rgba(168,85,247,0.6)',
                          fontFamily: 'monospace', marginLeft: 8,
                        }}>
                          {phase === 'boot'
                            ? 'boot.sh'
                            : phase === 'ask-name'
                            ? 'root@camilly ~'
                            : `${userName}@camilly ~`}
                        </span>
                      </div>

                      {/* Editor body */}
                      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {/* Activity bar */}
                        <div
                          style={{
                            width: 28, background: 'rgba(0,0,0,0.28)',
                            borderRight: '1px solid rgba(255,255,255,0.04)',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', padding: '8px 0', gap: 7,
                          }}
                        >
                          {['⌘', '⊞', '⊙', '⚙'].map((ic, i) => (
                            <div
                              key={i}
                              style={{
                                width: 15, height: 15, borderRadius: 3,
                                background: i === 0 ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.07)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 8,
                                color: i === 0 ? '#d8a4ff' : 'rgba(255,255,255,0.3)',
                              }}
                            >
                              {ic}
                            </div>
                          ))}
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          {phase === 'ready' && (
                            <CodeEditor codeWidths={codeWidths} codeColors={codeColors} />
                          )}
                          <Terminal
                            lines={termLines}
                            phase={phase}
                            promptInput={promptInput}
                            userName={userName}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back face — logo */}
                  <div
                    style={{
                      width: LAPTOP_W, height: LID_H,
                      background: 'linear-gradient(155deg,#0e0c1e 0%,#0a0818 100%)',
                      borderRadius: '14px 14px 3px 3px',
                      border: '1px solid rgba(100,80,200,0.1)',
                      position: 'absolute',
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column', gap: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{
                        fontSize: 42, fontFamily: 'monospace', fontWeight: 'bold',
                        color: 'rgba(168,85,247,0.6)', letterSpacing: -2, lineHeight: 1,
                      }}>L</span>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        border: '3.5px solid rgba(168,85,247,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(168,85,247,0.35)' }} />
                      </div>
                      <div style={{ position: 'relative', width: 38, height: 38 }}>
                        <div style={{ width: 38, height: 38, borderRadius: '50%', border: '3.5px solid rgba(168,85,247,0.6)' }} />
                        <div style={{
                          position: 'absolute', bottom: 1, right: 0,
                          width: 13, height: 3.5, background: 'rgba(168,85,247,0.6)',
                          borderRadius: 2, transform: 'rotate(45deg)', transformOrigin: 'left center',
                        }} />
                      </div>
                    </div>
                    <div style={{ width: 60, height: 1, background: 'rgba(168,85,247,0.25)', borderRadius: 1 }} />
                  </div>
                </div>

                {/* ── Base (front + back) ── */}
                <LaptopBase scale={scale} pressedKey={pressedKey} onKeyPress={handleKeyAction} face="front" />
                <LaptopBase scale={scale} pressedKey={null}       onKeyPress={() => {}}         face="back" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground shadow */}
      <div
        style={{
          width: Math.min(scaledW * 0.55, 280),
          height: 16,
          background: 'radial-gradient(ellipse at center,rgba(100,60,220,0.18) 0%,transparent 70%)',
          borderRadius: '50%',
          marginTop: 4,
          flexShrink: 0,
        }}
      />

      {/* Status pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        style={{
          background: 'rgba(8,6,20,0.88)',
          border: '1px solid rgba(168,85,247,0.16)',
          borderRadius: 999,
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 11,
          fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.48)',
          marginTop: 12,
          maxWidth: scaledW,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#4ade80', flexShrink: 0, display: 'inline-block',
          }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {typedDisplay}
        </span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{
            display: 'inline-block', width: 5, height: 11,
            background: '#a855f7', borderRadius: 1, flexShrink: 0,
          }}
        />
      </motion.div>

      {/* Name input — shown during ask-name phase, sits naturally below the pill */}
      {phase === 'ask-name' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 16,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            maxWidth: scaledW,
            boxSizing: 'border-box',
          }}
        >
          <input
            ref={mobileInputRef}
            value={promptInput}
            onChange={e => {
              setPromptInput(e.target.value)
              promptRef.current = e.target.value
            }}
            onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit() }}
            placeholder="Seu nome..."
            style={{
              flex: 1,
              height: 44,
              borderRadius: 999,
              border: '1px solid rgba(168,85,247,0.3)',
              background: 'transparent',
              padding: '0 16px',
              fontSize: 14,
              fontFamily: 'monospace',
              color: 'inherit',
              outline: 'none',
              minWidth: 0,
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNameSubmit}
            style={{
              height: 44,
              paddingInline: 20,
              borderRadius: 999,
              border: '1px solid rgba(168,85,247,0.4)',
              background: 'transparent',
              color: '#a855f7',
              fontSize: 14,
              fontFamily: 'monospace',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ↵ Entrar
          </motion.button>
        </motion.div>
      )}

      {/* Hint */}
      <p
        style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'monospace',
          textAlign: 'center',
          marginTop: 10,
          padding: '0 16px',
        }}
      >
        {phase === 'ask-name'
          ? 'clique nas teclas ou use o teclado físico'
          : 'arraste para girar o notebook'}
      </p>
    </div>
  )
}

// ─── AboutSection ─────────────────────────────────────────────────────────────

export function AboutSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // notebookColRef is the measured column — passed to Notebook3D for ResizeObserver
  const notebookColRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  // Parallax: track scroll relative to the section.
  // We use two *separate* refs so Framer Motion and GSAP never touch the same element.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const notebookY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const contentY  = useTransform(scrollYProgress, [0, 1], [20, -20])

  // GSAP counter animation — scoped to the section, never conflicts with Framer Motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach(el => {
        gsap.from(el, {
          textContent: 0,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
          snap: { textContent: 1 },
          onUpdate() {
            el.textContent = Math.round(parseFloat(el.textContent ?? '0')).toString()
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      // overflow-hidden is intentionally NOT here — it would clip the parallax
      // and the floating chips. Clipping is handled per-child where needed.
      className="py-16 sm:py-24 md:py-32 lg:py-48 relative"
    >
      {/* Background atmosphere — pointer-events-none so it never intercepts drag */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <motion.div
          className="absolute top-1/2 left-0 w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-accent/5 rounded-full blur-3xl"
          animate={{ x: [-100, 0, -100], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm text-primary tracking-widest uppercase font-mono mb-3 sm:mb-4 block"
          >
            01 / Sobre
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
          >
            Construindo o{' '}
            <span className="text-gradient">futuro digital</span>
          </motion.h2>
        </motion.div>

        {/*
          Main grid:
          - Mobile/Tablet (<lg): single column, notebook on top, text below
          - Desktop (≥lg): two equal columns side-by-side

          We do NOT put overflow:hidden on the grid — the chips need to bleed
          slightly outside their column.
        */}
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 xl:gap-24 items-start lg:items-center">

          {/* ── Left column — Notebook ── */}
          <motion.div
            ref={notebookColRef}
            style={{ y: notebookY }}
            className="relative w-full flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.2 }}
              // Card background decorations — overflow:hidden only on this card,
              // not on the parent, so chips can bleed outside safely via z-index
              className="relative w-full rounded-2xl"
              style={{ isolation: 'isolate' }}
            >
              {/* Card bg */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg,rgba(124,58,237,0.06) 0%,rgba(10,8,24,0.5) 50%,rgba(6,182,212,0.04) 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              />
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  backgroundImage: 'radial-gradient(rgba(168,85,247,0.1) 1px,transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Fake window bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10"
                style={{
                  background: 'rgba(10,8,24,0.92)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8,
                  padding: '4px 8px',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {['#f87171', '#fbbf24', '#4ade80'].map((c, i) => (
                  <span key={i} style={{ fontSize: 8, color: c }}>●</span>
                ))}
                <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>camilly.tsx</span>
              </motion.div>

              {/* Notebook — gets the column ref so its ResizeObserver stays accurate */}
              <div className="relative z-10 pt-12 pb-8 flex justify-center items-center w-full">
                <Notebook3D containerRef={notebookColRef} />
              </div>
            </motion.div>

            {/* Decorative corner frames */}
            {([
              { cls: 'absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-10 sm:w-14 md:w-20 h-10 sm:h-14 md:h-20 border border-primary/20', delay: 0.5 },
              { cls: 'absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 w-12 sm:w-16 md:w-28 h-12 sm:h-16 md:h-28 border border-accent/20',  delay: 0.65 },
            ] as const).map(({ cls, delay }) => (
              <motion.div
                key={delay}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay }}
                className={`${cls} rounded-2xl pointer-events-none`}
              />
            ))}
          </motion.div>

          {/* ── Right column — Text + Stats ── */}
          <motion.div style={{ y: contentY }} className="space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4 sm:space-y-5 md:space-y-6"
            >
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Sou estudante de{' '}
                <span className="text-foreground font-medium">Técnico em Informática para Internet</span>{' '}
                no IFSP, tenho 18 anos e sou apaixonada por construir interfaces web que unem{' '}
                <span className="text-primary">design</span> e{' '}
                <span className="text-accent">tecnologia</span>.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Proativa e organizada, busco aplicar meus conhecimentos em desenvolvimento
                front-end para criar experiências digitais acessíveis e de alta qualidade.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Meu foco está em{' '}
                <span className="text-foreground">React</span>,{' '}
                <span className="text-foreground">TypeScript</span> e{' '}
                <span className="text-foreground">Tailwind CSS</span>, sempre explorando novas
                tecnologias e <span className="text-foreground">animações</span> para entregar
                projetos com excelência.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border/30"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="text-center sm:text-left"
                >
                  <motion.div
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="stat-value" data-target={stat.value}>{stat.value}</span>
                    <span className="text-primary">{stat.suffix}</span>
                  </motion.div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* IFSP badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 sm:gap-3 glass rounded-full px-4 sm:px-6 py-2 sm:py-3"
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 sm:w-4 h-3 sm:h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Estudante</p>
                <p className="text-xs sm:text-sm font-medium">IFSP — Tec. Informática para Internet</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}