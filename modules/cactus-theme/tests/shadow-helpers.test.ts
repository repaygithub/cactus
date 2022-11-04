import { boxShadow, shadow } from '../src/helpers/shadows'
import { CactusColor, generateTheme } from '../src/theme'
import { defaultProps, expectCurry } from './helpers'

const withShadow = defaultProps
const noShadow = { theme: generateTheme({ primaryHue: 200, boxShadows: false }) }

const _ = (size: string, c: CactusColor = 'lightCallToAction') =>
  `box-shadow: ${size} ${defaultProps.theme.colors[c]};`

describe('helper: boxShadow', () => {
  test('should curry args', () => {
    expectCurry(boxShadow, [1], _('0 3px 8px'))
    expectCurry(boxShadow, [0, 'gray'], 'box-shadow: 0 0 3px gray;')
  })

  test('allows fallback color', () => {
    // This helper ignores the `boxShadows` setting.
    expect(boxShadow(noShadow, 2, 'mediumGray')).toBe(_('0 9px 24px', 'mediumGray'))
    expect(boxShadow(noShadow, 3, 'orange')).toBe('box-shadow: 0 12px 24px orange;')
  })
})

describe('helper: shadow', () => {
  test('should curry args', () => {
    expectCurry(shadow, [4], _('0 30px 42px'))
  })

  test('allows custom shadow size', () => {
    expect(shadow(withShadow, 'hello')).toBe(_('hello'))
  })

  test('allows fallback: border color', () => {
    expect(shadow(withShadow, '4px', 'lightContrast')).toBe(_('4px'))
    expect(shadow(noShadow, '4px', 'lightContrast')).toBe(
      `border: 1px solid ${defaultProps.theme.colors.lightContrast};`
    )

    expect(shadow(withShadow, 5, 'rgb(1, 2, 3)')).toBe(_('0 45px 48px'))
    expect(shadow(noShadow, 5, 'rgb(1, 2, 3)')).toBe(`border: 1px solid rgb(1, 2, 3);`)
  })

  test('allows fallback: CSS property', () => {
    expect(shadow(withShadow, 2, 'outline: 1px solid black')).toBe(_('0 9px 24px'))
    expect(shadow(noShadow, 2, 'outline: 1px solid black')).toBe('outline: 1px solid black')
  })

  test('allows fallback: CSS object', () => {
    const obj = { outline: '2px dotted cyan', outlineOffset: '2px' }
    expect(shadow(withShadow, 4, obj)).toBe(_('0 30px 42px'))
    expect(shadow(noShadow, 4, obj)).toBe(obj)
  })

  test('allows fallback: style function', () => {
    const fn1 = (p: typeof defaultProps) => `2px dotted ${p.theme.colors.base}`
    expect(shadow(withShadow, 0, fn1)).toBe(_('0 0 3px'))
    expect(shadow(noShadow, 0, fn1)).toBe(`border: 2px dotted ${noShadow.theme.colors.base};`)

    const fn2 = () => 'ouline: 1px dotted orange;'
    expect(shadow(withShadow, 1, fn2)).toBe(_('0 3px 8px'))
    expect(shadow(noShadow, 1, fn2)).toBe('ouline: 1px dotted orange;')

    const fn3 = (p: typeof defaultProps) => ({ backgroundColor: p.theme.colors.lightContrast })
    expect(shadow(withShadow, 'once', fn3)).toBe(_('once'))
    expect(shadow(noShadow, 'once', fn3)).toEqual({
      backgroundColor: noShadow.theme.colors.lightContrast,
    })
  })
})
