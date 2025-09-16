import React from 'react'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export const BackgroundGradient = ({ className = '', children }) => {
  return (
    <div className={cn('relative rounded-2xl', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.25), rgba(99,102,241,0.25), rgba(236,72,153,0.25), rgba(56,189,248,0.25))',
          maskImage:
            'radial-gradient(closest-side, rgba(0,0,0,0.7), transparent)',
          WebkitMaskImage:
            'radial-gradient(closest-side, rgba(0,0,0,0.7), transparent)'
        }}
      />
      <div className="relative rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur p-0">
        {children}
      </div>
    </div>
  )
}

export default BackgroundGradient


