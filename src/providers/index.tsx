import React from 'react'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { MotionConfigProvider } from './MotionConfig'
import { PublicationProvider } from './PublicationProvider'
import PlausibleProvider from 'next-plausible'
import type { Publication } from '@/payload-types'

export const Providers: React.FC<{
  children: React.ReactNode
  publication: Publication
}> = ({ children, publication }) => {
  return (
    <PlausibleProvider domain="netzerolandrights.com">
      <ThemeProvider>
        <HeaderThemeProvider>
          <PublicationProvider publication={publication}>
            <MotionConfigProvider>{children}</MotionConfigProvider>
          </PublicationProvider>
        </HeaderThemeProvider>
      </ThemeProvider>
    </PlausibleProvider>
  )
}
