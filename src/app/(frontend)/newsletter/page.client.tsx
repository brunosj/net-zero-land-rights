'use client'

import React, { Suspense } from 'react'
import type { Newsletter } from '@/payload-types'
import { motion } from 'motion/react'
import Buildings from '@/assets/buildings.svg'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import { getTextColor } from '@/utilities/getTextColor'
import NewsletterForm from '@/components/NewsletterForm'
interface NewsletterPageClientProps {
  newsletter: Newsletter | null
}

const NewsletterPageClient: React.FC<NewsletterPageClientProps> = ({ newsletter }) => {
  if (!newsletter) {
    return null
  }

  const { title, mainColor } = newsletter

  return (
    <section className="min-h-screen">
      <section
        className={cn(`bg-${mainColor} h-[30svh] md:h-[50svh] flex relative overflow-hidden`)}
      >
        <div className="container py-24 my-auto relative z-10">
          <div className="max-w-[50%] md:max-w-[60%]">
            <h1 className={`text-4xl md:text-7xl font-semibold ${getTextColor(mainColor)}`}>
              {title}
            </h1>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 md:right-12 h-[20svh] md:h-[30svh] w-[60%] md:w-[50%]">
          <Image
            src={Buildings}
            alt="Buildings"
            style={{
              objectFit: 'contain',
              objectPosition: 'right bottom',
            }}
            fill
            priority
          />
        </div>
      </section>
      <motion.section
        className="py-12 md:py-24 bg-white min-h-[60vsh]"
        initial={{ y: 30 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Suspense fallback={<div className="container text-center py-8">Loading form...</div>}>
          <NewsletterForm page={newsletter} />
        </Suspense>
      </motion.section>
    </section>
  )
}

export default NewsletterPageClient
