import Color from 'color'

import { CactusTheme } from '../dist/theme'
import cactusTheme, { generateTheme } from '../src/theme'

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

    Object.keys(theme.colorStyles).forEach((name): void => {
      if (name.includes('transparent')) {
        test(`colorStyle ${name}`, (): void => {
          const color = new Color(theme.colorStyles[name].backgroundColor)
          expect(
            color
              .mix(new Color('white').alpha(1 - color.alpha()))
              .contrast(new Color(theme.colorStyles[name].color))
          ).toBeGreaterThanOrEqual(4.5)
        })
      } else if (typeof name === 'string' && name !== 'disable') {
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
    })
  })

  themeAccessibility('primary theme', generateTheme({ primaryHue: 200 }))

  test('generates a grayscale theme with primaryHue', (): void => {
    const theme = generateTheme({ primaryHue: 200, grayscaleContrast: true })
    expect(theme.colors).toMatchObject({
      base: 'hsl(200, 96%, 11%)',
      callToAction: 'hsl(200, 96%, 35%)',
      lightContrast: 'hsl(0, 0%, 90%)',
    })
    expect(theme.colorStyles.lightContrast.backgroundColor).toBe('hsl(0, 0%, 90%)')
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
      colors: { lightContrast: 'hsl(0, 0%, 90%)' },
      colorStyles: { lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' } },
    })
  })

  test('generates a theme when two colors are provided', (): void => {
    const theme = generateTheme({ primary: '#012537', secondary: ' #0000FF' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(240, 100%, 50%)',
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
        lightContrast: 'hsl(0, 0%, 90%)',
      },
      colorStyles: {
        lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' },
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
      colors: { base: 'hsl(0, 0%, 100%)', callToAction: 'hsl(244, 48%, 26%)' },
    })
  })

  themeAccessibility('white theme', generateTheme({ primary: '' }))

  test('generates a white grayscale theme when invalid colors are provided', (): void => {
    const theme = generateTheme({ primary: '', grayscaleContrast: true })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 100%)',
        callToAction: 'hsl(244, 48%, 26%)',
        lightContrast: 'hsl(0, 0%, 90%)',
      },
      colorStyles: { lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' } },
    })
  })

  themeAccessibility(
    'white grayscale theme',
    generateTheme({ primary: '', grayscaleContrast: true })
  )

  test('generates a black theme when the primary color is black', (): void => {
    const theme = generateTheme({ primary: '#000000' })
    expect(theme).toMatchObject({
      colors: { base: 'hsl(0, 0%, 0%)', callToAction: 'hsl(244, 96%, 35%)' },
    })
  })

  themeAccessibility('black theme', generateTheme({ primary: '#000' }))

  test('generates a black grayscale theme when the primary color is black', (): void => {
    const theme = generateTheme({ primary: '#000000', grayscaleContrast: true })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(0, 0%, 0%)',
        callToAction: 'hsl(244, 96%, 35%)',
        lightContrast: 'hsl(0, 0%, 90%)',
      },
      colorStyles: { lightContrast: { backgroundColor: 'hsl(0, 0%, 90%)' } },
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
})
