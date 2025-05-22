'use client'

import React, { useState, useEffect } from 'react'
import { submitNewsletterForm } from '@/app/actions'
import { useSearchParams } from 'next/navigation'
import { SendIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Newsletter } from '@/payload-types'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  FormLayout,
  FormHeader,
  FormField,
  StatusMessage,
  SubmitButton,
  ConsentCheckbox,
} from '@/components/FormComponents'
import RichText from '@/components/RichText'

// Define form data structure
interface FormData {
  firstName: string
  lastName: string
  email: string
  country: string
  professionalBackground: string
  jobTitle: string
  organization: string
  seniorityLevel: string
  gdprConsent: boolean
}

interface NewsletterFormProps {
  page: Newsletter
}

const professionalBackgroundOptions = [
  { value: 'government', label: 'Government / Public Sector' },
  { value: 'intergovernmental', label: 'Intergovernmental / Multilateral Organization' },
  { value: 'ngo_national', label: 'National or Local NGO' },
  { value: 'ngo_international', label: 'International NGO' },
  { value: 'academia', label: 'Academia / Research' },
  { value: 'business', label: 'Business / Private Sector' },
  { value: 'community', label: 'Community-Based Organization' },
  { value: 'philanthropy', label: 'Philanthropy' },
  { value: 'media', label: 'Media' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
]

const seniorityLevelOptions = [
  { value: 'entry', label: 'Entry-level' },
  { value: 'mid', label: 'Mid-level' },
  { value: 'senior', label: 'Senior-level' },
  { value: 'executive', label: 'Executive' },
]

const NewsletterForm: React.FC<NewsletterFormProps> = ({ page }) => {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: searchParams?.get('email') || '',
    country: '',
    professionalBackground: '',
    jobTitle: '',
    organization: '',
    seniorityLevel: '',
    gdprConsent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{
    success?: boolean
    message?: string
  }>({})

  const mainColor = page.mainColor || 'blue-green'

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset status and set submitting state
    setIsSubmitting(true)
    setStatus({})

    // Form validation
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.country ||
      !formData.professionalBackground ||
      !formData.seniorityLevel ||
      !formData.gdprConsent
    ) {
      setStatus({
        success: false,
        message: 'Please fill in all required fields and accept the privacy policy.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await submitNewsletterForm(formData)

      if (result.success) {
        // Handle success
        setStatus({
          success: true,
          message: result.message || 'Thank you! You have been subscribed to our newsletter.',
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          country: '',
          professionalBackground: '',
          jobTitle: '',
          organization: '',
          seniorityLevel: '',
          gdprConsent: false,
        })
      } else {
        // Handle error
        setStatus({
          success: false,
          message: result.error || 'Failed to subscribe. Please try again.',
        })
      }
    } catch (error) {
      void error
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
        title={page.callToActionText || 'Subscribe to our Newsletter'}
        content={page.content as SerializedEditorState}
        mainColor={mainColor}
      />

      <FormLayout mainColor={mainColor} onSubmit={handleSubmit}>
        {/* Left Column */}
        <div className="space-y-8">
          <FormField
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            label="First Name"
            required
            mainColor={mainColor}
            animationDelay={0.2}
            animateFrom="left"
          />

          <FormField
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            label="Last Name"
            required
            mainColor={mainColor}
            animationDelay={0.3}
            animateFrom="left"
          />

          <FormField
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            required
            mainColor={mainColor}
            animationDelay={0.4}
            animateFrom="left"
          />

          <FormField
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            label="Country of Residence"
            // required
            mainColor={mainColor}
            animationDelay={0.5}
            animateFrom="left"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <FormField
            id="professionalBackground"
            name="professionalBackground"
            type="select"
            value={formData.professionalBackground}
            onChange={handleChange}
            label="Professional Background"
            // required
            options={professionalBackgroundOptions}
            mainColor={mainColor}
            animationDelay={0.2}
            animateFrom="right"
          />

          <FormField
            id="jobTitle"
            name="jobTitle"
            type="text"
            value={formData.jobTitle}
            onChange={handleChange}
            label="Job Title"
            mainColor={mainColor}
            animationDelay={0.3}
            animateFrom="right"
          />

          <FormField
            id="organization"
            name="organization"
            type="text"
            value={formData.organization}
            onChange={handleChange}
            label="Workplace / Organization"
            mainColor={mainColor}
            animationDelay={0.4}
            animateFrom="right"
          />

          <FormField
            id="seniorityLevel"
            name="seniorityLevel"
            type="select"
            value={formData.seniorityLevel}
            onChange={handleChange}
            label="Seniority Level"
            // required
            options={seniorityLevelOptions}
            mainColor={mainColor}
            animationDelay={0.5}
            animateFrom="right"
          />
        </div>

        {/* GDPR Consent - Full width */}
        <div className="col-span-1 md:col-span-2">
          <ConsentCheckbox
            id="gdprConsent"
            name="gdprConsent"
            checked={formData.gdprConsent}
            onChange={handleCheckboxChange}
            mainColor={mainColor}
            required
          >
            <RichText data={page.checkboxText as SerializedEditorState} />
          </ConsentCheckbox>
        </div>

        {/* Status Message */}
        {(status.success !== undefined || status.message) && (
          <StatusMessage success={status.success} message={status.message} />
        )}

        {/* Submit Button */}
        <SubmitButton
          isSubmitting={isSubmitting}
          text="Subscribe to Newsletter"
          loadingText="Subscribing..."
          mainColor={mainColor}
          icon={<SendIcon size={16} />}
          className="px-6 py-2.5  "
          fullWidth
        />
      </FormLayout>
    </>
  )
}

export default NewsletterForm
