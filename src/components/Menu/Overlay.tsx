'use client'

import type { Header as HeaderType, Chapter } from '@/payload-types'
import { motion } from 'motion/react'
import { useRouter, usePathname } from 'next/navigation'
import RichText from '../RichText'
import RBSLogo from '@/assets/Robert_Bosch_Stiftung_Logo.svg'
import TMGLogo from '@/assets/tmg_logo.svg'
import Image from 'next/image'
import { getModifiedLink, scrollToElement } from '@/utilities/linkHelpers'
import Link from 'next/link'
interface MenuContentProps {
  header: HeaderType
  chapters: Chapter[]
  setIsOpen: (isOpen: boolean) => void
  onNavigate?: (href: string) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.35,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const MenuContent: React.FC<MenuContentProps> = ({
  header,
  chapters,
  setIsOpen,
  onNavigate,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const navItems = header?.navItems || []
  const sortedChapters = chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))

  // Helper function to extract href from link objects
  const getHrefFromLink = (link: any) => {
    // First apply any special modifications
    const modifiedLink = getModifiedLink(link)

    // If the link has a URL after modification, use it
    if (modifiedLink.url) {
      return modifiedLink.url
    }

    // Otherwise handle reference types
    if (modifiedLink.type === 'reference' && modifiedLink.reference) {
      if (typeof modifiedLink.reference.value === 'object' && modifiedLink.reference.value?.slug) {
        // Handle different relation types
        if (modifiedLink.reference.relationTo === 'chapters') {
          return `/chapters/${modifiedLink.reference.value.slug}`
        } else if (modifiedLink.reference.value.slug === 'homepage') {
          return '/'
        } else {
          return `/${modifiedLink.reference.value.slug}`
        }
      }
    }

    // Default fallback
    return '#'
  }

  // Handle navigation with delay
  const handleNavigation = (href: string) => {
    setIsOpen(false)

    // Special case: If we're on homepage and trying to navigate to #chapters
    if (pathname === '/' && href === '/#chapters') {
      // Use immediate execution for scrolling on current page
      setTimeout(() => {
        scrollToElement('chapters')
      }, 500) // Short delay to allow menu to close
      return
    }

    if (onNavigate) {
      onNavigate(href)
    }
  }

  return (
    <div className="h-full w-full flex flex-col ">
      <div className="text-white p-4 sm:p-6 md:p-10 flex flex-col h-full w-full">
        {/* Main Content */}
        <motion.div
          className="my-auto flex flex-col md:flex-row gap-4 md:gap-12 lg:gap-24 mx-auto relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Navigation Links Column */}
          <motion.div variants={itemVariants} className="space-y-2 md:space-y-6">
            {navItems.map(({ link }, i) => {
              // Check if this link is to the chapters page
              const isChaptersLink =
                typeof link.reference?.value === 'object' &&
                link.reference?.value?.slug === 'chapters'

              // Get the href from the link
              const href = getHrefFromLink(link)
              const label = link.label || 'Link'

              return (
                <motion.div key={i} variants={itemVariants}>
                  <Link
                    href="#" // Prevent default behavior
                    className={`text-2xl sm:text-5xl md:text-6xl 2xl:text-7xl font-light duration-300 transition-all hover:no-underline ${
                      isChaptersLink
                        ? 'text-light-green hover:text-light-green/40'
                        : 'text-white hover:text-white/40'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(href)
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Chapters Column */}
          {sortedChapters.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="border-t md:border-t-0 border-white/20 pt-4 md:pt-0  flex flex-col "
            >
              <div className="space-y-1 lg:space-y-3 md:space-y-4 max-h-[50vh] md:max-h-none overflow-y-auto md:overflow-visible pr-2 my-auto md:border-l border-white/20 md:pl-12">
                {sortedChapters.map((chapter, index) => (
                  <motion.div key={chapter.id} variants={itemVariants} className="group">
                    <Link
                      href="#" // Prevent default behavior
                      className="flex items-center gap-3 text-light-green hover:text-light-green/40 transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavigation(`/chapters/${chapter.slug}`)
                      }}
                    >
                      <span className="text-sm md:text-base font-mono ">
                        {String(index).padStart(2, '0')}
                      </span>
                      <span className="text-base sm:text-lg md:text-xl font-light">
                        {chapter.title}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
      {/* Social Links Column */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-petrol-15 mt-auto hidden md:block"
      >
        <div className="flex flex-col sm:flex-row justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-5 items-center gap-4 sm:gap-0">
          {/* Logo Section */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-row  items-center sm:items-start gap-4 sm:gap-6 justify-between">
              <Link
                href="https://tmg-thinktank.com"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-80 transition-opacity duration-300 my-auto"
              >
                <Image
                  src={TMGLogo}
                  alt="TMG Logo"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </Link>
              <Link
                href="https://www.bosch-stiftung.de/en"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-100 hover:opacity-80 transition-opacity duration-300 my-auto"
              >
                <Image
                  src={RBSLogo}
                  alt="RBS Logo"
                  width={150}
                  height={200}
                  className="object-contain "
                />
              </Link>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="h-full w-full">
            {header.attribution && (
              <RichText
                data={header.attribution}
                className="text-black/70 linkUnderline leading-none small-text text-center sm:text-right"
                enableProse={false}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
