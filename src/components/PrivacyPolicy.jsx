import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Back Nav */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 text-left border-b border-slate-200/80 pb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg font-medium text-slate-600">
            CodeLens 
          </p>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Last Updated: 16th September 2025
          </p>
        </div>

        {/* Lead Note */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 mb-8 shadow-sm">
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
            At CodeLens, your privacy is very important to us. This Privacy Policy explains how our Chrome extension handles user data.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                1
              </span>
              Information We Collect
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">No Personal Data Collection:</h3>
                <p>CodeLens does not collect, store, or share any personal information such as names, email addresses, or browsing history.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Code Analysis:</h3>
                <p>The extension only analyzes the code that you choose to view. This analysis happens locally on your device.</p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                2
              </span>
              How We Use Data
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>The extension simply counts the number of functions and calculates a live complexity score for the selected code.</p>
              <p>All processing is performed on your computer; no data is sent to external servers.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                3
              </span>
              Data Sharing
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>CodeLens does not share your data with third parties.</p>
              <p>We do not use analytics, advertising, or tracking tools.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                4
              </span>
              Permissions
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>The extension may request access to the pages you view (e.g., GitHub, CodeSandbox, or StackBlitz.) in order to analyze the code you select.</p>
              <p>These permissions are used only to read the visible code for complexity scoring.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                5
              </span>
              Security
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>Since no personal data is collected or transmitted, the risk of data exposure is minimal.</p>
              <p>All analysis is sandboxed within your browser.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                6
              </span>
              Changes to This Policy
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>We may update this Privacy Policy from time to time. Any updates will be reflected on this page with a revised effective date.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 flex items-center">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0">
                7
              </span>
              Contact
            </h2>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed pl-10">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <div className="bg-slate-50 rounded-xl p-4 mt-3 border border-slate-200/80">
                <p className="text-slate-800">
                  <a 
                    href="mailto:veerharischandrakar@gmail.com" 
                    className="text-slate-900 font-medium hover:underline transition-colors"
                  >
                    codelensextension@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base px-7 py-3.5 shadow-sm transition-all hover:shadow active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
