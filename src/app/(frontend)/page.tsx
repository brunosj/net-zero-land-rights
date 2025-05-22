import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'
import { notFound } from 'next/navigation'
import { getCachedGlobal } from '@/utilities/getGlobals'

import type { Homepage, Chapter } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export default async function Home() {
  let homepage: Homepage | null = null
  let chapters: Chapter[] = []

  try {
    homepage = await queryHomepage()
    chapters = await queryChapters()
  } catch (error) {
    console.error('Error fetching homepage data:', error)
  }

  if (!homepage) {
    return notFound()
  }

  const { heroSection, keyMessagesSection, aboutSection } = homepage
  return (
    <PageClient
      heroSection={heroSection}
      aboutSection={aboutSection}
      keyMessagesSection={keyMessagesSection}
      chapters={chapters}
    />
  )
}

export async function generateMetadata(): Promise<Metadata> {
  let homepage: Homepage | null = null

  try {
    homepage = await queryHomepage()
  } catch (error) {
    console.error('Error fetching homepage data for metadata:', error)
  }

  if (!homepage) {
    return {
      title: 'Homepage | Net Zero & Land Rights',
    }
  }

  return generateMeta({ doc: homepage })
}

async function queryHomepage(): Promise<Homepage | null> {
  try {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'homepage',
      draft,
      limit: 1,
      pagination: false,
      overrideAccess: draft,
      depth: 15,
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Error in queryHomepage:', error)
    return null
  }
}

async function queryChapters(): Promise<Chapter[]> {
  try {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'chapters',
      draft,
      sort: 'chapterNumber',
      limit: 100,
      pagination: false,
      overrideAccess: draft,
      depth: 4,
    })

    return result.docs || []
  } catch (error) {
    console.error('Error in queryChapters:', error)
    return []
  }
}
