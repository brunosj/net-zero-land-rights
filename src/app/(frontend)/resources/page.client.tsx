'use client'

import React, { useEffect, useState } from 'react'
import { FiguresProvider, FigureSlide, useFigures } from '@/contexts/FiguresContext'
import { SharedLightbox } from '@/components/SharedLightbox'
import { createVideoFigure, downloadAllFiguresAsZip } from '@/utilities/figureUtils'
import { prepareFigureFromMedia } from '@/utilities/figureUtils'
import { ResourceExplorer } from '@/components/resources'
import { getTextColor } from '@/utilities/getTextColor'
import { Chapter } from '@/payload-types'
import { PageHero } from '@/components/PageHero'
import Image from 'next/image'
import Resources from '@/assets/resources.svg'
import { cn } from '@/utilities/cn'
import { PageHeroWithIllustration } from '@/components/PageHeroWithIllustration'

// Define the main color here - can be easily changed for the entire resource explorer
export type ColorType = Chapter['mainColor']
const mainColor: ColorType = 'dark-blue'

interface ResourcesPageClientProps {
  resources: any
  figures: any[]
}

const ResourcesPageInner: React.FC<ResourcesPageClientProps> = ({ resources, figures }) => {
  const { addFigure, openLightbox, getSlides } = useFigures()
  const [figureSlides, setFigureSlides] = useState<FigureSlide[]>([])
  const [videoFigures, setVideoFigures] = useState<{ [key: string]: string }>({})
  const [isDownloading, setIsDownloading] = useState(false)

  // Process video resources and register them with the figures context
  useEffect(() => {
    if (!resources?.additionalResources) return

    // Log all resources to debug
    const videoResources = resources.additionalResources.filter(
      (resource: any) => resource.resourceType === 'video' && resource.link,
    )

    // Helper function to find chapter number from figures data by chapter title
    const findChapterNumberByTitle = (chapterTitle: string): number | undefined => {
      if (figures && figures.length > 0) {
        const matchingFigure = figures.find(
          (fig) =>
            fig.chapterTitle && fig.chapterTitle.toLowerCase() === chapterTitle.toLowerCase(),
        )
        return matchingFigure?.chapterNumber
      }
      return undefined
    }

    const newVideoFigures: { [key: string]: string } = {}

    videoResources.forEach((resource: any, index: number) => {
      // Create a unique ID for this video
      const videoId = `video-${resource.title?.toLowerCase().replace(/\s+/g, '-') || index}`

      // Get chapter information if available
      const chapterData = typeof resource.chapter === 'object' && resource.chapter
      const chapterTitle = chapterData ? resource.chapter.title : undefined

      // Try to get chapter number directly, or look it up from figures data if missing
      let chapterNumber =
        chapterData && 'chapterNumber' in resource.chapter
          ? resource.chapter.chapterNumber
          : undefined

      // If we have a title but no number, try to find it from the figures data
      if (chapterTitle && !chapterNumber) {
        chapterNumber = findChapterNumberByTitle(chapterTitle)
      }

      // Register the video with the figures context
      const videoFigure = createVideoFigure(
        videoId,
        resource.link,
        resource.title,
        resource.description,
        undefined, // figureNumber
        resource.thumbnail?.url, // Custom thumbnail URL
        chapterNumber, // Add chapter number
        chapterTitle, // Add chapter title
      )

      if (videoFigure) {
        addFigure(videoFigure)
        // Keep track of resource-to-figure mapping
        newVideoFigures[resource.link] = videoId
      }
    })

    setVideoFigures(newVideoFigures)
  }, [resources, addFigure, figures])

  // Process figures from chapters to create FigureSlide objects
  useEffect(() => {
    const processedSlides: FigureSlide[] = []

    figures.forEach((figureDataItem) => {
      const { figureBlock, figureNumber, id, chapterTitle, chapterSlug, chapterNumber } =
        figureDataItem
      const { media, title, source } = figureBlock

      // Skip if no media
      if (!media) return

      // Create a consistent ID that will match what FigureBlock component uses
      // This is critical for ensuring the correct figure opens in the lightbox
      const consistentId = `${figureDataItem.chapterId}-figure-${figureNumber}`

      // Prepare the base figure data using our utility
      const figureSlide = prepareFigureFromMedia(
        media,
        title,
        '',
        figureBlock.figureNumber || figureNumber,
        source,
      )

      if (!figureSlide) return

      // Use the consistent ID format
      figureSlide.id = consistentId

      // Add chapter details for easier sorting
      figureSlide.chapterNumber = chapterNumber
      figureSlide.chapterTitle = chapterTitle

      processedSlides.push(figureSlide)
    })

    // Register all slides with the FiguresContext
    setFigureSlides([]) // Clear existing slides

    // Add each slide to the context
    processedSlides.forEach((slide) => {
      addFigure(slide)
    })

    setFigureSlides(processedSlides)
  }, [figures, addFigure])

  // Handler for opening video in lightbox
  const handleOpenVideo = (videoUrl: string) => {
    if (videoFigures[videoUrl]) {
      openLightbox(videoFigures[videoUrl])
    }
  }

  // Handler for downloading all figures as zip
  const handleDownloadAllFigures = async () => {
    try {
      setIsDownloading(true)
      const allSlides = getSlides()
      await downloadAllFiguresAsZip(allSlides)
    } catch (error) {
      console.error('Error downloading figures as zip:', error)
      alert('Failed to download figures. Please try again later.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Group resources by type
  const videoResources =
    resources?.additionalResources?.filter(
      (resource: any) => resource.resourceType === 'video' && resource.link,
    ) || []

  const webPageResources =
    resources?.additionalResources?.filter(
      (resource: any) => resource.resourceType === 'webPage' && resource.link,
    ) || []

  const publicationResources = [
    ...(resources?.additionalResources?.filter(
      (resource: any) =>
        resource.resourceType === 'publication' && (resource.file || resource.publicationUrl),
    ) || []),
  ]

  return (
    <article>
      {/* Hero Section */}
      <PageHeroWithIllustration
        title={resources.title}
        mainColor={mainColor}
        illustration={Resources}
        imageContainerBottomClassName="bottom-2 md:bottom-6"
      />
      {/* Resource Explorer with Tabs */}
      <ResourceExplorer
        text={resources.heroText}
        figures={figureSlides}
        videoResources={videoResources}
        webPageResources={webPageResources}
        publicationResources={publicationResources}
        onOpenVideo={handleOpenVideo}
        onDownloadAllFigures={handleDownloadAllFigures}
        isDownloading={isDownloading}
        mainColor={mainColor}
        publicationDownloadButtonText={resources.publicationDownloadButtonText}
      />
    </article>
  )
}

export default function ResourcesPageClient(props: ResourcesPageClientProps) {
  return (
    <FiguresProvider>
      <ResourcesPageInner {...props} />
      <SharedLightbox />
    </FiguresProvider>
  )
}
