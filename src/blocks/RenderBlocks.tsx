import { cn } from 'src/utilities/cn'
import React, { Fragment } from 'react'

import type {
  MediaBlock,
  FigureBlock as FigureBlockType,
  BannerBlock as BannerBlockType,
  QuoteBlock as QuoteBlockType,
  TextBoxBlock as TextBoxBlockType,
  // Import any other block types you have
} from '@/payload-types'

import { MediaBlock as MediaBlockComponent } from '@/blocks/MediaBlock/Component'
import { FigureBlock } from '@/blocks/Figure/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { QuoteBlock } from '@/blocks/Quote/Component'
import { TextBoxBlock } from '@/blocks/TextBox/Component'

type CommonBlockProps = {
  color?: string
  figureNumber?: number
  figureId?: string
  chapterId?: string
  chapterTitle?: string
  chapterNumber?: number
}

type BlockTypes = MediaBlock | FigureBlockType | BannerBlockType | QuoteBlockType | TextBoxBlockType

const blockComponents: Record<string, React.ComponentType<any & CommonBlockProps>> = {
  // content: ContentBlock,
  mediaBlock: MediaBlockComponent,
  figureBlock: FigureBlock,
  bannerBlock: BannerBlock,
  quote: QuoteBlock,
  textBox: TextBoxBlock,
}

export const RenderBlocks: React.FC<{
  blocks: (BlockTypes & CommonBlockProps)[]
  color?: string
}> = (props) => {
  const { blocks, color } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  // Count figure blocks to maintain per-type ordering
  const figures = blocks.filter((block) => block.blockType === 'figureBlock')
  let figureMap = new Map()

  // If we have figures, create a map of their positions for consistent numbering
  if (figures.length > 0) {
    figures.forEach((fig, idx) => {
      // If the figure already has a number from rich text, use it
      // Otherwise, use its position in the figures array + 1
      const figNum = fig.figureNumber || idx + 1
      figureMap.set(fig, figNum)
    })
  }

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Get the figure number from our map if it's a figure block
              const figureNumber = blockType === 'figureBlock' ? figureMap.get(block) : undefined

              // Prepare props for the block component
              const blockProps = {
                ...block,
                color,
                // Only pass figureNumber if it's defined
                ...(figureNumber !== undefined ? { figureNumber } : {}),
                // Pass figureId if available
                ...(block.figureId ? { figureId: block.figureId } : {}),
                // Pass through any chapter information
                chapterId: block.chapterId,
                chapterTitle: block.chapterTitle,
                chapterNumber: block.chapterNumber,
              }

              return (
                <div className="" key={index}>
                  <Block {...blockProps} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
