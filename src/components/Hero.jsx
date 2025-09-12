import React from 'react'

const Hero = () => {
  return (
    <section className="py-20 px-4" style={{backgroundColor: '#eff6fe'}}>
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center shadow">
              <img
                src="codelens-logo.jpg"
                alt="CodeLens Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-sky-600 mb-6">
             Code<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-500">
            Lens
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Code quality, visualized.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://chromewebstore.google.com/category/extensions"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-2xl px-8 py-4 inline-block text-center"
            >
              Add to Chrome
            </a>
          {/* <a href="/demo.html" target="_blank" rel="noopener noreferrer" className="btn-secondary text-lg px-8 py-4 inline-block">
            <svg className="w-6 h-6 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            View Demo
          </a> */}
        </div>
        
        
      </div>
    </section>
  )
}

export default Hero
