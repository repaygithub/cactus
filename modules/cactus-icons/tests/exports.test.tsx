import defaultExport, * as namedExports from '@repay/cactus-icons'

describe('Exports', (): void => {
  test('should match snapshot of named exports', async () => {
    expect(Object.keys(namedExports)).toMatchSnapshot()
  })

  test('should match snapshot of default export', async () => {
    expect(Object.keys(defaultExport)).toMatchSnapshot()
  })
})
