'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    title: 'Frontend',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Interfaces modernas e responsivas',
    skills: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'JavaScript', level: 90 },
      { name: 'HTML5/CSS3', level: 95 },
      { name: 'Framer Motion', level: 75 },
    ],
  },
  {
    title: 'Backend',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    description: 'APIs e logica de servidor',
    skills: [
      { name: 'Node.js', level: 70 },
      { name: 'Express', level: 65 },
      { name: 'REST APIs', level: 75 },
      { name: 'Firebase', level: 70 },
    ],
  },
  {
    title: 'Ferramentas',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    description: 'Workflow e produtividade',
    skills: [
      { name: 'Git/GitHub', level: 85 },
      { name: 'Figma', level: 80 },
      { name: 'VS Code', level: 95 },
      { name: 'Vite', level: 80 },
      { name: 'Postman', level: 70 },
    ],
  },
  {
    title: 'UI/UX',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    description: 'Design de experiencias',
    skills: [
      { name: 'Wireframing', level: 75 },
      { name: 'Prototyping', level: 70 },
      { name: 'Accessibility', level: 80 },
      { name: 'Design Systems', level: 75 },
      { name: 'Responsive Design', level: 90 },
    ],
  },
]

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        <motion.span 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          className="text-xs text-muted-foreground font-mono"
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: `${level}%`, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay, ease: [0.23, 1, 0.32, 1] }}
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

function SkillCard({ category, index }: { category: typeof skillCategories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative group perspective-1000"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? (mousePosition.x - 50) / 10 : 0,
          rotateX: isHovered ? -(mousePosition.y - 50) / 10 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="animated-border rounded-2xl p-6 md:p-8 h-full bg-card transition-all duration-500 hover:bg-card/80 relative overflow-hidden"
        style={{
          ['--mouse-x' as string]: `${mousePosition.x}%`,
          ['--mouse-y' as string]: `${mousePosition.y}%`,
        }}
      >
        {/* Spotlight gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, oklch(0.65 0.28 300 / 0.1), transparent 40%)`,
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <motion.div
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1 
              }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4"
            >
              {category.icon}
            </motion.div>
            <h3 className="text-xl font-bold">{category.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          </div>
          <motion.div
            animate={{ 
              scale: isHovered ? 1.2 : 1, 
              opacity: isHovered ? 1 : 0.5,
              y: isHovered ? -5 : 0 
            }}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <span className="text-primary text-sm font-bold">{category.skills.length}</span>
          </motion.div>
        </div>

        {/* Skills */}
        <div className="space-y-4 relative z-10">
          {category.skills.map((skill, skillIndex) => (
            <SkillBar
              key={skill.name}
              name={skill.name}
              level={skill.level}
              delay={0.2 + skillIndex * 0.08}
            />
          ))}
        </div>

        {/* Glow effect */}
        <motion.div
          animate={{ opacity: isHovered ? 0.15 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl -z-10 blur-xl"
        />
      </motion.div>
    </motion.div>
  )
}

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.skill-card-stagger', 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" className="py-32 md:py-48 relative overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <motion.div
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <div ref={containerRef} className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-primary tracking-widest uppercase font-mono mb-4 block"
          >
            02 / Habilidades
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
          >
            Minha <span className="text-gradient">stack</span> de tecnologias
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-muted-foreground"
          >
            Ferramentas e tecnologias que utilizo para transformar ideias em experiencias 
            digitais excepcionais.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>

        {/* Tech Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 overflow-hidden"
        >
          <div className="flex gap-12 marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-12 shrink-0">
                {['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'Git', 'Figma', 'Firebase'].map((tech) => (
                  <span
                    key={`${setIndex}-${tech}`}
                    className="text-4xl md:text-6xl font-bold text-muted/10 whitespace-nowrap hover:text-primary/20 transition-colors duration-500"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
