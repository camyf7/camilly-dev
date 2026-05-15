'use client'

import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
      </main>
    </>
  )
}