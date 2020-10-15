import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { ScreenSizeContext, SIZES } from '../ScreenSizeProvider/ScreenSizeProvider'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import BrandBar from './BrandBar'

describe('component: BrandBar', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <BrandBar userMenuText="Test name">
          <BrandBar.UserMenuItem onSelect={(): void => console.log('Settings')}>
            Settings
          </BrandBar.UserMenuItem>
          <BrandBar.UserMenuItem onSelect={(): void => console.log('Logout')}>
            Logout
          </BrandBar.UserMenuItem>
        </BrandBar>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('snapshot - mobile', () => {
    const { container } = render(
      <StyleProvider>
        <ScreenSizeContext.Provider value={SIZES.tiny}>
          <BrandBar userMenuText="Test name">
            <BrandBar.UserMenuItem onSelect={(): void => console.log('Settings')}>
              Settings
            </BrandBar.UserMenuItem>
            <BrandBar.UserMenuItem onSelect={(): void => console.log('Logout')}>
              Logout
            </BrandBar.UserMenuItem>
          </BrandBar>
        </ScreenSizeContext.Provider>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  describe('mouse usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar userMenuText="Test name">
            <BrandBar.UserMenuItem onSelect={actionOne}>Settings</BrandBar.UserMenuItem>
            <BrandBar.UserMenuItem onSelect={(): void => console.log('Logout')}>
              Logout
            </BrandBar.UserMenuItem>
          </BrandBar>
        </StyleProvider>
      )

      userEvent.click(getByText('Test name'))
      await animationRender()
      userEvent.click(getByText('Settings'))
      expect(actionOne).toHaveBeenCalled()
    })
  })

  describe('keyboard usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()

      const { getByText } = render(
        <StyleProvider>
          <BrandBar userMenuText="Test name">
            <BrandBar.UserMenuItem onSelect={actionOne}>Settings</BrandBar.UserMenuItem>
            <BrandBar.UserMenuItem onSelect={actionTwo}>Logout</BrandBar.UserMenuItem>
          </BrandBar>
        </StyleProvider>
      )

      fireEvent.keyDown(getByText('Test name'), { key: 'Enter' })
      await animationRender()

      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
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
  })
})
