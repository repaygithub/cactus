export type ColorStyle = {
  color: string
  backgroundColor: string
}

export interface FontSizeObject extends Array<number> {
  h1?: number
  h2?: number
  h3?: number
  h4?: number
  body?: number
  /**
   * Alias for body
   */
  p?: number
  small?: number
}

export interface IconSizeObject extends Array<number> {
  tiny?: number
  small?: number
  medium?: number
  large?: number
}

export type TextStyle = {
  fontSize: string
  lineHeight: string
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
    transparentSuccess: string
    transparentWarning: string
    transparentError: string
  }
  space: number[]
  fontSizes: FontSizeObject
  iconSizes: IconSizeObject
  textStyles: {
    tiny: TextStyle
    small: TextStyle
    body: TextStyle
    h4: TextStyle
    h3: TextStyle
    h2: TextStyle
    h1: TextStyle
  }
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
  let transparentSuccess = `hsla(145, 89%, 28%, 0.2)`
  let transparentError = `hsla(353, 84%, 44%, 0.2)`
  let transparentWarning = `hsla(47, 82%, 47%, 0.2)`

  const fontSizes: FontSizeObject = [15, 18, 21.6, 25.92, 31.104, 37.325]
  fontSizes.h1 = fontSizes[5]
  fontSizes.h2 = fontSizes[4]
  fontSizes.h3 = fontSizes[3]
  fontSizes.h4 = fontSizes[2]
  fontSizes.body = fontSizes.p = fontSizes[1]
  fontSizes.small = fontSizes[0]

  const iconSizes: IconSizeObject = [8, 16, 24, 40]
  iconSizes.tiny = iconSizes[0]
  iconSizes.small = iconSizes[1]
  iconSizes.medium = iconSizes[2]
  iconSizes.large = iconSizes[3]

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
      transparentSuccess,
      transparentError,
      transparentWarning,
    },
    space: [0, 2, 4, 8, 16, 32, 64],
    fontSizes,
    iconSizes,
    textStyles: {
      tiny: {
        fontSize: '12.5px',
        lineHeight: '18px',
      },
      small: {
        fontSize: '15px',
        lineHeight: '23px',
      },
      body: {
        fontSize: '18px',
        lineHeight: '28px',
      },
      h4: {
        fontSize: '21.6px',
        lineHeight: '32px',
      },
      h3: {
        fontSize: '25.92px',
        lineHeight: '40px',
      },
      h2: {
        fontSize: '31.104px',
        lineHeight: '48px',
      },
      h1: {
        fontSize: '37.325px',
        lineHeight: '56px',
      },
    },
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
