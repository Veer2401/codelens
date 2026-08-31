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
    <div className="w-96 h-[600px] bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight text-white">CodeLens</h1>
          </div>
          <span className="text-[11px] font-mono text-slate-400">v1.1.0</span>
        </div>
        <p className="text-slate-400 text-xs mt-0.5">
          Real-time complexity analysis
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-2.5 mx-3 mt-2.5 rounded-xl">
          <div className="text-rose-200 text-xs mb-1.5 leading-snug">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs rounded-lg transition-colors"
            >
              Refresh
            </button>
            <button 
              onClick={getComplexityData}
              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Platform Info */}
      {currentUrl && (
        <div className="px-4 py-2 bg-slate-950/60 text-xs text-slate-400 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-slate-500">Platform:</span>
              <span className="text-slate-200 font-mono truncate">{new URL(currentUrl).hostname}</span>
            </div>
            {isSupportedPlatform ? (
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[11px] font-medium flex-shrink-0">
                ✓ Supported
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[11px] font-medium flex-shrink-0">
                ✗ Not supported
              </span>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 px-2 pt-1.5 flex-shrink-0">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'functions', label: 'Functions', icon: '🔍' },
          { id: 'charts', label: 'Analysis', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex-1 py-2 px-3 text-xs font-medium transition-all rounded-t-lg ${
              currentTab === tab.id
                ? 'bg-slate-800 text-white border-t border-x border-slate-700 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span className="mr-1.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto space-y-3">
        {currentTab === 'overview' && (
          <div className="space-y-3">
            <ComplexityScore
              score={getAverageComplexity()}
              label={getScoreLabel(getAverageComplexity())}
              colorClass={getScoreColor(getAverageComplexity())}
            />
            
            {/* Code Health Score */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
                  Code Health Score
                </h3>
                <div className="text-xl font-bold font-mono text-slate-100">
                  {complexityData.totalFunctions === 0 ? 0 : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100))))}%
                </div>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-blue-500"
                  style={{ width: `${complexityData.totalFunctions === 0 ? 0 : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100))))}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {getAverageComplexity() <= 5 ? 'Excellent maintainability' : getAverageComplexity() <= 10 ? 'Good code structure' : getAverageComplexity() <= 15 ? 'Needs improvement' : 'Requires refactoring'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-slate-700/60">
                <div className="text-xl font-bold font-mono text-white truncate" title={complexityData.totalFunctions}>
                  {complexityData.totalFunctions}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Total Functions</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-slate-700/60">
                <div className="text-xl font-bold font-mono text-white truncate" title={getAverageComplexity().toFixed(2)}>
                  {getAverageComplexity().toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Avg Complexity</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-slate-700/60">
                <div className="text-xl font-bold font-mono text-emerald-400 truncate">
                  {complexityData.functions.filter(f => f.complexity <= 10).length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Low Risk</div>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 text-center border border-slate-700/60">
                <div className="text-xl font-bold font-mono text-rose-400 truncate">
                  {complexityData.functions.filter(f => f.complexity > 15).length}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">High Risk</div>
              </div>
            </div>

            {/* Complexity Breakdown */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <h3 className="font-semibold text-slate-200 mb-2 flex items-center text-xs uppercase tracking-wider">
                <span className="mr-1.5">📊</span>
                Complexity Breakdown
              </h3>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">Low (1-10)</span>
                  </div>
                  <span className="font-semibold text-emerald-400">{complexityData.functions.filter(f => f.complexity <= 10).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">Medium (11-15)</span>
                  </div>
                  <span className="font-semibold text-amber-400">{complexityData.functions.filter(f => f.complexity > 10 && f.complexity <= 15).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mr-2"></div>
                    <span className="text-slate-300">High (16+)</span>
                  </div>
                  <span className="font-semibold text-rose-400">{complexityData.functions.filter(f => f.complexity > 15).length}</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment & Recommendations */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
              <h3 className="font-semibold text-slate-200 mb-2 flex items-center text-xs uppercase tracking-wider">
                <span className="mr-1.5">🎯</span>
                Recommendations
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5">
                {getAverageComplexity() <= 5 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-emerald-400">✅</span>
                      <span>Excellent! Your code has low complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-slate-500">•</span>
                      <span>Maintain this quality as you add features</span>
                    </li>
                  </>
                )}
                {getAverageComplexity() > 5 && getAverageComplexity() <= 10 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-blue-400">✓</span>
                      <span>Good complexity level overall</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-slate-500">•</span>
                      <span>Monitor high-complexity functions</span>
                    </li>
                  </>
                )}
                {getAverageComplexity() > 10 && (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-amber-400">⚠️</span>
                      <span>High complexity detected</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-slate-500">•</span>
                      <span>Break down complex functions into smaller ones</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-slate-500">•</span>
                      <span>Use early returns to reduce nesting</span>
                    </li>
                  </>
                )}
                {complexityData.functions.filter(f => f.complexity > 15).length > 0 && (
                  <li className="flex items-start">
                    <span className="mr-1.5 text-rose-400">🔴</span>
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
      <div className="border-t border-slate-800 p-2 bg-slate-950/60 flex-shrink-0">
        <div className="flex items-center justify-center text-[11px] text-slate-500">
          CodeLens Real-Time Analysis
        </div>
      </div>
    </div>
  )
}

export default Popup
