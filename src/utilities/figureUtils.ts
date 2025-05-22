import { getClientSideURL } from '@/utilities/getURL'
import type { FigureSlide } from '@/contexts/FiguresContext'

/**
 * Checks if a URL is for an SVG file
 */
export const isSvgFile = (url: string): boolean => {
  return url?.toLowerCase().endsWith('.svg')
}

/**
 * Downloads an SVG file from the given URL
 */
export const downloadSvgFile = async (url: string, filename: string): Promise<void> => {
  try {
    // Fetch the SVG content
    const response = await fetch(url)
    const svgText = await response.text()

    // Create a blob from the SVG content
    const blob = new Blob([svgText], { type: 'image/svg+xml' })

    // Download the file
    downloadBlob(blob, filename)
  } catch (error) {
    console.error('Error downloading SVG:', error)
  }
}

/**
 * Downloads a PNG version of an image URL
 */
export const downloadPngFromUrl = async (imageUrl: string, filename: string): Promise<void> => {
  try {
    if (isSvgFile(imageUrl)) {
      // For SVGs, use the server-side conversion API with higher resolution
      const response = await fetch('/api/convert-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: imageUrl,
          width: 2000, // Request larger size for better quality
          density: 300, // Higher DPI for crisp rendering
        }),
      })

      if (!response.ok) {
        console.error(`Error response: ${response.status} ${response.statusText}`)
        throw new Error(`API responded with status ${response.status}`)
      }

      const blob = await response.blob()
      downloadBlob(blob, filename)
    } else {
      // Create a new Image to draw on canvas
      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      // Set up canvas once image is loaded
      img.onload = () => {
        // Create higher resolution canvas for better quality
        const scale = 2 // 2x scaling for better quality
        const canvas = document.createElement('canvas')
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // Draw image to canvas with better quality
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set better quality rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Scale up the image
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)

        // Convert to blob and download with high quality
        canvas.toBlob(
          (blob) => {
            if (!blob) return
            downloadBlob(blob, filename)
          },
          'image/png',
          1.0,
        ) // 1.0 = highest quality
      }

      // Set source to trigger load
      img.src = imageUrl
    }
  } catch (error) {
    console.error('Error downloading PNG:', error)
  }
}

/**
 * Helper function to download a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()

  // Clean up
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Helper function to ensure a URL is absolute
 */
export const ensureAbsoluteUrl = (url: string): string => {
  return url.startsWith('http') ? url : `${getClientSideURL()}${url}`
}

/**
 * Prepares a figure for the lightbox based on media object
 */
export const prepareFigureFromMedia = (
  media: any,
  title?: string,
  caption?: string,
  figureNumber?: number,
  source?: string,
): FigureSlide | null => {
  if (!media) return null

  const baseURL = getClientSideURL()

  // Handle the case where media is a string (direct URL)
  if (typeof media === 'string') {
    const fullUrl = ensureAbsoluteUrl(media)
    const isMediaSvg = isSvgFile(media)

    return {
      id: '', // Will be replaced by caller
      src: fullUrl,
      alt: title || '',
      type: isMediaSvg ? 'svg' : 'image',
      figureNumber,
      title,
      caption,
      svgUrl: isMediaSvg ? fullUrl : undefined,
      source,
    }
  }

  // Handle the case where media is a Media object
  if (typeof media === 'object' && media.url) {
    const fullUrl = ensureAbsoluteUrl(media.url)
    const isMediaSvg = isSvgFile(media.url)

    // Create slide based on whether it's an SVG or not
    const slide: FigureSlide = {
      id: '', // Will be replaced by caller
      src: fullUrl,
      alt: media.alt || caption || title || '',
      type: isMediaSvg ? 'svg' : 'image',
      figureNumber,
      title,
      caption: media.caption || caption,
      source,
    }

    // If it's an SVG, set the svgUrl property
    if (isMediaSvg) {
      slide.svgUrl = fullUrl
    } else if (media.sizes) {
      // Add width and height if available
      if (media.width && media.height) {
        slide.width = media.width
        slide.height = media.height
      }

      // Add srcSet if sizes are available
      const srcSet: FigureSlide['srcSet'] = []

      Object.entries(media.sizes).forEach(([size, sizeData]: [string, any]) => {
        if (sizeData?.url && sizeData.width && sizeData.height) {
          srcSet.push({
            src: ensureAbsoluteUrl(sizeData.url),
            width: sizeData.width,
            height: sizeData.height,
          })
        }
      })

      if (srcSet.length > 0) {
        slide.srcSet = srcSet
      }
    }

    return slide
  }

  return null
}

/**
 * Helper function to extract YouTube ID from a URL
 */
export const getYouTubeID = (url: string): string | null => {
  if (!url) return null

  // Match YouTube ID from various URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)

  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Creates a video figure from a YouTube URL
 */
export const createVideoFigure = (
  id: string,
  videoUrl: string,
  title?: string,
  caption?: string,
  figureNumber?: number,
  thumbnailUrl?: string,
  chapterNumber?: number,
  chapterTitle?: string,
  source?: string,
): FigureSlide | null => {
  const youtubeId = getYouTubeID(videoUrl)
  if (!videoUrl || !youtubeId) return null

  // Generate YouTube thumbnail URL as fallback
  const youtubeThumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`

  return {
    id,
    src: thumbnailUrl || youtubeThumbnailUrl, // Use custom thumbnail if provided, fallback to YouTube
    type: 'video',
    videoUrl,
    thumbnailUrl, // Store the custom thumbnail URL if provided
    title,
    caption,
    figureNumber,
    chapterNumber,
    chapterTitle,
    source,
  }
}

/**
 * Downloads all figures as a zip file
 */
export const downloadAllFiguresAsZip = async (figures: FigureSlide[]): Promise<void> => {
  try {
    // Show loading state wherever this is called from

    // Use the server API route to generate the ZIP file with both SVG and PNG versions
    const response = await fetch('/api/download-figures', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ figures }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`)
    }

    // Get the blob from the response
    const blob = await response.blob()

    // Create download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'net-zero-land-rights_figures.zip'
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error creating zip file:', error)
    throw error
  }
}
