import { hexToRgb, isDark, rgbToHsl } from './converters'

export type ColorStyle = {
  color: string
  backgroundColor: string
}

export interface StatusColors {
  background: {
    success: string
    warning: string
    error: string
  }
  avatar: {
    success: string
    warning: string
    error: string
  }
}

export interface FontSizeObject extends Array<number> {
  h1: number
  h2: number
  h3: number
  h4: number
  body: number
  /**
   * Alias for body
   */
  p: number
  small: number
  tiny: number
}

export interface IconSizeObject extends Array<number> {
  tiny?: number
  small?: number
  medium?: number
  large?: number
}

export interface TextStyleCollection {
  tiny: TextStyle
  small: TextStyle
  body: TextStyle
  h4: TextStyle
  h3: TextStyle
  h2: TextStyle
  h1: TextStyle
}

export type TextStyle = {
  fontSize: string
  lineHeight: string
}

export type BorderSize = 'thin' | 'thick'

export type Shape = 'square' | 'intermediate' | 'round'

export type Font = 'Helvetica Neue' | 'Helvetica' | 'Arial'

export interface CactusTheme {
  breakpoints?: string[]
  mediaQueries?: {
    small: string
    medium: string
    large: string
    extraLarge: string
  }
  colors: {
    /** Core colors */
    base: string
    baseText: string
    callToAction: string
    callToActionText: string
    transparentCTA: string

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
    errorDark: string
    warningDark: string
    successDark: string

    status: StatusColors
  }
  space: number[]
  fontSizes: FontSizeObject
  mobileFontSizes: FontSizeObject
  iconSizes: IconSizeObject
  textStyles: TextStyleCollection
  mobileTextStyles: TextStyleCollection
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
    transparentCTA: ColorStyle
    transparentError: ColorStyle
    transparentSuccess: ColorStyle
    transparentWarning: ColorStyle
    errorDark: ColorStyle
    warningDark: ColorStyle
    successDark: ColorStyle
  }
  border: BorderSize
  shape: Shape
  font: string
  boxShadows: boolean
}

export type CactusColor = Exclude<keyof CactusTheme['colors'], 'status'>

export type ColorVariant = keyof CactusTheme['colorStyles']

const grayscaleLightContrast = 'hsl(0, 0%, 90%)'

/** Neutrals */
const white = `hsl(0, 0%, 100%)`
const lightGray = `hsl(0, 0%, 90%)`
const mediumGray = `hsl(0, 0%, 70%)`
const darkGray = `hsl(0, 0%, 50%)`

/** Notification Colors */
const success = `hsl(145, 89%, 28%)`
const error = `hsl(353, 84%, 44%)`
const warning = `hsl(47, 82%, 47%)`
const transparentSuccess = `hsla(145, 89%, 28%, 0.3)`
const transparentError = `hsla(353, 84%, 44%, 0.3)`
const transparentWarning = `hsla(47, 82%, 47%, 0.3)`
const errorDark = `hsl(353, 96%, 11%)`
const warningDark = `hsl(47, 96%, 11%)`
const successDark = `hsl(145, 96%, 11%)`

const status: StatusColors = {
  background: {
    success: transparentSuccess,
    warning: transparentWarning,
    error: transparentError,
  },
  avatar: {
    success: transparentSuccess,
    warning: transparentWarning,
    error: transparentError,
  },
}

interface SharedGeneratorOptions {
  border?: BorderSize
  shape?: Shape
  font?: Font
  boxShadows?: boolean
  grayscaleContrast?: boolean
}

interface HueGeneratorOptions extends SharedGeneratorOptions {
  primaryHue: number
}

