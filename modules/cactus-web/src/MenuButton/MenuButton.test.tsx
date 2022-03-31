import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import animationRender from '../../tests/helpers/animationRender'
import renderWithTheme from '../../tests/helpers/renderWithTheme'
import MenuButton from './MenuButton'

describe('component: MenuButton', () => {
  describe('mouse usage', () => {
    test('can select an action', async () => {
      const actionOne = jest.fn()
      const { getByText } = renderWithTheme(
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      )
      userEvent.click(getByText('Demo'))
      fireEvent.focus(getByText('Action One'))
      userEvent.click(getByText('Action One'))
      expect(actionOne).toHaveBeenCalled()
    })
  })

  describe('keyboard usage', () => {
    test('can select an action', async () => {
      const actionOne = jest.fn()
      const actionTwo = jest.fn()
      const { getByText, rerender } = renderWithTheme(
        <MenuButton label="Demo" variant="unfilled">
          <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      )

      fireEvent.keyDown(getByText('Demo'), { key: 'Enter' })
      await animationRender()
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
      await animationRender()
      rerender(
        <MenuButton label="Demo">
          <MenuButton.Item onSelect={actionOne}>Action One</MenuButton.Item>
          <MenuButton.Item onSelect={actionTwo}>Action Two</MenuButton.Item>
          <MenuButton.Link href="#">Action Three</MenuButton.Link>
        </MenuButton>
      )
      // @ts-ignore
      fireEvent.keyDown(document.activeElement, { key: 'Enter' })
      expect(actionOne).not.toHaveBeenCalled()
      expect(actionTwo).toHaveBeenCalled()
    })
  })
})

describe('With theme changes ', () => {
  test('Should have square borders', () => {
    const { getByText } = renderWithTheme(
      <MenuButton label="Demo">
        <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
        <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
        <MenuButton.Link href="#">Action Three</MenuButton.Link>
      </MenuButton>,
      { shape: 'square' }
    )

    const styles = window.getComputedStyle(getByText('Demo'))

    expect(styles.borderRadius).toBe('1px')
  })
  test('Should have intermediate borders', () => {
    const { getByText } = renderWithTheme(
      <MenuButton label="Demo">
        <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
        <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
        <MenuButton.Link href="#">Action Three</MenuButton.Link>
      </MenuButton>,
      { shape: 'intermediate' }
    )

    const styles = window.getComputedStyle(getByText('Demo'))

    expect(styles.borderRadius).toBe('8px')
  })

  test('Dropdown should not have box-shadows', () => {
    const { getByText } = renderWithTheme(
      <MenuButton label="Demo">
        <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
        <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
        <MenuButton.Link href="#">Action Three</MenuButton.Link>
      </MenuButton>,
      { boxShadows: false }
    )
    const styles = window.getComputedStyle(getByText('Demo'))

    expect(styles.boxShadow).toBe('')
  })

  test('Border should be 2px', () => {
    const { getByText } = renderWithTheme(
      <MenuButton label="Demo">
        <MenuButton.Item onSelect={() => console.log('Action One')}>Action One</MenuButton.Item>
        <MenuButton.Item onSelect={() => console.log('Action Two')}>Action Two</MenuButton.Item>
        <MenuButton.Link href="#">Action Three</MenuButton.Link>
      </MenuButton>,
      { border: 'thick' }
    )
    const styles = window.getComputedStyle(getByText('Demo'))

    expect(styles.borderWidth).toBe('2px')
  })
})
