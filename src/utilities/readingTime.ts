import type { Chapter } from '@/payload-types'

/**
 * Calculates the estimated reading time for chapter content
 * @param chapter The chapter data
 * @returns Reading time in minutes
 */
export const calculateReadingTime = (chapter?: Chapter): number => {
  if (!chapter || !chapter.content) return 0

  // Average reading speed (words per minute)
  const WPM = 200

  // Count words in rich text content
  let wordCount = 0

  try {
    // Parse the rich text content
    const richTextContent =
      typeof chapter.content === 'string' ? JSON.parse(chapter.content) : chapter.content

    // Extract all text from rich text content
    const textContent = JSON.stringify(richTextContent)

    // Count words by splitting on whitespace
    const words = textContent.match(/\b\w+\b/g) || []
    wordCount = words.length

    // Adjust word count - the stringify method can overcount due to JSON structure
    // Typical adjustment factor based on testing
    wordCount = Math.floor(wordCount * 0.6)
  } catch (error) {
    console.error('Error calculating reading time:', error)
  }

  // Calculate reading time in minutes
  const readingTime = Math.ceil(wordCount / WPM)

  // Return at least 1 minute
  return Math.max(1, readingTime)
}
