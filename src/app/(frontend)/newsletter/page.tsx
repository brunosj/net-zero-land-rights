import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { Newsletter } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import { notFound } from 'next/navigation'
import NewsletterPageClient from './page.client'

export async function generateMetadata(): Promise<Metadata> {
  const newsletter = await queryNewsletter()
  if (!newsletter) {
    return {
      title: 'Newsletter | Net Zero & Land Rights',
    }
  }
  return generateMeta({ doc: newsletter })
}

export default async function ContactPage() {
  const newsletter = await queryNewsletter()

  if (!newsletter) {
    return notFound()
  }

  return (
    <>
      {/* <LivePreviewListener /> */}
      <NewsletterPageClient newsletter={newsletter} />
    </>
  )
}

async function queryNewsletter(): Promise<Newsletter | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'newsletter',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
  })

  return result.docs?.[0] || null
}
