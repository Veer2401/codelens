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
    '1-5': 'bg-complexity-low',
    '6-10': 'bg-complexity-medium',
    '11-15': 'bg-complexity-high',
    '16+': 'bg-complexity-extreme'
  }

  // Bubble chart data
  const bubbleData = functions.slice(0, 20).map((func, index) => {
    let color = ''
    if (func.complexity <= 5) {
      color = 'bg-green-500' // Low - Green
    } else if (func.complexity <= 10) {
      color = 'bg-orange-500' // Medium - Orange
    } else if (func.complexity <= 15) {
      color = 'bg-red-500' // High - Red
    } else {
      color = 'bg-red-800' // Extreme - Maroon
    }
    
    return {
      ...func,
      size: Math.max(20, Math.min(60, func.complexity * 3)),
      color: color
    }
  })

  return (
    <div className="space-y-6">
      {/* Average Complexity Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Average Code Complexity</h3>
            <p className="text-sm text-gray-600">Based on cyclomatic complexity analysis</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${averageComplexity <= 5 ? 'text-green-600' : averageComplexity <= 10 ? 'text-yellow-600' : averageComplexity <= 15 ? 'text-orange-600' : 'text-red-600'}`}>
              {averageComplexity.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">
              {averageComplexity <= 5 ? 'Low Risk' : averageComplexity <= 10 ? 'Medium Risk' : averageComplexity <= 15 ? 'High Risk' : 'Extreme Risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Function Complexity Distribution</h3>
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
        <h3 className="font-semibold text-gray-900 mb-4">Individual Function Complexity (Top 20)</h3>
        <p className="text-sm text-gray-600 mb-4">Each bubble represents a function's cyclomatic complexity score</p>
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
              <div className="w-3 h-3 bg-complexity-medium rounded-full"></div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Complexity Analysis */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Code Quality Analysis</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex justify-between">
              <span>Average Complexity:</span>
              <span className="font-medium">{averageComplexity.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Functions:</span>
              <span className="font-medium">{functions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low Risk Functions:</span>
              <span className="font-medium">{functions.filter(f => f.complexity <= 5).length}</span>
            </div>
            <div className="flex justify-between">
              <span>High Risk Functions:</span>
              <span className="font-medium">{functions.filter(f => f.complexity > 15).length}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">Recommendations</h4>
          <div className="space-y-1 text-sm text-amber-800">
            {averageComplexity <= 5 && (
              <div>✅ Excellent code quality! Keep up the good work.</div>
            )}
            {averageComplexity > 5 && averageComplexity <= 10 && (
              <div>⚠️ Consider refactoring some functions to reduce complexity.</div>
            )}
            {averageComplexity > 10 && (
              <div>🚨 High complexity detected. Prioritize refactoring high-risk functions.</div>
            )}
            {functions.filter(f => f.complexity > 15).length > 0 && (
              <div>🔴 {functions.filter(f => f.complexity > 15).length} extreme complexity function(s) need immediate attention.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityChart
