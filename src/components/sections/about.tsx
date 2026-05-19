'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type KeyRow = { keys: { label: string; w: number }[] }

// ─── Constants ────────────────────────────────────────────────────────────────
const stats = [
  { value: 18,  suffix: '',  label: 'Anos' },
  { value: 2,   suffix: '+', label: 'Anos de experiência' },
  { value: 21,  suffix: '+', label: 'Projetos no GitHub' },
  { value: 100, suffix: '+', label: 'Commits' },
]

const CODE_PALETTE = [
  '#a855f7','#ec4899','#818cf8','#06b6d4',
  '#7c3aed','#f472b6','#34d399','#fb923c',
]

const CODE_LINES: [number, number, string][] = [
  [0,62,'#a855f7'],[14,74,'#ec4899'],[14,46,'#818cf8'],
  [28,88,'#06b6d4'],[28,56,'#7c3aed'],[14,38,'#f472b6'],
  [0,26,'#a855f7'],[0,68,'#818cf8'],[14,82,'#06b6d4'],
  [14,54,'#a855f7'],[28,44,'#7c3aed'],[28,72,'#ec4899'],
  [14,92,'#06b6d4'],[0,42,'#818cf8'],[0,60,'#a855f7'],
  [14,34,'#34d399'],
]

// w = flex proportion (each row sums to ~100)
const KEY_ROWS: KeyRow[] = [
  { keys: [{label:'`',w:7},{label:'1',w:7},{label:'2',w:7},{label:'3',w:7},{label:'4',w:7},{label:'5',w:7},{label:'6',w:7},{label:'7',w:7},{label:'8',w:7},{label:'9',w:7},{label:'0',w:7},{label:'-',w:7},{label:'=',w:7},{label:'⌫',w:11}] },
  { keys: [{label:'⇥',w:11},{label:'Q',w:7},{label:'W',w:7},{label:'E',w:7},{label:'R',w:7},{label:'T',w:7},{label:'Y',w:7},{label:'U',w:7},{label:'I',w:7},{label:'O',w:7},{label:'P',w:7},{label:'[',w:7},{label:']',w:7},{label:'\\',w:9}] },
  { keys: [{label:'⇪',w:12},{label:'A',w:7},{label:'S',w:7},{label:'D',w:7},{label:'F',w:7},{label:'G',w:7},{label:'H',w:7},{label:'J',w:7},{label:'K',w:7},{label:'L',w:7},{label:';',w:7},{label:"'",w:7},{label:'↵',w:12}] },
  { keys: [{label:'⇧',w:16},{label:'Z',w:7},{label:'X',w:7},{label:'C',w:7},{label:'V',w:7},{label:'B',w:7},{label:'N',w:7},{label:'M',w:7},{label:',',w:7},{label:'.',w:7},{label:'/',w:7},{label:'⇧',w:16}] },
  { keys: [{label:'fn',w:9},{label:'ctrl',w:9},{label:'⌥',w:9},{label:'⌘',w:11},{label:'',w:34},{label:'⌘',w:11},{label:'⌥',w:9},{label:'◁',w:7},{label:'▽',w:7},{label:'▷',w:7}] },
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

const CHIPS = [
  { label: 'React',      color: '#61DAFB', side: 'left',  yPct: 16 },
  { label: 'Next.js',   color: '#ffffff', side: 'right', yPct: 13 },
  { label: 'TypeScript', color: '#3178C6', side: 'left',  yPct: 57 },
  { label: 'Tailwind',  color: '#38BDF8', side: 'right', yPct: 55 },
  { label: 'Framer',    color: '#a855f7', side: 'right', yPct: 34 },
]

const BOOT_SEQUENCE = [
  'Linux 6.8.0 — IFSP/camilly',
  'Carregando módulos...',
  '[  OK  ] React 18.3 iniciado',
  '[  OK  ] TypeScript 5.4 iniciado',
  '[  OK  ] Tailwind CSS 3.4 ativo',
]

const MARQUEE_TECHS = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Framer Motion',
  'Node.js',
  'UI/UX',
  'Responsive Design',
  'Animations',
]

