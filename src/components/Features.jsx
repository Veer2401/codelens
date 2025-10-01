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
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Features for Better Code
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our Chrome extension provides everything you need to understand and improve your code's complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {features.map((feature, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="bg-gray-800 relative group/card hover:shadow-2xl hover:shadow-sky-500/[0.1] border-gray-700 w-auto h-auto rounded-xl p-6 border">
                <CardItem translateZ="50" className="text-sky-600 mb-4">
                  {feature.icon}
                </CardItem>
                <CardItem translateZ="60" className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </CardItem>
                <CardItem as="p" translateZ="40" className="text-white leading-relaxed">
                  {feature.description}
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
