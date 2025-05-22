'use client'

import type { BannerBlock } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React, { useState } from 'react'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SendIcon, CheckIcon, AlertCircle } from 'lucide-react'
import { Media as MediaComponent } from '@/components/Media'
import { motion } from 'motion/react'
import { getTextColor } from '@/utilities/getTextColor'

type Props = {
  className?: string
  title: string
  // backgroundColor: BannerBlock['backgroundColor']
  buttonText: string
  externalLink?: string | null
  image?: BannerBlock['image']
  color?: string
}

export const NewsletterBanner: React.FC<Props> = ({
  className,
  title,
  // backgroundColor,
  buttonText,
  externalLink,
  image,
  color,
}) => {
  // Use passed color or fallback to backgroundColor from the block
  const bgColor = color

  // State for the email input
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Handle email submission - will redirect to newsletter page
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubmitStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    // Instead of submitting directly, redirect to the newsletter page with email as query param
    window.location.href = `/newsletter?email=${encodeURIComponent(email)}`
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background gradient and decorative elements */}
      <div className={`absolute inset-0 bg-${bgColor}/10  backdrop-blur-[1px] z-0`}></div>
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-${bgColor} via-${bgColor}/60 to-transparent`}
      ></div>
      <div
        className={`absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-${bgColor}/20 blur-xl`}
      ></div>

      <div className="relative z-10 p-6 md:p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Content */}
          <div className="flex-1 flex flex-col items-center md:items-start space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h3 className={`text-xl md:text-2xl font-semibold text-black`}>{title}</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4"
            >
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="grow relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className={`w-full px-4 py-2.5 rounded-md border border-${bgColor} focus:outline-hidden focus:ring-2 focus:ring-${bgColor}/50 focus:border-${bgColor} transition-all duration-200`}
                      disabled={isSubmitting || submitStatus === 'success'}
                    />
                    {submitStatus === 'success' && (
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <CheckIcon size={18} className="text-green-500" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    color={bgColor as any}
                    icon={<SendIcon size={16} />}
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="px-5 min-w-[120px]"
                    variant="outline"
                  >
                    {isSubmitting
                      ? 'Subscribing...'
                      : submitStatus === 'success'
                        ? 'Subscribed!'
                        : buttonText || 'Subscribe'}
                  </Button>
                </div>

                {/* Error message */}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success message */}
                {submitStatus === 'success' && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckIcon size={14} />
                    <span>Thank you for subscribing to our newsletter!</span>
                  </p>
                )}
              </form>
            </motion.div>

            {/* External link option */}
            {externalLink && submitStatus !== 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-2 text-sm"
              >
                <span className="text-gray-500">or </span>
                <Link
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-${bgColor} hover:underline font-medium`}
                >
                  sign up on our website
                </Link>
              </motion.div>
            )}
          </div>

          {/* Image (if available) */}
          {image && typeof image !== 'string' && image.url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="shrink-0 relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shadow-md"
            >
              <MediaComponent
                resource={image}
                alt={title || 'Newsletter image'}
                className="object-cover"
                fill
              />
              <div
                className={`absolute inset-0 bg-linear-to-bl from-${bgColor}/30 to-transparent mix-blend-overlay`}
              ></div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
