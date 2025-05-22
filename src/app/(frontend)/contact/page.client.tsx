'use client'

import React from 'react'
import { PageHero } from '@/components/PageHero'
import ContactForm from '@/components/ContactForm'
import type { Contact } from '@/payload-types'
import { motion } from 'motion/react'
import Buildings from '@/assets/buildings.svg'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import { getTextColor } from '@/utilities/getTextColor'
import { PageHeroWithIllustration } from '@/components/PageHeroWithIllustration'

interface ContactPageClientProps {
  contact: Contact | null
}

const ContactPageClient: React.FC<ContactPageClientProps> = ({ contact }) => {
  if (!contact) {
    return null
  }

  const { title, mainColor } = contact

  return (
    <section className="min-h-screen">
      <PageHeroWithIllustration
        title={title}
        mainColor={mainColor}
        illustration={Buildings}
        imageContainerBottomClassName="bottom-0"
      />
      <motion.section
        className="py-12 md:py-24 bg-white min-h-[60vsh]"
        initial={{ y: 30 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <ContactForm page={contact} />
      </motion.section>
    </section>
  )
}

export default ContactPageClient
