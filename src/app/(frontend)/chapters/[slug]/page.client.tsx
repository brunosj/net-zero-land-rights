'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useMemo } from 'react'
import { SharedLightbox } from '@/components/SharedLightbox'
import { ChapterNavigation } from '@/components/ChapterNavigation'
import { FiguresProvider } from '@/contexts/FiguresContext'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import { motion, useSpring, useScroll } from 'motion/react'
import { calculateReadingTime } from '@/utilities/readingTime'
import type { Chapter } from '@/payload-types'
import { ChapterHero } from '@/components/ChapterHero'
import { RichTextWithBlocks } from '@/components/RichText'

type ColorType = Chapter['mainColor']

interface PageClientProps {
  post?: Chapter
  mainColor?: ColorType
  chapterNumber: number
  totalChapters?: number
  previousSlug?: string
  nextSlug?: string
}

const PageClient: React.FC<PageClientProps> = ({
  post,
  mainColor,
  chapterNumber,
  totalChapters,
  previousSlug,
  nextSlug,
}) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  // Calculate reading time
  const readingTime = useMemo(() => calculateReadingTime(post), [post])

  // Use contentRef for scroll tracking with custom offsets
  // Start tracking when content is 20vh from bottom of viewport (still partially out of view)
  // End tracking when the end of content is at bottom of viewport
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['0 0.3', '1 1'],
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <>
      {/* <LivePreviewListener /> */}
      {/* Progress indicator */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          zIndex: 100,
        }}
      >
        {/* Background track */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(1px)',
          }}
        />

        {/* Animated progress */}
        <motion.div
          style={{
            scaleX,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            originX: 0,
            backgroundColor: mainColor ? `var(--${mainColor})` : 'var(--light-green)',
            boxShadow: mainColor ? `0 0 8px var(--${mainColor})` : '0 0 8px var(--light-green)',
          }}
        />
      </div>

      {post && <ChapterHero post={post} readingTime={readingTime} />}

      {/* Content with ref for scroll tracking */}
      <div ref={contentRef} className="relative">
        <FiguresProvider>
          <motion.div
            className="container pt-12"
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {post?.content && (
              <RichTextWithBlocks
                data={post.content}
                color={mainColor}
                enableGutter={false}
                chapterId={post.id}
                chapterTitle={post.title}
                chapterNumber={post.chapterNumber}
              />
            )}
          </motion.div>

          <ChapterNavigation
            currentChapter={chapterNumber}
            totalChapters={totalChapters || 0}
            color={mainColor || 'blue'}
            previousSlug={previousSlug}
            nextSlug={nextSlug}
          />
          <SharedLightbox />
        </FiguresProvider>
      </div>
    </>
  )
}

export default PageClient
