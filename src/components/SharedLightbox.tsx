'use client'

import React, { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Download from 'yet-another-react-lightbox/plugins/download'
import Image from 'next/image'

import { useFigures, FigureSlide } from '@/contexts/FiguresContext'
import { downloadPngFromUrl, downloadSvgFile, isSvgFile } from '@/utilities/figureUtils'

// SVG Slide Component
const SVGSlide: React.FC<{ slide: FigureSlide }> = ({ slide }) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <object
        data={slide.svgUrl}
        type="image/svg+xml"
        className="max-w-full max-h-full"
        aria-label={slide.alt || 'SVG Image'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          background: 'transparent',
        }}
      >
        <Image
          src={slide.src}
          alt={slide.alt || ''}
          className="max-w-full max-h-full"
          width={800}
          height={600}
          style={{ objectFit: 'contain' }}
        />
      </object>
    </div>
  )
}

// YouTube Video Slide Component
const VideoSlide: React.FC<{ slide: FigureSlide }> = ({ slide }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Extract YouTube ID from URL
  const getYouTubeID = (url: string): string | null => {
    if (!url) return null

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeId = getYouTubeID(slide.videoUrl || '')

  if (!youtubeId) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-black text-white">
        Invalid YouTube URL
      </div>
    )
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      {!isPlaying ? (
        <div
          className="relative cursor-pointer"
          onClick={handlePlay}
          style={{ maxWidth: '90vw', maxHeight: '80vh', aspectRatio: '16/9' }}
        >
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <Image
              src={
                slide.thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
              }
              alt={slide.title || 'Video thumbnail'}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              onError={(e) => {
                // If custom thumbnail fails or YouTube high-res fails, fallback to medium quality YouTube thumbnail
                if (
                  slide.thumbnailUrl &&
                  e.target instanceof HTMLImageElement &&
                  e.target.src === slide.thumbnailUrl
                ) {
                  e.target.src = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
                } else if (e.target instanceof HTMLImageElement) {
                  e.target.src = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                }
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red rounded-full flex items-center justify-center shadow-md transform transition-transform hover:scale-110">
              <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
            </div>
          </div>
          {slide.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3">
              <h3 className="text-lg font-medium">{slide.title}</h3>
            </div>
          )}
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          style={{ maxWidth: '90vw', maxHeight: '80vh', aspectRatio: '16/9' }}
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={slide.title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  )
}

export const SharedLightbox: React.FC = () => {
  const { isLightboxOpen, closeLightbox, currentIndex, setCurrentIndex, getSlides, figures } =
    useFigures()

  // Get sorted slides
  const slides = getSlides()

  // When the current index changes in the lightbox, update our context
  const handleViewChange = ({ index }: { index: number }) => {
    setCurrentIndex(index)
  }

  // Custom render function for slides
  const renderCustomSlide = ({ slide }: { slide: any }) => {
    if (slide.type === 'svg') {
      return <SVGSlide slide={slide} />
    }
    if (slide.type === 'video') {
      return <VideoSlide slide={slide} />
    }
    return undefined // Return undefined to use the default renderer for non-SVG images
  }

  // Additional captions for figures showing figure number and title
  const renderCaption = ({ slide }: { slide: any }) => {
    if (slide.figureNumber) {
      return (
        <div className="p-4 bg-black bg-opacity-75 text-white hidden md:block max-w-[33%] ml-auto">
          <div className="text-sm font-medium">
            {slide.chapterNumber ? `Chapter ${slide.chapterNumber} | ` : ''}Figure{' '}
            {slide.figureNumber}
          </div>
          {slide.title && <div className="text-base font-bold">{slide.title}</div>}
          {slide.caption && <div className="text-sm mt-1">{slide.caption}</div>}
          {slide.source && <div className="text-xs italic mt-2">Source: {slide.source}</div>}
        </div>
      )
    }
    return null
  }

  // Function to handle downloads with proper types
  const handleDownload = ({
    slide,
    saveAs,
  }: {
    slide: any
    saveAs: (source: string | Blob, name?: string) => void
  }) => {
    // Generate a filename based on chapter and figure number
    const chapterPart = slide.chapterNumber ? `chapter-${slide.chapterNumber}-` : ''
    const figureNum = slide.figureNumber ? `figure-${slide.figureNumber}` : 'image'
    const titlePart = slide.title ? `-${slide.title.toLowerCase().replace(/\s+/g, '-')}` : ''
    const baseFilename = `${chapterPart}${figureNum}${titlePart}`

    // For SVG slides, download as PNG
    if (slide.type === 'svg' && slide.svgUrl) {
      const pngFilename = `${baseFilename}.png`

      // Always download as PNG
      downloadPngFromUrl(slide.svgUrl, pngFilename)
      return false // Prevent default
    } else if (slide.type === 'video') {
      // For videos, we don't provide a download, just open the YouTube URL
      window.open(slide.videoUrl, '_blank')
      return false // Prevent default
    } else {
      // For regular images, use the saveAs function
      const extension = slide.src?.split('.').pop() || 'jpg'
      const filename = `${baseFilename}.${extension}`

      // Let default handler run
      saveAs(slide.src, filename)
      return true
    }
  }

  // Cast the entire props object to any to bypass type checking issues
  const lightboxProps: any = {
    open: isLightboxOpen,
    close: closeLightbox,
    slides: slides,
    index: currentIndex,
    on: { view: handleViewChange },
    plugins: [Fullscreen, Zoom, Counter, Download],
    render: {
      slide: renderCustomSlide,
      slideFooter: renderCaption,
    },
    carousel: {
      padding: '32px',
      spacing: '16px',
      imageFit: 'contain',
    },
    animation: {
      swipe: 250,
    },
    controller: {
      closeOnBackdropClick: true,
    },
    toolbar: {
      buttons: ['close', 'download', 'fullscreen', 'zoom'],
    },
    zoom: {
      maxZoomPixelRatio: 3,
      zoomInMultiplier: 2,
      doubleTapDelay: 300,
      doubleClickDelay: 300,
      wheelZoomDistanceFactor: 100,
    },
    download: {
      download: handleDownload,
    },
  }

  return <Lightbox {...lightboxProps} />
}
