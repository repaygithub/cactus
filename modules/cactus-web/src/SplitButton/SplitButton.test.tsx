import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import SplitButton from './SplitButton'

describe('component: SplitButton', () => {
  describe('mouse interactions', () => {
    test('can select main action', () => {
      const onMainClick = jest.fn()
      const { getByText } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={onMainClick}>Main Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainClick).toHaveBeenCalled()
    })

    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction1Click = jest.fn()
      const { getByText, getByLabelText } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action main>Main Action</SplitButton.Action>
          <SplitButton.Action onClick={onAction1Click}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const dropdownButton = getByLabelText('Action List') as HTMLButtonElement
      userEvent.click(dropdownButton)
      const action1 = getByText('One Action')
      userEvent.click(action1)
      expect(onAction1Click).toHaveBeenCalled()
    })

    test('cannot select main action when disabled', () => {
      const onMainClick = jest.fn()
      const { getByText } = renderWithTheme(
        <SplitButton disabled>
          <SplitButton.Action onClick={onMainClick}>Main Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const mainButton = getByText('Main Action')
      userEvent.click(mainButton)
      expect(onMainClick).not.toHaveBeenCalled()
    })
  })

  describe('keyboard interactions', () => {
    test('can select an action from the dropdown', async (): Promise<void> => {
      const onAction2Click = jest.fn()
      const { rerender } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Main Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={onAction2Click}>Another Action</SplitButton.Action>
        </SplitButton>
      )

      const dropdownButton = document.querySelector('[aria-haspopup=menu]') as HTMLButtonElement
      fireEvent.keyDown(dropdownButton, { key: 'Enter' })
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()
      rerender(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Main Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={onAction2Click}>Another Action</SplitButton.Action>
        </SplitButton>
      )
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(onAction2Click).toHaveBeenCalled()
    })
  })

  describe('with theme customization', () => {
    test('should support style props', () => {
      const { container } = renderWithTheme(<SplitButton marginTop={3} marginX={5} flexGrow="2" />)
      expect(container.querySelector(`${SplitButton}`)).toHaveStyle({
        marginTop: '8px',
        marginLeft: '24px',
        marginRight: '24px',
        flexGrow: '2',
      })
    })

    test('should have square shape', () => {
      const { getByText, container } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Test</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { shape: 'square' }
      )
      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('0px 0 0 0px')
      expect(container.querySelector('.SplitButton-dialog')).toHaveStyle({
        borderRadius: '0px',
        borderStyle: '',
        boxShadow: '0 3px 8px hsl(200,45%,81%)',
      })
    })

    test('should have intermediate shape', () => {
      const { getByText, container } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Test</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { shape: 'intermediate' }
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('1px')
      expect(styles.borderRadius).toBe('8px 0 0 8px')
      expect(container.querySelector('.SplitButton-dialog')).toHaveStyle({
        borderRadius: '4px',
        borderStyle: '',
        boxShadow: '0 3px 8px hsl(200,45%,81%)',
      })
    })

    test('dropdown should not have box shadows', () => {
      const { container } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Test</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { boxShadows: false }
      )

      expect(container.querySelector('.SplitButton-dialog')).toHaveStyle({
        borderRadius: '4px',
        borderStyle: 'solid',
        boxShadow: '',
      })
    })

    test('should have 2px borders', () => {
      const { getByText } = renderWithTheme(
        <SplitButton>
          <SplitButton.Action onClick={jest.fn()}>Test</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onClick={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>,
        { border: 'thick' }
      )

      const splitButton = getByText('Test')
      const styles = window.getComputedStyle(splitButton)
      expect(styles.borderWidth).toBe('2px')
    })
  })
})
