import Link from 'next/link'
import React from 'react'
import { getTextColor } from '@/utilities/getTextColor'
import { Button, type ButtonProps } from '@/components/ui/button'
import type { ExtendedColorKey } from '@/config/colors'
type Props = {
  currentChapter: number
  totalChapters: number
  color?: ExtendedColorKey
  previousSlug?: string
  nextSlug?: string
}

export const ChapterNavigation: React.FC<Props> = ({ color, previousSlug, nextSlug }) => {
  return (
    <div className="flex justify-between items-center md:max-w-2xl mx-auto pt-6 pb-12 px-4">
      <div className="flex-1 flex justify-start">
        {previousSlug ? (
          <Link href={`/chapters/${previousSlug}`} className="cursor-pointer">
            <Button variant="rounded" color={color} arrowPosition="left">
              <span className="hidden lg:block">Previous Chapter</span>
              <span className="block lg:hidden">Previous</span>
            </Button>
          </Link>
        ) : (
          <Link href="/" className="cursor-pointer">
            <Button variant="rounded" color={color} arrowPosition="left">
              <span className="hidden lg:block">Home</span>
              <span className="block lg:hidden">Home</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="flex-1 flex justify-end">
        {nextSlug ? (
          <Link href={`/chapters/${nextSlug}`} className="cursor-pointer">
            <Button variant="rounded" color={color}>
              <>
                <span className="hidden lg:block">Next Chapter</span>
                <span className="block lg:hidden">Next</span>
              </>
            </Button>
          </Link>
        ) : (
          <Link href="/resources" className="cursor-pointer">
            <Button variant="rounded" color={color}>
              <>
                <span className="hidden lg:block">Resources</span>
                <span className="block lg:hidden">Resources</span>
              </>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
