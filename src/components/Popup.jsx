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


  

  return (
    <div className="w-96 h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white p-4 shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight">CodeLens</h1>
          </div>
        </div>
        <p className="text-blue-100 text-xs mt-1 font-light">
          Real-time complexity analysis
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-2 mx-3 mt-2 rounded-xl backdrop-blur-sm">
          <div className="text-red-200 text-xs mb-1">
            <strong>Error:</strong> {error}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200"
            >
              Refresh
            </button>
            <button 
              onClick={getComplexityData}
              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Platform Info */}
      {currentUrl && (
        <div className="px-4 py-2 bg-slate-800/50 text-xs text-slate-300 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-400">Platform:</span>
              <span className="text-slate-200">{new URL(currentUrl).hostname}</span>
              {isSupportedPlatform && <span className="px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full text-xs">✓ Supported</span>}
              {!isSupportedPlatform && <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs">✗ Not supported</span>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-700/50 bg-slate-800/30 px-2 pt-1 flex-shrink-0">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'functions', label: 'Functions', icon: '🔍' },
          { id: 'charts', label: 'Analysis', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium transition-all duration-200 rounded-t-xl ${
              currentTab === tab.id
                ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
            }`}
          >
            <span className="mr-1 text-xs">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto">
        {currentTab === 'overview' && (
          <div className="space-y-3">
            <ComplexityScore
              score={getAverageComplexity()}
              label={getScoreLabel(getAverageComplexity())}
              colorClass={getScoreColor(getAverageComplexity())}
            />
            
            {/* Code Health Score */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-purple-200 text-sm">
                  Code Health Score
                </h3>
                <div className="text-2xl font-bold text-purple-300">
                  {complexityData.totalFunctions === 0 ? 0 : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100))))}%
                </div>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-purple-400"
                  style={{ width: `${complexityData.totalFunctions === 0 ? 0 : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100))))}%` }}
                />
              </div>
              <p className="text-xs text-purple-200 mt-1">
                {getAverageComplexity() <= 5 ? 'Excellent maintainability' : getAverageComplexity() <= 10 ? 'Good code structure' : getAverageComplexity() <= 15 ? 'Needs improvement' : 'Requires refactoring'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-600/30 shadow-lg">
                <div className="text-2xl font-bold text-white truncate" title={complexityData.totalFunctions}>
                  {complexityData.totalFunctions}
                </div>
                <div className="text-xs text-slate-300 mt-1">Total Functions</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl p-3 text-center border border-slate-600/30 shadow-lg">
                <div className="text-2xl font-bold text-white truncate" title={getAverageComplexity().toFixed(2)}>
                  {getAverageComplexity().toFixed(2)}
                </div>
                <div className="text-xs text-slate-300 mt-1">Avg Complexity</div>
              </div>
              <div className="bg-gradient-to-br from-green-700/30 to-green-800/30 backdrop-blur-sm rounded-xl p-3 text-center border border-green-600/30 shadow-lg">
                <div className="text-2xl font-bold text-green-300 truncate">
                  {complexityData.functions.filter(f => f.complexity <= 10).length}
                </div>
                <div className="text-xs text-green-200 mt-1">Low Risk</div>
              </div>
              <div className="bg-gradient-to-br from-red-700/30 to-red-800/30 backdrop-blur-sm rounded-xl p-3 text-center border border-red-600/30 shadow-lg">
                <div className="text-2xl font-bold text-red-300 truncate">
                  {complexityData.functions.filter(f => f.complexity > 15).length}
                </div>
                <div className="text-xs text-red-200 mt-1">High Risk</div>
              </div>
            </div>

            {/* Complexity Breakdown */}
            <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600/30 rounded-xl p-3 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-100 mb-2 flex items-center text-sm">
                <span className="mr-1.5">📊</span>
                Complexity Breakdown
              </h3>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">Low (1-10)</span>
                  </div>
                  <span className="font-semibold text-green-300">{complexityData.functions.filter(f => f.complexity <= 10).length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">Medium (11-15)</span>
                  </div>
                  <span className="font-semibold text-yellow-300">{complexityData.functions.filter(f => f.complexity > 10 && f.complexity <= 15).length}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">High (16+)</span>
                  </div>
                  <span className="font-semibold text-red-300">{complexityData.functions.filter(f => f.complexity > 15).length}</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment & Recommendations */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-3 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-200 mb-2 flex items-center text-sm">
                <span className="mr-1.5">🎯</span>
                Recommendations
              </h3>
              <ul className="text-xs text-blue-100 space-y-1.5">
                {getAverageComplexity() <= 5 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">✅</span>
                      <span>Excellent! Your code has low complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Maintain this quality as you add features</span>
                    </li>
                  </>
                )}
                {getAverageComplexity() > 5 && getAverageComplexity() <= 10 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">✓</span>
                      <span>Good complexity level overall</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Monitor high-complexity functions</span>
                    </li>
                  </>
                )}
                {getAverageComplexity() > 10 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">⚠️</span>
                      <span>High complexity detected</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Break down complex functions into smaller ones</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Use early returns to reduce nesting</span>
                    </li>
                  </>
                )}
                {complexityData.functions.filter(f => f.complexity > 15).length > 0 && (
                  <li className="flex items-start">
                    <span className="mr-1.5">🔴</span>
                    <span>{complexityData.functions.filter(f => f.complexity > 15).length} function{complexityData.functions.filter(f => f.complexity > 15).length > 1 ? 's' : ''} need immediate attention</span>
                  </li>
                )}
              </ul>
            </div>
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
      <div className="border-t border-slate-700/50 p-2 bg-slate-800/30 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-center text-xs text-slate-400">
          {/* Footer content */}
        </div>
      </div>
    </div>
  )
}

export default Popup
