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

  test('should support style props', () => {
    const { getByTestId, rerender } = renderWithTheme(<Footer data-testid="footer" />)
    const footer = getByTestId('footer')
    expect(footer).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '24px',
      paddingBottom: '24px',
      paddingLeft: '40px',
      paddingRight: '40px',
    })
    expect(footer.firstElementChild).toHaveClass('footer-content')
    rerender(<Footer flexFlow="row" alignItems="stretch" padding="2rem" />)
    expect(footer).toHaveStyle({
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'stretch',
      paddingTop: '2rem',
      paddingBottom: '2rem',
      paddingLeft: '2rem',
      paddingRight: '2rem',
    })
    expect(footer.firstElementChild).toBe(null)
  })

  describe('component: Footer.Logo', () => {
    test('should support style props', () => {
      const { getByTestId, rerender } = renderWithTheme(<Footer.Logo data-testid="logo" />)
      const logo = getByTestId('logo')
      expect(logo).toHaveStyle({
        flexBasis: '',
        marginBottom: '24px',
        minHeight: '',
        minWidth: '',
        position: '',
        left: '',
      })
      expect(logo).toHaveClass('footer-logo')
      rerender(
        <Footer.Logo
          flexBasis="20%"
          m={4}
          minHeight="24px"
          minWidth="24px"
          position="absolute"
          left="10px"
        />
      )
      expect(logo).toHaveStyle({
        flexBasis: '20%',
        marginBottom: '16px',
        minHeight: '24px',
        minWidth: '24px',
        position: 'absolute',
        left: '10px',
      })
    })
  })
})
