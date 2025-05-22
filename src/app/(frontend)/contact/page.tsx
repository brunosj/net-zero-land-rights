import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React from 'react'

import type { Contact } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
// import { LivePreviewListener } from '@/components/LivePreviewListener'
import ContactPageClient from './page.client'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const contact = await queryContact()
  if (!contact) {
    return {
      title: 'Contact | Net Zero & Land Rights',
    }
  }
  return generateMeta({ doc: contact })
}

export default async function ContactPage() {
  const contact = await queryContact()

  if (!contact) {
    return notFound()
  }

  return (
    <>
      {/* <LivePreviewListener /> */}
      <ContactPageClient contact={contact} />
    </>
  )
}

async function queryContact(): Promise<Contact | null> {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'contact',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
  })

  return result.docs?.[0] || null
}
