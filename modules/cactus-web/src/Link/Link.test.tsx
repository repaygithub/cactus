import * as React from 'react'
import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'
import Link from './Link'

afterEach(cleanup)

describe('component: Link', () => {
  test('should render a Link', () => {
    const { container } = render(
      <StyleProvider>
        <Link to="https://somewhere.over/the/rainbow">way up high</Link>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should contain the correct href', () => {
    const { getByText } = render(
      <StyleProvider>
        <Link to="https://throatpunch.com">cough cough</Link>
      </StyleProvider>
    )

    expect(getByText('cough cough').getAttribute('href')).toBe('https://throatpunch.com')
  })
})
