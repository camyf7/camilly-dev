'use client'

import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'

import { LoadingScreen } from '@/components/loading-screen'
import { SkillsSection } from '@/components/sections/skills'
import { AboutSection } from '@/components/sections/about'
import { ProjectsSection } from '@/components/sections/projects'


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

        {/* Skills Section */}
        <SkillsSection />

        {/* Projects Section */}
        <ProjectsSection />

     

         

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
      </main>
    </>
  )
}