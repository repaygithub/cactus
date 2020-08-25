import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Footer from './Footer'
import RepayLogo from './repay-logo.png'

const Logo = () => <img data-testid="image" src={RepayLogo} />

describe('component: Footer', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Footer logo={RepayLogo}>
          Custom Content
          <Footer.Link to="https://google.com">Some Link</Footer.Link>
          <Footer.Link to="https://repay.com">Some Other Link</Footer.Link>
        </Footer>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should be able to pass custom content using Footer.Main', () => {
    const { getByText } = render(
      <StyleProvider>
        <Footer logo={RepayLogo}>
          Custom Content
          <Footer.Link to="https://google.com">Some Link</Footer.Link>
          <Footer.Link to="https://repay.com">Some Other Link</Footer.Link>
        </Footer>
      </StyleProvider>
    )

    expect(getByText('Custom Content')).toBeInTheDocument()
  })

  test('should be able to pass links using Footer.Link', () => {
    const { getByText } = render(
      <StyleProvider>
        <Footer logo={RepayLogo}>
          Custom Content
          <Footer.Link to="https://google.com">Some Link</Footer.Link>
          <Footer.Link to="https://repay.com">Some Other Link</Footer.Link>
        </Footer>
      </StyleProvider>
    )

    const link1 = getByText('Some Link')
    const link2 = getByText('Some Other Link')

    expect(link1).toBeInTheDocument()
    expect(link2).toBeInTheDocument()
    expect(link1).toHaveAttribute('href', 'https://google.com')
    expect(link2).toHaveAttribute('href', 'https://repay.com')
  })

  test('should be able to pass a logo using a component', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Footer logo={Logo}>
          Custom Content
          <Footer.Link to="https://google.com">Some Link</Footer.Link>
          <Footer.Link to="https://repay.com">Some Other Link</Footer.Link>
        </Footer>
      </StyleProvider>
    )

    expect(getByTestId('image')).toBeInTheDocument()
  })
})
