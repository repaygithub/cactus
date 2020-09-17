import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import BrandBar from './BrandBar'

describe('component: BrandBar', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <BrandBar usernameText="Test name">
          <BrandBar.Item onSelect={(): void => console.log('Settings')}>Settings</BrandBar.Item>
          <BrandBar.Item onSelect={(): void => console.log('Logout')}>Logout</BrandBar.Item>
        </BrandBar>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  describe('mouse usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <BrandBar usernameText="Test name">
            <BrandBar.Item onSelect={actionOne}>Settings</BrandBar.Item>
            <BrandBar.Item onSelect={(): void => console.log('Logout')}>Logout</BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      userEvent.click(getByText('Test name'))
      await animationRender()
      userEvent.click(getByText('Settings'))
      expect(actionOne).toHaveBeenCalled()
    })
  })

  describe('mouse usage', (): void => {
    test('can select an action', async (): Promise<void> => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()

      const { getByText } = render(
        <StyleProvider>
          <BrandBar usernameText="Test name">
            <BrandBar.Item onSelect={actionOne}>Settings</BrandBar.Item>
            <BrandBar.Item onSelect={actionTwo}>Logout</BrandBar.Item>
          </BrandBar>
        </StyleProvider>
      )

      fireEvent.keyDown(getByText('Test name'), { key: 'Enter' })
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      await animationRender()
      expect(actionOne).not.toHaveBeenCalled()
      expect(actionTwo).toHaveBeenCalled()
    })
  })
})
