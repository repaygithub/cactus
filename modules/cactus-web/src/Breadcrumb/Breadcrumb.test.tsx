import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Breadcrumb from './Breadcrumb'

describe('Should render Breadcrumb', (): void => {
  test('snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <Breadcrumb>
          <Breadcrumb.Item label="Link2" linkTo="www.github.com" />
          <Breadcrumb.Item label="Link2" linkTo="www.repay.com" active />
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
          <Breadcrumb.Item label="Link2" linkTo="www.github.com" />
        </Breadcrumb>
      </StyleProvider>
    )

    expect(getByText('Link2')).toBeInTheDocument()
    expect(document.querySelector('a')).toHaveAttribute('href', 'www.github.com')
    expect(container).toMatchSnapshot()
  })
})
