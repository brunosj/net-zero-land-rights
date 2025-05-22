import React from 'react'
import { formatDate } from '@/utilities/formatDate'

interface MediaItemHeroProps {
  title: string
  date: string
  type: string
}

export const MediaItemHero: React.FC<MediaItemHeroProps> = ({ title, date, type }) => {
  return (
    <div className="relative bg-dark-blue text-white py-16 md:py-24">
      <div className="container relative z-10">
        <div className="max-w-3xl">
          <div className="text-sm text-light-blue mb-4">
            {formatDate(date)} | {type}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-blue/80 to-dark-blue/40" />
    </div>
  )
}
