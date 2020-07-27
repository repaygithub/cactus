import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import MenuButton from './MenuButton'

describe('component: MenuButton', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  describe('mouse usage', () => {
    test('can select an action', async () => {
      const actionOne = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <MenuButton label="Demo">
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
            <MenuButton.Link href="#">Action Three</MenuButton.Link>
          </MenuButton>
        </StyleProvider>
      )

      userEvent.click(getByText('Demo'))
      await animationRender()
      userEvent.click(getByText('Action One'))
      expect(actionOne).toHaveBeenCalled()
    })
  })

  describe('keyboard usage', () => {
    test('can select an action', async () => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()
      const { getByText, rerender } = render(
        <StyleProvider>
          <MenuButton label="Demo">
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
            <MenuButton.Link href="#">Action Three</MenuButton.Link>
          </MenuButton>
        </StyleProvider>
      )

      fireEvent.keyDown(getByText('Demo'), { key: 'Enter' })
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()
      rerender(
        <StyleProvider>
          <MenuButton label="Demo">
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
            <MenuButton.Link href="#">Action Three</MenuButton.Link>
          </MenuButton>
        </StyleProvider>
      )
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(actionOne).not.toHaveBeenCalled()
      expect(actionTwo).toHaveBeenCalled()
    })
  })
})

describe('With theme changes ', () => {
  test('Should have square borders', () => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
  test('Should have intermediate borders', () => {
    const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('Dropdown should not have box-shadows', () => {
    const theme = generateTheme({ primaryHue: 200, boxShadows: false })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })

  test('Border should be 2px', () => {
    const theme = generateTheme({ primaryHue: 200, border: 'thick' })
    const { asFragment } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    expect(asFragment()).toMatchSnapshot()
  })
})
