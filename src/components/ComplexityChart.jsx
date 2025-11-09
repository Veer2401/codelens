import React from 'react'

const ComplexityChart = ({ functions }) => {
  if (!functions || functions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <div className="text-4xl mb-2">📊</div>
        <div className="text-sm">No data to visualize</div>
        <div className="text-xs mt-1">Analyze some code first</div>
      </div>
    )
  }

  // Calculate average complexity and complexity distribution
  const averageComplexity = functions.length > 0 
    ? functions.reduce((sum, f) => sum + f.complexity, 0) / functions.length 
    : 0
  
  const complexityRanges = {
    '1-5': functions.filter(f => f.complexity <= 5).length,
    '6-10': functions.filter(f => f.complexity > 5 && f.complexity <= 10).length,
    '11-15': functions.filter(f => f.complexity > 10 && f.complexity <= 15).length,
    '16+': functions.filter(f => f.complexity > 15).length
  }

  const maxCount = Math.max(...Object.values(complexityRanges))
  const colors = {
    '1-5': 'bg-gradient-to-r from-green-500 to-emerald-500',
    '6-10': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    '11-15': 'bg-gradient-to-r from-yellow-500 to-orange-500',
    '16+': 'bg-gradient-to-r from-red-500 to-pink-500'
  }

  // Bubble chart data
  const bubbleData = functions.slice(0, 20).map((func, index) => {
    let color = ''
    if (func.complexity <= 5) {
      color = 'bg-green-500' // Low - Green
    } else if (func.complexity <= 10) {
      color = 'bg-blue-500' // Medium - Blue
    } else if (func.complexity <= 15) {
      color = 'bg-orange-500' // High - Orange
    } else {
      color = 'bg-red-500' // Extreme - Red
    }
    
    return {
      ...func,
      size: Math.max(20, Math.min(60, func.complexity * 3)),
      color: color
    }
  })

  return (
    <div className="space-y-3">
      {/* Average Complexity Display */}
      <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-xl p-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 mb-0.5 text-sm">Average Code Complexity</h3>
            <p className="text-xs text-slate-300">Cyclomatic complexity analysis</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${averageComplexity <= 5 ? 'text-green-400' : averageComplexity <= 10 ? 'text-yellow-400' : averageComplexity <= 15 ? 'text-orange-400' : 'text-red-400'}`}>
              {averageComplexity.toFixed(1)}
            </div>
            <div className="text-xs text-slate-300">
              {averageComplexity <= 5 ? 'Low Risk' : averageComplexity <= 10 ? 'Medium Risk' : averageComplexity <= 15 ? 'High Risk' : 'Extreme Risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="font-semibold text-slate-100 mb-2 text-sm">Function Complexity Distribution</h3>
        <div className="space-y-2">
          {Object.entries(complexityRanges).map(([range, count]) => (
            <div key={range} className="flex items-center space-x-2">
              <div className="w-14 text-xs text-slate-300">{range}</div>
              <div className="flex-1 bg-slate-700/50 rounded-full h-3 relative overflow-hidden shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${colors[range]} shadow-lg`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <div className="w-6 text-xs font-medium text-slate-100">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bubble Chart */}
      <div>
        <h3 className="font-semibold text-slate-100 mb-2 text-sm">Individual Function Complexity (Top 20)</h3>
        <p className="text-xs text-slate-300 mb-2">Each bubble represents a function's cyclomatic complexity score</p>
        <div className="bg-slate-800/50 rounded-xl p-3 h-36 relative overflow-hidden border border-slate-700/50 backdrop-blur-sm">
          {bubbleData.map((func, index) => (
            <div
              key={index}
              className={`absolute rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer transition-all duration-300 hover:scale-110 ${func.color} shadow-lg`}
              style={{
                width: `${func.size * 0.8}px`,
                height: `${func.size * 0.8}px`,
                left: `${15 + (index % 5) * 60}px`,
                top: `${15 + Math.floor(index / 5) * 60}px`,
                fontSize: `${Math.max(7, func.size / 7)}px`
              }}
              title={`${func.name || 'Anonymous'}: ${func.complexity} complexity`}
            >
              {func.complexity}
            </div>
          ))}
          
          {/* Legend */}
          <div className="absolute bottom-1.5 left-1.5 flex space-x-1.5 text-xs">
            <div className="flex items-center space-x-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
              <span className="text-slate-300 text-xs">Low</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
              <span className="text-slate-300 text-xs">Med</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-2 h-2 bg-orange-500 rounded-full shadow-sm"></div>
              <span className="text-slate-300 text-xs">High</span>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-2 h-2 bg-red-500 rounded-full shadow-sm"></div>
              <span className="text-slate-300 text-xs">Ext</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2">
        {/* Complexity Analysis */}
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-2.5 backdrop-blur-sm">
          <h4 className="font-semibold text-blue-200 mb-1.5 text-xs">Code Quality</h4>
          <div className="space-y-1 text-xs text-blue-100">
            <div className="flex justify-between">
              <span>Avg:</span>
              <span className="font-medium">{averageComplexity.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium">{functions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low:</span>
              <span className="font-medium">{functions.filter(f => f.complexity <= 5).length}</span>
            </div>
            <div className="flex justify-between">
              <span>High:</span>
              <span className="font-medium">{functions.filter(f => f.complexity > 15).length}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-2.5 backdrop-blur-sm">
          <h4 className="font-semibold text-amber-200 mb-1.5 text-xs">Tips</h4>
          <div className="space-y-0.5 text-xs text-amber-100">
            {averageComplexity <= 5 && (
              <div>✅ Excellent code quality!</div>
            )}
            {averageComplexity > 5 && averageComplexity <= 10 && (
              <div>⚠️ Consider refactoring some functions.</div>
            )}
            {averageComplexity > 10 && (
              <div>🚨 High complexity detected. Refactor high-risk functions.</div>
            )}
            {functions.filter(f => f.complexity > 15).length > 0 && (
              <div>🔴 {functions.filter(f => f.complexity > 15).length} extreme complexity function(s).</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityChart
