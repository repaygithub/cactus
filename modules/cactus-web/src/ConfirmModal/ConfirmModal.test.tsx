import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'
import ConfirmModal from './ConfirmModal'

describe('Modal variant is warning', (): void => {
  test('snapshot', (): void => {
    const { baseElement } = render(
      <StyleProvider>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
            return
          }}
          isOpen={true}
          variant="warning"
        />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
  })
})
describe('Modal variant is success', (): void => {
  test('snapshot', (): void => {
    const { baseElement } = render(
      <StyleProvider>
        <ConfirmModal
          onConfirm={(): void => {
            return
          }}
          onClose={(): void => {
            return
          }}
          isOpen={true}
          variant="success"
        />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
  })
})
describe('Modal variant is danger', (): void => {
  test('snapshot', (): void => {
    const { baseElement } = render(
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
        />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
  })
})

describe('Modal renders TextInput and Description', (): void => {
  test('snapshot', (): void => {
    const { baseElement, getByTestId } = render(
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
    expect(baseElement).toMatchSnapshot()
    expect(input).toBeTruthy()
    expect(description).toBeTruthy()
  })
})
