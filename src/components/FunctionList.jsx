import React, { useState } from 'react'

const FunctionList = ({ functions }) => {
  const [highlightingFunction, setHighlightingFunction] = useState(null)
  const [highlightError, setHighlightError] = useState(null)

  const getComplexityColor = (complexity) => {
    if (complexity <= 10) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    if (complexity <= 15) return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  }

  const getComplexityLabel = (complexity) => {
    if (complexity <= 5) return 'Low'
    if (complexity <= 10) return 'Medium'
    if (complexity <= 15) return 'High'
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
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-sm font-medium">No functions analyzed yet</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-0.5">
        <span>Found {functions.length} functions</span>
        <span className="text-slate-400">Click to highlight</span>
      </div>
      
      {highlightError && (
        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
          <div className="font-semibold">Highlight Error:</div>
          <div>{highlightError}</div>
        </div>
      )}
      
      <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-0.5">
        {functions.map((func, index) => (
          <div
            key={index}
            className={`border rounded-xl p-3 transition-all duration-150 cursor-pointer ${
              highlightingFunction === func.name 
                ? 'bg-blue-600/20 border-blue-500/50' 
                : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
            }`}
            onClick={() => handleFunctionClick(func)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="font-medium text-slate-200 text-sm flex items-center">
                <span className="font-mono text-xs text-slate-300">
                  {func.name || `Anonymous Function ${index + 1}`}
                </span>
                {func.count && func.count > 1 && (
                  <span className="ml-2 text-xs text-slate-400">× {func.count}</span>
                )}
                {highlightingFunction === func.name && (
                  <span className="ml-2 text-xs text-blue-400 font-sans">Highlighting...</span>
                )}
              </div>
              <div className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold border ${getComplexityColor(func.complexity)}`}>
                {func.complexity}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="text-slate-400 font-mono">
                {func.params && `${func.params.length} params`}
              </div>
              <div className="text-xs font-medium text-slate-300">
                {getComplexityLabel(func.complexity)}
              </div>
            </div>
            
            {func.complexity > 10 && (
              <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
                💡 Consider breaking this function into smaller, more focused functions
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <h4 className="font-semibold text-slate-200 mb-2 flex items-center text-xs uppercase tracking-wider">
          <span className="mr-1.5">📊</span>
          Complexity Distribution
        </h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-emerald-400">Low (1-5):</span>
            <span className="font-semibold text-slate-200 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity <= 5).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-400">Medium (6-10):</span>
            <span className="font-semibold text-slate-200 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 5 && f.complexity <= 10).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-amber-400">High (11-15):</span>
            <span className="font-semibold text-slate-200 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 10 && f.complexity <= 15).length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-rose-400">Extreme (16+):</span>
            <span className="font-semibold text-slate-200 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              {functions.filter(f => f.complexity > 15).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FunctionList
