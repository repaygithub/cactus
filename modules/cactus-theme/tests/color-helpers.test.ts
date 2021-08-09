import { color, colorStyle } from '../src/helpers/colors'
import { CactusColor, ColorStyle, ColorVariant, generateTheme } from '../src/theme'
import { defaultProps, expectCurry, expectMemo } from './helpers'

const altColor = { theme: generateTheme({ primaryHue: 50 }) }

describe('helper: color', () => {
  test('should curry args', () => {
    expectCurry(color, ['warning'], defaultProps.theme.colors.warning)
  })

  test('should memoize colors', () => {
    const memo: CactusColor[] = [
      'base',
      'callToAction',
      'lightContrast',
      'darkestContrast',
      'white',
      'lightGray',
      'mediumGray',
      'success',
      'error',
    ]
    const colors = memo.reduce((c, key) => {
      c[key] = defaultProps.theme.colors[key]
      return c
    }, {} as Record<CactusColor, string>)
    expectMemo(color, colors, {
      key: 'base',
      value: altColor.theme.colors.base,
      ...altColor,
    })
  })
})

describe('helper: colorStyle', () => {
  test('should curry args', () => {
    expectCurry<[ColorVariant], ColorStyle>(
      colorStyle,
      ['warning'],
      defaultProps.theme.colorStyles.warning
    )
    expectCurry<['red', 'black'], ColorStyle>(colorStyle, ['red', 'black'], {
      color: 'red',
      backgroundColor: 'black',
    })
  })

  test('should memoize color styles', () => {
    const memo: ColorVariant[] = ['base', 'callToAction', 'standard', 'success', 'error', 'disable']
    const colors = memo.reduce((c, key) => {
      c[key] = defaultProps.theme.colorStyles[key]
      return c
    }, {} as Record<ColorVariant, ColorStyle>)
    expectMemo(colorStyle, colors, {
      key: 'base',
      value: altColor.theme.colorStyles.base,
      ...altColor,
    })
  })

  test('should accept two colors', () => {
    expect(colorStyle(defaultProps, 'green', 'callToAction')).toEqual({
      color: 'green',
      backgroundColor: defaultProps.theme.colors.callToAction,
    })
    expect(colorStyle(defaultProps, 'darkContrast', 'blue')).toEqual({
      color: defaultProps.theme.colors.darkContrast,
      backgroundColor: 'blue',
    })
  })
})
