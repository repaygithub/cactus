import * as cactusThemeExports from '../src/theme'

describe('@repay/cactus-i18n', () => {
  test('should match snapshot of exports', () => {
    expect(Object.keys(cactusThemeExports)).toMatchSnapshot()
  })
})
