"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
} from "react"
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  MotionValue,
} from "framer-motion"
import {
  GraduationCap,
  Code2,
  Briefcase,
  type LucideIcon,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Milestone {
  id: string
  number: string
  title: string
  period: string
  description: string
  technologies: string[]
  achievements: string[]
  icon: LucideIcon
  color: string
  accentColor: string
  col: 0 | 1
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  phase: number
  spd: number
  col: string
}

interface TrailPulse {
  t: number
  speed: number
  size: number
  alpha: number
  hue: number
}

interface Vec2 {
  x: number
  y: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  {
    id: "formation",
    number: "01",
    title: "Formação & Fundamentos",
    period: "2020 – 2021",
    description:
      "Início da jornada no desenvolvimento web. Lógica de programação, HTML, CSS e os primeiros passos com JavaScript para criar interatividade real nas interfaces.",
    achievements: ["Primeiro site publicado", "Projeto de conclusão de curso"],
    technologies: ["HTML5", "CSS3", "JavaScript", "Git"],
    icon: GraduationCap,
    color: "#7C3AED",
    accentColor: "#8B5CF6",
    col: 0,
  },
  {
    id: "first-projects",
    number: "02",
    title: "Primeiros Projetos",
    period: "2021 – 2022",
    description:
      "Projetos reais que consolidaram a base técnica. Interfaces responsivas, integração com APIs e controle de versão. Cada entrega foi um degrau importante na evolução.",
    achievements: ["5+ projetos entregues", "Primeiro cliente real"],
    technologies: ["React", "Sass", "REST API", "GitHub"],
    icon: Code2,
    color: "#9333EA",
    accentColor: "#A855F7",
    col: 1,
  },
  {
    id: "specialization",
    number: "03",
    title: "Especialização Front-End",
    period: "2022 – 2023",
    description:
      "Aprofundamento em bibliotecas modernas e arquitetura de interfaces escaláveis. TypeScript, Tailwind CSS e Next.js se tornaram ferramentas do dia a dia.",
    achievements: ["Certificação React", "Contribuição Open Source"],
    technologies: ["TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"],
    icon: Code2,
    color: "#A855F7",
    accentColor: "#C084FC",
    col: 0,
  },
  {
    id: "professional",
    number: "04",
    title: "Experiência Profissional",
    period: "2023 – 2024",
    description:
      "Atuação em projetos reais no mercado, colaborando com equipes multidisciplinares e entregando soluções de alto impacto com metodologias ágeis e CI/CD.",
    achievements: ["3 projetos em produção", "Mentoria de júnior"],
    technologies: ["Next.js", "Node.js", "Figma", "Jest"],
    icon: Briefcase,
    color: "#C026D3",
    accentColor: "#E879F9",
    col: 1,
  },
  {
    id: "impact",
    number: "05",
    title: "Impacto & Evolução Contínua",
    period: "Atualmente",
    description:
      "Soluções completas com foco em performance, acessibilidade e experiências memoráveis. Interfaces que encantam usuários e resolvem problemas reais.",
    achievements: ["200k+ usuários impactados", "Feature premiada"],
    technologies: ["UI/UX Design", "Performance", "A11y", "SEO"],
    icon: Code2,
    color: "#D946EF",
    accentColor: "#F0ABFC",
    col: 0,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rgba(hex: string, a: number): string {
  const n = parseInt(hex.replace("#", ""), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}

function catmull(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t, t3 = t2 * t
  return {
    x: 0.5 * (2*p1.x + (-p0.x+p2.x)*t + (2*p0.x-5*p1.x+4*p2.x-p3.x)*t2 + (-p0.x+3*p1.x-3*p2.x+p3.x)*t3),
    y: 0.5 * (2*p1.y + (-p0.y+p2.y)*t + (2*p0.y-5*p1.y+4*p2.y-p3.y)*t2 + (-p0.y+3*p1.y-3*p2.y+p3.y)*t3),
  }
}

function buildSpline(pts: Vec2[], steps = 120): Vec2[] {
  if (pts.length < 2) return []
  const out: Vec2[] = []
  const ext = [pts[0], ...pts, pts[pts.length - 1]]
  for (let i = 1; i < ext.length - 2; i++) {
    for (let s = 0; s <= steps; s++) {
      out.push(catmull(ext[i-1], ext[i], ext[i+1], ext[i+2], s / steps))
    }
  }
  return out
}

// ─── Background Canvas ────────────────────────────────────────────────────────

const BackgroundCanvas = memo(function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const initializedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // CORREÇÃO 3: Inicializa partículas apenas uma vez
    if (!initializedRef.current) {
      initializedRef.current = true
      particlesRef.current = Array.from({ length: 70 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.8 + 0.4,
        a: Math.random() * 0.25 + 0.05,
        phase: Math.random() * Math.PI * 2,
        spd: Math.random() * 0.03 + 0.015,
        col: Math.random() > 0.5 ? "139,92,246" : "168,85,247",
      }))
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const W = canvas.width
      const H = canvas.height
      
      // CORREÇÃO 3: Ajusta partículas existentes ao invés de recriar
      particlesRef.current.forEach(p => {
        p.x = Math.min(p.x, W)
        p.y = Math.min(p.y, H)
      })
    }

    function draw(ts: number) {
      if (!canvas || !ctx) return
      const t = ts / 1000
      const W = canvas.width
      const H = canvas.height
      const particles = particlesRef.current

      if (W === 0 || H === 0) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, W, H)

      ctx.fillStyle = "#050311"
      ctx.fillRect(0, 0, W, H)

      const blobs: [number, number, number, string][] = [
        [W * 0.15, H * 0.15, W * 0.5, "rgba(109,40,217,0.07)"],
        [W * 0.85, H * 0.82, W * 0.42, "rgba(147,51,234,0.05)"],
        [W * 0.5, H * 0.5, W * 0.35, "rgba(168,85,247,0.04)"],
      ]
      blobs.forEach(([bx, by, br, color]) => {
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, color)
        g.addColorStop(1, "transparent")
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })

      ctx.strokeStyle = "rgba(139,92,246,0.028)"
      ctx.lineWidth = 0.5
      const gs = 56
      for (let x = 0; x < W; x += gs) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += gs) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // CORREÇÃO 4: Otimização de performance - usar fill simples ao invés de gradient
      particles.forEach(p => {
        p.x = (p.x + p.vx + W) % W
        p.y = (p.y + p.vy + H) % H
        const alpha = p.a * (0.4 + 0.6 * Math.sin(t * p.spd * 60 + p.phase))
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.col},${alpha + 0.04})`
        ctx.fill()
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.col},${alpha + 0.15})`
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    rafRef.current = requestAnimationFrame(draw)
    
    // CORREÇÃO 2: Observa o pai ao invés do próprio canvas
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)
    
    return () => { 
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
})

