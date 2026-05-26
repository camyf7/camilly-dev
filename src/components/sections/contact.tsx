'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion, useInView, useSpring, useMotionValue,
  AnimatePresence
} from 'framer-motion'

// ─── Viewport hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setBp(w < 640 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

// ─── Fluid Orb ────────────────────────────────────────────────────────────────
function FluidOrb({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const tRef = useRef(0)
  const mx = useRef({ cur: 0.5, tgt: 0.5 })
  const my = useRef({ cur: 0.5, tgt: 0.5 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const n = (x: number, y: number, t: number) =>
      Math.sin(x * 2.4 + t * 0.6) * Math.cos(y * 1.8 + t * 0.5)
      + Math.sin(x * 1.1 - y * 2.1 + t * 0.28) * 0.55
      + Math.cos(x * 3.2 + y * 1.2 - t * 0.37) * 0.26

    const draw = () => {
      tRef.current += 0.0055
      const t = tRef.current
      mx.current.cur += (mx.current.tgt - mx.current.cur) * 0.035
      my.current.cur += (my.current.tgt - my.current.cur) * 0.035
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2 + (mx.current.cur - 0.5) * W * 0.06
      const cy = H / 2 + (my.current.cur - 0.5) * H * 0.05
      const br = Math.min(W, H) * 0.38

      // outer atmospheric glow
      for (let l = 0; l < 5; l++) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, br * (1.3 + l * 0.22))
        g.addColorStop(0, `rgba(124,58,237,${0.022 - l * 0.003})`)
        g.addColorStop(0.6, `rgba(88,28,220,${0.01 - l * 0.001})`)
        g.addColorStop(1, 'rgba(10,10,10,0)')
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      }

      // layered organic blobs
      for (let li = 0; li < 9; li++) {
        const lt = t + li * 0.19
        const ls = 1 - (li / 8) * 0.48
        const op = 0.1 - (li / 8) * 0.007
        ctx.beginPath()
        for (let i = 0; i <= 200; i++) {
          const a = (i / 200) * Math.PI * 2
          const dmx = mx.current.cur - 0.5, dmy = my.current.cur - 0.5
          const n1 = n(Math.cos(a) * 1.25, Math.sin(a) * 1.25, lt)
          const n2 = n(Math.cos(a + 1.4) * 0.82, Math.sin(a + 1.4) * 0.88, lt * 0.68 + 1.6)
          const n3 = n(Math.cos(a * 2.1 + 0.6) * 0.36, Math.sin(a * 2.1 + 0.6) * 0.36, lt * 1.35 + 3.1)
          const mi = Math.sin(a + Math.atan2(dmy, dmx)) * Math.sqrt(dmx * dmx + dmy * dmy)
          const r = br * ls * (1 + n1 * 0.2 + n2 * 0.095 + n3 * 0.048 + mi * 0.12)
          const px = cx + Math.cos(a) * r + Math.sin(lt * 0.26 + a * 0.55) * br * 0.028
          const py = cy + Math.sin(a) * r * 0.84 + Math.cos(lt * 0.2 + a * 0.72) * br * 0.024
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.closePath()
        const fillG = ctx.createRadialGradient(cx - br * 0.16, cy - br * 0.2, 0, cx, cy, br * ls * 1.08)
        if (li < 3) {
          fillG.addColorStop(0, `rgba(216,180,254,${op * 1.5})`)
          fillG.addColorStop(0.45, `rgba(147,51,234,${op * 0.85})`)
        } else if (li < 6) {
          fillG.addColorStop(0, `rgba(168,85,247,${op * 1.2})`)
          fillG.addColorStop(0.45, `rgba(109,40,217,${op * 0.7})`)
        } else {
          fillG.addColorStop(0, `rgba(139,92,246,${op})`)
          fillG.addColorStop(0.45, `rgba(76,29,149,${op * 0.6})`)
        }
        fillG.addColorStop(1, 'rgba(30,10,80,0.05)')
        ctx.fillStyle = fillG; ctx.fill()
      }

      // specular highlight
      const hx = cx - br * 0.3 + (mx.current.cur - 0.5) * br * 0.18
      const hy = cy - br * 0.34 + (my.current.cur - 0.5) * br * 0.14
      const sg = ctx.createRadialGradient(hx, hy, 0, hx, hy, br * 0.35)
      sg.addColorStop(0, 'rgba(245,228,255,0.16)')
      sg.addColorStop(0.45, 'rgba(210,170,255,0.05)')
      sg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H)

      // inner core pulse
      const pulse = 0.055 + Math.sin(t * 1.1) * 0.013
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, br * 0.5)
      cg.addColorStop(0, `rgba(235,210,255,${pulse})`)
      cg.addColorStop(0.38, `rgba(168,85,247,0.03)`)
      cg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H)

      // orbital micro-particles
      for (let i = 0; i < 32; i++) {
        const seed = i * 137.508
        const spd = 0.1 + (i % 6) * 0.024
        const ang = (seed + t * spd * 60) * (Math.PI / 180)
        const orb = 0.38 + (i % 8) * 0.09
        const px = cx + Math.cos(ang) * br * orb + (mx.current.cur - 0.5) * br * 0.035
        const py = cy + Math.sin(ang) * br * orb * 0.72 + (my.current.cur - 0.5) * br * 0.028
        const r = 0.7 + Math.sin(t * 2.1 + i) * 0.38
        const a = 0.14 + Math.sin(t * 1.6 + i * 0.55) * 0.1
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(216,180,254,${a})`; ctx.fill()
      }

      // subtle ring
      ctx.beginPath()
      ctx.ellipse(cx, cy, br * 1.08, br * 0.62, 0, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(168,85,247,${0.06 + Math.sin(t * 0.7) * 0.02})`
      ctx.lineWidth = 0.8; ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    const u1 = mouseX.on('change', (v: number) => { mx.current.tgt = v })
    const u2 = mouseY.on('change', (v: number) => { my.current.tgt = v })
    return () => { u1(); u2() }
  }, [mouseX, mouseY])

  return <canvas ref={canvasRef} className="block w-full" style={{ aspectRatio: '1/1.05' }} />
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function Field({
  label, name, type = 'text', placeholder, value, onChange, rows,
}: {
  label: string; name: string; type?: string; placeholder: string
  value: string; onChange: (e: any) => void; rows?: number
}) {
  const [focused, setFocused] = useState(false)
  const Tag = rows ? 'textarea' : 'input'
  const base: React.CSSProperties = {
    display: 'block', width: '100%', fontFamily: 'inherit', fontSize: 13,
    fontWeight: 300, color: 'rgba(255,255,255,0.88)',
    background: focused ? 'rgba(168,85,247,0.04)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${focused ? 'rgba(168,85,247,0.55)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10, padding: rows ? '10px 14px' : '10px 14px',
    outline: 'none', resize: 'none', boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(168,85,247,0.09), inset 0 0 16px rgba(168,85,247,0.04)' : 'none',
    transition: 'all 0.22s ease',
  }
  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.18em', color: focused ? 'rgba(192,132,252,0.7)' : 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 6, transition: 'color 0.2s' }}>
        {label}
      </label>
      <Tag
        type={type} name={name} placeholder={placeholder} value={value}
        onChange={onChange} rows={rows}
        style={base}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

// ─── Terminal Line (decorative) ───────────────────────────────────────────────
function TermLine({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), delay) ; return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 10.5, color: 'rgba(168,85,247,0.45)', letterSpacing: '0.04em', opacity: show ? 1 : 0, transition: 'opacity 0.4s', lineHeight: 1.8 }}>
      {children}
    </div>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.12 })

  const bp = useBreakpoint()
  const isMobile = bp === 'mobile'
  const isTablet = bp === 'tablet'

  const rawMX = useMotionValue(0.5)
  const rawMY = useMotionValue(0.5)
  const mxSpring = useSpring(rawMX, { stiffness: 70, damping: 22 })
  const mySpring = useSpring(rawMY, { stiffness: 70, damping: 22 })

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)

  // Inject keyframes once into <head> — avoids SSR removeChild mismatch
  // that occurs when <style> sits directly inside JSX section elements.
  useEffect(() => {
    const id = 'contact-section-kf'
    if (document.getElementById(id)) return
    const el = document.createElement('style')
    el.id = id
    el.textContent = [
      '@keyframes cpulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(2.2);opacity:0}}',
      '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
      '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}',
    ].join('')
    document.head.appendChild(el)
    return () => { document.getElementById(id)?.remove() }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    rawMX.set((e.clientX - r.left) / r.width)
    rawMY.set((e.clientY - r.top) / r.height)
  }, [rawMX, rawMY])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (name === 'message') setCharCount(value.length)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1700))
    setSubmitting(false); setSubmitted(true)
    setForm({ name: '', email: '', subject: '', message: '' }); setCharCount(0)
    setTimeout(() => setSubmitted(false), 5000)
  }

  const ease: [number, number, number, number] = [0.23, 1, 0.32, 1]
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.72, delay, ease },
  })

  return (
    <section
      ref={sectionRef}
      id="contact"
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative', minHeight: isMobile ? 'auto' : '100vh', display: 'flex',
        alignItems: 'center', overflow: 'hidden', background: '#080810',
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 100%, rgba(88,28,200,0.07) 0%, transparent 65%),
          linear-gradient(rgba(124,58,237,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,58,237,0.025) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 64px 64px, 64px 64px',
      }}
    >
      {/* corner decorations */}
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 48, height: 48, pointerEvents: 'none',
          [pos.includes('top') ? 'top' : 'bottom']: 24,
          [pos.includes('left') ? 'left' : 'right']: 24,
          borderTop: pos.includes('top') ? '1px solid rgba(124,58,237,0.18)' : 'none',
          borderBottom: pos.includes('bottom') ? '1px solid rgba(124,58,237,0.18)' : 'none',
          borderLeft: pos.includes('left') ? '1px solid rgba(124,58,237,0.18)' : 'none',
          borderRight: pos.includes('right') ? '1px solid rgba(124,58,237,0.18)' : 'none',
        }} />
      ))}

      <div
        ref={containerRef}
        style={{
          position: 'relative', zIndex: 10, width: '100%', maxWidth: 1320,
          margin: '0 auto',
          padding: isMobile ? '5rem 1.25rem 4rem' : isTablet ? '5rem 2rem' : '5rem 5%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 0.68fr 1fr',
          gap: isMobile ? '2.5rem' : isTablet ? '2rem' : '3rem',
          alignItems: 'center',
        }}
      >

        {/* ── LEFT ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -28 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.05, ease }}
        >
          {/* section label */}
          <motion.div {...fadeUp(0.1)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ width: 20, height: 1, background: 'linear-gradient(90deg, rgba(168,85,247,0.7), rgba(168,85,247,0.2))' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(168,85,247,0.55)' }}>
              05&nbsp;/&nbsp;contato
            </span>
          </motion.div>

          {/* headline */}
          <motion.h2 {...fadeUp(0.2)} style={{
            margin: '0 0 20px', fontSize: isMobile ? 'clamp(2rem,8vw,2.8rem)' : 'clamp(2.4rem,4.2vw,3.8rem)',
            fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em',
            color: 'rgba(255,255,255,0.92)',
          }}>
            Vamos{' '}
            <span style={{
              background: 'linear-gradient(135deg, #e9d5ff 0%, #c084fc 35%, #a855f7 65%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              display: 'inline-block',
            }}>
              criar algo
            </span>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>incrível</span>
            <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.9em' }}>?</span>
          </motion.h2>

          {/* sub */}
          <motion.p {...fadeUp(0.3)} style={{
            fontSize: 13.5, lineHeight: 1.82, color: 'rgba(255,255,255,0.36)',
            fontWeight: 300, maxWidth: '34ch', marginBottom: 32,
          }}>
            Aberta a novas oportunidades, colaborações e projetos que desafiam o convencional. Me conta sua ideia.
          </motion.p>

          {/* contact info */}
          <motion.div {...fadeUp(0.38)} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {[
              {
                label: 'Caraguatatuba, SP — Brasil',
                icon: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z',
              },
              {
                label: 'camillyf691@gmail.com',
                icon: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
              },
            ].map(item => (
              <motion.div
                key={item.label}
                whileHover={{ x: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(124,58,237,0.09)', border: '1px solid rgba(124,58,237,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(192,132,252,0.75)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.03em' }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* availability pill */}
          <motion.div {...fadeUp(0.46)}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '9px 18px', borderRadius: 999,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(168,85,247,0.06) 100%)',
              border: '1px solid rgba(168,85,247,0.22)',
              boxShadow: '0 0 24px rgba(124,58,237,0.12)',
            }}>
              <span style={{ position: 'relative', display: 'inline-flex', width: 9, height: 9 }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%', background: '#a855f7',
                  opacity: 0.7, animation: 'cpulse 2.2s ease-in-out infinite',
                }} />
                <span style={{ position: 'relative', width: 9, height: 9, borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 7px rgba(192,132,252,0.9)' }} />
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.14em', color: 'rgba(192,132,252,0.9)', textTransform: 'uppercase' }}>
                disponível para projetos
              </span>
            </div>
          </motion.div>

          {/* terminal block */}
          <motion.div {...fadeUp(0.55)} style={{
            marginTop: 36, padding: '14px 16px', borderRadius: 12,
            background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.14)', marginLeft: 8, letterSpacing: '0.08em' }}>
                ~/portfolio
              </span>
            </div>
            {isInView && (
              <>
                <TermLine delay={700}><span style={{ color: 'rgba(168,85,247,0.5)' }}>$</span> git status</TermLine>
                <TermLine delay={1400}><span style={{ color: 'rgba(134,239,172,0.5)' }}>✓</span> disponível para novos commits</TermLine>
                <TermLine delay={2100}><span style={{ color: 'rgba(168,85,247,0.5)' }}>$</span> npm run collaborate<span style={{ animation: 'blink 1s step-end infinite', color: 'rgba(192,132,252,0.7)' }}>▊</span></TermLine>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* ── CENTER ───────────────────────────────────────── */}
        {!isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.86 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.18, ease }}
          style={{
            position: 'relative',
            gridColumn: isTablet ? '1 / -1' : 'auto',
            order: isTablet ? -1 : 0,
            maxWidth: isTablet ? 280 : 'none',
            margin: isTablet ? '0 auto' : undefined,
          }}
        >
          {/* decorative ring */}
          <div style={{
            position: 'absolute', inset: '-8%', borderRadius: '50%',
            border: '1px solid rgba(124,58,237,0.1)',
            animation: 'spin 28s linear infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', inset: '-16%', borderRadius: '50%',
            border: '1px dashed rgba(124,58,237,0.07)',
            animation: 'spin 42s linear infinite reverse',
            pointerEvents: 'none',
          }} />
          <FluidOrb mouseX={mxSpring} mouseY={mySpring} />
        </motion.div>
        )}

        {/* ── RIGHT ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 28 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.05, delay: 0.3, ease }}
        >
          <div style={{
            position: 'relative', borderRadius: 22, padding: '30px 28px', overflow: 'hidden',
            background: 'linear-gradient(160deg, rgba(255,255,255,0.026) 0%, rgba(124,58,237,0.018) 100%)',
            border: '1px solid rgba(255,255,255,0.075)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 32px 64px -20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}>
            {/* top shimmer line */}
            <div style={{
              position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(192,132,252,0.55), transparent)',
            }} />
            {/* top-right glow blob */}
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 140, height: 140,
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
              filter: 'blur(28px)', pointerEvents: 'none',
            }} />

            {/* file header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(255,255,255,0.09)' }} />
                  ))}
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 10.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
                  contato.tsx
                </span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(168,85,247,0.4)', letterSpacing: '0.08em' }}>
                𝜗ৎ 𖹭.ᐟ ✮⋆˙
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                <Field label="Nome" name="name" placeholder="Seu nome" value={form.name} onChange={handleChange} />
                <Field label="Email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} />
              </div>
              <Field label="Assunto" name="subject" placeholder="Sobre o que quer falar?" value={form.subject} onChange={handleChange} />
              <div style={{ position: 'relative' }}>
                <Field label="Mensagem" name="message" placeholder="Conta mais sobre sua ideia…" value={form.message} onChange={handleChange} rows={4} />
                <span style={{
                  position: 'absolute', bottom: 8, right: 12, fontFamily: 'monospace', fontSize: 9.5,
                  color: charCount > 0 ? 'rgba(168,85,247,0.45)' : 'rgba(255,255,255,0.12)',
                  letterSpacing: '0.06em', transition: 'color 0.2s',
                }}>
                  {charCount}
                </span>
              </div>

              {/* submit */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={!submitting ? { scale: 1.012, y: -2 } : {}}
                  whileTap={!submitting ? { scale: 0.987 } : {}}
                  style={{
                    width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                    fontSize: 13.5, fontWeight: 500, color: '#fff', letterSpacing: '0.02em',
                    background: submitted
                      ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #c084fc 100%)',
                    boxShadow: submitted
                      ? '0 6px 28px rgba(22,163,74,0.3)'
                      : '0 6px 32px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
                    transition: 'background 0.4s, box-shadow 0.3s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* shimmer sweep */}
                  {!submitting && !submitted && (
                    <motion.div
                      initial={{ x: '-120%' }} whileHover={{ x: '120%' }}
                      transition={{ duration: 0.7, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  <AnimatePresence mode="wait">
                    {submitting && (
                      <motion.div key="spin"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                          style={{ width: 15, height: 15, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
                        />
                        Enviando…
                      </motion.div>
                    )}
                    {submitted && (
                      <motion.div key="ok"
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <motion.svg
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <motion.polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                        Mensagem enviada!
                      </motion.div>
                    )}
                    {!submitting && !submitted && (
                      <motion.div key="idle"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        Enviar mensagem
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* bottom note */}
              <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.06em', margin: 0 }}>
                respondo em até 24h &nbsp;·&nbsp; sem spam 
              </p>
            </form>
          </div>
        </motion.div>
      </div>

    </section>
  )
}

export default ContactSection