import { hexToRgb, isDark, rgbToHsl } from './converters'

export type ColorStyle = {
  color: string
  backgroundColor: string
}

export type StatusColors = {
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

type BorderSize = 'thin' | 'thick'

type Shape = 'square' | 'intermediate' | 'round'

type Font = 'Helvetica Neue' | 'Helvetica' | 'Arial'

export interface CactusTheme {
  breakpoints?: Array<String>
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

    status: StatusColors
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
  border: BorderSize
  shape: Shape
  font: String
  boxShadows: Boolean
}

export type CactusColor = Exclude<keyof CactusTheme['colors'], 'status'>

export type ColorVariant = keyof CactusTheme['colorStyles']

/** Neutrals */
let white = `hsl(0, 0%, 100%)`
let lightGray = `hsl(0, 0%, 90%)`
let mediumGray = `hsl(0, 0%, 70%)`
let darkGray = `hsl(0, 0%, 50%)`

type SharedGeneratorOptions = {
  border?: BorderSize
  shape?: Shape
  font?: Font
  boxShadows?: Boolean
}

interface HueGeneratorOptions extends SharedGeneratorOptions {
  primaryHue: number
}

function fromHue({
  primaryHue,
}: HueGeneratorOptions): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  /** Core colors */
  let base = `hsl(${primaryHue}, 96%, 11%)`
  let baseText = `hsl(0, 0%, 100%)`
  let callToAction = `hsl(${primaryHue}, 96%, 35%)`
  let callToActionText = `hsl(0, 0%, 100%)`
  let transparentCTA = `hsla(${primaryHue}, 96%, 35%, 0.25)`

  /** Contrasts */
  let lightContrast = `hsl(${primaryHue}, 29%, 90%)`
  let mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
  let darkContrast = `hsl(${primaryHue}, 9%, 35%)`
  let darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

  /** Notification Colors */
  let success = `hsl(145, 89%, 28%)`
  let error = `hsl(353, 84%, 44%)`
  let warning = `hsl(47, 82%, 47%)`
  let transparentSuccess = `hsla(145, 89%, 28%, 0.2)`
  let transparentError = `hsla(353, 84%, 44%, 0.2)`
  let transparentWarning = `hsla(47, 82%, 47%, 0.2)`
  let errorDark = `hsl(353, 96%, 11%)`

  const status: StatusColors = {
    background: {
      success: `hsla(145, 89%, 28%, 0.2)`,
      warning: `hsla(47, 82%, 47%, 0.2)`,
      error: `hsla(353, 84%, 44%, 0.2)`,
    },
    avatar: {
      success: `hsla(145, 89%, 28%, 0.3)`,
      warning: `hsla(47, 82%, 47%, 0.3)`,
      error: `hsla(353, 84%, 44%, 0.3)`,
    },
  }

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
        color: darkestContrast,
      },
    },
  ]
}

interface TwoColorGeneratorOptions extends SharedGeneratorOptions {
  primary: string
  secondary?: string
}

