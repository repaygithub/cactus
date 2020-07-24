import { generateTheme } from '@repay/cactus-theme'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import SplitButton from './SplitButton'

describe('component: SplitButton', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
          <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
          <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
        </SplitButton>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  describe('mouse interactions', () => {
    test('can select main action', () => {
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

    test('can select an action from the dropdown', async () => {
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

    test('cannot select main action when disabled', () => {
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

  describe('keyboard interactions', () => {
    test('can select an action from the dropdown', async () => {
      const onAction2Select = jest.fn()
      const { rerender } = render(
        <StyleProvider>
          <SplitButton mainActionLabel="Main Action" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={onAction2Select}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      const dropdownButton = document.querySelector('[aria-haspopup=true]') as HTMLButtonElement
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

  describe('with theme customization', () => {
    test('should have square shape', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'square' })
      const { container } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      expect(container).toMatchSnapshot()
    })
    test('should have intermediate shape', () => {
      const theme = generateTheme({ primaryHue: 200, shape: 'intermediate' })
      const { container } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      expect(container).toMatchSnapshot()
    })
    test('dropdown should not have box shadows', () => {
      const theme = generateTheme({ primaryHue: 200, boxShadows: false })
      const { container } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      expect(container).toMatchSnapshot()
    })
    test('should have 2px borders', () => {
      const theme = generateTheme({ primaryHue: 200, border: 'thick' })
      const { container } = render(
        <StyleProvider theme={theme}>
          <SplitButton mainActionLabel="Test" onSelectMainAction={jest.fn()}>
            <SplitButton.Action onSelect={jest.fn()}>One Action</SplitButton.Action>
            <SplitButton.Action onSelect={jest.fn()}>Another Action</SplitButton.Action>
          </SplitButton>
        </StyleProvider>
      )

      expect(container).toMatchSnapshot()
    })
  })
})
