'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import RichText from '@/components/RichText'
import { PageHero } from '@/components/PageHero'
import type { Page } from '@/payload-types'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

const PageClient: React.FC<{ page: Page }> = ({ page }) => {
  const { title, mainColor, content } = page
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  return (
    <article>
      <PageHero title={title} mainColor={mainColor} />
      <div className="container mx-auto max-w-5xl py-12 md:py-24">
        <RichText data={content as SerializedEditorState} />
      </div>
    </article>
  )
}

export default PageClient
