import { Field } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
  BlocksFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { QuoteBlock } from '@/blocks/Quote/config'
import { Banner } from '@/blocks/Banner/config'
import { FigureBlock } from '@/blocks/Figure/config'
import { TextBoxBlock } from '@/blocks/TextBox/config'

export const richTextFieldWithBlocks = (
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
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
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
        BlocksFeature({
          blocks: [FigureBlock, MediaBlock, Banner, QuoteBlock, TextBoxBlock],
        }),
      ]
    },
  }),
  label: label ? name.charAt(0).toUpperCase() + name.slice(1) : false,
  required,
})
