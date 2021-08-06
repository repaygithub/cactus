/**
 * @jest-environment jsdom
 */
import { fontSize, iconSize, lineHeight, space, textStyle } from '../src/helpers/sizes'
import { defaultProps, expectCurry, expectMemo } from './helpers'

describe('helper: space', () => {
  test('should curry args', () => {
    expectCurry(space, [1], '2px')
  })

  test('should memoize sizes', () => {
    expectMemo(space, { 2: '4px', 3: '8px', 4: '16px', 5: '24px', 7: '40px' })
  })
})

describe('helper: iconSize', () => {
  test('should curry args', () => {
    expectCurry(iconSize, ['small'], '16px')
  })
})

describe('helper: fontSize', () => {
  const h2 = `
    font-size: 25.92px;
    @media screen and (min-width: 1024px) {
      font-size: 31.104px;
    }
  `
  test('should curry args', () => {
    expectCurry(fontSize, ['h2'], h2)
  })

  test('should memoize font sizes', () => {
    expectMemo(fontSize, { body: 'font-size: 18px;', small: 'font-size: 15px;' })
  })
})

describe('helper: lineHeight', () => {
  const realMedia = window.matchMedia
  const query = `@media screen and (min-width: ${defaultProps.theme.breakpoints[1]})`
  const useMobile: any = () => ({ matches: false })
  const useNormal: any = () => ({ matches: true })
  const custom = (l: number, f: number) => `min-height: ${(f / l).toFixed(2)}px;`

  test('should curry args', () => {
    window.matchMedia = useMobile
    expectCurry(lineHeight, ['h1'], '46.65px')
    expectCurry(lineHeight, ['h1', 'em'], '1.5em')
  })

  test('should change per screen size', () => {
    window.matchMedia = useNormal
    expect(lineHeight(defaultProps, 'h1')).toBe('55.9875px')
    expect(lineHeight(defaultProps, 'h1', 'em')).toBe('1.5em')
  })

  test('should render property', () => {
    expect(lineHeight(defaultProps, 'body', 'height')).toBe('height: 27px;')
    expect(lineHeight(defaultProps, 'h1', 'height')).toBe(
      `height: 46.65px; ${query} { height: 55.9875px; }`
    )
  })

  test('should render custom func', () => {
    expect(lineHeight(defaultProps, 'body', custom)).toBe('min-height: 12.00px;')
    expect(lineHeight(defaultProps, 'h1', custom)).toBe(
      `min-height: 20.73px; ${query} { min-height: 24.88px; }`
    )
  })

  afterEach(() => {
    window.matchMedia = realMedia
  })
})

describe('helper: textStyle', () => {
  const h3 = `
    font-size: 21.6px;
    line-height: 1.5;
    @media screen and (min-width: 1024px) {
      font-size: 25.92px;
      line-height: 1.5;
    }
  `
  test('should curry args', () => {
    expectCurry(textStyle, ['h3'], h3)
  })

  test('should memoize text styles', () => {
    expectMemo(textStyle, {
      body: { fontSize: '18px', lineHeight: '1.5' },
      small: { fontSize: '15px', lineHeight: '1.6' },
    })
  })
})
