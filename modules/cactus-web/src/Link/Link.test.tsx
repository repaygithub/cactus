import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Link from './Link'

describe('component: Link', () => {
  test('should support margin space props', () => {
    const { getByText } = renderWithTheme(
      <Link my={4} href="https://somewhere.over/the/rainbow">
        way up high
      </Link>
    )

    const link = getByText('way up high')
    const linkStyles = window.getComputedStyle(link)

    expect(linkStyles.marginTop).toBe('16px')
    expect(linkStyles.marginBottom).toBe('16px')
  })

  test('should contain the correct href', () => {
    const { getByText } = renderWithTheme(<Link href="https://throatpunch.com">cough cough</Link>)

    expect(getByText('cough cough').getAttribute('href')).toBe('https://throatpunch.com')
  })
})
