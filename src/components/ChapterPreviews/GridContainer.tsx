import React from 'react'

interface GridContainerProps {
  children: React.ReactNode
  className?: string
}

export const GridContainer: React.FC<GridContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="grid grid-cols-12 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-12">{children}</div>
    </div>
  )
}
