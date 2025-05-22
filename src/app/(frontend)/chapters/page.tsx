import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { Chapter } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
export default async function ChaptersPage() {
  const chapters = await queryChapters()

  if (!chapters || chapters.length === 0) {
    return notFound()
  }

  return (
    <article>
      <PageClient />
      {/* <LivePreviewListener /> */}
      <section className="container py-24">
        <div className="max-w-[50rem]">
          <RichText data={chapters[0].content} />
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const chapters = await queryChapters()
  if (!chapters || chapters.length === 0) {
    return {
      title: 'Chapters | Net Zero & Land Rights',
      description: 'Explore the chapters of Net Zero & Land Rights',
    }
  }
  return generateMeta({ doc: chapters[0] })
}

async function queryChapters(): Promise<Chapter[]> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'chapters',
    draft,
    sort: 'chapterNumber',
    limit: 1,
    overrideAccess: draft,
  })

  return result.docs || []
}