// ─── Notebook3D ───────────────────────────────────────────────────────────────
function Notebook3D() {
  const laptopRef = useRef<HTMLDivElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // 3D rotation
  const rotX = useRef(16)
  const rotY = useRef(-8)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const autoT = useRef(0)
  const autoActive = useRef(true)
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)

  // UI state
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [termLines, setTermLines] = useState<string[]>([])
  const [promptInput, setPromptInput] = useState('')
  const [phase, setPhase] = useState<'boot' | 'ask-name' | 'ready'>('boot')
  const [userName, setUserName] = useState('')
  const [typedDisplay, setTypedDisplay] = useState('código bonito → experiências memoráveis')
  const [codeWidths, setCodeWidths] = useState<number[]>(CODE_LINES.map(([,w]) => w))
  const [codeColors, setCodeColors] = useState<string[]>(CODE_LINES.map(([,,c]) => c))

  // Refs to avoid stale closures
  const phaseRef = useRef<'boot' | 'ask-name' | 'ready'>('boot')
  const promptRef = useRef('')
  const isTyping = useRef(false)
  const phraseIdx = useRef(0)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { promptRef.current = promptInput }, [promptInput])

  // ── Auto rotate ──────────────────────────────────────────────────────────
  const applyTransform = useCallback(() => {
    if (laptopRef.current)
      laptopRef.current.style.transform =
        `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`
  }, [])

  useEffect(() => {
    const tick = () => {
      if (autoActive.current && !isDragging.current) {
        autoT.current += 0.005
        rotY.current = -8 + Math.sin(autoT.current) * 12
        applyTransform()
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [applyTransform])

  const startDrag = (x: number, y: number) => {
  isDragging.current = true
  autoActive.current = false
  lastPos.current = { x, y }

  if (autoTimer.current) {
    clearTimeout(autoTimer.current)
  }
}
  const moveDrag = (x: number, y: number) => {
    if (!isDragging.current) return
    rotY.current = Math.max(-55, Math.min(55, rotY.current + (x - lastPos.current.x) * 0.55))
    rotX.current = Math.max(-32, Math.min(38, rotX.current - (y - lastPos.current.y) * 0.45))
    lastPos.current = { x, y }
    applyTransform()
  }
  const endDrag = () => {
    isDragging.current = false
    autoTimer.current = setTimeout(() => { autoActive.current = true }, 2800)
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let i = 0
    const next = () => {
      if (i < BOOT_SEQUENCE.length) {
        setTermLines(p => [...p, BOOT_SEQUENCE[i++]])
        setTimeout(next, 400)
      } else {
        setTimeout(() => {
          setPhase('ask-name')
          setTermLines(p => [...p, '', 'root@camilly:~$ Qual é o seu nome?'])
        }, 300)
      }
    }
    setTimeout(next, 500)
  }, [])

  // ── Submit name ───────────────────────────────────────────────────────────
  const handleNameSubmit = useCallback(() => {
    const name = promptRef.current.trim() || 'visitante'
    setUserName(name)
    setPromptInput('')
    promptRef.current = ''
    setPhase('ready')
    setTermLines(p => [...p,
      `> ${name}`, '',
      `Olá, ${name}! Bem-vindo ao portfólio.`,
      'Iniciando ambiente de desenvolvimento...',
      '[  OK  ] Todos os sistemas prontos.',
    ])
  }, [])

  // ── Typing animation ──────────────────────────────────────────────────────
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

  // ── Core key action — single source of truth ──────────────────────────────
  const handleKeyAction = useCallback((label: string) => {
    // Flash visual key
    setPressedKey(label)
    setTimeout(() => setPressedKey(p => p === label ? null : p), 150)

    if (phaseRef.current === 'ask-name') {
      if (label === '↵') { handleNameSubmit(); return }
      if (label === '⌫') {
        setPromptInput(p => { const n = p.slice(0, -1); promptRef.current = n; return n })
        return
      }
      if (label.length === 1 && label.trim()) {
        setPromptInput(p => { const n = p + label; promptRef.current = n; return n })
      }
      return
    }

    if (phaseRef.current !== 'ready') return

    // Scramble one code line
    const li = Math.floor(Math.random() * CODE_LINES.length)
    setCodeWidths(p => { const n=[...p]; n[li]=16+Math.random()*80; return n })
    setCodeColors(p => { const n=[...p]; n[li]=CODE_PALETTE[Math.floor(Math.random()*CODE_PALETTE.length)]; return n })

    startTyping()

    const cmds = [
      '$ npm run build — 842ms ✓',
      '$ tsc --noEmit — 0 errors ✓',
      '$ eslint . — no issues ✓',
      '$ git status — clean ✓',
      '$ vitest run — 12 passed ✓',
    ]
    setTermLines(p => [...p.slice(-6), cmds[Math.floor(Math.random() * cmds.length)]])
  }, [handleNameSubmit, startTyping])

  // ── Physical keyboard ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement === mobileInputRef.current) return

      if (phaseRef.current === 'ask-name') {
        if (e.key === 'Enter') { handleNameSubmit(); return }
        if (e.key === 'Backspace') { handleKeyAction('⌫'); return }
        if (e.key.length === 1) handleKeyAction(e.key.toUpperCase())
        return
      }
      const allLabels = KEY_ROWS.flatMap(r => r.keys.map(k => k.label)).filter(Boolean)
      handleKeyAction(allLabels[Math.floor(Math.random() * allLabels.length)])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNameSubmit, handleKeyAction])

  // ── Key component ─────────────────────────────────────────────────────────
  const Key = ({ label, w }: { label: string; w: number }) => {
    const active = pressedKey === label && label !== ''
    return (
      <div
        onPointerDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (label) handleKeyAction(label)
        }}
        className="key-button"
        style={{
          flex: w,
          height: '100%',
          borderRadius: '2px',
          background: active ? 'rgba(168,85,247,0.62)' : label === '' ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.13)',
          border: '0.5px solid rgba(168,85,247,0.1)',
          cursor: label ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'clamp(3px, 1.2vw, 5px)',
          color: 'rgba(200,180,255,0.45)', fontFamily: 'monospace',
          userSelect: 'none', WebkitUserSelect: 'none',
          transform: active ? 'scaleY(0.72)' : 'scaleY(1)',
          boxShadow: active ? '0 0 7px rgba(168,85,247,0.5)' : 'none',
          transition: 'background 0.06s, transform 0.06s, box-shadow 0.06s',
          minWidth: 0, overflow: 'hidden',
          touchAction: 'none',
        }}
      >
        {label}
      </div>
    )
  }

  return (
    <div className="relative w-full flex flex-col items-center select-none px-2 sm:px-4" style={{ minHeight: 'min(400px, 70vw)' }}>

      {/* ── Floating tech chips responsivos ── */}
      {CHIPS.map((chip, i) => (
        <motion.div
          key={chip.label}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.18, duration: 0.38, ease: [0.23,1,0.32,1] }}
          className="hidden sm:block"
          style={{
            position: 'absolute',
            [chip.side === 'left' ? 'left' : 'right']: 'max(-10px, -2%)',
            top: `${chip.yPct}%`, zIndex: 20, pointerEvents: 'none',
          }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            className="whitespace-nowrap"
            style={{
              background: 'rgba(8,6,20,0.9)',
              border: `1px solid ${chip.color}25`,
              borderRadius: '8px', padding: '4px 10px',
              fontSize: 'clamp(8px, 2vw, 10px)',
              fontFamily: 'monospace',
              color: chip.color,
            }}
          >{chip.label}</motion.div>
        </motion.div>
      ))}

      {/* ── 3D scene responsiva ── */}
      <div
        className="w-full flex justify-center"
        style={{ perspective: '1000px', touchAction: 'none' }}
        onMouseDown={e => startDrag(e.clientX, e.clientY)}
        onMouseMove={e => moveDrag(e.clientX, e.clientY)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={e => { startDrag(e.touches[0].clientX, e.touches[0].clientY) }}
        onTouchMove={e => { moveDrag(e.touches[0].clientX, e.touches[0].clientY) }}
        onTouchEnd={endDrag}
      >
        <div className="notebook-shell w-full max-w-[440px] relative">
          <div className="notebook-inner w-[440px] h-[420px] transform origin-top-center mx-auto">
            <div
              ref={laptopRef}
              className="relative"
              style={{
                width: '440px', height: '420px',
                position: 'relative', transformStyle: 'preserve-3d',
                transform: `rotateX(${rotX.current}deg) rotateY(${rotY.current}deg)`,
                cursor: 'grab',
              }}
            >
              {/* ─── LID ─── */}
              <div style={{
                width: '440px', height: '270px',
                position: 'absolute', bottom: '140px', left: 0,
                transformStyle: 'preserve-3d', transformOrigin: 'bottom center',
                transform: 'rotateX(-26deg)',
              }}>
                {/* Face */}
                <div style={{
                  width: '440px', height: '270px',
                  background: 'linear-gradient(155deg,#1e1b32 0%,#0e0c1e 55%,#14112a 100%)',
                  borderRadius: '14px 14px 3px 3px',
                  border: '1px solid rgba(140,100,255,0.16)',
                  position: 'absolute', overflow: 'hidden',
                }}>
                  {/* Webcam */}
                  <div style={{
                    width:'6px',height:'6px',borderRadius:'50%',background:'#111',
                    border:'1px solid #2a2a2a',position:'absolute',
                    top:'7px',left:'50%',transform:'translateX(-50%)',
                  }}>
                    <div style={{width:'2px',height:'2px',borderRadius:'50%',background:'#ff3b30',position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
                  </div>

                  {/* Screen */}
                  <div style={{
                    position:'absolute',top:'14px',left:'22px',
                    width:'396px',height:'242px',
                    background:'#07061a',borderRadius:'5px',
                    border:'1px solid rgba(120,80,240,0.2)',
                    overflow:'hidden',display:'flex',flexDirection:'column',
                  }}>
                    {/* Tab bar */}
                    <div style={{
                      height:'24px',background:'rgba(0,0,0,0.45)',
                      display:'flex',alignItems:'center',
                      padding:'0 10px',gap:'5px',
                      borderBottom:'1px solid rgba(120,80,240,0.13)',
                      flexShrink:0,
                    }}>
                      {['#ff5f57','#febc2e','#28c840'].map((c,i)=>(
                        <div key={i} style={{width:7,height:7,borderRadius:'50%',background:c}}/>
                      ))}
                      <span style={{fontSize:'clamp(8px, 2.5vw, 10px)',color:'rgba(168,85,247,0.6)',fontFamily:'monospace',marginLeft:'8px'}}>
                        {phase==='boot'?'boot.sh':phase==='ask-name'?'root@camilly ~':`${userName}@camilly ~`}
                      </span>
                    </div>

                    {/* Editor */}
                    <div style={{flex:1,display:'flex',overflow:'hidden'}}>
                      {/* Sidebar - esconder em telas muito pequenas */}
                      <div style={{width:'28px',background:'rgba(0,0,0,0.28)',borderRight:'1px solid rgba(255,255,255,0.04)',display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 0',gap:'7px'}} className="hidden sm:flex">
                        {['⌘','⊞','⊙','⚙'].map((ic,i)=>(
                          <div key={i} style={{width:'15px',height:'15px',borderRadius:'3px',background:i===0?'rgba(168,85,247,0.4)':'rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px',color:i===0?'#d8a4ff':'rgba(255,255,255,0.3)'}}>{ic}</div>
                        ))}
                      </div>

                      {/* Code + terminal */}
                      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
                        {phase==='ready'&&(
                          <div style={{flex:1,padding:'6px 8px',overflow:'hidden'}}>
                            {CODE_LINES.map(([indent],i)=>(
                              <div key={i} style={{height:'9px',borderRadius:'2px',marginBottom:'3px',marginLeft:`${indent}px`,width:`${codeWidths[i]}px`,background:codeColors[i],opacity:0.82,transition:'width 0.28s cubic-bezier(0.23,1,0.32,1),background 0.28s'}}/>
                            ))}
                          </div>
                        )}
                        {/* Terminal */}
                        <div style={{
                          background:'rgba(0,0,0,0.72)',
                          borderTop:phase==='ready'?'1px solid rgba(120,80,240,0.16)':'none',
                          padding:'6px 10px',
                          flex:phase!=='ready'?1:'none',
                          height:phase==='ready'?'82px':'auto',
                          overflow:'hidden',fontFamily:'monospace',fontSize:'clamp(7px, 2vw, 9px)',
                          display:'flex',flexDirection:'column',justifyContent:'flex-end',
                        }}>
                          {termLines.slice(-8).map((line, i) => {
  const safeLine = line ?? ''

  return (
    <div
      key={i}
      style={{
        color: safeLine.startsWith('[  OK  ]')
          ? '#4ade80'
          : safeLine.startsWith('root@') || safeLine.startsWith('Olá')
          ? '#a855f7'
          : safeLine.startsWith('$')
          ? '#06b6d4'
          : safeLine.startsWith('>')
          ? '#fb923c'
          : 'rgba(200,200,220,0.7)',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        fontSize: 'clamp(7px, 2vw, 9px)',
      }}
    >
      {safeLine}
    </div>
  )
})}
                          {phase==='ask-name'&&(
                            <div style={{display:'flex',alignItems:'center',gap:'3px',marginTop:'2px'}}>
                              <span style={{color:'#a855f7',fontSize:'clamp(7px, 2vw, 9px)'}}>{'> '}</span>
                              <span style={{color:'#e2e8f0',fontSize:'clamp(7px, 2vw, 9px)'}}>{promptInput}</span>
                              <motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.85,repeat:Infinity}} style={{display:'inline-block',width:'5px',height:'10px',background:'#a855f7',borderRadius:'1px'}}/>
                            </div>
                          )}
                          {phase==='ready'&&(
                            <div style={{display:'flex',alignItems:'center',marginTop:'2px',flexWrap:'wrap'}}>
                              <span style={{color:'#a855f7',fontFamily:'monospace',fontSize:'clamp(7px, 2vw, 9px)'}}>{`${userName}@camilly:~$ `}</span>
                              <motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.85,repeat:Infinity}} style={{display:'inline-block',width:'5px',height:'10px',background:'#a855f7',borderRadius:'1px',marginLeft:'2px'}}/>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lid back */}
                <div style={{width:'440px',height:'270px',background:'linear-gradient(155deg,#0e0c1e 0%,#0a0818 100%)',borderRadius:'14px 14px 3px 3px',border:'1px solid rgba(100,80,200,0.1)',position:'absolute',transform:'rotateX(180deg) translateZ(1px)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:'42px',height:'42px',borderRadius:'10px',background:'rgba(168,85,247,0.07)',border:'1px solid rgba(168,85,247,0.14)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'16px',color:'rgba(168,85,247,0.35)',fontWeight:'bold'}}>C</div>
                </div>
              </div>

              {/* ─── BASE ─── */}
              <div style={{width:'440px',height:'150px',position:'absolute',bottom:0,left:0}}>
                {/* Keyboard housing */}
                <div style={{
                  width:'440px',height:'34px',
                  background:'linear-gradient(180deg,#1c1930 0%,#131228 100%)',
                  border:'1px solid rgba(140,100,255,0.13)',
                  borderBottom:'none',borderRadius:'3px 3px 0 0',
                  padding:'3px 14px 0',
                  display:'flex',flexDirection:'column',gap:'2px',
                  overflow:'hidden',
                }}>
                  {KEY_ROWS.map((row,ri)=>(
                    <div key={ri} style={{display:'flex',gap:'2px',height:'11px'}}>
                      {row.keys.map((key,ki)=>(
                        <Key key={`${ri}-${ki}`} label={key.label} w={key.w}/>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Base body */}
                <div style={{width:'440px',height:'116px',background:'linear-gradient(180deg,#131228 0%,#0d0b1a 100%)',border:'1px solid rgba(120,80,240,0.13)',borderTop:'none',borderRadius:'0 0 10px 10px',position:'relative'}}>
                  {/* Vents - responsivo */}
                  <div style={{position:'absolute',top:'8px',left:'50%',transform:'translateX(-50%)',display:'flex',gap:'clamp(2px, 1vw, 4px)'}}>
                    {Array.from({length:7}).map((_,i)=>(
                      <div key={i} style={{width:'clamp(16px, 5vw, 22px)',height:'3px',borderRadius:'1.5px',background:'rgba(100,80,200,0.14)'}}/>
                    ))}
                  </div>
                  {/* Trackpad */}
                  <div
                    onPointerDown={e=>{e.preventDefault();e.stopPropagation();handleKeyAction('↵')}}
                    style={{width:'clamp(80px, 27vw, 120px)',height:'clamp(46px, 16vw, 70px)',borderRadius:'6px',background:'rgba(255,255,255,0.025)',border:'0.5px solid rgba(168,85,247,0.1)',position:'absolute',bottom:'20px',left:'50%',transform:'translateX(-50%)',cursor:'pointer',touchAction:'none'}}
                  />
                  {/* Brand */}
                  <div style={{position:'absolute',bottom:'8px',left:'50%',transform:'translateX(-50%)',fontSize:'clamp(6px, 2vw, 9px)',color:'rgba(168,85,247,0.28)',letterSpacing:'clamp(2px, 1vw, 4px)',fontFamily:'monospace',whiteSpace:'nowrap'}}>CAMILLY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground shadow responsiva */}
      <div style={{width:'min(55%, 280px)',height:'16px',background:'radial-gradient(ellipse at center,rgba(100,60,220,0.18) 0%,transparent 70%)',borderRadius:'50%',marginTop:'2px'}}/>

      {/* Status pill responsivo */}
      <motion.div
        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.3,duration:0.5}}
        className="responsive-pill"
        style={{
          background:'rgba(8,6,20,0.88)',
          border:'1px solid rgba(168,85,247,0.16)',
          borderRadius:'999px',
          padding:'clamp(4px, 1.5vw, 6px) clamp(12px, 4vw, 16px)',
          display:'flex',
          alignItems:'center',
          gap:'clamp(4px, 2vw, 8px)',
          fontSize:'clamp(9px, 3vw, 11px)',
          fontFamily:'monospace',
          color:'rgba(255,255,255,0.48)',
          marginTop:'12px',
          whiteSpace:'nowrap',
          maxWidth:'95%',
          overflow:'hidden',
          flexShrink:0,
        }}
      >
        <motion.span animate={{scale:[1,1.5,1],opacity:[1,0.5,1]}} transition={{duration:2,repeat:Infinity}} style={{width:'clamp(5px, 2vw, 7px)',height:'clamp(5px, 2vw, 7px)',borderRadius:'50%',background:'#4ade80',flexShrink:0,display:'inline-block'}}/>
        <span style={{overflow:'hidden',textOverflow:'ellipsis'}}>{typedDisplay}</span>
        <motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.9,repeat:Infinity}} style={{display:'inline-block',width:'clamp(3px, 1.5vw, 5px)',height:'clamp(8px, 3vw, 11px)',background:'#a855f7',borderRadius:'1px',flexShrink:0}}/>
      </motion.div>

      {/* Mobile name input */}
      {phase==='ask-name'&&(
        <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className="mt-3 flex gap-2 items-center">
          <input
            ref={mobileInputRef}
            value={promptInput}
            onChange={e=>{setPromptInput(e.target.value);promptRef.current=e.target.value}}
            onKeyDown={e=>{if(e.key==='Enter')handleNameSubmit()}}
            placeholder="Seu nome..."
            className="bg-transparent border border-primary/30 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-mono text-foreground outline-none focus:border-primary/70 w-32 sm:w-40"
          />
          <motion.button
            whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={handleNameSubmit}
            className="px-3 sm:px-4 py-1.5 rounded-full border border-primary/40 text-primary text-xs sm:text-sm font-mono"
          >↵ entrar</motion.button>
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground/40 mt-2 font-mono text-center px-2">
        {phase==='ask-name'?'clique nas teclas ou use o teclado físico':'arraste para rotacionar · clique nas teclas'}
      </p>

      {/* Responsive styles */}
      <style jsx>{`
        .notebook-shell {
          width: 100%;
          max-width: 440px;
          position: relative;
          margin: 0 auto;
        }
        
        .notebook-inner {
          width: 440px;
          height: 420px;
          transform-origin: top center;
          transition: transform 0.3s ease;
        }
        
        /* Responsive breakpoints */
        @media (max-width: 360px) {
          .notebook-shell { max-width: 100%; }
          .notebook-inner { 
            transform: scale(0.52); 
            margin-bottom: -180px;
          }
        }
        
        @media (min-width: 361px) and (max-width: 479px) {
          .notebook-shell { max-width: 100%; }
          .notebook-inner { 
            transform: scale(0.6); 
            margin-bottom: -160px;
          }
        }
        
        @media (min-width: 480px) and (max-width: 639px) {
          .notebook-inner { 
            transform: scale(0.72); 
            margin-bottom: -110px;
          }
        }
        
        @media (min-width: 640px) and (max-width: 767px) {
          .notebook-inner { 
            transform: scale(0.85); 
            margin-bottom: -60px;
          }
        }
        
        @media (min-width: 768px) {
          .notebook-inner { 
            transform: scale(1); 
            margin-bottom: 0;
          }
        }
        
        /* Key buttons responsive */
        .key-button {
          transition: background 0.06s, transform 0.06s, box-shadow 0.06s;
        }
        
        /* Responsive pill text */
        @media (max-width: 480px) {
          .responsive-pill span {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  )
}

// ─── About Section Responsiva ─────────────────────────────────────────────────
export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.15 })

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end','end start'] })
  const imageY = useTransform(scrollYProgress, [0,1], [70,-70])
  const contentY = useTransform(scrollYProgress, [0,1], [35,-35])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.stat-value').forEach(el => {
        const target = parseInt(el.dataset.target ?? '0', 10)
        gsap.from(el, {
          textContent: 0, duration: 2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
          snap: { textContent: 1 },
          onUpdate() { el.textContent = Math.round(parseFloat(el.textContent ?? '0')).toString() },
        })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="py-16 sm:py-24 md:py-32 lg:py-48 relative overflow-hidden">
      {/* Background orbs responsivos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-accent/5 rounded-full blur-3xl" 
          animate={{x:[-100,0,-100],opacity:[0.2,0.4,0.2]}} 
          transition={{duration:14,repeat:Infinity,ease:'easeInOut'}}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[250px] sm:w-[350px] md:w-[400px] h-[250px] sm:h-[350px] md:h-[400px] bg-primary/5 rounded-full blur-3xl" 
          animate={{y:[0,-50,0],opacity:[0.2,0.4,0.2]}} 
          transition={{duration:11,repeat:Infinity,ease:'easeInOut'}}
        />
      </div>

      <div ref={containerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section header responsivo */}
        <motion.div
          initial={{opacity:0,y:50}}
          animate={isInView?{opacity:1,y:0}:{}}
          transition={{duration:0.8}}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <motion.span
            initial={{opacity:0,x:-20}}
            animate={isInView?{opacity:1,x:0}:{}}
            transition={{duration:0.6,delay:0.2}}
            className="text-xs sm:text-sm text-primary tracking-widest uppercase font-mono mb-3 sm:mb-4 block"
          >
            01 / Sobre
          </motion.span>
          <motion.h2
            initial={{opacity:0,y:30}}
            animate={isInView?{opacity:1,y:0}:{}}
            transition={{duration:0.8,delay:0.3}}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
          >
            Construindo o{' '}
            <span className="text-gradient">futuro digital</span>
          </motion.h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          {/* Notebook column responsivo */}
          <motion.div style={{y:imageY}} className="relative">
            <motion.div 
              initial={{opacity:0,scale:0.88}} 
              animate={isInView?{opacity:1,scale:1}:{}} 
              transition={{duration:0.9,delay:0.2}} 
              className="relative rounded-2xl overflow-visible"
              style={{minHeight:'min(440px, 70vw)'}}
            >
              <div className="absolute inset-0 rounded-2xl" style={{
                background:'linear-gradient(135deg,rgba(124,58,237,0.06) 0%,rgba(10,8,24,0.5) 50%,rgba(6,182,212,0.04) 100%)',
                border:'1px solid rgba(255,255,255,0.05)'
              }}/>
              <div className="absolute inset-0 rounded-2xl" style={{
                backgroundImage:'radial-gradient(rgba(168,85,247,0.1) 1px,transparent 1px)',
                backgroundSize:'24px 24px'
              }}/>
              <motion.div 
                initial={{opacity:0,y:-10}} 
                animate={isInView?{opacity:1,y:0}:{}} 
                transition={{delay:0.7,duration:0.5}} 
                className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10"
                style={{
                  background:'rgba(10,8,24,0.92)',
                  border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'8px',
                  padding:'4px 8px sm:5px 12px',
                  fontFamily:'monospace',
                  fontSize:'clamp(9px, 3vw, 11px)',
                  display:'flex',
                  alignItems:'center',
                  gap:'4px sm:6px'
                }}
              >
                <span style={{color:'#f87171', fontSize:'clamp(6px, 2vw, 8px)'}}>●</span>
                <span style={{color:'#fbbf24', fontSize:'clamp(6px, 2vw, 8px)'}}>●</span>
                <span style={{color:'#4ade80', fontSize:'clamp(6px, 2vw, 8px)'}}>●</span>
                <span style={{color:'rgba(255,255,255,0.3)',marginLeft:'4px', fontSize:'clamp(8px, 2.5vw, 11px)'}}>camilly.tsx</span>
              </motion.div>
              <div className="relative z-10 pt-4 sm:pt-5 md:pt-6 px-1 sm:px-3 md:px-4">
                <Notebook3D />
              </div>
            </motion.div>
            
            {/* Decorative corners responsivos */}
            <motion.div 
              initial={{opacity:0,scale:0}} 
              animate={isInView?{opacity:1,scale:1}:{}} 
              transition={{duration:0.6,delay:0.5}} 
              className="absolute -top-3 sm:-top-4 md:-top-5 -right-3 sm:-right-4 md:-right-5 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 border border-primary/20 rounded-xl sm:rounded-2xl pointer-events-none"
            />
            <motion.div 
              initial={{opacity:0,scale:0}} 
              animate={isInView?{opacity:1,scale:1}:{}} 
              transition={{duration:0.6,delay:0.65}} 
              className="absolute -bottom-3 sm:-bottom-4 md:-bottom-5 -left-3 sm:-left-4 md:-left-5 w-16 sm:w-20 md:w-28 h-16 sm:h-20 md:h-28 border border-accent/20 rounded-xl sm:rounded-2xl pointer-events-none"
            />
          </motion.div>

          {/* Text column responsivo */}
          <motion.div style={{y:contentY}} className="space-y-6 sm:space-y-7 md:space-y-8">
            <motion.div 
              initial={{opacity:0,y:30}} 
              animate={isInView?{opacity:1,y:0}:{}} 
              transition={{duration:0.8,delay:0.3}} 
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

            {/* Stats grid responsivo */}
            <motion.div 
              initial={{opacity:0,y:30}} 
              animate={isInView?{opacity:1,y:0}:{}} 
              transition={{duration:0.8,delay:0.5}} 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 pt-6 sm:pt-7 md:pt-8 border-t border-border/30"
            >
              {stats.map((stat,index)=>(
                <motion.div 
                  key={stat.label} 
                  initial={{opacity:0,y:20}} 
                  animate={isInView?{opacity:1,y:0}:{}} 
                  transition={{duration:0.5,delay:0.6+index*0.1}} 
                  className="text-center md:text-left"
                >
                  <motion.div 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient" 
                    whileHover={{scale:1.08}} 
                    transition={{duration:0.2}}
                  >
                    <span className="stat-value" data-target={stat.value}>{stat.value}</span>
                    <span className="text-primary">{stat.suffix}</span>
                  </motion.div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            

            {/* Education badge responsivo */}
            <motion.div 
              initial={{opacity:0,y:20}} 
              animate={isInView?{opacity:1,y:0}:{}} 
              transition={{duration:0.5,delay:0.8}} 
              whileHover={{scale:1.02}} 
              className="inline-flex items-center gap-2 sm:gap-3 glass rounded-full px-4 sm:px-5 md:px-6 py-2 sm:py-3"
            >
              <div className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>
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