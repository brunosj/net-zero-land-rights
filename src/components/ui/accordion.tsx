'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utilities/cn'

// Simple accordion component
const SimpleAccordion: React.FC<{
  title: React.ReactNode
  children: React.ReactNode
  className?: string
  titleClassName?: string
  contentClassName?: string
  defaultOpen?: boolean
}> = ({ title, children, className, titleClassName, contentClassName, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border-b', className)}>
      <button
        className={cn(
          'flex w-full items-center justify-between py-4 font-medium transition-all hover:underline',
          titleClassName,
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && <div className={cn('pb-4 pt-0', contentClassName)}>{children}</div>}
    </div>
  )
}

export { SimpleAccordion }
