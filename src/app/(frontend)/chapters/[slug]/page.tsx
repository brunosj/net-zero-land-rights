import type { Metadata } from 'next'

import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'

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
  const chapter = await queryChapterBySlug({ slug })

  if (!chapter) {
    return {
      title: 'Chapter Not Found | Net Zero & Land Rights',
      description: 'The requested chapter could not be found.',
    }
  }

  return generateMeta({ doc: chapter })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const chapters = await payload.find({
    collection: 'chapters',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = chapters.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

export default async function Chapter({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/chapters/' + slug
  const chapter = await queryChapterBySlug({ slug })

  if (!chapter) return notFound()

  const { mainColor, chapterNumber, totalChapters, previousSlug, nextSlug } = chapter

  return (
    <article>
      <PageClient
        post={chapter}
        mainColor={mainColor}
        chapterNumber={chapterNumber}
        totalChapters={totalChapters}
        previousSlug={previousSlug || undefined}
        nextSlug={nextSlug || undefined}
      />
    </article>
  )
}

async function queryChapterBySlug({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const [chapterResult, totalChapters] = await Promise.all([
    payload.find({
      collection: 'chapters',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    }),
    payload.find({
      collection: 'chapters',
      draft,
      limit: 0,
      overrideAccess: draft,
    }),
  ])

  const currentChapter = chapterResult.docs[0]

  if (!currentChapter) return null

  // Find adjacent chapters
  const [previousChapter, nextChapter] = await Promise.all([
    payload.find({
      collection: 'chapters',
      draft,
      limit: 1,
      where: {
        chapterNumber: {
          less_than: currentChapter.chapterNumber,
        },
      },
      sort: '-chapterNumber',
    }),
    payload.find({
      collection: 'chapters',
      draft,
      limit: 1,
      where: {
        chapterNumber: {
          greater_than: currentChapter.chapterNumber,
        },
      },
      sort: 'chapterNumber',
    }),
  ])

  return {
    ...currentChapter,
    previousSlug: previousChapter.docs[0]?.slug,
    nextSlug: nextChapter.docs[0]?.slug,
    totalChapters: totalChapters.totalDocs,
  }
}
