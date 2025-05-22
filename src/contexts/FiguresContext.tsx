'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react'

// Define the type for a figure slide
export interface FigureSlide {
  id: string // unique identifier for the figure
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  title?: string
  srcSet?: Array<{
    src: string
    width: number
    height: number
  }>
  type: 'svg' | 'image' | 'video'
  svgUrl?: string
  videoUrl?: string // For YouTube video URL
  thumbnailUrl?: string // Custom thumbnail URL for videos
  figureNumber?: number
  // Add chapter-related properties
  chapterNumber?: number
  chapterTitle?: string
  source?: string // Source attribution for the figure
}

interface FiguresContextType {
  figures: FigureSlide[]
  addFigure: (figure: FigureSlide) => void
  removeFigure: (id: string) => void
  currentIndex: number
  setCurrentIndex: (index: number) => void
  openLightbox: (figureId: string) => void
  closeLightbox: () => void
  isLightboxOpen: boolean
  getSlides: () => FigureSlide[]
}

const FiguresContext = createContext<FiguresContextType | undefined>(undefined)

export const FiguresProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [figures, setFigures] = useState<FigureSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Add a figure to the context - memoized to prevent recreation on each render
  const addFigure = useCallback((figure: FigureSlide) => {
    setFigures((prev) => {
      // Check if figure already exists by id
      const exists = prev.some((f) => f.id === figure.id)
      if (exists) {
        // Update existing figure
        return prev.map((f) => (f.id === figure.id ? figure : f))
      } else {
        // Add new figure
        return [...prev, figure]
      }
    })
  }, [])

  // Remove a figure from the context - memoized to prevent recreation on each render
  const removeFigure = useCallback((id: string) => {
    setFigures((prev) => prev.filter((figure) => figure.id !== id))
  }, [])

  // Get all slides in correct order by figure number - memoized to prevent recreation on each render
  const getSlides = useCallback((): FigureSlide[] => {
    // Sort first by chapter number, then by figure number within each chapter
    const sortedSlides = [...figures].sort((a, b) => {
      // First sort by chapter number
      if (a.chapterNumber !== b.chapterNumber) {
        return (a.chapterNumber || 0) - (b.chapterNumber || 0)
      }
      // Then sort by figure number within the chapter
      return (a.figureNumber || 0) - (b.figureNumber || 0)
    })

    return sortedSlides
  }, [figures])

  // Consistent slide order for lookup
  const getSortedFigureIndex = useCallback(
    (figureId: string): number => {
      // Get the sorted slides first
      const sortedSlides = getSlides()

      // Then find the index in the sorted array
      return sortedSlides.findIndex((figure) => figure.id === figureId)
    },
    [getSlides],
  )

  // Open the lightbox with a specific figure - memoized to prevent recreation on each render
  const openLightbox = useCallback(
    (figureId: string) => {
      // Get the index from the SORTED array, not the raw figures array
      const index = getSortedFigureIndex(figureId)

      if (index !== -1) {
        const sortedSlides = getSlides()
        setCurrentIndex(index)
        setIsLightboxOpen(true)
      } else {
        console.warn(
          `Figure with ID ${figureId} not found in context. Available IDs:`,
          figures.map((fig) => ({
            id: fig.id,
            figureNumber: fig.figureNumber,
            chapterNumber: fig.chapterNumber,
            title: fig.title,
          })),
        )
      }
    },
    [figures, getSortedFigureIndex, getSlides],
  )

  // Close the lightbox - memoized to prevent recreation on each render
  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
  }, [])

  // Clean up figures when component unmounts
  useEffect(() => {
    return () => {
      setFigures([])
    }
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      figures,
      addFigure,
      removeFigure,
      currentIndex,
      setCurrentIndex,
      openLightbox,
      closeLightbox,
      isLightboxOpen,
      getSlides,
    }),
    [
      figures,
      addFigure,
      removeFigure,
      currentIndex,
      setCurrentIndex,
      openLightbox,
      closeLightbox,
      isLightboxOpen,
      getSlides,
    ],
  )

  return <FiguresContext.Provider value={contextValue}>{children}</FiguresContext.Provider>
}

export const useFigures = () => {
  const context = useContext(FiguresContext)
  if (context === undefined) {
    throw new Error('useFigures must be used within a FiguresProvider')
  }
  return context
}
