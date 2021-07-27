import { fontSize, iconSize, space, textStyle } from '../src/helpers/sizes'
import { expectCurry, expectMemo } from './helpers'

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