function fromTwoColor({
  primary,
  secondary,
}: TwoColorGeneratorOptions): [CactusTheme['colors'], CactusTheme['colorStyles']] {
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary)
  let [primaryHue, primarySaturation, primaryLightness] = rgbToHsl(...primaryRgb)
  let [secondaryHue, secondarySaturation, secondaryLightness] = rgbToHsl(...secondaryRgb)
  const isSecondaryWhite = secondaryLightness === 100

  /** Notification Colors */
  // TODO determine colors to contrast with CTA hue
  let success = `hsl(145, 89%, 28%)`
  let error = `hsl(353, 84%, 44%)`
  let warning = `hsl(47, 82%, 47%)`
  let transparentSuccess = `hsla(145, 89%, 28%, 0.2)`
  let transparentError = `hsla(353, 84%, 44%, 0.2)`
  let transparentWarning = `hsla(47, 82%, 47%, 0.2)`
  let errorDark = `hsl(353, 96%, 11%)`

  const status: StatusColors = {
    background: {
      success: transparentSuccess,
      warning: transparentWarning,
      error: transparentError,
    },
    avatar: {
      success: `hsla(145, 89%, 28%, 0.3)`,
      warning: `hsla(47, 82%, 47%, 0.3)`,
      error: `hsla(353, 84%, 44%, 0.3)`,
    },
  }

  // both colors are undefined or white
  if (primaryLightness === 100 && isSecondaryWhite) {
    /** Contrasts */
    let lightContrast = `hsl(${primaryHue}, 29%, 90%)`
    let mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
    let darkContrast = `hsl(${primaryHue}, 9%, 35%)`
    let darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

    let callToAction = `hsl(244, 48%, 26%)`

    return [
      {
        /** Core colors */
        base: white,
        baseText: darkestContrast,
        callToAction: callToAction,
        callToActionText: white,
        transparentCTA: `hsla(244, 48%, 26%, 0.25)`,

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
          color: white,
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
          color: darkestContrast,
        },
      },
    ]
  }

  // primary is non-black and secondary is light or white
  if (isSecondaryWhite || !isDark(...secondaryRgb)) {
    /** Core colors */
    let base = `hsl(${primaryHue}, ${primarySaturation}%, ${primaryLightness}%)`
    let contrastHue = isSecondaryWhite ? primaryHue : secondaryHue

    /** Contrasts */
    let lightContrast = `hsl(${contrastHue}, 29%, 90%)`
    let mediumContrast = `hsl(${contrastHue}, 18%, 45%)`
    let darkContrast = `hsl(${contrastHue}, 9%, 35%)`
    let darkestContrast = `hsl(${contrastHue}, 10%, 20%)`

    let baseText = isDark(...primaryRgb) ? white : darkestContrast

    // create secondary color from primary
    secondaryHue = primaryLightness !== 0 ? primaryHue : 244
    secondarySaturation = primaryLightness > 21 ? 98 : 96
    secondaryLightness = primaryLightness > 21 ? 10 : 35
    let callToAction = `hsl(${secondaryHue}, ${secondarySaturation}%, ${secondaryLightness}%)`
    let callToActionText = white
    let transparentCTA = `hsla(${secondaryHue}, ${secondarySaturation}%, ${secondaryLightness}%, 0.25)`

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
          color: darkestContrast,
        },
      },
    ]
  }

  // both primary and secondary are non-white colors
  /** Core colors */
  let base = `hsl(${primaryHue}, ${primarySaturation}%, ${primaryLightness}%)`

  /** Contrasts */
  let lightContrast = `hsl(${primaryHue}, 29%, 90%)`
  let mediumContrast = `hsl(${primaryHue}, 18%, 45%)`
  let darkContrast = `hsl(${primaryHue}, 9%, 35%)`
  let darkestContrast = `hsl(${primaryHue}, 10%, 20%)`

  let baseText = isDark(...primaryRgb) ? white : darkestContrast

  let callToAction = `hsl(${secondaryHue}, ${secondarySaturation}%, ${secondaryLightness}%)`
  let callToActionText = isDark(...secondaryRgb) ? white : darkestContrast
  let transparentCTA = `hsla(${secondaryHue}, ${secondarySaturation}%, ${secondaryLightness}%, 0.25)`

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
        color: darkestContrast,
      },
    },
  ]
}

export type GeneratorOptions = HueGeneratorOptions | TwoColorGeneratorOptions

function isHue(options: GeneratorOptions): options is HueGeneratorOptions {
  return (options as HueGeneratorOptions).primaryHue != null
}

const repayOptions: GeneratorOptions = {
  primaryHue: 200,
  border: 'thick',
  shape: 'round',
  font: 'Helvetica',
  boxShadows: true,
}

export function generateTheme(options: GeneratorOptions = repayOptions): CactusTheme {
  const [colors, colorStyles] = isHue(options) ? fromHue(options) : fromTwoColor(options)

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

  const { border = 'thick', shape = 'round', font = 'Helvetica', boxShadows = true } = options
  const fontOptions: Font[] = ['Helvetica', 'Helvetica Neue', 'Arial']

  fontOptions.sort((x: Font, y: Font) => {
    return x === font ? -1 : y === font ? 1 : 0
  })

  return {
    colors,
    colorStyles,
    space: [0, 2, 4, 8, 16, 24, 32, 40],
    fontSizes,
    iconSizes,
    border,
    shape,
    font: `${fontOptions.join(', ')}, sans-serif`,
    boxShadows,
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
  }
}

export default generateTheme()
