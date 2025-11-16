import React from 'react'

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Install Extension",
      description: "Add CodeLens to Chrome from the Web Store with one click.",
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
              <div className="h-full flex flex-col items-center text-center p-6 rounded-3xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl" style={{
                background: 'rgba(15, 23, 42, 0.3)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.125)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                minHeight: '360px'
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.3)';
                e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.125)';
              }}>
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
