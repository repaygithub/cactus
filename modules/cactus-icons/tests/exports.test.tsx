import * as icons from '@repay/cactus-icons'
import { cleanup } from '@testing-library/react'

afterEach(cleanup)

describe('Exports', (): void => {
  test('should match snapshot of exported icons', (): void => {
    expect(Object.keys(icons)).toMatchSnapshot()
  })
})
