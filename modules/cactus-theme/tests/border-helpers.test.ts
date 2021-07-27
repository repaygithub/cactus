import { border, borderSize, insetBorder, radius } from '../src/helpers/borders'
import defaultTheme, { CactusColor, generateTheme } from '../src/theme'
import { defaultProps, expectCurry, expectMemo } from './helpers'

const thin = defaultProps
const thick = { theme: generateTheme({ primaryHue: 200, shape: 'square', border: 'thick' }) }

const square = thick
const intermediate = thin
const round = { theme: generateTheme({ primaryHue: 50, shape: 'round' }) }

const altColor = round

describe('helper: borderSize', () => {
  test('should curry args', () => {
    expectCurry(borderSize, [], '1px')
    expectCurry(borderSize, [{ thin: 'I prefer "slim"', thick: 'no, you are' }], 'I prefer "slim"')
  })

  test('gets default border thickness', () => {
    expect(borderSize(thin)).toBe('1px')
    expect(borderSize(thick)).toBe('2px')
  })

  test('gets custom value from options', () => {
    const opts = { thin: 3.1415, thick: 'tau is better' }
    expect(borderSize(thin, opts)).toBe(3.1415)
    expect(borderSize(thick, opts)).toBe('tau is better')
  })
})

describe('helper: border', () => {
  const simpleBorder = `1px solid ${defaultTheme.colors.lightContrast}`

  test('should curry args', () => {
    expectCurry(border, ['lightContrast'], simpleBorder)
  })

  test('should memoize colors', () => {
    expectMemo(
      border,
      { lightContrast: simpleBorder },
      {
        key: 'lightContrast',
        value: `1px solid ${altColor.theme.colors.lightContrast}`,
        ...altColor,
      }
    )
  })

  test('allows fallback color', () => {
    expect(border(defaultProps, 'success')).toBe(`1px solid ${defaultTheme.colors.success}`)
    expect(border(defaultProps, 'orange')).toBe('1px solid orange')
  })

  test('gets custom thickness from options', () => {
    const opts = { thin: '1%', thick: '1em' }
    expect(border(thin, 'green', opts)).toBe('1% solid green')
    expect(border(thick, 'green', opts)).toBe('1em solid green')
  })
})

describe('helper: radius', () => {
  test('should curry args', () => {
    expectCurry(radius, [12], '5px')
  })

  test('should memoize radii', () => {
    expectMemo(radius, { 8: '4px', 20: '8px' }, { key: 8, value: '0px', ...square })
  })

  test('gets radius by theme shape', () => {
    expect(radius(round, 17)).toBe('17px')
    expect(radius(intermediate, 17)).toBe('7px')
    expect(radius(square, 17)).toBe('0px')
  })

  test('allows custom intermediate scale factor', () => {
    expect(radius(square, 17, 0.9)).toBe('0px')
    expect(radius(round, 17, 0.9)).toBe('17px')
    expect(radius(intermediate, 17, 0.9)).toBe('16px')
    expect(radius(intermediate, 17, 1.5)).toBe('26px')
    expect(radius(intermediate, 17, 0.1)).toBe('2px')
  })
})

describe('helper: insetBorder', () => {
  const $ = (c: string, h: string, v: string, s: string) =>
    `box-shadow: inset ${h} ${v} 0 ${s} ${c}`
  const _ = (c: CactusColor, h: string, v: string, s: string, p = defaultProps) =>
    $(p.theme.colors[c], h, v, s)

  test('should curry args', () => {
    expectCurry(insetBorder, ['lightContrast'], _('lightContrast', '0', '0', '1px'))
    expectCurry(insetBorder, ['green', 'bottom', { thin: '3px' }], $('green', '0', '-3px', '0'))
  })

  test('allows fallback color', () => {
    expect(insetBorder(defaultProps, 'success')).toBe(_('success', '0', '0', '1px'))
    expect(insetBorder(defaultProps, 'orange')).toBe($('orange', '0', '0', '1px'))
  })

  test('should change offsets according to direction', () => {
    expect(insetBorder(defaultProps, 'red', 'top')).toBe($('red', '0', '1px', '0'))
    expect(insetBorder(defaultProps, 'red', 'bottom')).toBe($('red', '0', '-1px', '0'))
    expect(insetBorder(defaultProps, 'red', 'left')).toBe($('red', '1px', '0', '0'))
    expect(insetBorder(defaultProps, 'red', 'right')).toBe($('red', '-1px', '0', '0'))
  })

  test('gets custom thickness from options', () => {
    const opts = { thin: '1%', thick: '1em' }
    expect(insetBorder(thin, 'green', undefined, opts)).toBe($('green', '0', '0', '1%'))
    expect(insetBorder(thick, 'green', 'right', opts)).toBe($('green', '-1em', '0', '0'))
  })
})