function fromHue({
  primaryHue,
}: HueGeneratorOptions): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  /** Core colors */
  const base = `hsl(${primaryHue}, 96%, 11%)`
  const baseText = `hsl(0, 0%, 100%)`
  const callToAction = `hsl(${primaryHue}, 96%, 35%)`
  const callToActionText = `hsl(0, 0%, 100%)`
  const transparentCTA = `hsla(${primaryHue}, 96%, 35%, 0.3)`

  /** Contrasts */
  const lightContrast = `hsl(${primaryHue}, 29%, 90%)`
  const mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
  const darkContrast = `hsl(${primaryHue}, 9%, 35%)`
  const darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

  return [
    {
      /** Core colors */
      base,
      baseText,
      callToAction,
      callToActionText,
      transparentCTA,

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
      errorDark,
      warningDark,
      successDark,

      /** Status Colors */
      status,
    },
    {
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
        color: darkestContrast,
      },
      disable: {
        backgroundColor: lightGray,
        color: mediumGray,
      },
      transparentCTA: {
        backgroundColor: transparentCTA,
        color: darkestContrast,
      },
      transparentError: {
        backgroundColor: transparentError,
        color: darkestContrast,
      },
      transparentSuccess: {
        backgroundColor: transparentSuccess,
        color: darkestContrast,
      },
      transparentWarning: {
        backgroundColor: transparentWarning,
        color: darkContrast,
      },
      errorDark: {
        backgroundColor: errorDark,
        color: white,
      },
      warningDark: {
        backgroundColor: warningDark,
        color: white,
      },
      successDark: {
        backgroundColor: successDark,
        color: white,
      },
    },
  ]
}

interface TwoColorGeneratorOptions extends SharedGeneratorOptions {
  primary: string
  secondary?: string
}

interface Color {
  hue: number
  saturation: number
  lightness: number
  rgb: [number, number, number]
}

function fromTwoWhite(primaryHue: number): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  /** Contrasts */
  const lightContrast = `hsl(${primaryHue}, 29%, 90%)`
  const mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
  const darkContrast = `hsl(${primaryHue}, 9%, 35%)`
  const darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

  const callToAction = `hsl(244, 48%, 26%)`
  const transparentCTA = `hsla(244, 48%, 26%, 0.3)`
  const callToActionText = white

  return [
    {
      /** Core colors */
      base: white,
      baseText: darkestContrast,
      callToAction: callToAction,
      callToActionText: callToActionText,
      transparentCTA: transparentCTA,

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
      errorDark,
      warningDark,
      successDark,

      /** Status Colors */
      status,
    },
    {
      base: {
        backgroundColor: white,
        color: darkestContrast,
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
        color: darkestContrast,
      },
      disable: {
        backgroundColor: lightGray,
        color: mediumGray,
      },
      transparentCTA: {
        backgroundColor: transparentCTA,
        color: darkestContrast,
      },
      transparentError: {
        backgroundColor: transparentError,
        color: darkestContrast,
      },
      transparentSuccess: {
        backgroundColor: transparentSuccess,
        color: darkestContrast,
      },
      transparentWarning: {
        backgroundColor: transparentWarning,
        color: darkestContrast,
      },
      errorDark: {
        backgroundColor: errorDark,
        color: white,
      },
      warningDark: {
        backgroundColor: warningDark,
        color: white,
      },
      successDark: {
        backgroundColor: successDark,
        color: white,
      },
    },
  ]
}

