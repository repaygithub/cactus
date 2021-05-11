import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'
import ConfirmModal from './ConfirmModal'

describe('Confirm modal renders different variants', () => {
  const theme = generateTheme()
  test('Warning variant', () => {
    const { getByTestId } = render(
      <StyleProvider theme={theme}>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
            return
          }}
          isOpen={true}
          variant="warning"
          data-testid="confirmModal"
        />
      </StyleProvider>
    )
    const confirmModal = getByTestId('confirmModal').firstElementChild
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.warning.replace(/ /g, ''))
  })

  test('Success variant', () => {
    const { getByTestId } = render(
      <StyleProvider theme={theme}>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
            return
          }}
          isOpen={true}
          variant="success"
          data-testid="confirmModal"
        />
      </StyleProvider>
    )
    const confirmModal = getByTestId('confirmModal').firstElementChild
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.success.replace(/ /g, ''))
  })
  test('Danger variant', () => {
    const { getByTestId } = render(
      <StyleProvider theme={theme}>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
            return
          }}
          isOpen={true}
          variant="danger"
          data-testid="confirmModal"
        />
      </StyleProvider>
    )
    const confirmModal = getByTestId('confirmModal').firstElementChild
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.error.replace(/ /g, ''))
  })
})

describe('Modal renders TextInput and Description', (): void => {
  test('Should render child elements', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
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
      </StyleProvider>
    )
    const input = getByTestId('input')
    const description = getByTestId('description')
    expect(input).toBeTruthy()
    expect(description).toBeTruthy()
  })
})
