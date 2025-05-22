import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePage: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating media center page')
      revalidatePath('/media-center')
      revalidateTag('media-center')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ req: { payload } }) => {
  payload.logger.info('Revalidating media center page after delete')
  revalidatePath('/media-center')
  revalidateTag('media-center')
}
