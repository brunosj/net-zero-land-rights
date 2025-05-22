import React from 'react'
import { getTextColor } from '@/utilities/getTextColor'
import { cn } from '@/utilities/cn'

export type PageHeroProps = {
  title: string
  mainColor: string
  className?: string
  defaultTitle?: string
  textAlign?: 'left' | 'center' | 'right'
}

export function PageHero({
  title,
  mainColor,
  className,
  defaultTitle,
  textAlign = 'center',
}: PageHeroProps) {
  const displayTitle = title || defaultTitle || ''
  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[textAlign]

  return (
    <section
      className={cn(`bg-${mainColor} h-[40svh] flex items-center ${textAlignClass}`, className)}
    >
      <div className="container space-y-12">
        <h1 className="text-4xl md:text-7xl font-bold" style={{ color: getTextColor(mainColor) }}>
          {displayTitle}
        </h1>
      </div>
    </section>
  )
}
