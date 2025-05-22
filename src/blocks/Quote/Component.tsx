'use client'
import React from 'react'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from 'src/utilities/cn'
import { getTextColorForWhiteBackground } from '@/utilities/getTextColor'
import { getColumnWidthClass, getColumnAlignmentClass } from '@/utilities/getColumnWidthClass'

interface QuoteBlockProps {
  richText: SerializedEditorState
  color: string
  size?: string
  alignment?: string
}

export const QuoteBlock: React.FC<QuoteBlockProps> = (props) => {
  const { richText, color, size = 'full', alignment = 'left' } = props

  const columnWidthClass = getColumnWidthClass(size)
  const columnAlignmentClass = getColumnAlignmentClass(alignment)

  return (
    <div className="my-8 lg:my-12">
      <div className="gap-y-8 md:gap-x-8 space-y-8">
        <div className={cn(columnWidthClass, columnAlignmentClass, 'box-border mx-auto')}>
          <div className={cn(' px-6 lg:px-8  border-l-4', `border-${color}/50`)}>
            {richText && (
              <RichText
                data={richText}
                enableGutter={false}
                className={cn(
                  `text-xl font-medium italic text-${getTextColorForWhiteBackground(color)}`,
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
