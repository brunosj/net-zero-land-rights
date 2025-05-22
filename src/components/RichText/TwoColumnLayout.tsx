import React from 'react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from './index'

interface TwoColumnLayoutProps {
  data: SerializedEditorState
  className?: string
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ data, className }) => {
  // Split the content into two parts
  const splitContent = React.useMemo(() => {
    if (!data?.root?.children) return { left: data, right: data }

    const children = [...data.root.children]
    const midPoint = Math.ceil(children.length / 2)

    const leftContent = {
      ...data,
      root: {
        ...data.root,
        children: children.slice(0, midPoint),
      },
    }

    const rightContent = {
      ...data,
      root: {
        ...data.root,
        children: children.slice(midPoint),
      },
    }

    return { left: leftContent, right: rightContent }
  }, [data])

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${className || ''}`}>
      <div className="prose md:prose-md dark:prose-invert">
        <RichText data={splitContent.left} />
      </div>
      <div className="prose md:prose-md dark:prose-invert">
        <RichText data={splitContent.right} />
      </div>
    </div>
  )
}
