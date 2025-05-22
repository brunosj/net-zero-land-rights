export const getColumnWidthClass = (size: string | null | undefined) => {
  if (!size) return 'w-full'

  switch (size) {
    case 'half':
      return 'w-full  md:w-[calc(70%-1rem)] xl:w-[calc(60%-1rem)]'
    case 'oneThird':
      return 'w-full md:w-[calc(33.333%-1rem)] xl:w-[calc(33.333%-1rem)]'
    case 'twoThirds':
      return 'w-full md:w-[calc(86.666%-1rem)] xl:w-[calc(76.666%-1rem)]'
    case 'full':
    default:
      return 'w-full'
  }
}

export const getColumnAlignmentClass = (alignment: string | null | undefined) => {
  if (!alignment) return ''

  switch (alignment) {
    case 'right':
      return 'ml-auto'
    case 'center':
      return 'mx-auto'
    case 'left':
      return 'mr-auto'
    default:
      return 'mx-auto'
  }
}
