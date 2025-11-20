import React, { useEffect, useState, useRef } from 'react'

const ComplexityChart = ({ functions }) => {
  const [history, setHistory] = useState([])
  const canvasRef = useRef(null)
  const maxHistoryPoints = 20

  // Update history when functions change
  useEffect(() => {
    console.log('ComplexityChart - functions updated:', functions?.length, 'functions')
    if (functions && functions.length > 0) {
      const avgComplexity = functions.reduce((sum, f) => sum + f.complexity, 0) / functions.length
      const functionCount = functions.length
      
      console.log('Creating data point:', { functionCount, avgComplexity: avgComplexity.toFixed(2) })
      
      const dataPoint = {
        timestamp: Date.now(),
        functionCount: functionCount,
        avgComplexity: avgComplexity
      }
      
      console.log('Adding data point to history:', dataPoint)
      
      setHistory(prev => {
        const newHistory = [...prev, dataPoint]
        // Keep only last N points
        if (newHistory.length > maxHistoryPoints) {
          return newHistory.slice(-maxHistoryPoints)
        }
        console.log('New history length:', newHistory.length)
        return newHistory
      })
    }
  }, [functions?.length])

  // Draw chart
  useEffect(() => {
    console.log('Drawing chart with history length:', history.length)
    const canvas = canvasRef.current
    if (!canvas) {
      console.log('Canvas ref not found!')
      return
    }

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    console.log('Canvas dimensions:', width, 'x', height)
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    
    // Fixed scale: 0 to 30
    const maxScale = 30
    
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const bottomY = padding + chartHeight
    
    // Draw grid lines and labels
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.fillStyle = '#64748b'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'right'
    
    // Draw horizontal grid lines every 5 units (0, 5, 10, 15, 20, 25, 30)
    for (let i = 0; i <= 6; i++) {
      const value = i * 5
      const y = padding + chartHeight - (value / maxScale) * chartHeight
      
      // Grid line
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      
      // Label
      ctx.fillText(value.toString(), padding - 5, y + 3)
    }
    
    // If no history, show empty state
    if (history.length === 0) {
      console.log('No history data - showing waiting message')
      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Waiting for data...', width / 2, height / 2)
      return
    }
    
    console.log('Drawing lines for', history.length, 'points')
    console.log('History data:', history)
    
    // Calculate positions for all points
    const pointSpacing = history.length > 1 ? chartWidth / (history.length - 1) : 0
    
    // Draw COMPLEXITY area chart (red)
    // Create gradient for area fill
    const redGradient = ctx.createLinearGradient(0, padding, 0, bottomY)
    redGradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)')
    redGradient.addColorStop(1, 'rgba(239, 68, 68, 0.05)')
    
    // Fill area
    ctx.fillStyle = redGradient
    ctx.beginPath()
    ctx.moveTo(padding, bottomY)
    
    history.forEach((point, index) => {
      const x = padding + pointSpacing * index
      const y = padding + chartHeight - (Math.min(point.avgComplexity, maxScale) / maxScale) * chartHeight
      console.log(`Complexity point ${index}: x=${x}, y=${y}, value=${point.avgComplexity}`)
      ctx.lineTo(x, y)
    })
    
    const lastX = padding + pointSpacing * (history.length - 1)
    ctx.lineTo(lastX, bottomY)
    ctx.closePath()
    ctx.fill()
    
    // Draw complexity line
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    history.forEach((point, index) => {
      const x = padding + pointSpacing * index
      const y = padding + chartHeight - (Math.min(point.avgComplexity, maxScale) / maxScale) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // Draw FUNCTION COUNT area chart (blue)
    // Create gradient for area fill
    const blueGradient = ctx.createLinearGradient(0, padding, 0, bottomY)
    blueGradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)')
    blueGradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
    
    // Fill area
    ctx.fillStyle = blueGradient
    ctx.beginPath()
    ctx.moveTo(padding, bottomY)
    
    history.forEach((point, index) => {
      const x = padding + pointSpacing * index
      const y = padding + chartHeight - (Math.min(point.functionCount, maxScale) / maxScale) * chartHeight
      console.log(`Function point ${index}: x=${x}, y=${y}, value=${point.functionCount}`)
      ctx.lineTo(x, y)
    })
    
    ctx.lineTo(lastX, bottomY)
    ctx.closePath()
    ctx.fill()
    
    // Draw function count line
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    
    history.forEach((point, index) => {
      const x = padding + pointSpacing * index
      const y = padding + chartHeight - (Math.min(point.functionCount, maxScale) / maxScale) * chartHeight
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    console.log('Chart drawing complete!')
    
  }, [history])

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
    '1-10': functions.filter(f => f.complexity <= 10).length,
    '11-20': functions.filter(f => f.complexity > 10 && f.complexity <= 20).length,
    '21-35': functions.filter(f => f.complexity > 20 && f.complexity <= 35).length,
    '36+': functions.filter(f => f.complexity > 35).length
  }

  const maxCount = Math.max(...Object.values(complexityRanges))
  const colors = {
    '1-10': 'bg-gradient-to-r from-green-500 to-emerald-500',
    '11-20': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    '21-35': 'bg-gradient-to-r from-yellow-500 to-orange-500',
    '36+': 'bg-gradient-to-r from-red-500 to-pink-500'
  }

  // Bubble chart data
  const bubbleData = functions.slice(0, 20).map((func, index) => {
    let color = ''
    if (func.complexity <= 10) {
      color = 'bg-green-500' // Low - Green
    } else if (func.complexity <= 20) {
      color = 'bg-blue-500' // Medium - Blue
    } else if (func.complexity <= 35) {
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
            <div className={`text-2xl font-bold ${averageComplexity <= 10 ? 'text-green-400' : averageComplexity <= 20 ? 'text-blue-400' : averageComplexity <= 35 ? 'text-orange-400' : 'text-red-400'}`}>
              {averageComplexity.toFixed(1)}
            </div>
            <div className="text-xs text-slate-300">
              {averageComplexity <= 10 ? 'Low Risk' : averageComplexity <= 20 ? 'Medium Risk' : averageComplexity <= 35 ? 'High Risk' : 'Extreme Risk'}
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
              <div className="flex-1 bg-slate-700/50 rounded-full h-3 relative shadow-inner">
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
        <div className="bg-slate-800/50 rounded-xl p-3 h-36 relative border border-slate-700/50 backdrop-blur-sm">
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
              <span className="font-medium">{functions.filter(f => f.complexity <= 10).length}</span>
            </div>
            <div className="flex justify-between">
              <span>High:</span>
              <span className="font-medium">{functions.filter(f => f.complexity > 35).length}</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-xl p-2.5 backdrop-blur-sm">
          <h4 className="font-semibold text-amber-200 mb-1.5 text-xs">Tips</h4>
          <div className="space-y-0.5 text-xs text-amber-100">
            {averageComplexity <= 10 && (
              <div>✅ Excellent code quality!</div>
            )}
            {averageComplexity > 10 && averageComplexity <= 20 && (
              <div>👍 Good complexity. Monitor for future changes.</div>
            )}
            {averageComplexity > 20 && averageComplexity <= 35 && (
              <div>⚠️ High complexity detected. Consider refactoring.</div>
            )}
            {averageComplexity > 35 && (
              <div>🚨 Extreme complexity. Urgent refactoring needed.</div>
            )}
            {functions.filter(f => f.complexity > 35).length > 0 && (
              <div>🔴 {functions.filter(f => f.complexity > 35).length} extreme complexity function(s).</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplexityChart
