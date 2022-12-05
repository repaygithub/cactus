import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import TextInputField from './TextInputField'

describe('component: TextInputField', () => {
  test('Should render a disabled TextInputField', () => {
    const { getByLabelText } = renderWithTheme(
      <TextInputField
        id="trick"
        name="trick"
        label="Come on, type something"
        tooltip="Sike!"
        disabled
      />
    )

    expect(getByLabelText('Come on, type something')).toBeDisabled()
  })

  test('Should render a TextInputField with a placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextInputField
        id="promise"
        name="promise"
        label="Ok ok, now do it"
        placeholder="I won't disable it again, promise"
      />
    )

    expect(getByPlaceholderText(`I won't disable it again, promise`)).toBeInTheDocument()
  })

  test('Should render a success TextInputField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInputField
        id="success"
        name="success"
        label="No seriously, type something"
        success="Great! you typed something!"
      />
    )

    expect(
      getByLabelText('No seriously, type something').getAttribute('aria-describedby')
    ).toContain(getByText('Great! you typed something!').id)
  })

  test('Should render a warning TextInputField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInputField
        id="warn"
        name="warn"
        label="Do it again"
        warning="Really? That's all you got?"
      />
    )

    expect(getByLabelText('Do it again').getAttribute('aria-describedby')).toContain(
      getByText(`Really? That's all you got?`).id
    )
  })

  test('Should render an error TextInputField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextInputField
        id="error"
        name="error"
        label="Try again"
        error="That's it, we're done here"
      />
    )

    expect(getByLabelText('Try again').getAttribute('aria-describedby')).toContain(
      getByText(`That's it, we're done here`).id
    )
  })

  test('Should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <TextInputField label="F" name="1st" data-testid="first" />
        <TextInputField name="def" label="D" data-testid="default" mb={2} />
        <TextInputField name="over" label="O" data-testid="override" mt={1} />
      </>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    expect(getByTestId('first').parentElement).toHaveStyle(blank)
    expect(getByTestId('default').parentElement).toHaveStyle({
      ...blank,
      marginTop: '16px',
      marginBottom: '4px',
    })
    expect(getByTestId('override').parentElement).toHaveStyle({
      ...blank,
      marginTop: '2px',
    })
  })

  test('Should support flex item props', () => {
    const { container } = renderWithTheme(
      <TextInputField
        id="margins"
        name="margins"
        label="Check out all these sick margins"
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

  test('Should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <TextInputField defaultValue="with-ref" name="reflected" label="Referred" ref={ref} />
    )
    expect(getByLabelText('Referred')).toBe(ref.current)
    expect(ref.current).toHaveValue('with-ref')
  })

  test('Should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <TextInputField
        name="change"
        label="Better type something this time"
        placeholder="Type here!"
        onChange={onChange}
      />
    )

    userEvent.type(getByPlaceholderText('Type here!'), "Alright fine I'm typing, jeez")
    expect(onChange).toHaveBeenCalled()
  })
})
