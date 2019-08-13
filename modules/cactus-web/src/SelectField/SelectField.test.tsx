import * as React from 'react'
import { cleanup, fireEvent, render } from 'react-testing-library'
import { StyleProvider } from '@repay/cactus-web'
import SelectField from './SelectField'

afterEach(cleanup)

function closest(el: HTMLElement, matcher: (el: HTMLElement) => boolean) {
  while (el && el !== document.body) {
    if (el && matcher(el)) {
      return el
    }
    el = el.parentNode as HTMLElement
  }
  return null
}

describe('component: SelectField', () => {
  test('minimal snapshot', () => {
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

  test('render with complex options', () => {
    const { container } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={[{ label: 'Complex', value: 'complex' }, { label: 'Options', value: 'options' }]}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled SelectField', () => {
    const { container } = render(
      <StyleProvider>
        <SelectField
          label="Requires a label"
          name="the-test-select-field"
          id="prevent-random-id"
          options={[{ label: 'Complex', value: 'complex' }, { label: 'Options', value: 'options' }]}
          disabled
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render an attached label', () => {
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

  test('should render an attached tooltip', () => {
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

    let tooltipTextEl = getByText('This is some information')
    let tooltipEl = closest(tooltipTextEl, el => el.getAttribute('role') === 'tooltip')
    expect(tooltipEl).not.toBeNull()

    let select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain((tooltipEl as HTMLElement).id)
  })

  test('should render a provided placeholder', () => {
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

  test('should render an accessible success message', () => {
    const { container, getByText, getByLabelText } = render(
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

    expect(container).toMatchSnapshot()
    let statusEl = getByText(`You're GREAT!`) as HTMLElement
    let select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible warning message', () => {
    const { container, getByText, getByLabelText } = render(
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

    expect(container).toMatchSnapshot()
    let statusEl = getByText(`You got a ridiculous warning`) as HTMLElement
    let select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('should render an accessible error message', () => {
    const { container, getByText, getByLabelText } = render(
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

    expect(container).toMatchSnapshot()
    let statusEl = getByText(`You've done this incorrectly`) as HTMLElement
    let select = getByLabelText('Requires a label')
    expect(select.getAttribute('aria-describedby')).toContain(statusEl.id)
  })

  test('supports margin props', () => {
    const { container, getByText, getByLabelText } = render(
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

    expect(container).toMatchSnapshot()
  })

  describe('should accept form event', () => {
    test('onChange', () => {
      const onChange = jest.fn()
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
      let select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.click(select)
      fireEvent.click(getByText('basic'))
      expect(onChange).toHaveBeenCalledWith('the-test-select-field', 'basic')
    })

    test('onBlur', async () => {
      const onBlur = jest.fn()
      const { getByLabelText, rerender, getByText } = render(
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
      let select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.blur(select)
      expect(onBlur).toHaveBeenCalledWith('the-test-select-field', null)
    })

    test('onFocus', async () => {
      const onFocus = jest.fn()
      const { getByLabelText, getByText } = render(
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
      let select = getByLabelText('Requires a label') as HTMLElement
      fireEvent.focus(select)
      expect(onFocus).toHaveBeenCalledWith('the-test-select-field', null)
    })
  })
})
