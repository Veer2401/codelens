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
    <div className="w-96 h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-lg">👁️</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CodeLens</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-105"
              title="Refresh"
            >
              <span className="text-sm">🔄</span>
            </button>
          </div>
        </div>
        <p className="text-purple-100 text-sm mt-2 font-light">
          Real-time complexity analysis
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 mx-4 mt-4 rounded-2xl backdrop-blur-sm">
          <div className="text-red-200 text-sm mb-2">
            <strong>Error:</strong> {error}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200"
            >
              Refresh
            </button>
            <button 
              onClick={getComplexityData}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200"
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
      <div className="flex border-b border-slate-700/50 bg-slate-800/30 px-2 pt-2">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'functions', label: 'Functions', icon: '🔍' },
          { id: 'charts', label: 'Charts', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 rounded-t-xl ${
              currentTab === tab.id
                ? 'bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
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
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-slate-600/30 shadow-lg">
                <div className="text-3xl font-bold text-white truncate" title={complexityData.totalFunctions}>
                  {complexityData.totalFunctions}
                </div>
                <div className="text-sm text-slate-300 mt-1">Total Functions</div>
              </div>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-slate-600/30 shadow-lg">
                <div className="text-3xl font-bold text-white truncate" title={getAverageComplexity().toFixed(2)}>
                  {getAverageComplexity().toFixed(2)}
                </div>
                <div className="text-sm text-slate-300 mt-1">Avg Complexity</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="font-semibold text-violet-200 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Quick Tips
              </h3>
              <ul className="text-sm text-violet-100 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Keep functions under 10 complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Break down complex functions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Use early returns to reduce nesting</span>
                </li>
              </ul>
            </div>

            {/* Analyze Code Button */}
            <button 
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing || !isSupportedPlatform}
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center space-x-2 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-95"
            >
              <span className="text-lg">{isAnalyzing ? '⏳' : '🔍'}</span>
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
      <div className="border-t border-slate-700/50 p-3 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center">
            <span className="mr-1">⚡</span>
            Powered by Esprima
          </span>
          <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full">v1.1.0</span>
        </div>
      </div>
    </div>
  )
}

export default Popup
