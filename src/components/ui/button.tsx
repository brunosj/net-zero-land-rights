'use client'

import { cn } from 'src/utilities/cn'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { MaterialSymbolsLightArrowLeftAltRounded } from '@/assets/icons/Arrow'
import { getTextColorDirect } from '@/config/colors'
import { getTextColor } from '@/utilities/getTextColor'
import { ExtendedColorKey } from '@/config/colors'

// Common rounded button styles shared between variants
const baseRoundedStyles =
  'group relative overflow-hidden rounded-full border-2 transition-colors duration-300'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
  {
    defaultVariants: {
      size: 'default',
      variant: 'rounded',
    },
    variants: {
      size: {
        clear: '',
        default: 'h-10 px-5 py-2',
        icon: 'h-10 w-10',
        lg: 'h-11 px-8 py-3',
        sm: 'h-9 px-3 py-1',
      },
      variant: {
        outline: baseRoundedStyles,
        ghost:
          'bg-transparent text-current hover:bg-current/10 disabled:hover:bg-transparent rounded-md',
        link: 'text-current bg-transparent underline-offset-4 hover:underline disabled:hover:no-underline',
        secondary:
          'bg-gray-100 text-current hover:bg-gray-200 disabled:hover:bg-gray-100 rounded-md',
        rounded: baseRoundedStyles,
        tab: 'px-4 py-2 border-b-2 border-transparent hover:border-current/30 disabled:hover:border-transparent transition-all',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  color?: ExtendedColorKey
  arrowPosition?: 'left' | 'right'
  arrowRotation?: number
  isLoading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  active?: boolean
  useArrow?: boolean
  hoverTextColor?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      className,
      size,
      variant,
      color = 'blue-green',
      arrowPosition = 'right',
      children,
      isLoading = false,
      loadingText,
      icon,
      active = false,
      useArrow = true,
      hoverTextColor = 'black',
      ...props
    },
    ref,
  ) => {
    const textColor = getTextColor(color)
    const isWhiteText = textColor === 'white'
    const Comp = asChild ? Slot : 'button'

    // If loading, show spinner with optional loading text
    const loadingContent = (
      <span className="inline-flex items-center">
        <svg
          className="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>{loadingText || 'Loading...'}</span>
      </span>
    )

    // Handle tab variant
    if (variant === 'tab') {
      return (
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
            'flex items-center',
            active ? `text-${color} border-${color}` : 'text-black border-transparent',
          )}
          ref={ref}
          {...props}
        >
          {icon && <span className="mr-2 flex items-center justify-center">{icon}</span>}
          {children}
        </button>
      )
    }

    // Handle rounded and outline variants
    const isRoundedStyle = variant === 'rounded' || variant === 'outline'
    const isOutline = variant === 'outline'

    // Set hover text color class based on outline variant
    const hoverTextColorClass = isOutline
      ? `group-hover:text-${textColor}`
      : 'group-hover:text-black'

    // Create button content with hover text color styles
    const buttonContent = isLoading ? (
      loadingContent
    ) : isRoundedStyle ? (
      <span className="inline-flex items-center z-10 relative">
        {/* If arrow position is left and arrows are enabled, show left arrow */}
        {useArrow && arrowPosition === 'left' && (
          <MaterialSymbolsLightArrowLeftAltRounded
            className={cn(
              'duration-500 relative z-10 group-hover:rotate-0 h-6 w-6 mr-2 rotate-45',
              isOutline ? `text-${color}` : `text-${textColor}`,
              hoverTextColorClass,
            )}
          />
        )}

        <span
          className={cn(
            'relative z-10 text-xs uppercase font-medium tracking-widest duration-500',
            isOutline ? `text-${color}` : `text-${textColor}`,
            hoverTextColorClass,
          )}
        >
          {children}
        </span>

        {/* Show custom icon on the right (like the arrow) if available */}
        {icon && (
          <span
            className={cn(
              'relative z-10 flex items-center justify-center duration-500 h-5 w-5 ml-2',
              isOutline ? `text-${color}` : `text-${textColor}`,
              hoverTextColorClass,
            )}
          >
            {icon}
          </span>
        )}

        {/* Only show right arrow if no custom icon and arrow position is right */}
        {!icon && useArrow && arrowPosition === 'right' && (
          <MaterialSymbolsLightArrowLeftAltRounded
            className={cn(
              'duration-500 relative z-10 group-hover:rotate-180 h-6 w-6 ml-2 rotate-[135deg]',
              isOutline ? `text-${color}` : `text-${textColor}`,
              hoverTextColorClass,
            )}
          />
        )}
      </span>
    ) : (
      <span className="inline-flex items-center">
        {children}
        {icon && <span className="ml-2 flex items-center justify-center">{icon}</span>}
      </span>
    )

    // Create button with the right composition based on variant
    if (isRoundedStyle) {
      const buttonClassName = cn(
        'group relative overflow-hidden px-4 py-2 border-2 inline-flex items-center justify-center rounded-full cursor-pointer',
        isOutline ? 'bg-transparent' : `bg-${color}`,
        `border-${color}`,
        props.disabled || isLoading ? 'pointer-events-none opacity-50' : '',
        className,
      )

      return (
        <button
          className={buttonClassName}
          ref={ref}
          disabled={props.disabled || isLoading}
          {...props}
        >
          {/* Hover overlay - outline or white */}
          <div
            className={cn(
              'absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out',
              props.disabled || isLoading ? 'group-hover:translate-y-full' : '',
              isOutline ? `bg-${color}` : 'bg-white',
            )}
          />

          {/* Button content with hover styles */}
          <div className="relative z-10 w-full flex items-center justify-center">
            {buttonContent}
          </div>
        </button>
      )
    } else {
      return (
        <Comp
          className={cn(buttonVariants({ className, size, variant }), `text-${color}`)}
          ref={ref}
          {...props}
          disabled={props.disabled || isLoading}
        >
          {buttonContent}
        </Comp>
      )
    }
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
