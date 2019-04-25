import * as icons from '../i'
import { cleanup } from 'react-testing-library'

afterEach(cleanup)

describe('Exports', () => {
  test('should match snapshot of exported icons', () => {
    expect(Object.keys(icons)).toMatchSnapshot()
  })
})
