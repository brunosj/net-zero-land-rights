import React from 'react'
import RichText from '@/components/RichText'
import type { Homepage } from '@/payload-types'
import Title from '@/assets/title.svg'
import Image from 'next/image'
import Trees from '@/assets/trees_large_right.svg'
import { motion } from 'motion/react'

interface HeroProps {
  data: Homepage['heroSection']
}

export const Hero: React.FC<HeroProps> = ({ data }) => {
  const { heroSubtitle } = data

  return (
    <section className="bg-light-green text-dark-blue min-h-[90svh] lg:min-h-[100svh] lg:h-[100svh] md:h-[90svh] relative">
      <div className="absolute inset-x-0 bottom-0 w-full">
        <Image src={Trees} alt="Trees" className="w-full h-auto object-contain" priority />
      </div>
      <div className="container flex pt-16 md:pt-24 h-full relative z-10">
        <div className="max-w-[50rem]">
          <motion.div
            className="relative h-64 lg:h-96"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Image src={Title} alt="Title" fill className="object-contain object-left" priority />
          </motion.div>
          <motion.div
            className="w-4/5 lg:w-3/5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <h3 className="-mt-6 md:mt-6  text-xl lg:text-4xl font-medium">{heroSubtitle}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
