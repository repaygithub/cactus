import { fireEvent, render } from '@testing-library/react'
import pick from 'lodash/pick'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
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

describe('component: SelectField', (): void => {
  test('minimal snapshot', (): void => {
    const { container } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={['basic', 'options']}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('render with complex options', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={[
            { label: 'Complex', value: 'complex' },
            { label: 'Options', value: 'options' },
          ]}
        />
      </StyleProvider>
    )

    expect(getByLabelText('Requires a label')).not.toBeNull()
  })

  test('should render a disabled SelectField', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
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
      </StyleProvider>
    )

    expect(getByLabelText('Requires a label')).toBeDisabled()
  })

  test('should render an attached label', (): void => {
    const { getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={['basic', 'options']}
          tooltip="This is some information"
        />
      </StyleProvider>
    )

    expect(getByLabelText('Requires a label')).not.toBeNull()
  })

  test('should render an attached tooltip', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={['basic', 'options']}
          tooltip="This is some information"
        />
      </StyleProvider>
    )

    const tooltipTextEl = getByText('This is some information')
    const tooltipEl = closest(tooltipTextEl, (el): boolean => el.getAttribute('role') === 'tooltip')
    expect(tooltipEl).not.toBeNull()

    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain((tooltipEl as HTMLElement).id)
  })

  test('should render a provided placeholder', (): void => {
    const { getByText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          options={['basic', 'options']}
          placeholder="This is that placeholder"
        />
      </StyleProvider>
    )

    expect(getByText('This is that placeholder')).not.toBeNull()
  })

  test('should render an accessible success message', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          success="You're GREAT!"
        />
      </StyleProvider>
    )

    const statusEl = getByText(`You're GREAT!`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible warning message', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          warning="You got a ridiculous warning"
        />
      </StyleProvider>
    )

    const statusEl = getByText(`You got a ridiculous warning`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible error message', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          error="You've done this incorrectly"
        />
      </StyleProvider>
    )

    const statusEl = getByText(`You've done this incorrectly`) as HTMLElement
    const select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('supports margin props', (): void => {
    const { container } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="for-the-snap"
          options={['basic', 'options']}
          margin="8px"
        />
      </StyleProvider>
    )

    expect(container).not.toBeNull()
  })

  describe('should accept form event', (): void => {
    test('onChange', (): void => {
      const box: any = {}
      const onChange = jest.fn((e) => Object.assign(box, pick(e.target, ['name', 'value'])))
      const { getByLabelText, getByText } = render(
        <StyleProvider>
          <SelectField
            label="Requires a label"
            name="the-test-select-field"
            id="for-the-snap"
            options={['basic', 'options']}
            onChange={onChange}
          />
        </StyleProvider>
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
      const { getByLabelText } = render(
        <StyleProvider>
          <SelectField
            label="Requires a label"
            name="the-test-select-field"
            id="for-the-snap"
            options={['basic', 'options']}
            onBlur={onBlur}
          />
        </StyleProvider>
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
      const { getByLabelText } = render(
        <StyleProvider>
          <SelectField
            label="Requires a label"
            name="the-test-select-field"
            id="for-the-snap"
            options={['basic', 'options']}
            onFocus={onFocus}
          />
        </StyleProvider>
      )
      const select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.focus(select)
      expect(onFocus).toHaveBeenCalledTimes(1)
      expect(box).toEqual({ name: 'the-test-select-field' })
    })
  })
})