// ─── Energy Trail Canvas ──────────────────────────────────────────────────────

interface TrailCanvasProps {
  cardRefs: React.RefObject<HTMLDivElement | null>[]
  activeIndex: number | null
  isReady: boolean
}

const TrailCanvas = memo(function TrailCanvas({ cardRefs, activeIndex, isReady }: TrailCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const splineRef = useRef<Vec2[]>([])
  const pulsesRef = useRef<TrailPulse[]>([
    { t: 0.05, speed: 0.0022, size: 8,  alpha: 1.0,  hue: 0 },
    { t: 0.38, speed: 0.0017, size: 5.5, alpha: 0.75, hue: 30 },
    { t: 0.62, speed: 0.0025, size: 4,  alpha: 0.55, hue: 60 },
    { t: 0.82, speed: 0.0019, size: 3.5, alpha: 0.45, hue: 90 },
  ])
  
  // CORREÇÃO 10: Controle de visibilidade para pausar RAF
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const rebuildTimeoutRef = useRef<number>()
  
  // CORREÇÃO 5: Rebuild spline apenas em eventos específicos
  const rebuildSpline = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    const centers: Vec2[] = []

    for (const ref of cardRefs) {
      if (!ref.current) continue
      const r = ref.current.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      centers.push({
        x: r.left - canvasRect.left + r.width / 2,
        y: r.top - canvasRect.top + r.height / 2,
      })
    }

    if (centers.length >= 2) {
      splineRef.current = buildSpline(centers, 140)
    }
  }, [cardRefs])

  const getCenters = useCallback((): Vec2[] => {
    const canvas = canvasRef.current
    if (!canvas) return []

    const canvasRect = canvas.getBoundingClientRect()
    const centers: Vec2[] = []

    for (const ref of cardRefs) {
      if (!ref.current) continue
      const r = ref.current.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      centers.push({
        x: r.left - canvasRect.left + r.width / 2,
        y: r.top - canvasRect.top + r.height / 2,
      })
    }

    return centers
  }, [cardRefs])

  const draw = useCallback((ts: number) => {
    const canvas = canvasRef.current
    if (!canvas || !isVisible) return // CORREÇÃO 10: Pausa quando não visível
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const t = ts / 1000
    
    const parent = canvas.parentElement
    if (parent) {
      const pr = parent.getBoundingClientRect()
      if (canvas.width !== Math.round(pr.width) || canvas.height !== Math.round(pr.height)) {
        canvas.width = Math.round(pr.width)
        canvas.height = Math.round(pr.height)
      }
    }

    const centers = getCenters()
    
    if (centers.length < 2 || splineRef.current.length < 2) {
      return
    }
    
    const pts = splineRef.current
    const n = pts.length
    const isActive = activeIndex !== null

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // ── Outermost atmospheric glow ──
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(pts[i].x, pts[i].y)
    const atmoGrad = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[n-1].x, pts[n-1].y)
    atmoGrad.addColorStop(0,   "rgba(109,40,217,0)")
    atmoGrad.addColorStop(0.15,"rgba(124,58,237,0.15)")
    atmoGrad.addColorStop(0.4, "rgba(147,51,234,0.20)")
    atmoGrad.addColorStop(0.65,"rgba(168,85,247,0.18)")
    atmoGrad.addColorStop(0.85,"rgba(192,132,252,0.14)")
    atmoGrad.addColorStop(1,   "rgba(217,70,239,0)")
    ctx.strokeStyle = atmoGrad
    ctx.lineWidth = isActive ? 44 : 38
    ctx.globalAlpha = isActive ? 0.55 : 0.38
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    // ── Middle glow ──
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < n; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.strokeStyle = atmoGrad
    ctx.lineWidth = isActive ? 20 : 16
    ctx.globalAlpha = isActive ? 0.72 : 0.55
    ctx.stroke()

    // ── 3D tubular body ──
    ctx.globalAlpha = 1
    for (let i = 0; i < n - 1; i += 1) {
      const p = pts[i]
      const q = pts[Math.min(i + 1, n - 1)]
      const prog = i / n

      const breathe = 1 + 0.12 * Math.sin(i * 0.07 + t * 1.8)
      const baseThick = isActive ? 7.5 : 6
      const thick = (baseThick + Math.sin(i * 0.06) * 0.8) * breathe

      const r = Math.round(124 + (217 - 124) * prog)
      const g = Math.round(58  + (70  - 58)  * prog)
      const b = Math.round(237 + (239 - 237) * prog)

      ctx.beginPath()
      ctx.moveTo(p.x, p.y + 2.5)
      ctx.lineTo(q.x, q.y + 2.5)
      ctx.strokeStyle = "rgba(10,0,30,0.7)"
      ctx.lineWidth = thick + 3.5
      ctx.lineCap = "round"
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(p.x, p.y + 1)
      ctx.lineTo(q.x, q.y + 1)
      ctx.strokeStyle = "rgba(30,0,60,0.5)"
      ctx.lineWidth = thick + 1.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
      ctx.lineTo(q.x, q.y)
      ctx.strokeStyle = `rgba(${r},${g},${b},${isActive ? 0.95 : 0.85})`
      ctx.lineWidth = thick
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(p.x, p.y - thick * 0.22)
      ctx.lineTo(q.x, q.y - thick * 0.22)
      ctx.strokeStyle = "rgba(200,160,255,0.28)"
      ctx.lineWidth = thick * 0.28
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(p.x, p.y - thick * 0.3)
      ctx.lineTo(q.x, q.y - thick * 0.3)
      ctx.strokeStyle = "rgba(255,240,255,0.12)"
      ctx.lineWidth = thick * 0.12
      ctx.stroke()
    }

    // ── Traveling energy pulses ──
    pulsesRef.current.forEach(pulse => {
      pulse.t += pulse.speed * (isActive ? 1.55 : 1)
      if (pulse.t > 1) pulse.t -= 1

      const idx = Math.min(Math.floor(pulse.t * (n - 1)), n - 1)
      const pt = pts[idx]

      const cr1 = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pulse.size * 5)
      cr1.addColorStop(0,   `rgba(230,180,255,${pulse.alpha * 0.55})`)
      cr1.addColorStop(0.4, `rgba(180,100,255,${pulse.alpha * 0.28})`)
      cr1.addColorStop(1,   "transparent")
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pulse.size * 5, 0, Math.PI * 2)
      ctx.fillStyle = cr1
      ctx.fill()

      const cr2 = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pulse.size * 2)
      cr2.addColorStop(0,   `rgba(255,220,255,${pulse.alpha})`)
      cr2.addColorStop(0.5, `rgba(210,140,255,${pulse.alpha * 0.7})`)
      cr2.addColorStop(1,   "transparent")
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pulse.size * 2, 0, Math.PI * 2)
      ctx.fillStyle = cr2
      ctx.fill()

      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pulse.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,248,255,${pulse.alpha})`
      ctx.fill()
    })

    // ── Node connectors at each card center ──
    centers.forEach((pt, i) => {
      const prog = i / Math.max(centers.length - 1, 1)
      const isHovered = activeIndex === i
      const nodePulse = 0.65 + 0.35 * Math.sin(t * 1.6 + i * 1.4)
      const r = Math.round(124 + (217 - 124) * prog)
      const g = Math.round(58  + (70  - 58)  * prog)
      const b = Math.round(237 + (239 - 237) * prog)

      if (isHovered) {
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 26 + 4 * Math.sin(t * 3), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${r},${g},${b},0.2)`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(pt.x, pt.y, (isHovered ? 18 : 14) * nodePulse, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${r},${g},${b},${isHovered ? 0.5 : 0.28})`
      ctx.lineWidth = isHovered ? 1.5 : 1
      ctx.stroke()

      const ng = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, isHovered ? 20 : 16)
      ng.addColorStop(0, `rgba(${r},${g},${b},${isHovered ? 0.65 : 0.45})`)
      ng.addColorStop(1, "transparent")
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, isHovered ? 20 : 16, 0, Math.PI * 2)
      ctx.fillStyle = ng
      ctx.fill()

      ctx.beginPath()
      ctx.arc(pt.x, pt.y, isHovered ? 7 : 5.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r},${g},${b},1)`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(pt.x, pt.y, isHovered ? 3 : 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.95)"
      ctx.fill()
    })

    ctx.restore()
  }, [getCenters, activeIndex, isVisible])

  // CORREÇÃO 5: Rebuild spline em resize e scroll
  useEffect(() => {
    if (!isReady) return
    
    const handleRebuild = () => {
      if (rebuildTimeoutRef.current) clearTimeout(rebuildTimeoutRef.current)
      rebuildTimeoutRef.current = window.setTimeout(rebuildSpline, 100)
    }
    
    window.addEventListener("resize", handleRebuild)
    window.addEventListener("scroll", handleRebuild)
    
    rebuildSpline()
    
    return () => {
      window.removeEventListener("resize", handleRebuild)
      window.removeEventListener("scroll", handleRebuild)
      if (rebuildTimeoutRef.current) clearTimeout(rebuildTimeoutRef.current)
    }
  }, [isReady, rebuildSpline])

  // CORREÇÃO 10: Visibilidade da seção
  useEffect(() => {
    const section = document.getElementById("journey")
    if (!section) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // CORREÇÃO 6: StrictMode prevention
  const startedRef = useRef(false)
  
  const drawRef = useRef(draw)
  
  useEffect(() => {
    drawRef.current = draw
  }, [draw])

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    let frame: number
    let mounted = true

    const animate = (t: number) => {
      if (!mounted) return
      drawRef.current(t)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)

    return () => {
      mounted = false
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
})

// ─── Journey Card ─────────────────────────────────────────────────────────────

interface CardProps {
  milestone: Milestone
  index: number
  cardId: string
  cardRef: React.RefObject<HTMLDivElement | null>
  onHoverChange: (index: number | null) => void
  onVisible: (id: string) => void
}

const JourneyCard = memo(function JourneyCard({ milestone, index, cardId, cardRef, onHoverChange, onVisible }: CardProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const visibleRef = useRef(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })
  
  // CORREÇÃO 7: Tipagem correta do useTransform
  const shine = useTransform<[number, number], string>(
    [mx, my],
    ([lx, ly]) =>
      `radial-gradient(ellipse at ${(lx + 0.5) * 100}% ${(ly + 0.5) * 100}%, ${rgba(milestone.accentColor, 0.18)} 0%, transparent 60%)`
  )

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }, [mx, my])

  const onEnter = useCallback(() => {
    setHovered(true)
    onHoverChange(index)
  }, [index, onHoverChange])

  const onLeave = useCallback(() => {
    mx.set(0); my.set(0)
    setHovered(false)
    onHoverChange(null)
  }, [mx, my, onHoverChange])

  const handleViewportEnter = useCallback(() => {
    if (visibleRef.current) return
    visibleRef.current = true
    onVisible(cardId)
  }, [cardId, onVisible])

  const Icon = milestone.icon
  const c = milestone.accentColor

  return (
    <motion.div
      ref={cardRef}
      className="mb-6 relative"
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onViewportEnter={handleViewportEnter}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ zIndex: hovered ? 10 : 2 }}
    >
      <div style={{ perspective: 1200 }}>
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          whileHover={{ z: 24, scale: 1.015 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          role="article"
          aria-label={`Etapa ${milestone.number}: ${milestone.title}, ${milestone.period}`}
        >
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "rgba(8,6,20,0.82)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${hovered ? rgba(c, 0.45) : rgba(c, 0.16)}`,
              boxShadow: hovered
                ? `0 20px 60px rgba(0,0,0,0.5), 0 0 60px ${rgba(c, 0.14)}, inset 0 1px 0 rgba(255,255,255,0.07)`
                : "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
              transition: "border-color 0.3s, box-shadow 0.35s",
            }}
          />

          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: shine, zIndex: 0 }}
          />

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.055) 0%, transparent 50%)",
              zIndex: 0,
            }}
          />

          <div
            className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${rgba(c, 0.5)} 20%, ${c} 50%, ${rgba(c, 0.5)} 80%, transparent 100%)`,
              zIndex: 2,
              opacity: hovered ? 1 : 0.7,
              transition: "opacity 0.3s",
            }}
          />

          <div
            className="absolute -top-3 -right-1 select-none pointer-events-none font-black"
            style={{
              fontSize: 100,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: c,
              opacity: hovered ? 0.1 : 0.05,
              transition: "opacity 0.3s",
              zIndex: 1,
            }}
            aria-hidden="true"
          >
            {milestone.number}
          </div>

          <div className="relative p-6 lg:p-7" style={{ zIndex: 3 }}>
            <div className="flex items-start justify-between gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: rgba(c, 0.12),
                  border: `1px solid ${rgba(c, 0.3)}`,
                  boxShadow: hovered ? `0 0 20px ${rgba(c, 0.2)}` : "none",
                  transition: "box-shadow 0.3s",
                }}
              >
                <Icon
                  className="w-[22px] h-[22px]"
                  style={{ color: c }}
                  aria-hidden="true"
                />
              </div>
              <span
                className="text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full flex-shrink-0"
                style={{
                  background: rgba(c, 0.1),
                  color: c,
                  border: `1px solid ${rgba(c, 0.22)}`,
                  letterSpacing: "0.08em",
                }}
              >
                {milestone.period}
              </span>
            </div>

            <p
              className="text-[10px] font-black tracking-[0.22em] uppercase mb-1.5"
              style={{ color: rgba(c, 0.8) }}
            >
              Etapa {milestone.number}
            </p>

            <h3
              className="text-[17px] font-bold leading-snug mb-3 tracking-tight"
              style={{ color: "#F4F0FF" }}
            >
              {milestone.title}
            </h3>

            <div
              className="h-px mb-4"
              style={{ background: `linear-gradient(90deg, ${rgba(c, 0.6)}, ${rgba(c, 0.1)} 70%, transparent)` }}
            />

            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "#8B8AA8" }}>
              {milestone.description}
            </p>

            <div
              className="rounded-xl p-3.5 mb-4"
              style={{
                background: rgba(c, 0.05),
                border: `1px solid ${rgba(c, 0.1)}`,
              }}
            >
              <p
                className="text-[10px] font-bold tracking-[0.16em] uppercase mb-2.5"
                style={{ color: rgba(c, 0.9) }}
              >
                Conquistas
              </p>
              <div className="space-y-1.5">
                {milestone.achievements.map((a, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: c, boxShadow: `0 0 6px ${rgba(c, 0.6)}` }}
                    />
                    <span className="text-[12px]" style={{ color: "#9B9AB8" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {milestone.technologies.map(tech => (
                <motion.span
                  key={tech}
                  className="text-[11px] font-semibold px-2.5 py-[5px] rounded-full cursor-default"
                  style={{
                    background: rgba(c, 0.1),
                    color: c,
                    border: `1px solid ${rgba(c, 0.22)}`,
                  }}
                  whileHover={{
                    scale: 1.07,
                    background: rgba(c, 0.2),
                    borderColor: rgba(c, 0.45),
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
})

// ─── Section Header ────────────────────────────────────────────────────────────

const SectionHeader = memo(function SectionHeader() {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!mounted) return
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      mounted = false
      if (el) observer.unobserve(el)
      observer.disconnect()
    }
  }, [])

  return (
    <motion.div
      ref={ref}
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
        04 / Jornada
      </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
      >
        Minha{' '}
        <span className="text-gradient">trajetória</span>{' '}
        profissional
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed"
      >
        Uma jornada construída com dedicação, curiosidade e paixão por transformar
        ideias em experiências digitais memoráveis.
      </motion.p>
    </motion.div>
  )
})

// ─── Main Export ──────────────────────────────────────────────────────────────

export function JourneySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const visibleIds = useRef(new Set<string>())

  const desktopRefs = useRef<React.RefObject<HTMLDivElement | null>[]>(
    Array.from({ length: MILESTONES.length }, () =>
      React.createRef<HTMLDivElement | null>()
    )
  ).current

  const mobileRefs = useRef<React.RefObject<HTMLDivElement | null>[]>(
    Array.from({ length: MILESTONES.length }, () =>
      React.createRef<HTMLDivElement | null>()
    )
  ).current

  const handleHoverChange = useCallback((index: number | null) => {
    setActiveIndex(index)
  }, [])

  const handleCardVisible = useCallback((id: string) => {
    if (visibleIds.current.has(id)) return
    visibleIds.current.add(id)
    setVisibleCount(visibleIds.current.size)
  }, [])

  // CORREÇÃO 1: Ativa trilha com apenas 2 cards visíveis
  const isTrailReady = visibleCount >= 2

  const colLeft  = MILESTONES.filter(m => m.col === 0)
  const colRight = MILESTONES.filter(m => m.col === 1)

  return (
    <section
      id="journey"
      aria-label="Minha trajetória profissional"
      className="relative min-h-screen py-28 lg:py-36 overflow-hidden"
      style={{ background: "#050311" }}
    >
      <BackgroundCanvas />

      <TrailCanvas
        cardRefs={desktopRefs}
        activeIndex={activeIndex}
        isReady={isTrailReady}
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #050311 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #050311 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      <div
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"
        style={{ zIndex: 4 }}
      >
        <SectionHeader />

        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-7 xl:gap-10">
          <div>
            {colLeft.map((m, idx) => (
              <JourneyCard
                key={`${m.id}-${idx}`}
                milestone={m}
                index={MILESTONES.findIndex(x => x.id === m.id)}
                cardId={m.id}
                cardRef={desktopRefs[MILESTONES.findIndex(x => x.id === m.id)]}
                onHoverChange={handleHoverChange}
                onVisible={handleCardVisible}
              />
            ))}
          </div>

          <div className="mt-16">
            {colRight.map((m, idx) => (
              <JourneyCard
                key={`${m.id}-${idx}`}
                milestone={m}
                index={MILESTONES.findIndex(x => x.id === m.id)}
                cardId={m.id}
                cardRef={desktopRefs[MILESTONES.findIndex(x => x.id === m.id)]}
                onHoverChange={handleHoverChange}
                onVisible={handleCardVisible}
              />
            ))}
          </div>
        </div>

        <div className="lg:hidden space-y-5">
          {MILESTONES.map((m, i) => (
            <JourneyCard
              key={`mobile-${m.id}-${i}`}
              milestone={m}
              index={i}
              cardId={m.id}
              cardRef={mobileRefs[i]}
              onHoverChange={handleHoverChange}
              onVisible={handleCardVisible}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default JourneySection