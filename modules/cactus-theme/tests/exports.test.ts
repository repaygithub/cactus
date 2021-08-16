import * as cactusThemeExports from '../src/index'

describe('@repay/cactus-i18n', (): void => {
  test('should match snapshot of exports', (): void => {
    expect(Object.keys(cactusThemeExports)).toMatchSnapshot()
  })
})
