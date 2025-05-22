'use client'

import React from 'react'
import Image from 'next/image'
import { FigureSlide, useFigures } from '@/contexts/FiguresContext'
import { Button } from '@/components/ui/button'
import { Archive, Download } from 'lucide-react'
import { ColorType } from '@/app/(frontend)/resources/page.client'

interface FiguresTabProps {
  figures: FigureSlide[]
  onDownloadAllFigures?: () => void
  isDownloading?: boolean
  mainColor?: ColorType
}

const FiguresTab: React.FC<FiguresTabProps> = ({
  figures,
  onDownloadAllFigures,
  isDownloading = false,
  mainColor = 'red',
}) => {
  const { openLightbox } = useFigures()

  // Handle click on a figure with debugging
  const handleFigureClick = (figureId: string) => {
    openLightbox(figureId)
  }

  return (
    <>
      {onDownloadAllFigures && (
        <div className="w-full flex justify-center mb-6">
          <Button
            variant="outline"
            color={mainColor}
            size="sm"
            onClick={onDownloadAllFigures}
            disabled={isDownloading}
            icon={<Download size={16} />}
          >
            {isDownloading ? 'Preparing ZIP...' : 'Download All Figures'}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {figures
          .sort((a, b) => {
            // First sort by chapter number
            if (a.chapterNumber !== b.chapterNumber) {
              return (a.chapterNumber || 0) - (b.chapterNumber || 0)
            }
            // Then by figure number within chapter
            return (a.figureNumber || 0) - (b.figureNumber || 0)
          })
          .map((figure) => (
            <div
              key={figure.id}
              className={`bg-white/60 rounded-lg overflow-hidden shadow-xs   hover:border-${mainColor}-500 hover:bg-${mainColor}-50 transition-all duration-200 p-6`}
              onClick={() => handleFigureClick(figure.id)}
            >
              <div className="h-40 relative mb-3 cursor-pointer">
                <Image
                  src={figure.src}
                  alt={figure.alt || figure.title || ''}
                  className="object-contain"
                  fill
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-base font-medium">{figure.title}</p>
                <p className="text-sm">{figure.caption}</p>
                {figure.source && (
                  <p className="text-xs text-gray-500 italic">Source: {figure.source}</p>
                )}
                <span className="inline-block px-2 py-1 text-xs bg-beige rounded-lg">
                  From Chapter {figure.chapterNumber} | Figure {figure.figureNumber}
                </span>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default FiguresTab
