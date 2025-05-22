import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // This API endpoint is now deprecated in favor of the server action
  // Redirect any direct API calls to the newsletter page

  try {
    const body = await request.json()
    const { email } = body

    if (email) {
      return NextResponse.redirect(
        new URL(`/newsletter?email=${encodeURIComponent(email)}`, request.url),
      )
    }

    return NextResponse.redirect(new URL('/newsletter', request.url))
  } catch (error) {
    return NextResponse.redirect(new URL('/newsletter', request.url))
  }
}
