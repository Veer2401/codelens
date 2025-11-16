import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden">
            {/* Ambient glow effects */}
            <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            
            <Hero />
            <HowItWorks />
            <Features />
            <Footer />
          </div>
        } />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  )
}

export default App
