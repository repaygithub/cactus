import accepts from '../src/helpers/accept'

describe('accept', () => {
  test('should work for text file types', () => {
    const accepted = ['.txt']
    const result1 = accepts({ name: 'TestFile.txt', type: 'text/plain' } as File, accepted)
    const result2 = accepts({ name: 'TestFile.js', type: 'text/javascript' } as File, accepted)
    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('should work for image file types', () => {
    const accepted = ['.png']
    const result1 = accepts({ name: 'TestFile.png', type: 'image/png' } as File, accepted)
    const result2 = accepts({ name: 'TestFile.jpg', type: 'image/jpg' } as File, accepted)
    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})
