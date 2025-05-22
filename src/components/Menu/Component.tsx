'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MenuContent } from './Overlay'
import type { Header as HeaderType, Chapter } from '@/payload-types'
import { useRouter, usePathname } from 'next/navigation'
import { scrollToElement } from '@/utilities/linkHelpers'

interface MenuProps {
  header: HeaderType
  chapters: Chapter[]
}

export const Menu: React.FC<MenuProps> = ({ header, chapters }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const exitAnimationTime = 500 // Must match exit animation duration in ms
  const router = useRouter()
  const pathname = usePathname()
  const isNavigatingFromExternalPage = useRef(false)

  // Handle the actual navigation after menu closes
  useEffect(() => {
    let navigationTimer: NodeJS.Timeout | null = null

    if (!isOpen && pendingNavigation) {
      // Validate the URL before navigating
      navigationTimer = setTimeout(() => {
        // Check if URL is valid
        if (pendingNavigation && pendingNavigation !== '#') {
          try {
            // Check for hash link navigation on current page
            if (pendingNavigation.startsWith('/#') && pathname === '/') {
              const elementId = pendingNavigation.substring(2)
              scrollToElement(elementId)
              setPendingNavigation(null)
              return
            }

            // Check if we're navigating to homepage with hash from another page
            if (pendingNavigation.startsWith('/#') && pathname !== '/') {
              isNavigatingFromExternalPage.current = true
              const url = pendingNavigation
              router.push(url)
              return
            }

            // Normal navigation if path is different
            if (pendingNavigation !== pathname) {
              // Check if URL is relative or has valid protocol
              const url = pendingNavigation.startsWith('/')
                ? pendingNavigation
                : pendingNavigation.startsWith('http')
                  ? new URL(pendingNavigation).toString()
                  : `/${pendingNavigation}`

              router.push(url)
            }
          } catch (e) {
            console.error('Invalid URL:', pendingNavigation)
          }
        }
        setPendingNavigation(null)
      }, exitAnimationTime)
    }

    return () => {
      if (navigationTimer) clearTimeout(navigationTimer)
    }
  }, [isOpen, pendingNavigation, router, pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = 'var(--scrollbar-width)'
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
  }, [])

  const handleNavigate = (href: string) => {
    // Validate URL before setting
    if (href && href !== '#') {
      setPendingNavigation(href)
    }
  }

  return (
    <>
      <motion.div
        className="fixed top-8 right-4 lg:right-8 flex items-center px-3 lg:px-6 py-2 lg:py-4 bg-dark-blue text-white rounded-full cursor-pointer z-1000"
        onClick={() => setIsOpen(!isOpen)}
        onHoverStart={() => {
          setIsHovered(true)
        }}
        onHoverEnd={() => {
          !isOpen && setIsHovered(false)
        }}
      >
        <motion.span
          className={'uppercase font-medium text-sm tracking-widest'}
          animate={{
            x: isHovered ? '0' : '0.5rem',
          }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? 'Close' : 'Menu'}
        </motion.span>
        <div className="ml-4 w-8 h-8 relative">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-light-green rounded-full flex items-center justify-center"
            initial={{ width: '0.75rem', height: '0.75rem' }}
            animate={{
              width: isHovered ? '2.5rem' : '0.75rem',
              height: isHovered ? '2.5rem' : '0.75rem',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`relative w-4 h-0.5 ${
                isOpen
                  ? 'bg-transparent before:bg-dark-blue after:bg-dark-blue'
                  : 'bg-dark-blue before:bg-dark-blue after:bg-dark-blue'
              } before:content-[''] before:absolute before:w-4 before:h-0.5 before:transition-transform before:duration-300 before:ease-in-out
              after:content-[''] after:absolute after:w-4 after:h-0.5 after:transition-transform after:duration-300 after:ease-in-out
              ${
                isOpen
                  ? 'before:rotate-45 before:translate-y-0 after:-rotate-45 after:translate-y-0'
                  : 'before:-translate-y-1.5 after:translate-y-1.5'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-dark-blue z-999 overflow-y-auto"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <MenuContent
              header={header}
              chapters={chapters}
              setIsOpen={setIsOpen}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Menu
