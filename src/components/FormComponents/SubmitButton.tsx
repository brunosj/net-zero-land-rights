import React, { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  isSubmitting: boolean
  text: string
  loadingText?: string
  mainColor: string
  icon?: ReactNode
  className?: string
  fullWidth?: boolean
  variant?: 'rounded' | 'link' | 'outline' | 'ghost' | 'secondary' | 'tab'
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  text,
  loadingText,
  mainColor,
  icon,
  className = '',
  fullWidth = false,
  variant = 'rounded',
}) => {
  return (
    <motion.div
      className={`flex justify-${fullWidth ? 'center' : 'end'} col-span-1 ${fullWidth ? 'md:col-span-2' : ''}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Button
        type="submit"
        variant={variant}
        color={mainColor as any}
        size="lg"
        isLoading={isSubmitting}
        loadingText={loadingText || `${text}...`}
        icon={icon}
        className={`min-w-[150px] ${className}`}
      >
        <span className="relative z-10">{text}</span>
      </Button>
    </motion.div>
  )
}

export default SubmitButton