function fromWhiteSecondary(
  primary: Color,
  secondary: Color
): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  /** Core colors */
  const base = `hsl(${primary.hue}, ${primary.saturation}%, ${primary.lightness}%)`
  const contrastHue = secondary.lightness === 100 ? primary.hue : secondary.hue

  /** Contrasts */
  const lightContrast = `hsl(${contrastHue}, 29%, 90%)`
  const mediumContrast = `hsl(${contrastHue}, 18%, 45%)`
  const darkContrast = `hsl(${contrastHue}, 9%, 35%)`
  const darkestContrast = `hsl(${contrastHue}, 10%, 20%)`

  const baseText = isDark(...primary.rgb) ? white : darkestContrast

  // create secondary color from primary
  const updatedSecondaryHue = primary.lightness !== 0 ? primary.hue : 244
  const updatedSecondarySaturation = primary.lightness > 21 ? 98 : 96
  const updatedSecondaryLightness = primary.lightness > 21 ? 10 : 35
  const callToAction = `hsl(${updatedSecondaryHue}, ${updatedSecondarySaturation}%, ${updatedSecondaryLightness}%)`
  const callToActionText = white
  const transparentCTA = `hsla(${updatedSecondaryHue}, ${updatedSecondarySaturation}%, ${updatedSecondaryLightness}%, 0.3)`

  return [
    {
      /** Core colors */
      base,
      baseText,
      callToAction,
      callToActionText,
      transparentCTA,

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
      errorDark,
      warningDark,
      successDark,

      /** Status Colors */
      status,
    },
    {
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
        color: darkestContrast,
      },
      disable: {
        backgroundColor: lightGray,
        color: mediumGray,
      },
      transparentCTA: {
        backgroundColor: transparentCTA,
        color: darkestContrast,
      },
      transparentError: {
        backgroundColor: transparentError,
        color: darkestContrast,
      },
      transparentSuccess: {
        backgroundColor: transparentSuccess,
        color: darkestContrast,
      },
      transparentWarning: {
        backgroundColor: transparentWarning,
        color: darkContrast,
      },
      errorDark: {
        backgroundColor: errorDark,
        color: white,
      },
      warningDark: {
        backgroundColor: warningDark,
        color: white,
      },
      successDark: {
        backgroundColor: successDark,
        color: white,
      },
    },
  ]
}

function fromTwoNonWhite(
  primary: Color,
  secondary: Color
): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  /** Core colors */
  const base = `hsl(${primary.hue}, ${primary.saturation}%, ${primary.lightness}%)`

  /** Contrasts */
  const lightContrast = `hsl(${primary.hue}, 29%, 90%)`
  const mediumContrast = `hsl(${primary.hue}, 18%, 45%)`
  const darkContrast = `hsl(${primary.hue}, 9%, 35%)`
  const darkestContrast = `hsl(${primary.hue}, 10%, 20%)`

  const baseText = isDark(...primary.rgb) ? white : darkestContrast

  const callToAction = `hsl(${secondary.hue}, ${secondary.saturation}%, ${secondary.lightness}%)`
  const callToActionText = isDark(...secondary.rgb) ? white : darkestContrast
  const transparentCTA = `hsla(${secondary.hue}, ${secondary.saturation}%, ${secondary.lightness}%, 0.3)`

  return [
    {
      /** Core colors */
      base,
      baseText,
      callToAction,
      callToActionText,
      transparentCTA,

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
      errorDark,
      warningDark,
      successDark,

      /** Status Colors */
      status,
    },
    {
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
        color: darkestContrast,
      },
      disable: {
        backgroundColor: lightGray,
        color: mediumGray,
      },
      transparentCTA: {
        backgroundColor: transparentCTA,
        color: darkestContrast,
      },
      transparentError: {
        backgroundColor: transparentError,
        color: darkestContrast,
      },
      transparentSuccess: {
        backgroundColor: transparentSuccess,
        color: darkestContrast,
      },
      transparentWarning: {
        backgroundColor: transparentWarning,
        color: darkContrast,
      },
      errorDark: {
        backgroundColor: errorDark,
        color: white,
      },
      warningDark: {
        backgroundColor: warningDark,
        color: white,
      },
      successDark: {
        backgroundColor: successDark,
        color: white,
      },
    },
  ]
}

function fromTwoColor({
  primary,
  secondary,
}: TwoColorGeneratorOptions): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary)
  const [primaryHue, primarySaturation, primaryLightness] = rgbToHsl(...primaryRgb)
  const [secondaryHue, secondarySaturation, secondaryLightness] = rgbToHsl(...secondaryRgb)
  const isSecondaryWhite = secondaryLightness === 100

  const primaryColor: Color = {
    hue: primaryHue,
    saturation: primarySaturation,
    lightness: primaryLightness,
    rgb: primaryRgb,
  }

  const secondaryColor: Color = {
    hue: secondaryHue,
    saturation: secondarySaturation,
    lightness: secondaryLightness,
    rgb: secondaryRgb,
  }

  // both colors are undefined or white
  if (primaryLightness === 100 && isSecondaryWhite) {
    return fromTwoWhite(primaryHue)
  }

  // primary is non-black and secondary is light or white
  if (isSecondaryWhite || !isDark(...secondaryRgb)) {
    return fromWhiteSecondary(primaryColor, secondaryColor)
  }

  // both primary and secondary are non-white colors
  return fromTwoNonWhite(primaryColor, secondaryColor)
}

