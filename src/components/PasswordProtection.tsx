'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface PasswordProtectionProps {
  children: React.ReactNode
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  // Check if already authenticated from localStorage
  useEffect(() => {
    setIsMounted(true)
    const authenticated = localStorage.getItem('siteAuthenticated')
    if (authenticated === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Use environment variable or fallback to default password
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'landrightsaccess'

    if (password === correctPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('siteAuthenticated', 'true')
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-dark-blue flex items-center justify-center p-4">
      <div className=" backdrop-blur-sm p-6 md:p-8 rounded-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Protected Site</h1>
          <p className="text-white/80 text-sm md:text-base">
            Please enter the password to access this site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-md border border-blue/20 bg-dark-blue/50 text-white
                focus:outline-none focus:ring-2 focus:ring-petrol/50 focus:border-petrol 
                transition-all duration-200"
              autoFocus
            />
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
          </div>

          <Button type="submit" className="w-full py-2.5" variant="rounded">
            Access Site
          </Button>
        </form>
      </div>
    </div>
  )
}
