'use client'
import React from 'react'
import Link from 'next/link'
import type { Chapter } from '@/payload-types'
import { extractTextFromBlocks } from '../../utilities/extractTextFromBlocks'
import { cn } from '@/utilities/cn'
import { getTextColor, getTextColorForWhiteBackground } from '../../utilities/getTextColor'

interface ChapterPreviewCardProps {
  chapter: Chapter
  className?: string
  index: number
}

export const ChapterPreviewCard: React.FC<ChapterPreviewCardProps> = ({
  chapter,
  className,
  index,
}) => {
  const { title, slug, content, chapterNumber, mainColor } = chapter

  const previewText = extractTextFromBlocks(content, 120)
  const isEven = index % 2 === 0

  return (
    <Link href={`/chapters/${slug}`} className={cn('block group relative', className)}>
      <div
        className={cn(
          'relative transition-all duration-300 ease-in-out group-hover:-translate-y-1 rounded-lg overflow-hidden shadow-md',
          `border-${mainColor}`,
          isEven ? `border-l-4 ` : `border-r-4 `,
        )}
      >
        <div className="bg-white p-5 relative">
          <div className={cn('absolute top-0 left-0 h-2 w-full', `bg-${mainColor}`)}></div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                'inline-flex px-2 py-1 rounded-sm text-sm items-center justify-center h-fit font-mono  font-medium',
                `bg-${mainColor}`,
                `text-${getTextColor(mainColor)}`,
              )}
            >
              {chapterNumber.toString().padStart(2, '0')}
            </span>
            <h3 className="font-mono text-lg md:text-xl font-bold group-hover:text-opacity-80 transition-opacity duration-200 leading-tight">
              {title}
            </h3>
          </div>

          {previewText && <p className="text-sm text-gray-700 line-clamp-3">{previewText}</p>}

          <div
            className={cn(
              'mt-4 text-sm font-medium flex items-center transition-all duration-300 group-hover:translate-x-1',
              `text-${getTextColorForWhiteBackground(mainColor || 'blue')}`,
            )}
          >
            Read Chapter
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
