import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateHome } from './hooks/revalidateHome'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { link } from '@/fields/link'

export const Homepage: CollectionConfig = {
  slug: 'homepage',
  labels: {
    singular: 'Home',
    plural: 'Home',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Pages',
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
          label: 'Content',
          fields: [
            {
              name: 'heroSection',
              label: 'Hero Section',
              type: 'group',
              fields: [
                {
                  name: 'heroTitle',
                  label: 'Hero Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'heroSubtitle',
                  type: 'textarea',
                  label: 'Hero Subtitle',
                  required: true,
                },
              ],
            },
            {
              name: 'aboutSection',
              label: 'About Section',
              type: 'group',
              fields: [
                {
                  name: 'aboutTitle',
                  label: 'About Title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'aboutContent',
                  type: 'textarea',
                  label: 'About Content',
                  required: true,
                },
                {
                  name: 'publicationDownloadTitle',
                  label: 'Publication Download Title',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'The publication is automatically linked from the "Publication" Global in Sidebar',
                  },
                },
                {
                  name: 'pressReleaseDownloadTitle',
                  label: 'Press Release Download Title',
                  type: 'text',
                },
                {
                  name: 'pressReleaseLink',
                  label: 'Press Release Link',
                  type: 'group',
                  admin: {
                    description: 'Either add a link to a page or upload/reference a document',
                  },
                  fields: [
                    {
                      name: 'type',
                      label: 'Type',
                      type: 'radio',
                      options: ['Page', 'Document'],
                    },
                    {
                      name: 'buttonText',
                      label: 'Button Text',
                      type: 'text',
                      required: true,
                    },
                    link({
                      appearances: false,
                      disableLabel: true,
                      overrides: {
                        admin: {
                          condition: (_, siblingData) => siblingData?.type === 'Page',
                        },
                      },
                    }),
                    {
                      name: 'pressReleaseDownload',
                      label: 'Press Release Download',
                      type: 'upload',
                      relationTo: 'media',
                      admin: {
                        condition: (_, siblingData) => siblingData?.type === 'Document',
                      },
                    },
                  ],
                },
              ],
            },

            {
              name: 'keyMessagesSection',
              label: 'Key Messages Section',
              type: 'group',
              fields: [
                {
                  name: 'keyMessagesHeading',
                  label: 'Heading',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'keyMessages',
                  type: 'relationship',
                  relationTo: 'key-messages',
                  required: false,
                  label: 'Key Messages',
                  hasMany: true,
                },
              ],
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
              hasGenerateFn: true,
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
    afterChange: [revalidateHome],
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
