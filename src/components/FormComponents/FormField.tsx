import React from 'react'
import { motion } from 'motion/react'

interface FormFieldProps {
  id: string
  name: string
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => void
  label: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  mainColor: string
  animationDelay?: number
  animateFrom?: 'left' | 'right'
  placeholder?: string
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  type,
  value,
  onChange,
  label,
  required = false,
  options = [],
  mainColor,
  animationDelay = 0.2,
  animateFrom = 'left',
  placeholder = ' ',
}) => {
  const renderField = () => {
    const baseClasses =
      'w-full pt-6 pb-2 px-4 outline-hidden bg-transparent peer focus:shadow-inner'

    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${baseClasses} min-h-[230px] h-full resize-none`}
        />
      )
    } else if (type === 'select') {
      return (
        <>
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseClasses} appearance-none`}
          >
            <option value="" disabled></option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </>
      )
    }

    return (
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={baseClasses}
      />
    )
  }

  const labelClasses =
    type === 'select'
      ? `absolute top-2 left-4 text-xs font-semibold text-${mainColor} tracking-wider transition-all ${!value ? 'peer-focus:top-2 peer-focus:text-xs' : ''}`
      : `absolute top-2 left-4 text-xs font-semibold text-${mainColor} tracking-wider transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-${mainColor} peer-focus:font-semibold`

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, x: animateFrom === 'left' ? -10 : 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: animationDelay }}
    >
      <div
        className={`relative bg-gray-50 rounded-lg overflow-hidden border-l-4 border-${mainColor} shadow-xs hover:shadow-sm ${type === 'textarea' ? 'h-full' : ''}`}
      >
        {renderField()}
        <label htmlFor={id} className={labelClasses}>
          {label}{' '}
          {required ? (
            <span className="text-red">*</span>
          ) : (
            <span className="text-gray-400 text-xs"> (Optional)</span>
          )}
        </label>
      </div>
    </motion.div>
  )
}

export default FormField
