import * as cactusFwk from '../src/index'

describe('@repay/cactus-fwk', (): void => {
  test('should match snapshot of exports', (): void => {
    expect(Object.keys(cactusFwk)).toMatchSnapshot()
  })
})
