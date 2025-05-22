import type { StaticImageData } from 'next/image'

import { cn } from 'src/utilities/cn'
import React from 'react'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { getTextColor } from '@/utilities/getTextColor'

import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  color?: string
}

export const MediaBannerBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = false,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer = true,
    color,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  const bgColorClass = color ? `bg-${color}` : 'bg-dark-blue'
  const textColorClass = color ? `text-${getTextColor(color)}` : 'text-white'

  return (
    <div
      className={cn(
        'p-12',
        bgColorClass,
        textColorClass,
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <Media
        imgClassName={cn('border  rounded-[0.8rem]', imgClassName)}
        resource={media}
        src={staticImage}
      />
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
