'use client'

import React, { useEffect, useState } from 'react'
import { Play, X } from 'lucide-react'
import type { Resource } from '@/payload-types'
import { ColorType } from '@/app/(frontend)/resources/page.client'
import RichText from '@/components/RichText'
import { useFigures } from '@/contexts/FiguresContext'
import Image from 'next/image'
import { ImageMedia } from '../Media/ImageMedia'
type VideoResource = NonNullable<Resource['additionalResources']>[number] & {
  resourceType: 'video'
}

interface VideosTabProps {
  videos: VideoResource[]
  onOpenVideo: (videoUrl: string) => void
  mainColor: ColorType
}

export const VideosTab: React.FC<VideosTabProps> = ({ videos, onOpenVideo, mainColor }) => {
  const [playingVideoIds, setPlayingVideoIds] = useState<Record<number, boolean>>({})

  // Function to toggle playing state for a specific video
  const toggleVideo = (index: number, video: VideoResource, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent event bubbling
    if (video.link) {
      setPlayingVideoIds((prev) => ({
        ...prev,
        [index]: !prev[index],
      }))
    }
  }

  // Function to convert YouTube links to embed format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    } else if (url.includes('youtu.be')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    } else if (url.includes('vimeo.com')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`
    }
    return url
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ul className="space-y-6">
        {videos.map((video, index) => (
          <li key={index} className={` rounded-lg  shadow-xs cursor-pointer `}>
            {/* Video container */}
            <div className="group relative">
              {/* Video thumbnail or iframe */}
              <div className="aspect-video w-full relative ">
                {playingVideoIds[index] ? (
                  <iframe
                    src={getEmbedUrl(video.link as string)}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    {video.thumbnail ? (
                      <div className="relative w-full h-full  overflow-hidden flex items-center justify-center aspect-video">
                        <ImageMedia
                          resource={video.thumbnail}
                          alt={video.title || ''}
                          fill
                          imgClassName="object-contain aspect-video"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <span className="text-white opacity-70">Video</span>
                      </div>
                    )}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={(e) => toggleVideo(index, video, e)}
                        className={`w-16 h-16 flex items-center justify-center rounded-full bg-white/90 text-${mainColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Play className="w-8 h-8 ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Video info */}
              <div className="p-4 bg-white/60 space-y-3">
                <h3 className="text-base lg:text-lg font-medium ">{video.title}</h3>

                {/* Chapter information */}
                {video.chapter && (
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs bg-beige text-gray-700 rounded-md">
                      {typeof video.chapter === 'object' && video.chapter?.chapterNumber
                        ? `From Chapter ${video.chapter.chapterNumber} | ${video.chapter.title}`
                        : typeof video.chapter === 'object' && video.chapter?.title
                          ? `From: ${video.chapter.title}`
                          : 'Related Resource'}
                    </span>
                  </div>
                )}

                {video.description && (
                  <div className="text-gray-700 mt-2">
                    <RichText data={video.description} className="small-text" enableProse={false} />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default VideosTab
