'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect on scroll
      gsap.to('.hero-parallax', {
        y: 200,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      gsap.to('.hero-fade', {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.5,
      },
    },
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 120, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }

  const firstName = "Camilly"
  const lastName = "Ferreira"

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl hero-parallax"
          animate={{
            x: [0, 60, 0],
            y: [0, 40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl hero-parallax"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto hero-fade">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6"
          >
            <span className="text-sm md:text-base text-muted-foreground tracking-widest uppercase font-mono">
              Ola, eu sou
            </span>
          </motion.div>

          {/* Name - Animated Letters */}
          <h1 ref={titleRef} className="mb-8">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap overflow-hidden"
            >
              {firstName.split('').map((letter, i) => (
                <motion.span
                  key={`first-${i}`}
                  variants={letterVariants}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground inline-block"
                  style={{ perspective: '1000px' }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap overflow-hidden"
            >
              {lastName.split('').map((letter, i) => (
                <motion.span
                  key={`last-${i}`}
                  variants={letterVariants}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-gradient inline-block"
                  style={{ perspective: '1000px' }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Desenvolvedora Frontend construindo{' '}
            <span className="text-foreground font-medium">experiencias web modernas</span>,{' '}
            responsivas e interativas com{' '}
            <span className="text-primary">React</span> e{' '}
            <span className="text-accent">TypeScript</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="mt-12 flex flex-wrap gap-4"
          >
            <motion.a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Projetos
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-accent"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 border border-border hover:border-primary/50 rounded-full font-medium transition-colors flex items-center gap-2 hover:bg-primary/5"
            >
              <motion.span 
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Disponivel para projetos
            </motion.a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-3"
            >
              
              
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Code Block */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block hero-parallax"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="glass rounded-xl p-5 max-w-xs border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <pre className="text-xs font-mono text-muted-foreground">
            <code>
              <span className="text-accent">const</span>{' '}
              <span className="text-primary">developer</span> = {'{\n'}
              {'  '}name: <span className="text-green-400">{'"Camilly"'}</span>,{'\n'}
              {'  '}role: <span className="text-green-400">{'"Frontend"'}</span>,{'\n'}
              {'  '}passion: <span className="text-green-400">{'"Code"'}</span>{'\n'}
              {'}'};
            </code>
          </pre>
        </motion.div>
      </motion.div>
    </section>
  )
}
