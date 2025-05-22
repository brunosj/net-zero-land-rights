import React, { ReactNode } from 'react'
import { motion } from 'motion/react'

interface ConsentCheckboxProps {
  id: string
  name: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  mainColor: string
  required?: boolean
  children: ReactNode
}

const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  mainColor,
  required = false,
  children,
}) => {
  return (
    <motion.div
      className="col-span-1 md:col-span-2"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className={`h-4 w-4 text-${mainColor} focus:ring-${mainColor} border-gray-300 rounded`}
          required={required}
        />
        <label htmlFor={id} className="text-sm text-gray-600 small-text flex">
          {children}
          {required && <span className="text-red">*</span>}
        </label>
      </div>
    </motion.div>
  )
}

export default ConsentCheckbox
