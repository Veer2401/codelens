import React from 'react'

const ComplexityScore = ({ score, label, colorClass }) => {
  // Format the score to 2 decimal places
  const formattedScore = typeof score === 'number' ? score.toFixed(2) : score
  
  const getBarColor = (score) => {
    if (score <= 10) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (score <= 15) return 'bg-gradient-to-r from-yellow-500 to-orange-500'
    return 'bg-gradient-to-r from-red-500 to-pink-500'
  }
  
  return (
    <div className="text-center bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 shadow-lg">
      <div className="text-4xl font-bold mb-1.5 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {formattedScore}
      </div>
      <div className="text-sm text-slate-300 mb-3 font-medium">{label}</div>
      
      {/* Progress bar */}
      <div className="w-full bg-slate-700/50 rounded-full h-2 mb-3 overflow-hidden shadow-inner">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getBarColor(score)} shadow-lg`}
          style={{ 
            width: `${Math.min((score / 20) * 100, 100)}%` 
          }}
        ></div>
      </div>
      
      {/* Complexity explanation */}
      <div className="text-xs text-slate-400">
        {score <= 5 && "🎉 Excellent - Keep it up!"}
        {score > 5 && score <= 10 && "👍 Good - Consider some improvements"}
        {score > 10 && score <= 15 && "⚠️ Fair - Needs refactoring"}
        {score > 15 && score <= 20 && "⚠️ Fair - Needs refactoring"}
        {score > 20 && score <=35 && "⚠️ Fair - Needs refactoring"}
        {score > 35 && "🚨 Poor - Major refactoring required"}
      </div>
    </div>
  )
}

export default ComplexityScore
