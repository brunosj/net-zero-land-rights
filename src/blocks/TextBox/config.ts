import type { Block } from 'payload'
import { getColorSelectOptions } from '@/config/colors'
import { richTextField } from '@/fields/richTextField'

export const TextBoxBlock: Block = {
  slug: 'textBox',
  interfaceName: 'TextBoxBlock',
  labels: {
    singular: 'Text Box',
    plural: 'Text Boxes',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'twoThirds',
          options: [
            {
              label: 'One Third',
              value: 'oneThird',
            },
            {
              label: 'Half',
              value: 'half',
            },
            {
              label: 'Two Thirds',
              value: 'twoThirds',
            },
            {
              label: 'Full',
              value: 'full',
            },
          ],
        },

        {
          name: 'backgroundColor',
          type: 'select',
          options: getColorSelectOptions(),
          required: true,
        },
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'single',
          options: [
            { label: 'Single Column', value: 'single' },
            { label: 'Two Columns', value: 'two-columns' },
          ],
        },
      ],
    },
    {
      name: 'leftColumn',
      type: 'richText',
    },
    {
      name: 'rightColumn',
      type: 'richText',
      admin: {
        condition: (_, { layout } = {}) => layout === 'two-columns',
      },
    },
  ],
}
