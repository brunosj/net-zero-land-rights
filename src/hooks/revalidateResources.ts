import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'default_secret_change_me'

// Helper function to call the revalidation endpoint
const callRevalidateEndpoint = async (tag: string, payload: any) => {
  try {
    const url = `${NEXT_PUBLIC_SERVER_URL}/api/revalidate?secret=${REVALIDATE_SECRET}&tag=${tag}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      payload.logger.error(
        `Error revalidating tag ${tag}: ${response.status} ${response.statusText}`,
      )
    } else {
      payload.logger.info(`Successfully revalidated tag: ${tag}`)
    }
  } catch (error) {
    payload.logger.error(`Failed to call revalidation endpoint for tag ${tag}: ${error}`)
  }
}

export const revalidateResources: CollectionAfterChangeHook = async ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating resources`)
    await callRevalidateEndpoint('resources', payload)
  }

  return doc
}

export const revalidateResourcesDelete: CollectionAfterDeleteHook = async ({
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating resources after delete`)
    await callRevalidateEndpoint('resources', payload)
  }
}
