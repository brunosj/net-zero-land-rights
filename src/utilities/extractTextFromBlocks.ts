import type { Chapter } from '@/payload-types'

// Define a type for block structures that might contain rich text
type BlockWithRichText = { [key: string]: any; children?: BlockWithRichText[] }

// Recursively extracts text nodes from Payload rich text structure (like Slate or Lexical)
function extractText(nodes: any[] | undefined): string {
  let text = ''
  if (!Array.isArray(nodes)) return text

  for (const node of nodes) {
    if (node.text) {
      text += node.text + ' '
    } else if (node.children) {
      text += extractText(node.children)
    }
  }
  return text
}

/**
 * Extracts and truncates text from lexical content structure
 * Works with both chapter.content and the old chapter.layout
 */
export function extractTextFromBlocks(content: any, maxLength: number = 150): string {
  if (!content) return ''

  let combinedText = ''

  // Case 1: It's a lexical content structure with root.children
  if (content.root && Array.isArray(content.root.children)) {
    combinedText = extractText(content.root.children)
  }
  // Case 2: It's the old layout structure with blocks array
  else if (Array.isArray(content)) {
    for (const block of content) {
      // Check inside 'contentColumns' blocks
      if (block.blockType === 'contentColumns' && Array.isArray(block.columns)) {
        for (const column of block.columns) {
          // Extract text from richText
          if (column?.richText) {
            combinedText += extractText(column.richText?.root?.children)
          }
        }
      }

      if (combinedText.length >= maxLength) break
    }
  }

  // Clean up extra spaces and truncate
  let cleanedText = combinedText.replace(/\s+/g, ' ').trim()
  if (cleanedText.length > maxLength) {
    cleanedText = cleanedText.substring(0, maxLength).trim() + '...'
  }

  return cleanedText
}
