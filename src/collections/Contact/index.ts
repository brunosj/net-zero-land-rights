import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { richTextField } from '@/fields/richTextField'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { getColorSelectOptions } from '@/config/colors'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
// import { revalidateDelete, revalidatePage } from '@/hooks/revalidatePage'

export const Contact: CollectionConfig = {
  slug: 'contact',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  labels: {
    singular: 'Contact',
    plural: 'Contact',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    meta: {
      title: 'Contact - Net Zero & Land Rights',
      description: 'Contact - Net Zero & Land Rights',
    },
    group: 'Pages',
  },
  // Limit to a single document
  hooks: {
    beforeValidate: [
      async ({ operation, req }) => {
        if (operation === 'create') {
          const existingDocs = await req.payload.find({
            collection: 'contact',
          })

          if (existingDocs.totalDocs > 0) {
            throw new Error('Only one contact document can exist')
          }
        }
      },
    ],
    // afterChange: [revalidatePage],
    // beforeChange: [populatePublishedAt],
    // afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Contact',
      required: true,
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'callToActionText',
              type: 'text',
              label: 'Call to Action Text',
            },
            richTextField('content', true),
          ],
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
      name: 'mainColor',
      type: 'select',
      options: getColorSelectOptions(),
      required: true,
      admin: {
        position: 'sidebar',
      },
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
  versions: {
    drafts: true,
    maxPerDoc: 10,
  },
}
