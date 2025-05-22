import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { link } from '@/fields/link'

export const KeyMessages: CollectionConfig<'key-messages'> = {
  slug: 'key-messages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description: 'Please add the chapter number',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    link({
      relationTo: ['chapters'],
      disableLabel: true,
      appearances: false,
      disableCustomURL: true,
      required: false,
    }),
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
  ],
  // hooks: {
  //   afterChange: [revalidateKeyMessage],
  //   beforeChange: [populatePublishedAt],
  //   beforeDelete: [revalidateDelete],
  // },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
