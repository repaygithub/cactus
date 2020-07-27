import Color from 'color'

import { CactusTheme } from '../dist'
import cactusTheme, { generateTheme } from '../src/theme'

function themeAccessibility(themeName: string, theme: CactusTheme) {
  describe(`${themeName} meets basic accessibility contrast thresholds`, () => {
    test('baseText on base', () => {
      expect(
        new Color(theme.colors.base).contrast(new Color(theme.colors.baseText))
      ).toBeGreaterThanOrEqual(4.5)
    })

    test('callToActionText on callToAction', () => {
      expect(
        new Color(theme.colors.callToAction).contrast(new Color(theme.colors.callToActionText))
      ).toBeGreaterThanOrEqual(4.5)
    })

    test('callToAction on white', () => {
      expect(
        new Color(theme.colors.callToAction).contrast(new Color('#FFFFFF'))
      ).toBeGreaterThanOrEqual(4.5)
    })

    Object.keys(theme.colorStyles).forEach((name: keyof typeof theme['colorStyles']) => {
      if (typeof name === 'string') {
        test(`colorStyle ${name}`, () => {
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

describe('@repay/cactus-theme', () => {
  test('exports repay theme as default', () => {
    expect(cactusTheme).toEqual(generateTheme())
  })

  themeAccessibility('cactus theme', cactusTheme)

  test('generates a theme with primaryHue', () => {
    const theme = generateTheme({ primaryHue: 100 })
    expect(theme.colors).toMatchObject({
      base: 'hsl(100, 96%, 11%)',
      callToAction: 'hsl(100, 96%, 35%)',
    })
  })

  test('generates a theme when primary color is provided', () => {
    const theme = generateTheme({ primary: '#012537' })
    expect(theme).toEqual(cactusTheme)
  })

  test('generates a theme when two colors are provided', () => {
    const theme = generateTheme({ primary: '#012537', secondary: '#0000FF' })
    expect(theme).toMatchObject({
      colors: {
        base: 'hsl(200, 96%, 11%)',
        callToAction: 'hsl(240, 100%, 50%)',
      },
    })
  })

  test('generates a white theme when invalid colors are provided', () => {
    const theme = generateTheme({ primary: '' })
    expect(theme).toMatchObject({
      colors: { base: 'hsl(0, 0%, 100%)', callToAction: 'hsl(244, 48%, 26%)' },
    })
  })

  themeAccessibility('white theme', generateTheme({ primary: '' }))

  test('generates a black theme when the primary color is black', () => {
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

  test('can generate a theme with custom borders', () => {
    const theme = generateTheme({ primaryHue: 200, border: 'thin' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      border: 'thin',
    })
  })

  test('can generate a theme with custom shape', () => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      shape: 'square',
    })
  })

  test('can generate a theme with custom font', () => {
    const theme = generateTheme({ primaryHue: 200, font: 'Arial' })
    expect(theme).toMatchObject({
      ...cactusTheme,
      font: 'Arial, Helvetica, Helvetica Neue, sans-serif',
    })
  })

  test('can generate a theme with no box-shadow', () => {
    const theme = generateTheme({ primaryHue: 200, boxShadows: false })
    expect(theme).toMatchObject({
      ...cactusTheme,
      boxShadows: false,
    })
  })
})
