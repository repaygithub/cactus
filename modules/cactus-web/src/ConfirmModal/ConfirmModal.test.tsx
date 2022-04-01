import { generateTheme } from '@repay/cactus-theme'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'
import ConfirmModal from './ConfirmModal'

describe('component: ConfirmModal', () => {
  const theme = generateTheme()
  test('Should render warning variant', () => {
    const { getByTestId } = renderWithTheme(
      <ConfirmModal
        onConfirm={() => {
          return
        }}
        onClose={() => {
          return
        }}
        isOpen={true}
        variant="warning"
        data-testid="confirmModal"
      />
    )
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.warning.replace(/ /g, ''))
  })

  test('Should render success variant', () => {
    const { getByTestId } = renderWithTheme(
      <ConfirmModal
        onConfirm={() => {
          return
        }}
        onClose={() => {
          return
        }}
        isOpen={true}
        variant="success"
        data-testid="confirmModal"
      />
    )
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.success.replace(/ /g, ''))
  })

  test('Should render danger variant', () => {
    const { getByTestId } = renderWithTheme(
      <ConfirmModal
        onConfirm={() => {
          return
        }}
        onClose={() => {
          return
        }}
        isOpen={true}
        variant="danger"
        data-testid="confirmModal"
      />
    )
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.error.replace(/ /g, ''))
  })

  test('Should render child elements', () => {
    const { getByTestId } = renderWithTheme(
      <ConfirmModal
        onConfirm={() => {
          return
        }}
        onClose={() => {
          return
        }}
        isOpen={true}
        variant="danger"
      >
        <Text as="h4" fontWeight="normal" data-testid="description">
          Description text
        </Text>
        <TextInput placeholder="Placeholder" width="90%" data-testid="input" />
      </ConfirmModal>
    )
    const input = getByTestId('input')
    const description = getByTestId('description')
    expect(input).toBeTruthy()
    expect(description).toBeTruthy()
  })

  test('Should support flex item props', () => {
    const { getByText } = renderWithTheme(
      <ConfirmModal
        isOpen={true}
        onConfirm={jest.fn()}
        onClose={jest.fn()}
        flex={1}
        flexGrow={1}
        flexShrink={0}
        flexBasis={0}
      >
        Flex Confirm Modal
      </ConfirmModal>
    )

    const confirmModal = getByText('Flex Confirm Modal').parentElement
    expect(confirmModal).toHaveStyle('flex: 1')
    expect(confirmModal).toHaveStyle('flex-grow: 1')
    expect(confirmModal).toHaveStyle('flex-shrink: 0')
    expect(confirmModal).toHaveStyle('flex-basis: 0')
  })
})
