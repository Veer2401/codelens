import React from 'react'

const ComplexityScore = ({ score, label, colorClass }) => {
  // Format the score to 2 decimal places
  const formattedScore = typeof score === 'number' ? score.toFixed(2) : score
  
  const getBarColor = (score) => {
    if (score <= 10) return 'bg-emerald-500'
    if (score <= 15) return 'bg-amber-500'
    return 'bg-rose-500'
  }
  
  return (
    <div className="text-center bg-slate-800/90 rounded-xl p-4 border border-slate-700/80 shadow-sm">
      <div className="text-3xl font-bold mb-1 text-slate-100 font-mono tracking-tight">
        {formattedScore}
      </div>
      <div className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">{label}</div>
      
      {/* Progress bar */}
      <div className="w-full bg-slate-700/80 rounded-full h-2 mb-3 overflow-hidden">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor(score)}`}
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
        {score > 20 && score <= 35 && "⚠️ Fair - Needs refactoring"}
        {score > 35 && "🚨 Poor - Major refactoring required"}
      </div>
    </div>
  )
}

export default ComplexityScore
