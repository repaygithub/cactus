import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { I18nText } from '../src/index'

afterEach(cleanup)

describe('cactus-fwk', () => {
  describe('<I18nText />', () => {
    test('can render get id', () => {
      const { container } = render(<I18nText get="this_is_my_key" />)
      expect(container).toHaveTextContent('this_is_my_key')
    })

    test('renders children when no dictionary is present', () => {
      const { container } = render(
        <I18nText get="this_is_my_key">This is the default content.</I18nText>
      )
      expect(container).toHaveTextContent('This is the default content.')
    })
  })
})
