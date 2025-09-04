import React from 'react'

const FunctionList = ({ functions }) => {
  const getComplexityColor = (complexity) => {
    if (complexity <= 5) return 'text-complexity-low bg-complexity-low/10'
    if (complexity <= 10) return 'text-complexity-medium bg-complexity-medium/10'
    if (complexity <= 15) return 'text-complexity-high bg-complexity-high/10'
    return 'text-complexity-extreme bg-complexity-extreme/10'
  }

  const getComplexityLabel = (complexity) => {
    if (complexity <= 5) return 'Low'
    if (complexity <= 10) return 'Medium'
    if (complexity <= 15) return 'High'
    return 'Extreme'
  }

  const handleFunctionClick = async (func) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
          action: 'highlightFunction',
          functionName: func.name,
          line: func.line
        })
      }
    } catch (error) {
      console.error('Error highlighting function:', error)
    }
  }

  if (!functions || functions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🔍</div>
        <div className="text-sm">No functions analyzed yet</div>
        <div className="text-xs mt-1">Click "Analyze" to start</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Found {functions.length} functions</span>
        <span className="text-xs">Click function to highlight in code</span>
      </div>
      
      {functions.map((func, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer group"
          onClick={() => handleFunctionClick(func)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {(func.name || `Anonymous Function ${index + 1}`)}
              {func.count && func.count > 1 && (
                <span className="ml-2 text-xs text-gray-500">- {func.count}</span>
              )}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(func.complexity)}`}>
              {func.complexity}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              {func.params && `${func.params.length} params`}
            </div>
            <div className={`text-xs font-medium ${getComplexityColor(func.complexity)}`}>
              {getComplexityLabel(func.complexity)}
            </div>
          </div>
          
          {func.complexity > 10 && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              💡 Consider breaking this function into smaller, more focused functions
            </div>
          )}
        </div>
      ))}
      
      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Complexity Distribution</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-complexity-low">Low (1-5):</span>
            <span className="font-medium">
              {functions.filter(f => f.complexity <= 5).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-complexity-medium">Medium (6-10):</span>
            <span className="font-medium">
              {functions.filter(f => f.complexity > 5 && f.complexity <= 10).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-complexity-high">High (11-15):</span>
            <span className="font-medium">
              {functions.filter(f => f.complexity > 10 && f.complexity <= 15).length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-complexity-extreme">Extreme (16+):</span>
            <span className="font-medium">
              {functions.filter(f => f.complexity > 15).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FunctionList
