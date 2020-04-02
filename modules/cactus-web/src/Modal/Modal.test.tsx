import * as React from 'react'

import { cleanup, render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import { DescriptiveEnvelope } from '@repay/cactus-icons/'
import Modal from './Modal'
import TextInput from '../TextInput/TextInput'

afterEach(cleanup)

describe('Modal is open when isOpen=true', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          icon={DescriptiveEnvelope}
          modalTitle="Modal Title"
          description="Modal Description"
          variant="action"
          isOpen={true}
          buttonText="Confirm Button"
          modalLabel="Modal Label"
          closeLabel="Close Label"
        />
      </StyleProvider>
    )
    expect(baseElement).toMatchSnapshot()
    expect(baseElement).toContainHTML('<reach-portal>')
  })
})

describe('Modal is closed when isOpen=false', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal icon={DescriptiveEnvelope} isOpen={false} />
      </StyleProvider>
    )

    expect(baseElement).toMatchSnapshot()
    expect(baseElement).not.toContainHTML('<reach-portal>')
  })
})

describe('Aria-labels applied correctly', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          icon={DescriptiveEnvelope}
          isOpen={true}
          modalLabel="Modal Label"
          closeLabel="Close Label"
        />
      </StyleProvider>
    )

    expect(baseElement.querySelector('div[aria-label="Modal Label"]')).toBeInTheDocument()
    expect(baseElement.querySelector('div[aria-label="Modal Label-content"]')).toBeInTheDocument()
  })
})

describe('Can render content as children', () => {
  test('snapshot', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <Modal
          icon={DescriptiveEnvelope}
          modalTitle="Modal Title"
          description="Modal Description"
          variant="action"
          isOpen={true}
          buttonText="Confirm Button"
          modalLabel="Modal Label"
          closeLabel="Close Label"
        >
          <TextInput placeholder="placeHolder" data-testid="child" />
        </Modal>
      </StyleProvider>
    )
    const child = getByTestId('child')
    expect(child).toBeInTheDocument()
  })
})
