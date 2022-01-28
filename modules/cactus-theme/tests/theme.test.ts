import Color from 'color'

import cactusTheme, { CactusTheme, ColorVariant, generateTheme } from '../src/theme'

function themeAccessibility(themeName: string, theme: CactusTheme): void {
  describe(`${themeName} meets basic accessibility contrast thresholds`, (): void => {
    test('baseText on base', (): void => {
      expect(
        new Color(theme.colors.base).contrast(new Color(theme.colors.baseText))
      ).toBeGreaterThanOrEqual(4.5)
    })

    test('callToActionText on callToAction', (): void => {
      expect(
        new Color(theme.colors.callToAction).contrast(new Color(theme.colors.callToActionText))
      ).toBeGreaterThanOrEqual(4.5)
    })

    test('callToAction on white', (): void => {
      expect(
        new Color(theme.colors.callToAction).contrast(new Color('#FFFFFF'))
      ).toBeGreaterThanOrEqual(4.5)
    })
    ;(Object.keys(theme.colorStyles) as ColorVariant[]).forEach((name): void => {
      if (name !== 'disable') {
        test(`colorStyle ${name}`, (): void => {
          expect(
            new Color(theme.colorStyles[name].backgroundColor).contrast(
              new Color(theme.colorStyles[name].color)
            )
          ).toBeGreaterThanOrEqual(4.5)
        })
      }
    })
  })
}

const white = 'hsl(0, 0%, 100%)'

const expectedActionColors = {
  success: 'hsl(145, 89%, 28%)',
  warning: 'hsl(47, 82%, 47%)',
  error: 'hsl(353, 84%, 44%)',
  successLight: 'hsl(145, 33%, 78%)',
  warningLight: 'hsl(47, 73%, 84%)',
  errorLight: 'hsl(353, 67%, 83%)',
  successMedium: 'hsl(145, 33%, 63%)',
  warningMedium: 'hsl(47, 72%, 73%)',
  errorMedium: 'hsl(353, 67%, 72%)',
  successDark: 'hsl(145, 96%, 11%)',
  warningDark: 'hsl(47, 96%, 11%)',
  errorDark: 'hsl(353, 96%, 11%)',
}

const expectedActionStyles = {
  success: {
    backgroundColor: expectedActionColors.success,
    color: white,
  },
  error: {
    backgroundColor: expectedActionColors.error,
    color: white,
  },
  warning: {
    backgroundColor: expectedActionColors.warning,
  },
  successLight: {
    backgroundColor: expectedActionColors.successLight,
  },
  errorLight: {
    backgroundColor: expectedActionColors.errorLight,
  },
  warningLight: {
    backgroundColor: expectedActionColors.warningLight,
  },
  successMedium: {
    backgroundColor: expectedActionColors.successMedium,
  },
  errorMedium: {
    backgroundColor: expectedActionColors.errorMedium,
  },
  warningMedium: {
    backgroundColor: expectedActionColors.warningMedium,
  },
  successDark: {
    backgroundColor: expectedActionColors.successDark,
    color: white,
  },
  errorDark: {
    backgroundColor: expectedActionColors.errorDark,
    color: white,
  },
  warningDark: {
    backgroundColor: expectedActionColors.warningDark,
    color: white,
  },
}

