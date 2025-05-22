'use client'

import type { StaticImageData } from 'next/image'
import { cn } from 'src/utilities/cn'
import React, { useEffect, useMemo, useRef } from 'react'
import { Share } from '@/components/Share'
import { useFigures } from '@/contexts/FiguresContext'
import { v4 as uuidv4 } from 'uuid'
import { getColumnWidthClass, getColumnAlignmentClass } from '@/utilities/getColumnWidthClass'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { Media } from '../../components/Media'
import { isSvgFile, prepareFigureFromMedia } from '@/utilities/figureUtils'
import { getTextColorForWhiteBackground } from '@/utilities/getTextColor'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  backgroundColor?: string
  color?: string
  size?: string
  alignment?: string
  source?: string
  title?: string
  figureNumber?: number
  figureId?: string
  chapterId?: string
  chapterTitle?: string
  chapterNumber?: number
}

export const FigureBlock: React.FC<Props> = (props) => {
  const {
    media,
    staticImage,
    color,
    size,
    alignment,
    source,
    title,
    figureNumber,
    figureId,
    chapterId,
    chapterTitle,
    chapterNumber,
  } = props
  const { addFigure, removeFigure, openLightbox } = useFigures()

  // Store the actual instance ID used when registering with context
  const instanceIdRef = useRef<string>('')

  let caption: string | undefined
  if (media && typeof media === 'object') caption = media.caption || undefined

  // Add chapter information to caption if available
  const enhancedCaption = useMemo(() => {
    let result = caption || ''

    if (chapterTitle) {
      if (result) result += ' | '
      result += `From Chapter ${chapterNumber || ''} | ${chapterTitle}`
    }

    return result || undefined
  }, [caption, chapterTitle, chapterNumber])

  // Generate a display ID for this figure - this is not used for registration
  const figureDisplayId = useMemo(() => {
    // Create a more specific ID that includes chapter info if available
    if (chapterId && figureNumber) {
      return `figure-ch${chapterNumber || ''}-${figureNumber}`
    }
    return `figure-${figureNumber || Math.random().toString(36).substring(2, 9)}`
  }, [figureNumber, chapterId, chapterNumber])

  // Register this figure with the context when the component mounts
  useEffect(() => {
    // Use the provided figureId if available, otherwise generate one
    const instanceId =
      figureId || (chapterId && figureNumber ? `${chapterId}-figure-${figureNumber}` : uuidv4())

    instanceIdRef.current = instanceId

    // Use shared utility to prepare figure data
    let figureData

    if (staticImage) {
      figureData = {
        id: instanceId,
        src: staticImage.src,
        alt: title || caption || '',
        type: 'image',
        figureNumber,
        title,
        caption: enhancedCaption,
        chapterNumber,
        chapterTitle,
        source,
      }
    } else {
      figureData = prepareFigureFromMedia(media, title, enhancedCaption, figureNumber, source)
      if (figureData) {
        figureData.id = instanceId
        figureData.chapterNumber = chapterNumber
        figureData.chapterTitle = chapterTitle
      }
    }

    // Add the figure to the global state if we have data
    if (figureData) {
      addFigure(figureData)
    }

    // Cleanup when the component unmounts
    return () => {
      removeFigure(instanceId)
    }
  }, [
    addFigure,
    removeFigure,
    media,
    staticImage,
    title,
    enhancedCaption,
    figureNumber,
    chapterId,
    chapterNumber,
    chapterTitle,
    figureId,
    source,
    caption,
  ])

  // Handle click on the figure
  const handleOpenLightbox = () => {
    // Use the instance ID stored in the ref, which matches what was registered
    const instanceId = instanceIdRef.current
    openLightbox(instanceId)
  }

  // Check if the media is an SVG to set appropriate styles
  const isSvgMedia =
    media && typeof media === 'string'
      ? isSvgFile(media)
      : media && typeof media === 'object' && media.url
        ? isSvgFile(media.url)
        : false

  const columnWidthClass = getColumnWidthClass(size)
  const columnAlignmentClass = getColumnAlignmentClass(alignment)

  return (
    <div className="my-8 lg:my-12">
      <div className=" gap-y-8 md:gap-x-8 space-y-8">
        <div className={cn(columnWidthClass, columnAlignmentClass, 'box-border mx-auto')}>
          {/* Line and Share buttons in same row */}
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'h-[1.5px] lg:h-[2px] grow',
                `bg-${getTextColorForWhiteBackground(color || '')}`,
              )}
            />
            <Share
              url={typeof window !== 'undefined' ? window.location.href : ''}
              title={title || ''}
              color={getTextColorForWhiteBackground(color || '')}
            />
          </div>
          {/* Figure number below the line */}
          <h3
            className={cn(
              'uppercase font-medium tracking-widest text-base lg:text-xl',
              `text-${getTextColorForWhiteBackground(color || '')}`,
            )}
          >
            Figure {figureNumber}
          </h3>

          <div className="">
            {/* Figure title above image */}
            <div className="my-4 lg:my-6">
              {title && <h3 className={cn('text-xl font-semibold')}>{title}</h3>}
              {caption && <p className={cn('text-base')}>{caption}</p>}
            </div>

            {/* Image with onClick to open lightbox */}
            <div
              className="cursor-pointer relative w-full"
              onClick={handleOpenLightbox}
              title="Click to enlarge"
            >
              <div className="relative w-full" style={{ maxHeight: '70svh' }}>
                <Media
                  resource={media}
                  src={staticImage}
                  fill={!isSvgMedia}
                  imgClassName={cn('w-full object-contain', isSvgMedia ? 'max-h-[70svh]' : '')}
                />
              </div>
            </div>

            {/* Source citation */}
            {source && <div className="mt-4 text-xs text-gray-600 ">Source: {source}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
