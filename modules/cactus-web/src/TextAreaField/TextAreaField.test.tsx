import * as React from 'react'
import { render } from '@testing-library/react'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextAreaField from './TextAreaField'
import userEvent from '@testing-library/user-event'

describe('component: TextAreaField', () => {
  test('should render a TextAreaField', () => {
    const { container } = render(
      <StyleProvider>
        <TextAreaField
          id="boolest"
          name="boolest"
          label="boolest"
          tooltip="the boolest dude in the office"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled TextAreaField', () => {
    const { getByLabelText } = render(
      <StyleProvider>
        <TextAreaField
          id="boolest"
          name="boolest"
          label="boolest"
          tooltip="the boolest dude in the office"
          disabled={true}
        />
      </StyleProvider>
    )

    expect(getByLabelText('boolest')).toBeDisabled()
  })

  test('should render a TextAreaField with a placeholder', () => {
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextAreaField
          id="boolest"
          name="boolest"
          label="boolest"
          tooltip="the boolest dude in the office"
          placeholder="no question about it"
        />
      </StyleProvider>
    )

    expect(getByPlaceholderText('no question about it')).toBeInTheDocument()
  })

  test('should render a success TextAreaField', () => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextAreaField
          id="darts"
          name="darts"
          label="master of darts"
          tooltip="the dart master"
          success="undoubtedly"
        />
      </StyleProvider>
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should render a warning TextAreaField', () => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextAreaField
          id="darts"
          name="darts"
          label="master of darts"
          tooltip="the dart master"
          warning="undoubtedly"
        />
      </StyleProvider>
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should render an error TextAreaField', () => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextAreaField
          id="darts"
          name="darts"
          label="master of darts"
          tooltip="the dart master"
          error="undoubtedly"
        />
      </StyleProvider>
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should support margin space props', () => {
    const { container } = render(
      <StyleProvider>
        <TextAreaField
          id="missing"
          name="missing"
          label="missing a comma"
          tooltip="you are missing a comma, sir"
          mx={3}
        />
      </StyleProvider>
    )

    expect(container.firstElementChild).toHaveStyle('margin-left: 8px')
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextAreaField
          id="throat"
          name="punch"
          label="throat punch"
          tooltip="throat punch cancer"
          placeholder="punch some throats"
          onChange={onChange}
        />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('punch some throats'), 'miss you buddy')
    expect(onChange).toHaveBeenCalled()
  })
})
