import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Footer from './components/Footer.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import CustomCursor from './components/CustomCursor.jsx'

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#fafaf9] text-slate-900 relative">
              <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-grow">
                  <Hero />
                  <HowItWorks />
                  <Features />
                </main>
                <Footer />
              </div>
            </div>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  )
}

export default App
