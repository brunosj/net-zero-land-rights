import type { Block } from 'payload'

export const Banner: Block = {
  slug: 'bannerBlock',
  labels: {
    singular: 'Banner Block',
    plural: 'Banner Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'half',
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
          admin: {
            width: '50%',
          },
        },
        {
          name: 'alignment',
          type: 'select',
          defaultValue: 'center',
          options: [
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'bannerType',
      type: 'select',
      defaultValue: 'download',
      options: [
        { label: 'Download Publication', value: 'download' },
        { label: 'Press Release', value: 'pressRelease' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
      required: true,
      admin: {
        description: 'Select the type of banner to display',
      },
    },
    // {
    //   name: 'backgroundColor',
    //   type: 'select',
    //   options: getColorSelectOptions(),
    //   required: true,
    //   defaultValue: 'petrol',
    //   admin: {
    //     description: 'Select the background color for the banner',
    //   },
    // },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Title for the banner',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value

            // Set default value based on bannerType if no value provided
            switch (data?.bannerType) {
              case 'download':
                return 'Explore the full publication here'
              case 'pressRelease':
                return 'Read the press release'
              case 'newsletter':
                return 'Subscribe to our newsletter'
              default:
                return ''
            }
          },
        ],
      },
    },
    // richTextField('content'),
    // Download-specific fields
    // {
    //   name: 'downloadFile',
    //   type: 'upload',
    //   relationTo: 'media',
    //   admin: {
    //     condition: (_, { bannerType } = {}) => bannerType === 'download',
    //     description: 'The publication file to download',
    //   },
    // },

    // Press Release specific fields
    {
      name: 'date',
      type: 'date',
      admin: {
        condition: (_, { bannerType } = {}) => bannerType === 'pressRelease',
        description: 'Date of the press release',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'externalLink',
      type: 'text',
      admin: {
        condition: (_, { bannerType } = {}) => bannerType === 'pressRelease',
        description: 'External link (for press release)',
      },
    },
    // Newsletter specific fields
    // {
    //   name: 'formEmbed',
    //   type: 'textarea',
    //   admin: {
    //     condition: (_, { bannerType } = {}) => bannerType === 'newsletter',
    //     description: 'Embed code for newsletter signup form (optional)',
    //   },
    // },
    // Common fields for all types
    {
      name: 'buttonText',
      type: 'text',
      required: true,
      admin: {
        description: 'Text to display on the button',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value

            // Set default value based on bannerType if no value provided
            switch (data?.bannerType) {
              case 'download':
                return 'Download'
              case 'pressRelease':
                return 'Read'
              case 'newsletter':
                return 'Subscribe'
              default:
                return ''
            }
          },
        ],
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional image to display in the banner',
      },
    },
  ],
  interfaceName: 'BannerBlock',
}
