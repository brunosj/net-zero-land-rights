import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { richTextField } from '@/fields/richTextField'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateResources, revalidateDelete } from './hooks/revalidatePage'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
// import { revalidateDelete, revalidatePage } from '@/hooks/revalidatePage'

export const Resources: CollectionConfig = {
  slug: 'resources',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  labels: {
    singular: 'Resources',
    plural: 'Resources',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    meta: {
      title: 'Resources - Net Zero & Land Rights',
      description: 'Resources - Net Zero & Land Rights',
    },
    group: 'Pages',
  },
  // Limit to a single document
  hooks: {
    beforeValidate: [
      async ({ operation, req }) => {
        if (operation === 'create') {
          const existingDocs = await req.payload.find({
            collection: 'resources',
          })

          if (existingDocs.totalDocs > 0) {
            throw new Error('Only one resources document can exist')
          }
        }
      },
    ],
    afterChange: [revalidateResources],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Resources',
      required: true,
    },

    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            // {
            //   name: 'heroTitle',
            //   type: 'text',
            //   label: 'Hero Title',
            // },
            richTextField('heroText', false),
            {
              name: 'publicationDownloadButtonText',
              type: 'text',
              label: 'Publication Download Button Text',
              defaultValue: 'Download Net Zero & Land Rights Report',
            },
          ],
        },

        {
          label: 'Additional Resources',
          fields: [
            {
              name: 'additionalResources',
              type: 'array',
              label: 'Additional Resources',
              // admin: {
              //   initCollapsed: true,
              //   components: {
              //     RowLabel: '@/collections/Resources/RowLabel#RowLabel',
              //   },
              // },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'chapter',
                  type: 'relationship',
                  relationTo: 'chapters',
                  hasMany: false,
                  admin: {
                    description: 'Link this resource to a specific chapter (optional)',
                  },
                },
                {
                  name: 'resourceType',
                  type: 'select',
                  options: [
                    { label: 'Web Page', value: 'webPage' },
                    { label: 'Publication', value: 'publication' },
                    { label: 'Video', value: 'video' },
                  ],
                  defaultValue: 'webPage',
                  required: true,
                },
                richTextField('description', true),
                {
                  name: 'thumbnail',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  admin: {
                    description: 'Thumbnail for the video (landscape aspect ratio 16:9)',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) =>
                      siblingData?.resourceType === 'webPage' ||
                      siblingData?.resourceType === 'video',
                    description: 'URL to the web page or video',
                  },
                },
                {
                  name: 'authors',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.resourceType === 'publication',
                    description: 'Authors of the publication',
                  },
                },
                {
                  name: 'publicationUrl',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.resourceType === 'publication',
                    description: 'URL to the publication (preferred over file upload)',
                  },
                },
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.resourceType === 'publication',
                    description: 'Upload the publication file (optional if URL is provided)',
                  },
                },
              ],
            },
          ],
        },

        {
          label: 'Figures',
          fields: [
            // {
            //   name: 'figuresTitle',
            //   type: 'text',
            //   label: 'Figures Section Title',
            //   defaultValue: 'Figures from Chapters',
            // },
            // richTextField('figuresDescription', false),
            {
              name: 'showAllFigures',
              type: 'checkbox',
              label: 'Show all figures from chapters',
              defaultValue: true,
            },
            {
              name: 'selectedChapters',
              type: 'relationship',
              relationTo: 'chapters',
              hasMany: true,
              admin: {
                condition: (data) => !data?.showAllFigures,
              },
            },
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
