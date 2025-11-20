import React, { useState } from 'react'

const HowItWorks = () => {
  const [expandedCard, setExpandedCard] = useState(null)

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
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      )
    }
  ]

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
              How It Works
            </span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="group h-full">
              <div 
                className="h-full flex flex-col items-center text-center p-6 rounded-3xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl cursor-pointer" 
                style={{
                  background: 'rgba(15, 23, 42, 0.3)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.125)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  minHeight: '360px'
                }} 
                onClick={() => setExpandedCard(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }} 
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.3)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.125)';
                }}
              >
                <div className="mb-6 mt-2">
                  <div className="w-20 h-20 mx-auto rounded-full shadow-lg flex items-center justify-center text-blue-400 transition-all duration-500 group-hover:text-cyan-400" style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    boxShadow: '0 4px 24px rgba(59, 130, 246, 0.2)'
                  }}>
                    <div className="scale-75">
                      {step.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 px-2">
                  {step.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm flex-grow px-2">
                  {step.description}
                </p>
                <div className="mt-4 text-blue-400 text-sm font-medium">
                  Click to learn more →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Card Modal */}
      {expandedCard !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={() => setExpandedCard(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl animate-scaleIn"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              animation: 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setExpandedCard(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 z-10"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 md:p-12">
              {/* Header Section */}
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-shrink-0">
                  <div 
                    className="w-24 h-24 rounded-2xl shadow-2xl flex items-center justify-center text-blue-400"
                    style={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {steps[expandedCard].icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-blue-400 mb-2">
                    STEP {steps[expandedCard].number}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {steps[expandedCard].title}
                  </h3>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    {steps[expandedCard].detailedDescription}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div 
                className="rounded-2xl p-6 md:p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Key Features
                </h4>
                <ul className="space-y-4">
                  {steps[expandedCard].features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-3 text-slate-300 animate-slideIn"
                      style={{
                        animationDelay: `${idx * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <svg className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
