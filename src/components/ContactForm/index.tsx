'use client'

import React, { useState } from 'react'
import { submitContactForm } from '@/app/actions'
import type { Contact } from '@/payload-types'
import {
  FormLayout,
  FormHeader,
  FormField,
  StatusMessage,
  SubmitButton,
} from '@/components/FormComponents'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface FormData {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactFormProps {
  page: Contact
}

const ContactForm: React.FC<ContactFormProps> = ({ page }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  // Get the mainColor from the page or default to blue-green
  const mainColor = page.mainColor || 'blue-green'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset status and set submitting state
    setIsSubmitting(true)
    setStatus({})

    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        success: false,
        message: 'Please fill in all required fields.',
      })
      setIsSubmitting(false)
      return
    }

    // Prepare clean data
    const cleanData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    }

    try {
      const result = await submitContactForm(cleanData)

      if (result.success) {
        // Handle success
        setStatus({
          success: true,
          message: result.message || 'Thank you! Your message has been sent.',
        })
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        // Handle error
        setStatus({
          success: false,
          message: result.error || 'Failed to send message. Please try again.',
        })
      }
    } catch (error) {
      void error // This satisfies the linter by using the variable
      // Handle network/unexpected errors
      setStatus({
        success: false,
        message: 'Connection error. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <FormHeader
        title={page.callToActionText || 'Contact Us'}
        content={page.content as SerializedEditorState}
        mainColor={mainColor}
      />

      <FormLayout mainColor={mainColor} onSubmit={handleSubmit}>
        <div className="space-y-8">
          <FormField
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            label="Your Name"
            required
            mainColor={mainColor}
            animationDelay={0.2}
            animateFrom="left"
          />

          <FormField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Your Email"
            required
            mainColor={mainColor}
            animationDelay={0.3}
            animateFrom="left"
          />

          <FormField
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            label="Phone Number"
            mainColor={mainColor}
            animationDelay={0.4}
            animateFrom="left"
          />
        </div>

        <div className="relative flex flex-col h-full">
          <FormField
            id="message"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            label="Your Message"
            required
            mainColor={mainColor}
            animationDelay={0.2}
            animateFrom="right"
          />
        </div>

        {status.message && <StatusMessage success={status.success} message={status.message} />}

        <SubmitButton
          isSubmitting={isSubmitting}
          text="Send Message"
          loadingText="Sending..."
          mainColor={mainColor}
          fullWidth
        />
      </FormLayout>
    </>
  )
}

export default ContactForm
