'use client'

import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { DownloadBanner, PressReleaseBanner, NewsletterBanner } from './banners'
import { usePublication } from '@/providers/PublicationProvider'
import { getColumnWidthClass, getColumnAlignmentClass } from '@/utilities/getColumnWidthClass'
import type { ExtendedColorKey } from '@/config/colors'

type Props = {
  className?: string
  color?: ExtendedColorKey
  size?: 'oneThird' | 'half' | 'twoThirds' | 'full'
  alignment?: 'left' | 'center' | 'right'
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = (props) => {
  const publication = usePublication()
  const { size = 'full', alignment = 'center', color } = props

  const columnWidthClass = getColumnWidthClass(size)
  const columnAlignmentClass = getColumnAlignmentClass(alignment)

  const renderBanner = () => {
    switch (props.bannerType) {
      case 'download':
        return (
          <DownloadBanner
            className={props.className}
            title={props.title}
            buttonText={props.buttonText}
            image={props.image}
            color={color}
            publication={publication}
          />
        )
      case 'pressRelease':
        return (
          <PressReleaseBanner
            className={props.className}
            title={props.title}
            buttonText={props.buttonText}
            date={props.date}
            externalLink={props.externalLink}
            image={props.image}
            color={color}
          />
        )
      case 'newsletter':
        return (
          <NewsletterBanner
            className={props.className}
            title={props.title}
            buttonText={props.buttonText}
            externalLink={props.externalLink}
            image={props.image}
            color={color}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={cn('mx-auto my-8 w-full', props.className)}>
      <div className={cn(columnWidthClass, columnAlignmentClass, 'mx-auto')}>
        <div className={cn('rounded-lg shadow-md overflow-hidden border border-gray-100')}>
          {renderBanner()}
        </div>
      </div>
    </div>
  )
}
