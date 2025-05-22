/**
 * Utility functions for handling links throughout the application
 */

/**
 * Converts chapter page links to homepage anchor links
 * @param link The original link object from CMS
 * @returns Modified link object or original if not a chapters link
 */
export const getModifiedLink = (link: any) => {
  // Check if this is a chapters link
  const isChaptersLink =
    typeof link.reference?.value === 'object' && link.reference?.value?.slug === 'chapters'

  // Return modified link if it's a chapters link, otherwise return original
  return isChaptersLink ? { ...link, type: 'custom' as const, url: '/#chapters' } : link
}

/**
 * Helper to scroll to element by ID
 * For use in client components
 */
export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
