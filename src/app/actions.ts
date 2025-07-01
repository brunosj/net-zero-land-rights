'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import * as brevo from '@getbrevo/brevo'

interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

interface NewsletterFormData {
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

interface SubmitResponse {
  success: boolean
  message?: string
  error?: string
}

export async function submitContactForm(data: ContactFormData): Promise<SubmitResponse> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        error: 'Name, email, and message are required',
      }
    }

    // Initialize Payload
    const payload = await getPayload({ config: configPromise })

    // Create submission directly using local API
    const submission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        message: data.message,
        emailSent: false,
      },
    })

    // Send email
    try {
      // Check if Brevo API key is configured
      const BREVO_API_KEY = process.env.BREVO_API_KEY

      if (!BREVO_API_KEY) {
        console.error('BREVO_API_KEY environment variable is missing')
        return {
          success: true,
          message: "Thank you for your message. We'll be in touch soon.",
        }
      }

      // Create and initialize Brevo API client
      let apiInstance = new brevo.TransactionalEmailsApi()
      // @ts-ignore
      let apiKey = apiInstance.authentications['apiKey']
      apiKey.apiKey = BREVO_API_KEY

      // Create send email request
      const sendSmtpEmail = new brevo.SendSmtpEmail()

      sendSmtpEmail.sender = {
        name: process.env.EMAIL_FROM || 'Net Zero & Land Rights',
        email: process.env.CONTACT_EMAIL || 'comms@tmg-thinktank.com',
      }

      sendSmtpEmail.to = [
        {
          email: process.env.CONTACT_EMAIL || 'comms@tmg-thinktank.com',
          name: 'TMG Think Tank',
        },
      ]

      sendSmtpEmail.replyTo = {
        email: data.email,
        name: data.name,
      }

      sendSmtpEmail.subject = 'New Contact Form Submission'

      sendSmtpEmail.htmlContent = `
        <h2>Net Zero & Land Rights | New contact form submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, '<br />')}</p>
      `

      // Send the email using Brevo API
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail)

      // Update submission to reflect email was sent
      if (submission?.id) {
        await payload.update({
          collection: 'contact-submissions',
          id: submission.id,
          data: {
            emailSent: true,
          },
        })
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError)
    }

    return {
      success: true,
      message: "Thank you for your message. We'll be in touch soon.",
    }
  } catch (error) {
    console.error('Error processing contact submission:', error)
    return {
      success: false,
      error: 'Failed to process your request',
    }
  }
}

export async function submitNewsletterForm(data: NewsletterFormData): Promise<SubmitResponse> {
  try {
    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.country ||
      !data.professionalBackground ||
      !data.seniorityLevel
    ) {
      return {
        success: false,
        error: 'All required fields must be filled',
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        error: 'Invalid email format',
      }
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const BREVO_LIST_ID = process.env.NEXT_PUBLIC_BREVO_LIST_ID

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY environment variable is not set')
      return {
        success: false,
        error: 'Newsletter service configuration error',
      }
    }

    // Initialize the API client
    let apiInstance = new brevo.ContactsApi()
    // @ts-ignore
    let apiKey = apiInstance.authentications['apiKey']
    apiKey.apiKey = BREVO_API_KEY

    try {
      // Create contact with all the fields
      const createContact = new brevo.CreateContact()
      createContact.email = data.email
      createContact.listIds = BREVO_LIST_ID ? [parseInt(BREVO_LIST_ID)] : []
      createContact.updateEnabled = true

      // Add all the additional attributes
      createContact.attributes = {
        FIRSTNAME: data.firstName,
        LASTNAME: data.lastName,
        COUNTRY: data.country,
        PROFESSIONAL_BACKGROUND: data.professionalBackground,
        JOB_TITLE: data.jobTitle || '',
        ORGANISATION: data.organization || '',
        SENIORITY_LEVEL: data.seniorityLevel,
      } as any

      // Call Brevo API to create/update contact
      await apiInstance.createContact(createContact)

      return {
        success: true,
        message: 'Thank you for subscribing to our newsletter!',
      }
    } catch (brevoError: any) {
      console.error('Brevo API error:', brevoError)

      // Handle specific Brevo API errors
      if (
        typeof brevoError === 'object' &&
        brevoError !== null &&
        'response' in brevoError &&
        typeof brevoError.response === 'object' &&
        brevoError.response !== null &&
        'text' in brevoError.response
      ) {
        try {
          const apiError = JSON.parse(brevoError.response.text as string)

          if (apiError.code === 'duplicate_parameter') {
            return {
              success: false,
              error: 'This email is already subscribed',
            }
          }
        } catch {
          console.error('Failed to parse API error response')
        }
      }

      return {
        success: false,
        error: 'An error occurred while subscribing to the newsletter. Please try again later.',
      }
    }
  } catch (error) {
    console.error('Error processing newsletter subscription:', error)
    return {
      success: false,
      error: 'Failed to process your subscription request. Please try again later.',
    }
  }
}
