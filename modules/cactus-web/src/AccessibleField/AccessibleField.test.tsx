import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import AccessibleField from './AccessibleField'

describe('component: AccessibleField', () => {
  test('provides an accessible label', () => {
    const { getByLabelText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label')).toHaveAttribute('data-is', 'accessible')
  })

  test('provides accessible status message', () => {
    const { getByLabelText, getByText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field" error="This field has an error">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toContain(
      //@ts-ignore
      getByText('This field has an error').closest('[id]').id
    )
  })

  test('provides an accessible tooltip', () => {
    const { getByLabelText, getByText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field" tooltip="woot tooltips!">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toContain(
      //@ts-ignore
      getByText('woot tooltips!').closest('[id]').id
    )
  })
})
