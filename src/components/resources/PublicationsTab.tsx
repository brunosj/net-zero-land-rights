'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, ExternalLink, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/Media'
import type { Resource } from '@/payload-types'
import RichText from '@/components/RichText'
import { ColorType } from '@/app/(frontend)/resources/page.client'
import { useFigures } from '@/contexts/FiguresContext'

type PublicationResource = NonNullable<Resource['additionalResources']>[number] & {
  resourceType: 'publication'
}

interface PublicationsTabProps {
  publications: PublicationResource[]
  mainColor: ColorType
}

const PublicationsTab: React.FC<PublicationsTabProps> = ({ publications, mainColor }) => {
  const { figures } = useFigures()
  const [enrichedPublications, setEnrichedPublications] = useState<any[]>([])

  // Enrich publications with chapter numbers from figures if needed
  useEffect(() => {
    const enriched = publications.map((publication) => {
      // If there's already a chapter number, use it
      if (
        typeof publication.chapter === 'object' &&
        publication.chapter?.chapterNumber !== undefined
      ) {
        return publication
      }

      // If there's a chapter title but no number, look it up from figures
      if (typeof publication.chapter === 'object' && publication.chapter?.title) {
        const chapterTitle = publication.chapter.title
        const matchingFigure = figures.find(
          (fig) =>
            fig.chapterTitle && fig.chapterTitle.toLowerCase() === chapterTitle.toLowerCase(),
        )

        if (matchingFigure?.chapterNumber) {
          return {
            ...publication,
            chapter: {
              ...publication.chapter,
              chapterNumber: matchingFigure.chapterNumber,
            },
          }
        }
      }

      return publication
    })

    setEnrichedPublications(enriched)
  }, [publications, figures])

  return (
    <ul className="max-w-4xl mx-auto space-y-6 lg:space-y-12">
      {enrichedPublications.map((publication, idx) => {
        return (
          <li key={idx} className="  bg-white/60 p-4 rounded-lg shadow-xs">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail on the left */}
              {publication.thumbnail ? (
                <div className="w-1/2 md:w-1/4 shrink-0">
                  <Link href={publication.publicationUrl || '#'} className="h-full relative">
                    <Media
                      resource={publication.thumbnail}
                      alt={publication.title}
                      className="object-contain"
                    />
                  </Link>
                </div>
              ) : (
                <div className="md:w-1/4 shrink-0 bg-gray-100 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-gray-400" />
                </div>
              )}

              {/* Content on the right */}
              <div className="px-4 md:px-8 py-2 flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                  <h3 className="text-base lg:text-lg font-medium ">{publication.title}</h3>

                  {publication.authors && (
                    <p className="text-sm lg:text-base italic">{publication.authors}</p>
                  )}

                  {publication.description && (
                    <div className=" mb-4">
                      <RichText data={publication.description} className="small-text" />
                    </div>
                  )}
                  {publication.chapter && (
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs bg-beige text-gray-700 rounded-md">
                        {typeof publication.chapter === 'object' &&
                        publication.chapter?.chapterNumber
                          ? `From Chapter ${publication.chapter.chapterNumber} | ${publication.chapter.title}`
                          : typeof publication.chapter === 'object' && publication.chapter?.title
                            ? `From: ${publication.chapter.title}`
                            : 'Related Resource'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                  {publication.publicationUrl ? (
                    <Link
                      href={publication.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ExternalLink size={16} />}
                        color={mainColor}
                        asChild
                      >
                        View Publication
                      </Button>
                    </Link>
                  ) : publication.file ? (
                    <Link
                      href={typeof publication.file === 'string' ? publication.file : '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download size={16} />}
                        color={mainColor}
                        asChild
                      >
                        Download
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default PublicationsTab
