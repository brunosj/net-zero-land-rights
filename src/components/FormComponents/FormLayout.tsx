import React, { ReactNode } from 'react'
import { motion } from 'motion/react'

interface FormLayoutProps {
  children: ReactNode
  mainColor: string
  onSubmit?: (e: React.FormEvent) => void
}

const FormLayout: React.FC<FormLayoutProps> = ({ children, mainColor, onSubmit }) => {
  return (
    <div className="container mx-auto relative">
      <motion.div
        className="relative mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <form onSubmit={onSubmit} className="bg-white rounded-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {children}
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default FormLayout
