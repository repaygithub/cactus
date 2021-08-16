import { render } from '@testing-library/react'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import DateInputField from './DateInputField'

describe('component: DateInputField', (): void => {
  test('accessible label points to div[role=group] and month input', (): void => {
    const { getAllByLabelText } = render(
      <StyleProvider>
        <DateInputField name="date_field" label="Date Field" />
      </StyleProvider>
    )
    const [group, input] = getAllByLabelText('Date Field')
    expect(group).toHaveAttribute('role', 'group')
    expect(input).toHaveAttribute('aria-label', 'month')
  })

  test('provides accessible tooltip', (): void => {
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

  test('provides accessible error message', (): void => {
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

  test('should support margin space props', (): void => {
    const { getByTestId } = render(
      <StyleProvider>
        <DateInputField label="F" name="1st" data-testid="first" />
        <DateInputField name="def" label="D" data-testid="default" mb={2} />
        <DateInputField name="over" label="O" data-testid="override" mt={1} />
      </StyleProvider>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    expect(getByTestId('first').parentElement?.parentElement?.parentElement).toHaveStyle(blank)
    expect(getByTestId('default').parentElement?.parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '16px',
      marginBottom: '4px',
    })
    expect(getByTestId('override').parentElement?.parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '2px',
    })
  })

  test('supports flex item props', () => {
    const { container } = render(
      <StyleProvider>
        <DateInputField
          name="date_field"
          label="Date Field"
          flex={1}
          flexGrow={1}
          flexShrink={0}
          flexBasis={0}
        />
      </StyleProvider>
    )

    expect(container.firstElementChild).toHaveStyle('flex: 1')
    expect(container.firstElementChild).toHaveStyle('flex-grow: 1')
    expect(container.firstElementChild).toHaveStyle('flex-shrink: 0')
    expect(container.firstElementChild).toHaveStyle('flex-basis: 0')
  })
})
