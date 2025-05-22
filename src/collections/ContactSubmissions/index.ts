import { CollectionConfig } from 'payload'
import { NextResponse } from 'next/server'

// Define our form data type
interface ContactFormData {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    description: 'Contact form submissions from the website',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'emailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indicates if notification email was sent successfully',
      },
    },
  ],
  endpoints: [
    {
      path: '/submit',
      method: 'post',
      handler: async ({ payload, body }) => {
        try {
          // Parse body properly if it's a ReadableStream
          let formData: ContactFormData = {}

          if (body && typeof body === 'object') {
            if (body instanceof ReadableStream || 'locked' in body) {
              // If it's a ReadableStream, read and parse it
              try {
                const reader = (body as ReadableStream).getReader()
                const chunks: Uint8Array[] = []

                while (true) {
                  const { done, value } = await reader.read()
                  if (done) break
                  chunks.push(value)
                }

                // Combine chunks and decode
                const data = new Uint8Array(
                  chunks.reduce((acc: number[], chunk) => [...acc, ...Array.from(chunk)], []),
                )
                const jsonString = new TextDecoder().decode(data)

                try {
                  formData = JSON.parse(jsonString)
                } catch (parseError) {
                  console.error('Failed to parse stream as JSON:', parseError)
                }
              } catch (streamError) {
                console.error('Error reading stream:', streamError)
              }
            } else {
              // If we have a regular object, use it directly
              formData = body as ContactFormData
            }
          } else if (body && typeof body === 'string') {
            // If we have a string, try to parse it
            try {
              formData = JSON.parse(body)
            } catch (parseError) {
              console.error('Failed to parse body as JSON:', parseError)
            }
          }

          // Extract form fields
          const name = formData.name || ''
          const email = formData.email || ''
          const phone = formData.phone || ''
          const message = formData.message || ''

          // Validate required fields
          if (!name || !email || !message) {
            return NextResponse.json(
              { message: 'Name, email, and message are required' },
              { status: 400 },
            )
          }

          // Create submission
          const submission = await payload.create({
            collection: 'contact-submissions',
            data: {
              name,
              email,
              phone: phone || undefined,
              message,
              emailSent: false,
            },
          })

          // Send email
          try {
            // Check if Brevo API key is configured
            if (!process.env.BREVO_API_KEY) {
              console.error('BREVO_API_KEY environment variable is missing')
            }

            // Send the email
            await payload.sendEmail({
              from: process.env.EMAIL_FROM || 'TMG Think Tank',
              to: process.env.CONTACT_EMAIL || 'joanna.trimble@tmg-thinktank.com',
              subject: 'New Contact Form Submission',
              replyTo: email,
              html: `
                <h2>Net Zero & Land Rights | New contact form submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <h3>Message:</h3>
                <p>${message.replace(/\n/g, '<br />')}</p>
              `,
            })

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

          return NextResponse.json({
            success: true,
            message: "Thank you for your message. We'll be in touch soon.",
          })
        } catch (error) {
          console.error('Error processing contact submission:', error)
          return NextResponse.json({ message: 'Failed to process your request' }, { status: 500 })
        }
      },
    },
  ],
}
