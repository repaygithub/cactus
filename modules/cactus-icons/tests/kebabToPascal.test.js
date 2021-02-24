import kebabToPascal from '../scripts/helpers/kebabToPascal'

describe('kebabToPascal', () => {
  test('should convert kebab case to pascal case', () => {
    const result = kebabToPascal('kebab-case-string')
    expect(result).toBe('KebabCaseString')
  })
})
