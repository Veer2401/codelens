import React, { useEffect, useState, useRef } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const cursorRef = useRef(null)

  useEffect(() => {
    // Check if device is touch-primary
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches

    if (isTouchDevice) {
      setIsTouch(true)
      return
    }

    // Add class to body to hide default cursor
    document.documentElement.classList.add('custom-cursor-enabled')

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      // Check if hovering over interactive elements
      const target = e.target
      if (target) {
        const interactive = target.closest(
          'a, button, [role="button"], input, select, textarea, [tabindex="0"], label, .cursor-pointer'
        )
        setIsHovering(!!interactive)
      }
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      document.documentElement.classList.remove('custom-cursor-enabled')
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  if (isTouch) return null

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[99999] transition-opacity duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* 
        Center the lens circle (hotspot at cx=10, cy=10) on the actual pointer coordinates.
        Using offset -10px, -10px so the center of the lens aligns precisely with the cursor.
      */}
      <div
        className={`relative -top-2.5 -left-2.5 transition-transform duration-200 ease-out ${
          isHovering ? 'scale-125 rotate-[-12deg]' : 'scale-100 rotate-0'
        }`}
        style={{
          filter:
            'drop-shadow(0 0 1px rgba(255, 255, 255, 0.95)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.25))',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-900"
        >
          {/* Subtle optical inner glass disc */}
          <circle
            cx="10"
            cy="10"
            r="6.5"
            fill={isHovering ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.25)'}
            stroke="#ffffff"
            strokeWidth="0.5"
          />

          {/* Minimal Black Lens Frame */}
          <circle
            cx="10"
            cy="10"
            r="6.75"
            stroke="#090d16"
            strokeWidth="2"
          />

          {/* Precision Handle */}
          <path
            d="M15.2 15.2L21.5 21.5"
            stroke="#090d16"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Subtle glass reflection highlight */}
          <path
            d="M7 8.5C7.2 7 8.5 5.8 10 5.8"
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default CustomCursor
