'use client'

import type { BannerBlock } from '@/payload-types'
import type { Media, Publication } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React, { useEffect } from 'react'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Media as MediaComponent } from '@/components/Media'
import { motion } from 'motion/react'
import { getTextColor } from '@/utilities/getTextColor'

type Props = {
  className?: string
  title: string
  // backgroundColor: BannerBlock['backgroundColor']
  buttonText: string
  image?: BannerBlock['image']
  color?: string
  publication?: Publication | null
}

export const DownloadBanner: React.FC<Props> = ({
  className,
  title,
  // backgroundColor,
  buttonText,
  image,
  color,
  publication,
}) => {
  // Use passed color or fallback to backgroundColor from the block
  const bgColor = color

  // Validate publication and file
  if (!publication) {
    console.warn('Publication is missing')
    return null
  }

  if (!publication.file) {
    console.warn('Publication file is missing')
    return null
  }

  if (typeof publication.file === 'string') {
    console.warn('Publication file is just a string:', publication.file)
    return null
  }

  if (!publication.file.url) {
    console.warn('Publication file URL is missing')
    return null
  }

  // Get publication file URL
  const fileUrl = publication.file.url

  // Use either provided image or publication thumbnail
  const imageToShow =
    image && typeof image !== 'string'
      ? image
      : publication.thumbnail && typeof publication.thumbnail !== 'string'
        ? publication.thumbnail
        : null

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background gradient and decorative elements */}
      <div className={`absolute inset-0 bg-${bgColor}/10 backdrop-blur-[2px] z-0`}></div>
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-${bgColor} via-${bgColor}/60 to-${bgColor}/20`}
      ></div>
      <div
        className={`absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-${bgColor}/20 blur-xl`}
      ></div>

      <div className="relative z-10 p-6 md:p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Publication/Image */}
          {imageToShow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="shrink-0 relative w-36 md:w-40 h-full rounded-md overflow-hidden shadow-md"
            >
              <MediaComponent
                resource={imageToShow}
                alt={publication.title || title || 'Publication cover'}
                className="object-contain"
              />
            </motion.div>
          )}

          {/* Content */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center md:text-left"
            >
              <h3 className={`text-xl md:text-2xl font-semibold text-black`}>{title}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href={fileUrl}
                download
                className="inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button color={bgColor as any} icon={<Download size={18} />} variant="rounded">
                  {buttonText || 'Download Publication'}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
