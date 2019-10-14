import * as React from 'react'
import { cleanup, render } from '@testing-library/react'
import { StyleProvider } from '@repay/cactus-web'
import TextAreaField from './TextAreaField'
import userEvent from 'user-event'

afterEach(cleanup)

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
    const { container } = render(
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

    expect(container).toMatchSnapshot()
  })

  test('should render a TextAreaField with a placeholder', () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot()
  })

  test('should render a success TextAreaField', () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot()
  })

  test('should render a warning TextAreaField', () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot()
  })

  test('should render an error TextAreaField', () => {
    const { container } = render(
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

    expect(container).toMatchSnapshot()
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

    expect(container).toMatchSnapshot()
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
