'use client'

import type { Chapter } from '@/payload-types'

import React from 'react'
import { Media } from '@/components/Media'
import { Share } from '@/components/Share'
import { getTextColor } from '@/utilities/getTextColor'
import { cn } from '@/utilities/cn'
import Link from 'next/link'
import { ClockIcon } from '@/components/icons/ClockIcon'

export const ChapterHero: React.FC<{
  post: Chapter
  readingTime?: number
}> = ({ post, readingTime }) => {
  const {
    meta: { image: metaImage } = {},
    title,
    heroImage,
    keyMessage,
    mainColor,
    chapterNumber,
    authors,
  } = post

  const textColor = getTextColor(mainColor)

  // Group authors by organization
  const authorsByOrg = React.useMemo(() => {
    if (!authors || !Array.isArray(authors) || authors.length === 0) return null

    const grouped: Record<string, typeof authors> = {}

    authors.forEach((author) => {
      const org = author.organization
      if (!grouped[org]) {
        grouped[org] = []
      }
      grouped[org].push(author)
    })

    return grouped
  }, [authors])

  return (
    <header>
      <div className={`text-${textColor} bg-${mainColor} `}>
        <div className="container mx-auto px-4 lg:px-6">
          {/* Chapter number and title */}
          <div className={`pt-16 lg:pt-36 border-b-2 border-${textColor} `}>
            {chapterNumber !== 0 && (
              <div className="mb-2 lg:mb-4">
                <span className="uppercase font-medium tracking-widest text-lg lg:font-2xl">{`Chapter ${chapterNumber}`}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-8xl font-semibold mb-8 lg:mb-36">
              {title}
            </h1>
          </div>

          {/* Meta info row */}
          <div className="mt-4 lg:mt-6 text-sm lg:text-base">
            {/* First line: Contribution by + authors 1st line + reading time/share */}
            <div className="flex flex-col lg:flex-row lg:justify-between ">
              <div className="flex flex-col lg:flex-row lg:flex-grow ">
                <span className="whitespace-nowrap lg:mr-2 font-medium">Contribution by:</span>
                {authorsByOrg && Object.keys(authorsByOrg).length > 0 && (
                  <div className="lg:flex lg:flex-wrap">
                    {Object.entries(authorsByOrg).map(([org, orgAuthors], orgIndex, orgsArray) => (
                      <React.Fragment key={orgIndex}>
                        {/* Authors from the same organization */}
                        {orgAuthors.map((author, i, arr) => (
                          <React.Fragment key={author.id || i}>
                            {author.name}
                            {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' and ' : ''}
                          </React.Fragment>
                        ))}
                        <span className="inline-block ml-0.5 lg:mx-1">
                          {orgAuthors[0].link ? (
                            <Link
                              className="items-start justify-start underline-offset-4 underline duration-300 opacity-60 hover:opacity-100"
                              href={orgAuthors[0].link || ''}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              ({org})
                            </Link>
                          ) : (
                            <>({org})</>
                          )}
                        </span>
                        {/* Add comma or 'and' between different organizations */}
                        {orgIndex < orgsArray.length - 2
                          ? ', '
                          : orgIndex === orgsArray.length - 2
                            ? ' and '
                            : ''}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Share buttons */}
              <div className="flex mt-2 lg:mt-0 lg:flex-shrink-0 lg:whitespace-nowrap">
                {/* Reading time */}
                {readingTime && readingTime > 0 && (
                  <div className="flex items-center">
                    <ClockIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    <span className="whitespace-nowrap">{readingTime} min read</span>
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

          {/* Key message */}
          {keyMessage && typeof keyMessage === 'object' && keyMessage.message && (
            <div className="w-full py-8 lg:py-16 xl:w-2/3">
              <p className="text-base lg:text-xl">{keyMessage.message}</p>
            </div>
          )}
        </div>

        {/* Hero image with caption */}
        {heroImage && typeof heroImage === 'object' && (
          <div className="relative">
            <Media resource={heroImage} />
            {/* {heroImage.caption && (
            <figcaption className="mt-2 text-sm italic">
            {heroImage.caption}
            </figcaption>
            )} */}
            <div
              className={`absolute pointer-events-none left-0 bottom-0 w-full h-full opacity-20 bg-${mainColor}`}
            />
          </div>
        )}

        {!heroImage && <div className="pb-8 lg:pb-16 relative"></div>}
      </div>
    </header>
  )
}
