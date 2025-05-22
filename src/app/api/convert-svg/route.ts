import { NextResponse } from 'next/server'
import sharp from 'sharp'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { url, width = 1600, density = 300 } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    let fullUrl = url
    if (!url.startsWith('http')) {
      fullUrl = `${NEXT_PUBLIC_SERVER_URL}${url.startsWith('/') ? url : `/${url}`}`
    }

    // Add headers to handle CORS and other potential issues
    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 NextJS Server',
        Accept: 'image/svg+xml,*/*',
      },
      cache: 'no-store' as RequestCache,
    }

    // Fetch the SVG content
    let response
    try {
      response = await fetch(fullUrl, fetchOptions)

      if (!response.ok) {
        console.error(`Failed to fetch SVG: ${response.status} ${response.statusText}`)
        return NextResponse.json(
          { error: `Failed to fetch SVG: ${response.statusText}` },
          { status: response.status },
        )
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError)
      return NextResponse.json(
        { error: `Network error fetching SVG: ${(fetchError as Error).message}` },
        { status: 500 },
      )
    }

    // Get the content type to ensure we're processing an SVG
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('svg')) {
      console.warn(`Unexpected content type: ${contentType} for URL: ${fullUrl}`)
    }

    let svgBuffer
    try {
      svgBuffer = await response.arrayBuffer()
      if (svgBuffer.byteLength === 0) {
        console.error('Empty SVG response')
        return NextResponse.json({ error: 'Empty SVG response' }, { status: 500 })
      }
    } catch (bufferError) {
      console.error('Buffer error:', bufferError)
      return NextResponse.json(
        { error: `Error reading SVG data: ${(bufferError as Error).message}` },
        { status: 500 },
      )
    }

    // Convert SVG to PNG using sharp with improved quality
    let pngBuffer
    try {
      pngBuffer = await sharp(Buffer.from(svgBuffer), {
        // Set higher density for better SVG rendering
        density: Number(density),
      })
        .resize({
          width: Number(width),
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
          withoutEnlargement: false, // Allow scaling up if needed
        })
        .png({
          quality: 100, // Max quality
          compressionLevel: 6, // Balanced compression (lower = higher quality but larger file)
          adaptiveFiltering: true, // Optimize PNG filters
          palette: false, // Don't use palette to maintain quality
        })
        .toBuffer()
    } catch (sharpError) {
      console.error('Sharp processing error:', sharpError)
      return NextResponse.json(
        { error: `Error converting SVG to PNG: ${(sharpError as Error).message}` },
        { status: 500 },
      )
    }

    // Return PNG response
    return new NextResponse(pngBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Error converting SVG to PNG:', error)
    return NextResponse.json(
      { error: `Failed to convert SVG to PNG: ${(error as Error).message}` },
      { status: 500 },
    )
  }
}
