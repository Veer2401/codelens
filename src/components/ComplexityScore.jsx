import React from 'react'

const ComplexityScore = ({ score, label, colorClass }) => {
  const getScoreSize = (score) => {
    if (score <= 5) return 'text-6xl'
    if (score <= 10) return 'text-5xl'
    if (score <= 15) return 'text-4xl'
    return 'text-3xl'
  }

  const getScoreBg = (score) => {
    if (score <= 5) return 'bg-complexity-low/10'
    if (score <= 10) return 'bg-complexity-medium/10'
    if (score <= 15) return 'bg-complexity-high/10'
    return 'bg-complexity-extreme/10'
  }

  return (
    <div className={`${getScoreBg(score)} rounded-xl p-6 text-center`}>
      <div className={`${getScoreSize(score)} font-bold ${colorClass} mb-2`}>
        {score}
      </div>
      <div className="text-lg font-semibold text-gray-700 mb-1">
        {label}
      </div>
      <div className="text-sm text-gray-500">
        Overall Complexity Score
      </div>
      
      {/* Progress bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${
            score <= 5 ? 'bg-complexity-low' :
            score <= 10 ? 'bg-complexity-medium' :
            score <= 15 ? 'bg-complexity-high' : 'bg-complexity-extreme'
          }`}
          style={{ width: `${Math.min((score / 20) * 100, 100)}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {score <= 5 && 'Excellent - Keep it up!'}
        {score > 5 && score <= 10 && 'Good - Consider some improvements'}
        {score > 10 && score <= 15 && 'Fair - Needs refactoring'}
        {score > 15 && 'Poor - Major refactoring required'}
      </div>
    </div>
  )
}

export default ComplexityScore
