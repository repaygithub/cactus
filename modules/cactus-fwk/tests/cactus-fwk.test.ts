import * as cactusFwk from '../src/index'

describe('@repay/cactus-fwk', () => {
  test('should match snapshot of exports', () => {
    expect(Object.keys(cactusFwk)).toMatchSnapshot()
  })
})
