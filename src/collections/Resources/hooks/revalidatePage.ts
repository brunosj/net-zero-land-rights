import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateResources: CollectionAfterChangeHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating resources page')

      // Revalidate main resources tag
      revalidateTag('resources')

      // If the resources is showing chapters/figures, also revalidate chapters
      if (doc.showAllFigures || (doc.selectedChapters && doc.selectedChapters.length > 0)) {
        revalidateTag('chapters')
      }
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag('resources')
    // Since we don't know the previous state, revalidate chapters as well
    revalidateTag('chapters')
  }
}
