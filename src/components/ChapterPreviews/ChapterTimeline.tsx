import React from 'react'
import type { Chapter } from '@/payload-types'
import { ChapterPreviewCard } from './ChapterPreviewCard'
import { cn } from '@/utilities/cn'
import { SectionHeading } from '@/components/ui/section-heading'
import LandDemandIllustration from '@/components/Illustrations/LandDemand'
import { BannerIllustration } from '@/components/BannerIllustration'
import { motion } from 'motion/react'
import TreesIllustration from '@/components/Trees'

interface ChapterTimelineProps {
  chapters: Chapter[]
}

export const ChapterTimeline: React.FC<ChapterTimelineProps> = ({ chapters }) => {
  if (!chapters || chapters.length === 0) {
    return null
  }

  const renderChapterItem = (chapter: Chapter, index: number) => {
    const isOdd = index % 2 !== 0
    // Reduce delay to improve performance
    const delay = Math.min(index * 0.05, 0.2)

    return (
      <motion.div
        key={chapter.id}
        className={cn(
          'mb-12 flex w-full',
          // Mobile: full width card display stack
          'flex-col items-center',
          // Desktop: timeline with alternating sides
          'md:items-center md:justify-between',
          isOdd ? 'md:flex-row-reverse' : 'md:flex-row',
        )}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1, margin: '-50px 0px -50px 0px' }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Empty space in desktop timeline */}
        <div className="hidden md:block order-1 w-5/12"></div>

        {/* Timeline dot - visible on all screen sizes */}
        <div
          className={cn(
            'z-10 flex items-center justify-center order-1 shadow-md w-8 h-8 rounded-full',
            // Mobile: position at the top of each card
            'mb-4',
            // Desktop: position in the middle
            'md:mb-0',
          )}
          style={{
            backgroundColor: `var(--${chapter.mainColor})`,
            boxShadow: '0 0 0 4px white, 0 0 0 5px rgba(0,0,0,0.1)',
          }}
        />

        {/* Card container */}
        <div
          className={cn(
            'order-1 px-1',
            // Mobile: full width
            'w-full',
            // Desktop: half width on alternating sides
            'md:w-5/12 md:px-4',
          )}
        >
          <ChapterPreviewCard chapter={chapter} index={index} />
        </div>
      </motion.div>
    )
  }

  return (
    <section className="relative py-16 sm:py-20" id="chapters">
      <div className="absolute -top-6 lg:top-16 left-0 w-full h-[60lvh]">
        <TreesIllustration className="opacity-10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading title="Explore the Chapters" size="lg" color="default" variant="simple" />
        </motion.div>

        <div className="relative wrap overflow-hidden pt-3">
          {/* First section of chapters (0-4) with its own timeline line */}
          <div className="relative">
            {/* Timeline line with top-to-bottom animation - only visible on desktop */}
            <motion.div
              className="absolute border-opacity-50 border-gray-300 border hidden md:block"
              style={{
                left: '50%',
                height: '100%',
                transformOrigin: 'top',
              }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            />

            {/* Mobile timeline line - centered vertical line */}
            <motion.div
              className="absolute border-opacity-50 border-gray-300 border md:hidden"
              style={{
                left: '50%',
                height: '100%',
                transformOrigin: 'top',
                width: '0px',
              }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            />

            {chapters.slice(0, 5).map((chapter, index) => renderChapterItem(chapter, index))}
          </div>

          <BannerIllustration
            image={LandDemandIllustration}
            backgroundColor="transparent"
            align="center"
            className="mb-12 z-40"
            imageWidth="2/3"
          />

          {/* Second section of chapters (5+) with its own timeline line */}
          <div className="relative">
            {/* Desktop timeline line */}
            <motion.div
              className="absolute border-opacity-50 border-gray-300 border hidden md:block"
              style={{
                left: '50%',
                height: '100%',
                transformOrigin: 'top',
              }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            />

            {/* Mobile timeline line */}
            <motion.div
              className="absolute border-opacity-50 border-gray-300 border md:hidden"
              style={{
                left: '50%',
                height: '100%',
                transformOrigin: 'top',
                width: '0px',
              }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.1,
              }}
            />

            <div className="mt-12 md:mt-0">
              {chapters.slice(5).map((chapter, index) => renderChapterItem(chapter, index + 5))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
