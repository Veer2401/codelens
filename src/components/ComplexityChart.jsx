import React, { useState } from 'react'

const ComplexityChart = ({ functions }) => {
  const [selectedFunction, setSelectedFunction] = useState(null)

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

      {/* 3D Complexity Treemap */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">3D Complexity Map</h3>
            {selectedFunction && (
              <p className="text-xs text-blue-300 mt-0.5">Click again to deselect</p>
            )}
          </div>
          {selectedFunction && (
            <button
              onClick={() => setSelectedFunction(null)}
              className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all"
            >
              ✕ Close
            </button>
          )}
        </div>
        
        {!selectedFunction ? (
          <>
            <p className="text-xs text-slate-300 mb-2">Click on any block to view details</p>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              {/* 3D Treemap Container */}
              <div className="p-2 overflow-y-auto max-h-[280px]" style={{
                perspective: '1000px',
                perspectiveOrigin: '50% 50%'
              }}>
                <div className="grid gap-1.5 grid-cols-6" style={{ 
                  gridAutoRows: 'minmax(50px, auto)',
                  transformStyle: 'preserve-3d'
                }}>
                  {functions.map((func, index) => {
                    let gradientFrom = ''
                    let gradientTo = ''
                    let shadowColor = ''
                    
                    // Determine color based on complexity
                    if (func.complexity <= 5) {
                      gradientFrom = '#10b981'
                      gradientTo = '#059669'
                      shadowColor = 'rgba(16, 185, 129, 0.5)'
                    } else if (func.complexity <= 10) {
                      gradientFrom = '#3b82f6'
                      gradientTo = '#1d4ed8'
                      shadowColor = 'rgba(59, 130, 246, 0.5)'
                    } else if (func.complexity <= 15) {
                      gradientFrom = '#fbbf24'
                      gradientTo = '#f59e0b'
                      shadowColor = 'rgba(251, 191, 36, 0.5)'
                    } else if (func.complexity <= 20) {
                      gradientFrom = '#f97316'
                      gradientTo = '#ea580c'
                      shadowColor = 'rgba(249, 115, 22, 0.5)'
                    } else {
                      gradientFrom = '#ef4444'
                      gradientTo = '#dc2626'
                      shadowColor = 'rgba(239, 68, 68, 0.5)'
                    }
                    
                    // Calculate size based on complexity ranges (larger = more complex)
                    let sizeRatio = 1
                    if (func.complexity <= 5) {
                      sizeRatio = 1
                    } else if (func.complexity <= 10) {
                      sizeRatio = 2
                    } else if (func.complexity <= 15) {
                      sizeRatio = 2
                    } else if (func.complexity <= 20) {
                      sizeRatio = 3
                    } else {
                      sizeRatio = 3
                    }
                    const depth = Math.min(25, func.complexity * 1.5)
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedFunction(func)}
                        className="relative cursor-pointer group"
                        style={{
                          gridColumn: `span ${sizeRatio}`,
                          gridRow: `span ${sizeRatio}`,
                          minHeight: '50px',
                          transformStyle: 'preserve-3d',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {/* 3D Block */}
                        <div
                          className="w-full h-full rounded-lg text-white font-bold flex flex-col items-center justify-center relative overflow-hidden"
                          style={{
                            background: `linear-gradient(145deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
                            boxShadow: `
                              0 ${depth/2}px ${depth}px ${shadowColor},
                              0 4px 8px rgba(0, 0, 0, 0.3),
                              inset 0 -2px 8px rgba(0, 0, 0, 0.3),
                              inset 0 2px 8px rgba(255, 255, 255, 0.2)
                            `,
                            transform: 'translateZ(0px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = `translateZ(${depth}px) rotateX(5deg) rotateY(5deg)`
                            e.currentTarget.style.boxShadow = `
                              0 ${depth}px ${depth * 2}px ${shadowColor},
                              0 8px 16px rgba(0, 0, 0, 0.4),
                              inset 0 -2px 8px rgba(0, 0, 0, 0.3),
                              inset 0 2px 8px rgba(255, 255, 255, 0.3)
                            `
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateZ(0px)'
                            e.currentTarget.style.boxShadow = `
                              0 ${depth/2}px ${depth}px ${shadowColor},
                              0 4px 8px rgba(0, 0, 0, 0.3),
                              inset 0 -2px 8px rgba(0, 0, 0, 0.3),
                              inset 0 2px 8px rgba(255, 255, 255, 0.2)
                            `
                          }}
                        >
                          {/* Top highlight */}
                          <div 
                            className="absolute inset-0 opacity-30"
                            style={{
                              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 50%)'
                            }}
                          />
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="text-lg font-bold drop-shadow-lg">{func.complexity}</div>
                            <div className="text-xs truncate px-1 mt-0.5 opacity-90" style={{ 
                              fontSize: '0.6rem', 
                              lineHeight: '1',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                              maxWidth: `${sizeRatio * 60}px`
                            }}>
                              {(func.name || 'Anon').substring(0, sizeRatio * 5)}
                            </div>
                          </div>

                          {/* 3D Edge effect */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 h-1 opacity-50"
                            style={{
                              background: `linear-gradient(to bottom, transparent, ${gradientTo})`
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="px-2 py-2 border-t border-slate-700/50 bg-slate-800/80">
                <div className="flex flex-wrap gap-2 text-xs justify-center">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded shadow-sm" style={{ background: 'linear-gradient(145deg, #10b981, #059669)' }}></div>
                    <span className="text-slate-300">1-5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded shadow-sm" style={{ background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)' }}></div>
                    <span className="text-slate-300">6-10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded shadow-sm" style={{ background: 'linear-gradient(145deg, #fbbf24, #f59e0b)' }}></div>
                    <span className="text-slate-300">11-15</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded shadow-sm" style={{ background: 'linear-gradient(145deg, #f97316, #ea580c)' }}></div>
                    <span className="text-slate-300">16-20</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded shadow-sm" style={{ background: 'linear-gradient(145deg, #ef4444, #dc2626)' }}></div>
                    <span className="text-slate-300">20+</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Expanded Function Details View
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm p-4 space-y-3">
            {/* Function Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-100 mb-1 break-words">
                  {selectedFunction.name || 'Anonymous Function'}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    selectedFunction.complexity <= 5 ? 'text-green-400 bg-green-500/20 border-green-500/30' :
                    selectedFunction.complexity <= 10 ? 'text-blue-400 bg-blue-500/20 border-blue-500/30' :
                    selectedFunction.complexity <= 15 ? 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' :
                    selectedFunction.complexity <= 20 ? 'text-orange-400 bg-orange-500/20 border-orange-500/30' :
                    'text-red-400 bg-red-500/20 border-red-500/30'
                  }`}>
                    Complexity: {selectedFunction.complexity}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedFunction.complexity <= 5 ? 'Low Risk' :
                     selectedFunction.complexity <= 10 ? 'Medium Risk' :
                     selectedFunction.complexity <= 15 ? 'High Risk' : 'Extreme Risk'}
                  </span>
                </div>
              </div>
            </div>

            {/* Function Details */}
            <div className="space-y-2">
              {selectedFunction.line && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Line Number:</span>
                  <span className="font-medium text-slate-200">{selectedFunction.line}</span>
                </div>
              )}
              
              {selectedFunction.params && selectedFunction.params.length > 0 && (
                <div className="text-sm">
                  <span className="text-slate-400 block mb-1">Parameters ({selectedFunction.params.length}):</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFunction.params.map((param, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-700/50 text-slate-200 rounded text-xs">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFunction.label && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Complexity Label:</span>
                  <span className="font-medium text-slate-200">{selectedFunction.label}</span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30 rounded-lg p-3">
              <h5 className="font-semibold text-blue-200 mb-2 flex items-center text-sm">
                <span className="mr-1.5">💡</span>
                Recommendations
              </h5>
              <ul className="text-xs text-blue-100 space-y-1">
                {selectedFunction.complexity <= 5 ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">✓</span>
                      <span>Great! This function has low complexity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Easy to understand and maintain</span>
                    </li>
                  </>
                ) : selectedFunction.complexity <= 10 ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Consider adding comments for clarity</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Monitor if complexity increases</span>
                    </li>
                  </>
                ) : selectedFunction.complexity <= 15 ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">⚠️</span>
                      <span>Consider breaking into smaller functions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Extract helper functions for repeated logic</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Use early returns to reduce nesting</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5">🔴</span>
                      <span>High priority: Refactor this function</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Break down into multiple smaller functions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Reduce nested conditionals and loops</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1.5">•</span>
                      <span>Consider using design patterns</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setSelectedFunction(null)}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                ← Back to 3D Map
              </button>
            </div>
          </div>
        )}
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
