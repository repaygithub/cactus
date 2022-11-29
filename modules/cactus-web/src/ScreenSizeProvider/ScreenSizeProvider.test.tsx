import { SIZES } from './ScreenSizeProvider'

describe('component: ScreenSizeProvider', () => {
  // JSDOM doesn't actually support anything we'd need to test this component.
  test('size comparisons', () => {
    expect(SIZES.tiny < SIZES.small).toBe(true)
    expect(SIZES.tiny < SIZES.large).toBe(true)
    expect(SIZES.small < SIZES.large).toBe(true)
    expect(SIZES.large < SIZES.extraLarge).toBe(true)
    expect(SIZES.large > SIZES.small).toBe(true)

    expect(SIZES.tiny > SIZES.small).toBe(false)
    expect(SIZES.tiny > SIZES.large).toBe(false)
    expect(SIZES.small > SIZES.large).toBe(false)
    expect(SIZES.large > SIZES.extraLarge).toBe(false)
    expect(SIZES.large < SIZES.small).toBe(false)
  })
})
