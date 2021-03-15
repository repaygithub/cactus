import { render } from '@testing-library/react'
import * as React from 'react'

import Breadcrumb from '../Breadcrumb/Breadcrumb'
import Button from '../Button/Button'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Header from './Header'

describe('component: Header', () => {
  test('Should render the Header witha a single title', () => {
    const { container } = render(
      <StyleProvider>
        <Header>
          <Header.Title>Hasta la vista, baby</Header.Title>
        </Header>
      </StyleProvider>
    )
    expect(container).toHaveTextContent('Hasta la vista, baby')
    expect(container).toMatchSnapshot()
  })

  test('Should render the Header with Title and Items', () => {
    const { container } = render(
      <StyleProvider>
        <Header>
          <Header.Title>Heading Title</Header.Title>
          <Header.Item>
            <Button>Click me!</Button>
          </Header.Item>
          <Header.Item>I'll be back</Header.Item>
        </Header>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })
  test('Should render the Header with Title, Breadcrumb and Items', () => {
    const { container } = render(
      <StyleProvider>
        <Header>
          <Header.BreadcrumbRow>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Label</Breadcrumb.Item>
              <Breadcrumb.Item href="/" active>
                <em>Label</em>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Header.BreadcrumbRow>
          <Header.Title>Heading Title</Header.Title>
          <Header.Item>
            <Button>Click me!</Button>
          </Header.Item>
          <Header.Item>I'll be back</Header.Item>
        </Header>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Should render the Header with Title and Items', () => {
    const { container } = render(
      <StyleProvider>
        <Header>
          <Header.Title>Hasta la vista, baby</Header.Title>
          <Header.Item>
            <Button>Click me!</Button>
          </Header.Item>
          <Header.Item>I'll be back</Header.Item>
        </Header>
      </StyleProvider>
    )
    expect(container).toMatchSnapshot()
  })

  test('Header component should change their background color by passing the bgColor prop', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Header bgColor="white" data-testid="headerComponent"></Header>
      </StyleProvider>
    )

    const rawHeader = getByTestId('headerComponent')
    const headerStyles = window.getComputedStyle(rawHeader)
    expect(headerStyles.backgroundColor).toBe('rgb(255, 255, 255)')
  })
})
