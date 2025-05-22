'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef } from 'react'
import { Hero } from '@/components/Hero'
import { AboutSection } from '@/components/AboutSection'
import { ChapterTimeline } from '@/components/ChapterPreviews/ChapterTimeline'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { BackgroundPattern } from '@/components/BackgroundPattern'
import type { Homepage, Chapter } from '@/payload-types'
import { KeyMessagesEmbla } from '@/components/KeyMessagesV2'

interface PageClientProps {
  heroSection: Homepage['heroSection']
  aboutSection: Homepage['aboutSection']
  keyMessagesSection: Homepage['keyMessagesSection']
  chapters: Chapter[]
}

const PageClient: React.FC<PageClientProps> = ({
  heroSection,
  aboutSection,
  keyMessagesSection,
  chapters,
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const initialRenderRef = useRef(true)

  useEffect(() => {
    // Keep light theme for the header
    setHeaderTheme('light')
  }, [setHeaderTheme])

  // Handle hash-based navigation with proper scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Flag to indicate we're performing a controlled scroll
    let isControlledScrolling = false
    let scrollTimeout: NodeJS.Timeout | null = null

    const handleHashNavigation = () => {
      const hash = window.location.hash

      // Only proceed if we have a hash
      if (hash) {
        // Clean the hash (remove any markers)
        let elementId = hash.split(':')[0].substring(1)

        // Only proceed if we have a valid element ID
        if (elementId) {
          // Clean up the URL first
          if (hash.includes(':')) {
            history.replaceState(null, '', `/#${elementId}`)
          }

          // Set flag to prevent other scroll handlers
          isControlledScrolling = true

          // Clear any existing timeout
          if (scrollTimeout) {
            clearTimeout(scrollTimeout)
          }

          // Use a much longer delay for initial load to ensure all animations and content is fully loaded
          // For subsequent navigations, use a shorter delay
          const delay = initialRenderRef.current ? 1800 : 300

          // Single, definitive scroll action after everything has loaded
          scrollTimeout = setTimeout(() => {
            const element = document.getElementById(elementId)
            if (element) {
              // Prevent any scrolling animations from the browser or libraries
              document.documentElement.style.scrollBehavior = 'auto'
              document.body.style.scrollBehavior = 'auto'

              // Calculate offset for header (adjust this value based on your header height)
              const headerOffset = 80

              // Get the element's position
              const rect = element.getBoundingClientRect()
              const offsetPosition = window.pageYOffset + rect.top - headerOffset

              // Single, definitive scroll
              window.scrollTo(0, offsetPosition)

              // Reset scroll behavior after a brief delay
              setTimeout(() => {
                document.documentElement.style.scrollBehavior = ''
                document.body.style.scrollBehavior = ''
                isControlledScrolling = false
              }, 100)
            } else {
              isControlledScrolling = false
            }
          }, delay)
        }
      }
    }

    // Run once on initial mount
    handleHashNavigation()

    // Also listen for hashchange events
    window.addEventListener('hashchange', handleHashNavigation)

    // Mark initial render as complete
    initialRenderRef.current = false

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      // Ensure we clean up any CSS changes
      document.documentElement.style.scrollBehavior = ''
      document.body.style.scrollBehavior = ''
    }
  }, [])

  return (
    <article className="flex flex-col">
      <LivePreviewListener />
      <Hero data={heroSection} />
      <AboutSection data={aboutSection} />
      <div className="bg-beige">
        <BackgroundPattern />
        <KeyMessagesEmbla data={keyMessagesSection} />
        <ChapterTimeline chapters={chapters} />
      </div>
    </article>
  )
}

export default PageClient
