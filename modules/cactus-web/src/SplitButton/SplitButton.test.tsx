import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import SplitButton from './SplitButton'

describe('component: SplitButton', () => {
  describe('mouse interactions', () => {
    test('can select main action', () => {
      const onMainSelect = jest.fn()
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Main Action" onSelectMainAction={onMainSelect}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainSelect).toHaveBeenCalled()
    })

    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction1Select = jest.fn()
      const { getByText, getByLabelText } = renderWithTheme(
        <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={onAction1Select}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const dropdownButton = getByLabelText('Action List') as HTMLButtonElement
      userEvent.click(dropdownButton)
      const action1 = getByText('One Action')
      userEvent.click(action1)
      expect(onAction1Select).toHaveBeenCalled()
    })

    test('cannot select main action when disabled', () => {
      const onMainSelect = jest.fn()
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Main Action" onSelectMainAction={onMainSelect} disabled>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainSelect).not.toHaveBeenCalled()
    })
  })

  describe('keyboard interactions', () => {
    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction2Select = jest.fn()
      const { rerender } = renderWithTheme(
        <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={onAction2Select}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const dropdownButton = document.querySelector('[aria-haspopup=menu]') as HTMLButtonElement
      fireEvent.keyDown(dropdownButton, { key: 'Enter' })
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()
      rerender(
        <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={onAction2Select}>Another Action</SplitButton.Action>
        </SplitButton>
      )
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(onAction2Select).toHaveBeenCalled()
    })
  })

  describe('with theme customization', () => {
    test('should have square shape', () => {
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { shape: 'square' }
      )
      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('1px')
    })

    test('should have intermediate shape', () => {
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { shape: 'intermediate' }
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('8px 1px 1px 8px')
    })
    test('dropdown should not have box shadows', () => {
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { boxShadows: false }
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.boxShadow).toBe('')
    })
    test('should have 2px borders', () => {
      const { getByText } = renderWithTheme(
        <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { border: 'thick' }
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('2px')
    })
  })
})
