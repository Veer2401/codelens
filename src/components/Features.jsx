import React, { useState, useEffect } from 'react'

const Features = () => {
  const [expandedCard, setExpandedCard] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setExpandedCard(null)
      }
    }
    if (expandedCard !== null) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedCard])

  const features = [
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Real-time Analysis",
      description: "Get instant complexity insights as you code, with no need to refresh or rebuild.",
      detailedDescription: "Our extension analyzes your code in real-time, providing immediate feedback on complexity. No need to wait or manually refresh—just code and see insights instantly."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      title: "Inline Highlights",
      description: "Color-coded backgrounds show complexity levels directly in your code editor.",
      detailedDescription: "Complexity levels are visually represented with color-coded highlights, making it easy to spot areas that need attention without leaving your editor."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      ),
      title: "Smart Detection",
      description: "Automatically detects code blocks in GitHub, CodeSandbox, StackBlitz, and more.",
      detailedDescription: "The extension intelligently finds code blocks across popular platforms, so you get complexity analysis wherever you work—no manual selection required."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ),
      title: "Interactive Charts",
      description: "Bubble charts and graphs show complexity distribution and trends.",
      detailedDescription: "Visualize your code's complexity with interactive charts and graphs. Track trends and distributions to better understand and improve your codebase."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: "Privacy First",
      description: "All analysis happens locally in your browser. No code is ever sent to servers.",
      detailedDescription: "Your code never leaves your machine. All analysis is performed locally, ensuring your privacy and security."
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Open Source",
      description: "Built with transparency and community in mind. Contribute and improve together.",
      detailedDescription: "Codelens is open source, so anyone can contribute, audit, and improve the extension. Join the community and help shape the future of code analysis."
    }
  ]

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 border-t border-slate-200/80 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        {/* Left-Aligned Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Powerful Features for Better Code
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Everything you need to understand and improve your code's complexity, right in your browser.
            </p>
          </div>
          <div className="text-left md:text-right flex-shrink-0">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400">
              Core Capabilities
            </span>
          </div>
        </div>

        {/* Expansive Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-slate-900"
              onClick={() => setExpandedCard(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setExpandedCard(index)
                }
              }}
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                <span>View details</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Feature Modal */}
        {expandedCard !== null && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setExpandedCard(null)}
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="relative max-w-md w-full rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-5 right-5 w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                onClick={() => setExpandedCard(null)}
                aria-label="Close modal"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-start pt-2">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 mb-4">
                  {features[expandedCard].icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {features[expandedCard].title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {features[expandedCard].detailedDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div className="mt-14 md:mt-20 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a 
            href="https://chromewebstore.google.com/detail/codelens/ohkmocfpalkecaihkoljlkbglldpbadf?hl=en-GB&authuser=0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <span>Ready to get started?</span>
            <svg className="w-4 h-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Features
