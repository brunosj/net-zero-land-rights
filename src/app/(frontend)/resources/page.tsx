import type { Metadata } from 'next'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { generateMeta } from '@/utilities/generateMeta'
import ResourcesPageClient from './page.client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const resources = await fetchResources()
  if (!resources) {
    return {
      title: 'Resources | Net Zero & Land Rights',
    }
  }

  return generateMeta({ doc: resources || {} })
}

export default async function ResourcesPage() {
  const resources = await fetchResources()
  const figures = await fetchAllFigures(resources)

  if (!resources) return notFound()

  return (
    <>
      <ResourcesPageClient resources={resources} figures={figures} />
    </>
  )
}

async function fetchResources() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  try {
    const resourcesResults = await payload.find({
      collection: 'resources',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      depth: 2,
    })

    if (!resourcesResults.docs.length) return null
    return resourcesResults.docs[0]
  } catch (error) {
    console.error('Error fetching resources:', error)
    return null
  }
}

async function fetchAllFigures(resources: any) {
  if (!resources) return []

  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  let chapterIds: string[] = []

  // If showing all figures, get all chapters
  if (resources.showAllFigures) {
    const allChaptersResult = await payload.find({
      collection: 'chapters',
      draft,
      limit: 100,
      pagination: false,
    })

    chapterIds = allChaptersResult.docs.map((chapter) => chapter.id)
  }
  // Otherwise, use selected chapters
  else if (resources.selectedChapters && resources.selectedChapters.length > 0) {
    // Handle IDs if they're returned as relationship objects
    chapterIds = resources.selectedChapters.map((chapter: any) =>
      typeof chapter === 'string' ? chapter : chapter.id,
    )
  }

  // If no chapters selected, return empty array
  if (chapterIds.length === 0) return []

  // Fetch all the chapters with their content
  const chaptersWithContent = await Promise.all(
    chapterIds.map(async (id) => {
      const chapter = await payload.findByID({
        collection: 'chapters',
        id,
        draft,
        depth: 2, // To get nested media/file data
      })

      return chapter
    }),
  )

  // Extract all figure blocks from each chapter
  const allFigures: any[] = []
  let figureCounter = 1

  chaptersWithContent.forEach((chapter) => {
    // Process rich text content
    if (chapter?.content) {
      let richTextFigureCounter = 1

      // Find figure blocks in the rich text content
      try {
        // Parse the rich text content
        const richTextContent =
          typeof chapter.content === 'string' ? JSON.parse(chapter.content) : chapter.content

        // Look for figure blocks in the nodes
        const extractFiguresFromNodes = (nodes: any[]) => {
          if (!Array.isArray(nodes)) return

          nodes.forEach((node: any, nodeIndex: number) => {
            // Check if this is a figure block
            if (
              node.type === 'block' &&
              node.fields &&
              node.fields.blockType === 'figureBlock' &&
              node.fields.media
            ) {
              // Create a unique ID
              const figureId = `${chapter.id}-content-figure-${nodeIndex}`

              // Add the figure with chapter context
              allFigures.push({
                id: figureId,
                figureBlock: {
                  ...node.fields,
                  figureNumber: richTextFigureCounter,
                },
                figureNumber: figureCounter++,
                chapterId: chapter.id,
                chapterTitle: chapter.title,
                chapterNumber: chapter.chapterNumber,
                chapterSlug: chapter.slug,
              })

              richTextFigureCounter++
            }

            // Recursively check children
            if (node.children) {
              extractFiguresFromNodes(node.children)
            }
          })
        }

        // Process the root nodes
        if (richTextContent.root && richTextContent.root.children) {
          extractFiguresFromNodes(richTextContent.root.children)
        }
      } catch (error) {
        console.error('Error parsing rich text content:', error)
      }
    }
  })

  // Sort figures by chapter number, then by figure position within chapter
  return allFigures.sort((a, b) => {
    if (a.chapterNumber !== b.chapterNumber) {
      return a.chapterNumber - b.chapterNumber
    }
    return a.figureNumber - b.figureNumber
  })
}
