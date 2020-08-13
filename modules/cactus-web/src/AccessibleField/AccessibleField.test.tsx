import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import AccessibleField from './AccessibleField'

describe('component: AccessibleField', (): void => {
  test('provides an accessible label', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field">
          <input data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    const input = getByLabelText('Accessible Label')
    expect(input).toHaveAttribute('data-is', 'accessible')
    expect(input).toHaveAttribute('name', 'text_field')
  })

  test('provides accessible status message', (): void => {
    const { getByLabelText, getByText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field" error="This field has an error">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toContain(
      getByText('This field has an error').closest('[id]')?.id
    )
  })

  test('provides an accessible tooltip', (): void => {
    const { getByLabelText, getByText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field" tooltip="woot tooltips!">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toContain(
      getByText('woot tooltips!').closest('[id]')?.id
    )
  })

  test('alternate prop types', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <AccessibleField id="aftest" label={<em>Accessible Label</em>} name="text_field">
          {(field) => <input name={field.name} id={field.fieldId} />}
        </AccessibleField>
      </StyleProvider>
    )

    const labelText = getByText('Accessible Label')
    expect(labelText.tagName).toBe('EM')
    const label = labelText.parentElement
    expect(label?.tagName).toBe('LABEL')
    const input = container.querySelector(`#${label?.getAttribute('for')}`)
    expect(input).toHaveAttribute('name', 'text_field')
    expect(container).toMatchSnapshot()
  })
})
