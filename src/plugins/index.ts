import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Chapter } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Chapter | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Net Zero & Land RIghts` : 'Net Zero & Land RIghts'
}

const generateURL: GenerateURL<Chapter | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  // redirectsPlugin({
  //   collections: ['pages', 'chapters'],
  //   overrides: {
  //     // @ts-expect-error
  //     fields: ({ defaultFields }) => {
  //       return defaultFields.map((field) => {
  //         if ('name' in field && field.name === 'from') {
  //           return {
  //             ...field,
  //             admin: {
  //               description: 'You will need to rebuild the website when changing this field.',
  //             },
  //           }
  //         }
  //         return field
  //       })
  //     },
  //     hooks: {
  //       afterChange: [revalidateRedirects],
  //     },
  //   },
  // }),
  // nestedDocsPlugin({
  //   collections: ['chapters', 'contact', 'chapters-page', 'about'],
  // }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),

  // searchPlugin({
  //   collections: ['chapters'],
  //   beforeSync: beforeSyncWithSearch,
  //   searchOverrides: {
  //     fields: ({ defaultFields }) => {
  //       return [...defaultFields, ...searchFields]
  //     },
  //   },
  // }),
  // payloadCloudPlugin(),
]
