import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import AccessibleField from './AccessibleField'

describe('component: AccessibleField', () => {
  test('provides an accessible label', () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <AccessibleField data-testid="wrapper" label="Accessible Label" name="text_field">
        <input data-is="accessible" />
      </AccessibleField>
    )

    const wrapper = getByTestId('wrapper')
    expect(wrapper).not.toHaveAttribute('name')
    const input = getByLabelText('Accessible Label')
    expect(input).toHaveAttribute('data-is', 'accessible')
    expect(input).toHaveAttribute('name', 'text_field')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  test('provides accessible status message', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <AccessibleField label="Accessible Label" name="text_field" error="This field has an error">
        <input name="text_field" data-is="accessible" />
      </AccessibleField>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toBe(
      getByText('This field has an error').closest('[id]')?.id
    )
  })

  test('provides an accessible tooltip', () => {
    const { getByLabelText, getByText } = renderWithTheme(
      <AccessibleField label="Accessible Label" name="text_field" tooltip="woot tooltips!">
        <input name="text_field" data-is="accessible" />
      </AccessibleField>
    )

    expect(getByLabelText('Accessible Label').getAttribute('aria-describedby')).toBe(
      getByText('woot tooltips!').closest('[id]')?.id
    )
  })

  test('supports style props', () => {
    const { getByTestId } = renderWithTheme(
      <AccessibleField
        label="Accessible Label"
        name="text_field"
        data-testid="flex-field"
        margin={4}
        maxWidth="90%"
        flexGrow={1}
        flexShrink={0}
        flexBasis={0}
      >
        <input name="text_field" data-is="accessible" />
      </AccessibleField>
    )

    expect(getByTestId('flex-field')).toHaveStyle({
      flexGrow: '1',
      flexShrink: '0',
      flexBasis: '0px',
      margin: '16px',
      maxWidth: '90%',
    })
  })

  test('alternate prop types', () => {
    const { container, getByText } = renderWithTheme(
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
