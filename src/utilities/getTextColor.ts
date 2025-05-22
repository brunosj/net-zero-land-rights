import { colors } from '@/config/colors'

// Function to convert hex to RGB
const hexToRGB = (hex: string): { r: number; g: number; b: number } => {
  const cleanHex = hex.replace('#', '')
  return {
    r: parseInt(cleanHex.substring(0, 2), 16),
    g: parseInt(cleanHex.substring(2, 4), 16),
    b: parseInt(cleanHex.substring(4, 6), 16),
  }
}

// Helper function to find a color configuration by its value
const findColorConfig = (colorValue: string) => {
  return Object.values(colors).find((color) => color.value === colorValue) || null
}

// Original function for general use
export const getTextColor = (backgroundColor: string): 'black' | 'white' => {
  const colorConfig = findColorConfig(backgroundColor)
  if (!colorConfig) return 'black'

  const { r, g, b } = hexToRGB(colorConfig.hex)

  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return white for dark backgrounds (YIQ < 128) and black for light backgrounds
  return yiq >= 128 ? 'black' : 'white'
}

// Function to determine if a text color is readable on white background
export const getTextColorForWhiteBackground = (textColor: string): 'black' | string => {
  const colorConfig = findColorConfig(textColor)
  if (!colorConfig) return 'black' // Default to black if no match found

  const { r, g, b } = hexToRGB(colorConfig.hex)

  // YIQ formula - higher values mean lighter colors
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return original color only if it's dark enough (YIQ < 128)
  // Otherwise return black for better contrast on white
  return yiq < 128 ? textColor : 'black'
}
