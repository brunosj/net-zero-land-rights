'use client'

import React from 'react'
import type { Homepage, Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Button } from '@/components/ui/button'
import { Download, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import { usePublication } from '@/providers/PublicationProvider'
import Link from 'next/link'

interface AboutSectionProps {
  data: Homepage['aboutSection']
}

export const AboutSection: React.FC<AboutSectionProps> = ({ data }) => {
  // Get publication from context - must be called at the top level
  const publication = usePublication()

  if (!data) return null

  const { aboutContent, publicationDownloadTitle, pressReleaseDownloadTitle, pressReleaseLink } =
    data
  // Get file URL safely
  const fileUrl =
    typeof publication?.file === 'object' && publication.file ? publication.file.url : '#'

  // Determine press release URL and type
  const getPressReleaseUrl = () => {
    if (!pressReleaseLink) return null

    if (pressReleaseLink.type === 'Document' && pressReleaseLink.pressReleaseDownload) {
      // If it's a document, get the URL from the uploaded file
      return typeof pressReleaseLink.pressReleaseDownload === 'object'
        ? pressReleaseLink.pressReleaseDownload.url
        : null
    } else if (pressReleaseLink.type === 'Page' && pressReleaseLink.link) {
      // If it's a page reference with custom URL
      if (pressReleaseLink.link.type === 'custom' && pressReleaseLink.link.url) {
        return pressReleaseLink.link.url
      }
      // For internal references, we'll return true to indicate it exists but will be handled separately
      return pressReleaseLink.link.reference ? true : null
    }
    return null
  }

  const pressReleaseUrl = getPressReleaseUrl()
  const isExternalLink =
    pressReleaseLink?.type === 'Page' && pressReleaseLink.link?.type === 'custom'
  const isInternalLink =
    pressReleaseLink?.type === 'Page' && pressReleaseLink.link?.type === 'reference'

  // Handle document download click
  const handleDocumentDownload = () => {
    if (typeof pressReleaseUrl === 'string') {
      window.open(pressReleaseUrl, '_blank', 'noopener,noreferrer')
    }
  }

  // Calculate the href for internal links
  const getInternalHref = () => {
    if (!pressReleaseLink?.link?.reference) return null

    const ref = pressReleaseLink.link.reference
    if (typeof ref !== 'object') return null

    const relationTo = ref.relationTo
    let value = ref.value

    // Handle different value types
    const slug = typeof value === 'object' ? value.slug : typeof value === 'string' ? value : null
    if (!slug) return null

    // Generate the appropriate path based on relation type
    if (relationTo === 'chapters') {
      return `/chapters/${slug}`
    } else if (slug === 'homepage') {
      return '/'
    } else {
      return `/${slug}`
    }
  }

  const internalHref = isInternalLink ? getInternalHref() : null

  return (
    <>
      {/* Solid top section for seamless transition */}
      <section className="relative overflow-hidden bg-linear-to-br from-petrol via-petrol to-dark-blue pt-16 lg:pt-48 pb-48 lg:pb-64  -mt-[1px]">
        {/* Main content */}
        <div className="container relative z-10">
          {/* Left column for text */}
          <div className="text-white mb-16 lg:mb-32 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: '-100px 0px -100px 0px' }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
                type: 'tween',
              }}
              className="text-lg lg:text-3xl max-w-none text-white "
            >
              {aboutContent}
            </motion.div>
          </div>

          {/* Right column for publication card, offset down */}
          <div className="flex w-full justify-end">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2, margin: '-100px 0px -100px 0px' }}
              transition={{
                duration: 0.3,
                delay: 0.4,
                type: 'tween',
              }}
              className="w-full  xl:w-2/3"
            >
              {publication?.thumbnail && fileUrl && (
                <div className="relative">
                  {/* Publication floating card */}
                  <div className="relative rounded-xl bg-white/10 backdrop-blur-xs p-4 md:p-12 overflow-hidden border border-white/20 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-20">
                      {/* Publication image*/}
                      <div className="shrink-0 relative w-36 md:w-48 h-full rounded-md overflow-hidden shadow-md mx-auto md:mx-0">
                        <Media
                          resource={publication.thumbnail}
                          alt={publication.title || 'Publication thumbnail'}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className=" flex flex-col gap-4 lg:gap-10 items-center md:items-start">
                        {/* Publication info with download button */}
                        <div className="space-y-2 lg:space-y-4 text-center md:text-left">
                          <h3 className="text-xl lg:text-3xl  text-white font-normal">
                            {publicationDownloadTitle}
                          </h3>

                          <div className="flex md:justify-start justify-center">
                            <div>
                              <Link href={fileUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  color="light-green"
                                  variant="rounded"
                                  icon={<Download size={24} />}
                                >
                                  Download
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Press Release section - only show if we have title and link */}
                        {pressReleaseDownloadTitle && pressReleaseUrl && (
                          <div className="space-y-2 lg:space-y-4 text-center md:text-left">
                            <h3 className="text-xl lg:text-3xl text-white font-normal">
                              {pressReleaseDownloadTitle}
                            </h3>

                            <div className="flex md:justify-start justify-center">
                              {pressReleaseLink?.type === 'Document' ? (
                                <Link
                                  href={pressReleaseUrl as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    color="light-green"
                                    variant="rounded"
                                    icon={<Download size={24} />}
                                  >
                                    {pressReleaseLink.buttonText}
                                  </Button>
                                </Link>
                              ) : isExternalLink ? (
                                <Link
                                  href={pressReleaseUrl as string}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button
                                    color="light-green"
                                    variant="rounded"
                                    icon={<ExternalLink size={24} />}
                                  >
                                    {pressReleaseLink.buttonText}
                                  </Button>
                                </Link>
                              ) : isInternalLink && internalHref ? (
                                <Link
                                  href={internalHref}
                                  target={pressReleaseLink.link?.newTab ? '_blank' : '_self'}
                                >
                                  <Button
                                    color="light-green"
                                    variant="rounded"
                                    icon={<ExternalLink size={24} />}
                                    asChild
                                  >
                                    {pressReleaseLink.buttonText}
                                  </Button>
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decorative elements inside card */}
                    <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-light-green via-light-blue to-blue"></div>
                  </div>

                  {/* Decorative dots */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-light-green"></div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom diagonal divider - fixed to fully cover the bottom */}
        <div className="absolute bottom-0 left-0 w-full h-36 bg-beige transform skew-y-2 -mb-10"></div>
      </section>
    </>
  )
}
