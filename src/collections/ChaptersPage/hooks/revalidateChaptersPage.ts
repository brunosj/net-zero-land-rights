import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateChaptersPage: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating chapters page')
      revalidatePath('/chapters')
      revalidateTag('chapters')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/chapters')
    revalidateTag('chapters')
  }
}
