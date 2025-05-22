'use client'

import React from 'react'
import RichText from '@/components/RichText'
import { motion } from 'motion/react'
import { Media } from '@/components/Media'
import type { About } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/utilities/cn'
import TreesIllustration from '@/components/Trees'
import Link from 'next/link'
interface PageClientProps {
  about: About | null
}

const PageClient: React.FC<PageClientProps> = ({ about }) => {
  if (!about) {
    return null
  }

  const { title, content, authors } = about
  const accentColor = 'beige'
  const authorBgColor = 'dark-blue'

  return (
    <article className="">
      {/* Clean, minimal hero section */}
      <section className={cn(`bg-${accentColor} h-[40svh] lg:h-[60svh] flex `)}>
        <div className="container py-24">
          <h1 className="text-4xl md:text-7xl font-bold text-petrol">{title}</h1>
        </div>
      </section>
      <div className="relative h-[20svh] lg:h-[55svh] w-full -mt-24 md:-mt-48 lg:-mt-88 xl:-mt-96 ">
        <TreesIllustration className="opacity-70" />
      </div>

      {/* Clean content section */}
      <section className="relative z-10 bg-white overflow-hidden pt-6 lg:pt-12 pb-72">
        <div className="container relative">
          <motion.div
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <RichText data={content} />
          </motion.div>
        </div>
      </section>

      {/* Authors section with ChapterPreviewCard-inspired design */}
      {authors && authors.length > 0 && (
        <section className="relative pb-24 md:pb-32 -mt-72 bg-petrol  overflow-hidden">
          <div className="container relative z-10 pt-16">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
              {authors.map((author, index) => {
                const isEven = index % 2 === 0

                return (
                  <div key={author.id || index} className="relative">
                    {/* Card with accent border styling inspired by ChapterPreviewCard */}
                    <div
                      className={cn('relative rounded-2xl overflow-hidden shadow-md bg-beige')}
                      style={{
                        borderLeft: isEven ? `6px solid var(--${authorBgColor})` : 'none',
                        borderRight: !isEven ? `6px solid var(--${authorBgColor})` : 'none',
                      }}
                    >
                      {/* White header section with logo and name */}
                      <div className="bg-beige px-6 lg:px-12 pt-8  relative  ">
                        {/* Top accent bar */}
                        <div
                          className="absolute top-0 left-0 h-2 w-full"
                          style={{ backgroundColor: `var(--${authorBgColor})` }}
                        ></div>

                        <div className="flex items-center  space-x-5">
                          <div className="flex-1 text-left">
                            <h3 className="text-lg md:text-xl font-semibold w-full md:w-2/3 mr-auto leading-tight">
                              {author.name}
                            </h3>
                          </div>
                          {author.logo && typeof author.logo !== 'string' && (
                            <div className="shrink-0 w-24 md:w-28 h-24 md:h-28 relative rounded-sm overflow-hidden ">
                              <Media
                                resource={author.logo}
                                alt={author.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Colored content section */}
                      <div className="px-6 lg:px-12 py-4  ">
                        {/* Author content */}
                        {author.content && (
                          <div className="medium-text max-w-none">
                            <RichText data={author.content} />
                          </div>
                        )}

                        {/* Address section */}
                        {author.address && (
                          <div className="border-t border-white/20 mt-6">
                            <div className=" text-black/50 max-w-none small-text ">
                              <RichText data={author.address} />
                            </div>
                          </div>
                        )}

                        {/* Website link */}
                        {author.url && (
                          <div className="my-6">
                            <Link href={author.url} target="_blank" rel="noopener noreferrer">
                              <Button
                                color="dark-blue"
                                variant="outline"
                                size="sm"
                                icon={<ExternalLink size={14} />}
                                asChild
                              >
                                Visit website
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export default PageClient
