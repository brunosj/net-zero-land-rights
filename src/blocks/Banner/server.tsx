import { BannerBlock as BannerBlockProps } from '@/payload-types'
import { BannerBlock } from './Component'
import { ExtendedColorKey } from '@/config/colors'

// Define our extended props type to include any additional properties we need
type Props = BannerBlockProps & {
  className?: string
  color?: ExtendedColorKey
  externalLink?: string | null
  date?: string | null
}

export async function BannerBlockServer(props: Props) {
  // No need to fetch publication here as it's now available via context
  return (
    <BannerBlock {...props} size={props.size || 'full'} alignment={props.alignment || 'center'} />
  )
}
