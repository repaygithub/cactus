import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'

describe('Modal is open when isOpen=true', (): void => {
  test('snapshot', (): void => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          variant="action"
          isOpen={true}
          modalLabel="Modal Label"
          closeLabel="Close Label"
          onClose={(): void => {
            return
          }}
        />
      </StyleProvider>
    )
    expect(baseElement).toMatchSnapshot()
    expect(baseElement).toContainHTML('<reach-portal>')
  })
})

describe('Modal is closed when isOpen=false', (): void => {
  test('snapshot', (): void => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          isOpen={false}
          onClose={(): void => {
            return
          }}
        />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
    expect(baseElement).not.toContainHTML('<reach-portal>')
  })
})

describe('Aria-labels applied correctly', (): void => {
  test('snapshot', (): void => {
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
})

describe('Can render content as children', (): void => {
  test('snapshot', (): void => {
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
})
