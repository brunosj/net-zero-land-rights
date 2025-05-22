import clsx from 'clsx'
import React from 'react'
import TMGLogo from '../../../public/TMG_logo_white.png'
import Image from 'next/image'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'

  return (
    /* eslint-disable @next/next/no-img-element */
    <Image
      alt="TMG Logo"
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('object-contain', className)}
      src={TMGLogo}
    />
  )
}
