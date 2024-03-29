import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { Text } from './Text'

describe('component: Text', () => {
  test('exists', () => {
    const textLabel =
      'Red leicester mascarpone cauliflower cheese. Cauliflower cheese bavarian bergkase mozzarella parmesan stinking bishop hard cheese.'
    const { getByText } = renderWithTheme(<Text>{textLabel}</Text>)
    expect(getByText(textLabel)).toBeInTheDocument()
  })

  test('can set text based properties', () => {
    const { container } = renderWithTheme(
      <Text colors="base" fontWeight={600} fontStyle="italic" textAlign="right" textStyle="small">
        Stilton lancashire macaroni cheese.
      </Text>
    )

    expect(container.firstChild).not.toBeNull()
  })
})
