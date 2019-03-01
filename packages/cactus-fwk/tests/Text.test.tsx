import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { Text } from '../src/index'

afterEach(cleanup)

describe('cactus-fwk', () => {
  describe('<Text />', () => {
    test('can render get id', () => {
      const { container } = render(<Text get="this_is_my_key" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('renders children when no dictionary is present', () => {
      const { container } = render(<Text get="this_is_my_key">This is the default content.</Text>)
      expect(container).toHaveTextContent('This is the default content.')
    })
  })
})
