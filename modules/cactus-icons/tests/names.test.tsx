import { cleanup } from '@testing-library/react'
const fs = require('fs')
const path = require('path')

afterEach(cleanup)

describe('Icon names', () => {
  test('should match the snapshot of icon names', () => {
    const names = fs.readdirSync(path.join(__dirname, '../i'))
    expect(names).toMatchSnapshot()
  })
})
