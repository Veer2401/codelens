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

  const handleGeneratePDF = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab && isPlatformSupported(tab.url)) {
        await chrome.tabs.sendMessage(tab.id, { action: 'generatePDF' })
      } else {
        setError('Cannot generate PDF. Please navigate to a supported platform.')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      setError('Failed to generate PDF. Please make sure you are on a code file.')
    }
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
    if (score <= 20) return 'text-complexity-medium'
    if (score <= 35) return 'text-complexity-high'
    return 'text-complexity-extreme'
  }

  const getScoreLabel = (score) => {
    if (score <= 10) return 'Low'
    if (score <= 20) return 'Medium'
    if (score <= 35) return 'High'
    return 'Extreme'
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
    <div className="w-96 h-[600px] bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-purple-950/40 backdrop-blur-3xl flex flex-col border border-white/10">
      {/* Header - Glass Effect */}
      <div className="bg-gradient-to-r from-indigo-500/30 via-blue-500/30 to-purple-500/30 text-white p-4 shadow-2xl flex-shrink-0 border-b border-white/10 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-xl border border-white/20">
              <span className="text-lg">💎</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">CodeLens</h1>
          </div>
        </div>
        <p className="text-blue-100/80 text-xs mt-1 font-light">
          Real-time complexity analysis
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-400/30 p-2 mx-3 mt-2 rounded-2xl backdrop-blur-xl flex-shrink-0 shadow-lg">
          <div className="text-red-200 text-xs mb-1">
            <strong>Error:</strong> {error}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200 border border-red-400/20 backdrop-blur-sm"
            >
              Refresh
            </button>
            <button 
              onClick={getComplexityData}
              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs rounded-full transition-all duration-200 border border-red-400/20 backdrop-blur-sm"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Platform Info */}
      {currentUrl && (
        <div className="px-4 py-2 bg-white/5 text-xs text-slate-200 border-b border-white/10 flex-shrink-0 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-slate-300">Platform:</span>
              <span className="text-white">{new URL(currentUrl).hostname}</span>
              {isSupportedPlatform && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-400/30 backdrop-blur-sm">✓ Supported</span>}
              {!isSupportedPlatform && <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs border border-red-400/30 backdrop-blur-sm">✗ Not supported</span>}
            </div>
            {isSupportedPlatform && complexityData.totalFunctions > 0 && (
              <button
                onClick={handleGeneratePDF}
                className="px-3 py-1 bg-gradient-to-r from-purple-500/40 to-purple-600/40 hover:from-purple-500/50 hover:to-purple-600/50 text-white text-xs font-medium rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-lg border border-purple-400/30 backdrop-blur-xl"
              >
                <span>📄</span>
                <span>Generate PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 px-2 pt-1 flex-shrink-0 backdrop-blur-xl">
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
                ? 'bg-gradient-to-b from-blue-500/40 to-blue-600/40 text-white shadow-lg border-t border-x border-blue-400/30 backdrop-blur-2xl'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="mr-1 text-xs">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto bg-gradient-to-br from-black/20 via-transparent to-black/10">
        {currentTab === 'overview' && (
          <div className="space-y-3">
            <ComplexityScore
              score={getAverageComplexity()}
              label={getScoreLabel(getAverageComplexity())}
              colorClass={getScoreColor(getAverageComplexity())}
            />
            
            <div className="grid grid-cols-2 gap-3">
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
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 backdrop-blur-sm rounded-xl p-2.5 text-center border border-emerald-500/30 shadow-lg">
                <div className="text-xl font-bold text-emerald-300 truncate" title={complexityData.functions.filter(f => f.complexity <= 10).length}>
                  {complexityData.functions.filter(f => f.complexity <= 10).length}
                </div>
                <div className="text-xs text-emerald-200 mt-0.5">Low Risk</div>
              </div>
              <div className="bg-gradient-to-br from-amber-600/20 to-amber-700/20 backdrop-blur-sm rounded-xl p-2.5 text-center border border-amber-500/30 shadow-lg">
                <div className="text-xl font-bold text-amber-300 truncate" title={complexityData.functions.filter(f => f.complexity > 20 && f.complexity <= 35).length}>
                  {complexityData.functions.filter(f => f.complexity > 20 && f.complexity <= 35).length}
                </div>
                <div className="text-xs text-amber-200 mt-0.5">High Risk</div>
              </div>
              <div className="bg-gradient-to-br from-red-600/20 to-red-700/20 backdrop-blur-sm rounded-xl p-2.5 text-center border border-red-500/30 shadow-lg">
                <div className="text-xl font-bold text-red-300 truncate" title={complexityData.functions.filter(f => f.complexity > 35).length}>
                  {complexityData.functions.filter(f => f.complexity > 35).length}
                </div>
                <div className="text-xs text-red-200 mt-0.5">Extreme</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-xl p-3 backdrop-blur-sm">
              <h3 className="font-semibold text-purple-200 mb-2 flex items-center text-sm">
                <span className="mr-1.5">🎯</span>
                Code Health Score
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="bg-slate-700/50 rounded-full h-3 relative shadow-inner overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        complexityData.totalFunctions === 0 ? 'bg-slate-600' :
                        getAverageComplexity() <= 10 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        getAverageComplexity() <= 20 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                        getAverageComplexity() <= 35 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: complexityData.totalFunctions === 0 ? '0%' : `${Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100)))}%` }}
                    />
                  </div>
                </div>
                <div className="ml-3 text-2xl font-bold text-purple-200">
                  {complexityData.totalFunctions === 0 ? 0 : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100))))}%
                </div>
              </div>
              <div className="text-xs text-purple-200 mt-2 text-center">
                {complexityData.totalFunctions === 0 
                  ? '🔍 Go to a file to check how your code is doing!' 
                  : Math.round(Math.min(100, Math.max(0, 100 - (getAverageComplexity() / 40 * 100)))) <= 40 
                    ? '⚠️ Needs refactoring' 
                    : '✨ Code is good!'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-3 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-200 mb-2 flex items-center text-sm">
                <span className="mr-1.5">💡</span>
                Quick Tips
              </h3>
              <ul className="text-xs text-blue-100 space-y-1.5">
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Keep functions under 20 complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Refactor functions above 35 complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Use early returns to reduce nesting</span>
                </li>
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
      <div className="border-t border-slate-700/50 p-2 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center justify-center text-xs text-slate-400">
          {/* Footer content */}
        </div>
      </div>
    </div>
  )
}

export default Popup
