import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePublication: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating publication`)

    // Revalidate the global tag
    revalidateTag('global_publication')

    // Revalidate layout components on all pages
    revalidatePath('/', 'layout')
  }

  return doc
}
