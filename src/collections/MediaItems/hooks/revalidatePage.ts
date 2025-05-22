import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating media items')
      revalidatePath('/media-center')
      revalidatePath(`/media-center/${doc.slug}`)
      revalidateTag('media-items')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ req: { payload } }) => {
  payload.logger.info('Revalidating media items after delete')
  revalidatePath('/media-center')
  revalidateTag('media-items')
}
