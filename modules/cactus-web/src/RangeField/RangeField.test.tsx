import * as React from 'react'

import renderWithTheme from '../../tests/helpers/renderWithTheme'
import { RangeField } from '../'

describe('component: RangeField', () => {
  test('should render a disabled RangeField', () => {
    const { getByLabelText } = renderWithTheme(
      <RangeField
        id="trick"
        name="trick"
        label="Come on, type something"
        tooltip="Sike!"
        disabled
      />
    )

    expect(getByLabelText('Come on, type something')).toBeDisabled()
  })

  test('should render a success RangeField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <RangeField
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

  test('should render a warning RangeField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <RangeField id="warn" name="warn" label="Do it again" warning="Really? That's all you got?" />
    )

    expect(getByLabelText('Do it again').getAttribute('aria-describedby')).toContain(
      getByText(`Really? That's all you got?`).id
    )
  })

  test('should render an error RangeField', () => {
    const { getByText, getByLabelText } = renderWithTheme(
      <RangeField id="error" name="error" label="Try again" error="That's it, we're done here" />
    )

    expect(getByLabelText('Try again').getAttribute('aria-describedby')).toContain(
      getByText(`That's it, we're done here`).id
    )
  })

  test('should support margin space props', () => {
    const { getByTestId } = renderWithTheme(
      <>
        <RangeField label="F" name="1st" data-testid="first" />
        <RangeField name="def" label="D" data-testid="default" mb={2} />
        <RangeField name="over" label="O" data-testid="override" mt={1} />
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
      <RangeField
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

  test('should support ref prop', () => {
    const ref = React.createRef<HTMLInputElement>()
    const { getByLabelText } = renderWithTheme(
      <RangeField defaultValue="42" name="reflected" label="Referred" ref={ref} />
    )
    expect(getByLabelText('Referred')).toBe(ref.current)
    expect(ref.current).toHaveValue('42')
  })
})
