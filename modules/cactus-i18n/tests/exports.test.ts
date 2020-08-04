import * as cactusI18n from '../src/index'

describe('@repay/cactus-i18n', (): void => {
  test('should match snapshot of exports', (): void => {
    expect(Object.keys(cactusI18n)).toMatchSnapshot()
  })
})
