'use client'

import React from 'react'
import { motion } from 'motion/react'
import type { MediaCenter, MediaItem } from '@/payload-types'
import { PageHeroWithIllustration } from '@/components/PageHeroWithIllustration'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/utilities/formatDate'
import RichText from '@/components/RichText'

interface PageClientProps {
  mediaCenter: MediaCenter
  mediaItems: MediaItem[]
}

const PageClient: React.FC<PageClientProps> = ({ mediaCenter, mediaItems }) => {
  const { title, content, contactPerson } = mediaCenter
  const accentColor = 'light-blue'

  return (
    <article>
      <PageHeroWithIllustration
        title={title}
        mainColor={accentColor}
        imageContainerBottomClassName="bottom-2 md:bottom-6"
      />

      <section className="bg-beige/60 relative z-10 overflow-hidden pt-6 lg:pt-12 pb-24">
        {content && (
          <div className="container relative">
            <motion.div
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <RichText data={content} />
            </motion.div>
          </div>
        )}

        <div className="container pt-6 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Media Items Section - Takes 2/3 of the width on large screens */}
            <div className="lg:col-span-2">
              <motion.div
                className="flex flex-col gap-6"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                {mediaItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/media-center/${item.slug}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow"
                  >
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="text-sm text-gray-500 mb-2">
                        {formatDate(item.releaseDate)}
                      </div>
                      <h3 className="text-lg md:text-2xl font-medium mb-3">{item.title}</h3>
                      <div className="mt-auto">
                        <span className="inline-block px-3 py-1 text-sm bg-light-blue/10 text-light-blue rounded-full">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Contact Person Section - Takes 1/3 of the width on large screens */}
            {contactPerson && contactPerson.length > 0 && (
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="bg-dark-blue rounded-xl p-6 md:p-8 text-white h-full"
                >
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
                    Press Contact
                  </h2>
                  <div className="flex flex-col items-center gap-8">
                    {contactPerson.map((person, index) => (
                      <div
                        key={person?.id || index}
                        className="flex flex-col items-center text-center w-full"
                      >
                        {person?.image && (
                          <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                            <Image
                              src={
                                typeof person.image === 'string'
                                  ? person.image
                                  : person.image.url || ''
                              }
                              alt={person.name || 'Contact person'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {person?.name && (
                          <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
                        )}
                        {person?.email && (
                          <a
                            href={`mailto:${person.email}`}
                            className="text-light-blue hover:underline"
                          >
                            {person.email}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}

export default PageClient
