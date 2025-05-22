import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'How our climate goals drive land demand and shape people’s lives',
  images: [
    {
      url: `${getServerSideURL()}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Net Zero & Land Rights',
    },
  ],
  siteName: 'Net Zero & Land Rights',
  title: 'Net Zero & Land Rights',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  if (!og) {
    return defaultOpenGraph
  }

  return {
    ...defaultOpenGraph,
    ...og,
    images: Array.isArray(og.images) && og.images.length > 0 ? og.images : defaultOpenGraph.images,
  }
}
