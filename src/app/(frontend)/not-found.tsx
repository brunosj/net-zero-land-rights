import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="bg-beige">
      <div className="min-h-[50vh] flex flex-col justify-center items-center">
        <div className="prose max-w-none">
          <h1 className="text-4xl font-bold">Oops!</h1>
          <p className="mb-4">This page could not be found.</p>
        </div>
        <Link href="/">
          <Button asChild variant="rounded" arrowPosition="left" color="dark-blue">
            Return to homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
