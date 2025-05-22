'use client'

import React, { useState, useEffect } from 'react'
import ResourceTabs, { ResourceTab } from './ResourceTabs'
import FiguresTab from './FiguresTab'
import VideosTab from './VideosTab'
import PublicationsTab from './PublicationsTab'
import WebPagesTab from './WebPagesTab'
import { FigureSlide } from '@/contexts/FiguresContext'
import type { Resource } from '@/payload-types'
import RichText from '@/components/RichText'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'
import { ColorType } from '@/app/(frontend)/resources/page.client'
import { motion } from 'motion/react'
import { Loader2, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { usePublication } from '@/providers/PublicationProvider'

type ResourceItem = NonNullable<Resource['additionalResources']>[number]
type WebPageResource = ResourceItem & { resourceType: 'webPage' }
type VideoResource = ResourceItem & { resourceType: 'video' }
type PublicationResource = ResourceItem & { resourceType: 'publication' }

interface ResourceExplorerProps {
  figures: FigureSlide[]
  videoResources: (VideoResource | any)[]
  webPageResources: (WebPageResource | any)[]
  publicationResources: (PublicationResource | any)[]
  onOpenVideo: (videoUrl: string) => void
  onDownloadAllFigures: () => void
  isDownloading: boolean
  text: SerializedEditorState<SerializedLexicalNode>
  mainColor?: ColorType
  publicationDownloadButtonText?: string
}

const ResourceExplorer: React.FC<ResourceExplorerProps> = ({
  figures = [],
  videoResources = [],
  webPageResources = [],
  publicationResources = [],
  onOpenVideo,
  onDownloadAllFigures,
  isDownloading,
  text,
  mainColor = 'red',
  publicationDownloadButtonText,
}) => {
  const [activeTab, setActiveTab] = useState<ResourceTab>('figures')
  const [isTabChanging, setIsTabChanging] = useState(false)
  const publication = usePublication()

  // Find first non-empty resource type for initial tab
  useEffect(() => {
    if (figures.length > 0) {
      setActiveTab('figures')
    } else if (videoResources.length > 0) {
      setActiveTab('videos')
    } else if (webPageResources.length > 0) {
      setActiveTab('webPages')
    } else if (publicationResources.length > 0) {
      setActiveTab('publications')
    }
  }, [figures, videoResources, webPageResources, publicationResources])

  const handleTabChange = (tab: ResourceTab) => {
    if (tab !== activeTab) {
      setIsTabChanging(true)
      setTimeout(() => {
        setActiveTab(tab)
        setTimeout(() => setIsTabChanging(false), 100)
      }, 150)
    }
  }

  // Check if we have any resources at all
  const hasResources =
    figures.length > 0 ||
    videoResources.length > 0 ||
    webPageResources.length > 0 ||
    publicationResources.length > 0

  if (!hasResources) {
    return null
  }

  return (
    <section className=" bg-beige/60 ">
      <motion.div
        className="py-12 md:py-24 container mx-auto px-4 max-w-5xl flex flex-col items-center"
        initial={{ y: 30 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto pb-8 flex justify-center">
          <Link
            href={
              typeof publication?.file === 'object' && publication.file?.url
                ? publication.file.url
                : '#'
            }
            target="_blank"
          >
            <Button color="dark-blue" variant="rounded" icon={<Download size={24} />} asChild>
              {publicationDownloadButtonText}
            </Button>
          </Link>
        </div>

        {text && (
          <div className="text-xl mb-6 text-center">
            <RichText data={text} />
          </div>
        )}

        <ResourceTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          figureCount={figures.length}
          videoCount={videoResources.length}
          webPageCount={webPageResources.length}
          publicationCount={publicationResources.length}
          mainColor={mainColor}
        />

        <div className="mt-4 min-h-[400px] w-full relative">
          {isTabChanging && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 z-10">
              <Loader2 className={`animate-spin h-10 w-10 text-${mainColor}`} />
            </div>
          )}

          <div
            className={`transition-opacity duration-150 ${isTabChanging ? 'opacity-10' : 'opacity-100'}`}
          >
            {activeTab === 'figures' && figures.length > 0 && (
              <FiguresTab
                figures={figures}
                onDownloadAllFigures={onDownloadAllFigures}
                isDownloading={isDownloading}
                mainColor={mainColor}
              />
            )}

            {activeTab === 'videos' && videoResources.length > 0 && (
              <VideosTab videos={videoResources} onOpenVideo={onOpenVideo} mainColor={mainColor} />
            )}

            {activeTab === 'webPages' && webPageResources.length > 0 && (
              <WebPagesTab webPages={webPageResources} mainColor={mainColor} />
            )}

            {activeTab === 'publications' && publicationResources.length > 0 && (
              <PublicationsTab publications={publicationResources} mainColor={mainColor} />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default ResourceExplorer
