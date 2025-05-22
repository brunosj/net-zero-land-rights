import type { Metadata } from 'next'

import './globals.css'
import { cn } from 'src/utilities/cn'
import React from 'react'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Chapter, Header as HeaderType, Publication } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { Menu } from '@/components/Menu/Component'
import { getCachedDocs } from '@/utilities/getDocument'
import { Footer } from '@/Footer/Component'
import { SiteWrapper } from '@/components/SiteWrapper'
import localFont from 'next/font/local'

const Inter = localFont({
  src: '../../assets/fonts/Inter-VariableFont_slnt,wght.ttf',
  variable: '--font-sans',
})

const Menlo = localFont({
  src: '../../assets/fonts/Menlo-Regular.ttf',
  variable: '--font-mono',
})

async function fetchLayoutData() {
  try {
    const { isEnabled } = await draftMode()
    const header = (await getCachedGlobal('header', 1).catch(() => null)) as HeaderType | null
    const publication = (await getCachedGlobal('publication', 2).catch(
      () => null,
    )) as Publication | null
    const chapters = (await getCachedDocs('chapters').catch(() => [])) as Chapter[]

    return {
      isEnabled,
      header,
      publication,
      chapters,
    }
  } catch (error) {
    console.error('Error fetching layout data:', error)
    // Return fallback data
    return {
      isEnabled: false,
      header: null,
      publication: null,
      chapters: [],
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled, header, publication, chapters } = await fetchLayoutData()

  return (
    <html className={cn(Inter.variable, Menlo.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers publication={publication || ({} as Publication)}>
          <SiteWrapper>
            {header && <Menu header={header} chapters={chapters} />}
            <main className="flex-grow relative">{children}</main>
            <Footer />
          </SiteWrapper>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@brunosj',
  },
}
