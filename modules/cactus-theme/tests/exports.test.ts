import * as cactusThemeExports from '../src/theme'

describe('@repay/cactus-i18n', (): void => {
  test('should match snapshot of exports', (): void => {
    expect(Object.keys(cactusThemeExports)).toMatchSnapshot()
  })
})
