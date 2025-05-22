import type { CollectionSlug, Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  disableCustomURL?: boolean
  overrides?: Record<string, unknown>
  relationTo?: string[]
  required?: boolean
}) => Field

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  disableCustomURL = false,
  overrides = {},
  relationTo = [
    'homepage',
    'about',
    'contact',
    'chapters-page',
    'pages',
    'resources',
    'media-center',
    'newsletter',
    'chapters',
    'media-items',
  ],
  required = true,
} = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          ...(!disableCustomURL
            ? [
                {
                  name: 'type',
                  type: 'radio' as const,
                  admin: {
                    layout: 'horizontal' as const,
                    width: '50%',
                  },
                  defaultValue: 'reference',
                  options: [
                    {
                      label: 'Internal link',
                      value: 'reference',
                    },
                    {
                      label: 'Custom URL',
                      value: 'custom',
                    },
                  ],
                },
                {
                  name: 'newTab',
                  type: 'checkbox' as const,
                  admin: {
                    style: {
                      alignSelf: 'flex-end',
                    },
                    width: '50%',
                  },
                  label: 'Open in new tab',
                },
              ]
            : []),
        ],
      },
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship' as const,
      admin: {
        condition: (_, siblingData) => {
          return disableCustomURL || siblingData?.type === 'reference'
        },
      },
      label: 'Entry to link to',
      relationTo: relationTo as CollectionSlug[],
      required,
    },
    ...(!disableCustomURL
      ? [
          {
            name: 'url',
            type: 'text' as const,
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'custom',
            },
            label: 'Custom URL',
            required,
          },
        ]
      : []),
  ]

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
