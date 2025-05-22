'use client'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = (props) => {
  const data = useRowLabel<any>()

  const resourceType = data?.data?.resourceType
  const title = data?.data?.title

  const formatResourceType = (type: string) => {
    if (!type) return 'Resource'

    switch (type) {
      case 'webPage':
        return 'Web Page'
      case 'publication':
        return 'Publication'
      case 'video':
        return 'Video'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const label = title
    ? `${formatResourceType(resourceType)} ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${title}`
    : `Resource ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

  return <div>{label}</div>
}
