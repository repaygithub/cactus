import * as components from '../src/index'

describe('library exports', (): void => {
  test('should match previous exported names', (): void => {
    // removed or renamed exports are a breaking change
    expect(Object.keys(components)).toMatchSnapshot()
  })
})
