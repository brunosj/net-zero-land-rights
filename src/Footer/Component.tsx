import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Footer } from '@/payload-types'
import { FooterClient } from './Component.client'

export async function Footer() {
  const footer = (await getCachedGlobal('footer', 1).catch(() => null)) as Footer | null
  const navItems = footer?.navItems || []
  const contactInfo = footer?.contactInfo
  const socialLinks = footer?.socialLinks
  const newsletterSection = footer?.newsletterSection
  const legalLinks = footer?.legalLinks

  return (
    <footer className="bg-dark-blue text-white relative">
      <FooterClient
        navItems={navItems}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
        newsletterSection={newsletterSection}
        legalLinks={legalLinks}
      />
    </footer>
  )
}
