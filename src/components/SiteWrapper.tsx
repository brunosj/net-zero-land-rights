'use client'

import React from 'react'

interface SiteWrapperProps {
  children: React.ReactNode
}

export const SiteWrapper: React.FC<SiteWrapperProps> = ({ children }) => {
  return <>{children}</>
}
