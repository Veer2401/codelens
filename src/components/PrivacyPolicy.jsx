import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            CodeLens 
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: 12th September 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 mb-8 text-center">
            <p className="text-xl text-gray-700 leading-relaxed">
              At CodeLens, your privacy is very important to us. This Privacy Policy explains how our Chrome extension handles user data.
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">No Personal Data Collection:</h3>
                  <p>CodeLens does not collect, store, or share any personal information such as names, email addresses, or browsing history.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Code Analysis:</h3>
                  <p>The extension only analyzes the code that you choose to view. This analysis happens locally on your device.</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                How We Use Data
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>The extension simply counts the number of functions and calculates a live complexity score for the selected code.</p>
                <p>All processing is performed on your computer; no data is sent to external servers.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Data Sharing
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>CodeLens does not share your data with third parties.</p>
                <p>We do not use analytics, advertising, or tracking tools.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Permissions
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>The extension may request access to the pages you view (e.g., GitHub, CodeSandbox, or StackBlitz.) in order to analyze the code you select.</p>
                <p>These permissions are used only to read the visible code for complexity scoring.</p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Security
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>Since no personal data is collected or transmitted, the risk of data exposure is minimal.</p>
                <p>All analysis is sandboxed within your browser.</p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">6</span>
                Changes to This Policy
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>We may update this Privacy Policy from time to time. Any updates will be reflected on this page with a revised effective date.</p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">7</span>
                Contact
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="text-gray-700">
                    <a 
                      href="mailto:veerharischandrakar@gmail.com" 
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      codelensextension@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => window.history.back()}
              className="btn-primary text-lg px-8 py-4"
            >
              <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
