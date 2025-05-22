'use client'

import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  RichText as RichTextBlock,
  LinkJSXConverter,
} from '@payloadcms/richtext-lexical/react'

// import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  MediaBlock as MediaBlockProps,
  FigureBlock as FigureBlockProps,
  QuoteBlock as QuoteBlockProps,
  TextBoxBlock as TextBoxBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { TextBoxBlock } from '@/blocks/TextBox/Component'
import { cn } from '@/utilities/cn'
import { useEffect, useMemo } from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<MediaBlockProps | BannerBlockProps | TextBoxBlockProps>

// Create an internalDocToHref function to handle internal links
const internalDocToHref = ({ linkNode }) => {
  const { relationTo, value } = linkNode.fields.doc || {}

  if (!value || !relationTo) return '#'

  // Get the slug - handle both string and object values
  const slug = typeof value === 'object' ? value.slug : value

  if (!slug) return '#'

  // Generate appropriate URLs based on collection type
  if (relationTo === 'homepage' || slug === 'home') {
    return '/'
  } else if (relationTo === 'chapters') {
    return `/chapters/${slug}`
  } else if (relationTo === 'media-center') {
    return `/media-center/${slug}`
  } else {
    return `/${slug}`
  }
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    textBox: ({ node }) => (
      <TextBoxBlock
        backgroundColor={node.fields.backgroundColor || 'light-blue'}
        layout={node.fields.layout || 'single'}
        size={node.fields.size || 'full'}
        leftColumn={node.fields.leftColumn as SerializedEditorState}
        rightColumn={node.fields.rightColumn as SerializedEditorState}
      />
    ),
    // code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
  },
})

// Create a converter that uses RenderBlocks for handling all blocks
const createRichTextWithBlocksConverters = (
  color?: string,
  chapterInfo?: { id?: string; title?: string; number?: number },
  figureNodes?: any[], // Pass the pre-extracted figure nodes
) => {
  // Return the converters with a properly configured conversion function
  return ({ defaultConverters }: { defaultConverters: any }) => {
    return {
      ...defaultConverters,
      ...LinkJSXConverter({ internalDocToHref }),
      blocks: {
        // Map each block to RenderBlocks so they render consistently
        bannerBlock: ({ node }) => (
          <RenderBlocks blocks={[{ ...node.fields, blockType: 'bannerBlock' }]} color={color} />
        ),
        mediaBlock: ({ node }) => (
          <RenderBlocks blocks={[{ ...node.fields, blockType: 'mediaBlock' }]} color={color} />
        ),
        textBlock: ({ node }) => (
          <RenderBlocks blocks={[{ ...node.fields, blockType: 'textBlock' }]} color={color} />
        ),
        textBox: ({ node }) => (
          <RenderBlocks blocks={[{ ...node.fields, blockType: 'textBox' }]} color={color} />
        ),
        figureBlock: ({ node }) => {
          // First try to match by ID if it exists
          let figureIndex = -1
          let figureId = node.fields?.id || ''

          if (figureId && figureNodes) {
            // Try to find by ID first
            figureIndex = figureNodes.findIndex((fig) => fig.id === figureId)
          }

          // If we couldn't find by ID, try matching by content
          if (figureIndex === -1 && figureNodes) {
            figureIndex = figureNodes.findIndex(
              (fig) =>
                // Compare node references or field values to find the matching figure
                fig.node === node ||
                (fig.node.fields?.media?.id === node.fields?.media?.id &&
                  fig.node.fields?.title === node.fields?.title),
            )

            // If we found a match by content, use its ID
            if (figureIndex !== -1) {
              figureId = figureNodes[figureIndex].id
            }
          }

          // Use the pre-calculated index, or default to a fallback (should never happen)
          const figureNumber =
            figureIndex !== -1 && figureNodes
              ? figureNodes[figureIndex].index // Use the index we calculated during extraction
              : 999 // Very clear error value

          // Create an enhanced block with chapter information and the correct figure ID
          const enhancedBlock = {
            ...node.fields,
            blockType: 'figureBlock',
            figureNumber,
            figureId, // Pass the ID we extracted or matched
            // Add chapter information if available
            chapterId: chapterInfo?.id,
            chapterTitle: chapterInfo?.title,
            chapterNumber: chapterInfo?.number,
          }

          return <RenderBlocks blocks={[enhancedBlock]} color={color} />
        },
        quote: ({ node }) => (
          <RenderBlocks blocks={[{ ...node.fields, blockType: 'quote' }]} color={color} />
        ),
      },
    }
  }
}

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = false, ...rest } = props
  return (
    <RichTextBlock
      converters={jsxConverters}
      className={cn(
        {
          'container ': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert text-black ': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}

type RichTextWithBlocksProps = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  color?: string
  chapterId?: string
  chapterTitle?: string
  chapterNumber?: number
} & React.HTMLAttributes<HTMLDivElement>

export function RichTextWithBlocks(props: RichTextWithBlocksProps) {
  const {
    className,
    enableProse = true,
    enableGutter = false,
    color,
    data,
    chapterId,
    chapterTitle,
    chapterNumber,
    ...rest
  } = props

  // Extract all figures from the rich text content and count them
  const figures = useMemo(() => {
    if (!data || !data.root) return []

    const extractedFigures: any[] = []
    let figureCounter = 0

    // Function to recursively extract figure blocks
    const extractFigures = (node: any) => {
      if (!node) return

      // Check if this is a figure block
      if (node.type === 'block' && node.fields?.blockType === 'figureBlock') {
        figureCounter++

        // Create a unique ID for this figure to help with matching later
        const figureId = `${chapterId || 'doc'}-fig-${figureCounter}`

        // Add an ID to the node fields for easier matching later
        if (!node.fields.id) {
          node.fields.id = figureId
        }

        extractedFigures.push({
          node,
          id: figureId,
          index: figureCounter,
          media: node.fields?.media,
          title: node.fields?.title,
          source: node.fields?.source,
        })
      }

      // Process node children
      if (Array.isArray(node)) {
        node.forEach(extractFigures)
      } else if (node.children) {
        if (Array.isArray(node.children)) {
          node.children.forEach(extractFigures)
        } else {
          extractFigures(node.children)
        }
      }
    }

    // Start extracting from root
    extractFigures(data.root)

    return extractedFigures
  }, [data, chapterId])

  // Pass chapter information to the RenderBlocks component
  const converters = useMemo(() => {
    return createRichTextWithBlocksConverters(
      color,
      {
        id: chapterId,
        title: chapterTitle,
        number: chapterNumber,
      },
      figures,
    )
  }, [color, chapterId, chapterTitle, chapterNumber, figures])

  return (
    <div className="gap-y-8 md:gap-x-8 space-y-8">
      <RichTextBlock
        converters={converters}
        className={cn('rich-text-with-blocks', className)}
        data={data}
        {...rest}
      />
    </div>
  )
}

export default RichText
