import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import AccessibleField from './AccessibleField'

describe('component: AccessibleField', (): void => {
  test('provides an accessible label', (): void => {
    const { getByLabelText, getByTestId } = render(
      <StyleProvider>
        <AccessibleField data-testid="wrapper" label="Accessible Label" name="text_field">
          <input data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    const wrapper = getByTestId('wrapper')
    expect(wrapper).not.toHaveAttribute('name')
    const input = getByLabelText('Accessible Label')
    expect(input).toHaveAttribute('data-is', 'accessible')
    expect(input).toHaveAttribute('name', 'text_field')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  test('provides accessible status message', (): void => {
    const { getByLabelText, getByText } = render(
      <StyleProvider>
        <AccessibleField label="Accessible Label" name="text_field" error="This field has an error">
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toBe(
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

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toBe(
      getByText('woot tooltips!').closest('[id]')?.id
    )
  })

  test('supports flex item props', () => {
    const { getByTestId } = render(
      <StyleProvider>
        <AccessibleField
          label="Accessible Label"
          name="text_field"
          data-testid="flex-field"
          flex={1}
          flexGrow={1}
          flexShrink={0}
          flexBasis={0}
        >
          <input name="text_field" data-is="accessible" />
        </AccessibleField>
      </StyleProvider>
    )

    const field = getByTestId('flex-field')
    expect(field).toHaveStyle('flex: 1')
    expect(field).toHaveStyle('flex-grow: 1')
    expect(field).toHaveStyle('flex-shrink: 0')
    expect(field).toHaveStyle('flex-basis: 0')
  })

  test('alternate prop types', (): void => {
    const { container, getByText } = render(
      <StyleProvider>
        <AccessibleField
          id="aftest"
          label={<em>Accessible Label</em>}
          name="text_field"
          tooltip={<strong>JSX Tooltip</strong>}
          error={<p>Error Paragraph</p>}
          warning={<a>Warning Anchor</a>}
          success={<b>Bold Success</b>}
        >
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

    const tooltipText = getByText('JSX Tooltip')
    expect(tooltipText.tagName).toBe('STRONG')
    expect(tooltipText.parentElement).toHaveAttribute('id', 'aftest-tip')
    expect(tooltipText.parentElement).toHaveAttribute('role', 'tooltip')

    const errorText = getByText('Error Paragraph')
    expect(errorText.tagName).toBe('P')
    const errorDiv = errorText.closest('div')
    expect(errorDiv).toHaveAttribute('id', 'aftest-status')
    expect(errorDiv).toHaveAttribute('role', 'alert')
    let otherStatus = null
    try {
      otherStatus = getByText('Warning Anchor')
    } catch {}
    expect(otherStatus).toBe(null)
    try {
      otherStatus = getByText('Bold Success')
    } catch {}
    expect(otherStatus).toBe(null)
  })
})
