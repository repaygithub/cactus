import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Footer from './Footer'

const REPAY_LOGO =
  'https://repay-merchant-resources.s3.amazonaws.com/staging/24bd1970-a677-4ca7-a4d2-e328ddd4691b/repay_logo_new.jpg'
const Logo = () => <img data-testid="image" src={REPAY_LOGO} />

describe('component: Footer', () => {
  test('should be able to pass custom content using children', () => {
    const { getByText } = renderWithTheme(<Footer logo={REPAY_LOGO}>Custom Content</Footer>)

    expect(getByText('Custom Content')).toBeInTheDocument()
  })

  test('should be able to pass a logo using a component', () => {
    const { getByTestId } = renderWithTheme(<Footer logo={<Logo />}>Custom Content</Footer>)

    expect(getByTestId('image')).toBeInTheDocument()
  })
})
