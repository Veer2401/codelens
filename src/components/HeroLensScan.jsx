import React, { useState, useEffect } from 'react'

const HeroLensScan = () => {
  const [isScanActive, setIsScanActive] = useState(true)

  useEffect(() => {
    // Automatically clean up after the animation completes
    const timer = setTimeout(() => {
      setIsScanActive(false)
    }, 2400)

    return () => clearTimeout(timer)
  }, [])

  if (!isScanActive) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* Moving Lens Container */}
      <div
        className="absolute top-1/2 -translate-y-1/2 will-change-transform animate-hero-lens-sweep"
        style={{
          left: '-260px',
        }}
      >
        {/* Physical Black Magnifying Lens */}
        <div className="relative flex items-center justify-center">
          {/* Optical Glass Circle with subtle magnification contrast */}
          <div
            className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-[3px] border-slate-900 bg-slate-900/[0.02] shadow-[0_8px_30px_rgba(15,23,42,0.12)] flex items-center justify-center relative overflow-hidden"
            style={{
              backdropFilter: 'contrast(1.08) brightness(1.02) saturate(1.05)',
              WebkitBackdropFilter: 'contrast(1.08) brightness(1.02) saturate(1.05)',
            }}
          >
            {/* Subtle Inner Lens Rim Highlight */}
            <div className="absolute inset-0 rounded-full border border-white/60 pointer-events-none" />

            {/* Editorial Glass Specular Arc */}
            <div
              className="absolute top-2 left-6 w-20 sm:w-28 h-6 sm:h-8 rounded-full opacity-40 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent)',
                transform: 'rotate(-30deg)',
              }}
            />

            {/* Minimal Center Optical Reticle / Crosshair */}
            <div className="w-6 h-6 relative opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-slate-900" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-900" />
              <div className="absolute inset-1 rounded-full border border-slate-900" />
            </div>
          </div>

          {/* Precision Minimal Black Handle */}
          <div
            className="absolute bottom-0 right-0 w-4 sm:w-5 h-20 sm:h-28 bg-slate-900 rounded-b-full shadow-md"
            style={{
              transform: 'translate(45%, 45%) rotate(-45deg)',
              transformOrigin: 'top center',
            }}
          >
            {/* Grip accent */}
            <div className="w-full h-2 bg-slate-800 absolute top-2 rounded-t-sm" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mx-auto absolute bottom-2 left-1/2 -translate-x-1/2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroLensScan
