import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateFooter: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    // Revalidate the global tag
    revalidateTag('global_footer')

    // Revalidate layout components on all pages
    revalidatePath('/', 'layout')
  }

  return doc
}
