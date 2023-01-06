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
    expect(title.tagName).toBe('H1')
    expect(desc).toBeInTheDocument()
  })

  test('should render style props', () => {
    const { getByTestId } = renderWithTheme(
      <Header data-testid="style" marginX="7.77em" marginBottom={4}>
        <Header.Title>I Am a Title</Header.Title>
      </Header>
    )

    const header = getByTestId('style')
    expect(header).toHaveStyle({
      marginTop: '',
      marginRight: '7.77em',
      marginBottom: '16px',
      marginLeft: '7.77em',
    })
  })
})
