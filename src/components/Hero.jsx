import React from 'react'
import Spotlight from './ui/spotlight'

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Spotlight Effect - Behind content but visible */}
      <Spotlight className="-top-40 left-1/4 md:-top-20 md:left-1/3 z-10" fill="rgba(147, 197, 253, 0.5)" />
      
      {/* Grid Background with glassmorphism */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-10 z-20"
           style={{
             backgroundSize: '60px 60px',
             backgroundImage: 'linear-gradient(to right, rgba(147, 197, 253, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(147, 197, 253, 0.3) 1px, transparent 1px)'
           }} />
      
      <div className="relative z-30 max-w-6xl mx-auto text-center">
        <div className="mb-12">
          <div className="mx-auto mb-8 flex items-center justify-center">
            <div className="relative flex items-center justify-center w-40 h-40">
              {/* Animated glow rings */}
              <span className="absolute w-44 h-44 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40 animate-fadePulse blur-xl"></span>
              <span className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-30 animate-fadePulse blur-2xl" style={{animationDelay: '0.5s'}}></span>
              
              {/* Glass container */}
              <div className="relative z-10 rounded-full w-40 h-40 flex items-center justify-center" style={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)'
              }}>
                <img
                  src="code.jpg"
                  alt="CodeLens Logo"
                  className="w-36 h-36 object-cover rounded-full"
                />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-b from-white via-blue-50 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
              Code
            </span>
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Lens
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl font-light max-w-4xl mx-auto leading-relaxed mb-8" style={{
            background: 'linear-gradient(to right, rgba(203, 213, 225, 0.9), rgba(148, 163, 184, 0.9))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Your Code Quality, Visualized.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="https://chromewebstore.google.com/detail/codelens/ohkmocfpalkecaihkoljlkbglldpbadf?hl=en-GB&authuser=0"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xl md:text-2xl px-12 py-5 inline-flex items-center gap-3 group"
          >
            Add to Chrome
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        
        
      </div>
    </section>
  )
}

export default Hero
