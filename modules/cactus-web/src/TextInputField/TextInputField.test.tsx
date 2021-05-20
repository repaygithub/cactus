import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'

import { StyleProvider } from '../StyleProvider/StyleProvider'
import TextInputField from './TextInputField'

describe('component: TextInputField', (): void => {
  test('should render a disabled TextInputField', (): void => {
    const { getByLabelText } = render(
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

    expect(getByLabelText('Come on, type something')).toBeDisabled()
  })

  test('should render a TextInputField with a placeholder', (): void => {
    const { getByPlaceholderText } = render(
      <StyleProvider>
        <TextInputField
          id="promise"
          name="promise"
          label="Ok ok, now do it"
          placeholder="I won't disable it again, promise"
        />
      </StyleProvider>
    )

    expect(getByPlaceholderText(`I won't disable it again, promise`)).toBeInTheDocument()
  })

  test('should render a success TextInputField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextInputField
          id="success"
          name="success"
          label="No seriously, type something"
          success="Great! you typed something!"
        />
      </StyleProvider>
    )

    expect(
      getByLabelText('No seriously, type something').getAttribute('aria-describedby')
    ).toContain(getByText('Great! you typed something!').id)
  })

  test('should render a warning TextInputField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextInputField
          id="warn"
          name="warn"
          label="Do it again"
          warning="Really? That's all you got?"
        />
      </StyleProvider>
    )

    expect(getByLabelText('Do it again').getAttribute('aria-describedby')).toContain(
      getByText(`Really? That's all you got?`).id
    )
  })

  test('should render an error TextInputField', (): void => {
    const { getByText, getByLabelText } = render(
      <StyleProvider>
        <TextInputField
          id="error"
          name="error"
          label="Try again"
          error="That's it, we're done here"
        />
      </StyleProvider>
    )

    expect(getByLabelText('Try again').getAttribute('aria-describedby')).toContain(
      getByText(`That's it, we're done here`).id
    )
  })

  test('should support margin space props', (): void => {
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

    expect(container.firstElementChild).toHaveStyle('margin: 8px')
  })

  test('should trigger onChange handler', (): void => {
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
