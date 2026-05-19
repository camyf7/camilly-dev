'use client'

import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'

import { LoadingScreen } from '@/components/loading-screen'
import { SkillsSection } from '@/components/sections/skills'
import { AboutSection } from '@/components/sections/about'
import { ProjectsSection } from '@/components/sections/projects'
import { HorizontalShowcase } from '@/components/sections/horizontal-showcase'
import { JourneySection } from '@/components/sections/journey'
export default function Home() {
  return (
    <>
    {/* Loading Screen */}
      <LoadingScreen />


      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
        <AboutSection />

        {/* Horizontal Showcase */}
        <HorizontalShowcase />

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection />

        {/* Journey Section */}
        <JourneySection />

         

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
      </main>
    </>
  )
}