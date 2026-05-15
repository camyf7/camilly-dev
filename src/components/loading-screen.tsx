'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Logo Animation */}
            <motion.div
              className="text-6xl md:text-8xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gradient">CF</span>
              <span className="text-muted-foreground">.</span>
            </motion.div>

            {/* Orbital Elements */}
            <motion.div
              className="absolute -inset-8 border border-primary/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
            <motion.div
              className="absolute -inset-16 border border-accent/10 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-accent rounded-full -translate-x-1/2 translate-y-1/2" />
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-16 w-48 md:w-64">
            <div className="h-0.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-4 text-sm text-muted-foreground font-mono"
            >
              {Math.min(Math.round(progress), 100)}%
            </motion.p>
          </div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-xs text-muted-foreground tracking-widest uppercase"
          >
            Carregando experiência
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
