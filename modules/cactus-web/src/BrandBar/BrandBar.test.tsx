import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import BrandBar from './BrandBar'

describe('component: BrandBar', () => {
  describe('mouse usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.UserMenu label="Test name">
              <BrandBar.UserMenuItem onClick={actionOne}>Settings</BrandBar.UserMenuItem>
              <BrandBar.UserMenuItem onClick={(): void => console.log('Logout')}>
                Logout
              </BrandBar.UserMenuItem>
            </BrandBar.UserMenu>
          </BrandBar>
          <div>Click me</div>
        </StyleProvider>
      )

      const trigger = getByText('Test name').parentElement as HTMLElement

      userEvent.click(trigger)
      const settings = getByText('Settings')
      expect(settings).toBeVisible()

      userEvent.click(getByText('Click me'))

      expect(settings).not.toBeVisible()

      userEvent.click(trigger)
      userEvent.click(settings)
      await animationRender()

      expect(actionOne).toHaveBeenCalled()
      expect(getByText('Logout')).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)
    })

    test('can interact with a dropdown', async () => {
      const firstOptionClick = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.Item as={BrandBar.Dropdown} label="Test Dropdown">
              <ul>
                <li role="menuitem" onClick={firstOptionClick}>
                  Option 1
                </li>
                <li>Option 2</li>
                <li>Option 3</li>
              </ul>
            </BrandBar.Item>
          </BrandBar>
          <div>Click me</div>
        </StyleProvider>
      )

      const trigger = getByText('Test Dropdown').parentElement as HTMLElement

      userEvent.click(trigger)
      const option1 = getByText('Option 1')

      expect(option1).toBeVisible()

      userEvent.click(getByText('Click me'))
      expect(option1).not.toBeVisible()

      userEvent.click(trigger)
      userEvent.click(option1)
      await animationRender()

      expect(firstOptionClick).toHaveBeenCalled()
      expect(getByText('Option 2')).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)
    })

    test('item supports custom item selectors', async () => {
      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.Item
              as={BrandBar.Dropdown}
              listItemSelector='[role="custom-selector"], [role="custom-selector"] *'
              label="Test Dropdown"
            >
              <ul>
                <li role="menuitem">Option 1</li>
                <li>Option 2</li>
                <li role="custom-selector">Option 3</li>
              </ul>
            </BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      const trigger = getByText('Test Dropdown').parentElement as HTMLElement

      userEvent.click(trigger)
      const option1 = getByText('Option 1')
      const option2 = getByText('Option 2')
      const option3 = getByText('Option 3')
      userEvent.click(option1)

      expect(option1).toBeVisible()

      userEvent.click(option2)

      expect(option2).toBeVisible()

      userEvent.click(option3)

      expect(option3).not.toBeVisible()
    })
  })

  describe('keyboard usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()

      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.UserMenu label="Test name">
              <BrandBar.UserMenuItem onClick={actionOne}>Settings</BrandBar.UserMenuItem>
              <BrandBar.UserMenuItem onClick={actionTwo}>Logout</BrandBar.UserMenuItem>
            </BrandBar.UserMenu>
          </BrandBar>
        </StyleProvider>
      )

      const trigger = getByText('Test name').parentElement as HTMLElement

      fireEvent.keyDown(trigger, { key: 'Enter' })

      const settings = getByText('Settings')
      const logout = getByText('Logout')

      expect(document.activeElement).toBe(settings)

      fireEvent.keyDown(document.activeElement as Element, { key: 'End' })

      expect(document.activeElement).toBe(logout)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })

      expect(document.activeElement).toBe(settings)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' })

      expect(settings).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' })

      fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })

      expect(document.activeElement).toBe(logout)

      fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' })

      expect(actionOne).toHaveBeenCalled()
      expect(actionTwo).not.toHaveBeenCalled()
      expect(getByText('Logout')).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)
    })

    test('can interact with a dropdown', () => {
      const thirdOptionClick = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.Item as={BrandBar.Dropdown} label="Test Dropdown">
              <ul>
                <li tabIndex={0}>Option 1</li>
                <li tabIndex={0}>Option 2</li>
                <li role="menuitem" onClick={thirdOptionClick} tabIndex={0}>
                  Option 3
                </li>
              </ul>
            </BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      const trigger = getByText('Test Dropdown').parentElement as HTMLElement
      fireEvent.keyDown(trigger, { key: 'Enter' })
      const option1 = getByText('Option 1')
      const option2 = getByText('Option 2')
      const option3 = getByText('Option 3')

      expect(document.activeElement).toBe(option1)

      fireEvent.keyDown(document.activeElement as Element, { key: 'End' })

      expect(document.activeElement).toBe(option3)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })

      expect(document.activeElement).toBe(option1)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' })

      expect(option2).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)

      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' })
      fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
      fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
      fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' })

      expect(thirdOptionClick).toHaveBeenCalled()
      expect(option2).not.toBeVisible()
      expect(document.activeElement).toBe(trigger)
    })
  })
})
