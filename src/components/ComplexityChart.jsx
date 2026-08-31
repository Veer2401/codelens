import React, { useState } from 'react'

const ComplexityChart = ({ functions }) => {
  const [selectedFunction, setSelectedFunction] = useState(null)

  if (!functions || functions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <div className="text-3xl mb-2">📊</div>
        <div className="text-sm font-medium">No data to visualize</div>
        <div className="text-xs text-slate-500 mt-1">Analyze some code first</div>
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
    '1-5': 'bg-emerald-500',
    '6-10': 'bg-blue-500',
    '11-15': 'bg-amber-500',
    '16+': 'bg-rose-500'
  }

  return (
    <div className="space-y-3">
      {/* Average Complexity Display */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Average Code Complexity</h3>
            <p className="text-xs text-slate-400">Cyclomatic complexity analysis</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold font-mono ${
              averageComplexity <= 5 ? 'text-emerald-400' :
              averageComplexity <= 10 ? 'text-blue-400' :
              averageComplexity <= 15 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {averageComplexity.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">
              {averageComplexity <= 5 ? 'Low Risk' : averageComplexity <= 10 ? 'Medium Risk' : averageComplexity <= 15 ? 'High Risk' : 'Extreme Risk'}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
        <h3 className="font-semibold text-slate-200 mb-2.5 text-xs uppercase tracking-wider">
          Function Complexity Distribution
        </h3>
        <div className="space-y-2">
          {Object.entries(complexityRanges).map(([range, count]) => (
            <div key={range} className="flex items-center space-x-2">
              <div className="w-12 text-xs font-mono text-slate-400">{range}</div>
              <div className="flex-1 bg-slate-700/60 rounded-full h-2.5 relative overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${colors[range]}`}
                  style={{ width: `${maxCount > 0 ? (count / maxCount) * 100 : 0}%` }}
                />
              </div>
              <div className="w-6 text-xs font-mono font-medium text-right text-slate-200">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Complexity Map */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">3D Complexity Map</h3>
            {selectedFunction && (
              <p className="text-xs text-blue-400 mt-0.5">Click again to deselect</p>
            )}
          </div>
          {selectedFunction && (
            <button
              onClick={() => setSelectedFunction(null)}
              className="text-xs px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
            >
              ✕ Close
            </button>
          )}
        </div>
        
        {!selectedFunction ? (
          <>
            <p className="text-xs text-slate-400 mb-2">Click on any block to view details</p>
            <div className="bg-slate-900/60 rounded-lg border border-slate-700/60 overflow-hidden">
              <div className="p-2 overflow-y-auto max-h-[220px]">
                <div className="grid gap-1.5 grid-cols-6" style={{ gridAutoRows: 'minmax(42px, auto)' }}>
                  {functions.map((func, index) => {
                    let bgClass = 'bg-emerald-600 border-emerald-500'
                    if (func.complexity > 5 && func.complexity <= 10) bgClass = 'bg-blue-600 border-blue-500'
                    else if (func.complexity > 10 && func.complexity <= 15) bgClass = 'bg-amber-600 border-amber-500'
                    else if (func.complexity > 15 && func.complexity <= 20) bgClass = 'bg-orange-600 border-orange-500'
                    else if (func.complexity > 20) bgClass = 'bg-rose-600 border-rose-500'
                    
                    let sizeRatio = 1
                    if (func.complexity > 5 && func.complexity <= 15) sizeRatio = 2
                    else if (func.complexity > 15) sizeRatio = 3
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedFunction(func)}
                        className={`relative cursor-pointer rounded border p-1 text-white flex flex-col items-center justify-center transition-all hover:scale-[1.02] hover:brightness-110 ${bgClass}`}
                        style={{
                          gridColumn: `span ${Math.min(sizeRatio, 6)}`,
                          gridRow: `span ${sizeRatio}`,
                          minHeight: '42px'
                        }}
                      >
                        <div className="text-sm font-bold font-mono leading-none">{func.complexity}</div>
                        <div className="text-[10px] font-mono truncate max-w-full opacity-90 mt-0.5">
                          {(func.name || 'Anon').substring(0, sizeRatio * 6)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="px-2.5 py-1.5 border-t border-slate-800 bg-slate-900/80">
                <div className="flex flex-wrap gap-2 text-xs justify-center font-mono">
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div>
                    <span className="text-slate-400">1-5</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded bg-blue-500"></div>
                    <span className="text-slate-400">6-10</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded bg-amber-500"></div>
                    <span className="text-slate-400">11-15</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded bg-orange-500"></div>
                    <span className="text-slate-400">16-20</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2.5 h-2.5 rounded bg-rose-500"></div>
                    <span className="text-slate-400">20+</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Expanded Function Details View */
          <div className="bg-slate-900/60 rounded-lg border border-slate-700/60 p-3 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-100 text-sm break-words font-mono">
                  {selectedFunction.name || 'Anonymous Function'}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
                    selectedFunction.complexity <= 5 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                    selectedFunction.complexity <= 10 ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' :
                    selectedFunction.complexity <= 15 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                    selectedFunction.complexity <= 20 ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' :
                    'text-rose-400 bg-rose-500/10 border-rose-500/30'
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

            <div className="space-y-1.5 text-xs">
              {selectedFunction.line && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Line Number:</span>
                  <span className="font-mono text-slate-200">{selectedFunction.line}</span>
                </div>
              )}
              
              {selectedFunction.params && selectedFunction.params.length > 0 && (
                <div>
                  <span className="text-slate-400 block mb-1">Parameters ({selectedFunction.params.length}):</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedFunction.params.map((param, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[11px] border border-slate-700">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedFunction.label && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Complexity Label:</span>
                  <span className="text-slate-200">{selectedFunction.label}</span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-2.5">
              <h5 className="font-semibold text-slate-200 mb-1.5 flex items-center text-xs">
                <span className="mr-1">💡</span>
                Recommendations
              </h5>
              <ul className="text-xs text-slate-300 space-y-1">
                {selectedFunction.complexity <= 5 ? (
                  <>
                    <li className="flex items-start">
                      <span className="mr-1.5 text-emerald-400">✓</span>
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
                      <span className="mr-1.5 text-amber-400">⚠️</span>
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
                      <span className="mr-1.5 text-rose-400">🔴</span>
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

            <button
              onClick={() => setSelectedFunction(null)}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              ← Back to 3D Map
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5">
          <h4 className="font-semibold text-slate-300 mb-1 text-xs uppercase tracking-wider">Code Quality</h4>
          <div className="space-y-0.5 text-xs text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Avg:</span>
              <span className="text-slate-200">{averageComplexity.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="text-slate-200">{functions.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Low:</span>
              <span className="text-emerald-400">{functions.filter(f => f.complexity <= 5).length}</span>
            </div>
            <div className="flex justify-between">
              <span>High:</span>
              <span className="text-rose-400">{functions.filter(f => f.complexity > 15).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5">
          <h4 className="font-semibold text-slate-300 mb-1 text-xs uppercase tracking-wider">Tips</h4>
          <div className="space-y-0.5 text-xs text-slate-300">
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
