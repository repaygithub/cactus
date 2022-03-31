import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Header from './Header'

describe('component: Header', () => {
  test('Header component should change their background color by passing the bgColor prop', () => {
    const { getByTestId } = renderWithTheme(
      <Header bgColor="white" data-testid="headerComponent"></Header>
    )

    const rawHeader = getByTestId('headerComponent')
    const headerStyles = window.getComputedStyle(rawHeader)
    expect(headerStyles.backgroundColor).toBe('rgb(255, 255, 255)')
  })

  test('Header should render its title and description', () => {
    const { getByText } = renderWithTheme(
      <Header>
        <Header.Title>I Am a Title</Header.Title>
        <Header.Description>I am a description</Header.Description>
      </Header>
    )

    const title = getByText('I Am a Title')
    const desc = getByText('I am a description')

    expect(title).toBeInTheDocument()
    expect(title.tagName).toBe('H2')
    expect(desc).toBeInTheDocument()
  })
})
