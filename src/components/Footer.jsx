import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 px-4 sm:px-6 lg:px-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold tracking-tight text-white mb-3">
              CodeLens
            </h3>
            <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
              Analyze code complexity in real-time with our powerful Chrome extension. Get instant insights into your code's maintainability and quality.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:codelensextension@gmail.com" 
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/70 hover:bg-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4v-9.99l8 6.99 8-6.99V18z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/thecodelens/about/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/70 hover:bg-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2024 CodeLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
