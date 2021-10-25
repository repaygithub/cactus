import { generateTheme } from '@repay/cactus-theme'
import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'
import ConfirmModal from './ConfirmModal'

describe('component: ConfirmModal', () => {
  const theme = generateTheme()
  test('should render warning variant', () => {
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
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.warning.replace(/ /g, ''))
  })

  test('should render success variant', () => {
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
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.success.replace(/ /g, ''))
  })

  test('should render danger variant', () => {
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
    const confirmModal = getByTestId('confirmModal')
    const styles = window.getComputedStyle(confirmModal as Element)

    expect(styles.borderColor.trim()).toBe(theme.colors.error.replace(/ /g, ''))
  })

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

  test('should support flex item props', () => {
    const { getByText } = render(
      <StyleProvider>
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
      </StyleProvider>
    )

    const confirmModal = getByText('Flex Confirm Modal').parentElement
    expect(confirmModal).toHaveStyle('flex: 1')
    expect(confirmModal).toHaveStyle('flex-grow: 1')
    expect(confirmModal).toHaveStyle('flex-shrink: 0')
    expect(confirmModal).toHaveStyle('flex-basis: 0')
  })
})
