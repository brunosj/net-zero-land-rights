'use client'

import React from 'react'
import { Book, FileText, Image as ImageIcon, Video, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ColorType } from '@/app/(frontend)/resources/page.client'

// Tab options for resource explorer
export type ResourceTab = 'figures' | 'videos' | 'webPages' | 'publications'

interface ResourceTabsProps {
  activeTab: ResourceTab
  setActiveTab: (tab: ResourceTab) => void
  figureCount: number
  videoCount: number
  webPageCount: number
  publicationCount: number
  mainColor: ColorType
}

const ResourceTabs: React.FC<ResourceTabsProps> = ({
  activeTab,
  setActiveTab,
  figureCount,
  videoCount,
  webPageCount,
  publicationCount,
  mainColor,
}) => {
  return (
    <>
      {/* Tabs for different resource types */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:border-b mb-3 lg:mb-6 justify-center">
        {figureCount > 0 && (
          <Button
            variant="tab"
            color={mainColor}
            onClick={() => setActiveTab('figures')}
            active={activeTab === 'figures'}
            icon={<ImageIcon size={16} />}
          >
            <span className="hidden lg:block mr-1">Figures</span>({figureCount})
          </Button>
        )}

        {videoCount > 0 && (
          <Button
            variant="tab"
            color={mainColor}
            onClick={() => setActiveTab('videos')}
            active={activeTab === 'videos'}
            icon={<Video size={16} />}
          >
            <span className="hidden lg:block mr-1">Videos</span> ({videoCount})
          </Button>
        )}

        {webPageCount > 0 && (
          <Button
            variant="tab"
            color={mainColor}
            onClick={() => setActiveTab('webPages')}
            active={activeTab === 'webPages'}
            icon={<Globe size={16} />}
          >
            <span className="hidden lg:block mr-1">Web Pages</span> ({webPageCount})
          </Button>
        )}

        {publicationCount > 0 && (
          <Button
            variant="tab"
            color={mainColor}
            onClick={() => setActiveTab('publications')}
            active={activeTab === 'publications'}
            icon={<Book size={16} />}
          >
            <span className="hidden lg:block mr-1">Publications</span> ({publicationCount})
          </Button>
        )}
      </div>
    </>
  )
}

export default ResourceTabs
