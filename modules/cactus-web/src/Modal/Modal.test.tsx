import * as React from 'react'

import { cleanup, render } from '@testing-library/react'
import { DescriptiveEnvelope } from '@repay/cactus-icons/'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import Modal from './Modal'
import TextInput from '../TextInput/TextInput'

const Icon = DescriptiveEnvelope as React.FunctionComponent
afterEach(cleanup)

describe('Modal is open when isOpen=true', () => {
  test('snapshot', () => {
    const { baseElement } = render(
      <StyleProvider>
        <Modal
          icon={Icon}
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
        <Modal icon={Icon} isOpen={false} />
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
        <Modal icon={Icon} isOpen={true} modalLabel="Modal Label" closeLabel="Close Label" />
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
          icon={Icon}
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
