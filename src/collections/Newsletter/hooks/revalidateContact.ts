import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateContact: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      payload.logger.info('Revalidating contact page')
      revalidatePath('/contact')
      revalidateTag('contact')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook = ({ req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath('/about')
    revalidateTag('about')
  }
}
