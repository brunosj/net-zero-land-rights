'use client'
import { motion } from 'motion/react'
import { Logo } from '@/components/Logo/Logo'
import RBSLogo from '@/assets/RBS_logo_white.svg'
import TMGLogo from '@/assets/tmg_logo_white.svg'
import Image from 'next/image'
import { CMSLink } from '@/components/Link'
import type { Footer } from '@/payload-types'
import Illustration from '@/assets/trees-bird.svg'
import { MapPin, Mail, ChevronRight, SendIcon, CheckIcon, AlertCircle } from 'lucide-react'
import { LucideInstagram } from '@/assets/icons/Insta'
import { RiBlueskyFill } from '@/assets/icons/Bluesky'
import { LineiconsLinkedinOriginal } from '@/assets/icons/LinkedIn'
import { LineiconsX } from '@/assets/icons/Twitter'

import { getModifiedLink } from '@/utilities/linkHelpers'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import Link from 'next/link'

interface FooterClientProps {
  navItems: Footer['navItems']
  contactInfo?: Footer['contactInfo']
  socialLinks?: Footer['socialLinks']
  newsletterSection?: Footer['newsletterSection']
  legalLinks?: Footer['legalLinks']
}

export const FooterClient: React.FC<FooterClientProps> = ({
  navItems,
  contactInfo,
  socialLinks,
  newsletterSection,
  legalLinks,
}) => {
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

  // State for the email input
  const [emailInput, setEmailInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Handle email submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
      setSubmitStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    // Instead of submitting directly, redirect to the newsletter page with email as query param
    window.location.href = `/newsletter?email=${encodeURIComponent(emailInput)}`
  }

  const currentYear = new Date().getFullYear()

  // Use provided newsletter text or fallback to defaults
  const newsletterTitle = newsletterSection?.title || 'Stay updated with our newsletter'
  const newsletterDescription =
    newsletterSection?.description ||
    'Subscribe to receive the latest updates on climate and land rights initiatives'
  const newsletterButtonText = newsletterSection?.buttonText || 'Subscribe'

  // Use provided contact info or fallback to defaults
  const address = contactInfo?.address || 'Berlin, Germany'
  const contactEmail = contactInfo?.email || 'contact@netzerolandrights.com'

  // Social media icon mapping
  const socialIcons: Record<string, React.ReactNode> = {
    twitter: <LineiconsX />,
    linkedin: <LineiconsLinkedinOriginal />,
    instagram: <LucideInstagram />,
    bluesky: <RiBlueskyFill />,
  }

  // Create separate arrays for Publication and About columns
  const publicationLinks =
    navItems?.filter(({ link }) => {
      // Check if reference exists and has a value with a slug
      const slug =
        link.reference?.value &&
        typeof link.reference.value === 'object' &&
        'slug' in link.reference.value
          ? link.reference.value.slug
          : null

      // Filter out links to about or contact pages
      return !(slug === 'about' || slug === 'contact')
    }) || []

  const aboutLinks =
    navItems?.filter(({ link }) => {
      // Check if reference exists and has a value with a slug
      const slug =
        link.reference?.value &&
        typeof link.reference.value === 'object' &&
        'slug' in link.reference.value
          ? link.reference.value.slug
          : null

      // Include only links to about or contact pages
      return slug === 'about' || slug === 'contact'
    }) || []

  return (
    <div className="relative overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="relative z-10"
      >
        <div className="container">
          {/* Newsletter subscription section */}
          <motion.div
            variants={itemVariants}
            className="mb-8 mt-8 bg-dark-blue/60 backdrop-blur-xs rounded-lg relative flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-16 items-center"
          >
            <div className="relative w-full h-32 md:h-48 order-first md:order-last md:w-1/3">
              <Image
                src={Illustration}
                alt="Illustration"
                fill
                className="opacity-70 object-contain"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-4">
                {newsletterTitle}
              </h3>
              <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base">
                {newsletterDescription}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="grow relative">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Your email address"
                      className={cn(
                        'w-full px-4 py-2.5 rounded-md border border-blue/20 bg-dark-blue/50 text-white',
                        'focus:outline-hidden focus:ring-2 focus:ring-petrol/50 focus:border-petrol transition-all duration-200',
                      )}
                      disabled={isSubmitting || submitStatus === 'success'}
                    />
                    {submitStatus === 'success' && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckIcon size={18} className="text-green-500" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    color="petrol"
                    icon={<SendIcon size={16} />}
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="px-5 min-w-[120px]"
                    variant="rounded"
                  >
                    {isSubmitting
                      ? 'Subscribing...'
                      : submitStatus === 'success'
                        ? 'Subscribed!'
                        : newsletterButtonText}
                  </Button>
                </div>

                {/* Error message */}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success message */}
                {submitStatus === 'success' && (
                  <p className="text-sm text-green-400 flex items-center gap-1">
                    <CheckIcon size={14} />
                    <span>Thank you for subscribing to our newsletter!</span>
                  </p>
                )}
              </form>
            </div>
          </motion.div>

          {/* Main footer content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">
            {/* Logo and about */}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex flex-row md:flex-col items-center sm:items-start gap-4 sm:gap-6 justify-between">
                <Link
                  href="https://tmg-thinktank.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src={TMGLogo}
                    alt="TMG Logo"
                    width={125}
                    height={75}
                    className="object-contain "
                  />
                </Link>
                <Link
                  href="https://www.bosch-stiftung.de/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-100 hover:opacity-80 transition-opacity duration-300"
                >
                  <Image
                    src={RBSLogo}
                    alt="RBS Logo"
                    width={150}
                    height={75}
                    className="object-contain "
                  />
                </Link>
              </div>
            </motion.div>

            {/* Quick links */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg border-b border-blue/20 pb-2">
                Publication
              </h4>
              <nav className="flex flex-col gap-2 sm:gap-3">
                {publicationLinks.map(({ link }, i) => (
                  <CMSLink
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-colors duration-200 group text-sm sm:text-base"
                    key={i}
                    {...getModifiedLink(link)}
                  >
                    <span>{link.label}</span>
                  </CMSLink>
                ))}
              </nav>
            </motion.div>

            {/* More links */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg border-b border-blue/20 pb-2">
                Legal
              </h4>
              <nav className="flex flex-col gap-2 sm:gap-3">
                {legalLinks?.map(({ link }, i) => (
                  <CMSLink
                    className="text-white/80 hover:text-white flex items-center gap-2 transition-colors duration-200 group text-sm sm:text-base"
                    key={i}
                    {...getModifiedLink(link)}
                  >
                    <span>{link.label}</span>
                  </CMSLink>
                ))}
              </nav>
            </motion.div>

            {/* About column */}
            <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-base sm:text-lg border-b border-blue/20 pb-2">
                About
              </h4>
              <div className="flex flex-col gap-3 sm:gap-4 text-white/80 text-sm sm:text-base">
                {aboutLinks.map(({ link }, i) => (
                  <CMSLink
                    key={i}
                    className="flex items-center gap-3 hover:text-white transition-colors"
                    {...getModifiedLink(link)}
                  >
                    <span>{link.label}</span>
                  </CMSLink>
                ))}

                {/* Social media icons */}
                <div className="flex gap-4 pt-1 sm:pt-2">
                  {socialLinks &&
                    socialLinks.length > 0 &&
                    socialLinks.map((social, i) => (
                      <Link
                        key={i}
                        href={social.url}
                        className="text-white/70 hover:text-white transition-colors "
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                      >
                        {socialIcons[social.platform] || <div className="w-6 h-6" />}
                      </Link>
                    ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="border-t border-blue/20 my-6 sm:my-8"
          ></motion.div>

          {/* Bottom section with copyright */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 mb-4 text-center md:text-left"
          >
            <div className="text-xs sm:text-sm text-white/70">
              © {currentYear} Net Zero & Land Rights. All rights reserved.
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Website designed and developed by{' '}
              <Link
                href="https://www.landozone.net"
                className="hover:text-white text-white/80 underline duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                landozone
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