export type GeneratorOptions = HueGeneratorOptions | TwoColorGeneratorOptions

function isHue(options: GeneratorOptions): options is HueGeneratorOptions {
  return (options as HueGeneratorOptions).primaryHue != null
}

const repayOptions: GeneratorOptions = {
  primaryHue: 200,
  border: 'thin',
  shape: 'intermediate',
  font: 'Helvetica',
  boxShadows: true,
}

const makeTextStyles = (fontSizes: FontSizeObject): TextStyleCollection => ({
  tiny: {
    fontSize: `${fontSizes.tiny}px`,
    lineHeight: '1.44',
  },
  small: {
    fontSize: `${fontSizes.small}px`,
    lineHeight: '1.6',
  },
  body: {
    fontSize: `${fontSizes.body}px`,
    lineHeight: '1.5',
  },
  h4: {
    fontSize: `${fontSizes.h4}px`,
    lineHeight: '1.5',
  },
  h3: {
    fontSize: `${fontSizes.h3}px`,
    lineHeight: '1.5',
  },
  h2: {
    fontSize: `${fontSizes.h2}px`,
    lineHeight: '1.5',
  },
  h1: {
    fontSize: `${fontSizes.h1}px`,
    lineHeight: '1.5',
  },
})

export function generateTheme(options: GeneratorOptions = repayOptions): CactusTheme {
  const [colors, colorStyles] = isHue(options) ? fromHue(options) : fromTwoColor(options)

  if (options.grayscaleContrast) {
    colors.lightContrast = grayscaleLightContrast
    colorStyles.lightContrast.backgroundColor = grayscaleLightContrast
  }

  const fontSizes = [12.5, 15, 18, 21.6, 25.92, 31.104, 37.325] as FontSizeObject
  fontSizes.h1 = fontSizes[6]
  fontSizes.h2 = fontSizes[5]
  fontSizes.h3 = fontSizes[4]
  fontSizes.h4 = fontSizes[3]
  fontSizes.body = fontSizes.p = fontSizes[2]
  fontSizes.small = fontSizes[1]
  fontSizes.tiny = fontSizes[0]

  const mobileFontSizes = [12.5, 15, 18, 18, 21.6, 25.92, 31.1] as FontSizeObject
  mobileFontSizes.h1 = mobileFontSizes[6]
  mobileFontSizes.h2 = mobileFontSizes[5]
  mobileFontSizes.h3 = mobileFontSizes[4]
  mobileFontSizes.h4 = mobileFontSizes[3]
  mobileFontSizes.body = mobileFontSizes.p = mobileFontSizes[2]
  mobileFontSizes.small = mobileFontSizes[1]
  mobileFontSizes.tiny = mobileFontSizes[0]

  const iconSizes: IconSizeObject = [8, 16, 24, 40]
  iconSizes.tiny = iconSizes[0]
  iconSizes.small = iconSizes[1]
  iconSizes.medium = iconSizes[2]
  iconSizes.large = iconSizes[3]

  const { border = 'thin', shape = 'intermediate', font = 'Helvetica', boxShadows = true } = options
  const fontOptions: Font[] = ['Helvetica', 'Helvetica Neue', 'Arial']

  fontOptions.sort((x: Font, y: Font): number => {
    return x === font ? -1 : y === font ? 1 : 0
  })

  return {
    colors,
    colorStyles,
    space: [0, 2, 4, 8, 16, 24, 32, 40],
    fontSizes,
    mobileFontSizes,
    iconSizes,
    border,
    shape,
    font: `${fontOptions.join(', ')}, sans-serif`,
    boxShadows,
    textStyles: makeTextStyles(fontSizes),
    mobileTextStyles: makeTextStyles(mobileFontSizes),
  }
}

export default generateTheme()