describe('@repay/cactus-theme', (): void => {
  test('exports repay theme as default', (): void => {
    expect(cactusTheme).toEqual(generateTheme())
  })

  themeAccessibility('cactus theme', cactusTheme)

  test('generates a theme with primaryHue', (): void => {
    const theme = generateTheme({ primaryHue: 200 })
    expect(theme.colors).toMatchObject({
      base: 'hsl(200, 96%, 11%)',
      callToAction: 'hsl(200, 96%, 35%)',
      lightCallToAction: 'hsl(200, 45%, 81%)',
      ...expectedActionColors,
    })
    expect(theme.colorStyles).toMatchObject({
      ...expectedActionStyles,
      lightCallToAction: { backgroundColor: 'hsl(200, 45%, 81%)', color: 'hsl(200, 10%, 20%)' },
    })
  })

  themeAccessibility('primary theme', generateTheme({ primaryHue: 200 }))

  test('Generaste a theme with primaryHue and saturation Multiplier', () => {
    const theme = generateTheme({ primaryHue: 200, saturationMultiplier: 0.2 })
    expect(theme.colors).toMatchObject({
      base: 'hsl(200, 19.2%, 11%)',
      callToAction: 'hsl(200, 19.2%, 35%)',
      lightCallToAction: 'hsl(200, 5%, 81%)',
      ...expectedActionColors,
    })
    expect(theme.colorStyles).toMatchObject({
      ...expectedActionStyles,
      lightCallToAction: {
        backgroundColor: 'hsl(200, 5%, 81%)',
        color: 'hsl(200, 2%, 20%)',
      },
    })
  })

  test('generates a grayscale theme with primaryHue', (): void => {
    const theme = generateTheme({ primaryHue: 200, grayscaleContrast: true })
    expect(theme.colors).toMatchObject({
      base: 'hsl(200, 96%, 11%)',
      callToAction: 'hsl(200, 96%, 35%)',
      lightCallToAction: 'hsl(200, 45%, 81%)',
      lightContrast: 'hsl(0, 0%, 90%)',
      ...expectedActionColors,
    })
    expect(theme.colorStyles).toMatchObject({
      ...expectedActionStyles,
      lightCallToAction: { backgroundColor: 'hsl(200, 45%, 81%)', color: 'hsl(200, 10%, 20%)' },
      lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
    })
  })

  themeAccessibility(
    'primary grayscale theme',
    generateTheme({ primaryHue: 200, grayscaleContrast: true })
  )

  test('generates a theme when primary color is provided', (): void => {
    const theme = generateTheme({ primary: '#012537 ' })
    expect(theme).toEqual(cactusTheme)
  })

  test('generates a grayscale theme when primary color is provided', (): void => {
    const theme = generateTheme({ primary: '#012537 ', grayscaleContrast: true })
    expect(theme).toMatchObject({
      colors: {
        lightContrast: 'hsl(0, 0%, 90%)',
        callToAction: 'hsl(200, 96%, 35%)',
        lightCallToAction: 'hsl(200, 45%, 81%)',
        ...expectedActionColors,
      },
      colorStyles: {
        lightCallToAction: { backgroundColor: 'hsl(200, 45%, 81%)', color: 'hsl(200, 10%, 20%)' },
        lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
        ...expectedActionStyles,
      },
    })
  })

  test('generates a theme when primary color and saturation multiplier are provided ', (): void => {
    const theme = generateTheme({ primary: '#012537', saturationMultiplier: 0.5 })
    expect(theme).toMatchObject({
      colors: {
        lightContrast: 'hsl(200, 14.5%, 90%)',
        callToAction: 'hsl(200, 48%, 35%)',
        lightCallToAction: 'hsl(200, 20%, 81%)',
        ...expectedActionColors,
      },
      colorStyles: {
        lightCallToAction: { backgroundColor: 'hsl(200, 20%, 81%)', color: 'hsl(200, 5%, 20%)' },
        lightContrast: { backgroundColor: 'hsl(200, 14.5%, 90%)' },
        ...expectedActionStyles,
      },
    })
  })

  test('generates a theme when two colors are provided', (): void => {
    const theme = generateTheme({ primary: '#012537', secondary: ' #0000FF' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(240, 100%, 50%)',
        lightCallToAction: 'hsl(240, 68%, 85%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(240, 68%, 85%)', color: 'hsl(200, 10%, 20%)' },
      },
    })
  })

  test('Saturation Multiplier when two colors are provided to the theme', () => {
    const theme = generateTheme({
      primary: '#012537',
      secondary: ' #0000FF',
      saturationMultiplier: 0.5,
    })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 48%, 11%)',
        callToAction: 'hsl(240, 50%, 50%)',
        lightCallToAction: 'hsl(240, 30%, 85%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(240, 30%, 85%)', color: 'hsl(200, 5%, 20%)' },
      },
    })
  })

  themeAccessibility(
    'two-color theme',
    generateTheme({ primary: '#012537', secondary: ' #0000FF' })
  )

  test('generates a grayscale theme when two colors are provided', (): void => {
    const theme = generateTheme({
      primary: '#012537',
      secondary: ' #0000FF',
      grayscaleContrast: true,
    })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(240, 100%, 50%)',
        lightCallToAction: 'hsl(240, 68%, 85%)',
        lightContrast: 'hsl(0, 0%, 90%)',
        ...expectedActionColors,
      },
      colorStyles: {
        lightCallToAction: { backgroundColor: 'hsl(240, 68%, 85%)', color: 'hsl(200, 10%, 20%)' },
        lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
        ...expectedActionStyles,
      },
    })
  })

  themeAccessibility(
    'two-color grayscale theme',
    generateTheme({ primary: '#012537', secondary: ' #0000FF', grayscaleContrast: true })
  )

  test('generates a theme with a white secondary color', () => {
    const theme = generateTheme({
      primary: '#012537',
      secondary: ' #FFFFFF',
    })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(200, 96%, 35%)',
        lightCallToAction: 'hsl(200, 45%, 81%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(200, 45%, 81%)', color: 'hsl(200, 10%, 20%)' },
      },
    })
  })

  themeAccessibility(
    'white secondary',
    generateTheme({ primary: '#012537', secondary: ' #FFFFFF' })
  )

  test('generates a theme with a very light secondary color', () => {
    const theme = generateTheme({
      primary: '#012537',
      secondary: ' #AB7878',
    })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(0, 23%, 57%)',
        lightCallToAction: 'hsl(0, 23%, 87%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(0, 23%, 87%)', color: 'hsl(200, 10%, 20%)' },
      },
    })
  })

  // We don't test for accessibility with a light secondary color.  It would fail the
  // test because we don't really support that combination.  The above test just makes
  // sure we're not ignoring the secondary color entirely because it's too light.  It's
  // up to users of this library to prevent light secondary colors from being used.

  test('generates a white theme when invalid colors are provided', (): void => {
    const theme = generateTheme({ primary: '' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 100%)',
        callToAction: 'hsl(244, 48%, 26%)',
        lightCallToAction: 'hsl(244, 15%, 78%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(244, 15%, 78%)', color: 'hsl(0, 10%, 20%)' },
      },
    })
  })

  test('generates a white theme when invalid colors and a saturation multiplier are provided', (): void => {
    const theme = generateTheme({ primary: '', saturationMultiplier: 0.5 })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 100%)',
        callToAction: 'hsl(244, 24%, 26%)',
        lightCallToAction: 'hsl(244, 5%, 78%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(244, 5%, 78%)', color: 'hsl(0, 5%, 20%)' },
      },
    })
  })

  themeAccessibility('white theme', generateTheme({ primary: '' }))

  test('generates a white grayscale theme when invalid colors are provided', (): void => {
    const theme = generateTheme({ primary: '', grayscaleContrast: true })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 100%)',
        callToAction: 'hsl(244, 48%, 26%)',
        lightCallToAction: 'hsl(244, 15%, 78%)',
        lightContrast: 'hsl(0, 0%, 90%)',
        ...expectedActionColors,
      },
      colorStyles: {
        lightCallToAction: { backgroundColor: 'hsl(244, 15%, 78%)', color: 'hsl(0, 10%, 20%)' },
        lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
        ...expectedActionStyles,
      },
    })
  })

  themeAccessibility(
    'white grayscale theme',
    generateTheme({ primary: '', grayscaleContrast: true })
  )

  test('generates a black theme when the primary color is black', (): void => {
    const theme = generateTheme({ primary: '#000000' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 0%)',
        callToAction: 'hsl(244, 96%, 35%)',
        lightCallToAction: 'hsl(244, 45%, 81%)',
        ...expectedActionColors,
      },
      colorStyles: {
        ...expectedActionStyles,
        lightCallToAction: { backgroundColor: 'hsl(244, 45%, 81%)', color: 'hsl(0, 10%, 20%)' },
      },
    })
  })

  themeAccessibility('black theme', generateTheme({ primary: '#000' }))

  test('generates a black grayscale theme when the primary color is black', (): void => {
    const theme = generateTheme({ primary: '#000000', grayscaleContrast: true })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 0%)',
        callToAction: 'hsl(244, 96%, 35%)',
        lightCallToAction: 'hsl(244, 45%, 81%)',
        lightContrast: 'hsl(0, 0%, 90%)',
        ...expectedActionColors,
      },
      colorStyles: {
        lightCallToAction: { backgroundColor: 'hsl(244, 45%, 81%)', color: 'hsl(0, 10%, 20%)' },
        lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
        ...expectedActionStyles,
      },
    })
  })

  themeAccessibility(
    'black grayscale theme',
    generateTheme({ primary: '#000', grayscaleContrast: true })
  )
  themeAccessibility('two dark colors', generateTheme({ primary: '#133337', secondary: '#AC101D' }))

  themeAccessibility(
    'two dark colors - grayscale',
    generateTheme({ primary: '#133337', secondary: '#AC101D', grayscaleContrast: true })
  )

  test('can generate a theme with custom borders', (): void => {
    const theme = generateTheme({ primaryHue: 200, border: 'thin' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      border: 'thin',
    })
  })

  test('can generate a theme with custom shape', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      shape: 'square',
    })
  })

  test('can generate a theme with custom font', (): void => {
    const theme = generateTheme({ primaryHue: 200, font: 'Arial' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      font: 'Arial, Helvetica, Helvetica Neue, sans-serif',
    })
  })

  test('can generate a theme with no box-shadow', (): void => {
    const theme = generateTheme({ primaryHue: 200, boxShadows: false })
    expect(theme).toMatchObject({
      ...cactusTheme,
      boxShadows: false,
    })
  })

  test('generates a theme with breakpoints and media queries by default', () => {
    const theme = generateTheme()
    expect(theme.breakpoints).toMatchObject(['768px', '1024px', '1200px', '1440px'])
    expect(theme.mediaQueries).toMatchObject({
      small: '@media screen and (min-width: 768px)',
      medium: '@media screen and (min-width: 1024px)',
      large: '@media screen and (min-width: 1200px)',
      extraLarge: '@media screen and (min-width: 1440px)',
    })
  })

  test('generates a theme with custom breakpoints and media queries', () => {
    const theme = generateTheme({
      primaryHue: 200,
      breakpoints: {
        small: '400px',
        medium: '600px',
        large: '800px',
        extraLarge: '1000px',
      },
    })
    expect(theme.breakpoints).toMatchObject(['400px', '600px', '800px', '1000px'])
    expect(theme.mediaQueries).toMatchObject({
      small: '@media screen and (min-width: 400px)',
      medium: '@media screen and (min-width: 600px)',
      large: '@media screen and (min-width: 800px)',
      extraLarge: '@media screen and (min-width: 1000px)',
    })
  })
})
