import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">CodeLens</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Analyze code complexity in real-time with our powerful Chrome extension. 
              Get instant insights into your code's maintainability.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:codelensextension@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4v-9.99l8 6.99 8-6.99V18z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/thecodelens/about/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.852-3.047-1.853 0-2.136 1.445-2.136 2.939v5.677H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="md:col-start-4">
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li> */}
              {/* <li><a href="#" className="hover:text-white transition-colors">API</a></li> */}
              <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          {/* <p className="text-gray-400 text-sm">
            © 2024 Live Complexity Visualizer. All rights reserved.
          </p> */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-base font-semibold transition-colors" onClick={() => window.scrollTo(0, 0)}>Privacy Policy</Link>
            {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a> */}
            {/* <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
