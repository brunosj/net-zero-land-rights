'use client'

import React, { useEffect, useState } from 'react'
import { Globe } from 'lucide-react'
import type { Resource } from '@/payload-types'
import RichText from '@/components/RichText'
import { ColorType } from '@/app/(frontend)/resources/page.client'
import { FigureSlide, useFigures } from '@/contexts/FiguresContext'

type WebPageResource = NonNullable<Resource['additionalResources']>[number] & {
  resourceType: 'webPage'
}

interface WebPagesTabProps {
  webPages: WebPageResource[]
  mainColor: ColorType
}

const WebPagesTab: React.FC<WebPagesTabProps> = ({ webPages, mainColor }) => {
  const { figures } = useFigures()
  const [enrichedWebPages, setEnrichedWebPages] = useState<any[]>([])

  // Enrich web pages with chapter numbers from figures if needed
  useEffect(() => {
    const enriched = webPages.map((webPage) => {
      // If there's already a chapter number, use it
      if (typeof webPage.chapter === 'object' && webPage.chapter?.chapterNumber !== undefined) {
        return webPage
      }

      // If there's a chapter title but no number, look it up from figures
      if (typeof webPage.chapter === 'object' && webPage.chapter?.title) {
        const chapterTitle = webPage.chapter.title
        const matchingFigure = figures.find(
          (fig) =>
            fig.chapterTitle && fig.chapterTitle.toLowerCase() === chapterTitle.toLowerCase(),
        )

        if (matchingFigure?.chapterNumber) {
          return {
            ...webPage,
            chapter: {
              ...webPage.chapter,
              chapterNumber: matchingFigure.chapterNumber,
            },
          }
        }
      }

      return webPage
    })

    setEnrichedWebPages(enriched)
  }, [webPages, figures])

  const handleWebPageClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ul className="space-y-6">
        {enrichedWebPages.map((webPage, index) => (
          <li
            key={index}
            className={`py-4 px-4 bg-white/60 transition-all duration-300 relative cursor-pointer rounded-md shadow-xs  hover:bg-${mainColor}`}
            onClick={() => handleWebPageClick(webPage.link || '#')}
          >
            <div
              className={`absolute inset-0 bg-${mainColor} duration-300 ease-in-out hover:opacity-10 opacity-0`}
            />
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <Globe className={`mr-2 h-5 w-5 text-${mainColor}`} />
                  <h3 className="text-base lg:text-lg font-medium text-gray-900">
                    {webPage.title}
                  </h3>
                </div>

                {webPage.description && (
                  <div className="mt-3 ml-7">
                    <RichText
                      data={webPage.description}
                      className="small-text"
                      enableProse={false}
                    />
                  </div>
                )}
                {webPage.chapter && (
                  <div className="mt-2 mb-2 ml-7">
                    <span className="inline-block px-2 py-1 text-xs bg-beige text-gray-700 rounded-md">
                      {typeof webPage.chapter === 'object' && webPage.chapter?.chapterNumber
                        ? `From Chapter ${webPage.chapter.chapterNumber} | ${webPage.chapter.title}`
                        : typeof webPage.chapter === 'object' && webPage.chapter?.title
                          ? `From: ${webPage.chapter.title}`
                          : 'Related Resource'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WebPagesTab
