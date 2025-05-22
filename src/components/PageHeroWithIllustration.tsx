import React from 'react'
import { cn } from '@/utilities/cn'
import { getTextColor } from '@/utilities/getTextColor'
import Image from 'next/image'
import type { Chapter } from '@/payload-types'

interface PageHeroWithIllustrationProps {
  title: string
  mainColor: Chapter['mainColor']
  illustration?: any
  imageContainerBottomClassName?: string
  titleClassName?: string
  containerClassName?: string
}

export const PageHeroWithIllustration: React.FC<PageHeroWithIllustrationProps> = ({
  title,
  mainColor,
  illustration,
  imageContainerBottomClassName = '',
  titleClassName = 'max-w-[50%] md:max-w-[60%]',
  containerClassName,
}) => {
  return (
    <section
      className={cn(`bg-${mainColor} h-[50svh] flex relative overflow-hidden`, containerClassName)}
    >
      <div className="container py-24 my-auto relative z-10">
        <div className={titleClassName}>
          <h1 className={`text-4xl md:text-7xl font-bold text-${getTextColor(mainColor)}`}>
            {title}
          </h1>
        </div>
      </div>
      {illustration && (
        <div
          className={cn(
            'absolute right-0 md:right-12 h-[15svh] md:h-[30svh] w-[60%] md:w-[50%]',
            imageContainerBottomClassName,
          )}
        >
          <Image
            src={illustration}
            alt={title}
            style={{
              objectFit: 'contain',
              objectPosition: 'right bottom',
            }}
            fill
            priority
          />
        </div>
      )}
    </section>
  )
}
