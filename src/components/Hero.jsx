import React from 'react'
import HeroLensScan from './HeroLensScan.jsx'

const Hero = () => {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* One-time initial lens scanning animation across the hero section */}
      <HeroLensScan />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Content Column */}
        <div className="lg:col-span-7 text-left">
          {/* Main Title with Flip Animation on Lens */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.08]">
            Code{' '}
            <span className="animate-flip-lens inline-block text-slate-500 font-normal underline decoration-slate-300 decoration-wavy decoration-1 underline-offset-8">
              Lens
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-10">
            Your Code Quality, Visualized.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="https://chromewebstore.google.com/detail/codelens/ohkmocfpalkecaihkoljlkbglldpbadf?hl=en-GB&authuser=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-slate-900 px-8 py-4 text-base sm:text-lg font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
            >
              <span>Add to Chrome</span>
              <svg
                className="w-5 h-5 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right Visual / Product Preview Column */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            {/* Top Bar with Logo & Product Indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm flex items-center justify-center flex-shrink-0">
                  <img
                    src="code.jpg"
                    alt="CodeLens Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">CodeLens</div>
                  <div className="text-xs text-slate-500 font-mono">Chrome Extension</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Active</span>
              </div>
            </div>

            {/* Live Visual Indicators Mock representing the visualizer */}
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-medium text-slate-700">calculateComplexity()</div>
                  <div className="text-[11px] text-slate-400">Cyclomatic: Score 3</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Low Risk
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-medium text-slate-700">parseAstTree()</div>
                  <div className="text-[11px] text-slate-400">Cyclomatic: Score 8</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Medium Risk
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-medium text-slate-700">renderOverlayNode()</div>
                  <div className="text-[11px] text-slate-400">Cyclomatic: Score 14</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Needs Refactor
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
