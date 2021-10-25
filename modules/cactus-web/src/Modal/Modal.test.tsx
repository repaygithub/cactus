import { render } from '@testing-library/react'
import { noop } from 'lodash'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'

describe('component: Modal', () => {
  test('Modal is open when isOpen=true', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Modal isOpen onClose={noop}>
          I am a modal
        </Modal>
      </StyleProvider>
    )
    expect(getByText('I am a modal')).toBeVisible()
  })

  test('Modal is closed when isOpen=false', () => {
    const { queryByText } = render(
      <StyleProvider>
        <Modal isOpen={false} onClose={noop}>
          I am a modal
        </Modal>
      </StyleProvider>
    )

    expect(queryByText('I am a modal')).not.toBeInTheDocument()
  })

  test('Aria-labels applied correctly', () => {
    const ref: React.RefObject<HTMLDivElement> = { current: null } as any
    const { getByLabelText } = render(
      <StyleProvider>
        <Modal
          isOpen
          ref={ref}
          onClose={noop}
          modalLabel="Custom Label"
          closeButtonProps={{ label: 'The Closer' }}
        />
      </StyleProvider>
    )

    expect(getByLabelText('Custom Label')).toBe(ref.current)
    expect(ref.current).toHaveAttribute('aria-modal', 'true')
    expect(getByLabelText('The Closer')).toHaveClass('modal-close-btn')
  })

  test('Can render content as children', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Modal isOpen onClose={noop}>
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
        <Modal isOpen onClose={noop} flex={1} flexGrow={1} flexShrink={0} flexBasis={0}>
          Flex Modal
        </Modal>
      </StyleProvider>
    )

    const modal = getByText('Flex Modal')
    expect(modal).toHaveStyle('flex: 1')
    expect(modal).toHaveStyle('flex-grow: 1')
    expect(modal).toHaveStyle('flex-shrink: 0')
    expect(modal).toHaveStyle('flex-basis: 0')
  })

  test('should support flex shortcut prop (boolean)', () => {
    const { getByText } = render(
      <StyleProvider>
        <Modal isOpen onClose={noop} flexFlow>
          Flex Modal
        </Modal>
      </StyleProvider>
    )

    const modal = getByText('Flex Modal')
    expect(modal).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    })
  })

  test('should support flex shortcut prop (flex-flow)', () => {
    const { getByText } = render(
      <StyleProvider>
        <Modal isOpen onClose={noop} flexFlow="row wrap">
          Flex Modal
        </Modal>
      </StyleProvider>
    )

    const modal = getByText('Flex Modal')
    expect(modal).toHaveStyle({
      display: 'flex',
      flexFlow: 'row wrap',
    })
  })
})
