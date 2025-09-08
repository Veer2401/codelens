import React from 'react'

const ComplexityScore = ({ score, label, colorClass }) => {
  // Format the score to 2 decimal places
  const formattedScore = typeof score === 'number' ? score.toFixed(2) : score
  
  return (
    <div className="text-center">
      <div className={`text-4xl font-bold mb-2 ${colorClass}`}>
        {formattedScore}
      </div>
      <div className="text-lg text-gray-600 mb-4">{label}</div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${colorClass.replace('text-', 'bg-')}`}
          style={{ 
            width: `${Math.min((score / 20) * 100, 100)}%` 
          }}
        ></div>
      </div>
      
      {/* Complexity explanation */}
      <div className="text-sm text-gray-500">
        {score <= 5 && "Excellent - Keep it up!"}
        {score > 5 && score <= 10 && "Good - Consider some improvements"}
        {score > 10 && score <= 15 && "Fair - Needs refactoring"}
        {score > 15 && score <= 20 && "Fair - Needs refactoring"}
        {score > 20 && score <=35 && "Fair - Needs refactoring"}
        {score > 35 && "Poor - Major refactoring required"}

      </div>
    </div>
  )
}

export default ComplexityScore
