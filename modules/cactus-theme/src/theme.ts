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

export interface BreakpointsObject {
  small: string
  medium: string
  large: string
  extraLarge: string
}

interface GeneratedColors {
  /** Core colors */
  base: string
  baseText: string
  callToAction: string
  callToActionText: string
  lightCallToAction: string

  /** Contrasts */
  lightContrast: string
  mediumContrast: string
  darkContrast: string
  darkestContrast: string
}

interface ThemeColors extends GeneratedColors {
  /** Neutrals */
  white: string
  lightGray: string
  mediumGray: string
  darkGray: string

  /** Notification Colors */
  success: string
  warning: string
  error: string
  successLight: string
  warningLight: string
  errorLight: string
  successMedium: string
  warningMedium: string
  errorMedium: string
  successDark: string
  warningDark: string
  errorDark: string

  status: StatusColors
}

export interface CactusTheme {
  breakpoints: string[]
  mediaQueries: {
    small: string
    medium: string
    large: string
    extraLarge: string
  }
  colors: ThemeColors
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
    lightCallToAction: ColorStyle
    successLight: ColorStyle
    errorLight: ColorStyle
    warningLight: ColorStyle
    successMedium: ColorStyle
    errorMedium: ColorStyle
    warningMedium: ColorStyle
    successDark: ColorStyle
    errorDark: ColorStyle
    warningDark: ColorStyle
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
const white = 'hsl(0, 0%, 100%)'
const lightGray = 'hsl(0, 0%, 90%)'
const mediumGray = 'hsl(0, 0%, 70%)'
const darkGray = 'hsl(0, 0%, 50%)'

/** Notification Colors */
const success = 'hsl(145, 89%, 28%)'
const error = 'hsl(353, 84%, 44%)'
const warning = 'hsl(47, 82%, 47%)'
const successLight = 'hsl(145, 33%, 78%)'
const errorLight = 'hsl(353, 67%, 83%)'
const warningLight = 'hsl(47, 73%, 84%)'
const successMedium = 'hsl(145, 33%, 63%)'
const errorMedium = 'hsl(353, 67%, 72%)'
const warningMedium = 'hsl(47, 72%, 73%)'
const errorDark = 'hsl(353, 96%, 11%)'
const warningDark = 'hsl(47, 96%, 11%)'
const successDark = 'hsl(145, 96%, 11%)'

const status: StatusColors = {
  background: {
    success: successLight,
    warning: warningLight,
    error: errorLight,
  },
  avatar: {
    success: successMedium,
    warning: warningMedium,
    error: errorMedium,
  },
}

interface SharedGeneratorOptions {
  saturationMultiplier?: number
  border?: BorderSize
  shape?: Shape
  font?: Font
  boxShadows?: boolean
  grayscaleContrast?: boolean
  breakpoints?: BreakpointsObject
}

interface HueGeneratorOptions extends SharedGeneratorOptions {
  primaryHue: number
}

function convertToLightCTASaturation(ctaSaturation: number, ctaLightness: number): number {
  return Math.round(1.5 * (ctaLightness / 10) * (ctaSaturation / 10) - 1.5 * (ctaLightness / 10))
}

function getHslString(colorParams: number[]): string {
  const [hue, saturation, lightness] = colorParams
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

function getLightCallToAction(ctaParams: number[]): string {
  const [ctaHue, ctaSaturation, ctaLightness] = ctaParams
  const lightCTAHue = ctaHue
  const lightCTASaturation =
    ctaLightness <= 50 ? convertToLightCTASaturation(ctaSaturation, ctaLightness) : ctaSaturation
  const lightCTALightness = Math.round((ctaLightness / 10) * 3 + 70)
  return getHslString([lightCTAHue, lightCTASaturation, lightCTALightness])
}

function getSaturation(satPercentage: number, saturationFactor = 1): number {
  return Number((satPercentage * saturationFactor).toFixed(2))
}

function fromHue({ primaryHue, saturationMultiplier = 1 }: HueGeneratorOptions): GeneratedColors {
  const ctaParams = [primaryHue, getSaturation(96, saturationMultiplier), 35]
  return {
    /** Core colors */
    base: `hsl(${primaryHue}, ${getSaturation(96, saturationMultiplier)}%, 11%)`,
    baseText: white,
    callToAction: getHslString(ctaParams),
    callToActionText: white,
    lightCallToAction: getLightCallToAction(ctaParams),
    /** Contrasts */
    lightContrast: `hsl(${primaryHue}, ${getSaturation(29, saturationMultiplier)}%, 90%)`,
    mediumContrast: `hsl(${primaryHue}, ${getSaturation(18, saturationMultiplier)}%, 45%)`,
    darkContrast: `hsl(${primaryHue}, ${getSaturation(9, saturationMultiplier)}%, 35%)`,
    darkestContrast: `hsl(${primaryHue}, ${getSaturation(10, saturationMultiplier)}%, 20%)`,
  }
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

function fromTwoWhite(primaryHue: number, saturationMultiplier: number): GeneratedColors {
  const lightContrast = `hsl(${primaryHue}, ${getSaturation(29, saturationMultiplier)}%, 90%)`
  const mediumContrast = `hsl(${primaryHue}, ${getSaturation(18, saturationMultiplier)}%, 45%)`
  const darkContrast = `hsl(${primaryHue}, ${getSaturation(9, saturationMultiplier)}%, 35%)`
  const darkestContrast = `hsl(${primaryHue}, ${getSaturation(10, saturationMultiplier)}%, 20%)`
  const ctaParams = [244, getSaturation(48, saturationMultiplier), 26]
  return {
    /** Core colors */
    base: white,
    baseText: darkestContrast,
    callToAction: getHslString(ctaParams),
    callToActionText: white,
    lightCallToAction: getLightCallToAction(ctaParams),

    /** Contrasts */
    lightContrast,
    mediumContrast,
    darkContrast,
    darkestContrast,
  }
}

function fromWhiteSecondary(
  primary: Color,
  secondary: Color,
  saturationMultiplier: number
): GeneratedColors {
  const contrastHue = secondary.lightness === 100 ? primary.hue : secondary.hue
  const lightContrast = `hsl(${contrastHue}, ${getSaturation(29, saturationMultiplier)}%, 90%)`
  const mediumContrast = `hsl(${contrastHue}, ${getSaturation(18, saturationMultiplier)}%, 45%)`
  const darkContrast = `hsl(${contrastHue}, ${getSaturation(9, saturationMultiplier)}%, 35%)`
  const darkestContrast = `hsl(${contrastHue}, ${getSaturation(10, saturationMultiplier)}%, 20%)`

  // create secondary color from primary
  const updatedSecondaryHue = primary.lightness !== 0 ? primary.hue : 244
  const updatedSecondarySaturation = primary.lightness > 21 ? 98 : 96
  const updatedSecondaryLightness = primary.lightness > 21 ? 10 : 35
  const ctaParams = [
    updatedSecondaryHue,
    getSaturation(updatedSecondarySaturation, saturationMultiplier),
    updatedSecondaryLightness,
  ]
  return {
    /** Core colors */
    base: `hsl(${primary.hue}, ${primary.saturation}%, ${primary.lightness}%)`,
    baseText: isDark(...primary.rgb) ? white : darkestContrast,
    callToAction: getHslString(ctaParams),
    callToActionText: white,
    lightCallToAction: getLightCallToAction(ctaParams),

    /** Contrasts */
    lightContrast,
    mediumContrast,
    darkContrast,
    darkestContrast,
  }
}

function fromTwoNonWhite(
  primary: Color,
  secondary: Color,
  saturationMultiplier: number
): GeneratedColors {
  const lightContrast = `hsl(${primary.hue}, ${getSaturation(29, saturationMultiplier)}%, 90%)`
  const mediumContrast = `hsl(${primary.hue}, ${getSaturation(18, saturationMultiplier)}%, 45%)`
  const darkContrast = `hsl(${primary.hue}, ${getSaturation(9, saturationMultiplier)}%, 35%)`
  const darkestContrast = `hsl(${primary.hue}, ${getSaturation(10, saturationMultiplier)}%, 20%)`
  const ctaParams = [secondary.hue, secondary.saturation, secondary.lightness]
  return {
    /** Core colors */
    base: `hsl(${primary.hue}, ${primary.saturation}%, ${primary.lightness}%)`,
    baseText: isDark(...primary.rgb) ? white : darkestContrast,
    callToAction: getHslString(ctaParams),
    callToActionText: isDark(...secondary.rgb) ? white : darkestContrast,
    lightCallToAction: getLightCallToAction(ctaParams),

    /** Contrasts */
    lightContrast,
    mediumContrast,
    darkContrast,
    darkestContrast,
  }
}

function fromTwoColor({
  primary,
  secondary,
  saturationMultiplier = 1,
}: TwoColorGeneratorOptions): GeneratedColors {
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary || '')
  const [primaryHue, primarySaturation, primaryLightness] = rgbToHsl(...primaryRgb)
  const [secondaryHue, secondarySaturation, secondaryLightness] = rgbToHsl(...secondaryRgb)
  const isSecondaryWhite = secondaryLightness === 100

  const primaryColor: Color = {
    hue: primaryHue,
    saturation: getSaturation(primarySaturation, saturationMultiplier),
    lightness: primaryLightness,
    rgb: primaryRgb,
  }

  const secondaryColor: Color = {
    hue: secondaryHue,
    saturation: getSaturation(secondarySaturation, saturationMultiplier),
    lightness: secondaryLightness,
    rgb: secondaryRgb,
  }

  // both colors are undefined or white
  if (primaryLightness === 100 && isSecondaryWhite) {
    return fromTwoWhite(primaryHue, saturationMultiplier)
  }

  // primary is non-black and secondary is white
  if (isSecondaryWhite) {
    return fromWhiteSecondary(primaryColor, secondaryColor, saturationMultiplier)
  }

  // both primary and secondary are non-white colors
  return fromTwoNonWhite(primaryColor, secondaryColor, saturationMultiplier)
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
  saturationMultiplier: 1,
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
  const colors: GeneratedColors = isHue(options) ? fromHue(options) : fromTwoColor(options)

  if (options.grayscaleContrast) {
    colors.lightContrast = grayscaleLightContrast
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

  fontOptions.sort((fontOption1: Font, fontOption2: Font): number => {
    if (fontOption1 === font) {
      return -1
    }

    if (fontOption2 === font) {
      return 1
    }

    return 0
  })

  const breakpoints = options.breakpoints || {
    small: '768px',
    medium: '1024px',
    large: '1200px',
    extraLarge: '1440px',
  }

  const mediaQueries = {
    small: `@media screen and (min-width: ${breakpoints.small})`,
    medium: `@media screen and (min-width: ${breakpoints.medium})`,
    large: `@media screen and (min-width: ${breakpoints.large})`,
    extraLarge: `@media screen and (min-width: ${breakpoints.extraLarge})`,
  }

  return {
    colors: {
      /** Core colors & Contrasts */
      ...colors,

      /** Neutrals */
      white,
      lightGray,
      mediumGray,
      darkGray,

      /** Notification Colors */
      success,
      error,
      warning,
      successLight,
      errorLight,
      warningLight,
      successMedium,
      errorMedium,
      warningMedium,
      successDark,
      errorDark,
      warningDark,

      /** Status Colors */
      status,
    },
    colorStyles: {
      base: {
        backgroundColor: colors.base,
        color: colors.baseText,
      },
      callToAction: {
        backgroundColor: colors.callToAction,
        color: colors.callToActionText,
      },
      standard: {
        backgroundColor: white,
        color: colors.darkestContrast,
      },
      lightContrast: {
        backgroundColor: colors.lightContrast,
        color: colors.darkestContrast,
      },
      darkestContrast: {
        backgroundColor: colors.darkestContrast,
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
        color: colors.darkestContrast,
      },
      disable: {
        backgroundColor: lightGray,
        color: mediumGray,
      },
      lightCallToAction: {
        backgroundColor: colors.lightCallToAction,
        color: colors.darkestContrast,
      },
      successLight: {
        backgroundColor: successLight,
        color: colors.darkestContrast,
      },
      errorLight: {
        backgroundColor: errorLight,
        color: colors.darkestContrast,
      },
      warningLight: {
        backgroundColor: warningLight,
        color: colors.darkContrast,
      },
      successMedium: {
        backgroundColor: successMedium,
        color: colors.darkestContrast,
      },
      errorMedium: {
        backgroundColor: errorMedium,
        color: colors.darkestContrast,
      },
      warningMedium: {
        backgroundColor: warningMedium,
        color: colors.darkContrast,
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
    breakpoints: Object.values(breakpoints),
    mediaQueries,
  }
}

export default generateTheme()
