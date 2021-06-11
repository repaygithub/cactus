import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'

describe('component: Modal', () => {
  test('Modal is open when isOpen=true', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Modal
          variant="action"
          isOpen={true}
          modalLabel="Modal Label"
          closeLabel="Close Label"
          onClose={(): void => {
            return
          }}
        >
          I am a modal
        </Modal>
      </StyleProvider>
    )
    expect(getByText('I am a modal')).toBeVisible()
  })

  test('Modal is closed when isOpen=false', () => {
    const { queryByText } = render(
      <StyleProvider>
        <Modal
          isOpen={false}
          onClose={(): void => {
            return
          }}
        >
          I am a modal
        </Modal>
      </StyleProvider>
    )

    expect(queryByText('I am a modal')).not.toBeInTheDocument()
  })

  test('Aria-labels applied correctly', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          isOpen={true}
          modalLabel="Modal Label"
          closeLabel="Close Label"
          onClose={(): void => {
            return
          }}
        />
      </StyleProvider>
    )

    expect(baseElement.querySelector('div[aria-label="Modal Label"]')).toBeInTheDocument()
    expect(baseElement.querySelector('div[aria-modal="true"]')).toBeInTheDocument()
  })

  test('Can render content as children', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Modal
          variant="action"
          isOpen={true}
          modalLabel="Modal Label"
          closeLabel="Close Label"
          onClose={(): void => {
            return
          }}
        >
          <TextInput placeholder="placeHolder" data-testid="child" />
        </Modal>
      </StyleProvider>
    )
    const child = getByTestId('child')
    expect(child).toBeInTheDocument()
  })

  test('should support flex item props', () => {
    const { getByText } = render(
      <StyleProvider>
        <Modal isOpen={true} onClose={jest.fn()} flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
          Flex Modal
        </Modal>
      </StyleProvider>
    )

    const modal = getByText('Flex Modal').parentElement
    expect(modal).toHaveStyle('flex: 1')
    expect(modal).toHaveStyle('flex-grow: 1')
    expect(modal).toHaveStyle('flex-shrink: 0')
    expect(modal).toHaveStyle('flex-basis: 0')
  })
})
