import Trees from '@/assets/trees_2.svg'
import { cn } from '@/utilities/cn'
import Image from 'next/image'

export const TreesIllustration = ({ className }: { className?: string }) => {
  return <Image src={Trees} alt="Trees" fill className={cn(className)} />
}

export default TreesIllustration
