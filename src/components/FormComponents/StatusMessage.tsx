import React from 'react'
import { motion } from 'motion/react'
import { cn } from '@/utilities/cn'
import { CheckIcon, AlertCircle } from 'lucide-react'

interface StatusMessageProps {
  success?: boolean
  message?: string
}

const StatusMessage: React.FC<StatusMessageProps> = ({ success, message }) => {
  if (!message) return null

  return (
    <motion.div
      className="col-span-1 md:col-span-2 mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          'p-4 rounded-lg',
          success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200',
        )}
      >
        <div className={cn('flex items-center gap-2', success ? 'text-green-700' : 'text-red-700')}>
          {success ? (
            <CheckIcon className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default StatusMessage
