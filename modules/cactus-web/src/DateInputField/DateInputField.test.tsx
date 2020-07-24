import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import DateInputField from './DateInputField'

afterEach(cleanup)

describe('component: DateInputField', () => {
  test('snapshot', () => {
    const { container } = render(
      <StyleProvider>
        <DateInputField name="date_field" label="Date Field" id="not-random" />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('accessible label points to div[role=group] and month input', () => {
    const { getAllByLabelText } = render(
      <StyleProvider>
        <DateInputField name="date_field" label="Date Field" />
      </StyleProvider>
    )
    const [input, group] = getAllByLabelText('Date Field')
    expect(group).toHaveAttribute('role', 'group')
    expect(input).toHaveAttribute('aria-label', 'month')
  })

  test('provides accessible tooltip', () => {
    const { getByRole } = render(
      <StyleProvider>
        <DateInputField
          name="date_field"
          label="Date Field"
          tooltip="the date field group tooltip"
        />
      </StyleProvider>
    )
    const field = getByRole('group')
    const tooltip = getByRole('tooltip')
    expect(field.getAttribute('aria-describedby')).toContain(tooltip.id)
  })

  test('provides accessible error message', () => {
    const { getByRole } = render(
      <StyleProvider>
        <DateInputField name="date_field" label="Date Field" error="an error message" />
      </StyleProvider>
    )
    const field = getByRole('group')
    const alert = getByRole('alert')
    expect(field.getAttribute('aria-describedby')).toContain(alert.id)
    expect(alert).toHaveTextContent('an error message')
  })
})
