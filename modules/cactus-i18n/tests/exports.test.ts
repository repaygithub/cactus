import * as cactusI18n from '../src/index'

describe('@repay/cactus-i18n', () => {
  test('should match snapshot of exports', () => {
    expect(Object.keys(cactusI18n)).toMatchSnapshot()
  })
})
