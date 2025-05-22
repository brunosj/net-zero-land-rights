import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { About } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export default async function AboutPage() {
  const about = await queryAbout()

  if (!about) {
    return notFound()
  }

  return (
    <article>
      {/* <LivePreviewListener /> */}
      <PageClient about={about} />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const about = await queryAbout()
  if (!about) {
    return {
      title: 'About | Net Zero & Land Rights',
    }
  }
  return generateMeta({ doc: about })
}

async function queryAbout(): Promise<About | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'about',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
  })

  return result.docs?.[0] || null
}
