import { generateTheme } from '@repay/cactus-theme'
import { fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import SplitButton from './SplitButton'

describe('component: SplitButton', (): void => {
  describe('mouse interactions', (): void => {
    test('can select main action', (): void => {
      const onMainSelect = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={onMainSelect}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainSelect).toHaveBeenCalled()
    })

    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction1Select = jest.fn()
      const { getByText, getByLabelText } = render(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={onAction1Select}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const dropdownButton = getByLabelText('Action List') as HTMLButtonElement
      userEvent.click(dropdownButton)
      const action1 = getByText('One Action')
      userEvent.click(action1)
      expect(onAction1Select).toHaveBeenCalled()
    })

    test('cannot select main action when disabled', (): void => {
      const onMainSelect = jest.fn()
      const { getByText } = render(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={onMainSelect} disabled>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainSelect).not.toHaveBeenCalled()
    })
  })

  describe('keyboard interactions', (): void => {
    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction2Select = jest.fn()
      const { rerender } = render(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={onAction2Select}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const dropdownButton = document.querySelector('[aria-haspopup=menu]') as HTMLButtonElement
      fireEvent.keyDown(dropdownButton, { key: 'Enter' })
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()
      rerender(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={onAction2Select}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(onAction2Select).toHaveBeenCalled()
    })
  })

  describe('with theme customization', (): void => {
    test('should have square shape', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )
      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('1px')
    })

    test('should have intermediate shape', (): void => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('8px 1px 1px 8px')
    })
    test('dropdown should not have box shadows', (): void => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.boxShadow).toBe('')
    })
    test('should have 2px borders', (): void => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { getByText } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('2px')
    })
  })
})
