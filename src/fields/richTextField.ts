import { Field } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'

export const richTextField = (
  name: string = 'richText',
  label: boolean = true,
  required: boolean = false,
): Field => ({
  name,
  type: 'richText',
  editor: lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures,
        HeadingFeature(),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: [
            'pages',
            'homepage',
            'about',
            'chapters',
            'contact',
            'chapters-page',
            'resources',
            'media-center',
            'newsletter',
          ],
        }),
      ]
    },
  }),
  label: label ? name.charAt(0).toUpperCase() + name.slice(1) : false,
  required,
})
