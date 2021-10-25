import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import { Text } from './Text'

describe('component: Text', (): void => {
  test('exists', (): void => {
    const textLabel =
      'Red leicester mascarpone cauliflower cheese. Cauliflower cheese bavarian bergkase mozzarella parmesan stinking bishop hard cheese.'
    const { getByText } = render(
      <StyleProvider>
        <Text>{textLabel}</Text>
      </StyleProvider>
    )
    expect(getByText(textLabel)).toBeInTheDocument()
  })

  test('can set text based properties', (): void => {
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
