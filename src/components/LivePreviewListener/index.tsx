'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false)

  useEffect(() => {
    // Only enable the preview listener in development or if draft mode cookie exists
    const isDev = process.env.NODE_ENV === 'development'
    const hasDraftModeCookie = document.cookie.includes('__draft_mode=')

    if (isDev || hasDraftModeCookie) {
      setIsPreviewEnabled(true)
    }
  }, [])

  // Don't render anything if preview isn't enabled
  if (!isPreviewEnabled) return null

  try {
    return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
  } catch (error) {
    console.error('Failed to initialize LivePreviewListener:', error)
    return null
  }
}
