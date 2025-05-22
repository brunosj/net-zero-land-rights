import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navItems',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 12,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
            },
            {
              name: 'legalLinks',
              type: 'array',
              fields: [
                link({
                  appearances: false,
                }),
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              fields: [
                {
                  name: 'address',
                  type: 'text',
                  defaultValue: 'Berlin, Germany',
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'contact@netzerolandrights.com',
                },
              ],
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'newsletterSection',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  defaultValue: 'Stay updated with our newsletter',
                },
                {
                  name: 'description',
                  type: 'text',
                  defaultValue:
                    'Subscribe to receive the latest updates on climate and land rights initiatives',
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  defaultValue: 'Subscribe',
                },
              ],
            },
          ],
        },
        {
          label: 'Socials',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Twitter', value: 'twitter' },
                    { label: 'Bluesky', value: 'bluesky' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Instagram', value: 'instagram' },
                  ],
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
