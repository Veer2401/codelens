import React from 'react'

const ComplexityChart = ({ functions }) => {
  if (!functions || functions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📊</div>
        <div className="text-sm">No data to visualize</div>
        <div className="text-xs mt-1">Analyze some code first</div>
      </div>
    )
  }

  // Group functions by complexity ranges
  const complexityRanges = {
    '1-5': functions.filter(f => f.complexity <= 5).length,
    '6-10': functions.filter(f => f.complexity > 5 && f.complexity <= 10).length,
    '11-15': functions.filter(f => f.complexity > 10 && f.complexity <= 15).length,
    '16+': functions.filter(f => f.complexity > 15).length
  }

  const maxCount = Math.max(...Object.values(complexityRanges))
  const colors = {
    '1-5': 'bg-complexity-low',
    '6-10': 'bg-complexity-low',
    '11-15': 'bg-complexity-high',
    '16+': 'bg-complexity-extreme'
  }

  // Bubble chart data
  const bubbleData = functions.slice(0, 20).map((func, index) => ({
    ...func,
    size: Math.max(20, Math.min(60, func.complexity * 3)),
    color: func.complexity <= 10 ? 'bg-complexity-low' :
           func.complexity <= 15 ? 'bg-complexity-high' : 'bg-complexity-extreme'
  }))

  return (
    <div className="space-y-6">
      {/* Bar Chart */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Complexity Distribution</h3>
        <div className="space-y-3">
          {Object.entries(complexityRanges).map(([range, count]) => (
            <div key={range} className="flex items-center space-x-3">
              <div className="w-16 text-sm text-gray-600">{range}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${colors[range]}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bubble Chart */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Function Complexity Bubble Chart</h3>
        <div className="bg-gray-50 rounded-lg p-4 h-48 relative overflow-hidden">
          {bubbleData.map((func, index) => (
            <div
              key={index}
              className={`absolute rounded-full flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-all duration-300 hover:scale-110 ${func.color}`}
              style={{
                width: `${func.size}px`,
                height: `${func.size}px`,
                left: `${20 + (index % 5) * 70}px`,
                top: `${20 + Math.floor(index / 5) * 80}px`,
                fontSize: `${Math.max(8, func.size / 6)}px`
              }}
              title={`${func.name || 'Anonymous'}: ${func.complexity} complexity`}
            >
              {func.complexity}
            </div>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-2 left-2 flex space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-complexity-low rounded-full"></div>
              <span className="text-gray-600">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-complexity-low rounded-full"></div>
              <span className="text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-complexity-high rounded-full"></div>
              <span className="text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-complexity-extreme rounded-full"></div>
              <span className="text-gray-600">Extreme</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Best Practices</h4>
          <div className="space-y-1 text-sm text-green-800">
            {functions
              .filter(f => f.complexity <= 5)
              .slice(0, 3)
              .map((func, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate">{func.name || `Function ${index + 1}`}</span>
                  <span className="font-medium">{func.complexity}</span>
                </div>
              ))}
            {functions.filter(f => f.complexity <= 5).length === 0 && (
              <span className="text-green-600">No low complexity functions found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityChart
