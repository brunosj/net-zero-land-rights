import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Collection = keyof Config['collections']

async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0]
}

async function getAllDocuments(collection: Collection, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const documents = await payload.find({
    collection,
    depth,
    limit: 100,
  })

  return documents.docs
}

/**
 * Returns document with the specified slug from the collection
 */
export const getCachedDocument = (collection: Collection, slug: string) =>
  getDocument(collection, slug)

/**
 * Returns all documents from the collection
 */
export const getCachedDocs = (collection: Collection) => getAllDocuments(collection)
