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

  useEffect(() => {
    // Get complexity data from the current page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'getComplexityData' }, (response) => {
          if (response && response.success) {
            setComplexityData(response.data)
          }
        })
      }
    })
  }, [])

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'analyzeCode' }, (response) => {
          setIsAnalyzing(false)
          if (response && response.success) {
            setComplexityData(response.data)
          }
        })
      }
    })
  }

  const getScoreColor = (score) => {
    if (score <= 5) return 'text-complexity-low'
    if (score <= 10) return 'text-complexity-medium'
    if (score <= 15) return 'text-complexity-high'
    return 'text-complexity-extreme'
  }

  const getScoreLabel = (score) => {
    if (score <= 5) return 'Excellent'
    if (score <= 10) return 'Good'
    if (score <= 15) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="w-96 h-[600px] bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Complexity Visualizer</h1>
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Real-time code complexity analysis
        </p>
      </div>

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
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto h-[480px]">
        {currentTab === 'overview' && (
          <div className="space-y-4">
            <ComplexityScore
              score={complexityData.overallScore}
              label={getScoreLabel(complexityData.overallScore)}
              colorClass={getScoreColor(complexityData.overallScore)}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {complexityData.totalFunctions}
                </div>
                <div className="text-sm text-gray-600">Total Functions</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {complexityData.averageComplexity.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Complexity</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Keep functions under 10 complexity</li>
                <li>• Break down complex functions</li>
                <li>• Use early returns to reduce nesting</li>
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
