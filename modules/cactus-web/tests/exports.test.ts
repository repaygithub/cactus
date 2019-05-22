import * as components from '../src/index'

describe('library exports', () => {
  test('should match previous exported names', () => {
    // removed or renamed exports are a breaking change
    expect(Object.keys(components)).toMatchSnapshot()
  })
})
