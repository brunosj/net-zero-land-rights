'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { Homepage, KeyMessage } from '@/payload-types'
import { CMSLink } from '../Link'
import { SectionHeading } from '@/components/ui/section-heading'
import { motion } from 'motion/react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Arrow from '@/assets/double-sided-arrow.svg'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'

// Add CSS for Embla with better dragging behavior and margins
const emblaStyles = {
  carousel: {
    userSelect: 'none',
  },
  container: {
    marginLeft: 'calc(var(--slide-spacing, 1rem) * -1)',
  },
  slide: {
    paddingLeft: 'var(--slide-spacing, 1rem)',
    position: 'relative',
  },
}

interface KeyMessagesProps {
  data: Homepage['keyMessagesSection']
}

export const KeyMessagesEmbla: React.FC<KeyMessagesProps> = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false)
  const { keyMessagesHeading, keyMessages = [] } = data || {}

  // Initialize Embla Carousel with options that match original implementation
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: false, // Allow scrolling beyond the edges
    dragFree: true,
    startIndex: 0, // Start with the first slide
    inViewThreshold: 0.8, // Consider a slide "in view" when 80% visible
  })

  // Track if we can go previous or next
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  // Update button states based on scroll position
  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  // Set up listeners when emblaApi is ready
  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)

    // Add event listeners for drag interactions
    const rootNode = emblaApi.rootNode()

    const onPointerDown = () => {
      document.body.classList.add('embla-dragging')
    }

    const onPointerUp = () => {
      document.body.classList.remove('embla-dragging')
    }

    rootNode.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
      rootNode.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [emblaApi, onSelect])

  // Add styles for embla drag state
  useEffect(() => {
    // Add a style tag for the embla-dragging class
    const styleEl = document.createElement('style')
    styleEl.textContent = `
      .embla-dragging * {
        user-select: none !important;
        -webkit-user-select: none !important;
        cursor: grabbing !important;
      }
    `
    document.head.appendChild(styleEl)

    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!keyMessages?.length) return null
  if (!isMounted)
    return (
      <section className="relative overflow-hidden block py-0 md:py-24 text-gray-900"></section>
    )

  return (
    <section className="relative overflow-hidden block py-0 md:py-24 text-gray-900">
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

          <div className="w-full">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2 relative z-10">
                <button
                  className={`flex items-center justify-center transition-all duration-200 focus:outline-none relative z-10 ${
                    prevBtnEnabled
                      ? 'text-petrol cursor-pointer hover:scale-110'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  onClick={scrollPrev}
                  disabled={!prevBtnEnabled}
                  aria-label="Previous message"
                >
                  <ChevronLeftIcon size={24} className="sm:w-8 sm:h-8" />
                </button>

                <span className="text-base text-gray-300 mb-[0.1rem]">|</span>

                <button
                  className={`flex items-center justify-center transition-all duration-200 focus:outline-none relative z-10 ${
                    nextBtnEnabled
                      ? 'text-petrol cursor-pointer hover:scale-110'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  onClick={scrollNext}
                  disabled={!nextBtnEnabled}
                  aria-label="Next message"
                >
                  <ChevronRightIcon size={24} className="sm:w-8 sm:h-8" />
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 text-xs sm:text-sm mt-2">
              Drag cards horizontally or use controls above to navigate
            </div>
          </div>
        </div>
      </motion.div>

      {/* Move outside container to allow full viewport width */}
      <div className="w-full overflow-hidden mt-12" ref={emblaRef}>
        <div
          className="flex gap-6 sm:gap-8 md:gap-16 pl-4 sm:pl-8 md:pl-16 lg:pl-24 pr-4 sm:pr-8 md:pr-16 lg:pr-32 cursor-grab active:cursor-grabbing select-none"
          style={{ paddingLeft: 'calc(8vw)', marginLeft: 'calc(4vw)' }} // Add extra space for first slide
        >
          {keyMessages.map((item: KeyMessage) => (
            <div
              key={item.id}
              className="flex-[0_0_auto] min-w-0"
              style={{
                width: 'calc(90% - 1rem)',
                maxWidth: '36rem',
              }}
            >
              <div
                className="shrink-0 space-y-3 sm:space-y-8 rounded-2xl px-6 sm:px-8 py-8 sm:py-12 bg-white/50 backdrop-blur-xs border border-gray-100 flex flex-col h-full"
                style={{
                  minHeight: '16rem',
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
                      aria-label={
                        typeof item.link?.reference?.value === 'object'
                          ? item.link.reference.value.title || 'Read More'
                          : 'Read More'
                      }
                    >
                      <span className="mr-2">Read More</span>
                    </CMSLink>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
