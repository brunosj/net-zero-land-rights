import type { Metadata } from 'next'

import type { Media, Page, Config, Chapter, MediaItem } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  // Default fallback image
  let url = serverUrl + '/og-image.jpg'

  // Try to get image from meta
  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Chapter> | Partial<MediaItem>
  collection?: string
}): Promise<Metadata> => {
  const { doc, collection } = args || {}

  // Get the server URL for absolute URLs
  const serverUrl = getServerSideURL()

  // Get the OG image URL
  const ogImage = getImageURL(doc?.meta?.image)

  // Generate title with fallback
  const title = doc?.meta?.title ? `${doc.meta.title}` : 'Net Zero & Land Rights'

  // Generate description with fallback
  const description =
    doc?.meta?.description || "How our climate goals drive land demand and shape people's lives"

  // Generate URL based on collection type
  let url = serverUrl

  if (doc?.slug) {
    // Check if it's a Chapter (has chapterNumber property)
    if ('chapterNumber' in doc) {
      url = `${serverUrl}/chapters/${doc.slug}`
    }
    // Check if it's a Media Item (has type property with specific values)
    else if (
      'type' in doc &&
      (doc.type === 'Press Release' ||
        doc.type === 'News Article' ||
        doc.type === 'Blog Post' ||
        doc.type === 'Report')
    ) {
      url = `${serverUrl}/media-center/${doc.slug}`
    }
    // For collections where the path can be determined by the collection name
    else if (collection) {
      url = `${serverUrl}/${collection}/${doc.slug}`
    }
    // Default case for pages or other collections
    else if (Array.isArray(doc.slug)) {
      url = `${serverUrl}/${doc.slug.join('/')}`
    } else {
      url = `${serverUrl}/${doc.slug}`
    }
  }

  return {
    metadataBase: new URL(serverUrl),
    title,
    description,
    openGraph: mergeOpenGraph({
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
      title,
      url,
      type: 'website',
      siteName: 'Net Zero & Land Rights',
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}
