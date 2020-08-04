import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextAreaField from './TextAreaField'

describe('component: TextAreaField', (): void => {
  test('should render a TextAreaField', (): void => {
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

  test('should render a disabled TextAreaField', (): void => {
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

  test('should render a TextAreaField with a placeholder', (): void => {
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

  test('should render a success TextAreaField', (): void => {
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

  test('should render a warning TextAreaField', (): void => {
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

  test('should render an error TextAreaField', (): void => {
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

  test('should support margin space props', (): void => {
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

  test('should trigger onChange handler', (): void => {
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
