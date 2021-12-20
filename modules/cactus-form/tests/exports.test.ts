import * as cactusForm from '../src/index'

describe('@repay/cactus-form', (): void => {
  test('should match snapshot of exports', (): void => {
    expect(Object.keys(cactusForm)).toMatchSnapshot()
  })
})
