import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { MediaCenter, MediaItem } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export default async function MediaCenterPage() {
  const [mediaCenter, mediaItems] = await Promise.all([queryMediaCenter(), queryMediaItems()])

  if (!mediaCenter) {
    return notFound()
  }

  return (
    <article>
      {/* <LivePreviewListener /> */}
      <PageClient mediaCenter={mediaCenter} mediaItems={mediaItems || []} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const mediaCenter = await queryMediaCenter()
  if (!mediaCenter) {
    return {
      title: 'Media Center | Net Zero & Land Rights',
    }
  }
  return generateMeta({ doc: mediaCenter })
}

async function queryMediaCenter(): Promise<MediaCenter | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'media-center',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
  })

  return result.docs?.[0] || null
}

async function queryMediaItems(): Promise<MediaItem[] | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'media-items',
    draft,
    sort: '-date',
    limit: 100,
    overrideAccess: draft,
  })

  return result.docs || null
}
