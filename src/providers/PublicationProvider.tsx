'use client'

import React, { createContext, useContext } from 'react'
import type { Publication } from '@/payload-types'

// Create the context with null as initial value
const PublicationContext = createContext<Publication | null>(null)

// Provider component
export function PublicationProvider({
  children,
  publication,
}: {
  children: React.ReactNode
  publication: Publication
}) {
  return <PublicationContext.Provider value={publication}>{children}</PublicationContext.Provider>
}

// Hook to use the publication data
export function usePublication() {
  const context = useContext(PublicationContext)
  if (!context) {
    console.warn('usePublication must be used within a PublicationProvider')
  }
  return context
}
