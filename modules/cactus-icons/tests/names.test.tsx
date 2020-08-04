import { cleanup } from '@testing-library/react'
import fs from 'fs'
import path from 'path'

afterEach(cleanup)

describe('Icon names', (): void => {
  test('should match the snapshot of icon names', (): void => {
    const names = fs.readdirSync(path.join(__dirname, '../i'))
    expect(names).toMatchSnapshot()
  })
})
