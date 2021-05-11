import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import Label from './Label'

describe('component: Label', (): void => {
  test('should support margin space props', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <Label ml={2}>Test Label</Label>
      </StyleProvider>
    )
    const label = getByText('Test Label')
    const styles = window.getComputedStyle(label)

    expect(styles.marginLeft).toBe('4px')
  })
})
