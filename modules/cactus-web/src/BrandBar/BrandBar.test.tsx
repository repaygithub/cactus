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
        </StyleProvider>
      )

      userEvent.click(getByText('Test name'))
      await animationRender()
      userEvent.click(getByText('Settings'))
      expect(actionOne).toHaveBeenCalled()
    })

    test('can interact with a dropdown', () => {
      const firstOptionClick = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar>
            <BrandBar.Item as={BrandBar.Dropdown} label="Test Dropdown">
              <ul>
                <li onClick={firstOptionClick}>Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
              </ul>
            </BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      userEvent.click(getByText('Test Dropdown'))
      userEvent.click(getByText('Option 1'))
      expect(firstOptionClick).toHaveBeenCalled()
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

      fireEvent.keyDown(getByText('Test name'), { key: 'Enter' })
      await animationRender()

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      await animationRender()
      expect(actionOne).not.toHaveBeenCalled()
      expect(actionTwo).toHaveBeenCalled()
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
                <li onClick={thirdOptionClick} tabIndex={0}>
                  Option 3
                </li>
              </ul>
            </BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      fireEvent.keyDown(getByText('Test Dropdown'), { key: 'Enter' })
      const firstOption = getByText('Option 1')
      expect(document.activeElement).toBe(firstOption)

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })

      expect(thirdOptionClick).toHaveBeenCalled()
      expect(document.activeElement).toBe(getByText('Test Dropdown').parentElement)
    })
  })
})
