import { breakpoint, mediaGTE, mediaLT } from '../src/helpers/breakpoints'
import { generateTheme } from '../src/theme'
import { defaultProps, expectCurry, expectMemo } from './helpers'

const altBP = {
  theme: generateTheme({
    primaryHue: 200,
    breakpoints: { small: '20rem', medium: '500px', large: '80rem', extraLarge: '1200px' },
  }),
}

describe('helper: mediaGTE', () => {
  test('should curry args', () => {
    expectCurry(mediaGTE, ['large'], '@media screen and (min-width: 1200px)')
  })

  test('should memoize screen sizes', () => {
    expectMemo(
      mediaGTE,
      {
        small: '@media screen and (min-width: 768px)',
        medium: '@media screen and (min-width: 1024px)',
      },
      { key: 'small', value: '@media screen and (min-width: 20rem)', ...altBP }
    )
  })
})

describe('helper: mediaLT', () => {
  test('should curry args', () => {
    expectCurry(mediaLT, ['extraLarge'], '@media screen and (not (min-width: 1440px))')
  })

  test('should memoize screen sizes', () => {
    expectMemo(
      mediaLT,
      {
        small: '@media screen and (not (min-width: 768px))',
        medium: '@media screen and (not (min-width: 1024px))',
      },
      { key: 'medium', value: '@media screen and (not (min-width: 500px))', ...altBP }
    )
  })
})

describe('helper: breakpoint', () => {
  test('should curry args', () => {
    expectCurry(breakpoint, ['large'], '1200px')
  })

  test('should accept index or name', () => {
    const small = breakpoint(defaultProps, 'small')
    expect(small).toBe('768px')
    expect(breakpoint(defaultProps, 0)).toBe(small)

    const medium = breakpoint(defaultProps, 'medium')
    expect(medium).toBe('1024px')
    expect(breakpoint(defaultProps, 1)).toBe(medium)

    const large = breakpoint(defaultProps, 'large')
    expect(large).toBe('1200px')
    expect(breakpoint(defaultProps, 2)).toBe(large)

    const extraLarge = breakpoint(defaultProps, 'extraLarge')
    expect(extraLarge).toBe('1440px')
    expect(breakpoint(defaultProps, 3)).toBe(extraLarge)
  })
})
