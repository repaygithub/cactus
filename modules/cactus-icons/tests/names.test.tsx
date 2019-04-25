import { cleanup } from 'react-testing-library'
import fs from 'fs'
import path from 'path'

afterEach(cleanup)

describe('Icon names', () => {
  test('should match the snapshot of icon names', () => {
    const names = fs.readdirSync(path.join(__dirname, '../i'))
    expect(names).toMatchSnapshot()
  })
})
