import React, { useState, useEffect } from 'react'
import ComplexityChart from './ComplexityChart.jsx'
import ComplexityScore from './ComplexityScore.jsx'
import FunctionList from './FunctionList.jsx'

const Popup = () => {
  const [complexityData, setComplexityData] = useState({
    overallScore: 0,
    functions: [],
    totalFunctions: 0,
    averageComplexity: 0
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentTab, setCurrentTab] = useState('overview')
  const [error, setError] = useState(null)
  const [currentUrl, setCurrentUrl] = useState('')
  const [isSupportedPlatform, setIsSupportedPlatform] = useState(false)

  useEffect(() => {
    // Get current tab info and check if it's supported
    checkCurrentTab()

    // Listen for live updates from content script
    const listener = (message) => {
      if (message && message.type === 'complexityDataUpdated' && message.data) {
        setComplexityData(message.data)
        setError(null)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [])

  const checkCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        setCurrentUrl(tab.url)
        const supported = isPlatformSupported(tab.url)
        setIsSupportedPlatform(supported)
        
        if (supported) {
          // Try to get existing data
          await getComplexityData()
        } else {
          setError('This page is not supported. Please navigate to a supported platform like GitHub, CodeSandbox, or StackBlitz.')
        }
      }
    } catch (error) {
      console.error('Error checking current tab:', error)
      setError('Could not access current tab. Please refresh and try again.')
    }
  }

  const isPlatformSupported = (url) => {
    if (!url) return false
    
    const supportedSites = [
      'github.com',
      'gist.github.com',
      'gitlab.com',
      'bitbucket.org',
      'codesandbox.io',
      'stackblitz.com',
      'replit.com',
      'jsfiddle.net',
      'codepen.io',
      'sourceforge.net',
      'pastebin.com'
    ]
    
    return supportedSites.some(site => url.includes(site))
  }

  const getComplexityData = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab && isPlatformSupported(tab.url)) {
        // First try to ping the content script
        try {
          await chrome.tabs.sendMessage(tab.id, { action: 'ping' })
        } catch (pingError) {
          setError('Content script not loaded. Please refresh the page and try again.')
          return
        }
        
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'getComplexityData' })
        if (response && response.success) {
          setComplexityData(response.data)
          setError(null)
        } else {
          // Content script might not be ready yet
          setError('Content script not ready. Try clicking "Analyze" to initialize.')
        }
      }
    } catch (error) {
      console.error('Error getting complexity data:', error)
      if (error.message.includes('Could not establish connection')) {
        setError('Content script not loaded. Try refreshing the page or clicking "Analyze".')
      } else {
        setError('Could not connect to page. Make sure you are on a supported platform.')
      }
    }
  }

  const handleAnalyzeClick = async () => {
    if (!isSupportedPlatform) {
      setError('This page is not supported. Please navigate to a supported platform.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        // Always request a fresh analysis so functions populate
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'analyzeCode' })
        if (response && response.success) {
          setComplexityData(response.data)
          setError(null)
          // If still zero functions, try once more to force refresh
          if (!response.data || (response.data.totalFunctions === 0 && response.data.functions?.length === 0)) {
            const retry = await chrome.tabs.sendMessage(tab.id, { action: 'getComplexityData' })
            if (retry && retry.success) setComplexityData(retry.data)
          }
        } else if (response && response.error) {
          setError(response.error)
        } else {
          setError('Analysis failed. Please refresh the page and try again.')
        }
      }
    } catch (error) {
      console.error('Error analyzing code:', error)
      if (error.message.includes('Could not establish connection')) {
        setError('Content script not loaded. Please refresh the page and try again.')
      } else {
        setError('Analysis failed. Make sure you are on a supported platform with JavaScript code.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score) => {
    if (score <= 10) return 'text-complexity-low'
    if (score <= 15) return 'text-complexity-high'
    return 'text-complexity-extreme'
  }

  const getScoreLabel = (score) => {
    if (score <= 5) return 'Excellent'
    if (score <= 10) return 'Good'
    if (score <= 15) return 'Fair'
    return 'Poor'
  }

  const getAverageComplexity = () => {
    if (complexityData.averageComplexity) {
      return complexityData.averageComplexity
    }
    if (complexityData.functions.length > 0) {
      return complexityData.functions.reduce((sum, f) => sum + f.complexity, 0) / complexityData.functions.length
    }
    return 0
  }

  const handleRefresh = () => {
    checkCurrentTab()
  }

  const getLanguageDisplayName = (language) => {
    switch (language) {
      case 'javascript':
        return 'JavaScript'
      case 'typescript':
        return 'TypeScript'
      case 'python':
        return 'Python'
      case 'java':
        return 'Java'
      case 'csharp':
        return 'C#'
      case 'go':
        return 'Go'
      case 'rust':
        return 'Rust'
      default:
        return language
    }
  }

  const getLanguageColorClass = (language) => {
    switch (language) {
      case 'javascript':
        return 'bg-blue-100 text-blue-800'
      case 'typescript':
        return 'bg-green-100 text-green-800'
      case 'python':
        return 'bg-yellow-100 text-yellow-800'
      case 'java':
        return 'bg-red-100 text-red-800'
      case 'csharp':
        return 'bg-sky-100 text-sky-800'
      case 'go':
        return 'bg-teal-100 text-teal-800'
      case 'rust':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  

  return (
    <div className="w-96 h-[600px] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">CodeLens</h1>
        </div>
        <p className="text-sky-100 text-sm mt-1">
          Real-time complexity analysis
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 mx-4 mt-4 rounded-lg">
          <div className="text-red-800 text-sm mb-2">
            <strong>Error:</strong> {error}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="text-red-600 hover:text-red-800 text-xs underline"
            >
              Refresh
            </button>
            <button 
              onClick={getComplexityData}
              className="text-red-600 hover:text-red-800 text-xs underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Platform Info */}
      {currentUrl && (
        <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <strong>Current page:</strong> {new URL(currentUrl).hostname}
              {isSupportedPlatform && <span className="text-green-600 ml-2">✓ Supported</span>}
              {!isSupportedPlatform && <span className="text-red-600 ml-2">✗ Not supported</span>}
            </div>
            {complexityData.language !== 'unknown' && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Language:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getLanguageColorClass(complexityData.language)}`}>
                  {getLanguageDisplayName(complexityData.language)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'functions', label: 'Functions', icon: '🔍' },
          { id: 'charts', label: 'Charts', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              currentTab === tab.id
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[400px]">
        {currentTab === 'overview' && (
          <div className="space-y-4">
            <ComplexityScore
              score={getAverageComplexity()}
              label={getScoreLabel(getAverageComplexity())}
              colorClass={getScoreColor(getAverageComplexity())}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 truncate" title={complexityData.totalFunctions}>
                  {complexityData.totalFunctions}
                </div>
                <div className="text-sm text-gray-600">Total Functions</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 truncate" title={getAverageComplexity().toFixed(2)}>
                  {getAverageComplexity().toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Avg Complexity</div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <h3 className="font-semibold text-sky-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-sky-800 space-y-1">
                <li>• Keep functions under 10 complexity</li>
                <li>• Break down complex functions</li>
                <li>• Use early returns to reduce nesting</li>
              </ul>
            </div>

            {/* Analyze Code Button */}
            <button 
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || !isSupportedPlatform}
              className="w-full bg-gradient-to-r from-sky-600 to-sky-500 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:from-sky-700 hover:to-sky-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>🔍</span>
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
            </button>
          </div>
        )}

        {currentTab === 'functions' && (
          <FunctionList functions={complexityData.functions} />
        )}

        {currentTab === 'charts' && (
          <ComplexityChart functions={complexityData.functions} />
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Powered by Esprima</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default Popup
