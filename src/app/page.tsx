'use client'

import { Navbar } from '@/components/navbar'
import { HeroSection } from '@/components/sections/hero'

import { LoadingScreen } from '@/components/loading-screen'

import { AboutSection } from '@/components/sections/about'


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

     

         

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
      </main>
    </>
  )
}