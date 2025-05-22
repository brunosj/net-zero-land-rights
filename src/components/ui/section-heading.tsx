'use client'

import React from 'react'
import { cn } from '@/utilities/cn'

interface SectionHeadingProps {
  title: string
  className?: string
  color?: 'default' | 'light' | 'dark' | 'petrol'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  alignment?: 'left' | 'center' | 'right'
  variant?: 'simple' | 'accent' | 'geometric'
}

export const SectionHeading = ({
  title,
  className,
  color = 'default',
  size = 'md',
  alignment = 'center',
  variant = 'simple',
}: SectionHeadingProps) => {
  // Color mapping
  const colorClasses = {
    default: 'text-[var(--dark-blue)]',
    light: 'text-white',
    dark: 'text-[var(--dark-blue)]',
    petrol: 'text-[var(--petrol)]',
  }

  // Size mapping - reduced text sizes
  const sizeClasses = {
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
  }

  // Alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // SVG design elements based on variant
  const renderDesignElement = () => {
    const accentColor =
      color === 'light' ? '#FFFFFF' : color === 'petrol' ? 'var(--petrol)' : 'var(--dark-blue)'

    switch (variant) {
      case 'accent':
        return (
          <div className="relative h-10 mt-4 mb-8 overflow-hidden">
            <svg
              className={`absolute ${alignment === 'center' ? 'left-1/2 -translate-x-1/2' : alignment === 'right' ? 'right-0' : 'left-0'}`}
              width="80"
              height="6"
              viewBox="0 0 80 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 5C0 2.23858 2.23858 0 5 0H75C77.7614 0 80 2.23858 80 5C80 7.76142 77.7614 10 75 10H5C2.23858 10 0 7.76142 0 5Z"
                fill={accentColor}
                fillOpacity="1"
              />
            </svg>
            <svg
              className={`absolute ${alignment === 'center' ? 'left-1/2 -translate-x-[40%]' : alignment === 'right' ? 'right-8' : 'left-8'}`}
              width="40"
              height="4"
              viewBox="0 0 40 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* <rect width="40" height="4" rx="2" fill={accentColor} /> */}
            </svg>
          </div>
        )
      case 'geometric':
        return (
          <div className="relative h-12 mt-4 mb-8 overflow-visible">
            <svg
              className={`absolute ${alignment === 'center' ? 'left-1/2 -translate-x-1/2' : alignment === 'right' ? 'right-0' : 'left-0'}`}
              width="100"
              height="12"
              viewBox="0 0 100 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0H20L30 12H10L0 0Z" fill={accentColor} fillOpacity="0.7" />
              <path d="M30 0H50L60 12H40L30 0Z" fill={accentColor} fillOpacity="0.5" />
              <path d="M60 0H80L90 12H70L60 0Z" fill={accentColor} fillOpacity="0.3" />
            </svg>
          </div>
        )
      default: // simple - no design element
        return <div className="h-6"></div>
    }
  }

  return (
    <div className={cn('relative w-full mb-8', className)}>
      {/* Main heading */}
      <h2
        className={cn(
          'font-medium mb-2',
          colorClasses[color],
          sizeClasses[size],
          alignClasses[alignment],
        )}
      >
        {title}
      </h2>

      {/* Design element */}
      {renderDesignElement()}
    </div>
  )
}
