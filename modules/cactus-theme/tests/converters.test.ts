import { hexToRgb } from '../src/converters'

describe('hex to rgb conversion', (): void => {
  test('correctly converts 3 and 6 length colors', (): void => {
    expect(hexToRgb('#00F')).toEqual(hexToRgb('#0000FF '))
  })
})
