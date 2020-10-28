import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Link from './Link'

describe('component: Link', (): void => {
  test('should render a Link', (): void => {
    const { container } = render(
      <StyleProvider>
        <Link to="https://somewhere.over/the/rainbow">way up high</Link>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should support margin space props', (): void => {
    const { container } = render(
      <StyleProvider>
        <Link my={4} to="https://somewhere.over/the/rainbow">
          way up high
        </Link>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should contain the correct href', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Link to="https://throatpunch.com">cough cough</Link>
      </StyleProvider>
    )

    expect(getByText('cough cough').getAttribute('href')).toBe('https://throatpunch.com')
  })
})
