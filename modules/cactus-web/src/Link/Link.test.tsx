import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Link from './Link'

describe('component: Link', (): void => {
  test('should support margin space props', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Link my={4} to="https://somewhere.over/the/rainbow">
          way up high
        </Link>
      </StyleProvider>
    )

    const link = getByText('way up high')
    const linkStyles = window.getComputedStyle(link)

    expect(linkStyles.marginTop).toBe('16px')
    expect(linkStyles.marginBottom).toBe('16px')
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
