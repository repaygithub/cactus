import { cleanup, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Breadcrumb from './Breadcrumb'

afterEach(cleanup)

describe('Should render Breadcrumb', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item linkTo="www.github.com">Link2</Breadcrumb.Item>
          <Breadcrumb.Item linkTo="www.repay.com" active>
            Link2
          </Breadcrumb.Item>
        </Breadcrumb>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })
})

describe('Breadcrumb should have label and linkTo', (): void => {
  test('snapshot', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item linkTo="www.github.com">Link2</Breadcrumb.Item>
        </Breadcrumb>
      </StyleProvider>
    )

    expect(getByText('Link2')).toBeInTheDocument()
    expect(document.querySelector('a')).toHaveAttribute('href', 'www.github.com')
    expect(container).toMatchSnapshot()
  })
})
