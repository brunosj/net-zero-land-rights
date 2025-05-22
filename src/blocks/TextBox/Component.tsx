import React from 'react'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { getTextColorDirect } from '@/config/colors'
import { cn } from '@/utilities/cn'
import { motion } from 'motion/react'
import { getColumnWidthClass } from '@/utilities/getColumnWidthClass'

interface TextBoxProps {
  leftColumn: SerializedEditorState
  rightColumn?: SerializedEditorState
  backgroundColor: string
  layout: 'single' | 'two-columns'
  size: 'oneThird' | 'half' | 'twoThirds' | 'full'
}

export const TextBoxBlock: React.FC<TextBoxProps> = (props) => {
  const { leftColumn, rightColumn, backgroundColor, layout, size } = props
  const textColor = getTextColorDirect(backgroundColor)
  const columnWidthClass = getColumnWidthClass(size)

  return (
    <div className={cn('relative overflow-hidden mx-auto', columnWidthClass)}>
      {/* Background gradient and decorative elements */}
      <div className={`absolute inset-0 bg-${backgroundColor}/10 backdrop-blur-[2px] z-0`}></div>
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-${backgroundColor} via-${backgroundColor}/60 to-${backgroundColor}/20`}
      ></div>
      <div
        className={`absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-${backgroundColor}/20 blur-xl`}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 text-${textColor}`}
      >
        <div className="p-8">
          {layout === 'two-columns' && rightColumn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className=" medium-text">
                <RichText data={leftColumn} enableProse={false} />
              </div>
              <div className=" medium-text ">
                <RichText data={rightColumn} enableProse={false} />
              </div>
            </div>
          ) : (
            <div className="medium-text">
              <RichText data={leftColumn} enableProse={false} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
