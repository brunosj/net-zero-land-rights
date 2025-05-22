import type { Block } from 'payload'

export const MediaBannerBlock: Block = {
  slug: 'mediaBannerBlock',
  interfaceName: 'MediaBannerBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
