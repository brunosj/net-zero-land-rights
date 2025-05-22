import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { slugField } from '@/fields/slug'
import { richTextFieldWithBlocks } from '@/fields/richTextFieldBlocks'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const MediaItems: CollectionConfig = {
  slug: 'media-items',
  labels: {
    singular: 'Media Center Item',
    plural: 'Media Center Items',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'type', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'textarea',
      required: true,
    },

    {
      name: 'releaseDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Press Release', value: 'Press Release' },
        { label: 'News Article', value: 'News Article' },
        { label: 'Blog Post', value: 'Blog Post' },
        { label: 'Report', value: 'Report' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    {
      type: 'tabs',
      tabs: [
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    beforeDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
