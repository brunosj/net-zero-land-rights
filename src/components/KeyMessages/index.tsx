'use client'

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import type { Homepage, KeyMessage } from '@/payload-types'
import { CMSLink } from '../Link'
import { SectionHeading } from '@/components/ui/section-heading'
import { motion } from 'motion/react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Arrow from '@/assets/double-sided-arrow.svg'
import Image from 'next/image'

interface KeyMessagesProps {
  data: Homepage['keyMessagesSection']
}

export const KeyMessages: React.FC<KeyMessagesProps> = ({ data }) => {
  const containerRef = useRef<HTMLUListElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftStart, setScrollLeftStart] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [isManualNavigation, setIsManualNavigation] = useState(false)

  const { keyMessagesHeading, keyMessages = [] } = data || {}

  // Memoize the progress bar width calculation
  const progressBarWidth = useMemo(() => {
    if (!keyMessages?.length) return '0%'
    return `${(activeIndex + 1) * (100 / keyMessages.length)}%`
  }, [activeIndex, keyMessages?.length])

  // Track active message based on scroll position - optimized for performance
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !keyMessages || keyMessages.length === 0 || isManualNavigation)
      return

    const container = containerRef.current
    const scrollPosition = container.scrollLeft
    const containerWidth = container.clientWidth
    const scrollableWidth = container.scrollWidth - containerWidth

    // Calculate index based on scroll position relative to total scrollable width
    const scrollRatio = scrollPosition / (scrollableWidth || 1)
    const approximateIndex = Math.round(scrollRatio * (keyMessages.length - 1))

    // Ensure index is within bounds
    const boundedIndex = Math.min(keyMessages.length - 1, Math.max(0, approximateIndex))

    if (boundedIndex !== activeIndex) {
      setActiveIndex(boundedIndex)
    }
  }, [keyMessages, activeIndex, isManualNavigation])

  // Throttle scroll handler for better performance
  useEffect(() => {
    if (!containerRef.current || !keyMessages || keyMessages.length === 0) return

    const container = containerRef.current
    let ticking = false
    let lastScrollPosition = 0
    const SCROLL_THRESHOLD = 5 // Only update if scroll position changes by more than 5px

    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = container.scrollLeft
          if (Math.abs(currentScroll - lastScrollPosition) > SCROLL_THRESHOLD) {
            handleScroll()
            lastScrollPosition = currentScroll
          }
          ticking = false
        })
        ticking = true
      }
    }

    container.addEventListener('scroll', scrollListener, { passive: true })
    return () => {
      container.removeEventListener('scroll', scrollListener)
    }
  }, [keyMessages, handleScroll])

  // Jump to a specific message by index
  const scrollToMessage = useCallback(
    (index: number) => {
      if (!containerRef.current || !keyMessages || keyMessages.length === 0) return

      // Disable scroll tracking during manual navigation
      setIsManualNavigation(true)

      // Set active index first - this will update the progress bar
      setActiveIndex(index)

      const container = containerRef.current
      const totalWidth = container.scrollWidth
      const containerWidth = container.clientWidth
      const scrollableWidth = totalWidth - containerWidth

      // Calculate scroll position based on the index as a fraction of total items
      const scrollPosition =
        index === keyMessages.length - 1
          ? scrollableWidth
          : Math.round((index / (keyMessages.length - 1)) * scrollableWidth)

      // Start the scroll animation
      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      })

      // Re-enable scroll tracking after animation completes
      setTimeout(() => {
        setIsManualNavigation(false)
      }, 500) // Match or exceed the scroll animation time
    },
    [keyMessages],
  )

  // Optimize touch handlers
  const handleTouchStart = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing'
      handleScroll()
    }
  }, [handleScroll])

  const handleTouchEnd = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
      handleScroll()
    }
  }, [handleScroll])

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (containerRef.current) {
          handleScroll()
        }
      }, 100) // Reduced debounce time for more responsive resizing
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [handleScroll])

  useEffect(() => {
    setIsMounted(true)

    if (containerRef.current) {
      containerRef.current.scrollLeft = 0
    }

    // Add a style tag to hide webkit scrollbars
    const style = document.createElement('style')
    style.textContent = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeftStart(containerRef.current.scrollLeft)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grabbing'
      containerRef.current.style.userSelect = 'none'
    }
    // Prevent any text selection during drag
    e.preventDefault()
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
      containerRef.current.style.userSelect = 'auto'
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!containerRef.current) return
    setIsDragging(false)
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab'
      containerRef.current.style.userSelect = 'auto'
    }
    // Prevent any additional events from bubbling
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLUListElement>) => {
    if (!isDragging || !containerRef.current) return

    // Prevent text selection and default behaviors
    e.preventDefault()

    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2.5 // Increased scroll speed multiplier for more responsive dragging
    containerRef.current.scrollLeft = scrollLeftStart - walk
  }

  if (!keyMessages?.length) return null
  if (!isMounted)
    return (
      <section className="relative overflow-hidden block py-0 md:py-24 text-gray-900"></section>
    )

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden block py-0 md:py-24 text-gray-900"
    >
      <motion.div
        className="container px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px 0px -50px 0px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <div className="w-full text-center">
            <SectionHeading
              title={keyMessagesHeading || ''}
              size="lg"
              color="dark"
              alignment="center"
              className="mb-0"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative h-1 w-28 sm:w-40 bg-gray-200 rounded-full overflow-hidden">
              <div
                ref={trackRef}
                className="absolute top-0 left-0 h-full bg-petrol rounded-full transition-all duration-200 ease-out"
                style={{ width: progressBarWidth }}
              />
            </div>

            <div className="flex items-center space-x-2 relative z-10">
              <button
                onClick={() => activeIndex > 0 && scrollToMessage(activeIndex - 1)}
                disabled={activeIndex === 0}
                className={`flex items-center justify-center transition-all duration-200 ${
                  activeIndex === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-petrol cursor-pointer hover:scale-110'
                } relative z-10`}
                aria-label="Previous message"
              >
                <ChevronLeftIcon size={24} className="sm:w-8 sm:h-8" />
              </button>

              <span className="text-base text-gray-300 mb-[0.1rem]">|</span>

              <button
                onClick={() =>
                  activeIndex < keyMessages.length - 1 && scrollToMessage(activeIndex + 1)
                }
                disabled={activeIndex === keyMessages.length - 1}
                className={`flex items-center justify-center transition-all duration-200 ${
                  activeIndex === keyMessages.length - 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-petrol cursor-pointer hover:scale-110'
                } relative z-10`}
                aria-label="Next message"
              >
                <ChevronRightIcon size={24} className="sm:w-8 sm:h-8" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="text-center text-gray-500 text-xs sm:text-sm mt-2">
        Drag cards horizontally or use controls above to navigate
      </div>

      <ul
        ref={containerRef}
        className="flex gap-6 sm:gap-8 md:gap-16 lg:gap-24 overflow-x-auto scroll-smooth py-8 sm:py-12 pl-4 sm:pl-8 md:pl-16 lg:pl-24 pr-4 sm:pr-8 md:pr-16 lg:pr-32 hide-scrollbar"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          position: 'relative',
          zIndex: 5,
          willChange: 'scroll-position',
          scrollSnapType: 'x mandatory', // Add scroll snap for better mobile experience
          WebkitOverflowScrolling: 'touch', // Better iOS scrolling
          scrollbarWidth: 'none' /* For Firefox */,
          msOverflowStyle: 'none' /* For Internet Explorer and Edge */,
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={() => handleScroll()}
      >
        {keyMessages.map((item: KeyMessage, index: number) => (
          <li
            key={item.id}
            className="shrink-0 space-y-3 sm:space-y-8 rounded-2xl px-6 sm:px-8 py-8 sm:py-12 bg-white/50 backdrop-blur-xs border border-gray-100 flex flex-col"
            style={{
              width: 'calc(90% - 1rem)',
              maxWidth: '36rem',
              minHeight: '16rem',
              pointerEvents: 'auto',
              scrollSnapAlign: 'center', // Add scroll snap for better mobile experience
            }}
          >
            {item.link?.reference ? (
              <div>
                <span className="inline-block text-xs sm:text-sm font-mono bg-petrol/10 text-petrol px-3 py-1 rounded-full">
                  Chapter {item.title}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Image src={Arrow} alt="Arrow" className="w-32" />
              </div>
            )}

            <div className="my-auto">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium leading-tight">
                {item.message}
              </p>
            </div>

            {item.link?.reference && (
              <div className="pt-4">
                <CMSLink
                  type="reference"
                  appearance="rounded"
                  reference={item.link?.reference}
                  color="petrol"
                  className="group inline-flex items-center"
                >
                  <span className="mr-2">Read More</span>
                </CMSLink>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
