'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utilities/cn'
import { useFigures } from '@/contexts/FiguresContext'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import type { FigureSlide } from '@/contexts/FiguresContext'
import { downloadSvgFile } from '@/utilities/figureUtils'

interface ResourceFigureProps {
  figure: FigureSlide
  className?: string
}

export const ResourceFigure: React.FC<ResourceFigureProps> = ({ figure, className }) => {
  const { openLightbox, addFigure } = useFigures()
  const hasRegistered = useRef(false)

  // Register this figure with context if not already registered
  useEffect(() => {
    if (!hasRegistered.current) {
      addFigure(figure)
      hasRegistered.current = true
    }
  }, [figure, addFigure])

  const handleOpenLightbox = () => {
    // Directly call openLightbox with the figure ID
    openLightbox(figure.id)
  }

  const handleDownloadSVG = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!figure.svgUrl) return

    const filename = `figure-${figure.figureNumber || 'untitled'}.svg`
    await downloadSvgFile(figure.svgUrl, filename)
  }

  const handleDownloadPNG = async (e: React.MouseEvent) => {
    e.stopPropagation()

    // Create a new hidden Image element for the download
    const img = new window.Image()
    img.crossOrigin = 'anonymous' // Handle CORS issues

    // Set up canvas when image is loaded
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth || 800
      canvas.height = img.naturalHeight || 600

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Could not get canvas context')
        return
      }

      // Fill with white background (for transparency)
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0)

      try {
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Could not create blob from canvas')
            return
          }

          const filename = `figure-${figure.figureNumber || 'untitled'}.png`
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()

          // Clean up
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 'image/png')
      } catch (err) {
        console.error('Error creating PNG:', err)
      }
    }

    // Handle errors
    img.onerror = (err) => {
      console.error('Error loading image for PNG export:', err)
      alert('Could not download image. It may be restricted by CORS policy.')
    }

    // Start loading the image
    img.src = figure.src
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="relative group cursor-pointer overflow-hidden " onClick={handleOpenLightbox}>
        <div className="h-64 w-full relative">
          {/* Use Next.js Image component directly instead of the Media component */}
          <Image
            src={figure.src}
            alt={figure.alt || figure.title || `Figure ${figure.figureNumber}`}
            className="object-contain w-full h-full"
            fill
          />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">
          Figure {figure.figureNumber}: {figure.title}
        </h3>
        {figure.caption && <p className="text-sm text-gray-600 mt-1">{figure.caption}</p>}

        <div className="flex space-x-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
            onClick={handleDownloadPNG}
          >
            <DownloadIcon size={16} />
            <span>PNG</span>
          </Button>

          {figure.type === 'svg' && figure.svgUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
              onClick={handleDownloadSVG}
            >
              <DownloadIcon size={16} />
              <span>SVG</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
