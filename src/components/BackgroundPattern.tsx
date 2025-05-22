import React from 'react'

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.075]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern id="geometricPattern" width="60" height="60" patternUnits="userSpaceOnUse">
            {/* Diagonal lines */}
            <line x1="0" y1="0" x2="60" y2="60" stroke="currentColor" strokeWidth="0.3" />
            <line x1="60" y1="0" x2="0" y2="60" stroke="currentColor" strokeWidth="0.3" />

            {/* Vertical and horizontal lines */}
            <line x1="30" y1="0" x2="30" y2="60" stroke="currentColor" strokeWidth="0.2" />
            <line x1="0" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="0.2" />

            {/* Small circles at intersections */}
            <circle cx="30" cy="30" r="1" fill="currentColor" />
            <circle cx="0" cy="0" r="0.5" fill="currentColor" />
            <circle cx="60" cy="0" r="0.5" fill="currentColor" />
            <circle cx="0" cy="60" r="0.5" fill="currentColor" />
            <circle cx="60" cy="60" r="0.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometricPattern)" />
      </svg>
    </div>
  )
}
