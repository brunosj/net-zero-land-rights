'use client'

import { cn } from '@/utilities/cn'
import Image from 'next/image'
import React from 'react'

type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

export const BannerIllustration: React.FC<{
  className?: string
  align?: 'left' | 'right' | 'center'
  image: string | SVGComponent
  caption?: string
  backgroundColor?: string
  imageWidth?: 'full' | '1/2' | '2/3'
}> = ({ className, align = 'center', image, caption, backgroundColor, imageWidth = '1/2' }) => {
  const alignmentClass =
    align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end'

  return (
    <div className={`bg-${backgroundColor}`}>
      <div className={cn('container py-12 flex', alignmentClass)}>
        {typeof image === 'string' ? (
          <div
            className={cn(
              'w-full lg:w-1/2',
              imageWidth === '1/2'
                ? 'w-full lg:w-1/2'
                : imageWidth === '2/3'
                  ? 'w-full lg:w-2/3'
                  : 'w-full',
            )}
          >
            <Image src={image} alt={caption || 'Banner Illustration'} width={800} height={450} />
          </div>
        ) : (
          <div
            className={cn(
              'w-full lg:w-1/2',
              imageWidth === '1/2'
                ? 'w-full lg:w-1/2'
                : imageWidth === '2/3'
                  ? 'w-full lg:w-2/3'
                  : 'w-full',
            )}
          >
            {React.createElement(image as any, { className: 'w-full h-auto' })}
          </div>
        )}

        {caption && <figcaption className="text-center text-sm mt-2">{caption}</figcaption>}
      </div>
    </div>
  )
}
