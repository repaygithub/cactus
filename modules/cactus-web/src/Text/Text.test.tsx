import * as React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { Span, Text } from './Text'
import { StyleProvider } from '../StyleProvider/StyleProvider'

afterEach(cleanup)

describe('component: Text', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Text>
          Red leicester mascarpone cauliflower cheese. Cauliflower cheese bavarian bergkase
          mozzarella parmesan stinking bishop hard cheese.
        </Text>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('can set text based properties', () => {
    const { container } = render(
      <StyleProvider>
        <Text colors="base" fontWeight={600} fontStyle="italic" textAlign="right" textStyle="small">
          Stilton lancashire macaroni cheese.
        </Text>
      </StyleProvider>
    )

    expect(container.firstChild).not.toBeNull()
  })
})

describe('component: Span', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <Span>when the cheese comes out everybody's happy</Span>
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('can set text based properties', () => {
    const { container } = render(
      <StyleProvider>
        <Span colors="base" fontWeight={600} fontStyle="italic" textAlign="right" textStyle="h2">
          Stilton lancashire macaroni cheese.
        </Span>
      </StyleProvider>
    )

    expect(container.firstChild).not.toBeNull()
  })
})
