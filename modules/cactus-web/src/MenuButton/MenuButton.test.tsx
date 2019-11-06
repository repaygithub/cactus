import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import MenuButton from './MenuButton'
import userEvent from '@testing-library/user-event'

afterEach(cleanup)

function animationRender() {
  return new Promise(resolve => {
    setTimeout(() => {
      window.requestAnimationFrame(resolve)
    }, 0)
  })
}

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
    test('can select an action', () => {
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
      userEvent.click(getByText('Action One'))
      expect(actionOne).toHaveBeenCalled()
    })
  })

  describe('keyboard usage', () => {
    test('can select an action', async () => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <MenuButton label="Demo">
            <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
            <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
            <MenuButton.Link href="#">Action Three</MenuButton.Link>
          </MenuButton>
        </StyleProvider>
      )

      userEvent.click(getByText('Demo'))
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(actionOne).not.toHaveBeenCalled()
      expect(actionTwo).toHaveBeenCalled()
    })
  })
})
