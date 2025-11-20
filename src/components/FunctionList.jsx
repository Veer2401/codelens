import React, { useState } from 'react'

const FunctionList = ({ functions }) => {
  const [highlightingFunction, setHighlightingFunction] = useState(null)
  const [highlightError, setHighlightError] = useState(null)

  const getComplexityColor = (complexity) => {
    if (complexity <= 10) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (complexity <= 20) return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    if (complexity <= 35) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  const getComplexityLabel = (complexity) => {
    if (complexity <= 10) return 'Low'
    if (complexity <= 20) return 'Medium'
    if (complexity <= 35) return 'High'
    return 'Extreme'
  }

  const handleFunctionClick = async (func) => {
    setHighlightingFunction(func.name)
    setHighlightError(null)
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: 'highlightFunction',
          functionName: func.name,
          line: func.line
        })
        
        if (response && !response.success) {
          setHighlightError(response.error || 'Failed to highlight function')
        }
      } else {
        setHighlightError('No active tab found')
      }
    } catch (error) {
      console.error('Error highlighting function:', error)
      setHighlightError('Failed to communicate with content script')
    } finally {
      setHighlightingFunction(null)
    }
  }

  if (!functions || functions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <div className="text-4xl mb-2">🔍</div>
        <div className="text-sm">No functions analyzed yet</div>
        <div className="text-xs mt-1 text-slate-500">Go to a file to start analysing</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
        <span>Found {functions.length} functions</span>
        <span className="text-xs">Click to highlight</span>
      </div>
      
      {highlightError && (
        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-200 backdrop-blur-sm">
          <div className="font-medium">Highlight Error:</div>
          <div>{highlightError}</div>
        </div>
      )}
      
      {functions.map((func, index) => (
        <div
          key={index}
          className={`border border-slate-600/50 rounded-xl p-3 hover:border-blue-500/50 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group shadow-lg ${
            highlightingFunction === func.name ? 'bg-blue-500/20 border-blue-500/50' : 'bg-slate-800/50'
          }`}
          onClick={() => handleFunctionClick(func)}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="font-medium text-slate-100 group-hover:text-blue-300 transition-colors flex items-center text-sm">
              {(func.name || `Anonymous Function ${index + 1}`)}
              {func.count && func.count > 1 && (
                <span className="ml-2 text-xs text-slate-400">× {func.count}</span>
              )}
              {highlightingFunction === func.name && (
                <span className="ml-2 text-xs text-blue-400">⏳ Highlighting...</span>
              )}
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getComplexityColor(func.complexity)}`}>
              {func.complexity}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="text-slate-400">
              {func.params && `${func.params.length} params`}
            </div>
            <div className={`text-xs font-medium ${getComplexityColor(func.complexity).split(' ')[0]}`}>
              {getComplexityLabel(func.complexity)}
            </div>
          </div>
          
          {func.complexity > 20 && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-200 backdrop-blur-sm">
              💡 Consider breaking this function into smaller, more focused functions
            </div>
          )}
        </div>
      ))}
      
      {/* Summary */}
      <div className="mt-3 p-3 bg-slate-800/50 rounded-xl border border-slate-600/30 backdrop-blur-sm">
        <h4 className="font-semibold text-slate-100 mb-2 flex items-center text-sm">
          <span className="mr-1.5">📊</span>
          Complexity Distribution
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-green-400">Low (1-10):</span>
            <span className="font-semibold text-slate-200 bg-green-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity <= 10).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400">Medium (11-20):</span>
            <span className="font-semibold text-slate-200 bg-blue-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 10 && f.complexity <= 20).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-yellow-400">High (21-35):</span>
            <span className="font-semibold text-slate-200 bg-yellow-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 20 && f.complexity <= 35).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-red-400">Extreme (36+):</span>
            <span className="font-semibold text-slate-200 bg-red-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 35).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FunctionList
