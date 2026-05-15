'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { name: 'Início', href: '#hero' },
  { name: 'Sobre', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projetos', href: '#projects' },
  { name: 'Jornada', href: '#journey' },
  { name: 'Contato', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      const sections = navItems.map(item => item.href.replace('#', ''))
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.getElementById(href.replace('#', ''))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4' 
            : 'py-6'
        }`}
      >
        <div className="container mx-auto px-6">
          <nav 
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled 
                ? 'glass-strong rounded-full px-6 py-3' 
                : ''
            }`}
          >
            <motion.div 
              className="relative z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="#hero" 
                onClick={() => handleNavClick('#hero')}
                className="text-xl font-bold tracking-tight"
              >
                <span className="text-gradient">CF</span>
                <span className="text-foreground/60">.</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* CTA Button Desktop */}
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <button
                onClick={() => handleNavClick('#contact')}
                className="group relative px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium overflow-hidden"
              >
                <span className="relative z-10">Vamos conversar</span>
                <motion.div
                  className="absolute inset-0 bg-accent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                />
              </button>
            </motion.div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
              aria-label="Menu"
            >
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6 : 0,
                }}
                className="w-6 h-0.5 bg-foreground block"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  x: isMenuOpen ? 10 : 0,
                }}
                className="w-6 h-0.5 bg-foreground block"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6 : 0,
                }}
                className="w-6 h-0.5 bg-foreground block"
              />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card/50 backdrop-blur-xl p-8 pt-24 flex flex-col"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-left text-2xl font-medium py-4 border-b border-border/30 transition-colors ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.name}
                </motion.button>
              ))}
              
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                onClick={() => handleNavClick('#contact')}
                className="mt-8 w-full py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium"
              >
                Vamos conversar
              </motion.button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
