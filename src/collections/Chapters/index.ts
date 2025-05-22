import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

import { revalidateDelete, revalidateChapter } from './hooks/revalidateChapter'
import { getColorSelectOptions } from '@/config/colors'
import { richTextFieldWithBlocks } from '@/fields/richTextFieldBlocks'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { FigureBlock } from '@/blocks/Figure/config'

export const Chapters: CollectionConfig<'chapters'> = {
  slug: 'chapters',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // livePreview: {
    //   url: ({ data }) => {
    //     const path = generatePreviewPath({
    //       slug: typeof data?.slug === 'string' ? data.slug : '',
    //       collection: 'chapters',
    //       // req, TODO: thread `req` once 3.5.1 is out, see notes in `generatePreviewPath`
    //     })

    //     return path
    //   },
    // },
    // preview: (data, { req }) =>
    //   generatePreviewPath({
    //     slug: typeof data?.slug === 'string' ? data.slug : '',
    //     collection: 'chapters',
    //     req,
    //   }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              type: 'array',
              name: 'authors',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'organization',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  required: false,
                },
              ],
            },
            {
              name: 'keyMessage',
              type: 'relationship',
              relationTo: 'key-messages',
              hasMany: false,
              required: false,
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
          label: 'Hero',
        },

        {
          label: 'Content Blocks',
          fields: [richTextFieldWithBlocks('content', true, true)],
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },

    // Sidebar fields
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'chapterNumber',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
      unique: true,
    },
    {
      name: 'mainColor',
      type: 'select',
      options: getColorSelectOptions(),
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    // {
    //   name: 'keywords',
    //   type: 'text',
    //   hasMany: true,
    //   admin: {
    //     position: 'sidebar',
    //   },
    // },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateChapter],
    // afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
