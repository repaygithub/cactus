import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import MenuButton from './MenuButton'

describe('component: MenuButton', (): void => {
  describe('mouse usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <MenuButton label="Demo">
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={(): void => console.log('Action Two')}>
              Action Two
            </MenuButton.Item>
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

  describe('keyboard usage', (): void => {
    test('can select an action', async (): Promise<void> => {
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

describe('With theme changes ', (): void => {
  test('Should have square borders', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'square' })
    const { container } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={(): void => console.log('Action One')}>
            Action One
          </MenuButton.Item>
          <MenuButton.Item onSelect={(): void => console.log('Action Two')}>
            Action Two
          </MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )

    const menuButton = container.querySelector('[aria-controls="menu--18"]')
    const styles = window.getComputedStyle(menuButton as Element)

    expect(styles.borderRadius).toBe('1px')
  })
  test('Should have intermediate borders', (): void => {
    const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
    const { container } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={(): void => console.log('Action One')}>
            Action One
          </MenuButton.Item>
          <MenuButton.Item onSelect={(): void => console.log('Action Two')}>
            Action Two
          </MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )

    const menuButton = container.querySelector('[id="menu-button--menu--23"]')
    const styles = window.getComputedStyle(menuButton as Element)

    expect(styles.borderRadius).toBe('8px')
  })

  test('Dropdown should not have box-shadows', (): void => {
    const theme = generateTheme({ primaryHue: 200, boxShadows: false })
    const { container } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={(): void => console.log('Action One')}>
            Action One
          </MenuButton.Item>
          <MenuButton.Item onSelect={(): void => console.log('Action Two')}>
            Action Two
          </MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    const menuButton = container.querySelector('[id="menu-button--menu--28"]')
    const styles = window.getComputedStyle(menuButton as Element)

    expect(styles.boxShadow).toBe('')
  })

  test('Border should be 2px', (): void => {
    const theme = generateTheme({ primaryHue: 200, border: 'thick' })
    const { container } = render(
      <StyleProvider theme={theme}>
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={(): void => console.log('Action One')}>
            Action One
          </MenuButton.Item>
          <MenuButton.Item onSelect={(): void => console.log('Action Two')}>
            Action Two
          </MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      </StyleProvider>
    )
    const menuButton = container.querySelector('[id="menu-button--menu--33"]')
    const styles = window.getComputedStyle(menuButton as Element)

    expect(styles.borderWidth).toBe('2px')
  })
})
