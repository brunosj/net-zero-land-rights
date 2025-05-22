import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { ZipWriter, BlobWriter, Uint8ArrayReader } from '@zip.js/zip.js'

// Maximum time to wait for each figure processing (10 seconds)
const FIGURE_TIMEOUT = 10000
const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { figures } = await request.json()

    if (!figures || !Array.isArray(figures) || figures.length === 0) {
      return NextResponse.json({ error: 'No figures provided' }, { status: 400 })
    }

    // Create a new ZIP file
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'), { bufferedWrite: true })

    // Fetch options to handle CORS and other production issues
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 NextJS Server',
        Accept: 'image/svg+xml,image/*,*/*',
      },
      cache: 'no-store' as RequestCache,
    }

    // Function to ensure URL is absolute
    const ensureAbsoluteUrl = (url: string): string => {
      if (url.startsWith('http')) {
        return url
      }
      return `${NEXT_PUBLIC_SERVER_URL}${url.startsWith('/') ? url : `/${url}`}`
    }

    // Process each figure with timeout
    for (const [index, figure] of figures.entries()) {
      try {
        // Create a unique filename with chapter number if available
        const chapterPart = figure.chapterNumber ? `chapter-${figure.chapterNumber}-` : ''
        const filename = `${chapterPart}figure-${figure.figureNumber || index + 1}-${figure.title?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'untitled'}`

        // For SVG files, include both SVG and PNG versions
        if (figure.type === 'svg' && figure.svgUrl) {
          // Ensure SVG URL is absolute
          const fullSvgUrl = ensureAbsoluteUrl(figure.svgUrl)

          // Download original SVG with timeout
          let svgResponse
          let svgResponseForPng
          try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), FIGURE_TIMEOUT)

            svgResponse = await fetch(fullSvgUrl, {
              ...fetchOptions,
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!svgResponse.ok) {
              console.error(
                `Failed to fetch SVG for ${filename}: ${svgResponse.status} ${svgResponse.statusText}`,
              )
              continue
            }

            // Clone the response immediately before consuming it
            svgResponseForPng = svgResponse.clone()
          } catch (fetchError) {
            console.error(`Network error fetching SVG for ${filename}:`, fetchError)
            continue
          }

          // Add SVG to zip
          try {
            const svgBuffer = await svgResponse.arrayBuffer()
            if (svgBuffer.byteLength === 0) {
              console.error(`Empty SVG response for ${filename}`)
              continue
            }
            await zipWriter.add(`${filename}.svg`, new Uint8ArrayReader(new Uint8Array(svgBuffer)))
          } catch (svgError) {
            console.error(`Error processing SVG for ${filename}:`, svgError)
            // Continue with PNG version even if SVG fails
          }

          // Also convert and include PNG version
          try {
            // Use the cloned response for PNG conversion
            const svgBuffer = await svgResponseForPng.arrayBuffer()
            const pngBuffer = await sharp(Buffer.from(svgBuffer), {
              density: 300,
            })
              .resize({
                width: 2000,
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 },
                withoutEnlargement: false,
              })
              .png({
                quality: 100,
                compressionLevel: 6,
                adaptiveFiltering: true,
                palette: false,
              })
              .toBuffer()

            await zipWriter.add(`${filename}.png`, new Uint8ArrayReader(new Uint8Array(pngBuffer)))
          } catch (pngError) {
            console.error(`Error converting SVG to PNG for ${filename}:`, pngError)
            // Continue with the next figure if PNG conversion fails
          }
        } else {
          // For regular images, just include them as-is with timeout
          try {
            // Ensure image URL is absolute
            const fullImageUrl = ensureAbsoluteUrl(figure.src)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), FIGURE_TIMEOUT)

            const response = await fetch(fullImageUrl, {
              ...fetchOptions,
              signal: controller.signal,
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
              console.error(
                `Failed to fetch image for ${filename}: ${response.status} ${response.statusText}`,
              )
              continue
            }

            const imageBuffer = await response.arrayBuffer()

            // Determine extension - use PNG for images unless they have a specific extension
            const extension =
              figure.type === 'svg'
                ? 'svg'
                : figure.src.match(/\.(jpe?g|png|gif)$/i)?.[1]?.toLowerCase() || 'png'

            await zipWriter.add(
              `${filename}.${extension}`,
              new Uint8ArrayReader(new Uint8Array(imageBuffer)),
            )
          } catch (imgError) {
            console.error(`Error processing image for ${filename}:`, imgError)
            continue
          }
        }
      } catch (figureError) {
        console.error(`Error processing figure ${figure.figureNumber}:`, figureError)
        // Continue with next figure
      }
    }

    // Close the zip and get the blob
    const zipBlob = await zipWriter.close()

    // Convert Blob to Buffer for NextResponse
    const zipArrayBuffer = await zipBlob.arrayBuffer()
    const zipBuffer = Buffer.from(zipArrayBuffer)

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="net-zero-land-rights_figures.zip"',
        'Cache-Control': 'private, no-cache, no-store',
      },
    })
  } catch (error) {
    console.error('Error creating zip file:', error)
    return NextResponse.json(
      { error: `Failed to create ZIP file: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
