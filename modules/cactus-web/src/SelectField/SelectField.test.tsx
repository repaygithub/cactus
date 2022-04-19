import { fireEvent } from '@testing-library/react'
import pick from 'lodash/pick'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import SelectField from './SelectField'

function closest(el: HTMLElement, matcher: (el: HTMLElement) => boolean): HTMLElement | null {
  while (el && el !== document.body) {
    if (el && matcher(el)) {
      return el
    }
    el = el.parentNode as HTMLElement
  }
  return null
}

describe('component: SelectField', () => {
  test('render with complex options', () => {
    const { getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="prevent-random-id"
        options={[
          { label: 'Complex', value: 'complex' },
          { label: 'Options', value: 'options' },
        ]}
      />
    )

    expect(getByLabelText('Requires a label')).not.toBeNull()
  })

  test('should render a disabled SelectField', () => {
    const { getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="prevent-random-id"
        options={[
          { label: 'Complex', value: 'complex' },
          { label: 'Options', value: 'options' },
        ]}
        disabled
      />
    )

    expect(getByLabelText('Requires a label')).toBeDisabled()
  })

  test('should render an attached label', () => {
    const { getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="prevent-random-id"
        options={['basic', 'options']}
        tooltip="This is some information"
      />
    )

    expect(getByLabelText('Requires a label')).not.toBeNull()
  })

  test('should render an attached tooltip', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="prevent-random-id"
        options={['basic', 'options']}
        tooltip="This is some information"
      />
    )

    const tooltipTextEl = getByText('This is some information')
    const tooltipEl = closest(tooltipTextEl, (el): boolean => el.getAttribute('role') === 'tooltip')
    expect(tooltipEl).not.toBeNull()

    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain((tooltipEl as HTMLElement).id)
  })

  test('should render a provided placeholder', () => {
    const { getByText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        options={['basic', 'options']}
        placeholder="This is that placeholder"
      />
    )

    expect(getByText('This is that placeholder')).not.toBeNull()
  })

  test('should render an accessible success message', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="for-the-snap"
        options={['basic', 'options']}
        success="You're GREAT!"
      />
    )

    const statusEl = getByText(`You're GREAT!`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible warning message', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="for-the-snap"
        options={['basic', 'options']}
        warning="You got a ridiculous warning"
      />
    )

    const statusEl = getByText(`You got a ridiculous warning`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible error message', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="for-the-snap"
        options={['basic', 'options']}
        error="You've done this incorrectly"
      />
    )

    const statusEl = getByText(`You've done this incorrectly`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('supports margin props', () => {
    const { container } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="for-the-snap"
        options={['basic', 'options']}
        margin="8px"
      />
    )

    expect(container.firstElementChild).toHaveStyle('margin-left: 8px')
    expect(container.firstElementChild).toHaveStyle('margin-right: 8px')
    expect(container.firstElementChild).toHaveStyle('margin-top: 8px')
    expect(container.firstElementChild).toHaveStyle('margin-bottom: 8px')
  })

  test('should support flex item props', () => {
    const { container } = renderWithTheme(
      <SelectField
        label="Requires a label"
        name="the-test-select-field"
        id="for-the-snap"
        options={['basic', 'options']}
        flex={1}
        flexGrow={1}
        flexShrink={0}
        flexBasis={0}
      />
    )

    expect(container.firstElementChild).toHaveStyle('flex: 1')
    expect(container.firstElementChild).toHaveStyle('flex-grow: 1')
    expect(container.firstElementChild).toHaveStyle('flex-shrink: 0')
    expect(container.firstElementChild).toHaveStyle('flex-basis: 0')
  })

  describe('should accept form event', () => {
    test('onChange', () => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByLabelText, getByText } = renderWithTheme(
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          onChange={onChange}
        />
      )
      const select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.click(select)
      fireEvent.click(getByText('basic'))
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'the-test-select-field', value: 'basic' })
    })

    test('onBlur', async (): Promise<void> => {
      const box: any = {}
      const onBlur = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByLabelText } = renderWithTheme(
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          onBlur={onBlur}
        />
      )
      const select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.blur(select)
      expect(onBlur).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'the-test-select-field', value: null })
    })

    test('onFocus', async (): Promise<void> => {
      const box: any = {}
      const onFocus = jest.fn((e) => {
        box.name = e.target.name
      })
      const { getByLabelText } = renderWithTheme(
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          onFocus={onFocus}
        />
      )
      const select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.focus(select)
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'the-test-select-field' })
    })
  })
})
