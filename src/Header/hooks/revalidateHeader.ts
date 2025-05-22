import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    // Revalidate the global tag
    revalidateTag('global_header')

    // Revalidate layout components on all pages
    revalidatePath('/', 'layout')
  }

  return doc
}
