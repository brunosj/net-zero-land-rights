import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from 'src/utilities/cn'
import Link from 'next/link'
import React from 'react'
import type { ExtendedColorKey } from '@/config/colors'
import type { Page, Homepage, About, ChaptersPage, Chapter, Contact } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo:
      | 'pages'
      | 'chapters'
      | 'chapters-page'
      | 'homepage'
      | 'about'
      | 'contact'
      | 'resources'
    value: Page | Homepage | About | ChaptersPage | Chapter | Contact | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
  color?: ExtendedColorKey
  setIsOpen?: (isOpen: boolean) => void
  onClick?: () => void
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
    color,
    setIsOpen,
  } = props

  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? reference?.relationTo === 'chapters'
        ? `/chapters/${reference.value.slug}`
        : reference.value.slug === 'homepage'
          ? '/'
          : `/${reference.value.slug}`
      : url

  if (!href) return null

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* Ensure we don't break any styles set by richText */
  const handleClick = () => {
    if (setIsOpen) setIsOpen(false)
    if (props.onClick) props.onClick()
  }

  if (appearance === 'inline') {
    return (
      <Link
        className={cn(className)}
        href={href || url || ''}
        {...newTabProps}
        onClick={handleClick}
      >
        {label ? label : children}
      </Link>
    )
  }

  return (
    <Link className={cn(className)} href={href || url || ''} {...newTabProps}>
      <Button
        asChild
        className={className}
        size={size}
        variant={appearance}
        color={color}
        onClick={handleClick}
      >
        {label ? label : children}
      </Button>
    </Link>
  )
}
