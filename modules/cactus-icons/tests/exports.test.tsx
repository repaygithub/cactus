import * as icons from '@repay/cactus-icons'

describe('Exports', (): void => {
  test('should match snapshot of exported icons', (): void => {
    expect(Object.keys(icons)).toMatchSnapshot()
  })
})
