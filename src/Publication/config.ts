import type { GlobalConfig } from 'payload'

import { revalidatePublication } from './hooks/revalidatePublication'

export const Publication: GlobalConfig = {
  slug: 'publication',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidatePublication],
  },
}
