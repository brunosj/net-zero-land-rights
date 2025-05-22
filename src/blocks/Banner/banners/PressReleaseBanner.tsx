'use client'

import type { BannerBlock } from '@/payload-types'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink, Calendar } from 'lucide-react'
import { Media as MediaComponent } from '@/components/Media'
import { motion } from 'motion/react'

type Props = {
  className?: string
  title: string
  // backgroundColor: BannerBlock['backgroundColor']
  buttonText: string
  date?: string | null
  externalLink?: string | null
  image?: BannerBlock['image']
  color?: string
}

export const PressReleaseBanner: React.FC<Props> = ({
  className,
  title,
  // backgroundColor,
  buttonText,
  date,
  externalLink,
  image,
  color,
}) => {
  // Use passed color or fallback to backgroundColor from the block
  const bgColor = color

  // Format date if available
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  if (!externalLink) return null

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background gradient and decorative elements */}
      <div className={`absolute inset-0 bg-${bgColor}/5 backdrop-blur-[1px] z-0`}></div>
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-${bgColor} via-${bgColor}/60 to-transparent`}
      ></div>
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-${bgColor}/10 blur-xl`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-white/40 to-transparent`}
      ></div>

      <div className="relative z-10 p-6 md:p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-start justify-center gap-8">
          {/* Content */}
          <div className="flex-1 flex flex-col items-center md:items-start space-y-4 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left w-full"
            >
              {formattedDate && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-gray-500 mb-2">
                  <Calendar size={16} className={`text-${bgColor}`} />
                  <span>{formattedDate}</span>
                </div>
              )}

              <h3 className={`text-xl md:text-2xl font-semibold text-${bgColor}`}>{title}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center md:justify-start"
            >
              <Link
                href={externalLink}
                className="inline-block mt-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button color={bgColor as any} icon={<ExternalLink size={16} />} variant="rounded">
                  {buttonText || 'Read Press Release'}
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Image (if available) */}
          {image && typeof image !== 'string' && image.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="shrink-0 relative md:w-56 md:h-56 w-full h-48 rounded-md overflow-hidden shadow-md order-1 md:order-2"
            >
              <MediaComponent
                resource={image}
                alt={title || 'Press release image'}
                className="object-cover"
                fill
              />
              <div
                className={`absolute inset-0 bg-linear-to-tr from-${bgColor}/20 to-transparent mix-blend-overlay`}
              ></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
