import userEvent from '@testing-library/user-event'
import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import TextAreaField from './TextAreaField'

describe('component: TextAreaField', () => {
  test('should render a disabled TextAreaField', () => {
    const { getByLabelText } = renderWithTheme(
      <TextAreaField
        id="boolest"
        name="boolest"
        label="boolest"
        tooltip="the boolest dude in the office"
        disabled={true}
      />
    )

    expect(getByLabelText('boolest')).toBeDisabled()
  })

  test('should render a TextAreaField with a placeholder', () => {
    const { getByPlaceholderText } = renderWithTheme(
      <TextAreaField
        id="boolest"
        name="boolest"
        label="boolest"
        tooltip="the boolest dude in the office"
        placeholder="no question about it"
      />
    )

    expect(getByPlaceholderText('no question about it')).toBeInTheDocument()
  })

  test('should render a success TextAreaField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextAreaField
        id="darts"
        name="darts"
        label="master of darts"
        tooltip="the dart master"
        success="undoubtedly"
      />
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should render a warning TextAreaField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextAreaField
        id="darts"
        name="darts"
        label="master of darts"
        tooltip="the dart master"
        warning="undoubtedly"
      />
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should render an error TextAreaField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <TextAreaField
        id="darts"
        name="darts"
        label="master of darts"
        tooltip="the dart master"
        error="undoubtedly"
      />
    )

    expect(getByLabelText('master of darts').getAttribute('aria-describedby')).toContain(
      getByText('undoubtedly').id
    )
  })

  test('should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <TextAreaField label="F" name="1st" data-testid="first" />
        <TextAreaField name="def" label="D" data-testid="default" mb={2} />
        <TextAreaField name="over" label="O" data-testid="override" mt={1} />
      </>
    )

    const blank = { marginTop: '', marginRight: '', marginBottom: '', marginLeft: '' }
    expect(getByTestId('first').parentElement?.parentElement).toHaveStyle(blank)
    expect(getByTestId('default').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '16px',
      marginBottom: '4px',
    })
    expect(getByTestId('override').parentElement?.parentElement).toHaveStyle({
      ...blank,
      marginTop: '2px',
    })
  })

  test('should support flex item props', () => {
    const { container } = renderWithTheme(
      <TextAreaField
        id="missing"
        name="missing"
        label="missing a comma"
        tooltip="you are missing a comma, sir"
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

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    const { getByLabelText } = renderWithTheme(
      <TextAreaField name="with-ref" label="Arreff Them!" defaultValue="something" ref={ref} />
    )
    expect(getByLabelText('Arreff Them!')).toBe(ref.current)
    expect(ref.current).toHaveValue('something')
  })

  test('should trigger onChange handler', () => {
    const onChange = jest.fn()
    const { getByPlaceholderText } = renderWithTheme(
      <TextAreaField
        id="throat"
        name="punch"
        label="throat punch"
        tooltip="throat punch cancer"
        placeholder="punch some throats"
        onChange={onChange}
      />
    )

    userEvent.type(getByPlaceholderText('punch some throats'), 'miss you buddy')
    expect(onChange).toHaveBeenCalled()
  })
})
