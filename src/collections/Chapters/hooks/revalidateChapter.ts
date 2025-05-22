import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Chapter } from '../../../payload-types'

export const revalidateChapter: CollectionAfterChangeHook<Chapter> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/chapters/${doc.slug}`

      payload.logger.info(`Revalidating chapter at path: ${path}`)

      // Revalidate the specific chapter path
      revalidatePath(path)

      // Revalidate chapter-specific tag
      revalidateTag(`chapter-${doc.id}`)

      // Revalidate general chapters collection
      revalidateTag('chapters')

      // Revalidate sitemap
      revalidateTag('chapters-sitemap')

      // Revalidate resources page if it might show chapter figures
      revalidateTag('resources')
    }

    // If the chapter was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/chapters/${previousDoc.slug}`

      payload.logger.info(`Revalidating old chapter at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag(`chapter-${doc.id}`)
      revalidateTag('chapters')
      revalidateTag('chapters-sitemap')
      revalidateTag('resources')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Chapter> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = `/chapters/${doc?.slug}`

    revalidatePath(path)
    revalidateTag(`chapter-${doc?.id}`)
    revalidateTag('chapters')
    revalidateTag('chapters-sitemap')
    revalidateTag('resources')
  }

  return doc
}
