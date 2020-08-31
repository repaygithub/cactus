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

    Object.keys(theme.colorStyles).forEach((name: keyof typeof theme['colorStyles']): void => {
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
    const theme = generateTheme({ primaryHue: 100 })
    expect(theme.colors).toMatchObject({
      base: 'hsl(100, 96%, 11%)',
      callToAction: 'hsl(100, 96%, 35%)',
    })
  })

  test('generates a theme when primary color is provided', (): void => {
    const theme = generateTheme({ primary: '#012537' })
    expect(theme).toEqual(cactusTheme)
  })

  test('generates a theme when two colors are provided', (): void => {
    const theme = generateTheme({ primary: '#012537', secondary: '#0000FF' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(240, 100%, 50%)',
      },
    })
  })

  test('generates a white theme when invalid colors are provided', (): void => {
    const theme = generateTheme({ primary: '' })
    expect(theme).toMatchObject({
      colors: { base: 'hsl(0, 0%, 100%)', callToAction: 'hsl(244, 48%, 26%)' },
    })
  })

  themeAccessibility('white theme', generateTheme({ primary: '' }))

  test('generates a black theme when the primary color is black', (): void => {
    const theme = generateTheme({ primary: '#000000' })
    expect(theme).toMatchObject({
      colors: { base: 'hsl(0, 0%, 0%)', callToAction: 'hsl(244, 96%, 35%)' },
    })
  })

  themeAccessibility('black theme', generateTheme({ primary: '#000' }))

  themeAccessibility(
    'two light colors',
    generateTheme({ primary: '#FFCCBE', secondary: '#B6FCD5' })
  )

  themeAccessibility('two dark colors', generateTheme({ primary: '#133337', secondary: '#AC101D' }))

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
