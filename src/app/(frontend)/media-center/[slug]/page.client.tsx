'use client'
import React from 'react'
import { motion } from 'motion/react'
import type { MediaItem } from '@/payload-types'
import { PageHeroWithIllustration } from '@/components/PageHeroWithIllustration'
import RichText from '@/components/RichText'
import { formatDate } from '@/utilities/formatDate'
import { RichTextWithBlocks } from '@/components/RichText'
import { getTextColor } from '@/utilities/getTextColor'
import { cn } from '@/utilities/cn'
import { Share } from '@/components/Share'
import { ClockIcon } from '@/components/icons/ClockIcon'
import { calculateReadingTime } from '@/utilities/readingTime'

interface PageClientProps {
  mediaItem: MediaItem
}

const PageClient: React.FC<PageClientProps> = ({ mediaItem }) => {
  const { title, releaseDate, type, content } = mediaItem
  const accentColor = 'light-blue'
  const textColor = getTextColor(accentColor)

  // Calculate reading time using the utility
  const readingTime = React.useMemo(() => {
    return calculateReadingTime({ content } as any)
  }, [content])

  return (
    <article>
      <section className={cn(`bg-${accentColor} flex relative overflow-hidden`)}>
        <div className="container py-12 md:py-24 my-auto relative z-10">
          <div className="w-full">
            <div className={`border-b-2 border-${textColor} pb-6 md:pb-8 lg:pb-24`}>
              <h1 className={`text-2xl md:text-5xl font-semibold text-${textColor}`}>{title}</h1>
            </div>

            {/* Meta info row */}
            <div
              className={`mt-4 md:mt-6 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 md:gap-0`}
            >
              {/* Left side: Date and type */}
              <div className="flex items-center gap-4 text-base">
                <span className={`text-sm md:text-base  text-${textColor}`}>
                  {formatDate(releaseDate)}
                </span>
                <span
                  className={`px-3 py-1 text-sm bg-${textColor}/10 text-${textColor} rounded-full`}
                >
                  {type}
                </span>
              </div>

              {/* Right side: Reading time and share */}
              <div className="flex md:mt-0 md:flex-shrink-0 md:whitespace-nowrap">
                {/* Reading time */}
                {readingTime > 0 && (
                  <div className="flex items-center">
                    <ClockIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    <span className="whitespace-nowrap text-sm md:text-base">
                      {readingTime} min read
                    </span>
                    <span className="mx-2">•</span>
                  </div>
                )}

                <Share
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={title}
                  color={textColor}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-beige/60 relative z-10 overflow-hidden  py-12">
        <div className="container">
          <motion.div
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <RichTextWithBlocks data={content} />
          </motion.div>
        </div>
      </section>
    </article>
  )
}

export default PageClient
