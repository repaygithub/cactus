export type ColorStyle = {
  color: string
  backgroundColor: string
}

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
  space: number[]
  colorStyles: {
    base: ColorStyle
    callToAction: ColorStyle
    standard: ColorStyle
    lightContrast: ColorStyle
    darkestContrast: ColorStyle
    success: ColorStyle
    error: ColorStyle
    warning: ColorStyle
    disable: ColorStyle
  }
}

export type CactusColor = keyof CactusTheme['colors']

export type ColorVariant = keyof CactusTheme['colorStyles']

export interface GeneratorOptions {
  primaryHue: number
}

const repayOptions: GeneratorOptions = { primaryHue: 200 }

export function generateTheme({ primaryHue }: GeneratorOptions = repayOptions): CactusTheme {
  /** Core colors */
  let base = `hsl(${primaryHue}, 96%, 11%)`
  let baseText = `hsl(0, 0%, 100%)`
  let callToAction = `hsl(${primaryHue}, 96%, 35%)`
  let callToActionText = `hsl(0, 0%, 100%)`

  /** Contrasts */
  let lightContrast = `hsl(${primaryHue}, 29%, 90%)`
  let mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
  let darkContrast = `hsl(${primaryHue}, 9%, 35%)`
  let darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

  /** Neutrals */
  let white = `hsl(0, 0%, 100%)`
  let lightGray = `hsl(0, 0%, 90%)`
  let mediumGray = `hsl(0, 0%, 70%)`
  let darkGray = `hsl(0, 0%, 50%)`

  /** Notification Colors */
  let success = `hsl(145, 89%, 28%)`
  let error = `hsl(353, 84%, 44%)`
  let warning = `hsl(47, 82%, 47%)`

  return {
    colors: {
      /** Core colors */
      base,
      baseText,
      callToAction,
      callToActionText,

      /** Contrasts */
      lightContrast,
      mediumContrast,
      darkContrast,
      darkestContrast,

      /** Neutrals */
      white,
      lightGray,
      mediumGray,
      darkGray,

      /** Notification Colors */
      success,
      error,
      warning,
    },
    space: [0, 2, 4, 8, 16, 32, 64],
    colorStyles: {
      base: {
        backgroundColor: base,
        color: baseText,
      },
      callToAction: {
        backgroundColor: callToAction,
        color: callToActionText,
      },
      standard: {
        backgroundColor: white,
        color: darkestContrast,
      },
      lightContrast: {
        backgroundColor: lightContrast,
        color: darkestContrast,
      },
      darkestContrast: {
        backgroundColor: darkestContrast,
        color: white,
      },
      success: {
        backgroundColor: success,
        color: white,
      },
      error: {
        backgroundColor: error,
        color: white,
      },
      warning: {
        backgroundColor: warning,
        color: white,
      },
      disable: {
        backgroundColor: lightGray,
        color: darkestContrast,
      },
    },
  }
}

export default generateTheme()
