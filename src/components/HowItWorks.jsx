import React, { useState, useEffect } from 'react'

const HowItWorks = () => {
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

  const steps = [
    {
      number: "01",
      title: "Install Extension",
      description: "Add CodeLens to Chrome from the Web Store with one click.",
      detailedDescription: "Getting started with CodeLens is incredibly simple. Just head to the Chrome Web Store, search for 'CodeLens', and click the 'Add to Chrome' button. The installation takes just a few seconds, and once complete, you'll see the CodeLens icon appear in your browser toolbar. No configuration required - the extension is ready to use immediately after installation.",
      features: [
        "One-click installation from Chrome Web Store",
        "No registration or sign-up required",
        "Lightweight and fast - minimal impact on browser performance",
        "Automatic updates ensure you always have the latest features",
        "Works seamlessly across all your Chrome tabs"
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
        </svg>
      )
    },
    {
      number: "02",
      title: "Navigate to Code",
      description: "Visit any supported platform like GitHub, CodeSandbox, or StackBlitz.",
      detailedDescription: "CodeLens works seamlessly across multiple popular coding platforms. Whether you're browsing repositories on GitHub, exploring projects on CodeSandbox, experimenting in StackBlitz, or reading documentation with code snippets, CodeLens automatically detects and enhances your experience. Simply navigate to any of these platforms as you normally would.",
      features: [
        "Full GitHub integration - repositories, gists, and pull requests",
        "CodeSandbox and StackBlitz real-time analysis",
        "Support for documentation sites with code examples",
        "Works with private and public repositories",
        "Automatic platform detection - no manual configuration needed"
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      )
    },
    {
      number: "03",
      title: "Automatic Analysis",
      description: "Open the extension and it automatically detects code blocks and analyzes complexity in real-time.",
      detailedDescription: "Once you're on a supported platform, CodeLens springs into action. Our advanced algorithms scan the page in real-time, identifying code blocks in various programming languages. The extension analyzes cyclomatic complexity, code structure, function depth, and potential optimization opportunities - all happening seamlessly in the background without any manual input from you.",
      features: [
        "Real-time code detection across multiple languages",
        "Cyclomatic complexity calculation for functions and methods",
        "Deep code structure analysis and nesting level detection",
        "Performance metrics and optimization suggestions",
        "Instant analysis with no page refresh needed",
        "Support for JavaScript, TypeScript, Python, Java, and more"
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      number: "04",
      title: "Visual Insights",
      description: "See complexity highlights inline and detailed charts in the extension popup.",
      detailedDescription: "CodeLens presents its analysis through beautiful, intuitive visualizations. Code blocks are highlighted directly on the page with color-coded complexity indicators. Click the extension icon to open a detailed popup featuring interactive charts, graphs, and metrics that help you understand your code's complexity at a glance. Export reports, compare metrics, and track improvements over time.",
      features: [
        "Color-coded complexity highlights directly in your browser",
        "Interactive charts and graphs in the extension popup",
        "Function-by-function breakdown with detailed metrics",
        "Exportable reports for documentation and code reviews",
        "Trend analysis to track code quality improvements",
        "Customizable complexity thresholds and alert levels"
      ],
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      )
    }
  ]

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-12 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        {/* Left-Aligned Wide Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 md:mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Simple, intuitive workflow to get you analyzing code complexity in minutes.
            </p>
          </div>
          <div className="text-left md:text-right flex-shrink-0">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-400">
              4-Step Workflow
            </span>
          </div>
        </div>

        {/* Expansive Steps Grid across the page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:text-slate-900 group-hover:bg-slate-100 transition-colors">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                <span>Click to learn more</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Card Modal */}
      {expandedCard !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setExpandedCard(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative max-w-2xl w-full max-h-[88vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedCard(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                  {steps[expandedCard].icon}
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Step {steps[expandedCard].number}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                {steps[expandedCard].title}
              </h3>
              
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {steps[expandedCard].detailedDescription}
              </p>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">
                  Key Points:
                </h4>
                <ul className="space-y-2.5">
                  {steps[expandedCard].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default HowItWorks
