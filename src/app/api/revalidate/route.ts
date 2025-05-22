import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Set a secret token to prevent unauthorized revalidation requests
const revalidateSecret = process.env.REVALIDATE_SECRET || 'default_secret_change_me'

export async function POST(request: NextRequest) {
  return handleRevalidation(request)
}

export async function GET(request: NextRequest) {
  return handleRevalidation(request)
}

async function handleRevalidation(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const tag = searchParams.get('tag')

    // Validate the secret
    if (secret !== revalidateSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Validate the tag
    if (!tag) {
      return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 })
    }

    // Revalidate the tag
    revalidateTag(tag)

    return NextResponse.json({
      revalidated: true,
      message: `Revalidated tag: ${tag}`,
      date: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error during revalidation:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: (error as Error).message },
      { status: 500 },
    )
  }
}
