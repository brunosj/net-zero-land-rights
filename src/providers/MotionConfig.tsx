'use client'

import React from 'react'
import { MotionConfig } from 'motion/react'

/**
 * Motion config provider to optimize animations site-wide
 *
 * This provider applies performance optimizations to all framer-motion animations:
 * - Respects user's reduced motion preferences
 * - Uses more performance-efficient animation defaults
 */
export const MotionConfigProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <MotionConfig
      reducedMotion="user" // Respect OS/browser reduced motion preferences
      transition={{
        // Default transition settings for better performance
        type: 'tween', // Use tween instead of spring for better performance
        duration: 0.5, // Shorter default duration
        ease: [0.25, 0.1, 0.25, 1], // Optimized cubic-bezier curve
      }}
    >
      {children}
    </MotionConfig>
  )
}
