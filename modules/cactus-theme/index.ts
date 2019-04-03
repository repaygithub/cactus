export interface CactusTheme {
  colors: {
    /** Core colors */
    base: string
    baseText: string
    callToAction: string
    callToActionText: string

    /** Contrasts */
    lightContrast: string
    mediumContrast: string
    darkContrast: string
    darkestContrast: string

    /** Neutrals */
    white: string
    lightGray: string
    mediumGray: string
    darkGray: string

    /** Notification Colors */
    success: string
    warning: string
    error: string
  }
}

export type CactusColor = keyof CactusTheme['colors']

export interface GeneratorOptions {
  primaryHue: number
}

const repayOptions: GeneratorOptions = { primaryHue: 200 }

export function generateTheme({ primaryHue }: GeneratorOptions = repayOptions): CactusTheme {
  return {
    colors: {
      /** Core colors */
      base: `hsl(${primaryHue}, 96%, 11%)`,
      baseText: `hsl(0, 0%, 100%)`,
      callToAction: `hsl(${primaryHue}, 96%, 35%)`,
      callToActionText: `hsl(0, 0%, 100%)`,

      /** Contrasts */
      lightContrast: `hsl(${primaryHue}, 29%, 90%)`,
      mediumContrast: `hsl(${primaryHue}, 18%, 80%)`,
      darkContrast: `hsl(${primaryHue}, 96%, 11%)`,
      darkestContrast: `hsl(${primaryHue}, 10%, 35%)`,

      /** Neutrals */
      white: `hsl(0, 0%, 100%)`,
      lightGray: `hsl(0, 0%, 90%)`,
      mediumGray: `hsl(0, 0%, 70%)`,
      darkGray: `hsl(0, 0%, 50%)`,

      /** Notification Colors */
      success: `hsl(145, 89%, 28%)`,
      error: `hsl(353, 84%, 44%)`,
      warning: `hsl(47, 82%, 47%)`,
    },
  }
}

export default generateTheme()
