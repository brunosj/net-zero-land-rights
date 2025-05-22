export const colors = {
  red: {
    label: 'Red',
    value: 'red',
    hex: '#f37259',
    cssVar: '--red',
    textColor: 'black',
  },
  red50: {
    label: 'Red 50',
    value: 'red-50',
    hex: '#f79980',
    cssVar: '--red-50',
    textColor: 'white',
  },
  red20: {
    label: 'Red 20',
    value: 'red-20',
    hex: '#f2e0e0',
    cssVar: '--red-20',
    textColor: 'black',
  },
  yellow: {
    label: 'Yellow',
    value: 'yellow',
    hex: '#ffcb05',
    cssVar: '--yellow',
    textColor: 'black',
  },
  yellowLight: {
    label: 'Light Yellow',
    value: 'yellow-light',
    hex: '#efed86',
    cssVar: '--light-yellow',
    textColor: 'black',
  },
  blue: {
    label: 'Blue',
    value: 'blue',
    hex: '#739dd2',
    cssVar: '--blue',
    textColor: 'black',
  },
  darkBlue: {
    label: 'Dark Blue',
    value: 'dark-blue',
    hex: '#004263',
    cssVar: '--dark-blue',
    textColor: 'white',
  },
  lightBlue: {
    label: 'Light Blue',
    value: 'light-blue',
    hex: '#7cccbf',
    cssVar: '--light-blue',
    textColor: 'black',
  },
  petrol: {
    label: 'Petrol',
    value: 'petrol',
    hex: '#0f8a81',
    cssVar: '--petrol',
    textColor: 'white',
  },
  petrol15: {
    label: 'Petrol 15',
    value: 'petrol-15',
    hex: '#e0eae7',
    cssVar: '--petrol-15',
    textColor: 'black',
  },
  green: {
    label: 'Dark Green',
    value: 'dark-green',
    hex: '#44a13f',
    cssVar: '--dark-green',
    textColor: 'white',
  },
  lightGreen: {
    label: 'Light Green',
    value: 'light-green',
    hex: '#bfd100',
    cssVar: '--light-green',
    textColor: 'black',
  },
  blueGreen: {
    label: 'Blue Green',
    value: 'blue-green',
    hex: '#82ca9c',
    cssVar: '--blue-green',
    textColor: 'black',
  },
  ochre: {
    label: 'Ochre',
    value: 'ochre',
    hex: '#a28b49',
    cssVar: '--ochre',
    textColor: 'white',
  },
  ochre15: {
    label: 'Ochre 15',
    value: 'ochre-15',
    hex: '#e0eae7',
    cssVar: '--ochre-15',
    textColor: 'black',
  },
  white: {
    label: 'White',
    value: 'white',
    hex: '#ffffff',
    cssVar: '--white',
    textColor: 'black',
  },
  black: {
    label: 'Black',
    value: 'black',
    hex: '#000000',
    cssVar: '--black',
    textColor: 'white',
  },
} as const

// Helper types
export type ColorKey = keyof typeof colors
export type ExtendedColorKey = (typeof colors)[keyof typeof colors]['value']

// Helper function to get the text color directly from the color config
export const getTextColorDirect = (colorValue: string): 'black' | 'white' => {
  const colorConfig = Object.values(colors).find((color) => color.value === colorValue)
  return colorConfig?.textColor || 'black'
}

// Helper functions
export const getAllColorValues = () => {
  return Object.values(colors).map((color) => color.value)
}

// Generate Tailwind safelist
export const generateSafelist = () => {
  const colorValues = getAllColorValues()
  const prefixes = ['text', 'bg', 'border', 'hover:text', 'group-hover:text', 'from', 'via', 'to']

  // Basic color classes
  const basicClasses = colorValues.flatMap((color) =>
    prefixes.map((prefix) => `${prefix}-${color}`),
  )

  // Opacity variants for via- and to-
  const opacityValues = ['10', '20', '30', '40', '50', '60', '70', '80', '90']
  const opacityClasses = colorValues.flatMap((color) =>
    opacityValues.flatMap((opacity) => [`via-${color}/${opacity}`, `to-${color}/${opacity}`]),
  )

  // Add gradient direction classes
  const gradientClasses = ['bg-linear-to-r', 'to-transparent']

  return [...basicClasses, ...opacityClasses, ...gradientClasses]
}

// Generate color options for select fields
export const getColorSelectOptions = () => {
  return Object.values(colors).map((color) => ({
    label: color.label,
    value: color.value,
  }))
}

// Generate CSS variables
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {}
  Object.values(colors).forEach((color) => {
    variables[color.cssVar] = color.hex
  })
  return variables
}
