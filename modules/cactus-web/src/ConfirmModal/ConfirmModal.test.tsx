import * as React from 'react'

import { cleanup, fireEvent, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import ConfirmModal from './ConfirmModal'
import Text from '../Text/Text'
import TextInput from '../TextInput/TextInput'

afterEach(cleanup)

describe('Modal variant is warning', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <ConfirmModal onConfirm={() => {}} onClose={() => {}} isOpen={true} variant="warning" />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
    expect(baseElement.querySelector('div[variant=warning')).toBeInTheDocument()
  })
})
describe('Modal variant is success', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <ConfirmModal onConfirm={() => {}} onClose={() => {}} isOpen={true} variant="success" />
      </StyleProvider>
    )

    expect(baseElement.querySelector('div[variant=success')).toBeInTheDocument()
  })
})
describe('Modal variant is danger', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <ConfirmModal onConfirm={() => {}} onClose={() => {}} isOpen={true} variant="danger" />
      </StyleProvider>
    )

    expect(baseElement.querySelector('div[variant=danger')).toBeInTheDocument()
  })
})

describe('Modal renders TextInput and Description', () => {
  test('snapshot', () => {
    const { baseElement, getByTestId } = render(
      <StyleProvider>
        <ConfirmModal onConfirm={() => {}} onClose={() => {}} isOpen={true} variant="danger">
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
