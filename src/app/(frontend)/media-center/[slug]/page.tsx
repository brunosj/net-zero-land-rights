import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import type { MediaItem } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const mediaItem = await queryMediaItemBySlug({ slug })

  if (!mediaItem) {
    return {
      title: 'Media Item Not Found | Net Zero & Land Rights',
      description: 'The requested media item could not be found.',
    }
  }

  return generateMeta({ doc: mediaItem })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const mediaItems = await payload.find({
    collection: 'media-items',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = mediaItems.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

export default async function MediaItemPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const mediaItem = await queryMediaItemBySlug({ slug })
  if (!mediaItem) {
    return notFound()
  }

  return (
    <article>
      <PageClient mediaItem={mediaItem} />
    </article>
  )
}

async function queryMediaItemBySlug({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'media-items',
    where: {
      slug: {
        equals: slug,
      },
    },
    draft,
    limit: 1,
    overrideAccess: draft,
  })

  return result.docs?.[0] || null
}
