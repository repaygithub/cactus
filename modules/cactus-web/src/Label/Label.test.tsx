import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import Label from './Label'

describe('component: Label', (): void => {
  test('should support margin space props', (): void => {
    const { getByText } = renderWithTheme(<Label ml={2}>Test Label</Label>)
    const label = getByText('Test Label')
    const styles = window.getComputedStyle(label)

    expect(styles.marginLeft).toBe('4px')
  })
})
