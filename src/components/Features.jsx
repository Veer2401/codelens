import React from 'react'
import { CardBody, CardContainer, CardItem } from './ui/3d-card'

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Real-time Analysis",
      description: "Get instant complexity insights as you code, with no need to refresh or rebuild."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      title: "Inline Highlights",
      description: "Color-coded backgrounds show complexity levels directly in your code editor."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      ),
      title: "Smart Detection",
      description: "Automatically detects code blocks in GitHub, CodeSandbox, StackBlitz, and more."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ),
      title: "Interactive Charts",
      description: " Bubble charts and graphs show complexity distribution and trends."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: "Privacy First",
      description: "All analysis happens locally in your browser. No code is ever sent to servers."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: "Open Source",
      description: "Built with transparency and community in mind. Contribute and improve together."
    }
  ]

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-50 to-blue-100 bg-clip-text text-transparent">
              Features for Better Code
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Our Chrome extension provides everything you need to understand and improve your code's complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="relative group/card w-full h-60 rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl" style={{
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <CardItem translateZ="50" className="mb-4">
                  <div className="text-blue-400 group-hover/card:text-cyan-400 transition-colors">
                    {feature.icon}
                  </div>
                </CardItem>
                <CardItem translateZ="60" className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </CardItem>
                <CardItem as="p" translateZ="40" className="text-slate-300 leading-relaxed text-sm">
                  {feature.description}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <a 
            href="https://chromewebstore.google.com/detail/codelens/ohkmocfpalkecaihkoljlkbglldpbadf?hl=en-GB&authuser=0" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 font-semibold text-lg hover:text-blue-300 transition-all duration-200 group/link"
          >
            <span>Ready to get started?</span>
            <svg className="w-5 h-5 group-hover/link:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Features
