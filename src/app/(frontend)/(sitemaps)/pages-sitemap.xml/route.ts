import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'

async function getPagesSitemap() {
  const payload = await getPayload({ config })
  const SITE_URL =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://example.com'

  const results = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      _status: {
        equals: 'published',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const dateFallback = new Date().toISOString()

  const defaultSitemap = [
    {
      loc: `${SITE_URL}/search`,
      lastmod: dateFallback,
    },
  ]

  const sitemap = results.docs
    ? results.docs
        .filter((page) => Boolean(page?.slug))
        .map((page) => {
          return {
            loc: page?.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
            lastmod: page.updatedAt || dateFallback,
          }
        })
    : []

  return [...defaultSitemap, ...sitemap]
}

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
