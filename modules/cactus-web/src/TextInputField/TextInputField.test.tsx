import * as React from 'react'

import { cleanup, render } from 'react-testing-library'
import { StyleProvider } from '../StyleProvider/StyleProvider'
import cactusTheme from '@repay/cactus-theme'
import TextInputField from './TextInputField'
import userEvent from 'user-event'

afterEach(cleanup)

describe('component: TextInputField', () => {
  test('should render a TextInputField', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="instigate"
          name="instigate"
          label="Enter some text"
          tooltip="Go on, do it"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a disabled TextInputField', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="trick"
          name="trick"
          label="Come on, type something"
          tooltip="Sike!"
          disabled
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a TextInputField with a placeholder', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="promise"
          name="promise"
          label="Ok ok, now do it"
          placeholder="I won't disable it again, promise"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a success TextInputField', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="success"
          name="success"
          label="No seriously, type something"
          success="Great! you typed something!"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render a warning TextInputField', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="warn"
          name="warn"
          label="Do it again"
          warning="Really? That's all you got?"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should render an error TextInputField', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="error"
          name="error"
          label="Try again"
          error="That's it, we're done here"
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should support margin space props', () => {
    const { container } = render(
      <StyleProvider>
        <TextInputField
          id="margins"
          name="margins"
          label="Check out all these sick margins"
          m={3}
        />
      </StyleProvider>
    )

    expect(container).toMatchSnapshot()
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInputField
          name="change"
          label="Better type something this time"
          placeholder="Type here!"
          onChange={onChange}
        />
      </StyleProvider>
    )

    userEvent.type(getByPlaceholderText('Type here!'), "Alright fine I'm typing, jeez")
    expect(onChange).toHaveBeenCalled()
  })
})
